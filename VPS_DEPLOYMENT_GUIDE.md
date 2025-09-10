# 🚀 Complete VPS Deployment Guide - Ubuntu Server

**For: Portfolio Application with Docker, Nginx, and SSL**

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] Your VPS IP: `51.83.68.116`
- [ ] VPS Username: `ubuntu`
- [ ] VPS Password: `[your-password]`
- [ ] Your domain name (optional for now)
- [ ] Windows computer with PowerShell
- [ ] Basic understanding of copy-paste commands

---

## 🎯 **PHASE 1: Upload Project to VPS**

### Step 1.1: Prepare Your Local Project

**On your Windows computer, open PowerShell as Administrator and run:**

```powershell
# Navigate to your project directory
cd "C:\Users\anesf\OneDrive\Desktop\my project\anes"

# Create a deployment package (excludes unnecessary files)
Compress-Archive -Path "components", "data", "libs", "pages", "public", "styles", "utils", "*.json", "*.js", "*.mjs", "*.ts", "*.tsx", "*.md", "Dockerfile", "docker-compose.prod.yml", "nginx.conf", ".dockerignore", ".env.production" -DestinationPath "portfolio-deployment.zip" -Force

# Verify the zip was created
Get-ChildItem "portfolio-deployment.zip"
```

### Step 1.2: Upload to VPS using SCP

```powershell
# Upload the project to your VPS
scp -o StrictHostKeyChecking=no "portfolio-deployment.zip" ubuntu@51.83.68.116:/home/ubuntu/

# You'll be prompted for your VPS password - enter it when asked
```

---

## 🎯 **PHASE 2: Initial VPS Setup**

### Step 2.1: Connect to Your VPS

```bash
# Connect to your VPS via SSH
ssh ubuntu@51.83.68.116

# When prompted, enter your VPS password
```

### Step 2.2: Update System and Install Dependencies

```bash
# Update the system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip htop ufw fail2ban

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Certbot for SSL certificates
sudo apt install -y certbot python3-certbot-nginx

# Log out and back in to apply Docker group changes
exit
```

### Step 2.3: Reconnect and Setup Project

```bash
# Reconnect to VPS
ssh ubuntu@51.83.68.116

# Create project directory
sudo mkdir -p /opt/portfolio
sudo chown ubuntu:ubuntu /opt/portfolio
cd /opt/portfolio

# Extract your project
unzip /home/ubuntu/portfolio-deployment.zip

# Clean up
rm /home/ubuntu/portfolio-deployment.zip
```

---

## 🎯 **PHASE 3: Configure Environment and Docker**

### Step 3.1: Update Environment for VPS IP

```bash
# Update the .env.production file with VPS IP
sed -i 's/your-domain.com/51.83.68.116/g' .env.production

# Create SSL directory
mkdir -p ssl

# Set proper permissions
chmod 600 .env.production
```

### Step 3.2: Update Nginx Configuration for VPS IP

```bash
# Update nginx.conf to work with VPS IP initially
sed -i 's/your-domain.com/51.83.68.116/g' nginx.conf
```

---

## 🎯 **PHASE 4: Build and Run Docker Containers**

### Step 4.1: Build Docker Images

```bash
# Build all Docker images
docker-compose -f docker-compose.prod.yml build --no-cache

# Check if images were built successfully
docker images
```

### Step 4.2: Start All Services

```bash
# Start all services in detached mode
docker-compose -f docker-compose.prod.yml up -d

# Check if all containers are running
docker-compose -f docker-compose.prod.yml ps

# View logs to ensure everything started correctly
docker-compose -f docker-compose.prod.yml logs -f
```

**Expected output:** You should see 4 containers running:
- `portfolio-app` (your Next.js app)
- `umami-app` (analytics)
- `umami-postgres` (database)
- `nginx-proxy` (reverse proxy)

---

## 🎯 **PHASE 5: Configure Nginx and Test**

### Step 5.1: Test Without SSL First

```bash
# Test if your app is accessible via HTTP
curl -I http://51.83.68.116

# Test admin access
curl -I http://51.83.68.116/admin

# Test analytics
curl -I http://51.83.68.116/analytics
```

### Step 5.2: Configure Firewall

```bash
# Configure UFW firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable

# Check firewall status
sudo ufw status
```

---

## 🎯 **PHASE 6: Setup SSL with Let's Encrypt (When Domain is Ready)**

### Step 6.1: Prepare for Domain (Run when your domain points to VPS)

```bash
# Replace 'yourdomain.com' with your actual domain
DOMAIN="yourdomain.com"

# Update nginx.conf with your domain
sed -i "s/51.83.68.116/$DOMAIN/g" nginx.conf

# Update .env.production with your domain
sed -i "s/51.83.68.116/$DOMAIN/g" .env.production

# Restart services to apply changes
docker-compose -f docker-compose.prod.yml restart
```

### Step 6.2: Generate SSL Certificates

```bash
# Stop nginx temporarily for certificate generation
docker-compose -f docker-compose.prod.yml stop nginx

# Generate SSL certificates
sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --email your-email@example.com --agree-tos --non-interactive

# Copy certificates to project directory
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
sudo chown ubuntu:ubuntu ssl/*.pem

# Restart nginx with SSL
docker-compose -f docker-compose.prod.yml up -d nginx
```

### Step 6.3: Setup Auto-Renewal

```bash
# Add automatic SSL renewal to crontab
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook 'cd /opt/portfolio && docker-compose -f docker-compose.prod.yml restart nginx'") | crontab -

# Test renewal
sudo certbot renew --dry-run
```

---

## 🎯 **PHASE 7: Security Hardening**

### Step 7.1: Configure Fail2Ban

```bash
# Create fail2ban configuration for SSH
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

# Start and enable fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check fail2ban status
sudo fail2ban-client status
```

### Step 7.2: Setup Log Rotation

```bash
# Create log rotation configuration
sudo tee /etc/logrotate.d/portfolio > /dev/null <<EOF
/opt/portfolio/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        cd /opt/portfolio && docker-compose -f docker-compose.prod.yml restart nginx
    endscript
}
EOF
```

### Step 7.3: Create Systemd Service for Auto-Start

```bash
# Create systemd service for automatic startup
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

# Enable the service
sudo systemctl enable portfolio.service
```

---

## 🎯 **PHASE 8: Final Testing and Verification**

### Step 8.1: Test All Services

```bash
# Test portfolio website
curl -I http://51.83.68.116

# Test admin dashboard
curl -I http://51.83.68.116/admin

# Test analytics
curl -I http://51.83.68.116/analytics

# Check all containers are healthy
docker-compose -f docker-compose.prod.yml ps

# Check resource usage
docker stats --no-stream
```

### Step 8.2: Create Health Check Script

```bash
# Create a health check script
tee health-check.sh > /dev/null <<EOF
#!/bin/bash
echo "🔍 Portfolio Health Check"
echo "========================"

# Check if containers are running
echo "📦 Container Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🌐 Service Tests:"
curl -s -o /dev/null -w "Portfolio: %{http_code}\n" http://51.83.68.116
curl -s -o /dev/null -w "Admin: %{http_code}\n" http://51.83.68.116/admin
curl -s -o /dev/null -w "Analytics: %{http_code}\n" http://51.83.68.116/analytics

echo ""
echo "💾 Disk Usage:"
df -h /opt/portfolio

echo ""
echo "🔒 SSL Certificate Status:"
if [ -f "ssl/cert.pem" ]; then
    openssl x509 -in ssl/cert.pem -text -noout | grep "Not After"
else
    echo "No SSL certificate found (HTTP only)"
fi
EOF

chmod +x health-check.sh

# Run the health check
./health-check.sh
```

---

## 📋 **COMPLETE COMMAND SEQUENCE (Copy-Paste Ready)**

### **On Your Windows Computer (PowerShell):**

```powershell
# 1. Navigate to project and create deployment package
cd "C:\Users\anesf\OneDrive\Desktop\my project\anes"
Compress-Archive -Path "components", "data", "libs", "pages", "public", "styles", "utils", "*.json", "*.js", "*.mjs", "*.ts", "*.tsx", "*.md", "Dockerfile", "docker-compose.prod.yml", "nginx.conf", ".dockerignore", ".env.production" -DestinationPath "portfolio-deployment.zip" -Force

# 2. Upload to VPS
scp -o StrictHostKeyChecking=no "portfolio-deployment.zip" ubuntu@51.83.68.116:/home/ubuntu/
```

### **On Your VPS (SSH Terminal):**

```bash
# 3. Connect to VPS
ssh ubuntu@51.83.68.116

# 4. Update system and install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip htop ufw fail2ban
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo apt install -y certbot python3-certbot-nginx
exit

# 5. Reconnect and setup project
ssh ubuntu@51.83.68.116
sudo mkdir -p /opt/portfolio
sudo chown ubuntu:ubuntu /opt/portfolio
cd /opt/portfolio
unzip /home/ubuntu/portfolio-deployment.zip
rm /home/ubuntu/portfolio-deployment.zip

# 6. Configure environment
sed -i 's/your-domain.com/51.83.68.116/g' .env.production
mkdir -p ssl
chmod 600 .env.production
sed -i 's/your-domain.com/51.83.68.116/g' nginx.conf

# 7. Build and start Docker containers
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml ps

# 8. Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 9. Test services
curl -I http://51.83.68.116
curl -I http://51.83.68.116/admin
curl -I http://51.83.68.116/analytics

# 10. Setup security
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

# 11. Setup auto-start
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

# 12. Create health check
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

## 🎉 **Deployment Complete!**

### **Your Application is Now Live At:**
- **Portfolio:** http://51.83.68.116
- **Admin Dashboard:** http://51.83.68.116/admin
- **Analytics:** http://51.83.68.116/analytics

### **Admin Credentials:**
- **Username:** `admin`
- **Password:** `AnesFlah2024!@#`

### **Analytics Credentials:**
- **Username:** `admin`
- **Password:** `UmamiAdmin2024!@#`

---

## 🔄 **When Your Domain is Ready (SSL Setup):**

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

## 🛠️ **Useful Commands for Maintenance:**

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Update application
git pull
docker-compose -f docker-compose.prod.yml up -d --build

# Check resource usage
docker stats

# Run health check
./health-check.sh

# Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U umami umami > backup.sql
```

---

**🎯 You're all set! Your portfolio is now live and secure on your VPS!**
