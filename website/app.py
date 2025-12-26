# -*- coding: utf-8 -*-
from __future__ import print_function, unicode_literals
from flask import Flask, render_template, request, jsonify, send_from_directory
import os
from werkzeug.utils import secure_filename
import json
from datetime import datetime
import uuid
import sys
import logging
from logging.handlers import TimedRotatingFileHandler

# Python 2/3 兼容性
if sys.version_info[0] < 3:
    reload(sys)
    sys.setdefaultencoding('utf-8')

app = Flask(__name__)

# 配置
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'webp'])
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB
METADATA_FILE = 'metadata.json'
LOG_FOLDER = 'logs'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'your-secret-key-change-in-production'

# 确保必要目录存在
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
if not os.path.exists(LOG_FOLDER):
    os.makedirs(LOG_FOLDER)

# 配置日志
def setup_logging():
    """配置日志系统"""
    # 创建日志格式
    log_format = logging.Formatter(
        '[%(asctime)s] %(levelname)s: %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # 按日期轮转的文件处理器
    file_handler = TimedRotatingFileHandler(
        os.path.join(LOG_FOLDER, 'app.log'),
        when='midnight',
        interval=1,
        backupCount=30
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(log_format)
    file_handler.suffix = '%Y-%m-%d'
    
    # 错误日志单独记录
    error_handler = TimedRotatingFileHandler(
        os.path.join(LOG_FOLDER, 'error.log'),
        when='midnight',
        interval=1,
        backupCount=30
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(log_format)
    error_handler.suffix = '%Y-%m-%d'
    
    # 控制台输出
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(log_format)
    
    # 配置 app 日志
    app.logger.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.addHandler(error_handler)
    app.logger.addHandler(console_handler)
    
    app.logger.info('=' * 60)
    app.logger.info('Photo Gallery Application Started')
    app.logger.info('=' * 60)

setup_logging()


def allowed_file(filename):
    """检查文件扩展名是否允许"""
    if not isinstance(filename, (str, unicode if sys.version_info[0] < 3 else str)):
        return False
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def load_metadata():
    """加载照片元数据"""
    if os.path.exists(METADATA_FILE):
        try:
            with open(METADATA_FILE, 'r') as f:
                content = f.read()
                if sys.version_info[0] < 3 and isinstance(content, str):
                    content = content.decode('utf-8')
                result = json.loads(content) if content else []
                app.logger.info('加载元数据: %d 张照片', len(result))
                return result
        except Exception as e:
            app.logger.error('加载元数据失败: %s', str(e))
            return []
    app.logger.info('元数据文件不存在，返回空列表')
    return []


def save_metadata(metadata):
    """保存照片元数据"""
    try:
        with open(METADATA_FILE, 'w') as f:
            content = json.dumps(metadata, ensure_ascii=False, indent=2)
            if sys.version_info[0] < 3:
                content = content.encode('utf-8')
            f.write(content)
        app.logger.info('保存元数据: %d 张照片', len(metadata))
    except Exception as e:
        app.logger.error('保存元数据失败: %s', str(e))


@app.route('/')
def index():
    """主页"""
    app.logger.info('访问主页')
    try:
        result = render_template('index.html')
        app.logger.info('主页渲染成功')
        return result
    except Exception as e:
        app.logger.error('渲染主页失败: %s', str(e), exc_info=True)
        return str(e), 500


@app.route('/debug')
def debug_page():
    """调试页面"""
    app.logger.info('访问调试页面')
    try:
        result = render_template('debug.html')
        app.logger.info('调试页面渲染成功')
        return result
    except Exception as e:
        app.logger.error('渲染调试页面失败: %s', str(e), exc_info=True)
        return str(e), 500


@app.route('/test')
def test_page():
    """JavaScript测试页面"""
    app.logger.info('访问测试页面')
    try:
        result = render_template('simple_test.html')
        app.logger.info('测试页面渲染成功')
        return result
    except Exception as e:
        app.logger.error('渲染测试页面失败: %s', str(e), exc_info=True)
        return str(e), 500


@app.route('/api/photos', methods=['GET'])
def get_photos():
    """获取所有照片列表"""
    try:
        app.logger.info('API: 请求照片列表')
        metadata = load_metadata()
        # 按上传时间倒序排列
        metadata.sort(key=lambda x: x.get('upload_time', ''), reverse=True)
        app.logger.info('API: 返回 %d 张照片', len(metadata))
        return jsonify({'success': True, 'photos': metadata})
    except Exception as e:
        app.logger.error('获取照片列表失败: %s', str(e), exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/upload', methods=['POST'])
def upload_photo():
    """上传照片"""
    app.logger.info('API: 收到上传请求')
    
    if 'photo' not in request.files:
        app.logger.warning('上传失败: 没有文件')
        return jsonify({'success': False, 'error': u'没有文件被上传'}), 400
    
    file = request.files['photo']
    
    if file.filename == '':
        app.logger.warning('上传失败: 文件名为空')
        return jsonify({'success': False, 'error': u'没有选择文件'}), 400
    
    if not allowed_file(file.filename):
        app.logger.warning('上传失败: 不支持的文件类型 %s', file.filename)
        return jsonify({'success': False, 'error': u'不支持的文件类型'}), 400
    
    try:
        # 生成唯一文件名
        original_filename = secure_filename(file.filename)
        ext = original_filename.rsplit('.', 1)[1].lower()
        unique_filename = "{}.{}".format(uuid.uuid4().hex, ext)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        app.logger.info('保存文件: %s -> %s', original_filename, unique_filename)
        
        # 保存文件
        file.save(filepath)
        
        # 获取描述
        description = request.form.get('description', '')
        if sys.version_info[0] < 3 and isinstance(description, str):
            description = description.decode('utf-8')
        
        # 保存元数据
        metadata = load_metadata()
        photo_info = {
            'id': unique_filename.rsplit('.', 1)[0],
            'filename': unique_filename,
            'original_name': original_filename,
            'description': description,
            'upload_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'url': '/uploads/{}'.format(unique_filename)
        }
        metadata.append(photo_info)
        save_metadata(metadata)
        
        app.logger.info('上传成功: %s', unique_filename)
        return jsonify({'success': True, 'photo': photo_info})
    
    except Exception as e:
        app.logger.error('上传失败: %s', str(e), exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/photos/<photo_id>', methods=['DELETE'])
def delete_photo(photo_id):
    """删除照片"""
    app.logger.info('API: 请求删除照片 %s', photo_id)
    
    try:
        metadata = load_metadata()
        photo = None
        for p in metadata:
            if p['id'] == photo_id:
                photo = p
                break
        
        if not photo:
            app.logger.warning('删除失败: 照片不存在 %s', photo_id)
            return jsonify({'success': False, 'error': u'照片不存在'}), 404
        
        # 删除文件
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], photo['filename'])
        if os.path.exists(filepath):
            os.remove(filepath)
            app.logger.info('删除文件: %s', filepath)
        
        # 更新元数据
        metadata = [p for p in metadata if p['id'] != photo_id]
        save_metadata(metadata)
        
        app.logger.info('删除成功: %s', photo_id)
        return jsonify({'success': True})
    
    except Exception as e:
        app.logger.error('删除照片失败: %s', str(e), exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """提供上传的文件"""
    try:
        app.logger.info('请求文件: %s', filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if not os.path.exists(filepath):
            app.logger.warning('文件不存在: %s', filename)
            return 'File not found', 404
        app.logger.info('返回文件: %s', filepath)
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        app.logger.error('访问文件失败 %s: %s', filename, str(e), exc_info=True)
        return str(e), 500


if __name__ == '__main__':
    app.logger.info('启动开发服务器: 0.0.0.0:5000')
    app.run(host='0.0.0.0', port=5000, debug=False)
