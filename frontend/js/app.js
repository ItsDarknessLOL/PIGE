import { initRouter } from './router.js';
import { toggleTheme } from './ui.js';
import { logout, getUser } from './auth.js';

function renderSidebar() {
  const user = getUser();
  const rol = user?.rol || 'invitado';
  
  const menus = {
    administrador: [
      { icon: '📊', label: 'Dashboard', hash: '/dashboard' },
      { icon: '👥', label: 'Usuarios', hash: '/usuarios' },
      { icon: '🏫', label: 'Instituciones', hash: '/mapa' },
      { icon: '📈', label: 'Analítica', hash: '/analitica' },
      { icon: '⚙️', label: 'Configuración', hash: '/configuracion' },
    ],
    docente: [
      { icon: '📊', label: 'Dashboard', hash: '/dashboard' },
      { icon: '👨‍🏫', label: 'Mis Grupos', hash: '/grupos' },
      { icon: '✅', label: 'Asistencia', hash: '/asistencia' },
      { icon: '📝', label: 'Actividades', hash: '/actividades' },
      { icon: '📋', label: 'Calificaciones', hash: '/calificaciones' },
      { icon: '🤖', label: 'Asistente IA', hash: '/ia' },
    ],
    alumno: [
      { icon: '📊', label: 'Dashboard', hash: '/dashboard' },
      { icon: '📅', label: 'Mi Horario', hash: '/horario' },
      { icon: '📝', label: 'Tareas', hash: '/tareas' },
      { icon: '📋', label: 'Calificaciones', hash: '/calificaciones' },
      { icon: '🏆', label: 'Progreso', hash: '/progreso' },
      { icon: '🤖', label: 'Asistente IA', hash: '/ia' },
    ],
    invitado: [
      { icon: '🗺️', label: 'Mapa Nacional', hash: '/mapa' },
      { icon: '🏫', label: 'Instituciones', hash: '/mapa' },
    ]
  };
  
  const items = menus[rol] || menus.invitado;
  const container = document.getElementById('nav-items');
  container.innerHTML = items.map(item => `
    <a href="#${item.hash}" class="nav-link flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-primary-600 dark:hover:text-primary-400">
      <span class="text-xl">${item.icon}</span>
      <span class="font-medium text-sm">${item.label}</span>
    </a>
  `).join('');
  
  // Actualizar info de usuario
  if (user) {
    document.getElementById('user-name').textContent = user.nombre || 'Usuario';
    document.getElementById('user-role').textContent = user.rol || 'invitado';
    document.getElementById('user-avatar').textContent = (user.nombre?.[0] || 'U').toUpperCase();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Tema inicial
  const saved = localStorage.getItem('theme') || 'dark';
  if (saved === 'dark') document.documentElement.classList.add('dark');
  
  // Sidebar móvil
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggle = document.getElementById('sidebar-toggle');
  
  toggle?.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
  });
  
  overlay?.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  });
  
  // Controles
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  document.getElementById('logout-btn')?.addEventListener('click', logout);
  
  // Validar sesión
  const user = getUser();
  if (!user && window.location.pathname.includes('app.html')) {
    window.location.href = '/';
    return;
  }
  
  renderSidebar();
  initRouter();
});