#!/bin/bash

# 快速测试脚本

echo "================================"
echo "  快速测试应用"
echo "================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0

test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
        ((PASS_COUNT++))
    else
        echo -e "${RED}✗ $2${NC}"
        ((FAIL_COUNT++))
    fi
}

# 测试 1: 检查虚拟环境
echo "测试 1: 检查虚拟环境..."
if [ -d "venv" ]; then
    test_result 0 "虚拟环境存在"
else
    test_result 1 "虚拟环境不存在"
fi

# 测试 2: 检查 Flask
echo ""
echo "测试 2: 检查 Flask..."
source venv/bin/activate 2>/dev/null
python -c "import flask; print('Flask version:', flask.__version__)" 2>/dev/null
test_result $? "Flask 已安装"

# 测试 3: 测试应用导入
echo ""
echo "测试 3: 测试应用导入..."
python -c "from app import app; print('App loaded')" 2>/dev/null
test_result $? "应用可以导入"

# 测试 4: 检查目录
echo ""
echo "测试 4: 检查目录..."
if [ -d "uploads" ] && [ -d "logs" ] && [ -d "templates" ] && [ -d "static" ]; then
    test_result 0 "必要目录存在"
else
    test_result 1 "缺少必要目录"
    echo "  创建目录..."
    mkdir -p uploads logs templates static
fi

# 测试 5: 检查文件
echo ""
echo "测试 5: 检查关键文件..."
if [ -f "templates/index.html" ] && [ -f "static/script.js" ] && [ -f "static/style.css" ]; then
    test_result 0 "前端文件存在"
else
    test_result 1 "缺少前端文件"
fi

# 测试 6: 测试 API（如果服务在运行）
echo ""
echo "测试 6: 测试 API..."
if curl -s http://localhost:5000/api/photos > /dev/null 2>&1; then
    test_result 0 "API 可访问"
else
    test_result 1 "API 不可访问（服务可能未运行）"
fi

# 测试 7: 检查日志
echo ""
echo "测试 7: 检查日志系统..."
if [ -d "logs" ]; then
    if ls logs/*.log 1> /dev/null 2>&1; then
        test_result 0 "日志文件存在"
        echo "  最近日志:"
        tail -n 3 logs/app.log 2>/dev/null || echo "  （暂无日志）"
    else
        test_result 1 "日志文件不存在（应用可能未运行）"
    fi
else
    test_result 1 "日志目录不存在"
fi

# 总结
echo ""
echo "================================"
echo "测试完成"
echo "================================"
echo -e "${GREEN}通过: $PASS_COUNT${NC}"
echo -e "${RED}失败: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}所有测试通过！应用状态良好。${NC}"
    exit 0
else
    echo -e "${YELLOW}部分测试失败，请检查上述问题。${NC}"
    echo ""
    echo "建议操作:"
    echo "1. 重新部署: ./fix_service_py2.sh"
    echo "2. 重启服务: ./restart_service.sh"
    echo "3. 查看日志: ./view_logs.sh"
    exit 1
fi

