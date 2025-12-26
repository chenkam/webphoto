# -*- coding: utf-8 -*-
"""
启动诊断脚本 - 用于测试应用是否能正常启动
"""
from __future__ import print_function
import os
import sys

print("=" * 60)
print("Photo Gallery 启动诊断")
print("=" * 60)

# 1. 检查Python版本
print("\n1. Python版本:")
print("   版本:", sys.version)
print("   主版本:", sys.version_info[0])

# 2. 检查目录结构
print("\n2. 检查目录结构:")
required_dirs = ['uploads', 'logs', 'static', 'templates']
for dirname in required_dirs:
    exists = os.path.exists(dirname)
    print("   {}: {}".format(dirname, "✓ 存在" if exists else "✗ 不存在"))

# 3. 检查文件
print("\n3. 检查关键文件:")
required_files = ['app.py', 'metadata.json', 'static/script.js', 'static/style.css', 
                  'templates/index.html', 'templates/debug.html']
for filename in required_files:
    exists = os.path.exists(filename)
    print("   {}: {}".format(filename, "✓ 存在" if exists else "✗ 不存在"))

# 4. 测试导入Flask
print("\n4. 测试导入Flask:")
try:
    from flask import Flask, render_template, request, jsonify, send_from_directory
    print("   ✓ Flask导入成功")
    print("   Flask版本:", Flask.__version__ if hasattr(Flask, '__version__') else "未知")
except Exception as e:
    print("   ✗ Flask导入失败:", str(e))
    sys.exit(1)

# 5. 测试创建Flask应用
print("\n5. 测试创建Flask应用:")
try:
    test_app = Flask(__name__)
    print("   ✓ Flask应用创建成功")
except Exception as e:
    print("   ✗ Flask应用创建失败:", str(e))
    sys.exit(1)

# 6. 测试渲染模板
print("\n6. 测试渲染模板:")
try:
    with test_app.app_context():
        # 测试主页模板
        result = test_app.test_client().get('/')
        print("   主页状态码:", result.status_code)
        
        # 尝试访问静态文件
        static_result = test_app.test_client().get('/static/script.js')
        print("   静态文件(script.js)状态码:", static_result.status_code)
except Exception as e:
    print("   ✗ 测试失败:", str(e))

# 7. 尝试导入并启动实际应用
print("\n7. 测试导入app.py:")
try:
    # 临时导入
    import app as app_module
    print("   ✓ app.py导入成功")
    print("   应用名称:", app_module.app.name)
    print("   上传目录:", app_module.UPLOAD_FOLDER)
except Exception as e:
    print("   ✗ app.py导入失败:", str(e))
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("诊断完成!")
print("=" * 60)
print("\n提示: 如果所有检查都通过，可以运行:")
print("  python app.py")
print("  或")
print("  flask run --host=0.0.0.0 --port=5000")
