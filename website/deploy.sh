#!/bin/bash

# 电子相册自动部署脚本
# 支持 Ubuntu/Debian/CentOS

set -e

echo "================================"
echo "  电子相册 - 自动部署脚本"
echo "================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检测操作系统
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo -e "${RED}无法检测操作系统${NC}"
    exit 1
fi

# 获取当前目录
INSTALL_DIR=$(pwd)
echo -e "${GREEN}安装目录: $INSTALL_DIR${NC}"
echo ""

# 安装系统依赖
echo "步骤 1/6: 安装系统依赖..."
if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    sudo apt update
    sudo apt install -y python python-pip python-virtualenv
elif [ "$OS" = "centos" ] || [ "$OS" = "rhel" ]; then
    sudo yum install -y python python-pip python-virtualenv
else
    echo -e "${YELLOW}警告: 未识别的系统，请手动安装 Python2${NC}"
fi

# 创建虚拟环境
echo ""
echo "步骤 2/6: 创建Python虚拟环境..."
if [ ! -d "venv" ]; then
    # 尝试 Python 2
    if command -v virtualenv &> /dev/null; then
        virtualenv venv
    elif command -v python2 &> /dev/null; then
        python2 -m virtualenv venv
    else
        python -m virtualenv venv
    fi
    echo -e "${GREEN}虚拟环境创建完成${NC}"
else
    echo -e "${YELLOW}虚拟环境已存在，跳过创建${NC}"
fi

# 激活虚拟环境并安装依赖
echo ""
echo "步骤 3/6: 安装Python依赖..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn
echo -e "${GREEN}依赖安装完成${NC}"

# 创建必要的目录
echo ""
echo "步骤 4/6: 创建必要的目录..."
mkdir -p uploads
echo -e "${GREEN}目录创建完成${NC}"

# 配置系统服务
echo ""
echo "步骤 5/6: 配置系统服务..."
SERVICE_FILE="/etc/systemd/system/photo-gallery.service"

# 创建服务文件
sudo tee $SERVICE_FILE > /dev/null <<EOF
[Unit]
Description=Photo Gallery Web Application
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$INSTALL_DIR
Environment="PATH=$INSTALL_DIR/venv/bin"
ExecStart=$INSTALL_DIR/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 app:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo -e "${GREEN}服务文件创建完成${NC}"

# 启动服务
echo ""
echo "步骤 6/6: 启动服务..."
sudo systemctl daemon-reload
sudo systemctl enable photo-gallery
sudo systemctl restart photo-gallery

# 等待服务启动
sleep 2

# 检查服务状态
if sudo systemctl is-active --quiet photo-gallery; then
    echo -e "${GREEN}✓ 服务启动成功！${NC}"
else
    echo -e "${RED}✗ 服务启动失败，请检查日志${NC}"
    sudo systemctl status photo-gallery
    exit 1
fi

# 配置防火墙（如果存在）
echo ""
echo "配置防火墙..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 5000/tcp 2>/dev/null || true
    echo -e "${GREEN}UFW 防火墙已配置${NC}"
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-port=5000/tcp 2>/dev/null || true
    sudo firewall-cmd --reload 2>/dev/null || true
    echo -e "${GREEN}firewalld 防火墙已配置${NC}"
fi

# 获取服务器IP
SERVER_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "================================"
echo -e "${GREEN}  部署完成！${NC}"
echo "================================"
echo ""
echo "应用已成功部署并启动！"
echo ""
echo -e "${YELLOW}访问地址:${NC}"
echo "  http://localhost:5000"
echo "  http://$SERVER_IP:5000"
echo ""
echo -e "${YELLOW}常用命令:${NC}"
echo "  查看状态: sudo systemctl status photo-gallery"
echo "  重启服务: sudo systemctl restart photo-gallery"
echo "  停止服务: sudo systemctl stop photo-gallery"
echo "  查看日志: sudo journalctl -u photo-gallery -f"
echo ""
echo -e "${YELLOW}提示:${NC}"
echo "  - 如果无法访问，请检查防火墙设置"
echo "  - 默认端口为 5000，可在 app.py 中修改"
echo "  - 生产环境建议配置 Nginx 反向代理"
echo ""

