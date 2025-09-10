# 🚀 VPS Deployment Guide - Portfolio with Docker

This guide will help you deploy your portfolio application on a VPS using Docker, Nginx, and SSL certificates.

## 📋 Prerequisites

- VPS with Ubuntu 20.04+ (recommended)
- Domain name pointing to your VPS IP
- SSH access to your VPS
- Basic knowledge of Linux commands

## 🔧 VPS Setup

### 1. Initial VPS Configuration

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git nano htop ufw fail2ban

# Configure firewall
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable

# Configure fail2ban for SSH protection
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 2. Create Deployment User

```bash
# Create a dedicated user for deployment
sudo adduser portfolio
sudo usermod -aG sudo portfolio
sudo usermod -aG docker portfolio

# Switch to the new user
su - portfolio
```

## 🐳 Docker Installation

### Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Log out and back in for group changes
exit
# SSH back in
```

## 📁 Project Deployment

### 1. Clone/Upload Project

```bash
# Create project directory
mkdir -p /opt/portfolio
cd /opt/portfolio

# If using Git
git clone <your-repo-url> .

# Or upload files via SCP/SFTP
```

### 2. Configure Environment Variables

```bash
# Copy the production environment template
cp env.production.example .env.production

# Edit with your values
nano .env.production
```

**Critical Environment Variables to Update:**

```env
# Admin Authentication (CHANGE THESE!)
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD_HASH=$2a$12$your-generated-hash-here
JWT_SECRET=your-32-character-random-secret

# Database (CHANGE THESE!)
POSTGRES_PASSWORD=your-strong-database-password
UMAMI_HASH_SALT=your-umami-hash-salt
UMAMI_JWT_SECRET=your-umami-jwt-secret
UMAMI_APP_SECRET=your-umami-app-secret

# Domain Configuration
NEXT_PUBLIC_UMAMI_BASE_URL=https://your-domain.com/analytics
NEXT_PUBLIC_UMAMI_API_URL=https://your-domain.com/analytics/api
NEXT_PUBLIC_UMAMI_TRACKING_SCRIPT_URL=https://your-domain.com/analytics/umami.js
```

### 3. Generate Secure Secrets

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Password Hash
node -e "console.log(require('bcryptjs').hashSync('your-strong-password', 12))"

# Generate Umami Secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🔒 SSL Certificate Setup

### 1. Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Generate SSL Certificates

```bash
# Stop any services using port 80
sudo systemctl stop nginx

# Generate certificates
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Copy certificates to project
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
sudo chown portfolio:portfolio ssl/*.pem
```

### 3. Update Nginx Configuration

```bash
# Update domain in nginx.conf
sed -i 's/your-domain.com/your-actual-domain.com/g' nginx.conf
```

## 🚀 Deploy Application

### 1. Build and Start Services

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 2. Verify Deployment

```bash
# Check if services are running
curl -I https://your-domain.com
curl -I https://your-domain.com/analytics
curl -I https://your-domain.com/admin
```

## 🔄 Automation & Maintenance

### 1. Auto-start on Boot

```bash
# Create systemd service
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

# Enable auto-start
sudo systemctl enable portfolio.service
```

### 2. SSL Certificate Auto-renewal

```bash
# Add to crontab
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook 'cd /opt/portfolio && docker-compose -f docker-compose.prod.yml restart nginx'") | crontab -
```

### 3. Log Rotation

```bash
# Create logrotate configuration
sudo tee /etc/logrotate.d/portfolio > /dev/null <<EOF
/opt/portfolio/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 portfolio portfolio
    postrotate
        cd /opt/portfolio && docker-compose -f docker-compose.prod.yml restart nginx
    endscript
}
EOF
```

## 📊 Monitoring & Maintenance

### Useful Commands

```bash
# View service logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Update application
git pull
docker-compose -f docker-compose.prod.yml up -d --build

# Check resource usage
docker stats

# Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U umami umami > backup.sql

# Restore database
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U umami umami < backup.sql
```

### Health Checks

```bash
# Check application health
curl -f https://your-domain.com/api/health

# Check database connection
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U umami

# Check Umami analytics
curl -f https://your-domain.com/analytics/api/health
```

## 🔒 Security Checklist

- [ ] Changed all default passwords
- [ ] Generated strong JWT secrets
- [ ] Configured firewall (UFW)
- [ ] Enabled fail2ban
- [ ] Set up SSL certificates
- [ ] Configured security headers
- [ ] Set up log monitoring
- [ ] Enabled automatic updates
- [ ] Configured backup strategy
- [ ] Set up monitoring alerts

## 🆘 Troubleshooting

### Common Issues

1. **Services won't start:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs
   ```

2. **SSL certificate issues:**
   ```bash
   sudo certbot renew --dry-run
   ```

3. **Database connection issues:**
   ```bash
   docker-compose -f docker-compose.prod.yml exec postgres psql -U umami -d umami
   ```

4. **Port conflicts:**
   ```bash
   sudo netstat -tulpn | grep :80
   sudo netstat -tulpn | grep :443
   ```

### Performance Optimization

1. **Enable Docker BuildKit:**
   ```bash
   export DOCKER_BUILDKIT=1
   ```

2. **Optimize Nginx:**
   - Adjust worker processes in nginx.conf
   - Enable gzip compression
   - Configure caching headers

3. **Database Optimization:**
   - Tune PostgreSQL settings
   - Set up connection pooling
   - Configure backup schedules

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verify environment variables
3. Check SSL certificate validity
4. Ensure all ports are accessible
5. Review firewall settings

---

**Last Updated:** $(date)
**Version:** 1.0.0
