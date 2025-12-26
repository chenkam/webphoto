#!/bin/bash

# 快速启动脚本（开发模式 - Python 2）

echo "启动电子相册应用 (Python 2)..."
echo ""

# 检查 Python 版本
if command -v python2 &> /dev/null; then
    PYTHON_CMD=python2
elif command -v python &> /dev/null; then
    PYTHON_CMD=python
else
    echo "错误: 未找到 Python"
    exit 1
fi

echo "使用 Python: $($PYTHON_CMD --version 2>&1)"

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "未找到虚拟环境，正在创建..."
    if command -v virtualenv &> /dev/null; then
        virtualenv -p $PYTHON_CMD venv
    else
        echo "请先安装 virtualenv: pip install virtualenv"
        exit 1
    fi
    source venv/bin/activate
    pip install --upgrade "pip<21.0"
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# 创建必要的目录
mkdir -p uploads templates static

# 启动应用
echo "应用正在启动，请访问: http://localhost:5000"
echo "按 Ctrl+C 停止应用"
echo ""

python app.py

