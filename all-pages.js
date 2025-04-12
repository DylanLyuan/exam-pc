document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const entrySource = urlParams.get('source');
    
    // 移除所有导航项的active类
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 根据当前页面路径或来源参数设置active类
    const currentPath = window.location.pathname.split('/').pop();
    
    if (currentPath === 'dashboard.html') {
        document.querySelector('.nav-item:nth-child(1)').classList.add('active');
    } else if (currentPath === 'learning_paths.html') {
        document.querySelector('.nav-item:nth-child(2)').classList.add('active');
    } else if (currentPath === 'my_exams.html') {
        document.querySelector('.nav-item:nth-child(3)').classList.add('active');
    } else if (entrySource === 'learning') {
        document.querySelector('.nav-item:nth-child(2)').classList.add('active');
    } else if (entrySource === 'myexams') {
        document.querySelector('.nav-item:nth-child(3)').classList.add('active');
    } else if (entrySource === 'dashboard') {
        document.querySelector('.nav-item:nth-child(1)').classList.add('active');
    }

    // 动态添加面包屑样式
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* 统一面包屑导航样式 */
        .breadcrumb {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            font-size: 14px;
            color: #b0b0b0;
            height: 20px;
        }
        
        .breadcrumb a {
            color: #5e81ac;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
        }
        
        .breadcrumb a:hover {
            text-decoration: underline;
        }
        
        .breadcrumb .separator {
            margin: 0 10px;
            color: #666;
            display: inline-flex;
            align-items: center;
        }
        
        .breadcrumb button {
            background: none;
            border: none;
            color: #5e81ac;
            font-size: 14px;
            padding: 0;
            cursor: pointer;
        }
        
        .breadcrumb button:hover {
            text-decoration: underline;
        }
        
        .breadcrumb span, 
        .breadcrumb a, 
        .breadcrumb button {
            line-height: 20px;
            vertical-align: middle;
        }
    `;
    document.head.appendChild(styleElement);
    
    // 检查面包屑导航是否存在，如果不存在则创建
    if (!document.querySelector('.breadcrumb')) {
        const container = document.querySelector('.container');
        if (container) {
            // 获取当前页面路径
            const path = window.location.pathname.split('/').pop();
            
            // 创建面包屑导航
            const breadcrumb = document.createElement('div');
            breadcrumb.className = 'breadcrumb';
            
            // 首页链接
            const homeLink = document.createElement('a');
            homeLink.href = 'dashboard.html';
            homeLink.textContent = '首页';
            breadcrumb.appendChild(homeLink);
            
            // 分隔符
            const separator = document.createElement('span');
            separator.className = 'separator';
            separator.textContent = '/';
            breadcrumb.appendChild(separator);
            
            // 根据当前页面设置二级导航
            const secondLevel = document.createElement('a');
            
            // 设置二级导航内容
            if (path.includes('learning_paths') || path.includes('course_list') || path.includes('course')) {
                secondLevel.href = 'learning_paths.html';
                secondLevel.textContent = '学习路线';
            } else if (path.includes('my_exams') || path.includes('exam_detail') || 
                      path.includes('exam_records') || path.includes('exam_result') || 
                      path.includes('leaderboard')) {
                secondLevel.href = 'my_exams.html';
                secondLevel.textContent = '我的考试';
            } else {
                secondLevel.href = '#';
                secondLevel.textContent = '当前页面';
            }
            
            breadcrumb.appendChild(secondLevel);
            
            // 在页面标题之前插入面包屑
            const pageTitle = container.querySelector('.page-title');
            if (pageTitle) {
                container.insertBefore(breadcrumb, pageTitle);
            } else {
                container.insertBefore(breadcrumb, container.firstChild);
            }
        }
    }

    // 更新考试名称（如果在考试相关页面）
    const examNameParam = urlParams.get('name');
    const examBreadcrumb = document.getElementById('exam-title-breadcrumb');
    if (examNameParam && examBreadcrumb) {
        examBreadcrumb.textContent = decodeURIComponent(examNameParam);
    }
    
    // 更新课程名称（如果在课程详情页面）
    const lessonNameParam = urlParams.get('name');
    const lessonNameElement = document.getElementById('lesson-name');
    if (lessonNameParam && lessonNameElement) {
        lessonNameElement.textContent = decodeURIComponent(lessonNameParam);
    }
    
    // 处理来源标记，确保二级导航正确
    const sourceParam = urlParams.get('source');
    if (sourceParam) {
        const secondLevel = document.querySelector('.breadcrumb a:nth-child(3)');
        if (secondLevel) {
            if (sourceParam === 'learning') {
                secondLevel.href = 'learning_exam.html';
                secondLevel.textContent = '学习考试';
            } else if (sourceParam === 'myexams') {
                secondLevel.href = 'my_exams.html';
                secondLevel.textContent = '我的考试';
            }
        }
    }

    // 全局加载状态管理
    function showLoading() {
        // 如果已存在加载覆盖层，先移除
        hideLoading();
        
        // 创建加载覆盖层
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.id = 'global-loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">加载中...</div>
        `;
        document.body.appendChild(overlay);
        
        // 设置超时自动隐藏（防止加载永远不消失）
        window.loadingTimeout = setTimeout(() => {
            hideLoading();
        }, 5000); // 5秒后自动隐藏
    }

    function hideLoading() {
        // 清除超时计时器
        if (window.loadingTimeout) {
            clearTimeout(window.loadingTimeout);
            window.loadingTimeout = null;
        }
        
        // 移除加载覆盖层
        const overlay = document.getElementById('global-loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // 全局错误处理
    window.onerror = function(message, source, lineno, colno, error) {
        console.error('页面发生错误:', message, 'at', source, lineno, colno);
        hideLoading();
        return true; // 防止默认错误提示
    };
    
    // 页面加载完成时隐藏加载状态
    window.addEventListener('load', function() {
        hideLoading();
    });
    
    // 导出全局方法
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
    
    // 自动绑定页面跳转前显示加载状态
    document.addEventListener('click', function(e) {
        // 检查是否点击了链接
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') && !link.getAttribute('href').startsWith('#') && 
            !link.getAttribute('href').startsWith('javascript:')) {
            showLoading();
        }
    });

    // 页面路由配置
    const routes = {
        'dashboard': 'dashboard.html',
        'course': 'course.html',
        'exam_page': 'exam_page.html',
        'current_exam': 'current_exam.html',
        'exam_records': 'exam_records.html',
        'exam_result': 'exam_result.html',
        'leaderboard': 'leaderboard.html',
        'my_exams': 'my_exams.html',
        'learning_paths': 'learning_paths.html',
        'course_list': 'course_list.html'
    };

    // 通用导航函数
    function navigate(page, params = {}) {
        let url = routes[page];
        if (!url) {
            console.error('页面不存在：', page);
            return;
        }
        
        // 添加URL参数
        if (Object.keys(params).length > 0) {
            const queryString = new URLSearchParams(params).toString();
            url = `${url}?${queryString}`;
        }
        
        window.location.href = url;
    }

    // 检查页面是否存在
    function checkPageExists(url) {
        return new Promise((resolve) => {
            fetch(url, { method: 'HEAD' })
                .then(response => resolve(response.ok))
                .catch(() => resolve(false));
        });
    }

    // 初始化导航栏
    function initNavigation() {
        // 添加导航栏点击事件
        $('.nav-item').on('click', function(e) {
            e.preventDefault();
            const page = $(this).data('page');
            navigate(page);
        });

        // 添加面包屑导航点击事件
        $('.breadcrumb-item').on('click', function(e) {
            e.preventDefault();
            const page = $(this).data('page');
            if (page) {
                navigate(page);
            }
        });
    }

    // 页面加载完成后初始化
    $(document).ready(function() {
        initNavigation();
        
        // 验证所有页面链接
        Object.values(routes).forEach(async (url) => {
            const exists = await checkPageExists(url);
            if (!exists) {
                console.warn(`警告：页面 ${url} 不存在`);
            }
        });
    });

    // 更新面包屑导航
    function updateBreadcrumb() {
        const path = window.location.pathname;
        const breadcrumb = document.querySelector('.breadcrumb');
        
        if (!breadcrumb) return;
        
        // 清空现有内容
        breadcrumb.innerHTML = '';
        
        // 添加首页链接
        const homeLink = document.createElement('a');
        homeLink.href = 'dashboard.html';
        homeLink.textContent = '首页';
        breadcrumb.appendChild(homeLink);
        
        // 添加分隔符和二级导航
        if (path.includes('learning_paths')) {
            appendBreadcrumbItem(breadcrumb, null, '学习路线');
        } else if (path.includes('course_list')) {
            appendBreadcrumbItem(breadcrumb, 'learning_paths.html', '学习路线');
            appendBreadcrumbItem(breadcrumb, null, '课程列表');
        } else if (path.includes('course')) {
            appendBreadcrumbItem(breadcrumb, 'learning_paths.html', '学习路线');
            
            // 获取来源和路径ID
            const urlParams = new URLSearchParams(window.location.search);
            const source = urlParams.get('source');
            const pathId = urlParams.get('pathId');
            const pathName = urlParams.get('pathName');
            
            if (source === 'course_list' && pathId) {
                const courseListLink = `course_list.html?pathId=${pathId}&pathName=${encodeURIComponent(pathName || '')}`;
                appendBreadcrumbItem(breadcrumb, courseListLink, '课程列表');
            }
            
            appendBreadcrumbItem(breadcrumb, null, '课程学习');
        } else if (path.includes('my_exams')) {
            appendBreadcrumbItem(breadcrumb, null, '我的考试');
        } else if (path.includes('exam_records')) {
            appendBreadcrumbItem(breadcrumb, null, '考试记录');
        } else if (path.includes('exam_result')) {
            appendBreadcrumbItem(breadcrumb, 'exam_records.html', '考试记录');
            appendBreadcrumbItem(breadcrumb, null, '考试结果');
        } else if (path.includes('leaderboard')) {
            appendBreadcrumbItem(breadcrumb, null, '排行榜');
        } else if (path.includes('exam_page')) {
            appendBreadcrumbItem(breadcrumb, 'my_exams.html', '我的考试');
            appendBreadcrumbItem(breadcrumb, null, '考试');
        } else if (path.includes('current_exam')) {
            appendBreadcrumbItem(breadcrumb, 'my_exams.html', '我的考试');
            appendBreadcrumbItem(breadcrumb, null, '考试进行中');
        }
    }

    function appendBreadcrumbItem(breadcrumb, href, text) {
        // 添加分隔符
        const separator = document.createElement('span');
        separator.className = 'separator';
        separator.textContent = ' / ';
        breadcrumb.appendChild(separator);
        
        // 添加导航项
        if (href) {
            const link = document.createElement('a');
            link.href = href;
            link.textContent = text;
            breadcrumb.appendChild(link);
        } else {
            const span = document.createElement('span');
            span.textContent = text;
            breadcrumb.appendChild(span);
        }
    }

    // 添加导航栏统一处理函数
    function setupNavigation() {
        // 获取当前页面的文件名
        const currentPage = window.location.pathname.split('/').pop();
        
        // 设置导航项的激活状态
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            const link = item.querySelector('a');
            const href = link.getAttribute('href');
            
            if ((currentPage === 'dashboard.html' || currentPage === '' || currentPage === 'index.html') && 
                href === 'dashboard.html') {
                item.classList.add('active');
            } else if (currentPage === 'learning_paths.html' && href === 'learning_paths.html') {
                item.classList.add('active');
            } else if (currentPage === 'course_list.html' && href === 'learning_paths.html') {
                item.classList.add('active');
            } else if (currentPage === 'my_exams.html' && href === 'my_exams.html') {
                item.classList.add('active');
            } else if ((currentPage === 'exam_records.html' || 
                       currentPage === 'exam_page.html' || 
                       currentPage === 'current_exam.html' || 
                       currentPage === 'exam_result.html' ||
                       currentPage === 'leaderboard.html') && 
                       href === 'my_exams.html') {
                item.classList.add('active');
            } else if (currentPage === 'course.html' && href === 'learning_paths.html') {
                item.classList.add('active');
            }
        });
        
        // 检查URL参数中是否有source=exam
        const urlParams = new URLSearchParams(window.location.search);
        const source = urlParams.get('source');
        
        // 如果是从考试页面跳转到学习路线页面，高亮学习路线菜单
        if (currentPage === 'learning_paths.html' && source === 'exam') {
            navItems.forEach(item => {
                item.classList.remove('active');
                const link = item.querySelector('a');
                if (link && link.getAttribute('href') === 'learning_paths.html') {
                    item.classList.add('active');
                }
            });
        }
    }

    // 页面加载完成后执行导航设置
    setupNavigation();

    // 处理导航链接点击
    const navLinks = document.querySelectorAll('.nav-item a, .breadcrumb a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // 只处理真实链接，不处理#或javascript:void(0)类型的链接
            if (href && href !== '#' && !href.startsWith('javascript:')) {
                e.preventDefault(); // 阻止默认行为
                showLoading();
                
                // 用setTimeout确保加载效果能显示出来，然后再跳转
                setTimeout(() => {
                    window.location.href = href;
                }, 100);
            }
        });
    });
    
    // 确保页面完全加载后隐藏加载状态
    window.addEventListener('load', function() {
        hideLoading();
    });

    // 给按钮添加加载状态处理
    function addLoadingToButtons() {
        const actionButtons = document.querySelectorAll('.btn:not([data-no-loading])');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // 如果按钮有自己的处理函数，则不在这里处理加载状态
                if (this.getAttribute('onclick')) return;
                
                // 从按钮上获取目标链接
                const href = this.getAttribute('data-href');
                if (href) {
                    showLoading();
                    setTimeout(() => {
                        window.location.href = href;
                    }, 100);
                }
            });
        });
    }

    // 在页面加载完成后添加按钮加载处理
    addLoadingToButtons();

    // 1. 添加页面过渡动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 2. 为所有链接添加平滑过渡效果
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        // 排除外部链接
        if (link.href.includes(window.location.hostname) || link.href.startsWith('/') || link.href.startsWith('./') || link.href.startsWith('../')) {
            link.addEventListener('click', function(e) {
                // 排除具有特殊行为的链接
                if (this.getAttribute('target') === '_blank' || this.getAttribute('data-no-transition')) return;
                
                e.preventDefault();
                const targetUrl = this.href;
                
                document.body.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 300);
            });
        }
    });
    
    // 3. 按钮悬停效果增强
    const allButtons = document.querySelectorAll('.btn, button');
    allButtons.forEach(button => {
        if (!button.classList.contains('enhanced')) {
            button.classList.add('enhanced');
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        }
    });
    
    // 4. 为表格添加行悬停效果
    const allTables = document.querySelectorAll('table');
    allTables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#2d3440';
                this.style.transition = 'background-color 0.2s ease';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
        });
    });
    
    // 5. 为卡片元素添加悬浮效果
    const cards = document.querySelectorAll('.card, .exam-card, .course-card, .leaderboard-card, .result-header, .records-header, .my-rank-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.3)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // 6. 为导航项添加动画效果
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (!item.classList.contains('animated')) {
            item.classList.add('animated');
            
            // 添加悬停指示器
            const indicator = document.createElement('div');
            indicator.className = 'nav-indicator';
            indicator.style.position = 'absolute';
            indicator.style.bottom = '0';
            indicator.style.left = '0';
            indicator.style.width = '100%';
            indicator.style.height = '3px';
            indicator.style.backgroundColor = '#5e81ac';
            indicator.style.transform = 'scaleX(0)';
            indicator.style.transition = 'transform 0.3s ease';
            indicator.style.transformOrigin = 'center';
            indicator.style.opacity = '0';
            
            // 只为非活动项添加悬停效果
            if (!item.classList.contains('active')) {
                item.appendChild(indicator);
                
                item.addEventListener('mouseenter', function() {
                    indicator.style.transform = 'scaleX(1)';
                    indicator.style.opacity = '0.5';
                });
                
                item.addEventListener('mouseleave', function() {
                    indicator.style.transform = 'scaleX(0)';
                    indicator.style.opacity = '0';
                });
            }
        }
    });
    
    // 7. 表单元素增强
    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
        if (!element.classList.contains('enhanced')) {
            element.classList.add('enhanced');
            
            element.addEventListener('focus', function() {
                this.style.boxShadow = '0 0 0 2px rgba(94, 129, 172, 0.3)';
                this.style.borderColor = '#5e81ac';
                this.style.transition = 'all 0.3s ease';
            });
            
            element.addEventListener('blur', function() {
                this.style.boxShadow = '';
                this.style.borderColor = '';
            });
        }
    });
    
    // 8. 分页增强
    const paginationItems = document.querySelectorAll('.pagination .page-item');
    paginationItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
                this.style.transition = 'all 0.2s ease';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // 9. 为图片添加加载动画
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        }
    });
    
    // 10. 添加滚动到顶部按钮
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.style.position = 'fixed';
    scrollTopBtn.style.bottom = '20px';
    scrollTopBtn.style.right = '20px';
    scrollTopBtn.style.width = '40px';
    scrollTopBtn.style.height = '40px';
    scrollTopBtn.style.borderRadius = '50%';
    scrollTopBtn.style.backgroundColor = '#5e81ac';
    scrollTopBtn.style.color = 'white';
    scrollTopBtn.style.border = 'none';
    scrollTopBtn.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    scrollTopBtn.style.cursor = 'pointer';
    scrollTopBtn.style.display = 'none';
    scrollTopBtn.style.zIndex = '999';
    scrollTopBtn.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
            scrollTopBtn.style.opacity = '1';
        } else {
            scrollTopBtn.style.opacity = '0';
            setTimeout(() => {
                if (window.pageYOffset <= 300) {
                    scrollTopBtn.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // 11. 页面加载时添加内容动画
    const animateContent = () => {
        const elements = document.querySelectorAll('.container > *');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 + index * 100);
        });
    };
    
    // 在页面完全加载后执行内容动画
    window.addEventListener('load', animateContent);
    
    // 12. 增强用户反馈
    const provideFeedback = (message, type = 'info') => {
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${type}`;
        feedback.textContent = message;
        
        // 样式
        feedback.style.position = 'fixed';
        feedback.style.top = '20px';
        feedback.style.right = '20px';
        feedback.style.padding = '10px 20px';
        feedback.style.borderRadius = '4px';
        feedback.style.zIndex = '1000';
        feedback.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
        feedback.style.transition = 'all 0.3s ease';
        feedback.style.transform = 'translateX(100%)';
        
        // 设置类型样式
        if (type === 'success') {
            feedback.style.backgroundColor = '#a3be8c';
            feedback.style.color = 'white';
        } else if (type === 'error') {
            feedback.style.backgroundColor = '#bf616a';
            feedback.style.color = 'white';
        } else {
            feedback.style.backgroundColor = '#5e81ac';
            feedback.style.color = 'white';
        }
        
        document.body.appendChild(feedback);
        
        // 显示消息
        setTimeout(() => {
            feedback.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            feedback.style.transform = 'translateX(100%)';
            
            // 移除元素
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 3000);
    };
    
    // 添加到window对象供所有页面使用
    window.showFeedback = provideFeedback;
});

// 添加全局样式
const globalStyles = document.createElement('style');
globalStyles.innerHTML = `
    /* 全局动画效果 */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    /* 增强按钮样式 */
    .btn {
        transition: all 0.3s ease !important;
    }
    
    .btn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
    }
    
    /* 卡片悬浮效果 */
    .card, .exam-card, .course-card, .leaderboard-card, 
    .result-header, .records-header, .my-rank-card {
        transition: all 0.3s ease !important;
    }
    
    /* 统一表单元素样式 */
    input, select, textarea {
        transition: all 0.3s ease !important;
    }
    
    input:focus, select:focus, textarea:focus {
        box-shadow: 0 0 0 2px rgba(94, 129, 172, 0.3) !important;
        border-color: #5e81ac !important;
        outline: none !important;
    }
    
    /* 自定义滚动条 */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background-color: #2e3440;
    }
    
    ::-webkit-scrollbar-thumb {
        background-color: #4c566a;
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background-color: #5e81ac;
    }
    
    /* 文本选择样式 */
    ::selection {
        background-color: rgba(94, 129, 172, 0.3);
        color: #eceff4;
    }
`;

document.head.appendChild(globalStyles); 