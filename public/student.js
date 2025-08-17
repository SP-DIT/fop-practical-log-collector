// Student page JavaScript
const studentTitle = document.getElementById('student-title');
const studentInfo = document.getElementById('student-info');
const studentAttemptsBody = document.getElementById('student-attempts-body');
const studentAttemptTemplate = document.getElementById('student-attempt-row-template');
const studentRefreshStatus = document.getElementById('student-refresh-status');
const studentCountdown = document.getElementById('student-countdown');
const studentPauseRefreshBtn = document.getElementById('student-pause-refresh-btn');

let studentRefreshTimer;
let studentCountdownTimer;
let studentCountdownSeconds = 5;
let studentData = {};
let examVenueData = {};
let previousStudentAttempts = [];
let isStudentRefreshPaused = false;
let currentStudentId = null;

// Get student ID from URL parameters
function getStudentIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('studentId');
}

// Initialize student page
async function initializeStudentPage() {
    currentStudentId = getStudentIdFromUrl();

    if (!currentStudentId) {
        showError('No student ID provided in URL');
        return;
    }

    try {
        // Load student and exam venue data
        const res = await Promise.all([
            fetch('./students.json'),
            fetch('./examVenue.json')
        ]);
        studentData = await res[0].json();
        examVenueData = await res[1].json();

        // Initialize pause feature
        initializeStudentPauseFeature();

        // Load student data
        await fetchStudentData();

        // Start auto refresh
        startStudentAutoRefresh();

    } catch (error) {
        console.error('Error initializing student page:', error);
        showError('Failed to load student data');
    }
}

// Fetch student data and attempts
async function fetchStudentData(isAutoRefresh = false) {
    try {
        // Show refreshing status
        if (isAutoRefresh) {
            studentRefreshStatus.textContent = 'Refreshing...';
            studentRefreshStatus.className = 'refresh-status refreshing';
        }

        // Fetch student attempts from the API
        const response = await fetch(`./attempts/students/${currentStudentId}`);

        if (!response.ok) {
            if (response.status === 404) {
                showError(`No records found for student ${currentStudentId}`);
                return;
            }
            throw new Error(`HTTP ${response.status}`);
        }

        const studentAttempts = await response.json();

        // Update student info
        updateStudentInfo(studentAttempts);

        // Update attempts table
        updateAttemptsTable(studentAttempts, isAutoRefresh);

        // Update status
        const now = new Date().toLocaleTimeString();
        studentRefreshStatus.textContent = `Last updated: ${now}`;
        studentRefreshStatus.className = 'refresh-status success';

    } catch (error) {
        console.error('Error fetching student data:', error);
        showError('Failed to load student data');
        studentRefreshStatus.textContent = 'Error loading data';
        studentRefreshStatus.className = 'refresh-status error';
    }
}

// Update student information card
function updateStudentInfo(studentAttempts) {
    const studentName = studentData[currentStudentId.toUpperCase()] || 'Unknown Student';
    studentTitle.textContent = `${studentName} (${currentStudentId})`;
    
    // Update browser tab title
    document.title = `${studentName} (${currentStudentId}) - Student Details`;

    const totalAttempts = studentAttempts.length;
    const checkedAttempts = studentAttempts.filter(attempt => attempt.checked).length;

    studentInfo.innerHTML = `
        <div class="student-info">
            <div class="info-item">
                <span class="info-label">Student ID</span>
                <span class="info-value">${currentStudentId}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Name</span>
                <span class="info-value">${studentName}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Total Attempts</span>
                <span class="info-value">${totalAttempts}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Checked Attempts</span>
                <span class="info-value">${checkedAttempts}</span>
            </div>
        </div>
    `;
}

// Update attempts table
function updateAttemptsTable(attempts, isAutoRefresh = false) {
    // Identify new attempts
    const newAttemptIds = new Set();
    if (isAutoRefresh && previousStudentAttempts.length > 0) {
        const previousIds = new Set(previousStudentAttempts.map(attempt => attempt.id));
        attempts.forEach(attempt => {
            if (!previousIds.has(attempt.id)) {
                newAttemptIds.add(attempt.id);
            }
        });
    }

    // Store current attempts for next comparison
    previousStudentAttempts = [...attempts];

    // Clear existing table data
    studentAttemptsBody.innerHTML = '';

    if (attempts.length === 0) {
        studentAttemptsBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <h4>No attempts found</h4>
                    <p>This student has not made any attempts yet.</p>
                </td>
            </tr>
        `;
        return;
    }

    attempts.forEach(attempt => {
        const clone = studentAttemptTemplate.content.cloneNode(true);
        const row = clone.querySelector('tr');

        // Mark new attempts with special styling
        if (newAttemptIds.has(attempt.id)) {
            row.classList.add('new-student-attempt');
            setTimeout(() => {
                row.classList.remove('new-student-attempt');
            }, 3000);
        }

        clone.querySelector('.time').textContent = new Date(attempt.time).toLocaleString();
        clone.querySelector('.class').textContent = attempt.class;
        clone.querySelector('.exam-venue').textContent = examVenueData[attempt.class.toUpperCase()] || '???';

        // Checked time
        const checkedTimeCell = clone.querySelector('.checked-time');
        if (attempt.checked) {
            checkedTimeCell.textContent = new Date(attempt.checked).toLocaleString();
        } else {
            const btn = document.createElement('button');
            btn.textContent = 'Check';
            btn.addEventListener('click', function () {
                checkStudentAttendance(btn, attempt.id);
            });
            checkedTimeCell.appendChild(btn);
        }

        studentAttemptsBody.appendChild(clone);
    });

    // Show notification if new attempts were added
    if (newAttemptIds.size > 0 && isAutoRefresh) {
        const now = new Date().toLocaleTimeString();
        studentRefreshStatus.textContent = `Last updated: ${now} (${newAttemptIds.size} new)`;
    }
}

// Show error message
function showError(message) {
    studentInfo.innerHTML = `
        <div class="error-state">
            <h4>Error</h4>
            <p>${message}</p>
        </div>
    `;
}

// Pause/Resume functionality for student page
function initializeStudentPauseFeature() {
    studentPauseRefreshBtn.addEventListener('click', toggleStudentAutoRefresh);
}

function toggleStudentAutoRefresh() {
    if (isStudentRefreshPaused) {
        resumeStudentAutoRefresh();
    } else {
        pauseStudentAutoRefresh();
    }
}

function pauseStudentAutoRefresh() {
    isStudentRefreshPaused = true;

    if (studentRefreshTimer) clearTimeout(studentRefreshTimer);
    if (studentCountdownTimer) clearInterval(studentCountdownTimer);

    studentPauseRefreshBtn.textContent = '▶️ Resume';
    studentPauseRefreshBtn.className = 'refresh-control-btn paused';
    studentCountdown.textContent = 'Auto-refresh paused';
    studentCountdown.style.color = '#ffc107';
}

function resumeStudentAutoRefresh() {
    isStudentRefreshPaused = false;

    studentPauseRefreshBtn.textContent = '⏸️ Pause';
    studentPauseRefreshBtn.className = 'refresh-control-btn';
    studentCountdown.style.color = '#007bff';

    startStudentAutoRefresh();
}

// Auto refresh functions
function updateStudentCountdown() {
    if (studentCountdownSeconds > 0) {
        studentCountdown.textContent = `Next refresh in: ${studentCountdownSeconds}s`;
        studentCountdownSeconds--;
    } else {
        studentCountdown.textContent = 'Refreshing now...';
    }
}

function startStudentCountdown() {
    studentCountdownSeconds = 5;
    updateStudentCountdown();
    studentCountdownTimer = setInterval(updateStudentCountdown, 1000);
}

function startStudentAutoRefresh() {
    if (isStudentRefreshPaused) {
        return;
    }

    if (studentRefreshTimer) clearTimeout(studentRefreshTimer);
    if (studentCountdownTimer) clearInterval(studentCountdownTimer);

    startStudentCountdown();

    studentRefreshTimer = setTimeout(() => {
        if (!isStudentRefreshPaused) {
            fetchStudentData(true).then(() => {
                startStudentAutoRefresh();
            });
        }
    }, 5000);
}

// Handle check attendance - matches home page implementation
async function checkStudentAttendance(btn, id) {
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
            if (!isStudentRefreshPaused) {
                startStudentAutoRefresh();
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeStudentPage();
});
