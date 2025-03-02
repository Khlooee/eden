class VisitorTracker {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api';
    }

    async recordVisit(pageName) {
        try {
            await fetch(`${this.apiUrl}/visit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pageName })
            });
        } catch (err) {
            console.error('Error recording visit:', err);
        }
    }

    async recordExit(pageName) {
        try {
            await fetch(`${this.apiUrl}/exit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pageName })
            });
        } catch (err) {
            console.error('Error recording exit:', err);
        }
    }

    async getStats(pageName) {
        try {
            const response = await fetch(`${this.apiUrl}/stats/${encodeURIComponent(pageName)}`);
            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Error getting stats:', err);
            return { totalVisits: 0, currentVisitors: 0 };
        }
    }
}

// 創建全局訪客追蹤器實例
const visitorTracker = new VisitorTracker();

// Google Analytics 代碼
const GA_MEASUREMENT_ID = 'G-GK26YHVEMZ'; // 請替換為您的 Google Analytics 測量 ID

// 初始化 Google Analytics
function initGA() {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
}

// 更新頁面計數器
function updateVisitorCounter() {
    const counter = document.getElementById('visitorCounter');
    if (!counter) return;

    // 由於無法實時獲取準確的在線人數，我們只顯示總訪問量
    counter.innerHTML = `
        <div style="text-align: center;">
            訪問統計中...
        </div>
    `;
}

// 頁面加載時
window.addEventListener('load', () => {
    initGA();
    updateVisitorCounter();
});

// 頁面關閉時
window.addEventListener('beforeunload', () => {
    const pageName = window.location.pathname;
    visitorTracker.recordExit(pageName);
}); 