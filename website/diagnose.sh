#!/bin/bash

# 诊断和修复脚本

echo "================================"
echo "  电子相册 - 故障诊断脚本"
echo "================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

INSTALL_DIR="/data/home/webs/webphoto/website"

echo "当前工作目录: $(pwd)"
echo "目标安装目录: $INSTALL_DIR"
echo ""

# 检查目录是否存在
echo "步骤 1: 检查目录..."
if [ -d "$INSTALL_DIR" ]; then
    echo -e "${GREEN}✓ 目录存在${NC}"
    cd "$INSTALL_DIR"
else
    echo -e "${RED}✗ 目录不存在${NC}"
    exit 1
fi

# 检查虚拟环境
echo ""
echo "步骤 2: 检查虚拟环境..."
if [ -d "venv" ]; then
    echo -e "${GREEN}✓ 虚拟环境存在${NC}"
else
    echo -e "${RED}✗ 虚拟环境不存在，正在创建...${NC}"
    python3 -m venv venv
fi

# 激活虚拟环境
source venv/bin/activate

# 检查 Flask
echo ""
echo "步骤 3: 检查 Flask..."
if python -c "import flask" 2>/dev/null; then
    echo -e "${GREEN}✓ Flask 已安装${NC}"
    python -c "import flask; print('  版本:', flask.__version__)"
else
    echo -e "${RED}✗ Flask 未安装${NC}"
    echo "  正在安装..."
    pip install Flask==3.0.0
fi

# 检查 gunicorn
echo ""
echo "步骤 4: 检查 gunicorn..."
if command -v gunicorn &> /dev/null; then
    echo -e "${GREEN}✓ gunicorn 已安装${NC}"
    gunicorn --version
else
    echo -e "${RED}✗ gunicorn 未安装${NC}"
    echo "  正在安装..."
    pip install gunicorn
fi

# 检查 app.py
echo ""
echo "步骤 5: 检查应用文件..."
if [ -f "app.py" ]; then
    echo -e "${GREEN}✓ app.py 存在${NC}"
else
    echo -e "${RED}✗ app.py 不存在${NC}"
    exit 1
fi

# 检查 config.py
if [ -f "config.py" ]; then
    echo -e "${GREEN}✓ config.py 存在${NC}"
else
    echo -e "${RED}✗ config.py 不存在${NC}"
    exit 1
fi

# 测试导入应用
echo ""
echo "步骤 6: 测试导入应用..."
if python -c "from app import app; print('应用对象:', app)" 2>/dev/null; then
    echo -e "${GREEN}✓ 应用导入成功${NC}"
else
    echo -e "${RED}✗ 应用导入失败${NC}"
    echo "  详细错误信息:"
    python -c "from app import app" 2>&1 | head -20
    exit 1
fi

# 创建必要的目录
echo ""
echo "步骤 7: 创建必要的目录..."
mkdir -p uploads
echo -e "${GREEN}✓ uploads 目录已创建${NC}"

# 测试 gunicorn 启动
echo ""
echo "步骤 8: 测试 gunicorn 启动..."
echo "  正在测试 gunicorn（3秒后自动停止）..."
timeout 3 gunicorn -w 1 -b 127.0.0.1:5000 app:app 2>&1 | head -10 &
sleep 3

# 检查服务文件
echo ""
echo "步骤 9: 检查服务配置..."
if [ -f "/etc/systemd/system/photo-gallery.service" ]; then
    echo -e "${GREEN}✓ 服务文件存在${NC}"
    echo "  当前配置:"
    cat /etc/systemd/system/photo-gallery.service
else
    echo -e "${RED}✗ 服务文件不存在${NC}"
fi

# 显示系统日志
echo ""
echo "步骤 10: 查看最近的错误日志..."
sudo journalctl -u photo-gallery -n 20 --no-pager

echo ""
echo "================================"
echo "  诊断完成"
echo "================================"
echo ""
echo "建议的修复步骤:"
echo "1. 重新安装依赖: pip install -r requirements.txt"
echo "2. 手动测试启动: gunicorn -w 1 -b 0.0.0.0:5000 app:app"
echo "3. 重启服务: sudo systemctl restart photo-gallery"
echo ""

