window.onerror = function(message, source, lineno, colno, error) {
    console.log("详细错误信息:", {
        message: message,
        source: source,
        lineno: lineno,
        colno: colno,
        error: error
    });
    
    // 如果存在错误对象，记录堆栈跟踪
    if (error && error.stack) {
        console.log("错误堆栈:", error.stack);
    }
    
    return false; // 让错误继续传播到控制台
} 