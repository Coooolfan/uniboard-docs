import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "UniBoard 文档",
  description: "开源的一揽子服务 - 个人主页、导航页、笔记、短链、文件分享、探针服务",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '部署指南', link: '/deployment/' },
      { text: '用户指南', link: '/guide/' },
      { text: 'API 文档', link: 'https://uniboard.apifox.cn', target: '_blank' },
    ],

    sidebar: [
      {
        text: '部署指南',
        items: [
          { text: '部署概述', link: '/deployment/' },
          { text: 'Docker Compose', link: '/deployment/docker-compose' },
          { text: 'Nginx 配置', link: '/deployment/nginx' },
          { text: '升级指南', link: '/deployment/upgrade' },
          { text: '故障排除', link: '/deployment/troubleshooting' }
        ]
      },
      {
        text: '用户指南',
        items: [
          { text: '快速开始', link: '/guide/' },
          { text: '个人主页', link: '/guide/homepage' },
          { text: '笔记管理', link: '/guide/notes' },
          { text: '短链服务', link: '/guide/shorturl' },
          { text: '文件分享', link: '/guide/fileshare' },
          { text: '探针监控', link: '/guide/probe' },
        ]
      },
      {
        text: 'API 文档',
        items: [
          { text: 'API 概述', link: '/api/' },
          { text: '文件 API', link: '/api/file' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Coooolfan/UniBoard' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2025 UniBoard'
    },

    editLink: {
      pattern: 'https://github.com/Coooolfan/UniBoard-docs/edit/main/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  }
})
