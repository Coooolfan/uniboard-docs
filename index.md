---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: UniBoard
  text: 开源的一揽子服务
  tagline: 以私有化的方式部署您的个人主页、导航页、笔记、短链、文件分享、探针服务
  image:
    src: /favicon.ico
    alt: UniBoard Logo
  actions:
    - theme: brand
      text: 部署指南
      link: /deployment/
    - theme: alt
      text: 用户指南
      link: /guide/
    - theme: alt
      text: API文档
      link: https://uniboard.apifox.cn/
    - theme: alt
      text: 查看 GitHub
      link: https://github.com/Coooolfan/UniBoard

features:
  - icon: 🏠
    title: 个人主页展示
    details: 可完全自定义的个人信息展示页面，支持横幅、头像、社交链接等个性化设置
  - icon: 📝
    title: 精致的笔记服务
    details: 基于 Vditor 的 Markdown 编辑器，支持所见即所得编辑、自带图床服务和实时预览
  - icon: 🔗
    title: 短链接服务
    details: 内置短链接生成服务，支持访问统计和链接管理
  - icon: 📁
    title: 文件分享服务
    details: 文件存储与分享，支持密码保护、访问权限控制和下载统计
  - icon: 📊
    title: 探针监控服务
    details: 优雅简单的服务器监控界面，实时显示系统状态和服务运行情况
  - icon: 🌙
    title: 暗色模式支持
    details: 全局暗色模式支持，为不同使用场景提供舒适的视觉体验
  - icon: 🔒
    title: 私有化部署
    details: 支持完全私有化部署，所有数据存储在您的服务器上
  - icon: 🚀
    title: 开箱即用
    details: Docker Compose 一键部署，无需复杂配置，几分钟即可完成部署
  - icon: 🔗
    title: 无外部依赖
    details: 服务以单体应用形式运行，所有资源已内置，无任何第三方服务依赖
---
