# Python 2 + Flask 1.1.4 部署说明

本项目已适配 Python 2.7 和 Flask 1.1.4 版本。

## ⚠️ 重要提示

**Python 2 已于 2020 年 1 月 1 日停止维护**，建议尽快迁移到 Python 3。但如果您的环境需要使用 Python 2，本项目已做了兼容处理。

## 📋 系统要求

- Python 2.7
- pip (Python 2 版本)
- virtualenv
- Linux 操作系统

## 🚀 快速部署

### 方法 1: 使用自动修复脚本（推荐）

```bash
cd /data/home/webs/webphoto/website

# 给脚本执行权限
chmod +x fix_service_py2.sh

# 运行修复脚本
./fix_service_py2.sh
```

### 方法 2: 手动部署

#### 1. 安装系统依赖

**CentOS/RHEL:**
```bash
sudo yum install -y python python-pip python-virtualenv
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y python python-pip python-virtualenv
```

#### 2. 创建虚拟环境

```bash
cd /data/home/webs/webphoto/website

# 创建虚拟环境
virtualenv venv

# 激活虚拟环境
source venv/bin/activate
```

#### 3. 安装 Python 依赖

```bash
# 升级 pip (使用兼容 Python 2 的版本)
pip install --upgrade "pip<21.0"

# 安装依赖
pip install Flask==1.1.4
pip install Werkzeug==1.0.1
pip install gunicorn
```

#### 4. 创建必要的目录

```bash
mkdir -p uploads
chmod 755 uploads
```

#### 5. 测试应用

```bash
# 测试导入
python -c "from app import app; print 'OK'"

# 手动测试运行
python app.py
# 或使用 gunicorn
gunicorn -w 1 -b 0.0.0.0:5000 app:app
```

按 Ctrl+C 停止测试。

#### 6. 配置系统服务

```bash
# 创建服务文件
sudo nano /etc/systemd/system/photo-gallery.service
```

输入以下内容（**注意修改路径和用户名**）：

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

#### 7. 启动服务

```bash
# 重新加载 systemd
sudo systemctl daemon-reload

# 启用服务
sudo systemctl enable photo-gallery

# 启动服务
sudo systemctl start photo-gallery

# 查看状态
sudo systemctl status photo-gallery
```

## 🔍 故障排查

### 问题 1: 编码错误

如果遇到 `UnicodeDecodeError` 或 `UnicodeEncodeError`：

```bash
# 设置系统编码
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# 或在服务文件中添加
Environment="LANG=en_US.UTF-8"
Environment="LC_ALL=en_US.UTF-8"
```

### 问题 2: pip 版本问题

Python 2 只支持到 pip 20.3.4：

```bash
source venv/bin/activate
pip install --upgrade "pip<21.0"
```

### 问题 3: gunicorn 启动失败

查看详细日志：

```bash
# 查看服务日志
sudo journalctl -u photo-gallery -n 50

# 手动测试
cd /data/home/webs/webphoto/website
source venv/bin/activate
gunicorn -w 1 -b 0.0.0.0:5000 --log-level debug app:app
```

### 问题 4: 模块导入错误

```bash
# 检查 Python 版本
python --version
# 应该显示 Python 2.7.x

# 检查 Flask 版本
python -c "import flask; print flask.__version__"
# 应该显示 1.1.4

# 测试应用导入
python << 'EOF'
from app import app
print "Flask app:", app
print "Config:", app.config
EOF
```

## ✅ 验证部署

### 1. 检查服务状态

```bash
sudo systemctl status photo-gallery
```

应该显示 `active (running)`。

### 2. 测试 HTTP 访问

```bash
curl http://localhost:5000
```

应该返回 HTML 内容。

### 3. 浏览器访问

打开浏览器访问：`http://服务器IP:5000`

### 4. 测试功能

- 上传照片
- 浏览相册
- 查看大图
- 删除照片

## 📝 Python 2 兼容性说明

本项目已针对 Python 2 做了以下兼容处理：

1. **字符编码处理**
   - 添加 `# -*- coding: utf-8 -*-`
   - 使用 `from __future__ import unicode_literals`
   - 设置默认编码为 UTF-8

2. **字符串处理**
   - 使用 `u''` 标记 Unicode 字符串
   - 处理 str/unicode 类型差异

3. **文件 I/O**
   - 兼容 Python 2 的文件读写
   - 手动处理编码转换

4. **语法兼容**
   - 使用 `format()` 而非 f-string
   - 使用 `print()` 函数而非语句
   - 避免使用 Python 3 独有特性

5. **依赖版本**
   - Flask 1.1.4 (最后支持 Python 2 的版本)
   - Werkzeug 1.0.1 (兼容版本)

## 🔄 迁移到 Python 3 建议

强烈建议尽快迁移到 Python 3：

1. Python 2 已停止维护，不再收到安全更新
2. 许多库不再支持 Python 2
3. Python 3 性能更好，功能更强大

迁移步骤：
```bash
# 使用 Python 3 重新创建环境
python3 -m venv venv
source venv/bin/activate
pip install Flask==3.0.0 Werkzeug==3.0.1 gunicorn
# 更新 app.py 使用 Python 3 版本
```

## 📞 获取帮助

如果遇到问题：

1. 查看详细日志：`sudo journalctl -u photo-gallery -f`
2. 检查 Python 版本：`python --version`
3. 检查 Flask 版本：`python -c "import flask; print flask.__version__"`
4. 手动测试启动：`gunicorn -w 1 -b 0.0.0.0:5000 app:app`

---

**注意：此为 Python 2 临时方案，请尽快升级到 Python 3！**

