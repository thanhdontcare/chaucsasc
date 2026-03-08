
(function() {
    'use strict';
Object.defineProperty(document, 'hidden', {value: false});
    // ==================== KHÓA LƯU TRỮ ====================
    const STORAGE_KEYS = {
        SELECTED_TASK: 'uptolink_selected_task',  // Lưu task đang chọn
        TASK3_CLICKED: 'uptolink_task3_clicked',   // Đếm số lần click task 3
        TASK3_COMPLETED: 'uptolink_task3_completed', // Trạng thái hoàn thành
        LAST_UPDATE: 'uptolink_last_update'         // Thời gian cập nhật cuối
    };

    // ==================== KIỂM TRA URL ====================
    const isTasksPage = window.location.href === 'https://maxtask.net/home/tasks' ||
                        window.location.href.includes('/home/tasks');

    if (isTasksPage) {
        console.log('✅ Đang ở trang tasks, khởi động auto click tasks');
        initTasksAutoClick();
    } else {
        if (document.body.innerText.includes("Go without Earn because no cookie.")) {
            console.log("⚠️ Phát hiện Captcha, đang đóng tab...");
            window.close();
            return;
        }
        console.log('🔄 Đang ở trang Uptolink, khởi động auto complete...');
        initUptolinkAutoComplete();
    }

    // ==================== PHẦN TASKS AUTO CLICK ====================
    function initTasksAutoClick() {
        // CẤU HÌNH
        const CONFIG = {
            CHECK_INTERVAL: 10000,
            CLICK_DELAY: 1500,
            MIN_CLICK_INTERVAL: 15000,
            MAX_CLICKS_PER_HOUR: 240,
            RETRY_COUNT: 3
        };

        // DANH SÁCH TASK
        const TASKS = {
            UPTOLINK_2: {
                name: 'Uptolink 2 Step',
                color: 'blue',
                selector: 'h3:contains("Uptolink 2 Step")',
                icon: 'U',
                price: '360',
                exp: '10',
                key: 'uptolink2'
            },
            UPTOLINK_3: {
                name: 'Uptolink 3step',
                color: 'emerald',
                selector: 'h3:contains("Uptolink 3step")',
                icon: 'U',
                price: '410',
                exp: '10',
                key: 'uptolink3'
            }
        };
// ==================== AUTO RELOAD KHI KHÔNG CÓ TASK ====================
let lastTaskDetectedTime = Date.now();
let reloadWatcher = null;

function detectAnyTask() {
    const tasks = document.querySelectorAll('.rounded-lg.border button:not([disabled])');
    return tasks.length > 0;
}

function startReloadWatcher() {
    if (reloadWatcher) clearInterval(reloadWatcher);

    reloadWatcher = setInterval(() => {

        if (!autoClickEnabled) return; // nếu bấm TẮT thì dừng reload

        if (detectAnyTask()) {
            lastTaskDetectedTime = Date.now();
        }

        const now = Date.now();
        const diff = now - lastTaskDetectedTime;

        if (diff > 15000) {
            console.log("⚠️ 15s không có task -> reload sâu trang");

            notify("🔄 Không có task 15s → Reload", "warning");

            setTimeout(() => {
             window.location.href = window.location.href;
            }, 1000);
        }

    }, 3000);
}
        // ==================== QUẢN LÝ STATE ====================
        // Đọc tất cả dữ liệu từ localStorage khi khởi động
        function loadSavedState() {
            try {
                // Đọc task đã chọn
                const savedTask = localStorage.getItem(STORAGE_KEYS.SELECTED_TASK);
                const savedTask3Clicked = localStorage.getItem(STORAGE_KEYS.TASK3_CLICKED);
                const savedTask3Completed = localStorage.getItem(STORAGE_KEYS.TASK3_COMPLETED);

                console.log('📂 Đọc dữ liệu từ localStorage:');
                console.log('- Task đã chọn:', savedTask);
                console.log('- Task 3 đã click:', savedTask3Clicked);
                console.log('- Task 3 hoàn thành:', savedTask3Completed);

                return {
                    selectedTask: savedTask || 'uptolink2', // Mặc định là task 2 nếu chưa có
                    task3Clicked: savedTask3Clicked ? parseInt(savedTask3Clicked) : 0,
                    task3Completed: savedTask3Completed === 'true'
                };
            } catch (e) {
                console.log('Lỗi đọc localStorage:', e);
                return {
                    selectedTask: 'uptolink2',
                    task3Clicked: 0,
                    task3Completed: false
                };
            }
        }

        // Lưu task được chọn
        function saveSelectedTask(task) {
            try {
                localStorage.setItem(STORAGE_KEYS.SELECTED_TASK, task);
                localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());
                console.log('💾 Đã lưu task được chọn:', task);
            } catch (e) {
                console.log('Lỗi lưu task:', e);
            }
        }

        // Tăng số lần click task 3
        function incrementTask3Clicked() {
            try {
                const current = parseInt(localStorage.getItem(STORAGE_KEYS.TASK3_CLICKED) || '0');
                const newValue = current + 1;
                localStorage.setItem(STORAGE_KEYS.TASK3_CLICKED, newValue.toString());
                console.log(`📈 Task 3 đã click: ${newValue} lần`);
                return newValue;
            } catch (e) {
                console.log('Lỗi tăng click count:', e);
                return 0;
            }
        }

        // Đánh dấu task 3 đã hoàn thành
        function markTask3Completed() {
            try {
                localStorage.setItem(STORAGE_KEYS.TASK3_COMPLETED, 'true');
                console.log('✅ Đã đánh dấu task 3 hoàn thành');
            } catch (e) {
                console.log('Lỗi đánh dấu hoàn thành:', e);
            }
        }

        // Load state ban đầu
        const savedState = loadSavedState();

        // Biến trạng thái
        let autoClickEnabled = true;
        let clickCount = {
            uptolink2: 0,
            uptolink3: savedState.task3Clicked // Khôi phục số lần click task 3
        };
        let failCount = { uptolink2: 0, uptolink3: 0 };
        let lastClickTime = 0;
        let hourlyClicks = [];
        let isTabFocused = !document.hidden;
        let selectedTask = savedState.selectedTask; // Khôi phục task đã chọn
        let autoSwitchEnabled = false;
        let task3Completed = savedState.task3Completed; // Khôi phục trạng thái hoàn thành

        console.log('🚀 Khởi động với task được chọn:', selectedTask);
        console.log('📊 Task 3 đã click:', clickCount.uptolink3, 'lần');
        console.log('🏁 Task 3 hoàn thành:', task3Completed);

        // Style cho UI
        const style = document.createElement('style');
        style.textContent = `
            .auto-click-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 99999;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 16px;
                padding: 18px;
                color: white;
                box-shadow: 0 15px 35px rgba(0,0,0,0.5);
                font-family: 'Segoe UI', sans-serif;
                width: 320px;
                border: 1px solid rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
            }
            .task-selector {
                background: rgba(255,255,255,0.05);
                border-radius: 12px;
                padding: 12px;
                margin-bottom: 15px;
            }
            .selector-title {
                font-size: 11px;
                opacity: 0.7;
                margin-bottom: 8px;
                text-transform: uppercase;
            }
            .task-buttons {
                display: flex;
                gap: 8px;
                margin-bottom: 8px;
            }
            .task-btn {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s;
                color: white;
                position: relative;
                overflow: hidden;
            }
            .task-btn.uptolink2 {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            }
            .task-btn.uptolink3 {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            }
            .task-btn.active {
                transform: scale(1.02);
                box-shadow: 0 0 20px currentColor;
            }
            .task-btn.active::after {
                content: '✓';
                position: absolute;
                top: 2px;
                right: 5px;
                font-size: 14px;
            }
            .task-btn.completed {
                position: relative;
                background: linear-gradient(135deg, #10b981 0%, #047857 100%);
            }
            .task-btn.completed::before {
                content: '✅';
                position: absolute;
                top: -5px;
                left: -5px;
                font-size: 16px;
                background: white;
                border-radius: 50%;
                padding: 2px;
                z-index: 1;
            }
            .task-btn.completed::after {
                content: 'Hoàn thành hôm nay';
                position: absolute;
                bottom: -20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 9px;
                background: rgba(0,0,0,0.8);
                padding: 2px 6px;
                border-radius: 10px;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
            }
            .task-btn.completed:hover::after {
                opacity: 1;
            }
            .task-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .task-preview {
                background: rgba(255,255,255,0.03);
                border-radius: 8px;
                padding: 10px;
                margin-top: 10px;
                font-size: 11px;
                border-left: 3px solid;
            }
            .task-preview.uptolink2 { border-left-color: #3b82f6; }
            .task-preview.uptolink3 { border-left-color: #10b981; }
            .preview-row {
                display: flex;
                justify-content: space-between;
                margin: 3px 0;
            }
            .switch-control {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 10px 0;
                padding: 8px;
                background: rgba(255,255,255,0.03);
                border-radius: 8px;
            }
            .switch-label {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 12px;
            }
            .toggle-switch {
                width: 40px;
                height: 20px;
                background: rgba(255,255,255,0.2);
                border-radius: 20px;
                position: relative;
                cursor: pointer;
                transition: all 0.3s;
            }
            .toggle-switch.active {
                background: linear-gradient(135deg, #3b82f6, #10b981);
            }
            .toggle-slider {
                width: 16px;
                height: 16px;
                background: white;
                border-radius: 50%;
                position: absolute;
                top: 2px;
                left: 2px;
                transition: all 0.3s;
            }
            .toggle-switch.active .toggle-slider {
                left: 22px;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin: 15px 0;
            }
            .stat-card {
                background: rgba(255,255,255,0.05);
                border-radius: 10px;
                padding: 10px;
            }
            .stat-title {
                font-size: 10px;
                opacity: 0.7;
                margin-bottom: 5px;
                display: flex;
                justify-content: space-between;
            }
            .stat-numbers {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .stat-number {
                font-size: 18px;
                font-weight: bold;
            }
            .uptolink2-color { color: #3b82f6; }
            .uptolink3-color { color: #10b981; }
            .badge {
                font-size: 8px;
                background: rgba(255,255,255,0.2);
                padding: 2px 4px;
                border-radius: 4px;
            }
            .timer-card {
                background: linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(16,185,129,0.1) 100%);
                border-radius: 12px;
                padding: 15px;
                margin: 15px 0;
                text-align: center;
            }
            .timer-display {
                font-size: 28px;
                font-weight: bold;
                font-family: monospace;
                color: #ffd93d;
            }
            .progress-bar-container {
                height: 6px;
                background: rgba(255,255,255,0.1);
                border-radius: 3px;
                margin: 15px 0;
                overflow: hidden;
            }
            .progress-bar-fill {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #3b82f6, #10b981);
                transition: width 1s linear;
            }
            .control-buttons {
                display: flex;
                gap: 8px;
                margin: 15px 0;
            }
            .control-btn {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.3s;
                color: white;
            }
            .btn-start { background: linear-gradient(135deg, #00b09b, #96c93d); }
            .btn-stop { background: linear-gradient(135deg, #ff6b6b, #ee5a5a); }
            .btn-reset { background: linear-gradient(135deg, #4facfe, #00f2fe); }
            .tab-status {
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                padding: 10px;
                margin: 10px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .status-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                transition: all 0.3s;
            }
            .status-dot.focused { background: #00ff88; box-shadow: 0 0 10px #00ff88; }
            .status-dot.not-focused { background: #ff4444; box-shadow: 0 0 10px #ff4444; }
            .toast-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 10px;
                color: white;
                font-size: 13px;
                z-index: 100000;
                animation: slideIn 0.3s;
            }
            .toast-notification.success { background: linear-gradient(135deg, #00b09b, #96c93d); }
            .toast-notification.error { background: linear-gradient(135deg, #ff6b6b, #ee5a5a); }
            .toast-notification.warning { background: linear-gradient(135deg, #ffaa00, #ff6b6b); }
            .toast-notification.info { background: linear-gradient(135deg, #4facfe, #00f2fe); }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0%); opacity: 1; }
            }
            .click-animation {
                animation: flash 1s;
            }
            @keyframes flash {
                0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.7); }
                50% { box-shadow: 0 0 0 15px rgba(59,130,246,0); }
                100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
            }
            .storage-info {
                font-size: 9px;
                opacity: 0.5;
                margin-top: 10px;
                text-align: center;
                border-top: 1px solid rgba(255,255,255,0.1);
                padding-top: 8px;
            }
        `;
        document.head.appendChild(style);

        function notify(message, type = 'info', duration = 3000) {
            const toast = document.createElement('div');
            toast.className = `toast-notification ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.remove();
            }, duration);
        }

      function checkTabFocus() {
    isTabFocused = true;
    updateUI();
    return true;
}

        function findTask(taskName) {
            const tasks = document.querySelectorAll('.rounded-lg.border');
            for (let task of tasks) {
                const title = task.querySelector('h3');
                if (title && title.textContent.includes(taskName)) {
                    const button = task.querySelector('button');
                    if (button && !button.disabled) {
                        return { task, button };
                    }
                }
            }
            return null;
        }

        function canClick() {
             if (!autoClickEnabled) return false;
            const now = Date.now();
            if (now - lastClickTime < CONFIG.MIN_CLICK_INTERVAL) return false;
            const oneHourAgo = now - 60 * 60 * 1000;
            hourlyClicks = hourlyClicks.filter(time => time > oneHourAgo);
            if (hourlyClicks.length >= CONFIG.MAX_CLICKS_PER_HOUR) {
                notify(`⏰ Đã đạt giới hạn ${CONFIG.MAX_CLICKS_PER_HOUR} lần/giờ`, 'warning');
                return false;
            }
            return true;
        }

        async function performClick() {
            if (!canClick()) {
                updateTimer();
                return;
            }

            let taskToClick = null;
            let taskType = null;

            if (autoSwitchEnabled) {
                taskToClick = findTask(TASKS.UPTOLINK_2.name) || findTask(TASKS.UPTOLINK_3.name);
                taskType = taskToClick ? (taskToClick.task.querySelector('h3').textContent.includes('2 Step') ? 'uptolink2' : 'uptolink3') : null;
            } else {
                const taskName = selectedTask === 'uptolink2' ? TASKS.UPTOLINK_2.name : TASKS.UPTOLINK_3.name;
                taskToClick = findTask(taskName);
                taskType = selectedTask;
            }

            if (taskToClick) {
                const { task, button } = taskToClick;
                task.classList.add('click-animation');
                task.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setTimeout(() => {
                    if (canClick()) {
                        button.click();

                        if (taskType === 'uptolink2') {
                            clickCount.uptolink2++;
                        } else {
                            clickCount.uptolink3++;
                            // QUAN TRỌNG: Tăng số lần click và lưu vào localStorage
                            incrementTask3Clicked();

                            // Không tự động đánh dấu hoàn thành ở đây
                            // Chờ xác nhận từ trang Uptolink

                            notify(`🔔 Task 3 đã được click lần thứ ${clickCount.uptolink3}`, 'info');
                        }

                        lastClickTime = Date.now();
                        hourlyClicks.push(Date.now());
                        const taskNameDisplay = taskType === 'uptolink2' ? 'Uptolink 2' : 'Uptolink 3';
                        notify(`✅ Đã click ${taskNameDisplay}`, 'success');
                        updateUI();

                        setTimeout(() => {
                            task.classList.remove('click-animation');
                        }, 1000);
                    }
                }, CONFIG.CLICK_DELAY);
            } else {
                if (selectedTask === 'uptolink2') {
                    failCount.uptolink2++;
                } else {
                    failCount.uptolink3++;
                }
                updateUI();
                if (failCount.uptolink2 + failCount.uptolink3 === 1) {
                    notify('🔍 Đang tìm task...', 'info');
                }
            }
        }

        function updateTimer() {
            const now = Date.now();
            const timeSinceLastClick = now - lastClickTime;
            const timeUntilNext = Math.max(0, CONFIG.MIN_CLICK_INTERVAL - timeSinceLastClick);
            const timerEl = document.getElementById('timerDisplay');
            const progressEl = document.getElementById('progressFill');
            if (timerEl) {
                const seconds = Math.ceil(timeUntilNext / 1000);
                timerEl.textContent = `${seconds}s`;
            }
            if (progressEl) {
                const progress = (timeSinceLastClick / CONFIG.MIN_CLICK_INTERVAL) * 100;
                progressEl.style.width = `${Math.min(100, progress)}%`;
            }
        }

        function createUI() {
            startReloadWatcher();
            const panel = document.createElement('div');
            panel.className = 'auto-click-panel';
            panel.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:15px;">
                    <span style="font-size:24px;">🔄</span>
                    <div>
                        <h3 style="margin:0; font-size:15px;">Uptolink Auto Click</h3>
                        <p style="margin:2px 0 0; opacity:0.6; font-size:10px;">Tự động lưu trạng thái</p>
                    </div>
                </div>
                <div class="tab-status">
                    <div class="status-dot focused" id="statusDot"></div>
                    <span id="tabText" style="font-size:12px;">Tab đang focus</span>
                </div>
                <div class="task-selector">
                    <div class="selector-title">🎯 CHỌN TASK (Tự động lưu)</div>
                    <div class="task-buttons">
                        <button class="task-btn uptolink2 ${selectedTask === 'uptolink2' ? 'active' : ''}" id="btnUptolink2">Uptolink 2 Step</button>
                        <button class="task-btn uptolink3 ${task3Completed ? 'completed' : ''} ${selectedTask === 'uptolink3' ? 'active' : ''}" id="btnUptolink3">Uptolink 3 Step</button>
                    </div>
                    <div class="task-preview ${selectedTask === 'uptolink2' ? 'uptolink2' : 'uptolink3'}" id="taskPreview">
                        <div class="preview-row">
                            <span>💰 Giá:</span>
                            <span style="font-weight:bold;">${selectedTask === 'uptolink2' ? '360' : '410'} VNĐ</span>
                        </div>
                        <div class="preview-row">
                            <span>⭐ Kinh nghiệm:</span>
                            <span>10 Exp</span>
                        </div>
                    </div>
                </div>
                <div class="switch-control">
                    <div class="switch-label">
                        <span>🔄</span>
                        <span>Tự động chuyển đổi</span>
                    </div>
                    <div class="toggle-switch" id="toggleSwitch">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-title">
                            Uptolink 2 Step
                            <span class="badge">hôm nay</span>
                        </div>
                        <div class="stat-numbers">
                            <span class="stat-number uptolink2-color" id="count2">0</span>
                            <span style="font-size:11px; opacity:0.7;">thất bại: <span id="fail2">0</span></span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">
                            Uptolink 3 Step
                            <span class="badge" id="task3Badge">${clickCount.uptolink3} lần</span>
                        </div>
                        <div class="stat-numbers">
                            <span class="stat-number uptolink3-color" id="count3">${clickCount.uptolink3}</span>
                            <span style="font-size:11px; opacity:0.7;">thất bại: <span id="fail3">0</span></span>
                        </div>
                    </div>
                </div>
                <div class="timer-card">
                    <div class="timer-display" id="timerDisplay">0s</div>
                    <div style="font-size:10px; opacity:0.7; margin-top:5px;">Đến lần click tiếp theo</div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" id="progressFill"></div>
                </div>
                <div style="display:flex; justify-content:space-between; margin:10px 0; font-size:11px;">
                    <span>⏱️ Mỗi lần: ${CONFIG.MIN_CLICK_INTERVAL/1000}s</span>
                    <span>📊 Tổng: <span id="totalClicks">0</span></span>
                </div>
                <div class="control-buttons">
                    <button class="control-btn btn-start" id="startBtn">BẬT</button>
                    <button class="control-btn btn-stop" id="stopBtn">TẮT</button>
                    <button class="control-btn btn-reset" id="resetBtn">RESET</button>
                </div>
                <div class="storage-info">
                    💾 Đã lưu: Task ${selectedTask === 'uptolink2' ? '2' : '3'} | Task 3: ${clickCount.uptolink3} lần ${task3Completed ? '✅' : ''}
                </div>
            `;
            document.body.appendChild(panel);

            // Xử lý chọn task 2
            document.getElementById('btnUptolink2').onclick = () => {
                if (!autoSwitchEnabled) {
                    selectedTask = 'uptolink2';

                    // Cập nhật UI
                    document.getElementById('btnUptolink2').classList.add('active');
                    document.getElementById('btnUptolink3').classList.remove('active');
                    document.getElementById('taskPreview').className = 'task-preview uptolink2';

                    // QUAN TRỌNG: Lưu vào localStorage
                    saveSelectedTask('uptolink2');

                    notify('✅ Đã chọn Uptolink 2 Step (đã lưu)', 'success');
                    updateUI();
                }
            };

            // Xử lý chọn task 3
            document.getElementById('btnUptolink3').onclick = () => {
                if (!autoSwitchEnabled) {
                    selectedTask = 'uptolink3';

                    // Cập nhật UI
                    document.getElementById('btnUptolink3').classList.add('active');
                    document.getElementById('btnUptolink2').classList.remove('active');
                    document.getElementById('taskPreview').className = 'task-preview uptolink3';

                    // QUAN TRỌNG: Lưu vào localStorage
                    saveSelectedTask('uptolink3');

                    notify('✅ Đã chọn Uptolink 3 Step (đã lưu)', 'success');
                    updateUI();
                }
            };

            const toggleSwitch = document.getElementById('toggleSwitch');
            toggleSwitch.onclick = () => {
                autoSwitchEnabled = !autoSwitchEnabled;
                toggleSwitch.classList.toggle('active');
                if (autoSwitchEnabled) {
                    document.getElementById('btnUptolink2').disabled = true;
                    document.getElementById('btnUptolink3').disabled = true;
                    notify('🔄 Đã bật tự động chuyển đổi task', 'success');
                } else {
                    document.getElementById('btnUptolink2').disabled = false;
                    document.getElementById('btnUptolink3').disabled = false;
                    notify('⏸️ Đã tắt tự động chuyển đổi', 'warning');
                }
            };

            document.getElementById('startBtn').onclick = () => {
                autoClickEnabled = true;
                notify('▶️ Đã bật auto click', 'success');
            };

            document.getElementById('stopBtn').onclick = () => {
                autoClickEnabled = false;
                notify('⏸️ Đã tắt auto click', 'warning');
            };

            document.getElementById('resetBtn').onclick = () => {
                if (confirm('Bạn có chắc muốn reset tất cả dữ liệu?')) {
                    clickCount = { uptolink2: 0, uptolink3: 0 };
                    failCount = { uptolink2: 0, uptolink3: 0 };
                    hourlyClicks = [];
                    task3Completed = false;

                    // Xóa localStorage
                    localStorage.removeItem(STORAGE_KEYS.SELECTED_TASK);
                    localStorage.removeItem(STORAGE_KEYS.TASK3_CLICKED);
                    localStorage.removeItem(STORAGE_KEYS.TASK3_COMPLETED);

                    // Reset về mặc định
                    selectedTask = 'uptolink2';
                    saveSelectedTask('uptolink2');

                    document.getElementById('btnUptolink3').classList.remove('completed');
                    document.getElementById('btnUptolink2').classList.add('active');
                    document.getElementById('btnUptolink3').classList.remove('active');
                    document.getElementById('taskPreview').className = 'task-preview uptolink2';

                    updateUI();
                    notify('🔄 Đã reset tất cả dữ liệu', 'info');
                }
            };
        }

        function updateUI() {
            document.getElementById('count2').textContent = clickCount.uptolink2;
            document.getElementById('count3').textContent = clickCount.uptolink3;
            document.getElementById('fail2').textContent = failCount.uptolink2;
            document.getElementById('fail3').textContent = failCount.uptolink3;
            document.getElementById('totalClicks').textContent = clickCount.uptolink2 + clickCount.uptolink3;

            const badge = document.getElementById('task3Badge');
            if (badge) {
                badge.textContent = `${clickCount.uptolink3} lần`;
            }

            const statusDot = document.getElementById('statusDot');
            const tabText = document.getElementById('tabText');
            if (isTabFocused) {
                statusDot.className = 'status-dot focused';
                tabText.textContent = '✅ Tab đang focus';
            } else {
                statusDot.className = 'status-dot not-focused';
                tabText.textContent = '❌ Tab không focus - Tạm dừng';
            }

            // Cập nhật storage info
            const storageInfo = document.querySelector('.storage-info');
            if (storageInfo) {
                storageInfo.innerHTML = `💾 Đã lưu: Task ${selectedTask === 'uptolink2' ? '2' : '3'} | Task 3: ${clickCount.uptolink3} lần ${task3Completed ? '✅' : ''}`;
            }
        }

        function setupTabListeners() {
            document.addEventListener('visibilitychange', checkTabFocus);
            window.addEventListener('focus', () => {
                isTabFocused = true;
                updateUI();
            });
            window.addEventListener('blur', () => {
                isTabFocused = false;
                updateUI();
            });
        }

        createUI();
        setupTabListeners();
        setInterval(() => {
            performClick();
            updateTimer();
        }, 1000);

        // Thông báo khởi động
        setTimeout(() => {
            notify(`🚀 Đã sẵn sàng! Đang chọn task ${selectedTask === 'uptolink2' ? '2' : '3'}`, 'success', 4000);
        }, 1500);
    }

    // ==================== PHẦN 2: UPTOLINK AUTO COMPLETE ====================
    function initUptolinkAutoComplete() {
        // ==================== CẤU HÌNH ====================
        const CONFIG = {
            REFRESH_INTERVAL: 5000,
            MAX_REFRESH_TIME: 60000,
            CHECK_INTERVAL: 1000,
            AUTO_CLOSE_DELAY: 3000
        };

        // BIẾN GLOBAL
        const SESSION_KEY = "uptolink_refresh_session";
        const STORAGE_KEYS = {
            SELECTED_TASK: 'uptolink_selected_task',
            TASK3_CLICKED: 'uptolink_task3_clicked',
            TASK3_COMPLETED: 'uptolink_task3_completed'
        };

        let savedSession = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}");
        let currentRefreshCount = savedSession.count || 0;
        let refreshStartTime = savedSession.startTime || null;
        let activeRefreshInterval = null;
        const maxRefreshes = Math.floor(CONFIG.MAX_REFRESH_TIME / CONFIG.REFRESH_INTERVAL);
        let isProcessingError = false;
        let isTaskCompleted = false;

        // Kiểm tra xem đây có phải là task 3 không
        const isTask3 = window.location.href.includes('uptolink') &&
                       document.referrer &&
                       document.referrer.includes('maxtask.net');

        // ==================== HÀM TIỆN ÍCH ====================
        function realClick(element) {
            const event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(event);
        }

        function findMaxtaskButton() {
            const btn = document.querySelector('a.btn.btn-primary[href*="maxtask.net/task/"]');
            if (btn) {
                console.log("✅ Đã tìm thấy nút Maxtask:", btn.href);
                realClick(btn);
                return true;
            }
            return false;
        }

        function findInvisibleButton() {
            const btn = document.getElementById("invisibleCaptchaShortlink");
            if (btn && !btn.hasAttribute("disabled")) {
                console.log("✅ Nút captcha đã mở, tiến hành click...");
                realClick(btn);
                return true;
            }
            return false;
        }

        function removeDisabledAttribute() {
            const btn = document.getElementById("invisibleCaptchaShortlink");
            if (btn && btn.hasAttribute('disabled')) {
                btn.removeAttribute('disabled');
                console.log("✅ Đã bỏ disabled nút captcha");
            }
        }

        // QUAN TRỌNG: Đánh dấu task 3 hoàn thành
        function markTask3AsCompleted() {
            try {
                localStorage.setItem(STORAGE_KEYS.TASK3_COMPLETED, 'true');
                console.log('✅ Đã đánh dấu task 3 hoàn thành trong localStorage');

                // Gửi thông báo đến các tab khác (nếu có)
                localStorage.setItem('uptolink_last_update', Date.now().toString());
            } catch (e) {
                console.log('Lỗi đánh dấu hoàn thành:', e);
            }
        }

        // Hàm kiểm tra hoàn thành nhiệm vụ
        function checkTaskCompletion() {
            const bodyText = document.body.innerText;

            const isSuccess =
                bodyText.includes('Nhiệm vụ đã được xác thực') ||
                bodyText.includes('Phần thưởng đã được cộng') ||
                bodyText.includes('Nhiệm vụ đã được xử lý') ||
                bodyText.includes('Task completed') ||
                bodyText.includes('Success') ||
                bodyText.includes('Xác thực thành công');

            const isFailed =
                bodyText.includes('Nhiệm vụ này đã được xác thực rồi') ||
                bodyText.includes('Already completed');

            if (isSuccess || isFailed) {
                console.log("🎉 Đã hoàn tất xác minh (success hoặc fail)");

                isTaskCompleted = true;

                // QUAN TRỌNG: Nếu là task 3, đánh dấu hoàn thành
                if (isTask3) {
                    console.log("🎯 ĐÂY LÀ TASK 3 - Đánh dấu hoàn thành và lưu vĩnh viễn");
                    markTask3AsCompleted();
                }

                if (activeRefreshInterval) {
                    clearInterval(activeRefreshInterval);
                    activeRefreshInterval = null;
                }

                showNotification("✅ Hoàn tất! Đang quay về trang nhiệm vụ...", "success");

                setTimeout(() => {
                    const backBtn = document.querySelector('a[href="/home/tasks"], a[href*="maxtask.net/home/tasks"]');

                    if (backBtn) {
                        console.log("🔙 Tìm thấy nút quay về, tiến hành click...");
                        backBtn.click();
                    } else {
                        console.log("⚠ Không có nút quay về, chuyển hướng thủ công...");
                        window.location.href = "https://maxtask.net/home/tasks";
                    }
                }, 2000);

                return true;
            }

            return false;
        }

        function showNotification(message, type = 'info', duration = 3000) {
            const notice = document.createElement('div');
            notice.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'error' ? 'linear-gradient(135deg, #ff6b6b, #ee5a5a)' :
                             type === 'success' ? 'linear-gradient(135deg, #00b09b, #96c93d)' :
                             type === 'warning' ? 'linear-gradient(135deg, #ffaa00, #ff6b6b)' :
                             'linear-gradient(135deg, #4facfe, #00f2fe)'};
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 999999;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 5px 25px rgba(0,0,0,0.3);
                animation: slideIn 0.3s;
            `;
            notice.textContent = message;
            document.body.appendChild(notice);
            setTimeout(() => {
                notice.remove();
            }, duration);
        }

        // ==================== XỬ LÝ LỖI ====================
        function checkErrors() {
            const bodyText = document.body.innerText;

            // Kiểm tra CSRF token mismatch
            if (bodyText.includes('CSRF token mismatch')) {
                return {
                    hasError: true,
                    type: 'csrf',
                    text: 'CSRF token mismatch'
                };
            }

            // KIỂM TRA LỖI 404
            if (bodyText.includes('404')) {
                const has111 = bodyText.includes('111');
                const has113 = bodyText.includes('113');

                if (has111 || has113) {
                    return {
                        hasError: true,
                        type: '404-special',
                        text: has111 ? '404 Not Found. 111' : '404 Not Found. 113'
                    };
                } else {
                    return {
                        hasError: true,
                        type: '404-regular',
                        text: '404 Not Found'
                    };
                }
            }

            // Kiểm tra lỗi "không có cookie"
            if (bodyText.includes('không có cookie')) {
                return {
                    hasError: true,
                    type: 'cookie',
                    text: 'không có cookie'
                };
            }

            // Kiểm tra lỗi giới hạn camp
            if (bodyText.includes('Mỗi thiết bị chỉ được phép vượt 1 Camp 1 lần duy nhất trong 24h')) {
                return {
                    hasError: true,
                    type: 'camp_limit',
                    text: 'Đã hết lượt camp 24h'
                };
            }

            return { hasError: false };
        }

        function closeTab(reason) {
            console.log(`🚫 Phát hiện: ${reason}, đóng tab sau 2 giây...`);
            showNotification(`🚫 ${reason}, đóng tab...`, 'error');

            if (activeRefreshInterval) {
                clearInterval(activeRefreshInterval);
                activeRefreshInterval = null;
            }

            setTimeout(() => {
                window.close();
                setTimeout(() => {
                    if (!window.closed) {
                     window.location.href = 'https://maxtask.net/home/tasks';
                    }
                }, 500);
            }, 2000);
        }

        function performRefresh() {
            if (!refreshStartTime) {
                refreshStartTime = Date.now();
            }

            const elapsed = Date.now() - refreshStartTime;

            if (elapsed >= CONFIG.MAX_REFRESH_TIME) {
                console.log("⏰ Hết 1 phút refresh, quay về trang chủ...");
                sessionStorage.removeItem(SESSION_KEY);
                window.location.href = "https://maxtask.net/home/tasks";
                return;
            }

            currentRefreshCount++;

            sessionStorage.setItem(SESSION_KEY, JSON.stringify({
                count: currentRefreshCount,
                startTime: refreshStartTime
            }));

            console.log(`🔄 Refresh lần ${currentRefreshCount}`);

            setTimeout(() => {
                location.reload();
            }, CONFIG.REFRESH_INTERVAL);
        }

        function handleError() {
            // Kiểm tra hoàn thành task trước
            if (checkTaskCompletion()) return;

            // Nếu đã hoàn thành task thì không xử lý lỗi
            if (isTaskCompleted) return;

            // Nếu đang xử lý lỗi rồi thì không xử lý thêm
            if (isProcessingError) return;

            const error = checkErrors();

            if (!error.hasError) return;

            console.log(`⚠️ Phát hiện lỗi: ${error.text} (Loại: ${error.type})`);

            // Xử lý theo từng loại lỗi
            switch(error.type) {
                case '404-special':
                    if (!activeRefreshInterval) {
                        isProcessingError = true;

                        if (!refreshStartTime) {
                            refreshStartTime = Date.now();
                            currentRefreshCount = 0;
                        }

                        console.log('📌 404 đặc biệt - Bắt đầu refresh...');
                        showNotification('⚠️ 404 đặc biệt, đang refresh...', 'warning');

                        performRefresh();

                        activeRefreshInterval = setInterval(() => {
                            if (isTaskCompleted) {
                                clearInterval(activeRefreshInterval);
                                activeRefreshInterval = null;
                                return;
                            }

                            const newError = checkErrors();

                            if (!newError.hasError) {
                                console.log('✅ Hết lỗi');
                                clearInterval(activeRefreshInterval);
                                activeRefreshInterval = null;
                                isProcessingError = false;
                                return;
                            }

                            if (newError.type === '404-special') {
                                performRefresh();
                            } else {
                                clearInterval(activeRefreshInterval);
                                activeRefreshInterval = null;
                                isProcessingError = false;
                                handleError();
                            }
                        }, CONFIG.REFRESH_INTERVAL + 1000);
                    }
                    break;

                case '404-regular':
                    console.log("⚠️ 404 thường - quay về trang chủ...");
                    showNotification("⚠️ 404 thường, quay về trang nhiệm vụ...", "warning");
                    window.location.href = "https://maxtask.net/home/tasks";
                    break;

                case 'csrf':
                case 'cookie':
                    closeTab(error.text);
                    break;

                case 'camp_limit':
                    console.log("⛔ Đã hết lượt camp 24h - quay về trang nhiệm vụ...");
                    showNotification("⛔ Hết lượt camp 24h, quay về tasks...", "warning");

                    if (activeRefreshInterval) {
                        clearInterval(activeRefreshInterval);
                        activeRefreshInterval = null;
                    }

                    sessionStorage.removeItem(SESSION_KEY);

                    setTimeout(() => {
                        window.location.href = "https://maxtask.net/home/tasks";
                    }, 1500);
                    break;

                default:
                    closeTab('Lỗi không xác định');
            }
        }

        // Style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0%); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // ==================== KHỞI ĐỘNG ====================
        console.log("🚀 Uptolink Auto Complete - Bắt đầu tự động hóa");

        const currentUrl = window.location.href;
        console.log("📌 Đang ở trang:", currentUrl);

        // XỬ LÝ TRANG UPTOLINK
        if (currentUrl.includes('uptolink.one/finish/') ||
            currentUrl.includes('uptolink2.com') ||
            currentUrl.includes('uptolink')) {

            console.log("🔄 Đang ở trang Uptolink, bắt đầu xử lý...");

            const interval = setInterval(() => {
                if (findMaxtaskButton()) {
                    clearInterval(interval);
                    return;
                }

                removeDisabledAttribute();

                if (findInvisibleButton()) {
                    clearInterval(interval);
                }
            }, 500);
        }

        // AUTO HOLD VERIFY
        let holdAttempts = 0;
        const MAX_HOLD_ATTEMPTS = 3;

        function simulateHold(element, holdTime = 7000) {
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            const options = {
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                buttons: 1
            };

            console.log("▶ Bắt đầu giữ verify...");

            element.dispatchEvent(new MouseEvent('mousemove', options));
            element.dispatchEvent(new MouseEvent('mouseenter', options));
            element.dispatchEvent(new MouseEvent('mouseover', options));
            element.dispatchEvent(new MouseEvent('mousedown', options));

            setTimeout(() => {
                element.dispatchEvent(new MouseEvent('mouseup', options));
                element.dispatchEvent(new MouseEvent('click', options));
                console.log("✔ Đã thả giữ");
            }, holdTime);
        }

        function autoHoldSystem() {
            const tryHold = () => {
                if (isTaskCompleted) return;

                const canvas = document.querySelector("canvas");

                if (canvas && holdAttempts < MAX_HOLD_ATTEMPTS) {
                    holdAttempts++;
                    console.log("🔁 Giữ ngay lần:", holdAttempts);
                    simulateHold(canvas, 7000);
                }
            };

            tryHold();

            const holdInterval = setInterval(() => {
                if (isTaskCompleted || holdAttempts >= MAX_HOLD_ATTEMPTS) {
                    clearInterval(holdInterval);
                    return;
                }
                tryHold();
            }, 3000);
        }

        setTimeout(() => {
            autoHoldSystem();
        }, 3000);

        // KIỂM TRA LỖI VÀ HOÀN THÀNH ĐỊNH KỲ
        setInterval(handleError, CONFIG.CHECK_INTERVAL);

        // KIỂM TRA KHI TRANG LOAD
        setTimeout(handleError, 2000);
    }
})();
