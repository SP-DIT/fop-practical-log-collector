const tbody = document.getElementById('attendance-body');
const template = document.getElementById('attendance-row-template');
const refreshStatus = document.getElementById('refresh-status');
const countdown = document.getElementById('countdown');
const pauseRefreshBtn = document.getElementById('pause-refresh-btn');

let refreshTimer;
let countdownTimer;
let countdownSeconds = 5;
let studentData = {};
let examVenueData = {};
let previousAttendanceData = []; // Track previous data to identify new rows
let isRefreshPaused = false; // Track pause state

async function fetchAttempts(isAutoRefresh = false) {
    try {
        // Show refreshing status
        if (isAutoRefresh) {
            refreshStatus.textContent = 'Refreshing...';
            refreshStatus.className = 'refresh-status refreshing';
        }

        const response = await fetch('./attempts/');
        const attendanceData = await response.json();

        // Identify new rows by comparing with previous data
        const newRowIds = new Set();
        if (isAutoRefresh && previousAttendanceData.length > 0) {
            const previousIds = new Set(previousAttendanceData.map((item) => item.id));
            attendanceData.forEach((item) => {
                if (!previousIds.has(item.id)) {
                    newRowIds.add(item.id);
                }
            });
        }

        // Store current data for next comparison
        previousAttendanceData = [...attendanceData];

        // Clear existing table data only after successful fetch
        tbody.innerHTML = '';

        attendanceData.forEach((item) => {
            const clone = template.content.cloneNode(true);
            const row = clone.querySelector('tr');

            // Mark new rows with special styling
            if (newRowIds.has(item.id)) {
                row.classList.add('new-row');
                // Remove the new-row class after animation completes
                setTimeout(() => {
                    row.classList.remove('new-row');
                }, 3000);
            }

            clone.querySelector('.time').textContent = new Date(item.time).toLocaleString();
            clone.querySelector('.student-id').textContent = item.student_id;
            
            // Make student name clickable
            const nameCell = clone.querySelector('.name');
            const studentLink = nameCell.querySelector('.student-link');
            const studentName = studentData[item.student_id.toUpperCase()] || 'Unknown';
            studentLink.href = `student.html?studentId=${item.student_id}`;
            studentLink.textContent = studentName;
            
            clone.querySelector('.class').textContent = item.class;
            clone.querySelector('.exam-venue').textContent = examVenueData[item.class.toUpperCase()] || '???';
            const checkedCell = clone.querySelector('.checked-cell');
            if (item.checked) {
                checkedCell.textContent = new Date(item.checked).toLocaleString();
            } else {
                const btn = document.createElement('button');
                btn.textContent = 'Check';
                btn.addEventListener('click', function () {
                    checkAttendance(btn, item.id);
                });
                checkedCell.appendChild(btn);
            }

            const markAsDoneCell = clone.querySelector('.mark-as-done');
            const doneBtn = markAsDoneCell.querySelector('.done');
            doneBtn.addEventListener('click', () => {
                markAsDone(item.student_id);
            });

            tbody.appendChild(clone);
        });

        // Clear refreshing status and show last updated time
        const now = new Date().toLocaleTimeString();
        refreshStatus.textContent = `Last updated: ${now}`;
        refreshStatus.className = 'refresh-status success';

        // Show notification if new rows were added
        if (newRowIds.size > 0) {
            refreshStatus.textContent = `Last updated: ${now} (${newRowIds.size} new)`;
        }
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="6">Failed to load data</td></tr>`;
        refreshStatus.textContent = 'Error loading data';
        refreshStatus.className = 'refresh-status error';
    }
}

async function markAsDone(studentId) {
    try {
        const response = await fetch(`/attempts/students/${studentId}/done`, {
            method: 'POST',
        });
        if (response.ok) {
            alert(`${studentData[studentId.toUpperCase()]} (${studentId}) marked as done`);
            await fetchAttempts();
        }
    } catch (err) {
        console.error(err);
    }
}

async function checkAttendance(btn, id) {
    try {
        btn.disabled = true;
        btn.textContent = 'loading...';
        const response = await fetch(`/attempts/${id}/check`, {
            method: 'PUT',
        });
        if (response.ok) {
            const data = await response.json();
            btn.parentElement.textContent = new Date(data.checked).toLocaleString();
            // Restart the auto-refresh cycle to get updated data (only if not paused)
            if (!isRefreshPaused) {
                startAutoRefresh();
            }
        } else {
            btn.disabled = false;
            btn.textContent = 'Check';
            alert('Failed to check attendance.');
        }
    } catch (err) {
        alert('Error checking attendance.');
        btn.disabled = false;
        btn.textContent = 'Check';
    }
}

// Initialize pause/resume functionality
function initializePauseFeature() {
    pauseRefreshBtn.addEventListener('click', toggleAutoRefresh);
}

// Toggle between pause and resume
function toggleAutoRefresh() {
    if (isRefreshPaused) {
        resumeAutoRefresh();
    } else {
        pauseAutoRefresh();
    }
}

// Pause auto refresh
function pauseAutoRefresh() {
    isRefreshPaused = true;

    // Clear existing timers
    if (refreshTimer) clearTimeout(refreshTimer);
    if (countdownTimer) clearInterval(countdownTimer);

    // Update UI
    pauseRefreshBtn.textContent = '▶️ Resume';
    pauseRefreshBtn.className = 'refresh-control-btn paused';
    countdown.textContent = 'Auto-refresh paused';
    countdown.style.color = '#ffc107';

    // Update status
    if (refreshStatus.className.includes('refreshing')) {
        refreshStatus.textContent = 'Paused during refresh';
        refreshStatus.className = 'refresh-status';
        refreshStatus.style.color = '#ffc107';
    }
}

// Resume auto refresh
function resumeAutoRefresh() {
    isRefreshPaused = false;

    // Update UI
    pauseRefreshBtn.textContent = '⏸️ Pause';
    pauseRefreshBtn.className = 'refresh-control-btn';
    countdown.style.color = '#007bff';

    // Restart auto refresh
    startAutoRefresh();
}

function updateCountdown() {
    if (countdownSeconds > 0) {
        countdown.textContent = `Next refresh in: ${countdownSeconds}s`;
        countdownSeconds--;
    } else {
        countdown.textContent = 'Refreshing now...';
    }
}

function startCountdown() {
    countdownSeconds = 5;
    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);
}

function startAutoRefresh() {
    // Don't start if paused
    if (isRefreshPaused) {
        return;
    }

    // Clear existing timers
    if (refreshTimer) clearTimeout(refreshTimer);
    if (countdownTimer) clearInterval(countdownTimer);

    // Start countdown
    startCountdown();

    // Set up auto refresh
    refreshTimer = setTimeout(() => {
        // Check again if still not paused before refreshing
        if (!isRefreshPaused) {
            fetchAttempts(true).then(() => {
                startAutoRefresh(); // Continue the cycle
            });
        }
    }, 5000);
}

// Fetch student.json first, then fetch attendance and start auto refresh using async/await
(async () => {
    try {
        const res = await Promise.all([fetch('./students.json'), fetch('./examVenue.json')]);
        studentData = await res[0].json();
        examVenueData = await res[1].json();

        // Initialize pause feature
        initializePauseFeature();

        await fetchAttempts();
        startAutoRefresh();
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="7">Failed to load data</td></tr>`;
        refreshStatus.textContent = 'Error loading data';
        refreshStatus.className = 'refresh-status error';
    }
})();
