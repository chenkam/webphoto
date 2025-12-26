# 希希之家 3D 相册系统

一个支持账号认证的全屏3D相册系统，提供优雅的照片展示和管理功能。

## ✨ 主要特性

### 🎨 相册展示
- **3D全屏展示** - 沉浸式照片浏览体验
- **多种切换方式** - 箭头、键盘、滚轮、触摸滑动
- **自动播放** - 3秒间隔自动轮播
- **平滑动画** - 流畅的过渡效果

### 🔐 账号系统
- **游客浏览** - 无需登录即可浏览相册
- **账号登录** - 支持用户登录/登出
- **权限控制** - 上传和删除需要登录
- **会话管理** - 登录状态持久化

### 📤 照片管理
- **拖拽上传** - 支持拖拽文件上传
- **格式支持** - JPG, PNG, GIF, WEBP
- **文件限制** - 最大16MB
- **删除管理** - 登录后可删除照片

## 🚀 快速开始

### 安装依赖
```bash
pip install -r requirements.txt
```

### 启动应用
```bash
python app.py
```

### 访问系统
```
http://localhost:5000
```

### 默认账号
```
用户名：cecilia
密码：20210427
```

## 📖 使用指南

### 游客模式（无需登录）
- ✅ 浏览3D相册
- ✅ 切换照片
- ✅ 自动播放
- ❌ 上传照片（显示提示）
- ❌ 删除照片（按钮隐藏）

### 登录模式
- ✅ 游客的所有功能
- ✅ 上传照片
- ✅ 删除照片
- ✅ 导航栏显示用户名

## 🔑 账号管理

编辑 `accounts.json` 文件：

```json
[
  {
    "username": "cecilia",
    "password": "20210427"
  },
  {
    "username": "新用户",
    "password": "新密码"
  }
]
```

保存后重启应用生效。

## 📂 项目结构

```
website/
├── app.py                 # Flask应用
├── accounts.json          # 账号配置
├── metadata.json          # 照片元数据
├── templates/             # HTML模板
├── static/                # 静态文件
├── uploads/               # 照片存储
├── logs/                  # 日志文件
└── *.md                   # 文档
```

## 🧪 测试

运行测试脚本：
```bash
python test_auth.py
```

## 📚 文档

- **QUICKSTART.md** - 快速启动指南
- **USER_GUIDE.md** - 详细使用说明  
- **CHANGELOG.md** - 更新日志
- **FEATURE_SUMMARY.md** - 功能总结
- **DEPLOYMENT_READY.md** - 部署清单

## 🛠️ 技术栈

### 后端
- Flask 2.0.3
- Python 3.x
- Session会话管理
- JSON数据存储

### 前端
- 原生JavaScript
- HTML5
- CSS3
- Fetch API

## 🔒 权限说明

| 功能 | 游客 | 用户 |
|------|:----:|:----:|
| 浏览相册 | ✅ | ✅ |
| 切换照片 | ✅ | ✅ |
| 自动播放 | ✅ | ✅ |
| 上传照片 | ❌ | ✅ |
| 删除照片 | ❌ | ✅ |

## ⚙️ 配置说明

### 应用配置
在 `app.py` 中：
```python
UPLOAD_FOLDER = 'uploads'      # 照片存储目录
MAX_FILE_SIZE = 16 * 1024 * 1024  # 最大16MB
ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp']
```

### 账号配置
在 `accounts.json` 中：
- 支持多账号
- 明文密码存储
- 可自由添加/删除账号

## 🔐 安全建议

### 生产环境部署
1. **修改默认密码**
2. **设置强SECRET_KEY**
3. **启用HTTPS**
4. **限制访问IP**
5. **定期备份数据**

### 密码加密（可选）
考虑使用bcrypt加密存储密码：
```python
pip install bcrypt
```

## 🐛 故障排除

### 登录后不能上传？
```bash
# 清除浏览器缓存
Ctrl + Shift + R
```

### 端口被占用？
```python
# 修改app.py中的端口
app.run(host='0.0.0.0', port=8000)
```

### 页面无法访问？
```bash
# 检查日志
tail -f logs/app.log
```

## 📊 系统要求

- Python 3.6+
- Flask 2.0+
- 现代浏览器（Chrome, Firefox, Edge, Safari）
- 最低1GB内存
- 足够的磁盘空间存储照片

## 🎯 已知问题

无

## 🚧 开发计划

- [ ] 密码加密存储
- [ ] 用户注册功能
- [ ] 照片分类标签
- [ ] 照片搜索功能
- [ ] 批量上传功能
- [ ] 照片编辑功能

## 📝 更新日志

### 2025-12-26
- ✅ 添加账号认证功能
- ✅ 实现权限控制
- ✅ 完善文档

### 初始版本
- ✅ 3D全屏相册
- ✅ 照片上传/删除
- ✅ 自动播放
- ✅ 响应式设计

## 👥 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有使用和支持本项目的用户！

## 📧 联系方式

如有问题或建议，请通过Issue联系。

---

**Made with ❤️ by Your Team**

**祝使用愉快！🎉**
