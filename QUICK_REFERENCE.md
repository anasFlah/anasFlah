# 🚀 Quick Reference Card - VPS Deployment

## 📋 **Your VPS Details**
- **IP Address:** `51.83.68.116`
- **Username:** `ubuntu`
- **Project Path:** `/opt/portfolio`

## 🔑 **Login Credentials**

### **Admin Dashboard**
- **URL:** http://51.83.68.116/admin
- **Username:** `admin`
- **Password:** `AnesFlah2024!@#`

### **Analytics Dashboard**
- **URL:** http://51.83.68.116/analytics
- **Username:** `admin`
- **Password:** `UmamiAdmin2024!@#`

## 🛠️ **Essential Commands**

### **Connect to VPS**
```bash
ssh ubuntu@51.83.68.116
```

### **Navigate to Project**
```bash
cd /opt/portfolio
```

### **Check Status**
```bash
docker-compose -f docker-compose.prod.yml ps
```

### **View Logs**
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### **Restart Services**
```bash
docker-compose -f docker-compose.prod.yml restart
```

### **Health Check**
```bash
./health-check.sh
```

## 🔄 **Update Application**

### **Upload New Code**
```powershell
# On Windows (PowerShell)
cd "C:\Users\anesf\OneDrive\Desktop\my project\anes"
Compress-Archive -Path "components", "data", "libs", "pages", "public", "styles", "utils", "*.json", "*.js", "*.mjs", "*.ts", "*.tsx", "*.md", "Dockerfile", "docker-compose.prod.yml", "nginx.conf", ".dockerignore", ".env.production" -DestinationPath "portfolio-update.zip" -Force
scp -o StrictHostKeyChecking=no "portfolio-update.zip" ubuntu@51.83.68.116:/home/ubuntu/
```

### **Deploy Update**
```bash
# On VPS
cd /opt/portfolio
unzip /home/ubuntu/portfolio-update.zip
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
rm /home/ubuntu/portfolio-update.zip
```

## 🔒 **SSL Setup (When Domain is Ready)**

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
```

## 🆘 **Emergency Commands**

### **Complete Restart**
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### **Reset Everything**
```bash
docker-compose -f docker-compose.prod.yml down
docker system prune -a -f
docker volume prune -f
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### **Check Resource Usage**
```bash
docker stats
htop
df -h
free -h
```

## 📊 **Service URLs**

| Service | HTTP URL | HTTPS URL (after SSL) |
|---------|----------|----------------------|
| Portfolio | http://51.83.68.116 | https://yourdomain.com |
| Admin | http://51.83.68.116/admin | https://yourdomain.com/admin |
| Analytics | http://51.83.68.116/analytics | https://yourdomain.com/analytics |

## 🔧 **File Locations**

| File | Location |
|------|----------|
| Project Files | `/opt/portfolio/` |
| Environment Config | `/opt/portfolio/.env.production` |
| Nginx Config | `/opt/portfolio/nginx.conf` |
| SSL Certificates | `/opt/portfolio/ssl/` |
| Docker Compose | `/opt/portfolio/docker-compose.prod.yml` |
| Health Check Script | `/opt/portfolio/health-check.sh` |

## 📞 **Support Information**

### **Log Files**
```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs

# System logs
sudo journalctl -u docker
sudo journalctl -u portfolio
```

### **Configuration Files**
```bash
# View environment variables
cat .env.production

# View nginx configuration
cat nginx.conf

# View docker compose configuration
cat docker-compose.prod.yml
```

---

**💡 Keep this reference handy for quick access to common commands and information!**
