# 电子相册 - Photo Gallery

一个简单而美观的电子相册Web应用，支持照片上传、浏览和管理。

## ✨ 功能特性

### 🎨 全屏沉浸式画廊
- **全屏展示** - 每次只展示一张照片，自适应屏幕大小
- **极简设计** - 纯净的视觉体验，专注于照片本身
- **多种导航** - 支持左右箭头、键盘方向键、鼠标滚轮、触摸滑动
- **智能计数** - 底部显示当前照片位置（如 3/10）

### 📤 便捷上传
- **拖拽上传** - 支持拖拽文件到上传区域
- **图片预览** - 上传前实时预览照片
- **快速操作** - 上传成功后自动跳转到画廊

### 🖼️ 强大的浏览功能
- **左右箭头** - 点击屏幕两侧箭头切换照片
- **键盘控制** - ← → 方向键翻页，空格键自动播放
- **鼠标滚轮** - 滚轮上下滚动切换照片
- **触摸滑动** - 移动端左右滑动浏览
- **自动播放** - 支持自动播放模式（3秒/张）

### 🎯 其他特性
- 🗑️ **快速删除** - 底部删除按钮，轻松管理照片
- 📱 **响应式设计** - 完美适配桌面、平板和手机
- 🎭 **黑色背景** - 突出照片，减少视觉干扰
- ⚡ **流畅动画** - 照片切换时的淡入淡出效果
- 🎮 **多种操作** - 支持点击、键盘、滚轮、触摸等多种交互

## 技术栈

- **后端**: Flask (Python)
- **前端**: HTML5, CSS3, JavaScript (原生)
- **存储**: 本地文件系统 + JSON元数据

## 系统要求

- **Python 2.7** 或 Python 3.7+（已适配 Python 2）
- Linux 操作系统（推荐 Ubuntu/Debian/CentOS）

> **注意**：本项目现已完全支持 Python 2.7 + Flask 1.1.4，可直接在 CentOS 7 等系统上使用。

## 快速部署

### 🚀 Python 2 用户（CentOS 7 等）

如果你使用 Python 2.7，请使用专门的修复脚本：

```bash
cd /data/home/webs/webphoto/website
chmod +x fix_service_py2.sh
./fix_service_py2.sh
```

**详细说明**：查看 [INSTALL_GUIDE.md](INSTALL_GUIDE.md) 或 [QUICK_FIX.md](QUICK_FIX.md)

### 方法一：使用部署脚本（Python 3）

1. 克隆或上传项目文件到服务器
2. 运行部署脚本：

```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

3. 访问 `http://服务器IP:5000`

### 方法二：手动部署

#### 1. 安装依赖

**Python 3 (推荐):**
```bash
# 安装 Python3 和 pip
sudo apt update
sudo apt install python3 python3-pip python3-venv -y

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装 Python 依赖
pip install -r requirements.txt
```

**Python 2 (CentOS 7 等):**
```bash
# 安装 Python2 和 virtualenv
sudo yum install -y python python-pip python-virtualenv

# 创建虚拟环境
virtualenv venv
source venv/bin/activate

# 升级 pip
pip install --upgrade "pip<21.0"

# 安装依赖
pip install Flask==1.1.4 Werkzeug==1.0.1 gunicorn
```

#### 2. 创建必要的目录

```bash
mkdir -p uploads
```

#### 3. 运行应用

```bash
# 开发模式
python app.py

# 生产模式（使用 gunicorn）
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### 4. 配置为系统服务（可选）

```bash
# 复制服务文件
sudo cp photo-gallery.service /etc/systemd/system/

# 修改服务文件中的路径
sudo nano /etc/systemd/system/photo-gallery.service
# 将 /path/to/photo-gallery 替换为实际路径

# 启动服务
sudo systemctl daemon-reload
sudo systemctl enable photo-gallery
sudo systemctl start photo-gallery

# 查看状态
sudo systemctl status photo-gallery
```

## 配置说明

### 应用配置

在 `config.py` 中可以修改以下配置：

- `UPLOAD_FOLDER`: 照片上传目录（默认: uploads）
- `ALLOWED_EXTENSIONS`: 允许的文件格式（默认: png, jpg, jpeg, gif, webp）
- `MAX_FILE_SIZE`: 最大文件大小（默认: 16MB）
- `HOST`: 监听地址（默认: 0.0.0.0）
- `PORT`: 端口号（默认: 5000）
- `DEBUG`: 调试模式（默认: False）

你也可以通过环境变量设置某些配置：

```bash
export SECRET_KEY="your-secret-key"
```

### 防火墙配置

如果无法访问，需要开放端口：

```bash
# UFW 防火墙
sudo ufw allow 5000/tcp

# firewalld
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload
```

## 使用 Nginx 反向代理（可选）

如果要使用 80 端口访问，可以配置 Nginx：

```bash
sudo apt install nginx -y
```

创建配置文件 `/etc/nginx/sites-available/photo-gallery`:

```nginx
server {
    listen 80;
    server_name your_domain.com;  # 替换为你的域名或IP

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/photo-gallery /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 测试

运行测试脚本验证应用功能：

```bash
source venv/bin/activate
python test_app.py
```

## 🎛️ 服务管理

### 使用管理脚本（推荐）

项目提供了丰富的管理脚本，让服务管理变得简单：

```bash
# 给脚本执行权限（首次使用）
chmod +x *.sh

# 综合管理工具（推荐）
./manage.sh

# 或使用独立脚本
./start_service.sh    # 启动服务
./stop.sh             # 停止服务
./restart_service.sh  # 重启服务
./status.sh           # 查看状态
./logs.sh             # 查看日志
```

### 使用 systemctl 命令

```bash
# 启动服务
sudo systemctl start photo-gallery

# 停止服务
sudo systemctl stop photo-gallery

# 重启服务
sudo systemctl restart photo-gallery

# 查看状态
sudo systemctl status photo-gallery

# 查看日志
sudo journalctl -u photo-gallery -f

# 备份数据
tar -czf photo-gallery-backup-$(date +%Y%m%d).tar.gz uploads/ metadata.json
```

详细说明请查看 [SCRIPTS_GUIDE.md](SCRIPTS_GUIDE.md)

## 目录结构

```
photo-gallery/
├── app.py                    # Flask 应用主文件
├── config.py                 # 配置文件
├── test_app.py              # 测试脚本
├── requirements.txt          # Python 依赖
├── metadata.json            # 照片元数据（自动生成）
├── templates/
│   └── index.html           # HTML 模板
├── static/
│   ├── style.css            # 样式文件
│   └── script.js            # JavaScript 文件
├── uploads/                 # 照片存储目录（自动生成）
├── deploy.sh                # 自动部署脚本
├── start.sh                 # 快速启动脚本（开发模式）
├── photo-gallery.service    # Systemd 服务文件
├── nginx.conf.example       # Nginx 配置示例
├── .gitignore              # Git 忽略文件
└── README.md                # 说明文档
```

## 常见问题

### 1. 上传失败

- 检查文件大小是否超过限制（默认16MB）
- 检查文件格式是否支持
- 检查 uploads 目录权限

### 2. 无法访问

- 检查防火墙设置
- 确认服务是否正在运行
- 检查端口是否被占用

### 3. 权限问题

```bash
# 确保目录有正确的权限
chmod 755 uploads
chown -R $USER:$USER .
```

## 安全建议

1. **生产环境建议**:
   - 使用 HTTPS（配置 SSL 证书）
   - 添加用户认证
   - 限制上传文件大小和频率
   - 定期备份 uploads 目录和 metadata.json

2. **防火墙**:
   - 只开放必要的端口
   - 使用 Nginx 反向代理而不是直接暴露 Flask

3. **文件安全**:
   - 定期检查上传的文件
   - 考虑添加图片格式验证

## 📖 文档

### 用户文档
- **[README.md](README.md)** - 项目说明和部署指南（本文件）
- **[USER_GUIDE.md](USER_GUIDE.md)** - 用户使用指南
- **[QUICKSTART.md](QUICKSTART.md)** - 快速开始指南
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - 快速参考卡片 ⚡

### 功能文档
- **[FEATURES_3D.md](FEATURES_3D.md)** - 3D 画廊功能详解
- **[DEMO.md](DEMO.md)** - 功能演示说明
- **[CHANGELOG.md](CHANGELOG.md)** - 版本更新日志

### 部署文档
- **[INSTALL_GUIDE.md](INSTALL_GUIDE.md)** - 详细安装指南（Python 2）
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - 部署检查清单
- **[QUICK_FIX.md](QUICK_FIX.md)** - 快速修复指南

### 管理文档
- **[SCRIPTS_GUIDE.md](SCRIPTS_GUIDE.md)** - 脚本使用指南 🎛️
- **[README_PY2.md](README_PY2.md)** - Python 2 专用说明

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎反馈。

---

**享受使用电子相册！** 📷✨

