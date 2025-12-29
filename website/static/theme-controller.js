// ==================== 主题控制器 ====================

var ThemeController = {
    currentTheme: 'default',
    
    init: function() {
        // 从 localStorage 加载保存的主题
        var savedTheme = localStorage.getItem('gallery-theme') || 'default';
        this.applyTheme(savedTheme);
        
        // 绑定主题切换按钮
        this.bindThemeButtons();
        
        console.log('主题系统初始化完成，当前主题:', savedTheme);
    },
    
    bindThemeButtons: function() {
        var buttons = document.querySelectorAll('.theme-btn');
        var self = this;
        
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var theme = this.dataset.theme;
                console.log('切换主题到:', theme);
                self.applyTheme(theme);
            });
        });
    },
    
    applyTheme: function(theme) {
        this.currentTheme = theme;
        
        // 移除所有主题类
        document.body.classList.remove('theme-newyear', 'theme-birthday');
        
        // 移除所有动态效果
        this.removeEffects();
        
        // 应用新主题
        if (theme === 'newyear') {
            document.body.classList.add('theme-newyear');
            this.createNewyearEffects();
        } else if (theme === 'birthday') {
            document.body.classList.add('theme-birthday');
            this.createBirthdayEffects();
        }
        
        // 更新按钮状态
        this.updateButtonStates(theme);
        
        // 保存到 localStorage
        localStorage.setItem('gallery-theme', theme);
        
        console.log('主题已切换到:', theme);
    },
    
    updateButtonStates: function(activeTheme) {
        var buttons = document.querySelectorAll('.theme-btn');
        buttons.forEach(function(btn) {
            if (btn.dataset.theme === activeTheme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },
    
    removeEffects: function() {
        // 清除定时器
        if (this.fireworkInterval) {
            clearInterval(this.fireworkInterval);
            this.fireworkInterval = null;
        }
        if (this.greetingInterval) {
            clearInterval(this.greetingInterval);
            this.greetingInterval = null;
        }
        
        // 移除所有动态效果容器
        var containers = [
            '.lantern-container',
            '.chinese-knot',
            '.redenvelope-container',
            '.plum-blossom-container',
            '.cloud-container',
            '.fu-character',
            '.gold-ingot',
            '.balloon-container',
            '.confetti-container',
            '.star-container',
            '.birthday-cake',
            '.newyear-greeting',
            '.firework'
        ];
        
        containers.forEach(function(selector) {
            var elements = document.querySelectorAll(selector);
            elements.forEach(function(el) {
                el.remove();
            });
        });
    },
    
    // ==================== 新年主题效果 ====================
    createNewyearEffects: function() {
        // 创建灯笼（更多）
        this.createLanterns();
        
        // 创建中国结
        this.createChineseKnots();
        
        // 创建红包雨
        this.createRedEnvelopes();
        
        // 创建梅花飘落
        this.createPlumBlossoms();
        
        // 创建祥云
        this.createLuckyClouds();
        
        // 创建福字
        this.createFuCharacters();
        
        // 创建金元宝
        this.createGoldIngots();
        
        // 创建烟花（每隔几秒）
        this.startFireworks();
        
        // 显示新年祝福
        this.showNewyearGreeting();
        
        // 定期显示祝福语
        this.startGreetingLoop();
    },
    
    createLanterns: function() {
        var container = document.createElement('div');
        container.className = 'lantern-container';
        
        for (var i = 0; i < 7; i++) {
            var lantern = document.createElement('div');
            lantern.className = 'lantern';
            
            // 添加流苏
            var tassel = document.createElement('div');
            tassel.className = 'lantern-tassel';
            lantern.appendChild(tassel);
            
            container.appendChild(lantern);
        }
        
        document.body.appendChild(container);
    },
    
    createChineseKnots: function() {
        var knots = ['🎎', '🏵️', '🎐', '🎏'];
        for (var i = 0; i < 4; i++) {
            var knot = document.createElement('div');
            knot.className = 'chinese-knot';
            knot.innerHTML = knots[i % knots.length];
            document.body.appendChild(knot);
        }
    },
    
    createRedEnvelopes: function() {
        var container = document.createElement('div');
        container.className = 'redenvelope-container';
        
        for (var i = 0; i < 15; i++) {
            var envelope = document.createElement('div');
            envelope.className = 'redenvelope';
            envelope.innerHTML = '🧧';
            envelope.style.left = (Math.random() * 100) + '%';
            envelope.style.animationDelay = (Math.random() * 6) + 's';
            envelope.style.animationDuration = (4 + Math.random() * 3) + 's';
            container.appendChild(envelope);
        }
        
        document.body.appendChild(container);
    },
    
    createPlumBlossoms: function() {
        var container = document.createElement('div');
        container.className = 'plum-blossom-container';
        
        var blossoms = ['🌸', '🌺', '🏵️'];
        
        for (var i = 0; i < 20; i++) {
            var blossom = document.createElement('div');
            blossom.className = 'plum-blossom';
            blossom.innerHTML = blossoms[Math.floor(Math.random() * blossoms.length)];
            blossom.style.left = (Math.random() * 100) + '%';
            blossom.style.animationDelay = (Math.random() * 8) + 's';
            blossom.style.animationDuration = (6 + Math.random() * 4) + 's';
            container.appendChild(blossom);
        }
        
        document.body.appendChild(container);
    },
    
    createLuckyClouds: function() {
        var container = document.createElement('div');
        container.className = 'cloud-container';
        
        var cloudPositions = [
            { top: '15%', delay: 0 },
            { top: '35%', delay: 6 },
            { top: '55%', delay: 12 },
            { top: '25%', delay: 18 }
        ];
        
        cloudPositions.forEach(function(pos) {
            var cloud = document.createElement('div');
            cloud.className = 'lucky-cloud';
            cloud.style.top = pos.top;
            cloud.style.animationDelay = pos.delay + 's';
            container.appendChild(cloud);
        });
        
        document.body.appendChild(container);
    },
    
    createFuCharacters: function() {
        for (var i = 0; i < 2; i++) {
            var fu = document.createElement('div');
            fu.className = 'fu-character';
            fu.innerHTML = '福';
            document.body.appendChild(fu);
        }
    },
    
    createGoldIngots: function() {
        var goldItems = ['🪙', '💰', '🧧', '💎'];
        for (var i = 0; i < 4; i++) {
            var ingot = document.createElement('div');
            ingot.className = 'gold-ingot';
            ingot.innerHTML = goldItems[i % goldItems.length];
            document.body.appendChild(ingot);
        }
    },
    
    startFireworks: function() {
        var self = this;
        
        // 立即显示一次
        this.createFirework();
        
        // 每5秒显示一次烟花
        this.fireworkInterval = setInterval(function() {
            if (self.currentTheme === 'newyear') {
                self.createFirework();
            } else {
                clearInterval(self.fireworkInterval);
            }
        }, 5000);
    },
    
    createFirework: function() {
        var colors = ['#FF0000', '#FFD700', '#FF4500', '#FFA500', '#FF69B4'];
        var x = Math.random() * window.innerWidth;
        var y = Math.random() * (window.innerHeight / 2) + 100;
        
        // 创建多个粒子
        for (var i = 0; i < 20; i++) {
            var particle = document.createElement('div');
            particle.className = 'firework';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            var angle = (Math.PI * 2 * i) / 20;
            var velocity = 50 + Math.random() * 100;
            particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
            particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
            
            document.body.appendChild(particle);
            
            // 1.5秒后移除
            setTimeout(function(p) {
                return function() { p.remove(); };
            }(particle), 1500);
        }
    },
    
    showNewyearGreeting: function() {
        var greetings = [
            '新年快乐！',
            '恭喜发财！',
            '万事如意！',
            '龙年大吉！',
            '福星高照！',
            '吉祥如意！',
            '财源广进！',
            '阖家欢乐！',
            '年年有余！',
            '步步高升！'
        ];
        var greeting = greetings[Math.floor(Math.random() * greetings.length)];
        
        var div = document.createElement('div');
        div.className = 'newyear-greeting';
        div.textContent = greeting;
        document.body.appendChild(div);
        
        // 4秒后移除
        setTimeout(function() {
            div.remove();
        }, 4000);
    },
    
    startGreetingLoop: function() {
        var self = this;
        
        // 每15秒显示一次祝福语
        this.greetingInterval = setInterval(function() {
            if (self.currentTheme === 'newyear') {
                self.showNewyearGreeting();
            } else {
                clearInterval(self.greetingInterval);
            }
        }, 15000);
    },
    
    // ==================== 生日主题效果 ====================
    createBirthdayEffects: function() {
        // 创建气球
        this.createBalloons();
        
        // 创建彩带
        this.createConfetti();
        
        // 创建星星
        this.createStars();
        
        // 创建蛋糕图标
        this.createCake();
    },
    
    createBalloons: function() {
        var container = document.createElement('div');
        container.className = 'balloon-container';
        
        var balloonColors = ['🎈', '🎉', '🎁', '🎂'];
        
        for (var i = 0; i < 10; i++) {
            var balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.innerHTML = balloonColors[Math.floor(Math.random() * balloonColors.length)];
            container.appendChild(balloon);
        }
        
        document.body.appendChild(container);
    },
    
    createConfetti: function() {
        var container = document.createElement('div');
        container.className = 'confetti-container';
        
        for (var i = 0; i < 50; i++) {
            var confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 4 + 's';
            confetti.style.animationDuration = (3 + Math.random() * 2) + 's';
            container.appendChild(confetti);
        }
        
        document.body.appendChild(container);
    },
    
    createStars: function() {
        var container = document.createElement('div');
        container.className = 'star-container';
        
        for (var i = 0; i < 20; i++) {
            var star = document.createElement('div');
            star.className = 'star';
            star.innerHTML = '✨';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(star);
        }
        
        document.body.appendChild(container);
    },
    
    createCake: function() {
        var cake = document.createElement('div');
        cake.className = 'birthday-cake';
        cake.innerHTML = '🎂';
        document.body.appendChild(cake);
    }
};

// 页面加载完成后初始化主题系统
document.addEventListener('DOMContentLoaded', function() {
    // 给主题系统一个短暂延迟，确保其他脚本先加载
    setTimeout(function() {
        ThemeController.init();
    }, 100);
});

