// ==================== 全局变量 ====================
let currentPhotos = [];
let currentPhotoIndex = 0;
let currentView = '3d'; // 3d, grid, carousel

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
const gallery3D = document.getElementById('gallery3D');
const viewControls = document.getElementById('viewControls');
const viewBtns = document.querySelectorAll('.view-btn');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyMessage = document.getElementById('emptyMessage');

// 上传
const uploadForm = document.getElementById('uploadForm');
const photoInput = document.getElementById('photoInput');
const fileDropArea = document.getElementById('fileDropArea');
const filePreview = document.getElementById('filePreview');
const previewImage = document.getElementById('previewImage');
const removePreview = document.getElementById('removePreview');
const uploadBtn = document.getElementById('uploadBtn');
const uploadMessage = document.getElementById('uploadMessage');

// 模态框
const photoModal = document.getElementById('photoModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalOriginalName = document.getElementById('modalOriginalName');
const modalDescription = document.getElementById('modalDescription');
const modalTime = document.getElementById('modalTime');
const deleteBtn = document.getElementById('deleteBtn');
const prevPhoto = document.getElementById('prevPhoto');
const nextPhoto = document.getElementById('nextPhoto');

// ==================== 页面切换 ====================
function switchPage(pageName) {
    // 更新导航激活状态
    navLinks.forEach(function(link) {
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // 切换页面
    if (pageName === 'gallery') {
        galleryPage.classList.add('active');
        uploadPage.classList.remove('active');
        loadPhotos();
    } else if (pageName === 'upload') {
        galleryPage.classList.remove('active');
        uploadPage.classList.add('active');
    }
    
    // 关闭移动端菜单
    navMenu.classList.remove('active');
}

// 导航点击事件
navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        var page = this.dataset.page;
        switchPage(page);
    });
});

// 移动端导航切换
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

// 文件选择事件
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

// 移除预览
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
    
    // 禁用按钮并显示加载状态
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
            
            // 2秒后切换到画廊页面
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
    loadingSpinner.style.display = 'block';
    gallery3D.innerHTML = '';
    emptyMessage.style.display = 'none';
    viewControls.style.display = 'none';
    
    fetch('/api/photos')
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        if (result.success) {
            currentPhotos = result.photos;
            navPhotoCount.textContent = currentPhotos.length;
            
            if (currentPhotos.length === 0) {
                emptyMessage.style.display = 'block';
            } else {
                renderGallery();
                viewControls.style.display = 'flex';
            }
        }
    })
    .catch(function(error) {
        console.error('加载照片失败:', error);
        gallery3D.innerHTML = '<p style="text-align: center; color: white;">加载照片失败，请刷新页面重试</p>';
    })
    .finally(function() {
        loadingSpinner.style.display = 'none';
    });
}

// ==================== 渲染画廊 ====================
function renderGallery() {
    gallery3D.innerHTML = '';
    
    currentPhotos.forEach(function(photo, index) {
        var card = createPhotoCard(photo, index);
        gallery3D.appendChild(card);
    });
    
    // 应用当前视图样式
    applyView(currentView);
}

function createPhotoCard(photo, index) {
    var card = document.createElement('div');
    card.className = 'photo-card-3d';
    card.dataset.index = index;
    
    // 随机旋转角度（3D 效果）
    var randomRotateY = (Math.random() - 0.5) * 30;
    var randomRotateX = (Math.random() - 0.5) * 20;
    card.style.setProperty('--rotate-y', randomRotateY + 'deg');
    card.style.setProperty('--rotate-x', randomRotateX + 'deg');
    
    card.innerHTML = 
        '<div class="card-inner">' +
            '<img src="' + photo.url + '" alt="' + photo.original_name + '" class="card-image" loading="lazy">' +
            '<div class="card-content">' +
                '<div class="card-title">' + photo.original_name + '</div>' +
                '<div class="card-description">' + (photo.description || '无描述') + '</div>' +
                '<div class="card-time">' + photo.upload_time + '</div>' +
            '</div>' +
        '</div>';
    
    card.addEventListener('click', function() {
        openModal(index);
    });
    
    return card;
}

// ==================== 视图切换 ====================
viewBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        var view = this.dataset.view;
        switchView(view);
    });
});

function switchView(view) {
    currentView = view;
    
    // 更新按钮状态
    viewBtns.forEach(function(btn) {
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    applyView(view);
}

function applyView(view) {
    gallery3D.className = 'gallery-3d-container';
    
    if (view === 'grid') {
        gallery3D.classList.add('grid-view');
    } else if (view === 'carousel') {
        gallery3D.classList.add('carousel-view');
        arrangeCarousel();
    } else {
        // 3D view - default
    }
}

function arrangeCarousel() {
    var cards = gallery3D.querySelectorAll('.photo-card-3d');
    var radius = 600;
    var angleStep = 360 / cards.length;
    
    cards.forEach(function(card, i) {
        var angle = angleStep * i;
        var radian = angle * Math.PI / 180;
        
        var x = Math.sin(radian) * radius;
        var z = Math.cos(radian) * radius - radius;
        
        card.style.transform = 'translateX(' + x + 'px) translateZ(' + z + 'px) rotateY(' + (-angle) + 'deg)';
    });
}

// ==================== 模态框 ====================
function openModal(index) {
    currentPhotoIndex = index;
    var photo = currentPhotos[index];
    
    modalImage.src = photo.url;
    modalOriginalName.textContent = photo.original_name;
    modalDescription.textContent = photo.description || '无描述';
    modalTime.textContent = '上传时间: ' + photo.upload_time;
    
    photoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // 更新导航按钮状态
    prevPhoto.style.display = currentPhotos.length > 1 ? 'block' : 'none';
    nextPhoto.style.display = currentPhotos.length > 1 ? 'block' : 'none';
}

function closeModal() {
    photoModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// 关闭模态框
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

// 前后翻页
prevPhoto.addEventListener('click', function(e) {
    e.stopPropagation();
    currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
    openModal(currentPhotoIndex);
});

nextPhoto.addEventListener('click', function(e) {
    e.stopPropagation();
    currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
    openModal(currentPhotoIndex);
});

// 键盘导航
document.addEventListener('keydown', function(e) {
    if (photoModal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            prevPhoto.click();
        } else if (e.key === 'ArrowRight') {
            nextPhoto.click();
        }
    }
});

// ==================== 删除照片 ====================
deleteBtn.addEventListener('click', function() {
    var photo = currentPhotos[currentPhotoIndex];
    
    if (!confirm('确定要删除这张照片吗？此操作不可恢复。')) {
        return;
    }
    
    deleteBtn.disabled = true;
    deleteBtn.textContent = '删除中...';
    
    fetch('/api/photos/' + photo.id, {
        method: 'DELETE'
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        if (result.success) {
            closeModal();
            loadPhotos();
        } else {
            alert('删除失败: ' + result.error);
        }
    })
    .catch(function(error) {
        alert('删除失败: ' + error.message);
    })
    .finally(function() {
        deleteBtn.disabled = false;
        deleteBtn.innerHTML = '<span>🗑️</span>删除照片';
    });
});

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    // 默认显示画廊页面
    switchPage('gallery');
    
    // 自动旋转轮播（如果是轮播视图）
    setInterval(function() {
        if (currentView === 'carousel' && currentPhotos.length > 0) {
            var container = gallery3D;
            var currentRotation = parseFloat(container.dataset.rotation || 0);
            var newRotation = currentRotation + 0.5;
            container.dataset.rotation = newRotation;
            container.style.transform = 'rotateY(' + newRotation + 'deg)';
        }
    }, 50);
});

// ==================== 鼠标跟随 3D 效果 ====================
document.addEventListener('mousemove', function(e) {
    if (currentView !== '3d') return;
    
    var cards = document.querySelectorAll('.photo-card-3d');
    var mouseX = e.clientX / window.innerWidth;
    var mouseY = e.clientY / window.innerHeight;
    
    cards.forEach(function(card) {
        var rect = card.getBoundingClientRect();
        var cardX = (rect.left + rect.width / 2) / window.innerWidth;
        var cardY = (rect.top + rect.height / 2) / window.innerHeight;
        
        var distX = mouseX - cardX;
        var distY = mouseY - cardY;
        
        var rotateY = distX * 20;
        var rotateX = -distY * 20;
        
        if (!card.matches(':hover')) {
            card.style.transform = 
                'rotateY(' + rotateY + 'deg) rotateX(' + rotateX + 'deg)';
        }
    });
});

// ==================== 滚动动画 ====================
var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// 观察新添加的卡片
var observeCards = function() {
    var cards = document.querySelectorAll('.photo-card-3d');
    cards.forEach(function(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.6s, transform 0.6s';
        observer.observe(card);
    });
};

// 在渲染画廊后调用
var originalRenderGallery = renderGallery;
renderGallery = function() {
    originalRenderGallery();
    setTimeout(observeCards, 100);
};
