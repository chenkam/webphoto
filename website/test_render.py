# -*- coding: utf-8 -*-
"""测试页面渲染和API"""
import sys
import os

print("=" * 60)
print("测试页面渲染")
print("=" * 60)

try:
    # 导入app
    import app as app_module
    print("✓ app模块导入成功\n")
    
    # 创建测试客户端
    client = app_module.app.test_client()
    
    # 测试1: 主页渲染
    print("1. 测试主页渲染...")
    response = client.get('/')
    print(f"   状态码: {response.status_code}")
    
    if response.status_code == 200:
        html = response.data.decode('utf-8')
        print(f"   ✓ 主页渲染成功，HTML长度: {len(html)} 字符")
        
        # 检查关键元素
        checks = [
            ('<!DOCTYPE html>', 'HTML文档声明'),
            ('<title>', '标题标签'),
            ('script.js', 'JavaScript文件引用'),
            ('style.css', 'CSS文件引用'),
            ('galleryPage', '画廊页面元素'),
            ('uploadPage', '上传页面元素'),
        ]
        
        print("\n   检查HTML内容:")
        for check, desc in checks:
            if check in html:
                print(f"      ✓ {desc}")
            else:
                print(f"      ✗ 缺少: {desc}")
    else:
        print(f"   ✗ 主页渲染失败")
        print(f"   响应: {response.data[:500]}")
    
    # 测试2: API /api/photos
    print("\n2. 测试 /api/photos API...")
    response = client.get('/api/photos')
    print(f"   状态码: {response.status_code}")
    
    if response.status_code == 200:
        import json
        data = json.loads(response.data)
        print(f"   ✓ API响应成功")
        print(f"   success: {data.get('success')}")
        print(f"   照片数量: {len(data.get('photos', []))}")
        
        if data.get('photos'):
            photo = data['photos'][0]
            print(f"\n   第一张照片信息:")
            print(f"      文件名: {photo.get('filename')}")
            print(f"      URL: {photo.get('url')}")
            print(f"      上传时间: {photo.get('upload_time')}")
    else:
        print(f"   ✗ API请求失败")
        print(f"   响应: {response.data}")
    
    # 测试3: 静态文件访问
    print("\n3. 测试静态文件...")
    for filename in ['script.js', 'style.css']:
        response = client.get(f'/static/{filename}')
        status = "✓" if response.status_code == 200 else "✗"
        print(f"   {status} {filename}: {response.status_code} ({len(response.data)} 字节)")
    
    # 测试4: 检查uploads目录
    print("\n4. 检查uploads目录...")
    if os.path.exists('uploads'):
        files = os.listdir('uploads')
        print(f"   上传文件数量: {len(files)}")
        for f in files[:5]:  # 只显示前5个
            size = os.path.getsize(os.path.join('uploads', f))
            print(f"      - {f} ({size} 字节)")
    else:
        print("   ✗ uploads目录不存在")
    
    # 测试5: 检查metadata.json
    print("\n5. 检查metadata.json...")
    if os.path.exists('metadata.json'):
        with open('metadata.json', 'r', encoding='utf-8') as f:
            content = f.read()
            import json
            metadata = json.loads(content) if content.strip() else []
            print(f"   ✓ 元数据文件存在，记录数: {len(metadata)}")
            
            if metadata:
                print(f"\n   元数据示例:")
                import json
                print(json.dumps(metadata[0], indent=4, ensure_ascii=False))
    else:
        print("   ✗ metadata.json不存在")
    
    print("\n" + "=" * 60)
    print("测试完成!")
    print("=" * 60)
    
except Exception as e:
    print(f"\n✗ 测试失败: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
