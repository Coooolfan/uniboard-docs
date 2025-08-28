# 故障排除指南

本指南涵盖了 UniBoard 部署和使用过程中可能遇到的常见问题及其解决方案。

::: info
此文由LLM生成，希望能为您带来一些解决思路。如果无法解决您的问题，请访问 [GitHub Issues](https://github.com/Coooolfan/UniBoard/issues) 搜索相似问题，或创建新的 Issue 并提供详细信息。
:::


## 部署问题

### Docker 相关问题

**Q: Docker Compose 启动失败？**

**症状**: 容器无法启动或启动后立即退出

**排查步骤**:
```bash
# 查看详细错误信息
docker compose logs

# 检查容器状态
docker compose ps -a

# 查看特定服务的日志
docker compose logs app
docker compose logs postgres
```

**常见原因和解决方案**:

1. **端口冲突**
   ```bash
   # 检查端口占用
   netstat -tulpn | grep 8888
   lsof -i :8888
   
   # 解决方案：修改端口映射
   # 在 docker-compose.yml 中修改
   ports:
     - "8889:8888"  # 使用其他端口
   ```

2. **权限问题**
   ```bash
   # 检查 Docker 权限
   groups $USER
   
   # 添加用户到 docker 组
   sudo usermod -aG docker $USER
   
   # 重新登录或刷新组
   newgrp docker
   ```

3. **磁盘空间不足**
   ```bash
   # 检查磁盘空间
   df -h
   
   # 清理 Docker 资源
   docker system prune -f
   docker volume prune -f
   ```

4. **内存不足**
   ```bash
   # 检查内存使用
   free -h
   
   # 限制容器内存使用
   docker compose up -d --memory=1g
   ```

**Q: 数据库连接失败？**

**症状**: 应用启动但无法连接到数据库

**排查步骤**:
```bash
# 检查数据库容器状态
docker compose ps postgres

# 查看数据库日志
docker compose logs postgres

# 测试数据库连接
docker compose exec postgres pg_isready -U postgres
```

**解决方案**:
1. **检查环境变量**
   ```bash
   # 确保 .env 文件配置正确
   cat .env | grep POSTGRES
   
   # 必须设置的变量
   POSTGRES_PASSWORD=your_password
   POSTGRES_USER=postgres
   POSTGRES_DB=uniboard
   ```

2. **重置数据库**
   ```bash
   # 停止服务
   docker compose down
   
   # 删除数据库数据（谨慎操作！）
   sudo rm -rf ./data/postgres
   
   # 重新启动
   docker compose up -d
   ```

3. **网络问题**
   ```bash
   # 检查 Docker 网络
   docker network ls
   docker network inspect uniboard_default
   
   # 重建网络
   docker compose down
   docker network prune
   docker compose up -d
   ```

### 配置文件问题

**Q: 环境变量不生效？**

**解决方案**:
```bash
# 检查 .env 文件位置
ls -la .env

# 确保 .env 文件在 docker-compose.yml 同目录
# 检查文件内容格式
cat .env

# 重新加载环境变量
docker compose down
docker compose up -d
```

**Q: 配置文件格式错误？**

```bash
# 验证 YAML 格式
python -c "import yaml; yaml.safe_load(open('docker-compose.yml'))"

# 或使用在线 YAML 验证器
```

## 运行时问题

### 应用服务问题

**Q: 502 Bad Gateway 错误？**

**症状**: Nginx 返回 502 错误

**排查步骤**:
```bash
# 检查应用服务状态
docker compose ps app

# 查看应用日志
docker compose logs app

# 检查应用是否在监听端口
docker compose exec app netstat -tulpn | grep 8888
```

**解决方案**:
1. **应用服务未启动**
   ```bash
   # 重启应用服务
   docker compose restart app
   
   # 查看启动过程
   docker compose logs -f app
   ```

2. **端口不匹配**
   ```bash
   # 检查端口配置
   grep -n "8888" docker-compose.yml
   
   # 确保内外端口映射正确
   ```

3. **防火墙阻拦**
   ```bash
   # 检查防火墙状态
   sudo ufw status
   
   # 开放端口
   sudo ufw allow 8888
   ```

**Q: 应用响应慢？**

**排查步骤**:
```bash
# 检查系统资源
htop
docker stats

# 查看应用日志
docker compose logs app | grep -i "slow\|timeout\|error"

# 检查数据库性能
docker compose exec postgres pg_stat_activity
```

**优化方案**:
1. **增加资源限制**
   ```yaml
   # docker-compose.yml
   services:
     app:
       deploy:
         resources:
           limits:
             memory: 1G
             cpus: '1.0'
   ```

2. **优化数据库**
   ```bash
   # 进入数据库容器
   docker compose exec postgres psql -U postgres uniboard
   
   # 查看慢查询
   SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
   ```

3. **启用缓存**
   ```bash
   # 在 Nginx 中启用缓存
   # 参考 Nginx 配置文档
   ```

### 数据库问题

**Q: 数据库损坏？**

**症状**: 数据库无法启动或数据异常

**恢复步骤**:
```bash
# 1. 停止服务
docker compose down

# 2. 备份当前数据（即使损坏）
cp -r ./data/postgres ./data/postgres_backup

# 3. 尝试修复
docker run --rm -v $(pwd)/data/postgres:/var/lib/postgresql/data postgres:15-alpine pg_resetwal /var/lib/postgresql/data

# 4. 如果修复失败，从备份恢复
rm -rf ./data/postgres
# 从最新备份恢复
```

**Q: 数据库空间不足？**

```bash
# 检查数据库大小
docker compose exec postgres psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('uniboard'));"

# 清理数据
docker compose exec postgres psql -U postgres uniboard -c "VACUUM FULL;"

# 清理日志
docker compose exec postgres find /var/log -name "*.log" -mtime +7 -delete
```

### 文件存储问题

**Q: 文件上传失败？**

**排查步骤**:
```bash
# 检查上传目录权限
ls -la ./data/uploads/

# 检查磁盘空间
df -h

# 查看应用日志
docker compose logs app | grep -i "upload\|file"
```

**解决方案**:
1. **权限问题**
   ```bash
   # 修复目录权限
   sudo chown -R 1000:1000 ./data/uploads/
   chmod -R 755 ./data/uploads/
   ```

2. **空间不足**
   ```bash
   # 清理无用文件
   find ./data/uploads/ -name "*.tmp" -delete
   
   # 压缩旧文件
   find ./data/uploads/ -name "*.jpg" -mtime +30 -exec jpegoptim {} \;
   ```

3. **文件大小限制**
   ```bash
   # 检查 Nginx 配置
   grep client_max_body_size /etc/nginx/sites-available/uniboard
   
   # 调整限制
   client_max_body_size 100M;
   ```

**Q: 文件访问 404 错误？**

```bash
# 检查文件是否存在
ls -la ./data/uploads/files/

# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

## 网络问题

### SSL/HTTPS 问题

**Q: SSL 证书无效？**

**排查步骤**:
```bash
# 检查证书状态
sudo certbot certificates

# 测试证书
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# 检查证书文件
sudo ls -la /etc/letsencrypt/live/your-domain.com/
```

**解决方案**:
1. **证书过期**
   ```bash
   # 手动续期
   sudo certbot renew
   
   # 强制续期
   sudo certbot renew --force-renewal
   ```

2. **证书路径错误**
   ```bash
   # 检查 Nginx 配置中的证书路径
   sudo nginx -t
   
   # 修正路径
   ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
   ```

**Q: 无法访问 HTTPS？**

```bash
# 检查防火墙
sudo ufw status | grep 443

# 开放 HTTPS 端口
sudo ufw allow 443

# 检查 Nginx 配置
sudo nginx -t
sudo systemctl status nginx
```

### 域名解析问题

**Q: 域名无法访问？**

**排查步骤**:
```bash
# 检查域名解析
nslookup your-domain.com
dig your-domain.com

# 检查本地 hosts 文件
cat /etc/hosts
```

**解决方案**:
1. **DNS 配置错误**
   - 检查域名 A 记录是否指向正确的 IP
   - 等待 DNS 传播（可能需要 24-48 小时）

2. **临时解决方案**
   ```bash
   # 在本地 hosts 文件中添加记录
   echo "your-server-ip your-domain.com" | sudo tee -a /etc/hosts
   ```

## 性能问题

### 系统资源问题

**Q: CPU 使用率过高？**

**排查步骤**:
```bash
# 查看 CPU 使用情况
htop
docker stats

# 分析进程
ps aux --sort=-%cpu | head

# 查看容器资源使用
docker compose exec app ps aux
```

**优化方案**:
1. **限制容器资源**
   ```yaml
   services:
     app:
       deploy:
         resources:
           limits:
             cpus: '1.0'
   ```

2. **优化应用配置**
   ```bash
   # 调整 JVM 参数（如果是 Java 应用）
   environment:
     - JAVA_OPTS=-Xmx512m -Xms256m
   ```

**Q: 内存使用过高？**

```bash
# 查看内存使用
free -h
docker stats --no-stream

# 查看内存占用进程
ps aux --sort=-%mem | head

# 容器内存分析
docker compose exec app cat /proc/meminfo
```

**解决方案**:
1. **增加交换空间**
   ```bash
   # 创建交换文件
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

2. **优化容器配置**
   ```yaml
   services:
     app:
       deploy:
         resources:
           limits:
             memory: 1G
   ```

### 数据库性能问题

**Q: 数据库查询慢？**

**分析步骤**:
```bash
# 进入数据库
docker compose exec postgres psql -U postgres uniboard

# 查看慢查询
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

# 分析查询计划
EXPLAIN ANALYZE SELECT * FROM your_table WHERE condition;
```

**优化方案**:
1. **添加索引**
   ```sql
   CREATE INDEX idx_table_column ON table_name (column_name);
   ```

2. **优化查询**
   ```sql
   -- 避免全表扫描
   -- 使用合适的 WHERE 条件
   -- 限制返回结果数量
   ```

3. **数据库配置优化**
   ```bash
   # 调整 PostgreSQL 配置
   # 编辑 postgresql.conf
   shared_buffers = 256MB
   effective_cache_size = 1GB
   ```

## 数据问题

### 数据备份

**自动备份脚本**:
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"

mkdir -p $BACKUP_DIR

# 数据库备份
docker compose exec -T postgres pg_dump -U postgres uniboard > $BACKUP_DIR/db_$DATE.sql

# 文件备份
tar -czf $BACKUP_DIR/files_$DATE.tar.gz ./data/uploads/

# 配置备份
cp .env $BACKUP_DIR/env_$DATE
cp docker-compose.yml $BACKUP_DIR/compose_$DATE.yml

# 清理旧备份（保留 7 天）
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "备份完成: $DATE"
```

**设置定时备份**:
```bash
# 添加到 crontab
crontab -e

# 每天凌晨 2 点备份
0 2 * * * /path/to/backup.sh
```

### 数据恢复

**恢复数据库**:
```bash
# 停止应用服务
docker compose stop app

# 恢复数据库
docker compose exec -T postgres psql -U postgres -c "DROP DATABASE IF EXISTS uniboard;"
docker compose exec -T postgres psql -U postgres -c "CREATE DATABASE uniboard;"
docker compose exec -T postgres psql -U postgres uniboard < backups/db_20240101_020000.sql

# 重启应用
docker compose start app
```

**恢复文件**:
```bash
# 停止服务
docker compose down

# 恢复文件
rm -rf ./data/uploads/
tar -xzf backups/files_20240101_020000.tar.gz

# 重启服务
docker compose up -d
```

## 监控和日志

### 日志分析

**应用日志**:
```bash
# 查看最近的错误
docker compose logs app | grep -i error

# 查看特定时间范围的日志
docker compose logs app --since="2024-01-01T00:00:00"

# 持续查看日志
docker compose logs -f app
```

**系统日志**:
```bash
# 查看系统日志
sudo journalctl -u docker
sudo journalctl -f

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### 监控脚本

**健康检查脚本**:
```bash
#!/bin/bash
# health_check.sh

# 检查服务状态
if ! docker compose ps | grep -q "Up"; then
    echo "错误: 服务未运行"
    exit 1
fi

# 检查 HTTP 响应
if ! curl -f http://localhost:8888 > /dev/null 2>&1; then
    echo "错误: HTTP 服务不可用"
    exit 1
fi

# 检查数据库
if ! docker compose exec postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "错误: 数据库连接失败"
    exit 1
fi

echo "所有检查通过"
```

**性能监控脚本**:
```bash
#!/bin/bash
# monitor.sh

while true; do
    echo "=== $(date) ==="
    
    # CPU 和内存使用率
    echo "系统资源:"
    docker stats --no-stream
    
    # 磁盘使用率
    echo "磁盘空间:"
    df -h
    
    # 网络连接
    echo "网络连接:"
    ss -tuln | grep :8888
    
    echo ""
    sleep 300  # 5 分钟检查一次
done
```

## 紧急恢复

### 服务完全无法访问

**快速恢复步骤**:
```bash
# 1. 停止所有服务
docker compose down

# 2. 检查系统资源
df -h
free -h

# 3. 清理 Docker 资源
docker system prune -f

# 4. 从最新备份恢复
./restore.sh latest

# 5. 重启服务
docker compose up -d

# 6. 验证服务
./health_check.sh
```

### 数据损坏恢复

```bash
# 1. 立即停止服务
docker compose down

# 2. 备份当前状态
cp -r ./data ./data_corrupted_$(date +%Y%m%d)

# 3. 从最近的有效备份恢复
./restore.sh last_known_good

# 4. 启动服务并验证
docker compose up -d
./health_check.sh
```

## 获取技术支持

如果以上解决方案都无法解决问题，请：

1. **收集诊断信息**:
   ```bash
   # 生成诊断报告
   ./generate_diagnostic_report.sh
   ```

2. **准备以下信息**:
   - 系统环境（操作系统、Docker 版本）
   - UniBoard 版本
   - 错误日志
   - 复现步骤
   - 配置文件（去除敏感信息）

3. **提交 Issue**:
   - 访问 [GitHub Issues](https://github.com/Coooolfan/UniBoard/issues)
   - 搜索相似问题
   - 创建新的 Issue 并提供详细信息

4. **社区支持**:
   - 查看官方文档
   - 参与社区讨论
   - 查看常见问题解答

记住，详细的错误信息和环境描述能够帮助快速定位和解决问题。
