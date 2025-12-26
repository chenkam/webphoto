"""
简单的应用测试脚本
用于验证应用的基本功能是否正常
"""

import unittest
import os
import json
import tempfile
from app import app

class PhotoGalleryTestCase(unittest.TestCase):
    """测试用例类"""
    
    def setUp(self):
        """每个测试前的设置"""
        self.app = app
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
        
        # 创建临时上传目录
        self.temp_upload = tempfile.mkdtemp()
        self.app.config['UPLOAD_FOLDER'] = self.temp_upload
        
        # 创建临时元数据文件
        self.temp_metadata = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
        self.temp_metadata.write('[]')
        self.temp_metadata.close()
    
    def tearDown(self):
        """每个测试后的清理"""
        # 清理临时文件
        if os.path.exists(self.temp_metadata.name):
            os.remove(self.temp_metadata.name)
        
        # 清理上传目录
        for file in os.listdir(self.temp_upload):
            os.remove(os.path.join(self.temp_upload, file))
        os.rmdir(self.temp_upload)
    
    def test_index_page(self):
        """测试主页是否可访问"""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'<!DOCTYPE html>', response.data)
    
    def test_get_photos_empty(self):
        """测试获取空照片列表"""
        response = self.client.get('/api/photos')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertEqual(len(data['photos']), 0)
    
    def test_upload_no_file(self):
        """测试没有文件的上传请求"""
        response = self.client.post('/api/upload')
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertFalse(data['success'])
    
    def test_allowed_file_function(self):
        """测试文件扩展名验证"""
        from app import allowed_file
        
        # 允许的格式
        self.assertTrue(allowed_file('test.jpg'))
        self.assertTrue(allowed_file('test.png'))
        self.assertTrue(allowed_file('test.jpeg'))
        self.assertTrue(allowed_file('test.gif'))
        self.assertTrue(allowed_file('test.webp'))
        
        # 不允许的格式
        self.assertFalse(allowed_file('test.txt'))
        self.assertFalse(allowed_file('test.pdf'))
        self.assertFalse(allowed_file('test'))

def run_tests():
    """运行所有测试"""
    print("运行应用测试...")
    print("-" * 60)
    
    suite = unittest.TestLoader().loadTestsFromTestCase(PhotoGalleryTestCase)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print("-" * 60)
    if result.wasSuccessful():
        print("✓ 所有测试通过！")
        return 0
    else:
        print("✗ 部分测试失败")
        return 1

if __name__ == '__main__':
    exit_code = run_tests()
    exit(exit_code)

