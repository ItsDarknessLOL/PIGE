import { api } from './api.js';
import { getUser, hasRole } from './auth.js';
import { showToast } from './ui.js';

/* ============================================
   UTILIDADES DE VISTA
   ============================================ */
function kpiCard(title, value, icon, colorClass) {
  return `
    <div class="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300 cursor-default">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">${title}</p>
          <p class="text-3xl font-bold text-slate-800 dark:text-white">${value}</p>
        </div>
        <div class="w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
          ${icon}
        </div>
      </div>
    </div>
  `;
}

function sectionHeader(title, actionHtml = '') {
  return `
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-2xl font-bold text-slate-800 dark:text-white">${title}</h2>
      ${actionHtml}
    </div>
  `;
}

/* ============================================
   DASHBOARD (ADAPTATIVO POR ROL)
   ============================================ */
export async function renderDashboard(container) {
  const user = getUser();
  const rol = user?.rol || 'invitado';
  
  let content = `<div class="p-6 animate-fade-in space-y-6">`;
  
  content += `
    <div class="glass-card p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">¡Hola, ${user?.nombre || 'Invitado'}! 👋</h1>
      <p class="text-slate-600 dark:text-slate-300">Bienvenido a PIGE. Aquí tienes un resumen de tu actividad.</p>
    </div>
  `;

  if (rol === 'administrador') {
    content += `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        ${kpiCard('Total Usuarios', '—', '👥', 'bg-blue-500')}
        ${kpiCard('Docentes', '—', '👨‍🏫', 'bg-violet-500')}
        ${kpiCard('Alumnos', '—', '🎓', 'bg-emerald-500')}
        ${kpiCard('Instituciones', '—', '🏫', 'bg-amber-500')}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="glass-card p-6 rounded-2xl h-80"><canvas id="chart-asistencia"></canvas></div>
        <div class="glass-card p-6 rounded-2xl h-80"><canvas id="chart-rendimiento"></canvas></div>
      </div>
    `;
  } else if (rol === 'docente') {
    content += `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${kpiCard('Mis Grupos', '3', '👨‍🏫', 'bg-blue-500')}
        ${kpiCard('Alumnos Activos', '87', '🎓', 'bg-emerald-500')}
        ${kpiCard('Alertas', '2', '⚠️', 'bg-red-500')}
      </div>
      <div class="glass-card p-6 rounded-2xl">
        <h3 class="font-bold text-lg mb-4 text-slate-800 dark:text-white">Próximas Actividades</h3>
        <div class="space-y-3">
          <div class="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
            <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">📝</div>
            <div><p class="font-medium text-slate-800 dark:text-white">Examen Parcial - Matemáticas</p><p class="text-sm text-slate-500">Vence en 2 días</p></div>
          </div>
        </div>
      </div>
    `;
  } else if (rol === 'alumno') {
    content += `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${kpiCard('Promedio General', '8.7', '📊', 'bg-blue-500')}
        ${kpiCard('Tareas Pendientes', '4', '📝', 'bg-amber-500')}
        ${kpiCard('Asistencia', '96%', '✅', 'bg-emerald-500')}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="glass-card p-6 rounded-2xl">
          <h3 class="font-bold text-lg mb-4 text-slate-800 dark:text-white">Mi Horario Hoy</h3>
          <div class="space-y-2">
            <div class="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30"><span class="font-medium">Matemáticas</span><span class="text-slate-500">08:00 - 10:00</span></div>
            <div class="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30"><span class="font-medium">Física</span><span class="text-slate-500">10:00 - 12:00</span></div>
          </div>
        </div>
        <div class="glass-card p-6 rounded-2xl h-64"><canvas id="chart-progreso"></canvas></div>
      </div>
    `;
  } else {
    content += `
      <div class="text-center py-12">
        <div class="text-6xl mb-4">🗺️</div>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-4">Explora el Mapa Nacional</h2>
        <p class="text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">Visualiza instituciones educativas de todo México con nuestro sistema de información geográfica.</p>
        <a href="#/mapa" class="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-medium">Ver Mapa</a>
      </div>
    `;
  }
  
  content += `</div>`;
  container.innerHTML = content;
  
  // Inicializar charts si existen canvas
  if (document.getElementById('chart-asistencia')) {
    initBarChart('chart-asistencia', ['Ene','Feb','Mar','Abr','May','Jun'], [95,92,90,93,95,92], 'Asistencia %');
  }
  if (document.getElementById('chart-rendimiento')) {
    initDoughnut('chart-rendimiento', ['Aprobados','Reprobados','NP'], [85,12,3], ['#10b981','#ef4444','#6b7280']);
  }
  if (document.getElementById('chart-progreso')) {
    initBarChart('chart-progreso', ['Mat','Fis','Qui','His','Ing'], [9,8.5,7.5,9.2,8.8], 'Calificación');
  }
}

/* ============================================
   USUARIOS (ADMIN)
   ============================================ */
export async function renderUsuarios(container) {
  container.innerHTML = `
    <div class="p-6 animate-fade-in">
      ${sectionHeader('Gestión de Usuarios', `<button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-lg shadow-primary-500/20">+ Nuevo Usuario</button>`)}
      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th class="px-6 py-4 font-semibold text-slate-600 dark:text-slate-200 text-sm uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-4 font-semibold text-slate-600 dark:text-slate-200 text-sm uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 font-semibold text-slate-600 dark:text-slate-200 text-sm uppercase tracking-wider">Rol</th>
                <th class="px-6 py-4 font-semibold text-slate-600 dark:text-slate-200 text-sm uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody id="usuarios-tbody" class="divide-y divide-slate-100 dark:divide-slate-700">
              <tr><td colspan="4" class="px-6 py-8 text-center text-slate-400">Cargando...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  try {
    const usuarios = await api.get('/usuarios/');
    const tbody = document.getElementById('usuarios-tbody');
    tbody.innerHTML = usuarios.map(u => {
      const rolColors = {
        administrador: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        docente: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        alumno: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        invitado: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
      };
      return `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
          <td class="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">${u.nombre} ${u.apellido_paterno}</td>
          <td class="px-6 py-4 text-slate-600 dark:text-slate-400">${u.email}</td>
          <td class="px-6 py-4"><span class="px-2.5 py-1 rounded-full text-xs font-semibold ${rolColors[u.rol] || rolColors.invitado}">${u.rol}</span></td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full ${u.activo ? 'bg-emerald-500' : 'bg-red-500'}"></span>
              <span class="text-slate-600 dark:text-slate-400 text-sm">${u.activo ? 'Activo' : 'Inactivo'}</span>
            </span>
          </td>
        </tr>
      `;
    }).join('');
  } catch (e) {
    showToast('Error cargando usuarios: ' + e.message, 'error');
  }
}

/* ============================================
   MAPA SIG (LEAFLET + POSTGIS)
   ============================================ */
export async function renderMapa(container) {
  container.innerHTML = `
    <div class="h-full w-full relative flex flex-col md:flex-row">
      <div id="map" class="flex-1 h-full min-h-[500px] rounded-none"></div>
      <div class="w-full md:w-80 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-l border-slate-200 dark:border-dark-border p-5 overflow-y-auto z-[500]">
        <h3 class="font-bold text-lg mb-4 text-slate-800 dark:text-white">Filtros SIG</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Estado</label>
            <input type="text" id="filtro-estado" placeholder="Ej. Querétaro" class="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:text-white">
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Municipio</label>
            <input type="text" id="filtro-municipio" placeholder="Ej. Querétaro" class="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:text-white">
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Subsistema</label>
            <select id="filtro-subsistema" class="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:text-white">
              <option value="">Todos</option>
              <option value="UNAM">UNAM</option>
              <option value="IPN">IPN</option>
              <option value="UAEM">UAEM</option>
              <option value="TECNM">TECNM</option>
            </select>
          </div>
          <button id="btn-buscar-sig" class="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium text-sm">🔍 Buscar Instituciones</button>
        </div>
        <div id="sig-results" class="mt-6 space-y-3"></div>
      </div>
    </div>
  `;
  
  const map = L.map('map').setView([23.6345, -102.5528], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);
  
  const markers = [];
  
  async function cargarInstituciones() {
    const estado = document.getElementById('filtro-estado').value;
    const municipio = document.getElementById('filtro-municipio').value;
    const subsistema = document.getElementById('filtro-subsistema').value;
    
    const params = new URLSearchParams();
    if (estado) params.append('estado', estado);
    if (municipio) params.append('municipio', municipio);
    if (subsistema) params.append('subsistema', subsistema);
    
    try {
      const data = await api.get(`/instituciones/?${params.toString()}`);
      markers.forEach(m => map.removeLayer(m));
      markers.length = 0;
      
      const resultsDiv = document.getElementById('sig-results');
      resultsDiv.innerHTML = '';
      
      data.forEach(inst => {
        if (inst.lat && inst.lng) {
          const marker = L.marker([inst.lat, inst.lng]).addTo(map);
          marker.bindPopup(`
            <div class="p-2 min-w-[200px]">
              <h3 class="font-bold text-slate-800 mb-1">${inst.nombre}</h3>
              <p class="text-xs text-slate-600 mb-2">${inst.municipio}, ${inst.estado}</p>
              ${inst.foto_url ? `<img src="${inst.foto_url}" class="w-full h-24 object-cover rounded mb-2">` : ''}
              <div class="text-xs space-y-1">
                <p><strong>Tipo:</strong> ${inst.tipo || 'N/A'}</p>
                <p><strong>Subsistema:</strong> ${inst.subsistema || 'N/A'}</p>
                ${inst.telefono ? `<p>📞 ${inst.telefono}</p>` : ''}
                ${inst.sitio_web ? `<p>🌐 <a href="${inst.sitio_web}" target="_blank" class="text-blue-600">Sitio web</a></p>` : ''}
              </div>
            </div>
          `);
          markers.push(marker);
        }
        
        const card = document.createElement('div');
        card.className = 'p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-primary-500 transition';
        card.innerHTML = `
          <h4 class="font-semibold text-sm text-slate-800 dark:text-white">${inst.nombre}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400">${inst.municipio}, ${inst.estado}</p>
        `;
        card.addEventListener('click', () => {
          if (inst.lat && inst.lng) {
            map.setView([inst.lat, inst.lng], 16);
            markers.find(m => {
              const latLng = m.getLatLng();
              return Math.abs(latLng.lat - inst.lat) < 0.0001 && Math.abs(latLng.lng - inst.lng) < 0.0001;
            })?.openPopup();
          }
        });
        resultsDiv.appendChild(card);
      });
      
      if (data.length > 0 && data[0].lat) {
        map.setView([data[0].lat, data[0].lng], 12);
      }
    } catch (e) {
      showToast('Error cargando instituciones', 'error');
    }
  }
  
  document.getElementById('btn-buscar-sig').addEventListener('click', cargarInstituciones);
  cargarInstituciones();
}

/* ============================================
   ANALÍTICA
   ============================================ */
export async function renderAnalitica(container) {
  container.innerHTML = `
    <div class="p-6 animate-fade-in space-y-6">
      ${sectionHeader('Panel de Analítica Ejecutiva')}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        ${kpiCard('Total Usuarios', '1,245', '📊', 'bg-blue-500')}
        ${kpiCard('Asistencia Prom.', '92.5%', '✅', 'bg-emerald-500')}
        ${kpiCard('Aprobación', '85.3%', '📈', 'bg-violet-500')}
        ${kpiCard('Deserción', '3.2%', '⚠️', 'bg-amber-500')}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="glass-card p-6 rounded-2xl h-80"><canvas id="chart-asistencia"></canvas></div>
        <div class="glass-card p-6 rounded-2xl h-80"><canvas id="chart-rendimiento"></canvas></div>
      </div>
      <div class="glass-card p-6 rounded-2xl">
        <h3 class="font-bold text-lg mb-4 text-slate-800 dark:text-white">Tendencias Recientes</h3>
        <div class="h-64"><canvas id="chart-tendencias"></canvas></div>
      </div>
    </div>
  `;
  
  initBarChart('chart-asistencia', ['Ene','Feb','Mar','Abr','May','Jun'], [95,92,90,93,95,92], 'Asistencia %', '#3b82f6');
  initDoughnut('chart-rendimiento', ['Aprobados','Reprobados','NP'], [85.3, 14.7, 0], ['#10b981','#ef4444','#6b7280']);
  initLineChart('chart-tendencias', ['Ene','Feb','Mar','Abr','May','Jun'], [82,84,83,85,86,85], 'Aprobación %');
}

/* ============================================
   IA ASISTENTE
   ============================================ */
export async function renderIA(container) {
  container.innerHTML = `
    <div class="p-6 animate-fade-in max-w-4xl mx-auto">
      ${sectionHeader('Asistente de Inteligencia Artificial', '')}
      <div class="glass-card p-6 rounded-2xl mb-6 border-t-4 border-primary-500">
        <div class="flex flex-wrap gap-2 mb-4">
          ${['examen','actividad','rubrica','planeacion','reporte','resumen'].map(t => `
            <button class="ia-type-btn px-4 py-2 rounded-lg text-sm font-medium transition ${t === 'examen' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}" data-type="${t}">
              ${t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          `).join('')}
        </div>
        <textarea id="ia-context" rows="4" class="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Describe el tema, contexto o grupo objetivo..."></textarea>
        <button id="btn-generar-ia" class="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <span>✨</span> Generar con IA
        </button>
      </div>
      <div id="ia-result" class="hidden glass-card p-6 rounded-2xl border-l-4 border-primary-500"></div>
    </div>
  `;
  
  let selectedType = 'examen';
  document.querySelectorAll('.ia-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedType = btn.dataset.type;
      document.querySelectorAll('.ia-type-btn').forEach(b => {
        b.className = 'ia-type-btn px-4 py-2 rounded-lg text-sm font-medium transition bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600';
      });
      btn.className = 'ia-type-btn px-4 py-2 rounded-lg text-sm font-medium transition bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300';
    });
  });
  
  document.getElementById('btn-generar-ia').addEventListener('click', async () => {
    const context = document.getElementById('ia-context').value;
    const resultDiv = document.getElementById('ia-result');
    if (!context) { showToast('Ingresa un contexto', 'error'); return; }
    
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `<div class="flex items-center gap-3 text-slate-500"><div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div> La IA está generando contenido...</div>`;
    
    try {
      const res = await api.post('/ia/generar', { tipo: selectedType, contexto: context });
      resultDiv.innerHTML = `
        <h3 class="font-bold text-lg mb-3 text-slate-800 dark:text-white flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-xs">✓</span>
          Resultado Generado
        </h3>
        <div class="prose dark:prose-invert max-w-none mb-4 text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">${res.contenido_generado}</div>
        <div class="flex flex-wrap gap-2 mb-4">
          ${res.sugerencias.map(s => `<span class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300 font-medium">${s}</span>`).join('')}
        </div>
        <div class="text-sm text-slate-500 flex items-center gap-2">
          <div class="h-1.5 flex-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style="width: ${res.confianza * 100}%"></div>
          </div>
          <span>Confianza: ${(res.confianza * 100).toFixed(0)}%</span>
        </div>
      `;
    } catch (e) {
      resultDiv.innerHTML = `<div class="text-red-500">Error: ${e.message}</div>`;
    }
  });
}

/* ============================================
   VISTAS DOCENTE
   ============================================ */
export function renderDocenteGrupos(container) {
  container.innerHTML = `
    <div class="p-6 animate-fade-in">
      ${sectionHeader('Mis Grupos', `<button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">+ Nuevo Grupo</button>`)}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${[1,2,3].map(i => `
          <div class="glass-card p-6 rounded-2xl hover:shadow-xl transition cursor-pointer group">
            <div class="flex justify-between items-start mb-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-lg group-hover:scale-110 transition">${i}</div>
              <span class="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold">Activo</span>
            </div>
            <h3 class="font-bold text-lg text-slate-800 dark:text-white mb-1">Grupo ${String.fromCharCode(64+i)}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Ingeniería en Sistemas • 2024-2027</p>
            <div class="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
              <span>👥 29 alumnos</span>
              <span>📋 5 materias</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderAsistencia(container) {
  container.innerHTML = `
    <div class="p-6 animate-fade-in">
      ${sectionHeader('Registro de Asistencia')}
      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex gap-3">
          <input type="date" class="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 dark:text-white">
          <select class="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 dark:text-white">
            <option>Matemáticas I</option>
            <option>Física I</option>
          </select>
        </div>
        <table class="w-full text-left">
          <thead class="bg-slate-50 dark:bg-slate-700/50"><tr>
            <th class="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-200">Alumno</th>
            <th class="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Presente</th>
            <th class="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Ausente</th>
            <th class="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Retardo</th>
          </tr></thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            ${[1,2,3,4,5].map(i => `
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td class="px-6 py-3 text-slate-800 dark:text-slate-200 text-sm">Alumno Ejemplo ${i}</td>
                <td class="px-6 py-3 text-center"><input type="radio" name="a${i}" class="w-4 h-4 text-emerald-500" checked></td>
                <td class="px-6 py-3 text-center"><input type="radio" name="a${i}" class="w-4 h-4 text-red-500"></td>
                <td class="px-6 py-3 text-center"><input type="radio" name="a${i}" class="w-4 h-4 text-amber-500"></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function renderActividades(container) {
  container.innerHTML = `
    <div class="p-6 animate-fade-in">
      ${sectionHeader('Actividades y Tareas', `<button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">+ Crear Actividad</button>`)}
      <div class="space-y-4">
        ${[
          {t:'Examen Parcial - Matemáticas', d:'Vence en 2 días', c:'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'},
          {t:'Proyecto de Física', d:'Vence en 5 días', c:'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'},
          {t:'Ensayo de Historia', d:'Vence en 1 semana', c:'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}
        ].map(a => `
          <div class="glass-card p-5 rounded-2xl flex items-center justify-between hover:shadow-lg transition">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">📝</div>
              <div>
                <h4 class="font-semibold text-slate-800 dark:text-white">${a.t}</h4>
                <p class="text-sm text-slate-500 dark:text-slate-400">${a.d}</p>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${a.c}">Pendiente</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ============================================
   VISTAS ALUMNO
   ============================================ */
export function renderHorario(container) {
  container.innerHTML = `
    <div class="p-6 animate-fade-in">
      ${sectionHeader('Mi Horario')}
      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="grid grid-cols-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <div class="p-3 text-sm font-semibold text-slate-600 dark:text-slate-200">Hora</div>
          ${['Lun','Mar','Mié','Jue','Vie'].map(d => `<div class="p-3 text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">${d}</div>`).join('')}
        </div>
        ${['08:00-10:00','10:00-12:00','12:00-14:00','14:00-16:00'].map(h => `
          <div class="grid grid-cols-6 border-b border-slate-100 dark:border-slate-700/50">
            <div class="p-3 text-xs text-slate-500 dark:text-slate-400 flex items-center">${h}</div>
            ${[0,1,2,3,4].map(() => `
              <div class="p-2 border-l border-slate-100 dark:border-slate-700/50 min-h-[80px]">
                ${Math.random() > 0.3 ? `<div class="h-full p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-800/30">Materia</div>` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderTareas(container) {
  container.innerHTML = `
    <div class="p-6 animate-fade-in">
      ${sectionHeader('Mis Tareas')}
      <div class="space-y-4">
        <div class="glass-card p-5 rounded-2xl border-l-4 border-red-500">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-semibold text-slate-800 dark:text-white">Examen de Matemáticas</h4>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Vence hoy a las 23:59</p>
            </div>
            <span class="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">Urgente</span>
          </div>
        </div>
        <div class="glass-card p-5 rounded-2xl border-l-4 border-amber-500">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-semibold text-slate-800 dark:text-white">Ensayo de Historia</h4>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Vence en 3 días</p>
            </div>
            <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">Pronto</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderProgreso(container) {
  container.innerHTML = `
    <div class="p-6 animate-fade-in">
      ${sectionHeader('Mi Progreso Académico')}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="glass-card p-6 rounded-2xl">
          <h3 class="font-bold mb-4 text-slate-800 dark:text-white">Promedio por Materia</h3>
          <div class="h-64"><canvas id="chart-materias"></canvas></div>
        </div>
        <div class="glass-card p-6 rounded-2xl lg:col-span-2">
          <h3 class="font-bold mb-4 text-slate-800 dark:text-white">Historial de Calificaciones</h3>
          <div class="h-64"><canvas id="chart-historial"></canvas></div>
        </div>
      </div>
      <div class="mt-6 glass-card p-6 rounded-2xl">
        <h3 class="font-bold mb-4 text-slate-800 dark:text-white">🏆 Logros</h3>
        <div class="flex gap-4 flex-wrap">
          ${['Excelencia Académica','Asistencia Perfecta','Mejora Continua','Participación'].map(l => `
            <div class="px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-200 text-sm font-medium border border-amber-200 dark:border-amber-800/30">
              ✓ ${l}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  setTimeout(() => {
    initBarChart('chart-materias', ['Mat','Fis','Qui','His','Ing'], [9,8.5,7.5,9.2,8.8], 'Calif.', '#3b82f6');
    initLineChart('chart-historial', ['Parcial 1','Parcial 2','Parcial 3','Final'], [8,8.5,9,8.7], 'Promedio');
  }, 100);
}

/* ============================================
   CALIFICACIONES (DOCENTE/ALUMNO)
   ============================================ */
export function renderCalificaciones(container) {
  const isDocente = hasRole('docente');
  container.innerHTML = `
    <div class="p-6 animate-fade-in">
      ${sectionHeader(isDocente ? 'Gestión de Calificaciones' : 'Mis Calificaciones')}
      <div class="glass-card rounded-2xl overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th class="px-6 py-4 font-semibold text-slate-600 dark:text-slate-200 text-sm">${isDocente ? 'Alumno' : 'Materia'}</th>
              <th class="px-6 py-4 font-semibold text-slate-600 dark:text-slate-200 text-sm">Actividad</th>
              <th class="px-6 py-4 font-semibold text-slate-600 dark:text-slate-200 text-sm">Calificación</th>
              <th class="px-6 py-4 font-semibold text-slate-600 dark:text-slate-200 text-sm">Tipo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td class="px-6 py-4 text-slate-800 dark:text-slate-200 text-sm">${isDocente ? 'Juan Pérez' : 'Matemáticas I'}</td>
              <td class="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">Examen Parcial</td>
              <td class="px-6 py-4"><span class="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-sm">9.5</span></td>
              <td class="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">Ordinario</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ============================================
   CONFIGURACIÓN
   ============================================ */
export function renderConfiguracion(container) {
  container.innerHTML = `
    <div class="p-6 animate-fade-in max-w-3xl">
      ${sectionHeader('Configuración del Sistema')}
      <div class="space-y-6">
        <div class="glass-card p-6 rounded-2xl">
          <h3 class="font-bold text-lg mb-4 text-slate-800 dark:text-white">General</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div><p class="font-medium text-slate-800 dark:text-white">Modo Oscuro Automático</p><p class="text-sm text-slate-500">Adaptar según sistema</p></div>
              <button class="w-12 h-6 rounded-full bg-primary-600 relative transition"><span class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></span></button>
            </div>
            <div class="flex items-center justify-between">
              <div><p class="font-medium text-slate-800 dark:text-white">Notificaciones</p><p class="text-sm text-slate-500">Alertas en tiempo real</p></div>
              <button class="w-12 h-6 rounded-full bg-primary-600 relative transition"><span class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></span></button>
            </div>
          </div>
        </div>
        <div class="glass-card p-6 rounded-2xl">
          <h3 class="font-bold text-lg mb-4 text-slate-800 dark:text-white">Seguridad</h3>
          <button class="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition text-sm font-medium">Cambiar Contraseña</button>
        </div>
      </div>
    </div>
  `;
}

/* ============================================
   HELPERS CHART.JS
   ============================================ */
function initBarChart(id, labels, data, label, color = '#3b82f6') {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label, data, backgroundColor: color, borderRadius: 8 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,0.1)' } }, x: { grid: { display: false } } } }
  });
}

function initDoughnut(id, labels, data, colors) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } } } }
  });
}

function initLineChart(id, labels, data, label) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label, data, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#fff', pointBorderColor: '#3b82f6', pointBorderWidth: 2 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(148,163,184,0.1)' } }, x: { grid: { display: false } } } }
  });
}