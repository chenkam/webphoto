# 电子相册 - Photo Gallery

一个简单而美观的电子相册Web应用，支持照片上传、浏览和管理。

## 功能特性

- 📤 **照片上传** - 支持上传 PNG、JPG、JPEG、GIF、WEBP 格式的照片
- 🖼️ **相册浏览** - 响应式网格布局展示照片
- 🔍 **照片查看** - 点击查看大图和详细信息
- 📝 **照片描述** - 为每张照片添加描述
- 🗑️ **照片删除** - 可删除不需要的照片
- 📱 **响应式设计** - 完美适配桌面和移动设备

## 技术栈

- **后端**: Flask (Python)
- **前端**: HTML5, CSS3, JavaScript (原生)
- **存储**: 本地文件系统 + JSON元数据

## 系统要求

- Python 3.7+
- Linux 操作系统（推荐 Ubuntu/Debian/CentOS）

## 快速部署

### 方法一：使用部署脚本（推荐）

1. 克隆或上传项目文件到服务器
2. 运行部署脚本：

```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

3. 访问 `http://服务器IP:5000`

### 方法二：手动部署

#### 1. 安装依赖

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

## 维护命令

```bash
# 查看服务状态
sudo systemctl status photo-gallery

# 重启服务
sudo systemctl restart photo-gallery

# 查看日志
sudo journalctl -u photo-gallery -f

# 停止服务
sudo systemctl stop photo-gallery

# 备份数据
tar -czf photo-gallery-backup-$(date +%Y%m%d).tar.gz uploads/ metadata.json
```

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

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎反馈。

---

**享受使用电子相册！** 📷✨

