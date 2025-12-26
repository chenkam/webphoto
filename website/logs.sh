#!/bin/bash

# 查看电子相册服务日志脚本

echo "================================"
echo "  电子相册服务日志"
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
    exit 1
fi

# 显示菜单
echo "请选择日志查看方式:"
echo ""
echo "1) 实时日志（按 Ctrl+C 退出）"
echo "2) 最近 50 行日志"
echo "3) 最近 100 行日志"
echo "4) 最近 200 行日志"
echo "5) 今天的日志"
echo "6) 错误日志"
echo "7) 所有日志"
echo ""
read -p "请输入选项 (1-7): " choice

echo ""
echo "================================"
echo ""

case $choice in
    1)
        echo -e "${GREEN}实时日志（按 Ctrl+C 退出）:${NC}"
        echo ""
        sudo journalctl -u $SERVICE_NAME -f
        ;;
    2)
        echo -e "${GREEN}最近 50 行日志:${NC}"
        echo ""
        sudo journalctl -u $SERVICE_NAME -n 50 --no-pager
        ;;
    3)
        echo -e "${GREEN}最近 100 行日志:${NC}"
        echo ""
        sudo journalctl -u $SERVICE_NAME -n 100 --no-pager
        ;;
    4)
        echo -e "${GREEN}最近 200 行日志:${NC}"
        echo ""
        sudo journalctl -u $SERVICE_NAME -n 200 --no-pager
        ;;
    5)
        echo -e "${GREEN}今天的日志:${NC}"
        echo ""
        sudo journalctl -u $SERVICE_NAME --since today --no-pager
        ;;
    6)
        echo -e "${GREEN}错误日志:${NC}"
        echo ""
        sudo journalctl -u $SERVICE_NAME -p err --no-pager
        ;;
    7)
        echo -e "${GREEN}所有日志:${NC}"
        echo ""
        sudo journalctl -u $SERVICE_NAME --no-pager
        ;;
    *)
        echo -e "${RED}无效选项${NC}"
        exit 1
        ;;
esac

echo ""
echo "================================"
echo ""
echo "其他日志命令:"
echo "  实时日志: sudo journalctl -u $SERVICE_NAME -f"
echo "  指定日期: sudo journalctl -u $SERVICE_NAME --since '2025-12-26'"
echo "  导出日志: sudo journalctl -u $SERVICE_NAME > logs.txt"
echo ""

