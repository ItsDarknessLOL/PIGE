export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  const colors = {
    error: 'bg-red-500',
    success: 'bg-emerald-500',
    info: 'bg-blue-500'
  };
  toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white shadow-xl transform translate-y-10 opacity-0 transition-all duration-300 z-[9999] ${colors[type] || colors.info}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('translate-y-10', 'opacity-0'));
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

export function toggleTheme() {
  const html = document.documentElement;
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}