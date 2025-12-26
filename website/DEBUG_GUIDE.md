# 🔍 调试指南

## 问题：页面一直转圈圈，照片不显示

### 快速排查步骤

#### 1. 打开浏览器开发者工具

**Chrome/Edge/Firefox:**
- 按 `F12` 或 `Ctrl+Shift+I` (Windows)
- 或 `Cmd+Option+I` (Mac)

#### 2. 查看控制台 (Console)

应该能看到以下日志：
```
开始加载照片...
API 返回结果: {success: true, photos: [...]}
找到 X 张照片
显示照片: /uploads/xxxxx.jpg
照片加载完成
```

### 常见问题和解决方案

#### 问题 1: 看到 "没有照片"

**原因**: 数据库中确实没有照片

**解决方案**:
```bash
# 检查 uploads 目录
ls -la uploads/

# 检查 metadata.json
cat metadata.json

# 如果为空，上传一张照片测试
```

#### 问题 2: 控制台显示 404 错误

**原因**: API 路由不正确或服务未启动

**解决方案**:
```bash
# 检查服务状态
./status.sh

# 重启服务
./restart_service.sh

# 查看日志
./logs.sh
```

#### 问题 3: 控制台显示 CORS 错误

**原因**: 跨域问题（不太可能）

**解决方案**: 确保在同一域名下访问

#### 问题 4: 照片加载失败

**原因**: 照片文件不存在或路径错误

**解决方案**:
```bash
# 检查照片文件是否存在
ls -la uploads/

# 检查 metadata.json 中的文件名是否匹配
cat metadata.json
```

#### 问题 5: JavaScript 错误

**原因**: 代码错误或浏览器不兼容

**解决方案**: 
- 查看控制台红色错误信息
- 尝试刷新页面 (Ctrl+F5 强制刷新)
- 清除浏览器缓存

### 详细调试步骤

#### Step 1: 测试 API 是否工作

在浏览器地址栏访问:
```
http://服务器IP:5000/api/photos
```

应该看到 JSON 格式的响应：
```json
{
  "success": true,
  "photos": [
    {
      "id": "abc123",
      "filename": "abc123.jpg",
      "url": "/uploads/abc123.jpg",
      ...
    }
  ]
}
```

#### Step 2: 测试照片文件是否可访问

在浏览器地址栏访问:
```
http://服务器IP:5000/uploads/文件名.jpg
```

应该能看到照片。

#### Step 3: 检查 JavaScript 控制台

打开开发者工具的 Console 标签，应该看到调试日志。

如果看到错误，请记录错误信息。

#### Step 4: 检查 Network 标签

1. 打开开发者工具的 Network 标签
2. 刷新页面
3. 查找 `/api/photos` 请求
4. 检查状态码（应该是 200）
5. 查看响应内容

### 手动测试命令

#### 测试 Flask 应用

```bash
cd /data/home/webs/webphoto/website

# 激活虚拟环境
source venv/bin/activate

# 测试导入
python << 'EOF'
from app import app
print("Flask app OK")
EOF

# 测试 API
python << 'EOF'
from app import app
with app.test_client() as client:
    response = client.get('/api/photos')
    print(response.get_json())
EOF
```

#### 测试文件权限

```bash
# 检查 uploads 目录权限
ls -la uploads/

# 应该看到类似:
# drwxr-xr-x 2 user user 4096 Dec 26 14:30 uploads

# 检查照片文件权限
ls -la uploads/*.jpg

# 应该看到类似:
# -rw-r--r-- 1 user user 12345 Dec 26 14:30 photo.jpg
```

### 清除缓存

有时候浏览器缓存会导致问题：

1. **Chrome/Edge**: 
   - `Ctrl+Shift+Delete`
   - 选择"缓存的图片和文件"
   - 点击"清除数据"

2. **Firefox**:
   - `Ctrl+Shift+Delete`
   - 选择"缓存"
   - 点击"立即清除"

3. **强制刷新**:
   - `Ctrl+F5` (Windows)
   - `Cmd+Shift+R` (Mac)

### 检查浏览器兼容性

推荐使用以下浏览器：
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

如果使用旧版浏览器，请升级。

### 如果问题仍未解决

#### 收集信息

1. **浏览器控制台日志**
   - 截图或复制所有日志

2. **Network 请求**
   - 截图 `/api/photos` 请求的详情

3. **服务器日志**
   ```bash
   sudo journalctl -u photo-gallery -n 100
   ```

4. **系统信息**
   ```bash
   ./status.sh > debug_info.txt
   ```

#### 重置应用

如果一切都不行，尝试完全重置：

```bash
# 停止服务
./stop.sh

# 重新部署
./fix_service_py2.sh

# 查看状态
./status.sh
```

### 紧急修复命令

```bash
# 1. 停止服务
./stop.sh

# 2. 检查文件
ls -la uploads/
cat metadata.json

# 3. 清理缓存
rm -rf __pycache__
rm -f *.pyc

# 4. 重启服务
./start_service.sh

# 5. 查看日志
./logs.sh
```

### 测试上传功能

如果画廊是空的，尝试上传一张测试照片：

1. 点击顶部"上传照片"
2. 选择一张图片
3. 点击"上传到画廊"
4. 查看是否成功

### 常见错误代码

| 错误 | 说明 | 解决方案 |
|------|------|----------|
| 404 | 找不到资源 | 检查服务是否运行 |
| 500 | 服务器错误 | 查看服务器日志 |
| 403 | 权限不足 | 检查文件权限 |
| CORS | 跨域问题 | 使用正确的URL |

### 联系支持

如果以上方法都无法解决，请提供：

1. 浏览器控制台的完整日志
2. Network 标签的请求详情
3. 服务器日志 (最近100行)
4. 系统信息 (./status.sh 输出)

---

**祝调试顺利！** 🔍

