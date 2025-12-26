# ⚡ 快速参考卡片

## 🚀 一键命令

```bash
# 首次部署
chmod +x *.sh && ./fix_service_py2.sh

# 综合管理
./manage.sh

# 启动服务
./start_service.sh

# 停止服务
./stop.sh

# 重启服务
./restart_service.sh

# 查看状态
./status.sh

# 查看日志
./logs.sh
```

## 📋 脚本对照表

| 需求 | 脚本 | 快捷方式 |
|------|------|----------|
| 启动 | `./start_service.sh` | `sudo systemctl start photo-gallery` |
| 停止 | `./stop.sh` | `sudo systemctl stop photo-gallery` |
| 重启 | `./restart_service.sh` | `sudo systemctl restart photo-gallery` |
| 状态 | `./status.sh` | `sudo systemctl status photo-gallery` |
| 日志 | `./logs.sh` | `sudo journalctl -u photo-gallery -f` |
| 管理 | `./manage.sh` | - |

## 🔧 常用命令速查

### 服务控制
```bash
sudo systemctl start photo-gallery      # 启动
sudo systemctl stop photo-gallery       # 停止
sudo systemctl restart photo-gallery    # 重启
sudo systemctl status photo-gallery     # 状态
sudo systemctl enable photo-gallery     # 开机启动
sudo systemctl disable photo-gallery    # 取消开机启动
```

### 日志查看
```bash
sudo journalctl -u photo-gallery -f           # 实时日志
sudo journalctl -u photo-gallery -n 50        # 最近50行
sudo journalctl -u photo-gallery --since today # 今天的日志
sudo journalctl -u photo-gallery -p err       # 错误日志
```

### 端口检查
```bash
sudo netstat -tulpn | grep 5000   # 检查端口
sudo lsof -i :5000                # 查看占用
sudo ss -tulpn | grep 5000        # 另一种方式
```

### 进程管理
```bash
ps aux | grep gunicorn            # 查看进程
pgrep -f gunicorn                 # 获取进程ID
kill -9 $(pgrep -f gunicorn)      # 强制结束（慎用）
```

### 文件操作
```bash
ls -lh uploads/                              # 查看照片
du -sh uploads/                              # 存储大小
find uploads -type f | wc -l                 # 照片数量
tar -czf backup.tar.gz uploads/ metadata.json # 备份
tar -xzf backup.tar.gz                       # 恢复
```

## 🆘 故障速查

| 问题 | 命令 |
|------|------|
| 服务无法启动 | `./diagnose.sh` |
| 查看错误日志 | `./logs.sh` 选择 6 |
| 端口被占用 | `sudo lsof -i :5000` |
| 重新部署 | `./fix_service_py2.sh` |
| 查看详细状态 | `./status.sh` |

## 📊 监控命令

```bash
# 实时监控（每2秒刷新）
watch -n 2 'systemctl status photo-gallery | head -10'

# 资源监控
htop                              # 系统资源
df -h                             # 磁盘空间
free -h                           # 内存使用

# 网络监控
netstat -an | grep 5000           # 连接状态
tcpdump -i any port 5000          # 数据包捕获
```

## 🔐 权限问题

```bash
# 给脚本执行权限
chmod +x *.sh

# 修复目录权限
chmod 755 uploads/
chown -R $USER:$USER .

# 查看文件权限
ls -la
```

## 📦 备份恢复

```bash
# 快速备份
tar -czf backup-$(date +%Y%m%d).tar.gz uploads/ metadata.json

# 完整备份
./manage.sh  # 选择 7) 备份数据

# 恢复备份
tar -xzf backup-YYYYMMDD.tar.gz
```

## 🌐 访问地址

```bash
# 本地访问
http://localhost:5000

# 服务器访问
http://服务器IP:5000

# 获取服务器IP
hostname -I | awk '{print $1}'
ifconfig | grep "inet " | grep -v 127.0.0.1
```

## 🔄 更新流程

```bash
# 1. 停止服务
./stop.sh

# 2. 备份数据
./manage.sh  # 选择 7

# 3. 更新代码
# git pull 或上传新文件

# 4. 重启服务
./start_service.sh

# 5. 验证
./status.sh
```

## 📱 快捷别名

添加到 `~/.bashrc`:

```bash
alias pg='cd /path/to/photo-gallery'
alias pg-start='cd /path/to/photo-gallery && ./start_service.sh'
alias pg-stop='cd /path/to/photo-gallery && ./stop.sh'
alias pg-restart='cd /path/to/photo-gallery && ./restart_service.sh'
alias pg-status='cd /path/to/photo-gallery && ./status.sh'
alias pg-logs='cd /path/to/photo-gallery && ./logs.sh'
alias pg-manage='cd /path/to/photo-gallery && ./manage.sh'
```

使用:
```bash
source ~/.bashrc
pg-status  # 查看状态
```

## 🎯 常见场景

### 场景 1: 每天检查
```bash
./status.sh
```

### 场景 2: 服务异常
```bash
./logs.sh      # 查看日志
./diagnose.sh  # 诊断问题
./restart_service.sh  # 重启服务
```

### 场景 3: 代码更新
```bash
./stop.sh
# 更新代码
./start_service.sh
./status.sh
```

### 场景 4: 完全重置
```bash
./stop.sh
./fix_service_py2.sh
./status.sh
```

## 📞 紧急联系

```bash
# 强制停止（最后手段）
sudo systemctl kill photo-gallery
sudo pkill -f gunicorn

# 查看系统日志
sudo journalctl -xe

# 重启系统（慎用）
sudo reboot
```

## 💾 定时任务

```bash
# 编辑定时任务
crontab -e

# 每天3点重启
0 3 * * * cd /path/to/photo-gallery && ./restart_service.sh

# 每周一2点备份
0 2 * * 1 cd /path/to/photo-gallery && ./manage.sh backup

# 每小时检查状态
0 * * * * cd /path/to/photo-gallery && ./status.sh > /tmp/pg-status.log
```

---

## 📚 详细文档

- **[SCRIPTS_GUIDE.md](SCRIPTS_GUIDE.md)** - 完整脚本指南
- **[README.md](README.md)** - 项目说明
- **[QUICK_FIX.md](QUICK_FIX.md)** - 快速修复
- **[USER_GUIDE.md](USER_GUIDE.md)** - 用户指南

---

**收藏此页面，快速解决问题！** ⚡

