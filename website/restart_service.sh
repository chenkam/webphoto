#!/bin/bash

# 重启电子相册服务脚本

echo "================================"
echo "  重启电子相册服务"
echo "================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SERVICE_NAME="photo-gallery"

# 检查服务是否存在
if ! systemctl list-unit-files | grep -q "$SERVICE_NAME.service"; then
    echo -e "${RED}✗ 服务 $SERVICE_NAME 不存在${NC}"
    echo "请先运行部署脚本: ./deploy.sh 或 ./fix_service_py2.sh"
    exit 1
fi

# 显示当前状态
echo "当前服务状态:"
sudo systemctl status $SERVICE_NAME --no-pager -l | head -5
echo ""

# 重启服务
echo "正在重启服务..."
sudo systemctl restart $SERVICE_NAME

# 等待服务重启
echo "等待服务启动..."
sleep 3

# 检查是否成功重启
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    echo -e "${GREEN}✓ 服务重启成功${NC}"
    echo ""
    echo "服务状态:"
    sudo systemctl status $SERVICE_NAME --no-pager -l | head -10
    echo ""
    
    # 获取服务器 IP
    SERVER_IP=$(hostname -I | awk '{print $1}')
    
    echo -e "${GREEN}应用已成功运行！${NC}"
    echo ""
    echo "访问地址:"
    echo "  http://localhost:5000"
    if [ -n "$SERVER_IP" ]; then
        echo "  http://$SERVER_IP:5000"
    fi
    echo ""
    echo "查看实时日志: sudo journalctl -u $SERVICE_NAME -f"
else
    echo -e "${RED}✗ 服务重启失败${NC}"
    echo ""
    echo "详细状态:"
    sudo systemctl status $SERVICE_NAME --no-pager
    echo ""
    echo "查看最近日志:"
    sudo journalctl -u $SERVICE_NAME -n 50 --no-pager
    exit 1
fi

echo ""
echo "================================"
echo "  完成"
echo "================================"

