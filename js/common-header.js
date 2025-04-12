document.addEventListener('DOMContentLoaded', function() {
    // 设置活动菜单项
    setActiveMenuItem();
    
    // 添加用户菜单功能
    setupUserMenu();
    
    // 如果页面加载完成后还显示加载中，强制隐藏
    setTimeout(function() {
        hideLoading();
    }, 1000);
});

// 根据当前页面URL设置活动菜单项
function setActiveMenuItem() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.nav-item');
    
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // 移除所有active类
        item.classList.remove('active');
        
        // 根据URL设置当前活动项
        if (currentPath.includes('dashboard') && href.includes('dashboard')) {
            item.classList.add('active');
        } else if (currentPath.includes('learning_path') && href.includes('learning_path')) {
            item.classList.add('active');
        } else if (currentPath.includes('my_exam') && href.includes('my_exam')) {
            item.classList.add('active');
        } else if (currentPath.includes('course') && 
                 (href.includes('learning_path') || href.includes('course'))) {
            // 如果是课程页面，也高亮学习路线
            if (href.includes('learning_path')) {
                item.classList.add('active');
            }
        }
    });
}

// 设置用户菜单的显示/隐藏
function setupUserMenu() {
    const avatar = document.querySelector('.avatar');
    
    if (avatar) {
        avatar.addEventListener('click', function() {
            // 这里可以实现用户菜单的显示/隐藏逻辑
            // 例如弹出一个包含个人中心、设置、退出等选项的下拉菜单
            console.log('用户菜单');
            
            // 如果已有下拉菜单实现，只需添加切换显示的代码
            const userMenu = document.querySelector('.user-dropdown');
            if (userMenu) {
                userMenu.classList.toggle('visible');
            }
        });
    }
}

// 显示加载状态
function showLoading() {
    const loading = document.getElementById('global-loading');
    if (loading) {
        loading.style.display = 'flex';
    } else {
        // 如果页面上没有loading元素，创建一个
        const loadingEl = document.createElement('div');
        loadingEl.id = 'global-loading';
        loadingEl.innerHTML = '<div class="loading-spinner"></div>';
        loadingEl.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center; z-index:9999;';
        document.body.appendChild(loadingEl);
    }
    
    // 安全机制：最长显示5秒
    setTimeout(hideLoading, 5000);
}

// 隐藏加载状态
function hideLoading() {
    const loading = document.getElementById('global-loading');
    if (loading) {
        loading.style.display = 'none';
    }
} 