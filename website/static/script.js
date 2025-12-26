// ==================== 全局变量 ====================
let currentPhotos = [];
let currentPhotoIndex = 0;
let autoPlayInterval = null;
let isAutoPlaying = false;

// ==================== DOM 元素 ====================
// 导航
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');
const navPhotoCount = document.getElementById('navPhotoCount');

// 页面
const galleryPage = document.getElementById('galleryPage');
const uploadPage = document.getElementById('uploadPage');

// 画廊
const fullscreenGallery = document.getElementById('fullscreenGallery');
const fullscreenImage = document.getElementById('fullscreenImage');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyMessage = document.getElementById('emptyMessage');
const currentPhotoNum = document.getElementById('currentPhotoNum');
const totalPhotoNum = document.getElementById('totalPhotoNum');

// 控制按钮
const prevPhotoBtn = document.getElementById('prevPhotoBtn');
const nextPhotoBtn = document.getElementById('nextPhotoBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const deletePhotoBtn = document.getElementById('deletePhotoBtn');

// 上传
const uploadForm = document.getElementById('uploadForm');
const photoInput = document.getElementById('photoInput');
const fileDropArea = document.getElementById('fileDropArea');
const filePreview = document.getElementById('filePreview');
const previewImage = document.getElementById('previewImage');
const removePreview = document.getElementById('removePreview');
const uploadBtn = document.getElementById('uploadBtn');
const uploadMessage = document.getElementById('uploadMessage');

// ==================== 页面切换 ====================
function switchPage(pageName) {
    navLinks.forEach(function(link) {
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    if (pageName === 'gallery') {
        galleryPage.classList.add('active');
        uploadPage.classList.remove('active');
        loadPhotos();
    } else if (pageName === 'upload') {
        galleryPage.classList.remove('active');
        uploadPage.classList.add('active');
    }
    
    navMenu.classList.remove('active');
}

navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        var page = this.dataset.page;
        switchPage(page);
    });
});

navToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
});

// ==================== 文件拖拽上传 ====================
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
        handleFileSelect();
    }
});

photoInput.addEventListener('change', handleFileSelect);

function handleFileSelect() {
    var file = photoInput.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            filePreview.style.display = 'block';
            fileDropArea.querySelector('.file-drop-content').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

removePreview.addEventListener('click', function(e) {
    e.stopPropagation();
    photoInput.value = '';
    filePreview.style.display = 'none';
    fileDropArea.querySelector('.file-drop-content').style.display = 'block';
});

// ==================== 上传照片 ====================
uploadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    var formData = new FormData(uploadForm);
    
    uploadBtn.disabled = true;
    uploadBtn.querySelector('.btn-text').style.display = 'none';
    uploadBtn.querySelector('.loader').style.display = 'inline-block';
    uploadMessage.style.display = 'none';
    
    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        if (result.success) {
            showMessage('success', '照片上传成功！');
            uploadForm.reset();
            filePreview.style.display = 'none';
            fileDropArea.querySelector('.file-drop-content').style.display = 'block';
            
            setTimeout(function() {
                switchPage('gallery');
            }, 2000);
        } else {
            showMessage('error', '上传失败: ' + result.error);
        }
    })
    .catch(function(error) {
        showMessage('error', '上传失败: ' + error.message);
    })
    .finally(function() {
        uploadBtn.disabled = false;
        uploadBtn.querySelector('.btn-text').style.display = 'flex';
        uploadBtn.querySelector('.loader').style.display = 'none';
    });
});

function showMessage(type, text) {
    uploadMessage.className = 'message ' + type;
    uploadMessage.textContent = text;
    uploadMessage.style.display = 'block';
    
    setTimeout(function() {
        uploadMessage.style.display = 'none';
    }, 5000);
}

// ==================== 加载照片列表 ====================
function loadPhotos() {
    console.log('开始加载照片...');
    loadingSpinner.style.display = 'block';
    fullscreenGallery.style.display = 'none';
    emptyMessage.style.display = 'none';
    
    fetch('/api/photos')
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        console.log('API 返回结果:', result);
        loadingSpinner.style.display = 'none';
        
        if (result.success) {
            currentPhotos = result.photos;
            navPhotoCount.textContent = currentPhotos.length;
            
            if (currentPhotos.length === 0) {
                console.log('没有照片');
                emptyMessage.style.display = 'block';
            } else {
                console.log('找到', currentPhotos.length, '张照片');
                currentPhotoIndex = 0;
                fullscreenGallery.style.display = 'block';
                showPhoto(currentPhotoIndex);
            }
        }
    })
    .catch(function(error) {
        console.error('加载照片失败:', error);
        loadingSpinner.style.display = 'none';
        alert('加载照片失败: ' + error.message);
    });
}

// ==================== 显示照片 ====================
function showPhoto(index) {
    if (currentPhotos.length === 0) {
        console.log('没有照片可显示');
        return;
    }
    
    // 确保索引在有效范围内
    if (index < 0) index = currentPhotos.length - 1;
    if (index >= currentPhotos.length) index = 0;
    
    currentPhotoIndex = index;
    var photo = currentPhotos[index];
    
    console.log('显示照片:', photo.url);
    
    // 更新图片（带淡入效果）
    fullscreenImage.style.opacity = '0';
    setTimeout(function() {
        fullscreenImage.src = photo.url;
        fullscreenImage.onload = function() {
            fullscreenImage.style.opacity = '1';
            console.log('照片加载完成');
        };
        fullscreenImage.onerror = function() {
            console.error('照片加载失败:', photo.url);
            alert('照片加载失败: ' + photo.url);
        };
    }, 150);
    
    // 更新计数器
    currentPhotoNum.textContent = index + 1;
    totalPhotoNum.textContent = currentPhotos.length;
}

// ==================== 导航控制 ====================
function showPrevPhoto() {
    showPhoto(currentPhotoIndex - 1);
}

function showNextPhoto() {
    showPhoto(currentPhotoIndex + 1);
}

prevPhotoBtn.addEventListener('click', showPrevPhoto);
nextPhotoBtn.addEventListener('click', showNextPhoto);

// 键盘导航
document.addEventListener('keydown', function(e) {
    if (galleryPage.classList.contains('active') && currentPhotos.length > 0) {
        if (e.key === 'ArrowLeft') {
            showPrevPhoto();
        } else if (e.key === 'ArrowRight') {
            showNextPhoto();
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            toggleAutoPlay();
        }
    }
});

// 鼠标滚轮导航
document.addEventListener('wheel', function(e) {
    if (galleryPage.classList.contains('active') && currentPhotos.length > 0) {
        if (e.deltaY > 0) {
            showNextPhoto();
        } else if (e.deltaY < 0) {
            showPrevPhoto();
        }
    }
}, { passive: true });

// 触摸滑动导航（移动端）
var touchStartX = 0;
var touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    if (galleryPage.classList.contains('active') && currentPhotos.length > 0) {
        if (touchEndX < touchStartX - 50) {
            // 向左滑动，下一张
            showNextPhoto();
        }
        if (touchEndX > touchStartX + 50) {
            // 向右滑动，上一张
            showPrevPhoto();
        }
    }
}

// ==================== 自动播放 ====================
function toggleAutoPlay() {
    if (isAutoPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

function startAutoPlay() {
    isAutoPlaying = true;
    playPauseBtn.classList.add('playing');
    playPauseBtn.querySelector('span').textContent = '⏸';
    playPauseBtn.title = '暂停';
    
    autoPlayInterval = setInterval(function() {
        showNextPhoto();
    }, 3000); // 每3秒切换一张
}

function stopAutoPlay() {
    isAutoPlaying = false;
    playPauseBtn.classList.remove('playing');
    playPauseBtn.querySelector('span').textContent = '▶';
    playPauseBtn.title = '自动播放';
    
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

playPauseBtn.addEventListener('click', toggleAutoPlay);

// ==================== 删除照片 ====================
deletePhotoBtn.addEventListener('click', function() {
    if (currentPhotos.length === 0) return;
    
    var photo = currentPhotos[currentPhotoIndex];
    
    if (!confirm('确定要删除这张照片吗？此操作不可恢复。')) {
        return;
    }
    
    // 停止自动播放
    if (isAutoPlaying) {
        stopAutoPlay();
    }
    
    deletePhotoBtn.disabled = true;
    
    fetch('/api/photos/' + photo.id, {
        method: 'DELETE'
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        if (result.success) {
            // 从列表中移除照片
            currentPhotos.splice(currentPhotoIndex, 1);
            navPhotoCount.textContent = currentPhotos.length;
            
            // 显示下一张或上一张
            if (currentPhotos.length === 0) {
                fullscreenGallery.style.display = 'none';
                emptyMessage.style.display = 'block';
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
        deletePhotoBtn.disabled = false;
    });
});

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    switchPage('gallery');
    
    // 添加过渡效果
    fullscreenImage.style.transition = 'opacity 0.3s ease-in-out';
});
