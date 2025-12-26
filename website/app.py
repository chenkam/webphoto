from flask import Flask, render_template, request, jsonify, send_from_directory
import os
from werkzeug.utils import secure_filename
import json
from datetime import datetime
import uuid
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# 配置
UPLOAD_FOLDER = app.config['UPLOAD_FOLDER']
ALLOWED_EXTENSIONS = app.config['ALLOWED_EXTENSIONS']
METADATA_FILE = app.config['METADATA_FILE']

# 确保上传目录存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    """检查文件扩展名是否允许"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def load_metadata():
    """加载照片元数据"""
    if os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []


def save_metadata(metadata):
    """保存照片元数据"""
    with open(METADATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)


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
        return jsonify({'success': False, 'error': '没有文件被上传'}), 400
    
    file = request.files['photo']
    
    if file.filename == '':
        return jsonify({'success': False, 'error': '没有选择文件'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'success': False, 'error': '不支持的文件类型'}), 400
    
    try:
        # 生成唯一文件名
        original_filename = secure_filename(file.filename)
        ext = original_filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        # 保存文件
        file.save(filepath)
        
        # 获取描述
        description = request.form.get('description', '')
        
        # 保存元数据
        metadata = load_metadata()
        photo_info = {
            'id': unique_filename.rsplit('.', 1)[0],
            'filename': unique_filename,
            'original_name': original_filename,
            'description': description,
            'upload_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'url': f'/uploads/{unique_filename}'
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
        photo = next((p for p in metadata if p['id'] == photo_id), None)
        
        if not photo:
            return jsonify({'success': False, 'error': '照片不存在'}), 404
        
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
    app.run(host=app.config['HOST'], port=app.config['PORT'], debug=app.config['DEBUG'])

