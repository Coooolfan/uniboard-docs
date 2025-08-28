# 快速开始

欢迎使用 UniBoard！

这是一个**开源**的一揽子服务解决方案，让您能够以私有化的方式部署个人主页、导航页、笔记、短链、文件分享和探针服务。

## 什么是 UniBoard？

UniBoard 是一个集成了多种常用服务的个人化平台，包括：

- **个人主页展示** - 展示您的个人信息、社交链接和个人介绍
- **笔记管理系统** - 基于 Markdown 的笔记编辑器，自带开箱即用的图床服务
- **短链接服务** - 创建和管理短链接，包含访问统计
- **文件分享系统** - 安全的文件存储与分享功能
- **探针监控服务** - 优雅的系统监控界面
- **导航页管理** - 自定义外链导航页面

## 快速体验

如果您想快速体验 UniBoard，可以按照以下步骤进行部署：

详细部署流程参照 [部署指南](/deployment/)

### 1. 准备环境

确保您的系统已安装：
- Docker
- Docker Compose

### 2. 下载配置文件

```bash
mkdir uniboard
cd uniboard
wget https://github.com/Coooolfan/UniBoard/releases/latest/download/docker-compose.yml
wget https://github.com/Coooolfan/UniBoard/releases/latest/download/example.env
```

### 3. 配置环境变量

复制示例配置文件：
```bash
cp example.env .env
```

编辑 `.env` 文件，修改数据库密码等关键配置：
```dotenv
POSTGRES_PASSWORD=your_secure_password_here
```

::: warning 安全提醒
请务必修改默认的数据库密码，不要使用示例中的默认值！
:::

### 4. 启动服务

```bash
docker compose up -d
```

### 5. 访问服务

打开浏览器，访问 `http://localhost:8888` 即可开始使用。

## 下一步

- 浏览 [个人主页](/guide/homepage) 深入了解各个模块
