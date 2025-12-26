# 数据恢复指南

## 问题总结

✅ **应用代码完全正常！**

从测试结果看：
- Flask已正确安装（版本 2.0.3）
- 页面可以正常渲染
- API接口工作正常
- 静态文件可以访问

**当前状态**：
- `metadata.json` 是空的 `[]`
- `uploads/` 目录是空的（没有图片文件）

## 从部署服务器恢复数据

如果你的部署服务器上有数据，需要同步过来：

### 方法1：手动复制（推荐）

1. **复制图片文件**
   ```bash
   # 从服务器复制 uploads 目录下的所有图片
   # 例如：scp user@server:/path/to/website/uploads/* ./uploads/
   ```

2. **复制元数据文件**
   ```bash
   # 从服务器复制 metadata.json
   # 例如：scp user@server:/path/to/website/metadata.json ./metadata.json
   ```

### 方法2：使用你提供的数据

如果你有这条数据：
```json
{
  "id": "229275023c5d449ea275c3fb4248ba0f",
  "filename": "229275023c5d449ea275c3fb4248ba0f.jpeg",
  "original_name": "2bd52408d99eb9ecc11bdd444a9d9a6e.jpeg",
  "description": "",
  "upload_time": "2025-12-26 15:34:00",
  "url": "/uploads/229275023c5d449ea275c3fb4248ba0f.jpeg"
}
```

你需要：

1. **创建 metadata.json**：
   ```json
   [
     {
       "id": "229275023c5d449ea275c3fb4248ba0f",
       "filename": "229275023c5d449ea275c3fb4248ba0f.jpeg",
       "original_name": "2bd52408d99eb9ecc11bdd444a9d9a6e.jpeg",
       "description": "",
       "upload_time": "2025-12-26 15:34:00",
       "url": "/uploads/229275023c5d449ea275c3fb4248ba0f.jpeg"
     }
   ]
   ```

2. **复制对应的图片文件**到 `uploads/` 目录：
   - 文件名：`229275023c5d449ea275c3fb4248ba0f.jpeg`

## 快速测试是否正常工作

### 1. 启动应用
```bash
cd h:\website2\webphoto\website
python app.py
```

### 2. 访问页面
在浏览器打开：
- 主页（3D画廊）：http://localhost:5000
- 调试页面：http://localhost:5000/debug

### 3. 测试API
```bash
# PowerShell
Invoke-RestMethod -Uri http://localhost:5000/api/photos
```

## 如果还是看不到图片

检查以下几点：

### 1. 浏览器开发者工具（F12）
查看 Console 标签，看是否有JavaScript错误

### 2. Network 标签
- 查看 `/api/photos` 请求是否成功
- 查看返回的数据是否正确
- 查看图片请求（`/uploads/xxx.jpeg`）的状态码

### 3. 检查文件路径
确保：
- `metadata.json` 中的 `filename` 与 `uploads/` 目录中的实际文件名一致
- URL格式正确：`/uploads/文件名.扩展名`

## 常见错误排查

### 错误1：API返回照片列表为空
**原因**：metadata.json 是空的或格式错误  
**解决**：检查并修正 metadata.json 文件

### 错误2：图片404 Not Found
**原因**：uploads目录中没有对应的图片文件  
**解决**：确保图片文件存在，且文件名与metadata.json中记录的一致

### 错误3：页面显示"画廊空空如也"
**原因**：这是正常的空状态提示，说明没有照片  
**解决**：上传照片或从服务器同步数据

## 验证数据完整性脚本

运行以下命令验证数据：
```bash
python -c "
import json
import os

# 读取metadata
with open('metadata.json', 'r', encoding='utf-8') as f:
    photos = json.load(f)
    
print(f'元数据中有 {len(photos)} 张照片')

# 检查每张照片的文件是否存在
for photo in photos:
    filename = photo['filename']
    filepath = os.path.join('uploads', filename)
    exists = os.path.exists(filepath)
    status = '✓' if exists else '✗'
    print(f'{status} {filename}')
"
```

## 当前应用状态

✅ **所有修复已完成，应用可以正常运行**

已修复的问题：
1. ✅ Flask依赖已安装
2. ✅ 版本兼容性问题已解决
3. ✅ 日志功能正常
4. ✅ 页面渲染正常
5. ✅ API接口正常

**现在只需要添加数据（图片和元数据），应用就能完美工作！**
