#!/bin/bash
# ──────────────────────────────────────────────
# TicketChallenger — Oracle Cloud Free Tier Setup
# Run this on your Oracle Ubuntu VM (ubuntu@<VM_IP>)
# ──────────────────────────────────────────────
set -e

echo "=== TicketChallenger Deployment Setup ==="

# ── 1. System Updates & Dependencies ──
echo "[1/7] Installing system packages..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git curl ufw

# ── 2. Install Node.js 20 LTS ──
echo "[2/7] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v && npm -v

# ── 3. Install PM2 globally ──
echo "[3/7] Installing PM2..."
sudo npm install -g pm2
pm2 startup systemd -u ubuntu --hp /home/ubuntu

# ── 4. Clone repo ──
echo "[4/7] Cloning repository..."
cd /home/ubuntu
if [ -d ticket-challenger ]; then
    cd ticket-challenger && git pull origin main
else
    git clone https://github.com/jlimbu1/ticket-challenger.git
    cd ticket-challenger
fi

# ── 5. Install dependencies & build frontend ──
echo "[5/7] Installing dependencies and building frontend..."
npm install
npm run build

cd TicketChallengerServer
npm install

# ── 6. Configure Nginx ──
echo "[6/7] Configuring Nginx..."
sudo cp /home/ubuntu/ticket-challenger/deploy/nginx-ticketing.conf /etc/nginx/sites-available/ticketing
sudo ln -sf /etc/nginx/sites-available/ticketing /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test config and reload
sudo nginx -t && sudo systemctl reload nginx

# ── 7. Configure Firewall ──
echo "[7/7] Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status

# ── 8. Start backend with PM2 ──
echo "Starting backend with PM2..."
cd /home/ubuntu/ticket-challenger/TicketChallengerServer
pm2 delete ticketchallenger-backend 2>/dev/null || true
pm2 start ecosystem.config.json
pm2 save

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Set Cloudflare DNS A record: ticketing.jimmycorp.org → <VM public IP>"
echo "  2. In Cloudflare SSL/TLS, set mode to 'Full' or 'Full (strict)'"
echo "  3. Verify: curl http://ticketing.jimmycorp.org/health"
echo ""
echo "VM Public IP: $(curl -s ifconfig.me)"
