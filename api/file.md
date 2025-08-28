# 文件 API 详解

UniBoard 的文件 API 提供了完整的文件管理功能，包括上传、下载、权限控制和分享功能。本文档简要了所有文件相关的 API 接口。

详细文档请访问 [API 文档](https://uniboard.apifox.cn)。

## API 概览

| 方法 | 端点 | 功能 | 认证要求 |
|------|------|------|----------|
| GET | `/api/file-record` | 获取文件列表 | 是 |
| POST | `/api/file-record` | 上传文件 | 是 |
| PATCH | `/api/file-record/{id}` | 更新文件信息 | 是 |
| DELETE | `/api/file-record/{id}` | 删除文件 | 是 |
| GET | `/api/file-record/direct-link/{id}` | 生成下载直链 | 是 |
| GET | `/file/{uuid}/[filename]` | 直链下载（适用于临时直链） | 否 |
| GET | `/file/{shareCode}/[filename]?pw={password}` | 直链下载（适用于分享链接） | 否 |

## 文件下载

上表中的 `[filename]` 为可选参数，表示文件名，服务不会将此参数参与任何逻辑，其仅用于部分程序正确显示文件名。

