# 快速开始指南

## 🚀 三步快速部署

### Linux 生产环境（推荐）

```bash
# 1. 上传项目文件到服务器
cd /path/to/photo-gallery

# 2. 运行自动部署脚本
chmod +x deploy.sh
sudo ./deploy.sh

# 3. 访问应用
# http://你的服务器IP:5000
```

完成！应用已经作为系统服务运行。

---

### 开发/测试环境

```bash
# 1. 安装依赖
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 2. 启动应用
python app.py

# 3. 访问
# http://localhost:5000
```

或者使用快速启动脚本（Linux/Mac）：

```bash
chmod +x start.sh
./start.sh
```

---

## 📋 常用命令

### 服务管理（生产环境）

```bash
# 查看状态
sudo systemctl status photo-gallery

# 重启
sudo systemctl restart photo-gallery

# 停止
sudo systemctl stop photo-gallery

# 查看日志
sudo journalctl -u photo-gallery -f
```

### 开发模式

```bash
# 激活虚拟环境
source venv/bin/activate

# 启动应用
python app.py

# 运行测试
python test_app.py
```

---

## ⚙️ 常见配置

### 修改端口

编辑 `config.py`:

```python
PORT = 8080  # 改为你想要的端口
```

### 修改最大上传大小

编辑 `config.py`:

```python
MAX_FILE_SIZE = 32 * 1024 * 1024  # 32MB
```

### 配置 Nginx（推荐）

```bash
# 1. 安装 Nginx
sudo apt install nginx -y

# 2. 复制配置
sudo cp nginx.conf.example /etc/nginx/sites-available/photo-gallery

# 3. 编辑配置文件
sudo nano /etc/nginx/sites-available/photo-gallery
# 修改 server_name 为你的域名或IP

# 4. 启用配置
sudo ln -s /etc/nginx/sites-available/photo-gallery /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔥 快速测试

上传你的第一张照片：

1. 访问 http://localhost:5000
2. 点击"选择照片"
3. 添加描述（可选）
4. 点击"上传照片"
5. 在下方相册中查看

---

## ❓ 遇到问题？

### 无法访问？

```bash
# 检查服务是否运行
sudo systemctl status photo-gallery

# 检查端口是否开放
sudo netstat -tulpn | grep 5000

# 检查防火墙
sudo ufw status
```

### 上传失败？

```bash
# 检查目录权限
ls -la uploads/

# 如果权限不对，修复它
chmod 755 uploads
```

### 查看详细日志

```bash
# 实时日志
sudo journalctl -u photo-gallery -f

# 最近100行
sudo journalctl -u photo-gallery -n 100
```

---

## 📚 更多信息

完整文档请查看 [README.md](README.md)

---

**祝你使用愉快！** ✨

