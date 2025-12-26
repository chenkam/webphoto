#!/bin/bash

# 查看电子相册服务状态脚本

echo "================================"
echo "  电子相册服务状态"
echo "================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVICE_NAME="photo-gallery"

# 检查服务是否存在
if ! systemctl list-unit-files | grep -q "$SERVICE_NAME.service"; then
    echo -e "${RED}✗ 服务 $SERVICE_NAME 不存在${NC}"
    echo "请先运行部署脚本: ./deploy.sh 或 ./fix_service_py2.sh"
    exit 1
fi

# 服务状态
echo -e "${BLUE}1. 服务状态:${NC}"
echo "-----------------------------------"
sudo systemctl status $SERVICE_NAME --no-pager -l
echo ""

# 检查服务是否运行
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    echo -e "${GREEN}✓ 服务运行中${NC}"
    STATUS="运行中"
else
    echo -e "${RED}✗ 服务已停止${NC}"
    STATUS="已停止"
fi
echo ""

# 端口监听
echo -e "${BLUE}2. 端口监听:${NC}"
echo "-----------------------------------"
if command -v netstat &> /dev/null; then
    sudo netstat -tulpn | grep 5000 || echo "端口 5000 未监听"
elif command -v ss &> /dev/null; then
    sudo ss -tulpn | grep 5000 || echo "端口 5000 未监听"
else
    echo "无法检查端口状态（需要 netstat 或 ss）"
fi
echo ""

# 进程信息
echo -e "${BLUE}3. 进程信息:${NC}"
echo "-----------------------------------"
ps aux | grep -E "gunicorn|python.*app.py" | grep -v grep || echo "未找到相关进程"
echo ""

# 最近日志
echo -e "${BLUE}4. 最近日志（最后 20 行）:${NC}"
echo "-----------------------------------"
sudo journalctl -u $SERVICE_NAME -n 20 --no-pager
echo ""

# 磁盘使用情况
echo -e "${BLUE}5. 照片存储:${NC}"
echo "-----------------------------------"
if [ -d "uploads" ]; then
    PHOTO_COUNT=$(find uploads -type f 2>/dev/null | wc -l)
    UPLOAD_SIZE=$(du -sh uploads 2>/dev/null | cut -f1)
    echo "照片数量: $PHOTO_COUNT 张"
    echo "存储空间: $UPLOAD_SIZE"
else
    echo "uploads 目录不存在"
fi
echo ""

# 服务器信息
echo -e "${BLUE}6. 服务器信息:${NC}"
echo "-----------------------------------"
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "服务器 IP: $SERVER_IP"
echo "访问地址: http://$SERVER_IP:5000"
echo "本地地址: http://localhost:5000"
echo ""

# 系统资源
echo -e "${BLUE}7. 系统资源:${NC}"
echo "-----------------------------------"
echo "内存使用:"
free -h | grep -E "Mem:|内存:" || free -h | head -2
echo ""
echo "磁盘使用:"
df -h | grep -E "/$|/data" | head -3 || df -h / | tail -1
echo ""

# 快捷命令
echo "================================"
echo -e "${BLUE}快捷命令:${NC}"
echo "================================"
echo "启动服务: ./start_service.sh 或 sudo systemctl start $SERVICE_NAME"
echo "停止服务: ./stop.sh 或 sudo systemctl stop $SERVICE_NAME"
echo "重启服务: ./restart_service.sh 或 sudo systemctl restart $SERVICE_NAME"
echo "查看日志: sudo journalctl -u $SERVICE_NAME -f"
echo "查看状态: ./status.sh"
echo ""

# 总结
echo "================================"
echo -e "${BLUE}服务总结:${NC}"
echo "================================"
echo "服务名称: $SERVICE_NAME"
echo "服务状态: $STATUS"
echo "照片数量: $PHOTO_COUNT 张"
echo "访问地址: http://$SERVER_IP:5000"
echo ""

