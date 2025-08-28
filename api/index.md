# API 概述

UniBoard 提供了完整的 RESTful API，支持所有核心功能的程序化访问。API 采用标准的 HTTP 方法和状态码，使用 JSON 格式进行数据交换。访问 [API 文档](https://uniboard.apifox.cn) 查看所有接口。

## API 基础信息

### 基础 URL
```
https://your-domain.com/
```

### 认证方式
UniBoard API 使用 Token 进行身份认证。

**获取 Token**
```http
GET /api/token
Content-Type: application/json

{
  "loginName": "your_username",
  "loginPassword": "your_password"
}
```

响应头会返回一个名为 `satoken` 的 Cookie，您需要将此 Cookie 设置到请求头中。

**使用 Token**
```http
Cookie: satoken=<your_token>
```

## 下一步

- 查看 [文件 API 详细文档](/api/file) 了解文件操作

如果您在使用 API 过程中遇到问题，请查看 [故障排除指南](/deployment/troubleshooting) 或在 GitHub 上提交 Issue。
