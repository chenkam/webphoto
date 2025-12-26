# 安装指南 - Python 2 + Flask 1.1.4

## 🎯 适配说明

本项目已完全适配 **Python 2.7 + Flask 1.1.4**，可以在 CentOS 7 等自带 Python 2 的系统上直接运行。

## 📦 更新内容

### 代码修改
- ✅ 添加 Python 2/3 兼容性处理
- ✅ 修复字符编码问题
- ✅ 移除 Python 3 独有语法
- ✅ 使用兼容的 API

### 依赖版本
- Flask 1.1.4（最后支持 Python 2 的版本）
- Werkzeug 1.0.1（兼容版本）
- Gunicorn（Python 2 兼容版本）

## 🚀 Linux 服务器部署步骤

### 第一步：上传文件到服务器

将所有项目文件上传到服务器，例如：
```bash
/data/home/webs/webphoto/website/
```

### 第二步：运行自动修复脚本

```bash
# 进入项目目录
cd /data/home/webs/webphoto/website

# 给脚本执行权限
chmod +x fix_service_py2.sh

# 运行修复脚本（会自动安装依赖并配置服务）
./fix_service_py2.sh
```

脚本会自动：
1. 检查 Python 版本
2. 激活虚拟环境
3. 安装所有依赖（Flask 1.1.4, Werkzeug 1.0.1, Gunicorn）
4. 创建必要的目录
5. 测试应用导入
6. 配置系统服务
7. 启动服务

### 第三步：验证部署

```bash
# 查看服务状态
sudo systemctl status photo-gallery

# 应该显示 "active (running)"

# 测试 HTTP 访问
curl http://localhost:5000

# 查看实时日志
sudo journalctl -u photo-gallery -f
```

### 第四步：浏览器访问

访问：`http://你的服务器IP:5000`

## 🔧 手动部署（如果自动脚本失败）

### 1. 安装系统依赖

**CentOS 7:**
```bash
sudo yum install -y python python-pip python-virtualenv
```

**Ubuntu/Debian:**
```bash
sudo apt-get install -y python python-pip python-virtualenv
```

### 2. 创建虚拟环境

```bash
cd /data/home/webs/webphoto/website

# 创建虚拟环境
virtualenv venv

# 激活
source venv/bin/activate

# 升级 pip（Python 2 最高支持到 20.3.4）
pip install --upgrade "pip<21.0"
```

### 3. 安装 Python 依赖

```bash
# 方法 1: 使用 requirements.txt
pip install -r requirements.txt
pip install gunicorn

# 方法 2: 手动安装
pip install Flask==1.1.4
pip install Werkzeug==1.0.1
pip install gunicorn
```

### 4. 创建目录

```bash
mkdir -p uploads
chmod 755 uploads
```

### 5. 测试应用

```bash
# 运行测试脚本
python test_py2.py

# 手动测试导入
python << 'EOF'
from app import app
print "Flask app loaded:", app
EOF

# 测试启动
python app.py
# 或
gunicorn -w 1 -b 0.0.0.0:5000 app:app
```

如果能正常启动，按 Ctrl+C 停止，继续下一步。

### 6. 配置系统服务

创建服务文件：
```bash
sudo nano /etc/systemd/system/photo-gallery.service
```

输入以下内容（**替换路径和用户名**）：

```ini
[Unit]
Description=Photo Gallery Web Application
After=network.target

[Service]
Type=simple
User=your_username
WorkingDirectory=/data/home/webs/webphoto/website
Environment="PATH=/data/home/webs/webphoto/website/venv/bin:/usr/local/bin:/usr/bin:/bin"
Environment="PYTHONPATH=/data/home/webs/webphoto/website"
Environment="LANG=en_US.UTF-8"
Environment="LC_ALL=en_US.UTF-8"
ExecStart=/data/home/webs/webphoto/website/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 --timeout 120 app:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 7. 启动服务

```bash
sudo systemctl daemon-reload
sudo systemctl enable photo-gallery
sudo systemctl start photo-gallery
sudo systemctl status photo-gallery
```

### 8. 配置防火墙

```bash
# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload

# Ubuntu/Debian
sudo ufw allow 5000/tcp
```

## ✅ 验证清单

- [ ] Python 版本是 2.7.x: `python --version`
- [ ] Flask 版本是 1.1.4: `python -c "import flask; print flask.__version__"`
- [ ] 虚拟环境已创建: `ls -la venv/`
- [ ] 依赖已安装: `pip list | grep -i flask`
- [ ] 应用可以导入: `python -c "from app import app; print app"`
- [ ] 服务正在运行: `sudo systemctl status photo-gallery`
- [ ] HTTP 可访问: `curl http://localhost:5000`
- [ ] 浏览器能打开: `http://服务器IP:5000`

## 🔍 常见问题

### Q1: ImportError: No module named flask

**解决方案：**
```bash
source venv/bin/activate
pip install Flask==1.1.4
```

### Q2: UnicodeDecodeError 或 UnicodeEncodeError

**解决方案：**
```bash
# 在服务文件中添加环境变量
Environment="LANG=en_US.UTF-8"
Environment="LC_ALL=en_US.UTF-8"

# 或临时设置
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

### Q3: gunicorn 启动失败 (exit code 3)

**可能原因和解决方案：**

1. **gunicorn 未安装**
```bash
source venv/bin/activate
pip install gunicorn
```

2. **app.py 有语法错误**
```bash
python -c "from app import app"
# 查看错误信息
```

3. **路径错误**
```bash
# 检查服务文件中的路径是否正确
sudo nano /etc/systemd/system/photo-gallery.service
```

4. **查看详细日志**
```bash
sudo journalctl -u photo-gallery -n 100 --no-pager
```

### Q4: 服务启动但无法访问

**检查步骤：**
```bash
# 1. 确认服务运行
sudo systemctl status photo-gallery

# 2. 确认端口监听
sudo netstat -tulpn | grep 5000

# 3. 测试本地访问
curl -v http://localhost:5000

# 4. 检查防火墙
sudo firewall-cmd --list-all
# 或
sudo ufw status

# 5. 开放端口
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload
```

### Q5: pip 版本太新导致安装失败

**解决方案：**
```bash
source venv/bin/activate
pip install --upgrade "pip<21.0"
```

Python 2 只支持到 pip 20.3.4。

## 📝 维护命令

```bash
# 查看服务状态
sudo systemctl status photo-gallery

# 重启服务
sudo systemctl restart photo-gallery

# 停止服务
sudo systemctl stop photo-gallery

# 启动服务
sudo systemctl start photo-gallery

# 查看实时日志
sudo journalctl -u photo-gallery -f

# 查看最近 50 行日志
sudo journalctl -u photo-gallery -n 50

# 备份数据
tar -czf photo-backup-$(date +%Y%m%d).tar.gz uploads/ metadata.json
```

## 🎯 测试功能

部署成功后，测试以下功能：

1. **访问主页** - 看到上传区域和相册区域
2. **上传照片** - 选择图片文件上传
3. **浏览相册** - 查看上传的照片
4. **查看大图** - 点击照片查看详情
5. **删除照片** - 删除不需要的照片

## ⚠️ 重要提示

1. **Python 2 已停止维护**，建议尽快迁移到 Python 3
2. 定期备份 `uploads/` 目录和 `metadata.json` 文件
3. 生产环境建议配置 Nginx 反向代理和 HTTPS
4. 定期更新系统安全补丁

## 📞 获取帮助

如果遇到问题：

1. 运行测试脚本：`python test_py2.py`
2. 查看详细日志：`sudo journalctl -u photo-gallery -n 100`
3. 手动测试启动：`gunicorn -w 1 -b 0.0.0.0:5000 --log-level debug app:app`
4. 检查详细说明：查看 `README_PY2.md`

---

**祝部署顺利！** 🚀

