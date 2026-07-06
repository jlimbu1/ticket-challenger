#!/bin/bash
# ──────────────────────────────────────────────────────────
# TicketChallenger — GCP e2-micro + Dokploy Setup
# Run on a fresh Ubuntu 24.04 VM
# Dokploy becomes your multi-project deployment platform
# ──────────────────────────────────────────────────────────
set -e

echo ""
echo "=============================================="
echo " GCP e2-micro + Dokploy Setup"
echo "=============================================="
echo ""

# ── 1. System Updates ──
echo "[1/6] Updating system packages..."
sudo apt update && sudo apt upgrade -y

# ── 2. Add swap (e2-micro has 1 GB RAM — builds WILL OOM without) ──
echo "[2/6] Adding 2 GB swap..."
if [ ! -f /swapfile ]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi
free -h | grep -i swap

# ── 3. Install Docker ──
echo "[3/6] Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sudo bash
  sudo usermod -aG docker $USER
fi
docker --version

# ── 4. Install Dokploy ──
echo "[4/6] Installing Dokploy..."
if ! command -v dokploy &> /dev/null; then
  curl -sSL https://dokploy.com/install.sh | sudo bash
fi

# Wait for Dokploy to start
echo "Waiting for Dokploy to start (takes ~30s)..."
sleep 5
for i in {1..30}; do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "Dokploy is up!"
    break
  fi
  sleep 2
done

# ── 5. Configure firewall ──
echo "[5/6] Configuring firewall..."
# Dokploy web UI runs on port 3000
# Traefik handles port 80 (and 443 if TLS enabled)
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 3000/tcp
sudo ufw --force enable
sudo ufw status verbose

# ── 6. Clone repo ──
echo "[6/6] Cloning TicketChallenger repo..."
cd $HOME
if [ -d ticket-challenger ]; then
  cd ticket-challenger && git pull origin main
else
  git clone https://github.com/jlimbu1/ticket-challenger.git
fi

# ── Done ──
VM_IP=$(curl -s ifconfig.me)

echo ""
echo "=============================================="
echo " Setup Complete!"
echo "=============================================="
echo ""
echo " VM External IP:  $VM_IP"
echo " Dokploy UI:      http://$VM_IP:3000"
echo ""
echo " ── NEXT STEPS ──"
echo ""
echo " 1. Open Dokploy in your browser and create an account"
echo "    http://$VM_IP:3000"
echo ""
echo " 2. In Dokploy, go to:"
echo "    Projects → Create Project → Name: 'ticket-challenger'"
echo ""
echo " 3. Inside the project, click 'Create Service' → 'Compose'"
echo "    - Name: 'ticketing'"
echo "    - Source type: 'Git'"
echo "    - Repository URL: https://github.com/jlimbu1/ticket-challenger.git"
echo "    - Branch: main"
echo "    - Compose path: ./docker-compose.yml"
echo "    - Click 'Deploy'"
echo ""
echo " 4. Set Cloudflare DNS A record:"
echo "    Name: ticketing"
echo "    Type: A"
echo "    Target: $VM_IP"
echo "    Proxy: ON (orange cloud)"
echo ""
echo " 5. Cloudflare SSL/TLS → Set to 'Flexible'"
echo "    (Cloudflare handles HTTPS, Dokploy's Traefik gets plain HTTP)"
echo ""
echo " 6. For future projects:"
echo "    - Create new Project in Dokploy"
echo "    - Point your repo (needs a docker-compose.yml)"
echo "    - Add Cloudflare DNS A record → same VM IP"
echo "    - Traefik routes by domain automatically"
echo ""
echo " Dokploy also supports:"
echo "   • GitHub auto-deploy on push (set up in service settings)"
echo "   • Environment variable management"
echo "   • Logs viewer"
echo "   • Resource monitoring per container"
echo "   • One-click app templates (Postgres, Redis, etc)"
echo ""
