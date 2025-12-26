#!/bin/bash

# 查看应用日志脚本

echo "================================"
echo "  查看应用日志"
echo "================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

LOG_DIR="logs"

# 检查日志目录
if [ ! -d "$LOG_DIR" ]; then
    echo -e "${RED}日志目录不存在${NC}"
    exit 1
fi

# 显示菜单
echo "请选择要查看的日志:"
echo ""
echo "1) 今天的应用日志"
echo "2) 今天的错误日志"
echo "3) 所有应用日志"
echo "4) 所有错误日志"
echo "5) 实时监控应用日志"
echo "6) 实时监控错误日志"
echo "7) 列出所有日志文件"
echo ""
read -p "请输入选项 (1-7): " choice

echo ""
echo "================================"
echo ""

TODAY=$(date +%Y-%m-%d)
APP_LOG="$LOG_DIR/app.log"
ERROR_LOG="$LOG_DIR/error.log"
APP_LOG_TODAY="$LOG_DIR/app.log.$TODAY"
ERROR_LOG_TODAY="$LOG_DIR/error.log.$TODAY"

case $choice in
    1)
        echo -e "${GREEN}今天的应用日志:${NC}"
        echo ""
        if [ -f "$APP_LOG_TODAY" ]; then
            cat "$APP_LOG_TODAY"
        elif [ -f "$APP_LOG" ]; then
            grep "$(date +%Y-%m-%d)" "$APP_LOG" || echo "今天暂无日志"
        else
            echo "日志文件不存在"
        fi
        ;;
    2)
        echo -e "${GREEN}今天的错误日志:${NC}"
        echo ""
        if [ -f "$ERROR_LOG_TODAY" ]; then
            cat "$ERROR_LOG_TODAY"
        elif [ -f "$ERROR_LOG" ]; then
            grep "$(date +%Y-%m-%d)" "$ERROR_LOG" || echo "今天暂无错误"
        else
            echo "错误日志文件不存在"
        fi
        ;;
    3)
        echo -e "${GREEN}所有应用日志:${NC}"
        echo ""
        if [ -f "$APP_LOG" ]; then
            cat "$APP_LOG"
            echo ""
            # 查看归档日志
            for log in $LOG_DIR/app.log.*; do
                if [ -f "$log" ]; then
                    echo "=== $log ==="
                    cat "$log"
                    echo ""
                fi
            done
        else
            echo "日志文件不存在"
        fi
        ;;
    4)
        echo -e "${GREEN}所有错误日志:${NC}"
        echo ""
        if [ -f "$ERROR_LOG" ]; then
            cat "$ERROR_LOG"
            echo ""
            # 查看归档日志
            for log in $LOG_DIR/error.log.*; do
                if [ -f "$log" ]; then
                    echo "=== $log ==="
                    cat "$log"
                    echo ""
                fi
            done
        else
            echo "错误日志文件不存在"
        fi
        ;;
    5)
        echo -e "${GREEN}实时监控应用日志（按 Ctrl+C 退出）:${NC}"
        echo ""
        if [ -f "$APP_LOG" ]; then
            tail -f "$APP_LOG"
        else
            echo "日志文件不存在，等待创建..."
            touch "$APP_LOG"
            tail -f "$APP_LOG"
        fi
        ;;
    6)
        echo -e "${GREEN}实时监控错误日志（按 Ctrl+C 退出）:${NC}"
        echo ""
        if [ -f "$ERROR_LOG" ]; then
            tail -f "$ERROR_LOG"
        else
            echo "错误日志文件不存在，等待创建..."
            touch "$ERROR_LOG"
            tail -f "$ERROR_LOG"
        fi
        ;;
    7)
        echo -e "${GREEN}所有日志文件:${NC}"
        echo ""
        ls -lh "$LOG_DIR"
        ;;
    *)
        echo -e "${RED}无效选项${NC}"
        exit 1
        ;;
esac

echo ""
echo "================================"
echo ""
echo "日志目录: $LOG_DIR"
echo "清理旧日志: find $LOG_DIR -name '*.log.*' -mtime +30 -delete"
echo ""

