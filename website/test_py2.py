# -*- coding: utf-8 -*-
"""
Python 2 兼容性测试脚本
"""
from __future__ import print_function

def test_import():
    """测试模块导入"""
    print("测试 1: 导入模块...")
    try:
        from app import app
        print("✓ Flask 应用导入成功")
        return True
    except Exception as e:
        print("✗ 导入失败:", str(e))
        return False

def test_flask_version():
    """测试 Flask 版本"""
    print("\n测试 2: 检查 Flask 版本...")
    try:
        import flask
        print("✓ Flask 版本:", flask.__version__)
        return True
    except Exception as e:
        print("✗ 检查失败:", str(e))
        return False

def test_werkzeug_version():
    """测试 Werkzeug 版本"""
    print("\n测试 3: 检查 Werkzeug 版本...")
    try:
        import werkzeug
        print("✓ Werkzeug 版本:", werkzeug.__version__)
        return True
    except Exception as e:
        print("✗ 检查失败:", str(e))
        return False

def test_encoding():
    """测试编码处理"""
    print("\n测试 4: 测试编码处理...")
    try:
        import sys
        test_str = u"测试中文字符"
        print("✓ Unicode 字符串:", test_str)
        print("✓ Python 版本:", sys.version)
        return True
    except Exception as e:
        print("✗ 编码测试失败:", str(e))
        return False

def test_app_config():
    """测试应用配置"""
    print("\n测试 5: 检查应用配置...")
    try:
        from app import app, UPLOAD_FOLDER, ALLOWED_EXTENSIONS
        print("✓ 上传目录:", UPLOAD_FOLDER)
        print("✓ 允许的扩展名:", ALLOWED_EXTENSIONS)
        print("✓ SECRET_KEY:", "已设置" if app.config.get('SECRET_KEY') else "未设置")
        return True
    except Exception as e:
        print("✗ 配置检查失败:", str(e))
        return False

def test_functions():
    """测试应用函数"""
    print("\n测试 6: 测试应用函数...")
    try:
        from app import allowed_file, load_metadata, save_metadata
        
        # 测试 allowed_file
        assert allowed_file('test.jpg') == True, "jpg 应该被允许"
        assert allowed_file('test.txt') == False, "txt 不应该被允许"
        print("✓ allowed_file 函数工作正常")
        
        # 测试元数据函数
        metadata = load_metadata()
        print("✓ load_metadata 函数工作正常，当前照片数:", len(metadata))
        
        return True
    except Exception as e:
        print("✗ 函数测试失败:", str(e))
        import traceback
        traceback.print_exc()
        return False

def main():
    """主测试函数"""
    print("=" * 60)
    print("Python 2 兼容性测试")
    print("=" * 60)
    
    tests = [
        test_flask_version,
        test_werkzeug_version,
        test_encoding,
        test_import,
        test_app_config,
        test_functions,
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print("测试异常:", str(e))
            results.append(False)
    
    print("\n" + "=" * 60)
    print("测试结果: {}/{}  通过".format(sum(results), len(results)))
    print("=" * 60)
    
    if all(results):
        print("\n✓ 所有测试通过！应用可以正常运行。")
        return 0
    else:
        print("\n✗ 部分测试失败，请检查错误信息。")
        return 1

if __name__ == '__main__':
    import sys
    sys.exit(main())

