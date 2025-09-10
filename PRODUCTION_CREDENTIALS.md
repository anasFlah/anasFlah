# 🔐 Production Credentials Reference

**⚠️ KEEP THIS FILE SECURE - DO NOT COMMIT TO VERSION CONTROL**

## 🔑 **Admin Dashboard Access**

- **URL:** `https://your-domain.com/admin`
- **Username:** `admin`
- **Password:** `AnesFlah2024!@#`

## 📊 **Umami Analytics Access**

- **URL:** `https://your-domain.com/analytics`
- **Username:** `admin`
- **Password:** `UmamiAdmin2024!@#`

## 🗄️ **Database Access**

- **Host:** `localhost` (or your VPS IP)
- **Port:** `5432`
- **Database:** `umami`
- **Username:** `umami`
- **Password:** `PostgresSecure2024!@#`

## 🔒 **Generated Secrets**

### **JWT Secret (32 characters)**
```
500f3009096075671257c5c43c753b0537712329c1c43aad8f8d32f1b182dd0e
```

### **Umami Hash Salt (32 characters)**
```
ea929ae59ce181f1db31fb91bae0fb07e4361fcae2b25df5b9dcfaffe45ee4e6
```

### **Umami JWT Secret (32 characters)**
```
fabbd17cd854ae6f05e1d2969955761816d9a07201d5da15d7747f5d6ebcb471
```

### **Umami App Secret (32 characters)**
```
26234f6a43c00269e06da8404cfa943b8ae02850e82f41e2624c6d8cb6d85fb4
```

## 🚀 **Deployment Checklist**

### **Before Deployment:**
- [ ] Update domain URLs in `.env.production`
- [ ] Upload SSL certificates to `ssl/` directory
- [ ] Configure firewall (ports 22, 80, 443)
- [ ] Set up fail2ban

### **After Deployment:**
- [ ] Test admin login at `/admin`
- [ ] Test analytics at `/analytics`
- [ ] Verify SSL certificates
- [ ] Check security headers
- [ ] Monitor logs

## 🔄 **Quick Commands**

```bash
# Deploy application
npm run docker:up

# View logs
npm run docker:logs

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Check status
docker-compose -f docker-compose.prod.yml ps
```

## 🆘 **Emergency Access**

If you lose access to the admin dashboard:

1. **SSH into your VPS**
2. **Access the database directly:**
   ```bash
   docker-compose -f docker-compose.prod.yml exec postgres psql -U umami -d umami
   ```
3. **Reset admin password:**
   ```bash
   # Generate new hash
   node -e "console.log(require('bcryptjs').hashSync('new-password', 12))"
   ```
4. **Update .env.production with new hash**
5. **Restart services:**
   ```bash
   docker-compose -f docker-compose.prod.yml restart
   ```

---

**⚠️ SECURITY REMINDER:** Delete this file after deployment or keep it in a secure location. Never commit credentials to version control!
