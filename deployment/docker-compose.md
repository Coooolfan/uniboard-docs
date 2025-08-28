# Docker Compose 部署指南

Docker Compose 是 UniBoard 推荐的部署方式，它能够一键部署所有必要的服务组件，包括应用程序和数据库。

## 前置操作

### 安装 Docker

参考 [Docker 安装文档](https://docs.docker.com/desktop/setup/install/linux/) 安装 Docker。

### 配置 DockerHub 镜像源

参考 [Docker 镜像源配置文档](https://github.com/dongyubin/DockerHub) 配置 DockerHub 镜像源。

## 快速部署

### 下载配置文件

创建部署目录并下载必要的配置文件：

```bash
# 创建部署目录
mkdir uniboard
cd uniboard

# 下载 docker-compose.yml 文件
wget https://github.com/Coooolfan/UniBoard/releases/latest/download/docker-compose.yml

# 下载环境配置示例文件
wget https://github.com/Coooolfan/UniBoard/releases/latest/download/example.env

# 查看下载的文件
ls -la
```

### 配置环境变量

复制并编辑环境配置文件：

```bash
# 复制示例配置文件
cp example.env .env

# 编辑配置文件
nano .env
```

**必须修改的配置项**：

```dotenv
# 你需要配置的数据库参数
# PostgreSQL 数据库密码 (生产环境请务必修改此默认密码)
POSTGRES_PASSWORD=iBHvdwvzVoqjQQz1vYugBELeeomW99yMg
```

::: warning 安全警告
请务必修改 `POSTGRES_PASSWORD` 为强密码，此密码仅用于服务内部连接，您无需记忆，不要使用默认值！强密码建议包含大小写字母、数字和特殊字符，长度至少 12 位。
:::

### 启动服务

```bash
# 拉取最新镜像
docker compose pull

# 启动所有服务
docker compose up -d

# 查看服务状态
docker compose ps
```

预期输出类似：
```
NAME           IMAGE                         COMMAND                                  SERVICE   CREATED        STATUS                 PORTS
uniboard-db    postgres:17.4-bookworm        "docker-entrypoint.sh postgres"          db        3 months ago   Up 7 weeks (healthy)   5432/tcp
uniboard-web   coolfan1024/uniboard:latest   "sh -c 'java $JAVA_OPTS -jar app.jar'"   web       8 days ago     Up 8 days              0.0.0.0:8888->8080/tcp, :::8888->8080/tcp
```

### 验证部署

1. **检查服务状态**
   ```bash
   # 查看所有容器状态
   docker compose ps
   
   # 查看服务日志
   docker compose logs app
   docker compose logs postgres
   ```

2. **访问应用**
   - 打开浏览器访问 `http://localhost:8888`
   - 或者使用服务器 IP：`http://your-server-ip:8888`

## 高阶配置

除非您知道您正在做什么，否则请直接跳过此小节。

### 连接到自有的数据库实例

Uniboard 基于默认的 PostgreSQL 17.4 开发，当前版本无需额外数据库插件支持，这允许您使用任何 PostgreSQL 数据库实例。

Uniborad 依赖 Flyway 进行数据库迁移，您需要确保您的提供的数据库连接信息所对应的账号具有执行该库的owner权限。

除配置数据库连接密码外，还需要以下配置：

```dotenv
# 数据库名称 - 后端服务和数据库实例共享此变量
# 如果您使用自有的数据库实例，请确保此变量与数据库实例中的数据库名称一致
# 且该数据库仅供 UniBoard 使用，不要在其他服务中使用此数据库
POSTGRES_DB=uniboard

# 后端服务连接数据库的配置

DB_HOST=db        # 后端连接的数据库主机地址，默认为Docker容器名'db'
DB_PORT=5432      # 后端连接的数据库端口，默认为PostgreSQL默认端口
DB_USER=postgres  # 后端连接的数据库用户名，默认为PostgreSQL默认用户
```
## 下一步

部署完成后，建议：

1. [配置 Nginx 反向代理](/deployment/nginx) - 提高安全性和性能

如果遇到问题，请查看 [故障排除指南](/deployment/troubleshooting) 或在 GitHub 上提交 Issue。
