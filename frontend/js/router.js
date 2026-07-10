import { getUser, hasRole } from './auth.js';
import * as Views from './views.js';

const routes = {
  '/dashboard': { view: Views.renderDashboard, title: 'Dashboard', roles: ['administrador','docente','alumno','invitado'] },
  '/usuarios': { view: Views.renderUsuarios, title: 'Gestión de Usuarios', roles: ['administrador'] },
  '/mapa': { view: Views.renderMapa, title: 'Mapa Nacional SIG', roles: ['administrador','docente','alumno','invitado'] },
  '/analitica': { view: Views.renderAnalitica, title: 'Analítica', roles: ['administrador'] },
  '/ia': { view: Views.renderIA, title: 'Asistente IA', roles: ['docente','alumno'] },
  '/grupos': { view: Views.renderDocenteGrupos, title: 'Mis Grupos', roles: ['docente'] },
  '/asistencia': { view: Views.renderAsistencia, title: 'Asistencia', roles: ['docente'] },
  '/actividades': { view: Views.renderActividades, title: 'Actividades', roles: ['docente'] },
  '/calificaciones': { view: Views.renderCalificaciones, title: 'Calificaciones', roles: ['docente','alumno'] },
  '/horario': { view: Views.renderHorario, title: 'Mi Horario', roles: ['alumno'] },
  '/tareas': { view: Views.renderTareas, title: 'Mis Tareas', roles: ['alumno'] },
  '/progreso': { view: Views.renderProgreso, title: 'Mi Progreso', roles: ['alumno'] },
  '/configuracion': { view: Views.renderConfiguracion, title: 'Configuración', roles: ['administrador'] }
};

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  let hash = window.location.hash.slice(1) || '/dashboard';
  const route = routes[hash] || routes['/dashboard'];
  const user = getUser();
  
  if (route.roles && !route.roles.includes(user?.rol || 'invitado')) {
    hash = '/dashboard';
  }
  
  document.getElementById('page-title').textContent = route.title;
  const main = document.getElementById('main-content');
  main.innerHTML = '<div class="flex items-center justify-center h-full"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>';
  
  setTimeout(() => {
    main.innerHTML = '';
    route.view(main);
  }, 100);
  
  // Update active nav
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`a[href="#${hash}"]`);
  if (activeLink) activeLink.classList.add('active');
}