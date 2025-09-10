#!/bin/bash

# ===========================================
# VPS DEPLOYMENT SCRIPT FOR PORTFOLIO
# ===========================================
# This script automates the deployment process on your VPS

set -e  # Exit on any error

echo "🚀 Starting Portfolio Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN=${1:-"your-domain.com"}
EMAIL=${2:-"your-email@example.com"}

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo ""

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Use a regular user with sudo privileges."
    exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    print_status "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_warning "Please log out and log back in for Docker group changes to take effect."
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    print_status "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Install Certbot for SSL certificates
if ! command -v certbot &> /dev/null; then
    print_status "Installing Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
fi

# Create project directory
PROJECT_DIR="/opt/portfolio"
print_status "Setting up project directory at $PROJECT_DIR..."
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# Copy project files (assuming you're running this from the project directory)
print_status "Copying project files..."
cp -r . $PROJECT_DIR/
cd $PROJECT_DIR

# Create SSL directory
mkdir -p ssl

# Generate SSL certificates with Let's Encrypt
print_status "Generating SSL certificates..."
sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Copy certificates to project directory
print_status "Copying SSL certificates..."
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*.pem

# Update nginx configuration with your domain
print_status "Updating nginx configuration..."
sed -i "s/your-domain.com/$DOMAIN/g" nginx.conf

# Create production environment file
print_status "Creating production environment file..."
if [ ! -f .env.production ]; then
    cp env.production.example .env.production
    print_warning "Please edit .env.production with your actual values before continuing!"
    print_warning "Run: nano .env.production"
    read -p "Press Enter after you've updated the environment variables..."
fi

# Build and start services
print_status "Building and starting services..."
docker-compose -f docker-compose.prod.yml down --remove-orphans
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."
sleep 30

# Check service status
print_status "Checking service status..."
docker-compose -f docker-compose.prod.yml ps

# Set up automatic SSL renewal
print_status "Setting up automatic SSL renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook 'cd $PROJECT_DIR && docker-compose -f docker-compose.prod.yml restart nginx'") | crontab -

# Set up log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/portfolio > /dev/null <<EOF
$PROJECT_DIR/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        cd $PROJECT_DIR && docker-compose -f docker-compose.prod.yml restart nginx
    endscript
}
EOF

# Create systemd service for auto-start
print_status "Creating systemd service..."
sudo tee /etc/systemd/system/portfolio.service > /dev/null <<EOF
[Unit]
Description=Portfolio Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable portfolio.service

# Final status check
print_status "Performing final status check..."
sleep 10

if curl -f -s https://$DOMAIN > /dev/null; then
    print_status "✅ Portfolio is successfully deployed and accessible at https://$DOMAIN"
    print_status "✅ Umami Analytics is accessible at https://$DOMAIN/analytics"
    print_status "✅ Admin Dashboard is accessible at https://$DOMAIN/admin"
else
    print_error "❌ Portfolio is not accessible. Please check the logs:"
    print_error "docker-compose -f docker-compose.prod.yml logs"
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo ""
echo -e "${BLUE}📋 Useful Commands:${NC}"
echo "View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "Restart services: docker-compose -f docker-compose.prod.yml restart"
echo "Stop services: docker-compose -f docker-compose.prod.yml down"
echo "Update application: git pull && docker-compose -f docker-compose.prod.yml up -d --build"
echo ""
echo -e "${YELLOW}🔒 Security Reminders:${NC}"
echo "1. Change all default passwords in .env.production"
echo "2. Set up firewall rules (ufw allow 22,80,443)"
echo "3. Enable fail2ban for SSH protection"
echo "4. Regularly update system packages"
echo "5. Monitor application logs for suspicious activity"
