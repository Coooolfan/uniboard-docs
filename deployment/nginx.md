# Nginx 反向代理配置

在生产环境中，强烈推荐使用 Nginx 作为反向代理服务器，为 UniBoard 提供 SSL/TLS 加密、反向代理、压缩等功能。

## 为什么使用 Nginx

Nginx 作为反向代理服务器，不仅能够为 UniBoard 提供 SSL/TLS 加密、反向代理、压缩数据流，还能隐藏真实端口、访问控制。

## 安装 Nginx

### Ubuntu/Debian 系统

```bash
# 更新软件包列表
sudo apt update

# 安装 Nginx
sudo apt install nginx

# 启动并启用 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查 Nginx 状态
sudo systemctl status nginx
```

### CentOS/RHEL 系统

```bash
# 安装 EPEL 仓库
sudo yum install epel-release

# 安装 Nginx
sudo yum install nginx

# 启动并启用 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查 Nginx 状态
sudo systemctl status nginx
```

### 验证安装

```bash
# 检查 Nginx 版本
nginx -v

# 测试配置文件语法
sudo nginx -t

# 访问默认页面
curl localhost
```

## 基础配置

### 创建配置文件

在 `/etc/nginx/sites-available/` 目录创建 UniBoard 的配置文件：

```bash
sudo nano /etc/nginx/sites-available/uniboard
```

### 基础反向代理配置

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # 重定向到 HTTPS（如果有 SSL 证书）
    # return 301 https://$server_name$request_uri;
    
    # 设置最大请求体大小（用于文件上传）
    client_max_body_size 100M;
    
    # 反向代理配置
    location / {
        proxy_pass http://127.0.0.1:8888;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect default;
        proxy_buffering off;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态文件缓存优化
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf)$ {
        proxy_pass http://127.0.0.1:8888;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }
    
    # 安全头部
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

### 启用配置

```bash
# 创建软链接启用站点
sudo ln -s /etc/nginx/sites-available/uniboard /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx
```

## SSL 配置

### 使用 Let's Encrypt 免费证书

**安装 Certbot**
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

**获取 SSL 证书**
```bash
# 自动配置 SSL
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 或者手动获取证书
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

**自动续期**
```bash
# 测试自动续期
sudo certbot renew --dry-run

# 添加到 crontab
sudo crontab -e
# 添加以下行：
0 12 * * * /usr/bin/certbot renew --quiet
```

### 完整的 HTTPS 配置

```nginx
# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 主配置
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 文件上传大小限制
    client_max_body_size 100M;
    
    # 反向代理配置
    location / {
        proxy_pass http://127.0.0.1:8888;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect default;
        proxy_buffering off;
        
        # WebSocket 支持（如果需要）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # 静态文件优化
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        proxy_pass http://127.0.0.1:8888;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
        gzip_static on;
    }
    
    # 安全头部
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'";
}
```

## 故障排除

### 常见问题

**502 Bad Gateway 错误**
```bash
# 检查 UniBoard 服务是否运行
docker compose ps

# 检查防火墙设置
sudo ufw status

# 检查 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

**SSL 证书问题**
```bash
# 检查证书有效期
sudo certbot certificates

# 测试证书配置
openssl s_client -connect your-domain.com:443

# 强制续期证书
sudo certbot renew --force-renewal
```

**性能问题**
```bash
# 检查 Nginx 状态
curl http://localhost:8080/nginx_status

# 监控连接数
ss -tuln | grep :80
ss -tuln | grep :443

# 检查系统资源
htop
iotop
```

### 配置测试

```bash
# 测试 Nginx 配置语法
sudo nginx -t

# 检查配置文件详情
sudo nginx -T

# 重新加载配置
sudo systemctl reload nginx

# 重启 Nginx
sudo systemctl restart nginx
```

### 调试技巧

**启用调试日志**
```nginx
error_log /var/log/nginx/debug.log debug;
```

**检查代理连接**
```bash
# 测试后端连接
curl -H "Host: your-domain.com" http://127.0.0.1:8888/

# 检查响应头
curl -I https://your-domain.com/
```

## 下一步

完成 Nginx 配置后，建议：

1. 查看 [升级指南](/deployment/upgrade) 了解如何安全升级
2. 阅读 [故障排除](/deployment/troubleshooting) 解决潜在问题
