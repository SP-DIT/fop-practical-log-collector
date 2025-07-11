// Function to toggle dark mode class
function toggleDarkMode(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  localStorage.setItem('darkMode', isDark);
  document.getElementById('darkModeToggle').checked = isDark;
}

// Load saved mode on page load
document.addEventListener('DOMContentLoaded', () => {
  const isDark = localStorage.getItem('darkMode') === 'true';
  toggleDarkMode(isDark);

  document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    toggleDarkMode(e.target.checked);
  });
});

