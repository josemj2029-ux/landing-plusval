/* =========================================================
   PLUSVAL EN TODO RD – FERIA INMOBILIARIA
   script.js – Formulario + Cupos + Google Sheets
========================================================= */

const CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbykmrVEAKbAbW57lbd4SZdyflbSfXcAQ610W1A2t0Q958aFa9C7sO4oJ9hdZm1dHumr/exec",
  MAX_CUPOS: 100
};

const form = document.getElementById('registroForm');
const btnSubmit = document.getElementById('btnSubmit');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const formMsg = document.getElementById('formMsg');
const cuposText = document.getElementById('cuposText');

let cuposOcupados = 27;

function actualizarCupos() {
  if (cuposText) {
    const disponibles = CONFIG.MAX_CUPOS - cuposOcupados;
    cuposText.innerText = `⚡ Cupos limitados - ${disponibles} de ${CONFIG.MAX_CUPOS} disponibles`;
  }
}

function mostrarMensaje(texto, tipo = "success") {
  if (!formMsg) {
    alert(texto);
    return;
  }

  formMsg.hidden = false;
  formMsg.innerText = texto;
  formMsg.className = `form-msg ${tipo}`;
}

if (form) {
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

    btnSubmit.disabled = true;
    btnText.hidden = true;
    btnLoader.hidden = false;

    const formData = new FormData();
    formData.append("data", JSON.stringify({
      nombre: nombre,
      telefono: telefono,
      email: email,
      fuente: fuente
    }));

    fetch(CONFIG.SCRIPT_URL, {
      method: "POST",
      body: formData
    })
      .then(response => response.text())
      .then(() => {
        mostrarMensaje("Registro enviado correctamente.");
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
}

actualizarCupos();