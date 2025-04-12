// 创建一个新的JS文件专门处理课程列表页面逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const pathId = urlParams.get('pathId') || '1';  // 默认为1
    const pathName = urlParams.get('pathName');
    
    // 如果URL中有路径名称，则更新页面标题
    if (pathName) {
        document.title = `${decodeURIComponent(pathName)} - 课程列表`;
        const pathTitle = document.querySelector('.path-title h1');
        if (pathTitle) {
            pathTitle.textContent = decodeURIComponent(pathName);
        }
        const pathNameElement = document.getElementById('path-name');
        if (pathNameElement) {
            pathNameElement.textContent = decodeURIComponent(pathName);
        }
    }
    
    // 初始化筛选功能
    setupFilters();
    
    // 加载课程列表数据
    loadCourseList(pathId);
});

// 设置筛选功能
function setupFilters() {
    // 分类筛选点击事件
    document.querySelectorAll('.filter-pill[data-category]').forEach(pill => {
        pill.addEventListener('click', function() {
            document.querySelectorAll('.filter-pill[data-category]').forEach(p => {
                p.classList.remove('active');
            });
            this.classList.add('active');
            
            // 更新等级筛选
            updateLevelFilters(this.getAttribute('data-category'));
            
            // 应用筛选
            filterCourses();
        });
    });
    
    // 初始化等级筛选
    updateLevelFilters('all');
    
    // 设置等级筛选事件委托
    const levelFilterContainer = document.getElementById('levelFilterContainer');
    if (levelFilterContainer) {
        levelFilterContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('filter-pill')) {
                document.querySelectorAll('#levelFilterContainer .filter-pill').forEach(p => {
                    p.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // 应用筛选
                filterCourses();
            }
        });
    }
}

// 更新等级筛选选项
function updateLevelFilters(category) {
    // 设置技能分类和等级的关系
    const categoryLevels = {
        'Q': [0, 1, 2],
        'S': [1, 2, 3],
        'H': [2, 3, 4],
        'T': [2, 3, 4, 5],
        'P': [1, 2, 3, 4],
        'A': [3, 4, 5, 6],
        'C': [0, 1, 2, 3]
    };
    
    const container = document.getElementById('levelFilterContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    let levelOptions = '<span class="filter-label">技能等级：</span><div class="filter-pills">';
    levelOptions += '<div class="filter-pill active" data-level="all">全部</div>';
    
    if (category === 'all') {
        // 全部分类时显示0-6所有等级
        for (let i = 0; i <= 6; i++) {
            levelOptions += `<div class="filter-pill" data-level="${i}">${i}</div>`;
        }
    } else {
        // 特定分类时只显示该分类对应的等级
        const levels = categoryLevels[category] || [];
        levels.forEach(level => {
            levelOptions += `<div class="filter-pill" data-level="${level}">${level}</div>`;
        });
    }
    
    levelOptions += '</div>';
    container.innerHTML = levelOptions;
}

// 筛选课程
function filterCourses() {
    const activeCategoryPill = document.querySelector('.filter-pill[data-category].active');
    if (!activeCategoryPill) return;
    
    const selectedCategory = activeCategoryPill.getAttribute('data-category');
    const selectedLevelElement = document.querySelector('#levelFilterContainer .filter-pill.active');
    const selectedLevel = selectedLevelElement ? selectedLevelElement.getAttribute('data-level') : 'all';
    
    let visibleCount = 0;
    
    // 遍历所有课程项
    document.querySelectorAll('.course-item').forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        const itemLevel = item.getAttribute('data-level');
        
        // 检查是否符合所有筛选条件
        const matchCategory = selectedCategory === 'all' || itemCategory === selectedCategory;
        const matchLevel = selectedLevel === 'all' || itemLevel == selectedLevel;
        
        if (matchCategory && matchLevel) {
            item.classList.remove('hidden');
            visibleCount++;
        } else {
            item.classList.add('hidden');
        }
    });
    
    // 显示或隐藏空状态提示
    const emptyState = document.getElementById('emptyState');
    if (visibleCount === 0 && emptyState) {
        emptyState.style.display = 'block';
    } else if (emptyState) {
        emptyState.style.display = 'none';
    }
}

// 加载课程列表数据
function loadCourseList(pathId) {
    showLoading();
    
    // 模拟API调用
    setTimeout(() => {
        // 模拟数据
        const courses = [
            {
                id: 1,
                title: "初级保险销售技能培训",
                category: "S",
                level: 1,
                image: "https://fakeimg.pl/400x200/333333/666666/销售技能",
                duration: "2.5小时",
                learners: "1245人",
                progress: 60,
                status: "进行中",
                description: "本课程旨在帮助初级保险销售人员掌握基本的销售技巧和沟通策略，提高客户转化率和服务质量。",
                deadline: "2023-05-30",
                exam: {
                    title: "初级保险销售技能考核",
                    deadline: "2023-05-30",
                    duration: "60分钟",
                    questions: 50
                }
            },
            {
                id: 2,
                title: "客户沟通技巧进阶",
                category: "C",
                level: 2,
                image: "https://fakeimg.pl/400x200/333333/666666/沟通技巧",
                duration: "3.5小时",
                learners: "1050人",
                progress: 40,
                status: "进行中",
                description: "学习如何有效沟通，处理客户异议，提升成单率。",
                deadline: "2023-07-10",
                exam: {
                    title: "客户沟通能力测试",
                    deadline: "2023-07-10",
                    duration: "50分钟",
                    questions: 45
                }
            },
            {
                id: 3,
                title: "产品详情与卖点解析",
                category: "Q",
                level: 1,
                image: "https://fakeimg.pl/400x200/333333/666666/产品知识",
                duration: "4小时",
                learners: "980人",
                progress: 0,
                status: "未开始",
                description: "深入了解产品详情，掌握核心卖点和竞品分析。",
                deadline: "2023-08-15"
            },
            // 新增课程
            {
                id: 4,
                title: "保险行业法规基础",
                category: "P",
                level: 1,
                image: "https://fakeimg.pl/400x200/333333/666666/法规基础",
                duration: "3小时",
                learners: "865人",
                progress: 100,
                status: "已完成",
                description: "了解保险行业相关法规政策，确保销售合规。",
                completedDate: "2023-03-15",
                score: 92
            },
            {
                id: 5,
                title: "客户需求分析方法",
                category: "A",
                level: 2, 
                image: "https://fakeimg.pl/400x200/333333/666666/需求分析",
                duration: "3.5小时",
                learners: "720人", 
                progress: 25,
                status: "进行中",
                description: "学习如何准确判断客户需求，提供匹配的解决方案。",
                deadline: "2023-06-20"
            },
            {
                id: 6,
                title: "企业文化与价值观",
                category: "C",
                level: 1,
                image: "https://fakeimg.pl/400x200/333333/666666/企业文化",
                duration: "2小时",
                learners: "1350人",
                progress: 100,
                status: "已完成",
                completedDate: "2023-02-10",
                score: 95,
                description: "了解公司的使命、愿景和核心价值观，增强企业认同感。"
            },
            {
                id: 7,
                title: "销售流程标准化培训",
                category: "S",
                level: 2,
                image: "https://fakeimg.pl/400x200/333333/666666/销售流程",
                duration: "4小时",
                learners: "930人",
                progress: 80,
                status: "进行中",
                description: "掌握标准化销售流程，提高工作效率和客户体验。",
                deadline: "2023-05-25"
            },
            {
                id: 8,
                title: "基础数据分析技能",
                category: "A",
                level: 1,
                image: "https://fakeimg.pl/400x200/333333/666666/数据分析",
                duration: "3小时",
                learners: "680人",
                progress: 0,
                status: "未开始",
                description: "学习基础数据分析方法，用数据指导销售策略。",
                deadline: "2023-09-05"
            },
            {
                id: 9,
                title: "团队协作与沟通",
                category: "T",
                level: 1,
                image: "https://fakeimg.pl/400x200/333333/666666/团队协作",
                duration: "2.5小时",
                learners: "910人",
                progress: 45,
                status: "进行中",
                description: "提升团队协作能力，学习高效沟通技巧。",
                deadline: "2023-06-15"
            },
            {
                id: 10,
                title: "高级谈判策略",
                category: "H",
                level: 3,
                image: "https://fakeimg.pl/400x200/333333/666666/谈判策略",
                duration: "5小时",
                learners: "450人",
                progress: 0,
                status: "未开始",
                description: "掌握高级谈判技巧，应对复杂销售场景。",
                deadline: "2023-10-10",
                locked: true,
                lockReason: "需要完成所有2级课程"
            },
            {
                id: 11,
                title: "时间管理与工作效率",
                category: "H",
                level: 2,
                image: "https://fakeimg.pl/400x200/333333/666666/时间管理",
                duration: "2.5小时",
                learners: "750人",
                progress: 0,
                status: "未开始",
                description: "学习高效时间管理方法，提升工作效率。",
                deadline: "2023-07-30"
            },
            {
                id: 12,
                title: "新产品线详解",
                category: "Q",
                level: 2,
                image: "https://fakeimg.pl/400x200/333333/666666/产品线",
                duration: "4.5小时",
                learners: "630人",
                progress: 20,
                status: "进行中",
                description: "全面解析公司新产品线，掌握产品特点与优势。",
                deadline: "2023-08-20"
            }
        ];
        
        renderCourseList(courses);
        hideLoading();
    }, 800);
}

// 渲染课程列表
function renderCourseList(courses) {
    const courseList = document.querySelector('.course-list');
    if (!courseList) return;
    
    courseList.innerHTML = '';
    
    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'course-item';
        courseElement.setAttribute('data-category', course.category);
        courseElement.setAttribute('data-level', course.level);
        
        courseElement.innerHTML = `
            <div class="course-header">
                <h3 class="course-name">${course.title}</h3>
            </div>
            <div class="course-content">
                <div class="course-meta">
                    <div class="meta-item">
                        <i class="fas fa-users"></i>
                        <span>学习人数: ${course.learners}</span>
                    </div>
                </div>
                
                <div class="related-exam">
                    <div class="related-exam-title">
                        <i class="fas fa-file-alt"></i>${course.exam.title}
                    </div>
                    <div class="exam-details">
                        <div class="exam-detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>截止日期: ${course.deadline}</span>
                        </div>
                        <div class="exam-detail-item">
                            <i class="fas fa-clock"></i>
                            <span>考试时长: ${course.exam.duration}</span>
                        </div>
                        <div class="exam-detail-item">
                            <i class="fas fa-list-ol"></i>
                            <span>题目数量: ${course.exam.questions}题</span>
                        </div>
                    </div>
                </div>
                
                <div class="course-actions">
                    <button class="btn btn-primary" onclick="startCourse(${course.id}, '${course.title}')">
                        <i class="fas fa-play-circle"></i>学习
                    </button>
                    <button class="btn btn-secondary" onclick="startExam(${course.id}, '${course.exam.title}')">
                        <i class="fas fa-file-alt"></i>去考试
                    </button>
                    <button class="btn btn-secondary" onclick="viewExamRecords(${course.id})">
                        <i class="fas fa-history"></i>考试记录
                    </button>
                </div>
            </div>
        `;
        
        courseList.appendChild(courseElement);
    });
}

// 开始学习课程
function startCourse(courseId, courseName) {
    showLoading();
    
    // 跳转到课程详情页
    setTimeout(() => {
        window.location.href = `course.html?id=${courseId}&pathId=1&name=${encodeURIComponent(courseName)}&source=course_list`;
    }, 500);
}

// 开始考试
function startExam(courseId, examName) {
    showLoading();
    // 跳转到考试页面
    setTimeout(() => {
        window.location.href = `current_exam.html?courseId=${courseId}&examName=${encodeURIComponent(examName)}`;
    }, 500);
}

// 查看考试记录
function viewExamRecords(courseId) {
    showLoading();
    setTimeout(() => {
        window.location.href = `exam_records.html?courseId=${courseId}`;
    }, 500);
}

// 已在all-pages.js中定义，保持一致
function showLoading() {
    document.getElementById('global-loading').style.display = 'flex';
}

// 已在all-pages.js中定义，保持一致
function hideLoading() {
    document.getElementById('global-loading').style.display = 'none';
} 