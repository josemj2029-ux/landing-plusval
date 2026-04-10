/* ============================================================
   PLUSVAL EN TODO RD – FERIA INMOBILIARIA
   script.js  –  Formulario + Cupos + Google Sheets
   ============================================================ */

/* ---- CONFIGURACIÓN ---- */
const CONFIG = {
  // Pegar aquí la URL generada al publicar el Google Apps Script como Web App
  SCRIPT_URL: "PEGAR_AQUI_URL_DE_GOOGLE_APPS_SCRIPT",

  MAX_CUPOS: 100,

  EVENTO: {
    nombre:    "Plusval en Todo RD - Feria Inmobiliaria",
    fecha:     "Sábado 25",
    hora:      "3:00 PM",
    ubicacion: "Cabanna Punta Cana"
  }
};

/* ---- REFERENCIAS DOM ---- */
const form      = document.getElementById('registroForm');
const btnSubmit = document.getElementById('btnSubmit');
const btnText   = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const formMsg   = document.getElementById('formMsg');
const cuposChip = document.getElementById('cuposChip');
const cuposText = document.getElementById('cuposText');

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  checkCupos();
  form.addEventListener('submit', handleSubmit);
});

/* ============================================================
   VERIFICAR CUPOS
   ============================================================ */
async function checkCupos() {
  if (scriptConfigured()) {
    try {
      const res  = await fetch(`${CONFIG.SCRIPT_URL}?action=cupos`);
      const data = await res.json();
      applyQuotaState(data);
      return;
    } catch (e) {
      console.warn('No se pudo verificar cupos en servidor:', e);
    }
  }

  /* ─── Simulación local ───────────────────────────────────────
     Cambia totalRegistrados a 100 para probar el estado "lleno"
  ──────────────────────────────────────────────────────────── */
  applyQuotaState({
    success:          true,
    totalRegistrados: 73,
    cuposDisponibles: 27,
    cupoLleno:        false
  });
}

function applyQuotaState(data) {
  if (!data?.success) return;

  if (data.cupoLleno || data.cuposDisponibles <= 0) {
    cuposChip.classList.add('full');
    cuposText.textContent = '¡Cupo lleno! Ya no quedan plazas disponibles.';

    // Deshabilitar formulario completo
    [...form.elements].forEach(el => { el.disabled = true; });
    btnSubmit.disabled = true;
    btnText.textContent = 'CUPO LLENO';

    showMsg('⚠️ El cupo para este evento está agotado. ¡Gracias por tu interés!', 'err');
  } else {
    cuposText.textContent =
      `⚡ Cupos limitados · ${data.cuposDisponibles} de ${CONFIG.MAX_CUPOS} disponibles`;
  }
}

/* ============================================================
   ENVÍO DEL FORMULARIO
   ============================================================ */
async function handleSubmit(e) {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);
  hideMsg();

  const payload = {
    nombre:          val('nombre'),
    telefono:        val('telefono'),
    email:           val('email'),
    fuente:          val('fuente'),
    acepta_asesoria: document.getElementById('acepta').checked,
    evento:          CONFIG.EVENTO.nombre,
    fecha_evento:    CONFIG.EVENTO.fecha,
    hora_evento:     CONFIG.EVENTO.hora,
    ubicacion:       CONFIG.EVENTO.ubicacion,
    timestamp:       new Date().toISOString()
  };

  try {
    if (!scriptConfigured()) {
      await delay(1500);           // demo sin backend
    } else {
      // Google Apps Script requiere no-cors; el registro se procesa igualmente
      await fetch(CONFIG.SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
    }
    onSuccess();
  } catch (err) {
    console.error('Error al enviar:', err);
    showMsg('❌ Ocurrió un error al enviar. Por favor intenta de nuevo.', 'err');
  } finally {
    setLoading(false);
  }
}

function onSuccess() {
  showMsg(
    `✅ ¡Registro exitoso! Te esperamos el ${CONFIG.EVENTO.fecha} a las ${CONFIG.EVENTO.hora} en ${CONFIG.EVENTO.ubicacion}. ¡Nos vemos allá!`,
    'ok'
  );
  form.reset();
  checkCupos();
}

/* ============================================================
   VALIDACIÓN
   ============================================================ */
function validate() {
  clearErrors();
  let ok = true;

  if (val('nombre').length < 3) {
    fieldErr('nombre', 'Ingresa tu nombre completo.');
    ok = false;
  }

  if (!phoneOk(val('telefono'))) {
    fieldErr('telefono', 'Teléfono inválido (7-15 dígitos).');
    ok = false;
  }

  if (!emailOk(val('email'))) {
    fieldErr('email', 'Ingresa un correo válido.');
    ok = false;
  }

  if (!val('fuente')) {
    fieldErr('fuente', 'Selecciona cómo te enteraste.');
    ok = false;
  }

  if (!document.getElementById('acepta').checked) {
    checkErr('acepta', 'Debes aceptar los términos para continuar.');
    ok = false;
  }

  return ok;
}

const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const phoneOk = v => /^[\+\d][\d\s\-\(\)]{6,14}$/.test(v);

function fieldErr(id, msg) {
  const el = document.getElementById(id);
  el.classList.add('err');
  const wrap = el.closest('.field');
  if (wrap && !wrap.querySelector('.f-err')) {
    const p = Object.assign(document.createElement('p'), {
      className: 'f-err', textContent: msg
    });
    wrap.appendChild(p);
  }
}

function checkErr(id, msg) {
  const el   = document.getElementById(id);
  const wrap = el.closest('#wrap-acepta');
  el.classList.add('err');
  if (wrap && !wrap.querySelector('.f-err')) {
    const p = Object.assign(document.createElement('p'), {
      className: 'f-err',
      textContent: msg
    });
    p.style.cssText = 'color:#c0392b;font-size:.72rem;font-weight:700;margin-top:4px;padding-left:0';
    wrap.insertAdjacentElement('afterend', p);
  }
}

function clearErrors() {
  document.querySelectorAll('.err').forEach(el => el.classList.remove('err'));
  document.querySelectorAll('.f-err').forEach(el => el.remove());
}

/* ============================================================
   HELPERS UI
   ============================================================ */
function setLoading(on) {
  btnSubmit.disabled = on;
  btnText.hidden     = on;
  btnLoader.hidden   = !on;
}

function showMsg(text, type) {
  formMsg.textContent = text;
  formMsg.className   = `form-msg ${type}`;
  formMsg.hidden      = false;
  formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideMsg() { formMsg.hidden = true; }

const val            = id  => document.getElementById(id).value.trim();
const delay          = ms  => new Promise(r => setTimeout(r, ms));
const scriptConfigured = () => CONFIG.SCRIPT_URL !== "PEGAR_AQUI_URL_DE_GOOGLE_APPS_SCRIPT";

/* ============================================================
   GOOGLE APPS SCRIPT  –  código para el backend
   ============================================================

   1. Ir a script.google.com → Nuevo proyecto
   2. Pegar el siguiente código (reemplazar todo):
   3. Implementar > Nueva implementación > Aplicación web
      - Ejecutar como: Yo
      - Acceso: Cualquier persona
   4. Copiar la URL y pegarla en CONFIG.SCRIPT_URL arriba

   ──────────────────────────────────────────────────────────────
   function doPost(e) {
     const d = JSON.parse(e.postData.contents);
     const sheet = SpreadsheetApp.getActiveSpreadsheet()
       .getSheetByName('Registros')
       || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Registros');

     if (sheet.getLastRow() === 0) {
       sheet.appendRow(['Timestamp','Nombre','Teléfono','Email',
         'Fuente','Acepta Asesoría','Evento','Fecha','Hora','Ubicación']);
     }

     sheet.appendRow([
       d.timestamp, d.nombre, d.telefono, d.email,
       d.fuente, d.acepta_asesoria ? 'Sí' : 'No',
       d.evento, d.fecha_evento, d.hora_evento, d.ubicacion
     ]);

     return ContentService
       .createTextOutput(JSON.stringify({ success: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }

   function doGet(e) {
     if (e.parameter.action === 'cupos') {
       const sheet = SpreadsheetApp.getActiveSpreadsheet()
         .getSheetByName('Registros');
       const total = sheet ? Math.max(0, sheet.getLastRow() - 1) : 0;
       const avail = Math.max(0, 100 - total);
       return ContentService
         .createTextOutput(JSON.stringify({
           success: true,
           totalRegistrados: total,
           cuposDisponibles: avail,
           cupoLleno: avail <= 0
         }))
         .setMimeType(ContentService.MimeType.JSON);
     }
   }
   ──────────────────────────────────────────────────────────────
   ============================================================ */
