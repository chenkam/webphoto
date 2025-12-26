#!/bin/bash

# 电子相册服务管理主脚本

echo "╔════════════════════════════════════════╗"
echo "║     电子相册 - 服务管理工具           ║"
echo "╚════════════════════════════════════════╝"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

SERVICE_NAME="photo-gallery"

# 检查服务是否存在
check_service() {
    if systemctl list-unit-files | grep -q "$SERVICE_NAME.service"; then
        return 0
    else
        return 1
    fi
}

# 检查服务状态
check_status() {
    if sudo systemctl is-active --quiet $SERVICE_NAME; then
        echo -e "${GREEN}●${NC} 运行中"
    else
        echo -e "${RED}●${NC} 已停止"
    fi
}

# 主菜单
show_menu() {
    clear
    echo "╔════════════════════════════════════════╗"
    echo "║     电子相册 - 服务管理工具           ║"
    echo "╚════════════════════════════════════════╝"
    echo ""
    
    if check_service; then
        echo -e "服务状态: $(check_status)"
        echo ""
    else
        echo -e "${RED}✗ 服务未安装${NC}"
        echo ""
        echo "请先运行部署脚本: ./deploy.sh 或 ./fix_service_py2.sh"
        echo ""
        exit 1
    fi
    
    echo "请选择操作:"
    echo ""
    echo -e "${GREEN}1)${NC} 启动服务"
    echo -e "${YELLOW}2)${NC} 停止服务"
    echo -e "${CYAN}3)${NC} 重启服务"
    echo -e "${BLUE}4)${NC} 查看状态"
    echo -e "${BLUE}5)${NC} 查看日志"
    echo ""
    echo -e "${YELLOW}6)${NC} 查看照片统计"
    echo -e "${CYAN}7)${NC} 备份数据"
    echo ""
    echo -e "${RED}0)${NC} 退出"
    echo ""
    echo -n "请输入选项 (0-7): "
}

# 启动服务
start_service() {
    echo ""
    echo "正在启动服务..."
    sudo systemctl start $SERVICE_NAME
    sleep 2
    if sudo systemctl is-active --quiet $SERVICE_NAME; then
        echo -e "${GREEN}✓ 服务启动成功${NC}"
        SERVER_IP=$(hostname -I | awk '{print $1}')
        echo "访问地址: http://$SERVER_IP:5000"
    else
        echo -e "${RED}✗ 服务启动失败${NC}"
        echo "查看日志: sudo journalctl -u $SERVICE_NAME -n 20"
    fi
    echo ""
    read -p "按回车键继续..."
}

# 停止服务
stop_service() {
    echo ""
    echo "正在停止服务..."
    sudo systemctl stop $SERVICE_NAME
    sleep 2
    if ! sudo systemctl is-active --quiet $SERVICE_NAME; then
        echo -e "${GREEN}✓ 服务已停止${NC}"
    else
        echo -e "${RED}✗ 服务停止失败${NC}"
    fi
    echo ""
    read -p "按回车键继续..."
}

# 重启服务
restart_service() {
    echo ""
    echo "正在重启服务..."
    sudo systemctl restart $SERVICE_NAME
    sleep 3
    if sudo systemctl is-active --quiet $SERVICE_NAME; then
        echo -e "${GREEN}✓ 服务重启成功${NC}"
        SERVER_IP=$(hostname -I | awk '{print $1}')
        echo "访问地址: http://$SERVER_IP:5000"
    else
        echo -e "${RED}✗ 服务重启失败${NC}"
        echo "查看日志: sudo journalctl -u $SERVICE_NAME -n 20"
    fi
    echo ""
    read -p "按回车键继续..."
}

# 查看状态
view_status() {
    echo ""
    sudo systemctl status $SERVICE_NAME --no-pager -l
    echo ""
    read -p "按回车键继续..."
}

# 查看日志
view_logs() {
    echo ""
    echo "最近 30 行日志:"
    echo "-----------------------------------"
    sudo journalctl -u $SERVICE_NAME -n 30 --no-pager
    echo ""
    echo "查看实时日志: sudo journalctl -u $SERVICE_NAME -f"
    echo ""
    read -p "按回车键继续..."
}

# 照片统计
photo_stats() {
    echo ""
    echo "照片统计信息"
    echo "-----------------------------------"
    if [ -d "uploads" ]; then
        PHOTO_COUNT=$(find uploads -type f 2>/dev/null | wc -l)
        UPLOAD_SIZE=$(du -sh uploads 2>/dev/null | cut -f1)
        echo "照片数量: $PHOTO_COUNT 张"
        echo "存储空间: $UPLOAD_SIZE"
        echo ""
        echo "最近上传的 5 张照片:"
        find uploads -type f -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -5 | awk '{print $2}' | xargs -I {} basename {}
    else
        echo "uploads 目录不存在"
    fi
    echo ""
    read -p "按回车键继续..."
}

# 备份数据
backup_data() {
    echo ""
    echo "备份数据"
    echo "-----------------------------------"
    BACKUP_NAME="photo-gallery-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    echo "备份文件名: $BACKUP_NAME"
    echo ""
    echo "正在备份..."
    tar -czf "$BACKUP_NAME" uploads/ metadata.json 2>/dev/null
    if [ $? -eq 0 ]; then
        BACKUP_SIZE=$(du -sh "$BACKUP_NAME" | cut -f1)
        echo -e "${GREEN}✓ 备份成功${NC}"
        echo "备份文件: $BACKUP_NAME"
        echo "文件大小: $BACKUP_SIZE"
        echo ""
        echo "恢复备份: tar -xzf $BACKUP_NAME"
    else
        echo -e "${RED}✗ 备份失败${NC}"
    fi
    echo ""
    read -p "按回车键继续..."
}

# 主循环
while true; do
    show_menu
    read choice
    
    case $choice in
        1) start_service ;;
        2) stop_service ;;
        3) restart_service ;;
        4) view_status ;;
        5) view_logs ;;
        6) photo_stats ;;
        7) backup_data ;;
        0)
            echo ""
            echo "退出管理工具"
            exit 0
            ;;
        *)
            echo ""
            echo -e "${RED}无效选项，请重新选择${NC}"
            sleep 1
            ;;
    esac
done

