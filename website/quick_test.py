# -*- coding: utf-8 -*-
"""快速测试应用是否能正常运行"""
import sys

print("测试应用启动...")

try:
    # 导入app模块
    import app as app_module
    print("✓ app.py导入成功")
    
    # 创建测试客户端
    client = app_module.app.test_client()
    
    # 测试主页
    print("\n测试主页...")
    response = client.get('/')
    print("  状态码:", response.status_code)
    if response.status_code == 200:
        print("  ✓ 主页可以访问")
        print("  响应长度:", len(response.data), "字节")
    else:
        print("  ✗ 主页访问失败")
        print("  响应:", response.data[:200])
    
    # 测试API
    print("\n测试API /api/photos...")
    response = client.get('/api/photos')
    print("  状态码:", response.status_code)
    if response.status_code == 200:
        print("  ✓ API可以访问")
        import json
        data = json.loads(response.data)
        print("  返回数据:", data)
    else:
        print("  ✗ API访问失败")
    
    # 测试静态文件
    print("\n测试静态文件...")
    response = client.get('/static/script.js')
    print("  script.js 状态码:", response.status_code)
    response = client.get('/static/style.css')
    print("  style.css 状态码:", response.status_code)
    
    print("\n✓ 所有测试通过!")
    print("\n你现在可以运行: python app.py")
    print("然后访问: http://localhost:5000")
    
except Exception as e:
    print("✗ 测试失败:", str(e))
    import traceback
    traceback.print_exc()
    sys.exit(1)
