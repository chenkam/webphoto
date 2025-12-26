# -*- coding: utf-8 -*-
"""测试账号认证功能"""
from __future__ import print_function
import json
import os

def test_accounts_file():
    """测试账号文件是否存在"""
    print("=" * 60)
    print("测试账号配置文件")
    print("=" * 60)
    
    if not os.path.exists('accounts.json'):
        print("❌ accounts.json 文件不存在!")
        return False
    
    print("✅ accounts.json 文件存在")
    
    try:
        with open('accounts.json', 'r') as f:
            accounts = json.load(f)
        
        print("✅ accounts.json 格式正确")
        print("\n账号列表:")
        for i, account in enumerate(accounts, 1):
            print("  {}. 用户名: {}".format(i, account.get('username', '未设置')))
            if account.get('password'):
                print("     密码: {}".format('*' * len(account['password'])))
        
        return True
    
    except Exception as e:
        print("❌ 读取accounts.json失败:", str(e))
        return False


def test_app_imports():
    """测试应用导入"""
    print("\n" + "=" * 60)
    print("测试应用导入")
    print("=" * 60)
    
    try:
        from app import app, check_auth, load_accounts
        print("✅ Flask应用导入成功")
        print("✅ check_auth函数导入成功")
        print("✅ load_accounts函数导入成功")
        return True
    except ImportError as e:
        print("❌ 导入失败:", str(e))
        return False


def test_auth_function():
    """测试认证函数"""
    print("\n" + "=" * 60)
    print("测试认证功能")
    print("=" * 60)
    
    try:
        from app import check_auth
        
        # 测试正确的账号
        result = check_auth('cecilia', '20210427')
        if result:
            print("✅ 默认账号验证成功 (cecilia)")
        else:
            print("❌ 默认账号验证失败")
            return False
        
        # 测试错误的密码
        result = check_auth('cecilia', 'wrong_password')
        if not result:
            print("✅ 错误密码验证失败 (符合预期)")
        else:
            print("❌ 错误密码验证成功 (不应该通过)")
            return False
        
        # 测试不存在的用户
        result = check_auth('nonexistent', 'password')
        if not result:
            print("✅ 不存在的用户验证失败 (符合预期)")
        else:
            print("❌ 不存在的用户验证成功 (不应该通过)")
            return False
        
        return True
    
    except Exception as e:
        print("❌ 测试失败:", str(e))
        import traceback
        traceback.print_exc()
        return False


def test_required_files():
    """检查必需的文件"""
    print("\n" + "=" * 60)
    print("检查必需文件")
    print("=" * 60)
    
    files = {
        'app.py': '应用主文件',
        'accounts.json': '账号配置文件',
        'templates/index.html': 'HTML模板',
        'static/script.js': 'JavaScript文件',
        'static/style.css': 'CSS样式文件'
    }
    
    all_exist = True
    for filepath, description in files.items():
        if os.path.exists(filepath):
            print("✅ {} - {}".format(description, filepath))
        else:
            print("❌ {} - {} (不存在)".format(description, filepath))
            all_exist = False
    
    return all_exist


def main():
    print("\n" + "=" * 60)
    print("账号认证功能测试")
    print("=" * 60 + "\n")
    
    tests = [
        ('账号配置文件', test_accounts_file),
        ('必需文件', test_required_files),
        ('应用导入', test_app_imports),
        ('认证功能', test_auth_function),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print("\n❌ 测试 '{}' 出错: {}".format(name, str(e)))
            results.append((name, False))
    
    # 总结
    print("\n" + "=" * 60)
    print("测试总结")
    print("=" * 60)
    
    for name, result in results:
        status = "✅ 通过" if result else "❌ 失败"
        print("{}: {}".format(name, status))
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    print("\n总计: {}/{} 测试通过".format(passed, total))
    
    if passed == total:
        print("\n🎉 所有测试通过！可以启动应用了。")
        print("\n启动命令:")
        print("  python app.py")
        print("\n访问地址:")
        print("  http://localhost:5000")
        print("\n默认账号:")
        print("  用户名: cecilia")
        print("  密码: 20210427")
    else:
        print("\n⚠️ 有测试失败，请检查上述错误信息。")


if __name__ == '__main__':
    main()
