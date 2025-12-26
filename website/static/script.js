// DOM 元素
const uploadForm = document.getElementById('uploadForm');
const photoInput = document.getElementById('photoInput');
const fileName = document.getElementById('fileName');
const uploadBtn = document.getElementById('uploadBtn');
const uploadMessage = document.getElementById('uploadMessage');
const gallery = document.getElementById('gallery');
const photoCount = document.getElementById('photoCount');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyMessage = document.getElementById('emptyMessage');
const photoModal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const modalOriginalName = document.getElementById('modalOriginalName');
const modalDescription = document.getElementById('modalDescription');
const modalTime = document.getElementById('modalTime');
const deleteBtn = document.getElementById('deleteBtn');
const closeModal = document.querySelector('.close');

let currentPhotoId = null;

// 显示选择的文件名
photoInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        fileName.textContent = `已选择: ${e.target.files[0].name}`;
    } else {
        fileName.textContent = '';
    }
});

// 上传表单提交
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(uploadForm);
    
    // 禁用按钮并显示加载状态
    uploadBtn.disabled = true;
    uploadBtn.querySelector('.btn-text').style.display = 'none';
    uploadBtn.querySelector('.loader').style.display = 'inline-block';
    uploadMessage.style.display = 'none';
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('success', '照片上传成功！');
            uploadForm.reset();
            fileName.textContent = '';
            loadPhotos(); // 重新加载照片列表
        } else {
            showMessage('error', `上传失败: ${result.error}`);
        }
    } catch (error) {
        showMessage('error', `上传失败: ${error.message}`);
    } finally {
        // 恢复按钮状态
        uploadBtn.disabled = false;
        uploadBtn.querySelector('.btn-text').style.display = 'inline';
        uploadBtn.querySelector('.loader').style.display = 'none';
    }
});

// 显示消息
function showMessage(type, text) {
    uploadMessage.className = `message ${type}`;
    uploadMessage.textContent = text;
    uploadMessage.style.display = 'block';
    
    setTimeout(() => {
        uploadMessage.style.display = 'none';
    }, 5000);
}

// 加载照片列表
async function loadPhotos() {
    loadingSpinner.style.display = 'block';
    gallery.innerHTML = '';
    emptyMessage.style.display = 'none';
    
    try {
        const response = await fetch('/api/photos');
        const result = await response.json();
        
        if (result.success) {
            const photos = result.photos;
            photoCount.textContent = photos.length;
            
            if (photos.length === 0) {
                emptyMessage.style.display = 'block';
            } else {
                photos.forEach(photo => {
                    const photoItem = createPhotoItem(photo);
                    gallery.appendChild(photoItem);
                });
            }
        }
    } catch (error) {
        console.error('加载照片失败:', error);
        gallery.innerHTML = '<p style="text-align: center; color: #e74c3c;">加载照片失败，请刷新页面重试</p>';
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

// 创建照片项
function createPhotoItem(photo) {
    const div = document.createElement('div');
    div.className = 'photo-item';
    div.onclick = () => openModal(photo);
    
    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = photo.original_name;
    img.loading = 'lazy';
    
    const info = document.createElement('div');
    info.className = 'photo-info';
    
    const title = document.createElement('h3');
    title.textContent = photo.original_name;
    
    const description = document.createElement('p');
    description.textContent = photo.description || '无描述';
    
    const time = document.createElement('div');
    time.className = 'photo-time';
    time.textContent = photo.upload_time;
    
    info.appendChild(title);
    info.appendChild(description);
    info.appendChild(time);
    
    div.appendChild(img);
    div.appendChild(info);
    
    return div;
}

// 打开模态框
function openModal(photo) {
    currentPhotoId = photo.id;
    modalImage.src = photo.url;
    modalOriginalName.textContent = photo.original_name;
    modalDescription.textContent = photo.description || '无描述';
    modalTime.textContent = `上传时间: ${photo.upload_time}`;
    photoModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closePhotoModal() {
    photoModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentPhotoId = null;
}

closeModal.onclick = closePhotoModal;

// 点击模态框外部关闭
photoModal.onclick = (e) => {
    if (e.target === photoModal) {
        closePhotoModal();
    }
};

// ESC 键关闭模态框
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && photoModal.style.display === 'block') {
        closePhotoModal();
    }
});

// 删除照片
deleteBtn.addEventListener('click', async () => {
    if (!currentPhotoId) return;
    
    if (!confirm('确定要删除这张照片吗？此操作不可恢复。')) {
        return;
    }
    
    deleteBtn.disabled = true;
    deleteBtn.textContent = '删除中...';
    
    try {
        const response = await fetch(`/api/photos/${currentPhotoId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            closePhotoModal();
            loadPhotos(); // 重新加载照片列表
        } else {
            alert(`删除失败: ${result.error}`);
        }
    } catch (error) {
        alert(`删除失败: ${error.message}`);
    } finally {
        deleteBtn.disabled = false;
        deleteBtn.textContent = '删除照片';
    }
});

// 页面加载时加载照片
document.addEventListener('DOMContentLoaded', loadPhotos);

