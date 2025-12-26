# 📜 脚本概览

## 🎯 脚本总览

项目共包含 **16 个脚本**，分为 4 大类。

### 📊 脚本分类统计

| 类别 | 数量 | 脚本 |
|------|------|------|
| 🚀 部署脚本 | 3 | deploy.sh, fix_service_py2.sh, start.sh |
| 🎛️ 管理脚本 | 6 | start_service.sh, stop.sh, restart_service.sh, status.sh, logs.sh, manage.sh |
| 🔧 诊断脚本 | 2 | diagnose.sh, fix_service.sh |
| 📦 其他工具 | 1 | test_py2.py |

---

## 🚀 部署脚本 (3个)

### 1. deploy.sh
- **用途**: Python 3 自动部署
- **适用**: Ubuntu/Debian/CentOS
- **功能**: 全自动安装配置
- **使用**: `sudo ./deploy.sh`

### 2. fix_service_py2.sh ⭐
- **用途**: Python 2 部署/修复
- **适用**: CentOS 7 等
- **功能**: 安装依赖、配置服务
- **使用**: `./fix_service_py2.sh`

### 3. start.sh
- **用途**: 开发模式启动
- **适用**: 本地开发测试
- **功能**: 虚拟环境 + Flask
- **使用**: `./start.sh`

---

## 🎛️ 管理脚本 (6个)

### 1. manage.sh ⭐ (推荐)
- **用途**: 综合管理工具
- **特点**: 交互式菜单
- **功能**: 一站式管理
- **使用**: `./manage.sh`

```
菜单:
1) 启动服务
2) 停止服务
3) 重启服务
4) 查看状态
5) 查看日志
6) 照片统计
7) 备份数据
0) 退出
```

### 2. start_service.sh
- **用途**: 启动服务
- **功能**: 检查状态、启动服务、显示地址
- **使用**: `./start_service.sh`

### 3. stop.sh ⭐
- **用途**: 停止服务
- **功能**: 安全停止、状态确认
- **使用**: `./stop.sh`

### 4. restart_service.sh
- **用途**: 重启服务
- **功能**: 重启 + 验证
- **使用**: `./restart_service.sh`

### 5. status.sh
- **用途**: 查看详细状态
- **功能**: 7项检查（服务、端口、进程、日志、存储、服务器、资源）
- **使用**: `./status.sh`

### 6. logs.sh
- **用途**: 查看日志
- **功能**: 多种日志查看方式
- **使用**: `./logs.sh`

```
选项:
1) 实时日志
2) 最近 50 行
3) 最近 100 行
4) 最近 200 行
5) 今天的日志
6) 错误日志
7) 所有日志
```

---

## 🔧 诊断脚本 (2个)

### 1. diagnose.sh
- **用途**: 故障诊断
- **功能**: 10步检查
- **使用**: `./diagnose.sh`

```
检查项目:
1. 检查目录
2. 检查虚拟环境
3. 检查 Flask
4. 检查 gunicorn
5. 检查 app.py
6. 测试导入应用
7. 创建目录
8. 测试 gunicorn
9. 检查服务配置
10. 查看日志
```

### 2. fix_service.sh
- **用途**: 修复服务
- **功能**: 重装依赖、更新配置、重启服务
- **使用**: `./fix_service.sh`

---

## 📦 测试工具 (1个)

### test_py2.py
- **用途**: Python 2 兼容性测试
- **功能**: 6项测试
- **使用**: `python test_py2.py`

```
测试项目:
1. Flask 版本
2. Werkzeug 版本
3. 编码处理
4. 应用导入
5. 应用配置
6. 函数测试
```

---

## 🎯 使用场景对照

| 场景 | 推荐脚本 |
|------|----------|
| 首次部署 | `fix_service_py2.sh` |
| 日常管理 | `manage.sh` ⭐ |
| 启动服务 | `start_service.sh` |
| 停止服务 | `stop.sh` ⭐ |
| 重启服务 | `restart_service.sh` |
| 查看状态 | `status.sh` |
| 查看日志 | `logs.sh` |
| 故障排查 | `diagnose.sh` → `fix_service_py2.sh` |
| 本地开发 | `start.sh` |
| 测试环境 | `test_py2.py` |

---

## ⭐ 推荐工作流

### 新用户

```bash
# 1. 给权限
chmod +x *.sh

# 2. 部署
./fix_service_py2.sh

# 3. 日常使用
./manage.sh
```

### 老用户

```bash
# 快速管理
./manage.sh

# 或独立脚本
./stop.sh           # 停止
./restart_service.sh # 重启
./status.sh         # 状态
./logs.sh           # 日志
```

---

## 📈 脚本复杂度

| 脚本 | 复杂度 | 行数 | 说明 |
|------|--------|------|------|
| stop.sh | ⭐ 简单 | ~40 | 纯停止功能 |
| start_service.sh | ⭐⭐ 中等 | ~60 | 启动+验证 |
| restart_service.sh | ⭐⭐ 中等 | ~55 | 重启+验证 |
| status.sh | ⭐⭐⭐ 复杂 | ~110 | 多项检查 |
| logs.sh | ⭐⭐ 中等 | ~75 | 菜单选择 |
| manage.sh | ⭐⭐⭐⭐ 很复杂 | ~200+ | 交互式管理 |
| diagnose.sh | ⭐⭐⭐ 复杂 | ~120 | 诊断流程 |
| fix_service_py2.sh | ⭐⭐⭐⭐ 很复杂 | ~150 | 完整修复 |
| deploy.sh | ⭐⭐⭐⭐ 很复杂 | ~180 | 自动部署 |

---

## 🔄 脚本依赖关系

```
deploy.sh / fix_service_py2.sh
    ↓
[服务已安装]
    ↓
┌───────┬───────┬───────┬───────┬───────┐
│ start │ stop  │restart│status │ logs  │
└───────┴───────┴───────┴───────┴───────┘
    ↓
manage.sh (调用上述所有脚本)
```

---

## 💡 高级用法

### 1. 组合使用

```bash
# 完整检查
./status.sh && ./logs.sh

# 安全重启
./stop.sh && sleep 2 && ./start_service.sh

# 故障恢复
./diagnose.sh && ./fix_service_py2.sh
```

### 2. 后台运行

```bash
# 后台启动（不推荐，应该用 systemd）
nohup ./start.sh > app.log 2>&1 &
```

### 3. 定时执行

```bash
# 定时重启
crontab -e
0 3 * * * cd /path/to/photo-gallery && ./restart_service.sh
```

### 4. 脚本别名

```bash
# ~/.bashrc
alias pg-manage='/path/to/photo-gallery/manage.sh'
alias pg-stop='/path/to/photo-gallery/stop.sh'
alias pg-status='/path/to/photo-gallery/status.sh'
```

---

## 🔒 安全建议

### 1. 权限控制

```bash
# 只给自己执行权限
chmod 700 *.sh

# 或给用户组执行权限
chmod 750 *.sh
```

### 2. Sudo 配置

避免频繁输入密码（谨慎使用）：

```bash
sudo visudo
```

添加：
```
your_user ALL=(ALL) NOPASSWD: /bin/systemctl * photo-gallery*
```

### 3. 审计日志

记录脚本执行：

```bash
./manage.sh 2>&1 | tee -a manage.log
```

---

## 📊 性能影响

| 脚本 | CPU | 内存 | 时间 | 影响 |
|------|-----|------|------|------|
| stop.sh | 低 | 低 | 2s | 无 |
| start_service.sh | 低 | 低 | 3s | 无 |
| restart_service.sh | 低 | 低 | 5s | 短暂中断 |
| status.sh | 低 | 低 | 2s | 无 |
| logs.sh | 低 | 低 | 1s | 无 |
| manage.sh | 低 | 低 | - | 无 |
| diagnose.sh | 低 | 低 | 10s | 无 |

所有脚本对系统影响极小。

---

## 🆘 问题解决

### 脚本无法执行

```bash
chmod +x script_name.sh
```

### 找不到命令

```bash
./script_name.sh  # 使用 ./ 前缀
```

### 权限不足

```bash
sudo ./script_name.sh  # 如果需要
```

### 路径问题

```bash
cd /path/to/photo-gallery
./script_name.sh
```

---

## 📚 相关文档

- **[SCRIPTS_GUIDE.md](SCRIPTS_GUIDE.md)** - 详细使用指南
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - 快速参考
- **[README.md](README.md)** - 项目说明

---

## 🎯 快速导航

| 需求 | 文档 |
|------|------|
| 了解所有脚本 | 👉 本文档 |
| 学习如何使用 | [SCRIPTS_GUIDE.md](SCRIPTS_GUIDE.md) |
| 快速查命令 | [QUICK_REFERENCE.md](QUICK_REFERENCE.md) |
| 解决问题 | [QUICK_FIX.md](QUICK_FIX.md) |

---

**16 个脚本，让管理变简单！** 🚀

