# 部署检查清单

在部署电子相册应用前，请按照此清单逐项检查。

---

## 📋 部署前检查

### 1. 系统环境

- [ ] Linux 操作系统已安装 (Ubuntu/Debian/CentOS)
- [ ] 具有 sudo 权限的用户账户
- [ ] 系统已更新 (`sudo apt update && sudo apt upgrade`)
- [ ] 防火墙已配置或可以配置

### 2. 项目文件

- [ ] 所有项目文件已上传到服务器
- [ ] 文件权限正确 (`chmod +x *.sh`)
- [ ] 目录结构完整

### 3. 网络要求

- [ ] 服务器有固定 IP 地址
- [ ] 端口 5000 未被占用 (或修改了配置)
- [ ] 如使用 Nginx，端口 80/443 未被占用

---

## 🚀 快速部署步骤

### 方式 A: 一键自动部署（推荐）

```bash
# 1. 给脚本执行权限
chmod +x deploy.sh

# 2. 运行部署脚本
sudo ./deploy.sh

# 3. 检查服务状态
sudo systemctl status photo-gallery

# 4. 测试访问
curl http://localhost:5000
```

**预期结果**: 
- ✅ 服务状态显示 "active (running)"
- ✅ curl 返回 HTML 内容
- ✅ 浏览器可以访问

---

### 方式 B: 手动部署

```bash
# 1. 安装 Python
sudo apt install python3 python3-pip python3-venv -y

# 2. 创建虚拟环境
python3 -m venv venv

# 3. 激活虚拟环境
source venv/bin/activate

# 4. 安装依赖
pip install -r requirements.txt
pip install gunicorn

# 5. 创建目录
mkdir -p uploads

# 6. 配置服务
sudo cp photo-gallery.service /etc/systemd/system/
sudo nano /etc/systemd/system/photo-gallery.service
# 修改路径为实际路径

# 7. 启动服务
sudo systemctl daemon-reload
sudo systemctl enable photo-gallery
sudo systemctl start photo-gallery

# 8. 检查状态
sudo systemctl status photo-gallery
```

---

## ✅ 部署后验证

### 1. 服务检查

```bash
# 检查服务状态
sudo systemctl status photo-gallery
```
- [ ] 状态显示 "active (running)"
- [ ] 没有错误信息

### 2. 端口检查

```bash
# 检查端口监听
sudo netstat -tulpn | grep 5000
```
- [ ] 显示 5000 端口正在监听

### 3. 日志检查

```bash
# 查看最近日志
sudo journalctl -u photo-gallery -n 50
```
- [ ] 没有 ERROR 级别的日志
- [ ] 显示 "Running on http://0.0.0.0:5000"

### 4. HTTP 访问测试

```bash
# 本地测试
curl http://localhost:5000
```
- [ ] 返回 HTML 内容
- [ ] 包含 "电子相册" 字样

### 5. 浏览器测试

访问 `http://服务器IP:5000`

- [ ] 页面正常加载
- [ ] 样式显示正确
- [ ] 可以看到上传区域和相册区域

### 6. 功能测试

- [ ] 可以选择照片文件
- [ ] 可以上传照片
- [ ] 上传后照片显示在相册中
- [ ] 可以点击查看大图
- [ ] 可以删除照片

---

## 🔧 配置优化（可选）

### 1. 配置防火墙

```bash
# UFW
sudo ufw allow 5000/tcp
sudo ufw status

# firewalld
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload
```
- [ ] 防火墙规则已添加
- [ ] 外网可以访问

### 2. 配置 Nginx 反向代理

```bash
# 安装 Nginx
sudo apt install nginx -y

# 复制配置
sudo cp nginx.conf.example /etc/nginx/sites-available/photo-gallery

# 编辑配置
sudo nano /etc/nginx/sites-available/photo-gallery
# 修改 server_name

# 启用配置
sudo ln -s /etc/nginx/sites-available/photo-gallery /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 开放 80 端口
sudo ufw allow 80/tcp
```
- [ ] Nginx 配置无错误
- [ ] 可以通过 80 端口访问

### 3. 配置 SSL (HTTPS)

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d your_domain.com

# 自动续期测试
sudo certbot renew --dry-run
```
- [ ] SSL 证书已安装
- [ ] HTTPS 访问正常
- [ ] HTTP 自动跳转 HTTPS

---

## 🔍 故障排查

### 问题 1: 服务无法启动

**检查**:
```bash
sudo journalctl -u photo-gallery -n 100
```

**常见原因**:
- [ ] Python 依赖未安装
- [ ] 虚拟环境路径错误
- [ ] 端口被占用
- [ ] 文件权限问题

**解决方案**:
```bash
# 重新安装依赖
source venv/bin/activate
pip install -r requirements.txt

# 检查端口占用
sudo lsof -i :5000

# 修复权限
chmod 755 app.py
chmod 755 uploads
```

### 问题 2: 无法访问

**检查**:
```bash
# 防火墙状态
sudo ufw status

# 服务状态
sudo systemctl status photo-gallery

# 端口监听
sudo netstat -tulpn | grep 5000
```

**解决方案**:
- [ ] 开放防火墙端口
- [ ] 检查服务是否运行
- [ ] 确认监听地址是 0.0.0.0

### 问题 3: 上传失败

**检查**:
```bash
# uploads 目录权限
ls -la uploads/

# 磁盘空间
df -h
```

**解决方案**:
```bash
# 创建目录
mkdir -p uploads

# 修复权限
chmod 755 uploads

# 清理空间（如需要）
```

### 问题 4: 照片不显示

**检查**:
- [ ] metadata.json 文件是否存在
- [ ] 照片文件是否在 uploads/ 目录
- [ ] 浏览器控制台是否有错误

**解决方案**:
```bash
# 检查元数据
cat metadata.json

# 检查文件
ls -la uploads/
```

---

## 📊 性能优化检查

### 1. 应用性能

- [ ] Gunicorn worker 数量合适 (建议: CPU核心数 × 2 + 1)
- [ ] 已启用 Nginx 缓存
- [ ] 静态文件有缓存头

### 2. 系统资源

```bash
# 检查内存使用
free -h

# 检查 CPU 使用
top -p $(pgrep -f gunicorn)

# 检查磁盘使用
df -h
```

- [ ] 内存使用正常 (< 80%)
- [ ] CPU 使用正常 (< 70%)
- [ ] 磁盘空间充足 (> 20% 可用)

---

## 🔐 安全检查

### 1. 基础安全

- [ ] 已修改默认 SECRET_KEY
- [ ] 文件上传有大小限制
- [ ] 文件类型有白名单验证
- [ ] 应用使用非 root 用户运行

### 2. 网络安全

- [ ] 只开放必要的端口
- [ ] 配置了 HTTPS (生产环境)
- [ ] 使用了 Nginx 反向代理
- [ ] 配置了访问日志

### 3. 应用安全

- [ ] DEBUG 模式已关闭 (config.py)
- [ ] 定期备份数据
- [ ] 监控异常日志

---

## 📝 维护计划

### 每日

- [ ] 检查服务运行状态
- [ ] 查看错误日志

### 每周

- [ ] 备份照片和元数据
- [ ] 检查磁盘空间
- [ ] 更新系统安全补丁

### 每月

- [ ] 更新 Python 依赖
- [ ] 清理旧日志
- [ ] 检查应用性能

---

## 🎉 部署完成

所有检查项都通过后，部署完成！

**访问地址**: 
- HTTP: `http://服务器IP:5000`
- Nginx: `http://服务器IP` 或 `http://域名`
- HTTPS: `https://域名`

**常用命令**:
```bash
# 重启服务
sudo systemctl restart photo-gallery

# 查看日志
sudo journalctl -u photo-gallery -f

# 停止服务
sudo systemctl stop photo-gallery

# 启动服务
sudo systemctl start photo-gallery
```

---

**祝部署顺利！** 🚀✨

