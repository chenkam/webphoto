# -*- coding: utf-8 -*-
from __future__ import print_function, unicode_literals
from flask import Flask, render_template, request, jsonify, send_from_directory
import os
from werkzeug.utils import secure_filename
import json
from datetime import datetime
import uuid
import sys

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

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'your-secret-key-change-in-production'


# 确保上传目录存在
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


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
                return json.loads(content) if content else []
        except Exception as e:
            print("Error loading metadata: {}".format(str(e)))
            return []
    return []


def save_metadata(metadata):
    """保存照片元数据"""
    try:
        with open(METADATA_FILE, 'w') as f:
            content = json.dumps(metadata, ensure_ascii=False, indent=2)
            if sys.version_info[0] < 3:
                content = content.encode('utf-8')
            f.write(content)
    except Exception as e:
        print("Error saving metadata: {}".format(str(e)))


@app.route('/')
def index():
    """主页"""
    return render_template('index.html')


@app.route('/api/photos', methods=['GET'])
def get_photos():
    """获取所有照片列表"""
    metadata = load_metadata()
    # 按上传时间倒序排列
    metadata.sort(key=lambda x: x.get('upload_time', ''), reverse=True)
    return jsonify({'success': True, 'photos': metadata})


@app.route('/api/upload', methods=['POST'])
def upload_photo():
    """上传照片"""
    if 'photo' not in request.files:
        return jsonify({'success': False, 'error': u'没有文件被上传'}), 400
    
    file = request.files['photo']
    
    if file.filename == '':
        return jsonify({'success': False, 'error': u'没有选择文件'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'success': False, 'error': u'不支持的文件类型'}), 400
    
    try:
        # 生成唯一文件名
        original_filename = secure_filename(file.filename)
        ext = original_filename.rsplit('.', 1)[1].lower()
        unique_filename = "{}.{}".format(uuid.uuid4().hex, ext)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
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
        
        return jsonify({'success': True, 'photo': photo_info})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/photos/<photo_id>', methods=['DELETE'])
def delete_photo(photo_id):
    """删除照片"""
    try:
        metadata = load_metadata()
        photo = None
        for p in metadata:
            if p['id'] == photo_id:
                photo = p
                break
        
        if not photo:
            return jsonify({'success': False, 'error': u'照片不存在'}), 404
        
        # 删除文件
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], photo['filename'])
        if os.path.exists(filepath):
            os.remove(filepath)
        
        # 更新元数据
        metadata = [p for p in metadata if p['id'] != photo_id]
        save_metadata(metadata)
        
        return jsonify({'success': True})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """提供上传的文件"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

