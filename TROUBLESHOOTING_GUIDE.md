# 🆘 Troubleshooting Guide - VPS Deployment

## 🚨 **Common Issues and Solutions**

### **Issue 1: "Permission Denied" when uploading files**

**Problem:** SCP upload fails with permission errors.

**Solution:**
```bash
# On your VPS, ensure proper permissions
sudo chown -R ubuntu:ubuntu /home/ubuntu/
chmod 755 /home/ubuntu/
```

---

### **Issue 2: Docker containers won't start**

**Problem:** Containers fail to start or exit immediately.

**Solution:**
```bash
# Check container logs
docker-compose -f docker-compose.prod.yml logs

# Check if ports are already in use
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
sudo netstat -tulpn | grep :3000

# Kill processes using these ports if needed
sudo fuser -k 80/tcp
sudo fuser -k 443/tcp
sudo fuser -k 3000/tcp

# Restart containers
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

---

### **Issue 3: "Connection Refused" when accessing the website**

**Problem:** Website not accessible via browser.

**Solution:**
```bash
# Check if containers are running
docker-compose -f docker-compose.prod.yml ps

# Check firewall status
sudo ufw status

# Ensure firewall allows HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check if nginx is working
curl -I http://localhost
curl -I http://51.83.68.116
```

---

### **Issue 4: Database connection errors**

**Problem:** PostgreSQL container fails to start or connect.

**Solution:**
```bash
# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Reset database volume if corrupted
docker-compose -f docker-compose.prod.yml down
docker volume rm portfolio_postgres_data
docker-compose -f docker-compose.prod.yml up -d

# Check database connectivity
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U umami
```

---

### **Issue 5: SSL certificate generation fails**

**Problem:** Let's Encrypt certificate generation fails.

**Solution:**
```bash
# Ensure domain points to your VPS
nslookup yourdomain.com

# Check if port 80 is accessible
sudo ufw allow 80/tcp

# Stop nginx before certificate generation
docker-compose -f docker-compose.prod.yml stop nginx

# Generate certificate manually
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
sudo chown ubuntu:ubuntu ssl/*.pem

# Restart nginx
docker-compose -f docker-compose.prod.yml up -d nginx
```

---

### **Issue 6: Admin login not working**

**Problem:** Can't log into admin dashboard.

**Solution:**
```bash
# Check admin API logs
docker-compose -f docker-compose.prod.yml logs portfolio

# Verify environment variables
cat .env.production | grep ADMIN

# Test admin API directly
curl -X POST http://51.83.68.116/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"AnesFlah2024!@#"}'

# Reset admin password if needed
node -e "console.log(require('bcryptjs').hashSync('new-password', 12))"
# Update .env.production with new hash
# Restart containers
docker-compose -f docker-compose.prod.yml restart
```

---

### **Issue 7: High memory/CPU usage**

**Problem:** Server becomes slow or unresponsive.

**Solution:**
```bash
# Check resource usage
docker stats
htop

# Restart containers to free memory
docker-compose -f docker-compose.prod.yml restart

# Check for memory leaks
docker system prune -f
docker volume prune -f

# Monitor logs for errors
docker-compose -f docker-compose.prod.yml logs --tail=100
```

---

### **Issue 8: Files not updating after deployment**

**Problem:** Changes don't appear on the website.

**Solution:**
```bash
# Rebuild containers with new code
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Clear browser cache
# Or test with curl to bypass cache
curl -I http://51.83.68.116
```

---

## 🔍 **Diagnostic Commands**

### **Check System Status:**
```bash
# System information
uname -a
free -h
df -h

# Docker status
docker --version
docker-compose --version
docker ps -a
docker images

# Service status
sudo systemctl status docker
sudo systemctl status fail2ban
sudo ufw status
```

### **Check Application Status:**
```bash
# Container health
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs --tail=50

# Network connectivity
curl -I http://localhost:3000
curl -I http://localhost:80
curl -I http://51.83.68.116

# Database connectivity
docker-compose -f docker-compose.prod.yml exec postgres psql -U umami -d umami -c "SELECT 1;"
```

### **Check Security:**
```bash
# Firewall status
sudo ufw status verbose

# Fail2ban status
sudo fail2ban-client status
sudo fail2ban-client status sshd

# SSL certificate status
openssl x509 -in ssl/cert.pem -text -noout | grep "Not After"
```

---

## 🚑 **Emergency Recovery**

### **Complete Reset:**
```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Remove all containers and volumes
docker system prune -a -f
docker volume prune -f

# Rebuild everything
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### **Backup and Restore:**
```bash
# Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U umami umami > backup.sql

# Backup configuration
tar -czf config-backup.tar.gz .env.production nginx.conf ssl/

# Restore database
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U umami umami < backup.sql
```

---

## 📞 **Getting Help**

### **Log Collection for Support:**
```bash
# Collect all relevant logs
mkdir -p troubleshooting-logs
docker-compose -f docker-compose.prod.yml logs > troubleshooting-logs/docker-logs.txt
sudo journalctl -u docker > troubleshooting-logs/system-logs.txt
sudo ufw status > troubleshooting-logs/firewall-status.txt
sudo fail2ban-client status > troubleshooting-logs/fail2ban-status.txt
docker ps -a > troubleshooting-logs/container-status.txt
docker images > troubleshooting-logs/docker-images.txt

# Create archive
tar -czf troubleshooting-logs.tar.gz troubleshooting-logs/
```

### **Quick Health Check Script:**
```bash
#!/bin/bash
echo "🔍 System Health Check"
echo "====================="
echo "📦 Docker Status:"
docker --version
docker-compose --version
echo ""
echo "🌐 Container Status:"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "💾 Disk Usage:"
df -h
echo ""
echo "🧠 Memory Usage:"
free -h
echo ""
echo "🔥 Firewall Status:"
sudo ufw status
echo ""
echo "🛡️ Fail2ban Status:"
sudo fail2ban-client status
echo ""
echo "🌍 Network Test:"
curl -s -o /dev/null -w "Portfolio: %{http_code}\n" http://51.83.68.116
curl -s -o /dev/null -w "Admin: %{http_code}\n" http://51.83.68.116/admin
curl -s -o /dev/null -w "Analytics: %{http_code}\n" http://51.83.68.116/analytics
```

---

**💡 Pro Tip:** Always run the health check script first when troubleshooting to get a complete picture of your system status!
