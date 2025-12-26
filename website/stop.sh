#!/bin/bash

# 停止电子相册服务脚本

echo "================================"
echo "  停止电子相册服务"
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
echo "当前服务状态:"
sudo systemctl status $SERVICE_NAME --no-pager -l | head -5
echo ""

# 停止服务
echo "正在停止服务..."
sudo systemctl stop $SERVICE_NAME

# 等待服务停止
sleep 2

# 检查是否成功停止
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    echo -e "${RED}✗ 服务停止失败${NC}"
    echo ""
    echo "请查看详细状态:"
    sudo systemctl status $SERVICE_NAME --no-pager
    exit 1
else
    echo -e "${GREEN}✓ 服务已成功停止${NC}"
    echo ""
    echo "服务状态:"
    sudo systemctl status $SERVICE_NAME --no-pager -l | head -3
    echo ""
    echo "如需重新启动服务，请运行:"
    echo "  sudo systemctl start $SERVICE_NAME"
    echo "  或运行: ./start_service.sh"
fi

echo ""
echo "================================"
echo "  完成"
echo "================================"

