// Reading page Vue application
const { createApp } = Vue;

createApp({
    data() {
        return {
            currentNovel: null,
            chapters: [],
            currentChapter: null,
            loading: false,
            // Copy protection feature toggle
            copyProtectionEnabled: true,
            // Night mode status
            isNightMode: false,
            // Reading page feature data
            chapterAd: {
                title: 'More Exciting Novels',
                description: 'Discover the genres you love'
            },
            eyeProtectionMode: {
                title: 'Eye Protection Mode',
                description: 'Protect your vision for comfortable reading',
                image: 'https://via.placeholder.com/100x60/4ECDC4/white?text=Eye'
            },
            chapterBottomAd: {
                title: 'Like this book?',
                description: 'Collect and share with friends for more recommendations',
                cta: 'Collect Now'
            }
        }
    },
    
    mounted() {
        this.initializeReading();
        if (this.copyProtectionEnabled) {
            this.initCopyProtection();
        }
        this.loadNightModePreference();
    },
    
    computed: {
        currentChapterIndex() {
            if (!this.currentChapter || !this.chapters.length) return -1;
            return this.chapters.findIndex(chapter => chapter.id === this.currentChapter.id);
        },
        
        hasPreviousChapter() {
            return this.currentChapterIndex > 0;
        },
        
        hasNextChapter() {
            return this.currentChapterIndex >= 0 && this.currentChapterIndex < this.chapters.length - 1;
        }
    },
    
    methods: {
        // Initialize copy protection
        initCopyProtection() {
            // Disable right-click menu
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });

            // Disable text selection
            document.addEventListener('selectstart', function(e) {
                e.preventDefault();
                return false;
            });

            // Disable drag
            document.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });

            // Disable copy-related shortcuts
            document.addEventListener('keydown', function(e) {
                // Disable Ctrl+C (copy)
                if (e.ctrlKey && e.key === 'c') {
                    e.preventDefault();
                    return false;
                }
                // Disable Ctrl+A (select all)
                if (e.ctrlKey && e.key === 'a') {
                    e.preventDefault();
                    return false;
                }
                // Disable Ctrl+S (save)
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    return false;
                }
                // Disable Ctrl+X (cut)
                if (e.ctrlKey && e.key === 'x') {
                    e.preventDefault();
                    return false;
                }
                // Disable Ctrl+V (paste)
                if (e.ctrlKey && e.key === 'v') {
                    e.preventDefault();
                    return false;
                }
                // Disable F12 (developer tools)
                if (e.key === 'F12') {
                    e.preventDefault();
                    return false;
                }
                // Disable Ctrl+Shift+I (developer tools)
                if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                    e.preventDefault();
                    return false;
                }
                // Disable Ctrl+Shift+J (console)
                if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                    e.preventDefault();
                    return false;
                }
                // Disable Ctrl+U (view source)
                if (e.ctrlKey && e.key === 'u') {
                    e.preventDefault();
                    return false;
                }
                // Disable Ctrl+Shift+C (select element)
                if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                    e.preventDefault();
                    return false;
                }
            });

            // Disable printing
            window.addEventListener('beforeprint', function(e) {
                e.preventDefault();
                alert('Sorry, printing is not allowed to protect copyright');
                return false;
            });

            // Clear clipboard (attempt)
            document.addEventListener('copy', function(e) {
                e.clipboardData.setData('text/plain', '');
                e.preventDefault();
                return false;
            });

            // Prevent copying after hiding content via CSS
            document.addEventListener('mouseup', function() {
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                }
            });

            // Add watermark prompt
            this.addWatermark();
            
            // Detect developer tools
            this.detectDevTools();
            
            // Start debugger trap
            this.startDebuggerTrap();
            
            // Page leave detection
            this.setupPageLeaveDetection();
        },

        // Add watermark
        addWatermark() {
            // 水印效果已移除 - 保持页面简洁
            console.log('Watermark feature disabled');
        },

        // Detect developer tools
        detectDevTools() {
            let devtools = {
                open: false,
                orientation: null
            };
            
            // Main detection logic
            setInterval(() => {
                // More accurate size detection
                let heightDiff = window.outerHeight - window.innerHeight;
                let widthDiff = window.outerWidth - window.innerWidth;
                
                // Consider toolbar height of different browsers
                if (heightDiff > 200 || widthDiff > 200) {
                    if (!devtools.open) {
                        devtools.open = true;
                        console.clear();
                        console.log('Developer tools detected as open');
                        
                        // Immediately change chapter content
                        this.hideChapterContent();
                        
                        // Give user 3 seconds to close developer tools
                        let countdown = 3;
                        let warningInterval = setInterval(() => {
                            if (countdown > 0) {
                                console.clear();
                                console.log(`Developer tools detected! Returning to previous page in ${countdown} seconds...`);
                                countdown--;
                            } else {
                                clearInterval(warningInterval);
                                alert('Developer tools detected! To protect content copyright, returning to library.');
                                setTimeout(() => {
                                    this.backToBookshelf();
                                }, 1000);
                            }
                        }, 1000);
                    }
                } else {
                    if (devtools.open) {
                        devtools.open = false;
                        // If developer tools are closed, restore chapter content
                        this.restoreChapterContent();
                    }
                }
            }, 500);
            
            // Disable console
            let _log = console.log;
            console.log = function() {
                _log.call(console, '🔒 Content protected by copyright - debugging prohibited');
            };
            
            // Additional developer tools detection methods
            this.detectDevToolsAdvanced();
        },

        // Advanced developer tools detection
        detectDevToolsAdvanced() {
            // Detect console object
            let element = new Image();
            Object.defineProperty(element, 'id', {
                get: function() {
                    console.clear();
                    alert('Debugging behavior detected! To protect copyright, returning to previous page.');
                    setTimeout(() => {
                        window.location.href = '../index/index.html';
                    }, 1000);
                    throw new Error('Developer tools detection');
                }
            });
            
            // Regular check
            setInterval(() => {
                console.dir(element);
            }, 1000);
            
            // Detect window size changes (possibly developer tools open/close)
            let threshold = 160;
            setInterval(() => {
                if (window.outerHeight - window.innerHeight > threshold || 
                    window.outerWidth - window.innerWidth > threshold) {
                    console.clear();
                    alert('Developer tools detected! Returning to previous page.');
                    setTimeout(() => {
                        this.backToBookshelf();
                    }, 500);
                }
            }, 800);
        },

        // Start debugger trap
        startDebuggerTrap() {
            let debuggerDetected = false;
            
            // Use debugger statement detection
            setInterval(() => {
                if (debuggerDetected) return; // 避免重复触发
                
                let start = performance.now();
                debugger; // If developer tools are open, this will pause
                let end = performance.now();
                
                // If time difference exceeds 100ms, debugger may be involved
                if (end - start > 100) {
                    debuggerDetected = true;
                    console.clear();
                    alert('🚫 Debugger activity detected!\nTo protect novel copyright, returning to library page.');
                    setTimeout(() => {
                        this.backToBookshelf();
                    }, 1500);
                }
            }, 2000); // Reduce detection frequency to avoid affecting performance
            
            // Another detection method: monitor abnormal execution time
            this.monitorExecutionTime();
        },
        
        // Monitor execution time anomalies
        monitorExecutionTime() {
            let executionTimes = [];
            
            setInterval(() => {
                let start = performance.now();
                
                // Execute a simple calculation task
                for (let i = 0; i < 1000; i++) {
                    Math.random();
                }
                
                let end = performance.now();
                let duration = end - start;
                
                executionTimes.push(duration);
                
                // Keep records of the last 10 times
                if (executionTimes.length > 10) {
                    executionTimes.shift();
                }
                
                // Calculate average execution time
                if (executionTimes.length >= 5) {
                    let average = executionTimes.reduce((a, b) => a + b) / executionTimes.length;
                    
                    // If current execution time is abnormally long (5x average), debugger may be involved
                    if (duration > average * 5 && duration > 50) {
                        console.clear();
                        alert('⚠️ Abnormal execution environment detected!\nDebug tools may be present, returning to safe page.');
                        setTimeout(() => {
                            this.backToBookshelf();
                        }, 1000);
                    }
                }
            }, 3000);
        },

        // Setup page leave detection
        setupPageLeaveDetection() {
            // Listen for page visibility changes
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    // Clear sensitive content when page is hidden
                    this.hideSensitiveContent();
                } else {
                    // Restore content when page is visible
                    this.showSensitiveContent();
                }
            });
            
            // Listen for window losing focus
            window.addEventListener('blur', () => {
                this.hideSensitiveContent();
            });
            
            // Listen for window gaining focus
            window.addEventListener('focus', () => {
                this.showSensitiveContent();
            });
            
            // Listen for page unload
            window.addEventListener('beforeunload', () => {
                // Clear page content
                document.body.innerHTML = '<div style="text-align:center;padding:50px;">内容已保护</div>';
            });
        },
        
        // Hide sensitive content
        hideSensitiveContent() {
            const chapterContent = document.querySelector('.chapter-body');
            if (chapterContent) {
                chapterContent.style.filter = 'blur(10px)';
                chapterContent.style.opacity = '0.3';
            }
        },
        
        // Show sensitive content
        showSensitiveContent() {
            const chapterContent = document.querySelector('.chapter-body');
            if (chapterContent) {
                chapterContent.style.filter = 'none';
                chapterContent.style.opacity = '1';
            }
        },

        // Toggle night mode
        toggleNightMode() {
            this.isNightMode = !this.isNightMode;
            
            if (this.isNightMode) {
                // Apply night mode styles
                document.body.classList.add('night-mode');
                
                // Update eye protection mode panel status
                this.eyeProtectionMode.title = 'Night Mode Enabled';
                this.eyeProtectionMode.description = 'Dark theme activated for comfortable reading';
                
                // Show toggle feedback
                this.showModeChangeNotification('🌙 Night Mode Enabled');
                
                // Save user preference
                localStorage.setItem('nightMode', 'true');
            } else {
                // Remove night mode styles
                document.body.classList.remove('night-mode');
                
                // Restore eye protection mode panel status
                this.eyeProtectionMode.title = 'Eye Protection Mode';
                this.eyeProtectionMode.description = 'Protect your vision for comfortable reading';
                
                // Show toggle feedback
                this.showModeChangeNotification('☀️ Day Mode Enabled');
                
                // Save user preference
                localStorage.setItem('nightMode', 'false');
            }
        },

        // Show mode change notification
        showModeChangeNotification(message) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${this.isNightMode ? '#333' : '#fff'};
                color: ${this.isNightMode ? '#fff' : '#333'};
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 10000;
                font-size: 16px;
                font-weight: 500;
            `;
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 2000);
        },

        // Load user night mode preference
        loadNightModePreference() {
            const savedMode = localStorage.getItem('nightMode');
            if (savedMode === 'true') {
                this.toggleNightMode();
            }
        },

        // Initialize reading page
        initializeReading() {
            const urlParams = new URLSearchParams(window.location.search);
            const novelId = urlParams.get('id'); // Change parameter name from 'novel' to 'id'
            const chapterId = urlParams.get('chapter');
            
            if (!novelId) {
                alert('Missing novel parameter');
                this.backToBookshelf();
                return;
            }
            
            // Load novel info first, then load chapters
            this.loadNovelInfo(novelId).then(() => {
                this.loadChapters(novelId, chapterId);
            });
        },
        
        // Load novel information
        loadNovelInfo(novelId) {
            return axios.get(`http://localhost:3000/api/novels`)
                .then(res => {
                    console.log('Novel list response:', res.data);
                    // Backend directly returns array, not {success: true, data: [...]} format
                    if (Array.isArray(res.data)) {
                        this.currentNovel = res.data.find(novel => novel.id == novelId);
                        if (!this.currentNovel) {
                            alert('Novel does not exist');
                            this.backToBookshelf();
                            return Promise.reject('Novel does not exist');
                        }
                        console.log('Novel information loaded successfully:', this.currentNovel);
                        
                        // Load favorite status from localStorage
                        this.loadFavoriteStatus();
                    } else {
                        console.error('API响应格式错误:', res.data);
                        return Promise.reject('API响应格式错误');
                    }
                })
                .catch(err => {
                    console.error('加载小说信息失败:', err);
                    this.backToBookshelf();
                    return Promise.reject(err);
                });
        },

        // Load favorite status from localStorage
        loadFavoriteStatus() {
            if (this.currentNovel) {
                const saved = localStorage.getItem('novelFavorites');
                const favorites = saved ? JSON.parse(saved) : [];
                this.currentNovel.isFavorited = favorites.includes(this.currentNovel.id);
            }
        },
        
        // Load chapter list
        loadChapters(novelId, chapterId = null) {
            this.loading = true;
            console.log(`Loading chapter list: novels/${novelId}/chapters`);
            
            axios.get(`http://localhost:3000/api/novels/${novelId}/chapters`)
                .then(res => {
                    console.log('Chapter list data:', res.data);
                    if (res.data.success) {
                        this.chapters = res.data.data;
                        console.log('Chapter list set:', this.chapters);
                        
                        // If chapter ID is specified, read that chapter, otherwise read the first chapter
                        if (chapterId) {
                            this.readChapter(parseInt(chapterId));
                        } else if (this.chapters.length > 0) {
                            this.readChapter(this.chapters[0].id);
                        }
                    }
                    this.loading = false;
                })
                .catch(err => {
                    console.error('Failed to load chapters:', err);
                    this.loading = false;
                });
        },

        // Read specified chapter
        readChapter(chapterId) {
            if (!this.currentNovel) {
                console.error('Current novel not set, waiting for novel info to load');
                // Wait for a while and retry
                setTimeout(() => {
                    if (this.currentNovel) {
                        this.readChapter(chapterId);
                    } else {
                        console.error('Novel info loading failed, cannot read chapter');
                    }
                }, 500);
                return;
            }
            
            this.loading = true;
            console.log(`Loading chapter: novels/${this.currentNovel.id}/chapters/${chapterId}`);
            
            axios.get(`http://localhost:3000/api/novels/${this.currentNovel.id}/chapters/${chapterId}`)
                .then(res => {
                    console.log('Chapter data:', res.data);
                    if (res.data.success) {
                        this.currentChapter = res.data.data;
                        console.log('Set current chapter:', this.currentChapter);
                        
                        // Update URL parameters
                        const url = new URL(window.location);
                        url.searchParams.set('chapter', chapterId);
                        window.history.replaceState({}, '', url);
                    }
                    this.loading = false;
                })
                .catch(err => {
                    console.error('Failed to load chapter content:', err);
                    this.loading = false;
                });
        },
        
        // Previous chapter
        readPreviousChapter() {
            if (this.hasPreviousChapter) {
                const prevChapter = this.chapters[this.currentChapterIndex - 1];
                this.readChapter(prevChapter.id);
            }
        },
        
        // Next chapter
        readNextChapter() {
            if (this.hasNextChapter) {
                const nextChapter = this.chapters[this.currentChapterIndex + 1];
                this.readChapter(nextChapter.id);
            }
        },

        // Format chapter content
        formatChapterContent(content) {
            if (!content) return '';
            return content.split('\n')
                .filter(paragraph => paragraph.trim())
                .map(paragraph => `<p class="paragraph">${paragraph}</p>`)
                .join('');
        },

        // Back to bookshelf
        backToBookshelf() {
            window.location.href = '../index/index.html';
        },

        // Handle ad click
        handleAdClick(adType) {
            console.log(`阅读页广告点击: ${adType}`);
            
            // 记录广告点击统计
            this.trackAdClick(adType);
            
            // 根据广告类型执行不同操作
            switch(adType) {
                case 'chapters-bottom':
                    // 跳转到推荐页面
                    window.open('../index/index.html#recommend', '_blank');
                    break;
                case 'chapter-bottom':
                    // 跳转到广告链接（这里可以设置为实际的广告链接）
                    window.open('https://example.com/novel-recommendation', '_blank');
                    break;
            }
        },

        // 记录广告点击统计
        trackAdClick(adType) {
            fetch('http://localhost:3000/api/ad-click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    adType: adType,
                    page: 'reading',
                    novelId: this.currentNovel?.id,
                    chapterId: this.currentChapter?.id,
                    timestamp: new Date().toISOString()
                })
            }).catch(err => {
                console.log('广告统计发送失败:', err);
            });
        },

        // 切换夜间模式
        toggleNightMode() {
            document.body.classList.toggle('night-mode');
            const isNightMode = document.body.classList.contains('night-mode');
            console.log('切换夜间模式:', isNightMode ? '开启' : '关闭');
            
            // 提供用户反馈
            const message = isNightMode ? '🌙 夜间模式已开启' : '☀️ 日间模式已开启';
            
            // 创建临时提示
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${isNightMode ? '#333' : '#fff'};
                color: ${isNightMode ? '#fff' : '#333'};
                padding: 10px 20px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                z-index: 10000;
                font-size: 14px;
            `;
            document.body.appendChild(toast);
            
            // 3秒后移除提示
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 3000);
        },

        // 收藏当前小说
        collectCurrentNovel() {
            if (this.currentNovel) {
                console.log('收藏小说:', this.currentNovel.title);
                
                // 从localStorage获取收藏列表
                const saved = localStorage.getItem('novelFavorites');
                let favorites = saved ? JSON.parse(saved) : [];
                
                // 切换收藏状态
                const index = favorites.indexOf(this.currentNovel.id);
                if (index > -1) {
                    favorites.splice(index, 1);
                    this.currentNovel.isFavorited = false;
                } else {
                    favorites.push(this.currentNovel.id);
                    this.currentNovel.isFavorited = true;
                }
                
                // 保存到localStorage
                localStorage.setItem('novelFavorites', JSON.stringify(favorites));
                
                // 提供用户反馈
                const message = this.currentNovel.isFavorited ? 
                    `❤️ 已收藏《${this.currentNovel.title}》` : 
                    `💔 已取消收藏《${this.currentNovel.title}》`;
                
                // 创建收藏状态提示
                const toast = document.createElement('div');
                toast.textContent = message;
                toast.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: ${this.currentNovel.isFavorited ? '#4caf50' : '#ff9800'};
                    color: white;
                    padding: 15px 25px;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    z-index: 10000;
                    font-size: 16px;
                    font-weight: 500;
                `;
                document.body.appendChild(toast);
                
                // 3秒后移除提示
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 3000);
                
                // 如果是收藏操作，询问是否跳转到收藏页面
                if (this.currentNovel.isFavorited) {
                    setTimeout(() => {
                        const goToFavorites = confirm('收藏成功！是否要查看收藏夹？');
                        if (goToFavorites) {
                            window.location.href = '../favorites/index.html';
                        }
                    }, 1500);
                }
            }
        },

        // 隐藏章节内容（当检测到开发者工具时）
        hideChapterContent() {
            const chapterBody = document.querySelector('.chapter-body');
            if (chapterBody && !chapterBody.dataset.originalContent) {
                // 保存原始内容
                chapterBody.dataset.originalContent = chapterBody.innerHTML;
                
                // 替换为警告内容
                chapterBody.innerHTML = `
                    <div style="text-align: center; padding: 3rem; background: #fff3cd; border: 2px solid #ffc107; border-radius: 10px; color: #856404;">
                        <h3 style="color: #dc3545; margin-bottom: 1rem;">🚫 内容已隐藏</h3>
                        <p style="font-size: 1.1rem; margin-bottom: 1rem;">检测到开发者工具已打开</p>
                        <p style="color: #666;">为保护小说版权，内容已被隐藏</p>
                        <p style="color: #666; font-size: 0.9rem;">请关闭开发者工具以继续阅读</p>
                    </div>
                `;
            }
        },

        // 恢复章节内容（当开发者工具关闭时）
        restoreChapterContent() {
            const chapterBody = document.querySelector('.chapter-body');
            if (chapterBody && chapterBody.dataset.originalContent) {
                // 恢复原始内容
                chapterBody.innerHTML = chapterBody.dataset.originalContent;
                delete chapterBody.dataset.originalContent;
            }
        }
    }
}).mount('#reading-app');
