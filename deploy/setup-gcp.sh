#!/bin/bash
# ──────────────────────────────────────────────
# TicketChallenger — Google Cloud e2-micro Setup
# Run on your GCP Ubuntu VM after SSHing in
# ──────────────────────────────────────────────
set -e

echo "=== TicketChallenger Deployment (GCP) ==="

# ── 1. System Updates ──
echo "[1/7] Installing system packages..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git curl

# ── 2. Add swap (e2-micro has only 1 GB RAM - npm build needs it) ──
echo "[2/7] Adding 2 GB swap..."
if [ ! -f /swapfile ]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# ── 3. Install Node.js 20 LTS ──
echo "[3/7] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v && npm -v

# ── 4. Install PM2 globally ──
echo "[4/7] Installing PM2..."
sudo npm install -g pm2
pm2 startup systemd -u $USER --hp $HOME

# ── 5. Clone repo ──
echo "[5/7] Cloning repository..."
cd $HOME
if [ -d ticket-challenger ]; then
    cd ticket-challenger && git pull origin main
else
    git clone https://github.com/jlimbu1/ticket-challenger.git
    cd ticket-challenger
fi

# ── 6. Install dependencies & build frontend ──
echo "[6/7] Installing dependencies and building frontend..."
npm install
npm run build

cd TicketChallengerServer
npm install

# ── 7. Configure Nginx ──
echo "[7/7] Configuring Nginx..."
cd $HOME/ticket-challenger
sudo cp deploy/nginx-ticketing.conf /etc/nginx/sites-available/ticketing
sudo ln -sf /etc/nginx/sites-available/ticketing /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# ── 8. Start backend with PM2 ──
echo "Starting backend..."
cd $HOME/ticket-challenger/TicketChallengerServer
pm2 delete ticketchallenger-backend 2>/dev/null || true
pm2 start ecosystem.config.json
pm2 save

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Set Cloudflare DNS A record: ticketing.jimmycorp.org → <VM external IP>"
echo "  2. In Cloudflare SSL/TLS, set mode to 'Full' (NOT 'Flexible')"
echo "  3. Verify: curl http://ticketing.jimmycorp.org/"
echo ""
echo "VM External IP: $(curl -s ifconfig.me)"
echo "You'll need to configure Certbot for HTTPS or use Cloudflare's edge cert"
