# 🚀 Copy-Paste Deployment Commands

**Follow these commands in order. Copy and paste each section one by one.**

---

## 📱 **STEP 1: On Your Windows Computer (PowerShell)**

```powershell
# Navigate to your project
cd "C:\Users\anesf\OneDrive\Desktop\my project\anes"

# Create deployment package
Compress-Archive -Path "components", "data", "libs", "pages", "public", "styles", "utils", "*.json", "*.js", "*.mjs", "*.ts", "*.tsx", "*.md", "Dockerfile", "docker-compose.prod.yml", "nginx.conf", ".dockerignore", ".env.production" -DestinationPath "portfolio-deployment.zip" -Force

# Upload to VPS
scp -o StrictHostKeyChecking=no "portfolio-deployment.zip" ubuntu@51.83.68.116:/home/ubuntu/
```

---

## 🖥️ **STEP 2: Connect to Your VPS**

```bash
ssh ubuntu@51.83.68.116
```

---

## 🔧 **STEP 3: Update System and Install Docker**

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip htop ufw fail2ban
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo apt install -y certbot python3-certbot-nginx
exit
```

---

## 🔄 **STEP 4: Reconnect and Setup Project**

```bash
ssh ubuntu@51.83.68.116
sudo mkdir -p /opt/portfolio
sudo chown ubuntu:ubuntu /opt/portfolio
cd /opt/portfolio
unzip /home/ubuntu/portfolio-deployment.zip
rm /home/ubuntu/portfolio-deployment.zip
```

---

## ⚙️ **STEP 5: Configure Environment**

```bash
sed -i 's/your-domain.com/51.83.68.116/g' .env.production
mkdir -p ssl
chmod 600 .env.production
sed -i 's/your-domain.com/51.83.68.116/g' nginx.conf
```

---

## 🐳 **STEP 6: Build and Start Docker**

```bash
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml ps
```

---

## 🔥 **STEP 7: Configure Firewall**

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

---

## 🧪 **STEP 8: Test Your Application**

```bash
curl -I http://51.83.68.116
curl -I http://51.83.68.116/admin
curl -I http://51.83.68.116/analytics
```

---

## 🛡️ **STEP 9: Setup Security**

```bash
sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 🔄 **STEP 10: Setup Auto-Start**

```bash
sudo tee /etc/systemd/system/portfolio.service > /dev/null <<EOF
[Unit]
Description=Portfolio Application
Requires=docker.service
After=docker.service
[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/portfolio
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0
[Install]
WantedBy=multi-user.target
EOF
sudo systemctl enable portfolio.service
```

---

## ✅ **STEP 11: Final Health Check**

```bash
tee health-check.sh > /dev/null <<EOF
#!/bin/bash
echo "🔍 Portfolio Health Check"
echo "========================"
echo "📦 Container Status:"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "🌐 Service Tests:"
curl -s -o /dev/null -w "Portfolio: %{http_code}\n" http://51.83.68.116
curl -s -o /dev/null -w "Admin: %{http_code}\n" http://51.83.68.116/admin
curl -s -o /dev/null -w "Analytics: %{http_code}\n" http://51.83.68.116/analytics
EOF
chmod +x health-check.sh
./health-check.sh
```

---

## 🎉 **DEPLOYMENT COMPLETE!**

### **Your Application is Live:**
- **Portfolio:** http://51.83.68.116
- **Admin:** http://51.83.68.116/admin (Username: `admin`, Password: `AnesFlah2024!@#`)
- **Analytics:** http://51.83.68.116/analytics (Username: `admin`, Password: `UmamiAdmin2024!@#`)

---

## 🔒 **When Your Domain is Ready (SSL Setup):**

```bash
# Replace 'yourdomain.com' with your actual domain
DOMAIN="yourdomain.com"
sed -i "s/51.83.68.116/$DOMAIN/g" nginx.conf
sed -i "s/51.83.68.116/$DOMAIN/g" .env.production
docker-compose -f docker-compose.prod.yml restart
docker-compose -f docker-compose.prod.yml stop nginx
sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --email your-email@example.com --agree-tos --non-interactive
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
sudo chown ubuntu:ubuntu ssl/*.pem
docker-compose -f docker-compose.prod.yml up -d nginx
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook 'cd /opt/portfolio && docker-compose -f docker-compose.prod.yml restart nginx'") | crontab -
```

---

## 🛠️ **Useful Maintenance Commands:**

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Check status
docker-compose -f docker-compose.prod.yml ps

# Run health check
./health-check.sh

# Check resource usage
docker stats
```
