#!/bin/bash

# 修复服务脚本

echo "================================"
echo "  修复 photo-gallery 服务"
echo "================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

INSTALL_DIR="/data/home/webs/webphoto/website"

# 切换到安装目录
cd "$INSTALL_DIR"

echo "步骤 1: 激活虚拟环境并重新安装依赖..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn
echo -e "${GREEN}✓ 依赖安装完成${NC}"

echo ""
echo "步骤 2: 创建必要的目录..."
mkdir -p uploads
mkdir -p templates
mkdir -p static
chmod 755 uploads
echo -e "${GREEN}✓ 目录创建完成${NC}"

echo ""
echo "步骤 3: 测试应用导入..."
if python -c "from app import app; print('Flask app loaded')" 2>/dev/null; then
    echo -e "${GREEN}✓ 应用导入成功${NC}"
else
    echo -e "${RED}✗ 应用导入失败，请检查 app.py${NC}"
    python -c "from app import app"
    exit 1
fi

echo ""
echo "步骤 4: 更新服务配置文件..."
sudo tee /etc/systemd/system/photo-gallery.service > /dev/null <<EOF
[Unit]
Description=Photo Gallery Web Application
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$INSTALL_DIR
Environment="PATH=$INSTALL_DIR/venv/bin:/usr/local/bin:/usr/bin:/bin"
Environment="PYTHONPATH=$INSTALL_DIR"
ExecStart=$INSTALL_DIR/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 --timeout 120 --access-logfile - --error-logfile - app:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo -e "${GREEN}✓ 服务文件已更新${NC}"

echo ""
echo "步骤 5: 重新加载 systemd 并重启服务..."
sudo systemctl daemon-reload
sudo systemctl enable photo-gallery
sudo systemctl restart photo-gallery

echo ""
echo "等待服务启动..."
sleep 3

echo ""
echo "步骤 6: 检查服务状态..."
sudo systemctl status photo-gallery --no-pager

echo ""
echo "================================"
echo ""

if sudo systemctl is-active --quiet photo-gallery; then
    echo -e "${GREEN}✓ 服务启动成功！${NC}"
    echo ""
    echo "应用已成功运行，请访问:"
    echo "  http://$(hostname -I | awk '{print $1}'):5000"
    echo ""
else
    echo -e "${RED}✗ 服务仍然启动失败${NC}"
    echo ""
    echo "请查看详细日志:"
    echo "  sudo journalctl -u photo-gallery -n 50"
    echo ""
    echo "或尝试手动启动测试:"
    echo "  cd $INSTALL_DIR"
    echo "  source venv/bin/activate"
    echo "  gunicorn -w 1 -b 0.0.0.0:5000 app:app"
fi

echo ""

