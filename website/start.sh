#!/bin/bash

# 快速启动脚本（开发模式）

echo "启动电子相册应用..."
echo ""

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "未找到虚拟环境，正在创建..."
    python3 -m venv venv
    source venv/bin/activate
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

