#!/bin/bash

# 启动电子相册服务脚本

echo "================================"
echo "  启动电子相册服务"
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

# 检查服务当前状态
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    echo -e "${YELLOW}⚠ 服务已经在运行中${NC}"
    echo ""
    sudo systemctl status $SERVICE_NAME --no-pager -l | head -5
    echo ""
    read -p "是否要重启服务？(y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "正在重启服务..."
        sudo systemctl restart $SERVICE_NAME
        sleep 2
    else
        echo "操作已取消"
        exit 0
    fi
else
    echo "正在启动服务..."
    sudo systemctl start $SERVICE_NAME
    sleep 2
fi

# 检查是否成功启动
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    echo -e "${GREEN}✓ 服务启动成功${NC}"
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
    echo "查看日志: sudo journalctl -u $SERVICE_NAME -f"
else
    echo -e "${RED}✗ 服务启动失败${NC}"
    echo ""
    echo "详细状态:"
    sudo systemctl status $SERVICE_NAME --no-pager
    echo ""
    echo "查看日志:"
    echo "  sudo journalctl -u $SERVICE_NAME -n 50"
    exit 1
fi

echo ""
echo "================================"
echo "  完成"
echo "================================"

