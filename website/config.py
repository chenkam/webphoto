"""
应用配置文件
可以通过修改此文件来自定义应用设置
"""

import os

class Config:
    """应用配置类"""
    
    # Flask 配置
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-in-production'
    
    # 上传配置
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB
    
    # 元数据文件
    METADATA_FILE = 'metadata.json'
    
    # 服务器配置
    HOST = '0.0.0.0'
    PORT = 5000
    DEBUG = False
    
    # 安全配置
    # 设置为 True 时需要登录才能访问（需要实现认证功能）
    REQUIRE_AUTH = False

