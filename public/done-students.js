// Done Students Table Management
const doneStudentsBody = document.getElementById('done-students-body');
const doneStudentTemplate = document.getElementById('done-student-row-template');
const doneRefreshStatus = document.getElementById('done-refresh-status');
const doneCountdown = document.getElementById('done-countdown');

// Manual form elements
const manualDoneForm = document.getElementById('manual-done-form');
const studentIdInput = document.getElementById('student-id-input');
const markDoneBtn = document.getElementById('mark-done-btn');
const formMessage = document.getElementById('form-message');

let doneRefreshTimer;
let doneCountdownTimer;
let doneCountdownSeconds = 10;
let previousDoneData = []; // Track previous data to identify new done students
let formMessageTimer; // Timer for auto-clearing form messages

// Initialize manual form
function initializeManualForm() {
    manualDoneForm.addEventListener('submit', handleManualMarkAsDone);

    // Clear form message when typing
    studentIdInput.addEventListener('input', () => {
        clearFormMessage();
    });
}

// Handle manual mark as done form submission
async function handleManualMarkAsDone(event) {
    event.preventDefault();

    const studentId = studentIdInput.value.trim().toUpperCase();

    if (!studentId) {
        showFormMessage('Please enter a student ID', 'error');
        return;
    }

    // Disable form while processing
    markDoneBtn.disabled = true;
    markDoneBtn.textContent = 'Processing...';
    showFormMessage('Marking student as done...', 'info', false); // Don't auto-clear processing messages

    try {
        const response = await fetch(`/attempts/students/${studentId}/done`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const studentName = studentData[studentId] || 'Unknown';
            showFormMessage(`✅ ${studentName} (${studentId}) marked as done successfully!`, 'success');
            studentIdInput.value = '';

            // Refresh both tables to show updated data
            await fetchDoneStudents();
            // Also trigger refresh of main attendance table if available
            if (typeof fetchAttempts === 'function') {
                await fetchAttempts();
            }
        } else {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Failed to mark student as done (Status: ${response.status})`;
            showFormMessage(`❌ ${errorMessage}`, 'error');
        }
    } catch (error) {
        console.error('Error marking student as done:', error);
        showFormMessage('❌ Network error. Please try again.', 'error');
    } finally {
        // Re-enable form
        markDoneBtn.disabled = false;
        markDoneBtn.textContent = 'Mark as Done';
    }
}

// Show form message with different types
function showFormMessage(message, type = 'info', autoClear = true) {
    // Clear any existing timer
    if (formMessageTimer) {
        clearTimeout(formMessageTimer);
    }

    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    // Auto-clear message after specified time (except for processing messages)
    if (autoClear && type !== 'info') {
        const clearTime = type === 'success' ? 5000 : 7000; // Success: 5s, Error: 7s
        formMessageTimer = setTimeout(() => {
            clearFormMessage();
        }, clearTime);
    }
}

// Clear form message
function clearFormMessage() {
    if (formMessageTimer) {
        clearTimeout(formMessageTimer);
        formMessageTimer = null;
    }
    formMessage.textContent = '';
    formMessage.className = 'form-message';
    formMessage.style.display = 'none';
}

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

            // Make student name clickable
            const nameCell = clone.querySelector('.name');
            const studentName = studentData[item.student_id.toUpperCase()] || '???';
            nameCell.innerHTML = `<a href="student.html?studentId=${item.student_id}" class="student-link">${studentName}</a>`;

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
        // Initialize the manual form
        initializeManualForm();

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
