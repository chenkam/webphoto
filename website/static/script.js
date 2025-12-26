// ==================== 全局变量 ====================
var currentPhotos = [];
var currentPhotoIndex = 0;
var autoPlayInterval = null;
var isAutoPlaying = false;

// ==================== 页面加载完成后初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化');
    init();
});

function init() {
    // 绑定导航
    setupNavigation();
    
    // 绑定上传
    setupUpload();
    
    // 绑定控制按钮
    setupControls();
    
    // 绑定空状态上传按钮
    var emptyUploadBtn = document.getElementById('emptyUploadBtn');
    if (emptyUploadBtn) {
        emptyUploadBtn.addEventListener('click', function() {
            switchPage('upload');
        });
    }
    
    // 加载照片
    switchPage('gallery');
}

// ==================== 导航 ====================
function setupNavigation() {
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var page = this.dataset.page;
            console.log('切换到页面:', page);
            switchPage(page);
        });
    });
    
    var navToggle = document.getElementById('navToggle');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            var navMenu = document.querySelector('.nav-menu');
            navMenu.classList.toggle('active');
        });
    }
}

function switchPage(pageName) {
    console.log('switchPage:', pageName);
    
    // 更新导航
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // 切换页面
    var galleryPage = document.getElementById('galleryPage');
    var uploadPage = document.getElementById('uploadPage');
    
    if (pageName === 'gallery') {
        galleryPage.classList.add('active');
        uploadPage.classList.remove('active');
        loadPhotos();
    } else if (pageName === 'upload') {
        galleryPage.classList.remove('active');
        uploadPage.classList.add('active');
    }
}

// ==================== 上传 ====================
function setupUpload() {
    var uploadForm = document.getElementById('uploadForm');
    var photoInput = document.getElementById('photoInput');
    var fileDropArea = document.getElementById('fileDropArea');
    var filePreview = document.getElementById('filePreview');
    var previewImage = document.getElementById('previewImage');
    var removePreview = document.getElementById('removePreview');
    
    // 文件选择
    photoInput.addEventListener('change', function() {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                filePreview.style.display = 'block';
                fileDropArea.querySelector('.file-drop-content').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 移除预览
    removePreview.addEventListener('click', function(e) {
        e.stopPropagation();
        photoInput.value = '';
        filePreview.style.display = 'none';
        fileDropArea.querySelector('.file-drop-content').style.display = 'block';
    });
    
    // 拖拽上传
    fileDropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    fileDropArea.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });
    
    fileDropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        var files = e.dataTransfer.files;
        if (files.length > 0) {
            photoInput.files = files;
            photoInput.dispatchEvent(new Event('change'));
        }
    });
    
    // 表单提交
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleUpload();
    });
}

function handleUpload() {
    console.log('开始上传');
    var uploadBtn = document.getElementById('uploadBtn');
    var uploadMessage = document.getElementById('uploadMessage');
    var formData = new FormData(document.getElementById('uploadForm'));
    
    uploadBtn.disabled = true;
    uploadBtn.querySelector('.btn-text').style.display = 'none';
    uploadBtn.querySelector('.loader').style.display = 'inline-block';
    
    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        if (result.success) {
            showMessage(uploadMessage, 'success', '上传成功！');
            document.getElementById('uploadForm').reset();
            document.getElementById('filePreview').style.display = 'none';
            document.querySelector('.file-drop-content').style.display = 'block';
            setTimeout(function() {
                switchPage('gallery');
            }, 1500);
        } else {
            showMessage(uploadMessage, 'error', '上传失败: ' + result.error);
        }
    })
    .catch(function(error) {
        showMessage(uploadMessage, 'error', '上传失败: ' + error.message);
    })
    .finally(function() {
        uploadBtn.disabled = false;
        uploadBtn.querySelector('.btn-text').style.display = 'flex';
        uploadBtn.querySelector('.loader').style.display = 'none';
    });
}

function showMessage(element, type, text) {
    element.className = 'message ' + type;
    element.textContent = text;
    element.style.display = 'block';
    setTimeout(function() {
        element.style.display = 'none';
    }, 5000);
}

// ==================== 加载和显示照片 ====================
function loadPhotos() {
    console.log('loadPhotos: 开始加载');
    
    var loadingSpinner = document.getElementById('loadingSpinner');
    var emptyMessage = document.getElementById('emptyMessage');
    var fullscreenGallery = document.getElementById('fullscreenGallery');
    var navPhotoCount = document.getElementById('navPhotoCount');
    
    // 显示加载动画，隐藏其他
    if (loadingSpinner) loadingSpinner.style.display = 'block';
    if (emptyMessage) emptyMessage.style.display = 'none';
    if (fullscreenGallery) fullscreenGallery.style.display = 'none';
    
    console.log('发送 API 请求: /api/photos');
    
    fetch('/api/photos')
        .then(function(response) {
            console.log('收到响应, 状态码:', response.status);
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            return response.json();
        })
        .then(function(result) {
            console.log('API返回数据:', JSON.stringify(result));
            
            // 隐藏加载动画
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            
            if (result && result.success) {
                currentPhotos = result.photos || [];
                if (navPhotoCount) navPhotoCount.textContent = currentPhotos.length;
                
                console.log('成功获取照片, 数量:', currentPhotos.length);
                
                if (currentPhotos.length === 0) {
                    console.log('照片列表为空，显示空状态');
                    if (emptyMessage) emptyMessage.style.display = 'block';
                    if (fullscreenGallery) fullscreenGallery.style.display = 'none';
                } else {
                    console.log('开始显示照片画廊');
                    if (emptyMessage) emptyMessage.style.display = 'none';
                    if (fullscreenGallery) fullscreenGallery.style.display = 'block';
                    currentPhotoIndex = 0;
                    showPhoto(0);
                }
            } else {
                console.error('API返回失败:', result);
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                if (emptyMessage) {
                    emptyMessage.style.display = 'block';
                    var h3 = emptyMessage.querySelector('h3');
                    var p = emptyMessage.querySelector('p');
                    if (h3) h3.textContent = '加载失败';
                    if (p) p.textContent = (result && result.error) || '未知错误';
                }
            }
        })
        .catch(function(error) {
            console.error('请求失败:', error);
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            if (emptyMessage) {
                emptyMessage.style.display = 'block';
                var h3 = emptyMessage.querySelector('h3');
                var p = emptyMessage.querySelector('p');
                if (h3) h3.textContent = '网络错误';
                if (p) p.textContent = error.message || '请检查网络连接';
            }
        });
}

function showPhoto(index) {
    console.log('showPhoto called, index:', index);
    
    if (!currentPhotos || currentPhotos.length === 0) {
        console.log('没有照片可显示');
        return;
    }
    
    // 循环索引
    if (index < 0) index = currentPhotos.length - 1;
    if (index >= currentPhotos.length) index = 0;
    
    currentPhotoIndex = index;
    var photo = currentPhotos[index];
    
    if (!photo || !photo.url) {
        console.error('照片数据无效:', photo);
        return;
    }
    
    console.log('显示照片', (index + 1) + '/' + currentPhotos.length, 'URL:', photo.url);
    
    // 获取图片元素
    var img = document.getElementById('fullscreenImage');
    if (!img) {
        console.error('找不到 fullscreenImage 元素');
        return;
    }
    
    // 先设置事件处理器，再设置 src（避免缓存图片错过事件）
    img.onload = function() {
        console.log('图片加载成功:', photo.url);
        img.style.opacity = '1';
    };
    
    img.onerror = function() {
        console.error('图片加载失败:', photo.url);
        img.style.opacity = '1';  // 即使失败也显示（可能是破损图标）
    };
    
    // 淡出效果
    img.style.opacity = '0';
    
    // 设置新图片源
    img.src = photo.url;
    
    // 更新计数器
    var currentNum = document.getElementById('currentPhotoNum');
    var totalNum = document.getElementById('totalPhotoNum');
    if (currentNum) currentNum.textContent = index + 1;
    if (totalNum) totalNum.textContent = currentPhotos.length;
    
    console.log('showPhoto完成, 等待图片加载');
}

// ==================== 控制按钮 ====================
function setupControls() {
    // 上一张
    var prevBtn = document.getElementById('prevPhotoBtn');
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            showPhoto(currentPhotoIndex - 1);
        });
    }
    
    // 下一张
    var nextBtn = document.getElementById('nextPhotoBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            showPhoto(currentPhotoIndex + 1);
        });
    }
    
    // 自动播放
    var playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', toggleAutoPlay);
    }
    
    // 删除
    var deleteBtn = document.getElementById('deletePhotoBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteCurrentPhoto);
    }
    
    // 键盘控制
    document.addEventListener('keydown', function(e) {
        var galleryPage = document.getElementById('galleryPage');
        if (galleryPage && galleryPage.classList.contains('active') && currentPhotos.length > 0) {
            if (e.key === 'ArrowLeft') {
                showPhoto(currentPhotoIndex - 1);
            } else if (e.key === 'ArrowRight') {
                showPhoto(currentPhotoIndex + 1);
            } else if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                toggleAutoPlay();
            }
        }
    });
    
    // 鼠标滚轮
    document.addEventListener('wheel', function(e) {
        var galleryPage = document.getElementById('galleryPage');
        if (galleryPage && galleryPage.classList.contains('active') && currentPhotos.length > 0) {
            if (e.deltaY > 0) {
                showPhoto(currentPhotoIndex + 1);
            } else if (e.deltaY < 0) {
                showPhoto(currentPhotoIndex - 1);
            }
        }
    }, { passive: true });
    
    // 触摸滑动
    var touchStartX = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        var touchEndX = e.changedTouches[0].screenX;
        var galleryPage = document.getElementById('galleryPage');
        if (galleryPage && galleryPage.classList.contains('active') && currentPhotos.length > 0) {
            if (touchEndX < touchStartX - 50) {
                showPhoto(currentPhotoIndex + 1);
            } else if (touchEndX > touchStartX + 50) {
                showPhoto(currentPhotoIndex - 1);
            }
        }
    }, { passive: true });
}

function toggleAutoPlay() {
    var playPauseBtn = document.getElementById('playPauseBtn');
    if (isAutoPlaying) {
        isAutoPlaying = false;
        playPauseBtn.classList.remove('playing');
        playPauseBtn.querySelector('span').textContent = '▶';
        playPauseBtn.title = '自动播放';
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        console.log('停止自动播放');
    } else {
        isAutoPlaying = true;
        playPauseBtn.classList.add('playing');
        playPauseBtn.querySelector('span').textContent = '⏸';
        playPauseBtn.title = '暂停';
        autoPlayInterval = setInterval(function() {
            showPhoto(currentPhotoIndex + 1);
        }, 3000);
        console.log('开始自动播放');
    }
}

function deleteCurrentPhoto() {
    if (currentPhotos.length === 0) return;
    
    var photo = currentPhotos[currentPhotoIndex];
    
    if (!confirm('确定要删除这张照片吗？')) {
        return;
    }
    
    console.log('删除照片:', photo.id);
    
    // 停止自动播放
    if (isAutoPlaying) {
        toggleAutoPlay();
    }
    
    var deleteBtn = document.getElementById('deletePhotoBtn');
    deleteBtn.disabled = true;
    
    fetch('/api/photos/' + photo.id, {
        method: 'DELETE'
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        if (result.success) {
            console.log('删除成功');
            currentPhotos.splice(currentPhotoIndex, 1);
            document.getElementById('navPhotoCount').textContent = currentPhotos.length;
            
            if (currentPhotos.length === 0) {
                document.getElementById('fullscreenGallery').style.display = 'none';
                document.getElementById('emptyMessage').style.display = 'block';
            } else {
                if (currentPhotoIndex >= currentPhotos.length) {
                    currentPhotoIndex = currentPhotos.length - 1;
                }
                showPhoto(currentPhotoIndex);
            }
        } else {
            alert('删除失败: ' + result.error);
        }
    })
    .catch(function(error) {
        alert('删除失败: ' + error.message);
    })
    .finally(function() {
        deleteBtn.disabled = false;
    });
}
