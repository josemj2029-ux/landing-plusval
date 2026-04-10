/* =========================================================
   PLUSVAL EN TODO RD – FERIA INMOBILIARIA
   script.js – Formulario + Cupos + Google Sheets
========================================================= */

const CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbykmrVEAKbAbW57lbd4SZdyflbSfXcAQ610W1A2t0Q958aFa9C7sO4oJ9hdZm1dHumr/exec",
  MAX_CUPOS: 100
};

/* ===== REFERENCIAS ===== */
const form = document.getElementById('registroForm');
const btnSubmit = document.getElementById('btnSubmit');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const formMsg = document.getElementById('formMsg');
const cuposText = document.getElementById('cuposText');

/* ===== ESTADO ===== */
let cuposOcupados = 27; // puedes cambiarlo manualmente

/* ===== MOSTRAR CUPOS ===== */
function actualizarCupos() {
  if (cuposText) {
    const disponibles = CONFIG.MAX_CUPOS - cuposOcupados;
    cuposText.innerText = `⚡ Cupos limitados - ${disponibles} de ${CONFIG.MAX_CUPOS} disponibles`;
  }
}

/* ===== MENSAJE ===== */
function mostrarMensaje(texto, tipo = "success") {
  if (!formMsg) {
    alert(texto);
    return;
  }

  formMsg.hidden = false;
  formMsg.innerText = texto;
  formMsg.className = `form-msg ${tipo}`;
}

/* ===== ENVIAR FORMULARIO ===== */
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const email = document.getElementById("email").value.trim();
  const fuente = document.getElementById("fuente").value;
  const acepta = document.getElementById("acepta").checked;

  if (!nombre || !telefono || !email || !fuente || !acepta) {
    mostrarMensaje("Completa todos los campos y acepta la confirmación.", "error");
    return;
  }

  /* LOADER */
  btnSubmit.disabled = true;
  btnText.hidden = true;
  btnLoader.hidden = false;

  fetch(CONFIG.SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre: nombre,
      telefono: telefono,
      email: email,
      fuente: fuente,
      acepta: acepta
    })
  })
    .then(() => {
      mostrarMensaje("Registro enviado correctamente.");

      /* SUMAR CUPO */
      cuposOcupados++;
      actualizarCupos();

      form.reset();
    })
    .catch(() => {
      mostrarMensaje("Error al enviar el formulario.", "error");
    })
    .finally(() => {
      btnSubmit.disabled = false;
      btnText.hidden = false;
      btnLoader.hidden = true;
    });
});

/* ===== INICIO ===== */
actualizarCupos();