# 🚀 快速修复指南

服务启动失败（exit code 3）？按照以下步骤快速修复！

## ⚡ 一键修复

```bash
cd /data/home/webs/webphoto/website
chmod +x fix_service_py2.sh
./fix_service_py2.sh
```

这个脚本会自动完成所有修复步骤。

## 🔍 如果一键修复失败，手动执行以下步骤

### 步骤 1: 进入项目目录并激活虚拟环境

```bash
cd /data/home/webs/webphoto/website
source venv/bin/activate
```

### 步骤 2: 升级 pip 并安装依赖

```bash
pip install --upgrade "pip<21.0"
pip install Flask==1.1.4
pip install Werkzeug==1.0.1
pip install gunicorn
```

### 步骤 3: 测试应用是否能正常导入

```bash
python << 'EOF'
from app import app
print "Success! Flask app loaded."
print "Flask version:", app.__class__.__module__
EOF
```

**如果出错**，查看错误信息并修复。

### 步骤 4: 手动测试 gunicorn 启动

```bash
gunicorn -w 1 -b 0.0.0.0:5000 --log-level debug app:app
```

如果成功启动（看到 "Listening at: http://0.0.0.0:5000"），按 Ctrl+C 停止。

### 步骤 5: 更新服务配置

```bash
sudo tee /etc/systemd/system/photo-gallery.service > /dev/null <<'EOF'
[Unit]
Description=Photo Gallery Web Application
After=network.target

[Service]
Type=simple
User=your_username_here
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
EOF
```

**重要**：将 `your_username_here` 替换为实际用户名（运行 `whoami` 查看）。

### 步骤 6: 重启服务

```bash
sudo systemctl daemon-reload
sudo systemctl restart photo-gallery
sleep 3
sudo systemctl status photo-gallery
```

### 步骤 7: 查看日志

```bash
sudo journalctl -u photo-gallery -n 50
```

如果看到 "Listening at: http://0.0.0.0:5000"，说明成功！

## 📋 验证服务是否正常

```bash
# 1. 检查状态（应该显示 active (running)）
sudo systemctl status photo-gallery

# 2. 测试 HTTP 访问
curl http://localhost:5000

# 3. 在浏览器访问
# http://你的服务器IP:5000
```

## 🔧 常见错误和解决方案

### 错误 1: "No module named flask"

```bash
source venv/bin/activate
pip install Flask==1.1.4
```

### 错误 2: "exit code 3" 或 "NOTIMPLEMENTED"

```bash
# 这通常是因为 gunicorn 无法找到或导入 app
source venv/bin/activate
pip install gunicorn
python -c "from app import app; print app"
```

### 错误 3: UnicodeDecodeError

```bash
# 在服务文件中添加这两行（已包含在上面的服务配置中）
Environment="LANG=en_US.UTF-8"
Environment="LC_ALL=en_US.UTF-8"
```

### 错误 4: Permission denied

```bash
# 检查目录权限
ls -la /data/home/webs/webphoto/website
chmod 755 /data/home/webs/webphoto/website
chmod 755 uploads
```

### 错误 5: 端口被占用

```bash
# 查看是谁占用了 5000 端口
sudo lsof -i :5000

# 如果需要，杀掉进程
sudo kill -9 PID号
```

## 📝 快速命令参考

```bash
# 重启服务
sudo systemctl restart photo-gallery

# 查看状态
sudo systemctl status photo-gallery

# 查看日志
sudo journalctl -u photo-gallery -f

# 停止服务
sudo systemctl stop photo-gallery

# 启动服务
sudo systemctl start photo-gallery

# 手动测试
cd /data/home/webs/webphoto/website
source venv/bin/activate
gunicorn -w 1 -b 0.0.0.0:5000 app:app
```

## 🆘 仍然失败？

1. **运行诊断脚本**
```bash
cd /data/home/webs/webphoto/website
chmod +x diagnose.sh
./diagnose.sh
```

2. **运行测试脚本**
```bash
python test_py2.py
```

3. **查看完整日志**
```bash
sudo journalctl -u photo-gallery --no-pager -n 200
```

4. **手动启动查看详细错误**
```bash
cd /data/home/webs/webphoto/website
source venv/bin/activate
gunicorn -w 1 -b 0.0.0.0:5000 --log-level debug app:app
```

把错误信息发给开发者或查看 `INSTALL_GUIDE.md` 获取详细说明。

## 🎯 成功标志

当你看到：
- ✅ `sudo systemctl status photo-gallery` 显示 "active (running)"
- ✅ `curl http://localhost:5000` 返回 HTML 内容
- ✅ 浏览器能打开 `http://服务器IP:5000`
- ✅ 能上传、浏览、删除照片

恭喜！部署成功！🎉

---

**需要更多帮助？查看:**
- `INSTALL_GUIDE.md` - 完整安装指南
- `README_PY2.md` - Python 2 详细说明
- `DEPLOYMENT_CHECKLIST.md` - 部署检查清单

