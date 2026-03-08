
(function () {
    'use strict';
const style = document.createElement("style");
style.textContent = `
#countdownBtn{
    position: relative !important;
}

#countdownBtn::before{
    content: "ĐÃ TÌM THẤY NÚT";
    position: fixed;
    top: 200px;
    right: 20px;
    z-index:999999999999999999;
    background: rgba(0,0,0,0.9);
    color: #00ffcc;
    padding: 12px 20px;
    border-radius: 10px;
    font-weight: bold;
    font-size: 14px;
    z-index: 2147483647;
    box-shadow: 0 0 20px rgba(0,255,200,0.6);
}
`;
(document.head || document.documentElement).appendChild(style);
    // ================= FORCE BACKGROUND RUN =================
// ================= FORCE ONLINE + NO THROTTLE =================

// Giả lập luôn online
Object.defineProperty(navigator, 'onLine', {
    get: () => true
});

// Chặn event offline
window.addEventListener('offline', e => {
    e.stopImmediatePropagation();
}, true);

// Fake Network Information API
if (navigator.connection) {
    Object.defineProperty(navigator.connection, 'downlink', { get: () => 10 });
    Object.defineProperty(navigator.connection, 'effectiveType', { get: () => '4g' });
    Object.defineProperty(navigator.connection, 'rtt', { get: () => 50 });
}

// Bỏ background timer throttle

// Giữ CPU active bằng loop nhỏ
setInterval(() => {
    document.body.offsetHeight;
}, 1000);

// Force document readyState luôn complete
Object.defineProperty(document, 'readyState', {
    get: () => 'complete'
});

// ==============================================================
    Object.defineProperty(document, 'hidden', { value: false });
    Object.defineProperty(document, 'visibilityState', { value: 'visible' });
    document.hasFocus = () => true;

    window.addEventListener('visibilitychange', e => {
        e.stopImmediatePropagation();
    }, true);

    unsafeWindow.requestAnimationFrame = (cb) => setTimeout(cb, 16);

    // ========================================================

    // ================== NÚT VỀ TRANG CHỦ (GIỮA MÀN HÌNH) ==================

    function createHomeButton() {

        const btn = document.createElement("button");
        btn.innerText = "⬅ Về Trang Chủ";

        btn.style.position = "fixed";
        btn.style.top = "50%";
        btn.style.left = "50%";
        btn.style.transform = "translate(-50%, -50%)";
        btn.style.zIndex = "999999";

        btn.style.padding = "14px 28px";
        btn.style.background = "#ff4757";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.borderRadius = "12px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "16px";
        btn.style.fontWeight = "bold";
        btn.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
        btn.style.transition = "0.2s";

        btn.onmouseover = () =>
            btn.style.transform = "translate(-50%, -50%) scale(1.05)";
        btn.onmouseout = () =>
            btn.style.transform = "translate(-50%, -50%) scale(1)";

        btn.onclick = () => {
            location.replace("https://maxtask.net/home/tasks");
        };

        document.body.appendChild(btn);
    }

    window.addEventListener("load", () => {
        setTimeout(createHomeButton, 800);
    });

    // ========================================================

    const CONFIG_URL = "https://raw.githubusercontent.com/dam-thanh/cookie/refs/heads/main/keyys.json";
    const REDIRECT_MAP_URL = "https://raw.githubusercontent.com/dam-thanh/cookie/refs/heads/main/redirectMap.json";
    const HOME_URL = "https://maxtask.net/home/tasks";
// ================= FINISH PAGE TIMEOUT =================
if (location.hostname.includes("uptolink.one") && location.pathname.includes("/finish/")) {
    setTimeout(() => {
        location.replace(HOME_URL);
    }, 60000); // 60 giây
}
    // ================== GOOGLE REDIRECT ==================

    function handleGoogleRedirect() {
        const url = new URL(window.location.href);

        if (url.hostname.includes('google.com')) {

            const q = url.searchParams.get("q");
            if (q) {
                setTimeout(() => location.href = q, 300);
                return true;
            }

            const rd = url.searchParams.get("rd");
            if (rd) {
                setTimeout(() => location.href = "https://" + rd, 300);
                return true;
            }
        }
        return false;
    }

    if (handleGoogleRedirect()) return;

    // ================== REAL CLICK ==================

    function realClick(element) {
        if (!element) return;

        element.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
        element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        element.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }

    // ================== MAIN ==================
// ================= FORCE BUTTON TO FRONT =================
function bringButtonToFront(btn) {
    if (!btn) return;

    btn.style.zIndex = "2147483647";
    btn.style.position = "relative";
    btn.style.boxShadow = "0 0 20px red";
    btn.style.outline = "3px solid yellow";
}

     function findContinueButton(){

    const buttons = document.querySelectorAll("button,a");

    for(const btn of buttons){

        const text = btn.innerText
        .replace(/\s+/g," ")
        .trim()
        .toUpperCase();

        if(
            text.includes("NHẤN ĐỂ TIẾP TỤC") ||
            text.includes("LẤY MÃ") ||
            text.includes("LINK GỐC") ||
            text.includes("GET LINK")
        ){
            return btn;
        }

    }

    return null;
}
    function startScript(redirectMap) {

        const url = new URL(location.href);
        const currentHost = location.hostname;

        let taskStarted = false;
        let completed = false;

        if (currentHost.includes("huongdangetlink.com")) {
            setTimeout(() => {
                if (!taskStarted) {
                    location.replace(HOME_URL);
                }
            }, 5000);
        }

        const pathMatch = url.pathname.match(/^\/([^\/]+)(\/|$)/);
        if (pathMatch) {
            const key = pathMatch[1];
            if (redirectMap[key]) {

                const target = redirectMap[key];

                setTimeout(() => {
                    location.href = `https://www.google.com/?rd=${target}`;
                }, 300);

                return;
            }
        }

        const isInRedirectMap = Object.values(redirectMap)
            .some(domain => currentHost.includes(domain));

        if (!isInRedirectMap) return;
// ================= AUTO SCROLL FIND BUTTON =================
let autoScrollInterval = null;

function startAutoScroll() {

    if (autoScrollInterval) return;

    autoScrollInterval = setInterval(() => {

        const btn = findContinueButton();

        // Nếu đã thấy nút -> dừng scroll
        if (btn) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;

            btn.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            return;
        }

        // Scroll xuống từ từ
        window.scrollBy({
            top: 400,
            behavior: "smooth"
        });

    }, 700);
}

        
        // ================= BUTTON LOGIC (GIỮ NGUYÊN) =================
startAutoScroll();
       
        function checkButton() {

              const btn = findContinueButton();
    if (!btn) return;

            const text = btn.textContent
                .replace(/\s+/g, " ")
                .trim()
                .toUpperCase();

            if (text.includes("NHẤN LINK BẤT KỲ")) {
                setTimeout(() => location.reload(), 1000);
                return;
            }

            if (text.includes("LẤY MÃ")) {
                taskStarted = true;
                realClick(btn);
                return;
            }

            if (text.includes("NHẤN ĐỂ TIẾP TỤC")) {
                taskStarted = true;

                const span = btn.querySelector(".countdown");
                if (span) {
                    realClick(span);
                    return;
                }

                realClick(btn);
            }
        }

        // ===== GIỮ NGUYÊN TIMEOUT CŨ =====
        setTimeout(checkButton, 500);
        setTimeout(checkButton, 1000);
        setTimeout(checkButton, 1500);
        setTimeout(checkButton, 2000);
        setTimeout(checkButton, 2500);
        setTimeout(checkButton, 3000);
        setTimeout(checkButton, 3500);
        setTimeout(checkButton, 4000);
        setTimeout(checkButton, 4500);
        setTimeout(checkButton, 5000);

        // ===== THÊM CƠ CHẾ CHỜ BUTTON (KHÔNG ĐỔI LOGIC) =====
        let waitCount = 0;
        const waitForButton = setInterval(() => {

            const btn = document.querySelector("#countdownBtn");

            if (btn) {
                clearInterval(waitForButton);
                checkButton();
            }

            waitCount++;
            if (waitCount > 30) {
                clearInterval(waitForButton);
            }

        }, 500);

        const observer = new MutationObserver(() => {
            checkButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        setTimeout(() => {
            if (!taskStarted && !completed) {
                location.replace(HOME_URL);
            }
        }, 15000);
    }


    // ================= GOOGLE 404 AUTO RETURN =================
function handleGoogle404() {

    const text = document.body ? document.body.innerText : "";

    if (text.includes("That’s an error")) {

        console.log("🚫 Phát hiện Google 404 -> quay về trang chủ");

        setTimeout(() => {
            location.replace(HOME_URL);
        }, 1000);

        return true;
    }

    return false;
}

// Chạy kiểm tra nhiều lần để chắc chắn
setTimeout(handleGoogle404, 500);
setTimeout(handleGoogle404, 1500);
setTimeout(handleGoogle404, 3000);
// ===== KEEP TAB ACTIVE =====
setInterval(() => {
    document.dispatchEvent(new MouseEvent("mousemove", { bubbles: true }));
}, 5000);
    // ================= LOAD CONFIG =================
// ===== FORCE CHECK BUTTON CONTINUOUSLY =====
setInterval(() => {

    const btn = findContinueButton();

    if(btn){

        console.log("✅ Tìm thấy:", btn.innerText);

        btn.scrollIntoView({behavior:"smooth",block:"center"});

        btn.dispatchEvent(new MouseEvent("mouseover",{bubbles:true}));
        btn.dispatchEvent(new MouseEvent("mousedown",{bubbles:true}));
        btn.dispatchEvent(new MouseEvent("mouseup",{bubbles:true}));
        btn.dispatchEvent(new MouseEvent("click",{bubbles:true}));

    }

},800);
    GM_xmlhttpRequest({
        method: "GET",
        url: CONFIG_URL + "?t=" + Date.now(),
        onload: function (res) {
            try {
                const config = JSON.parse(res.responseText);
                if (!config.enabled) return;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: REDIRECT_MAP_URL + "?t=" + Date.now(),
                    onload: function (mapRes) {
                        try {
                            const map = JSON.parse(mapRes.responseText);
                            startScript(map.redirects);
                        } catch (e) {
                            console.error("Lỗi parse redirect map:", e);
                        }
                    }
                });

            } catch (e) {
                console.error("Lỗi parse config:", e);
            }
        }
    });

})();
