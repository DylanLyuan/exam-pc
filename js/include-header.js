// 加载公共头部
function loadHeader() {
    // 使用绝对路径加载头部模板
    fetch('/exam-PC/templates/header-template.html')
        .then(response => response.text())
        .then(html => {
            // 将头部模板插入到指定位置
            document.getElementById('header-placeholder').innerHTML = html;
            
            // 设置活动菜单项
            setActiveMenuItem();
            
            // 添加用户菜单功能
            setupUserMenu();
        })
        .catch(error => {
            console.error('加载头部模板失败:', error);
            // 加载失败时使用备用方法
            loadHeaderFallback();
        });
}

// 备用方法：直接内联头部模板
function loadHeaderFallback() {
    const headerHtml = `
    <header class="header">
        <div class="logo">
            <a href="dashboard.html">
                <img src="https://placeholder.pics/svg/36x36/5E81AC/FFFFFF/LOGO" alt="新威Logo">
                <span>新威课堂</span>
            </a>
        </div>
        <div class="nav-items">
            <div class="nav-item">
                <a href="dashboard.html">首页</a>
            </div>
            <div class="nav-item">
                <a href="learning_paths.html">学习路线</a>
            </div>
            <div class="nav-item">
                <a href="my_exams.html">我的考试</a>
            </div>
        </div>
        <div class="user-info">
            <span>张三</span>
            <div class="avatar" style="background-image: url('https://placeholder.pics/svg/36x36/DEDEDE/555555/头像')" title="个人中心"></div>
        </div>
    </header>
    <div id="global-loading" style="display: none;">
        <div class="loading-spinner"></div>
    </div>
    `;
    
    document.getElementById('header-placeholder').innerHTML = headerHtml;
    
    // 设置活动菜单项
    setActiveMenuItem();
    
    // 添加用户菜单功能
    setupUserMenu();
}

// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', loadHeader); 