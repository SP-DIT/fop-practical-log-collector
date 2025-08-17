// Done Students Table Management
const doneStudentsBody = document.getElementById('done-students-body');
const doneStudentTemplate = document.getElementById('done-student-row-template');
const doneRefreshStatus = document.getElementById('done-refresh-status');
const doneCountdown = document.getElementById('done-countdown');

let doneRefreshTimer;
let doneCountdownTimer;
let doneCountdownSeconds = 10;
let previousDoneData = []; // Track previous data to identify new done students

async function fetchDoneStudents(isAutoRefresh = false) {
    try {
        // Show refreshing status
        if (isAutoRefresh) {
            doneRefreshStatus.textContent = 'Refreshing...';
            doneRefreshStatus.className = 'refresh-status refreshing';
        }

        const response = await fetch('./attempts/students/done');
        const doneStudentsData = await response.json();

        // Identify new done students by comparing with previous data
        const newDoneStudentIds = new Set();
        if (isAutoRefresh && previousDoneData.length > 0) {
            const previousStudentIds = new Set(previousDoneData.map((item) => item.student_id));
            doneStudentsData.forEach((item) => {
                if (!previousStudentIds.has(item.student_id)) {
                    newDoneStudentIds.add(item.student_id);
                }
            });
        }

        // Store current data for next comparison
        previousDoneData = [...doneStudentsData];

        // Clear existing table data only after successful fetch
        doneStudentsBody.innerHTML = '';

        doneStudentsData.forEach((item) => {
            const clone = doneStudentTemplate.content.cloneNode(true);
            const row = clone.querySelector('tr');

            // Mark new done students with special styling
            if (newDoneStudentIds.has(item.student_id)) {
                row.classList.add('new-done-row');
                // Remove the new-done-row class after animation completes
                setTimeout(() => {
                    row.classList.remove('new-done-row');
                }, 3000);
            }

            clone.querySelector('.student-id').textContent = item.student_id;
            clone.querySelector('.name').textContent = studentData[item.student_id.toUpperCase()] || '???';
            clone.querySelector('.done-time').textContent = new Date(item.time).toLocaleString();

            const actionCell = clone.querySelector('.action-cell');
            const undoneBtn = document.createElement('button');
            undoneBtn.textContent = 'Mark Undone';
            undoneBtn.className = 'undone-btn';
            undoneBtn.addEventListener('click', function () {
                markAsUndone(undoneBtn, item.student_id);
            });
            actionCell.appendChild(undoneBtn);

            doneStudentsBody.appendChild(clone);
        });

        // Clear refreshing status and show last updated time
        const now = new Date().toLocaleTimeString();
        doneRefreshStatus.textContent = `Last updated: ${now}`;
        doneRefreshStatus.className = 'refresh-status success';

        // Show notification if new done students were added
        if (newDoneStudentIds.size > 0) {
            doneRefreshStatus.textContent = `Last updated: ${now} (${newDoneStudentIds.size} new done)`;
        }
    } catch (err) {
        console.error('Error fetching done students:', err);
        doneStudentsBody.innerHTML = `<tr><td colspan="4">Failed to load done students data</td></tr>`;
        doneRefreshStatus.textContent = 'Error loading done students';
        doneRefreshStatus.className = 'refresh-status error';
    }
}

async function markAsUndone(btn, studentId) {
    try {
        btn.disabled = true;
        btn.textContent = 'Processing...';

        const response = await fetch(`/attempts/students/${studentId}/undone`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // Refresh the done students table immediately
            await fetchDoneStudents();
            startDoneAutoRefresh();
        } else {
            btn.disabled = false;
            btn.textContent = 'Mark Undone';
            alert('Failed to mark student as undone.');
        }
    } catch (err) {
        console.error('Error marking student as undone:', err);
        alert('Error marking student as undone.');
        btn.disabled = false;
        btn.textContent = 'Mark Undone';
    }
}

function updateDoneCountdown() {
    if (doneCountdownSeconds > 0) {
        doneCountdown.textContent = `Next refresh in: ${doneCountdownSeconds}s`;
        doneCountdownSeconds--;
    } else {
        doneCountdown.textContent = 'Refreshing now...';
    }
}

function startDoneCountdown() {
    doneCountdownSeconds = 10;
    updateDoneCountdown();
    doneCountdownTimer = setInterval(updateDoneCountdown, 1000);
}

function startDoneAutoRefresh() {
    // Clear existing timers
    if (doneRefreshTimer) clearTimeout(doneRefreshTimer);
    if (doneCountdownTimer) clearInterval(doneCountdownTimer);

    // Start countdown
    startDoneCountdown();

    // Set up auto refresh (10 seconds)
    doneRefreshTimer = setTimeout(() => {
        fetchDoneStudents(true).then(() => {
            startDoneAutoRefresh(); // Continue the cycle
        });
    }, 10000);
}

// Wait for studentData to be loaded before initializing done students table
function initializeDoneStudents() {
    if (typeof studentData !== 'undefined' && Object.keys(studentData).length > 0) {
        fetchDoneStudents().then(() => {
            startDoneAutoRefresh();
        });
    } else {
        // Retry after 500ms if studentData is not ready
        setTimeout(initializeDoneStudents, 500);
    }
}

// Initialize done students table
initializeDoneStudents();
