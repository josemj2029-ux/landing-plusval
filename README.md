# Plusval en Todo RD – Feria Inmobiliaria
Landing page de registro para el evento presencial.

---

## Estructura de archivos

```
Landin_Plusval/
├── index.html       ← Página principal
├── style.css        ← Todos los estilos (responsive incluido)
├── script.js        ← Validación, cupos, integración Google Sheets
├── README.md        ← Este archivo
└── assets/          ← Imágenes (crear carpeta y colocar aquí)
    ├── speaker1.png ← Foto "The Money Coach" (recortada cuadrada)
    ├── speaker2.png ← Foto "Hamid Yarjura" (recortada cuadrada)
    └── favicon.png  ← Ícono del sitio (opcional)
```

---

## Cómo subir a Vercel

1. Tener cuenta en [vercel.com](https://vercel.com).
2. Arrastar la carpeta `Landin_Plusval/` a la interfaz de Vercel, **o** usar CLI:
   ```bash
   npm i -g vercel
   cd Landin_Plusval
   vercel
   ```
3. Seguir los pasos del wizard (framework: **Other**, directorio: /).
4. Vercel detecta automáticamente HTML/CSS/JS estático.

---

## Conectar Google Sheets (registro de datos)

### Paso 1 – Crear el Google Apps Script

1. Abrir [script.google.com](https://script.google.com) → **Nuevo proyecto**.
2. Borrar el contenido por defecto y pegar el código que está al final de `script.js` (sección marcada con `GOOGLE APPS SCRIPT – CÓDIGO DE REFERENCIA`).
3. Guardar con un nombre como `Plusval Registro`.

### Paso 2 – Publicar como Web App

1. Clic en **Implementar → Nueva implementación**.
2. Tipo: **Aplicación web**.
3. Ejecutar como: **Yo (tu cuenta de Google)**.
4. Quién tiene acceso: **Cualquier persona**.
5. Clic en **Implementar** → copiar la **URL de la Web App**.

### Paso 3 – Configurar en el código

Abrir `script.js` y reemplazar la línea:

```js
SCRIPT_URL: "PEGAR_AQUI_URL_DE_GOOGLE_APPS_SCRIPT",
```

por la URL copiada:

```js
SCRIPT_URL: "https://script.google.com/macros/s/XXXXXXXXXX/exec",
```

### Paso 4 – Crear hoja de cálculo

El script crea automáticamente la hoja **"Registros"** con columnas:
`Timestamp | Nombre | Teléfono | Email | Fuente | Acepta Asesoría | Evento | Fecha Evento | Hora Evento | Ubicación`

---

## Agregar imágenes de speakers

1. Crear carpeta `assets/` dentro de `Landin_Plusval/`.
2. Guardar las fotos como `speaker1.png` (Money Coach) y `speaker2.png` (Hamid Yarjura).
3. Recomendar recorte cuadrado 400×400 px mínimo para que queden bien en el círculo.
4. Si no se colocan, el código muestra iniciales como placeholder automáticamente.

---

## Personalización rápida

| Qué cambiar | Dónde |
|---|---|
| Número de cupos máximo | `script.js` → `CONFIG.MAX_CUPOS` |
| Fecha / hora / lugar | `script.js` → `CONFIG.EVENTO` (y en `index.html` visualmente) |
| Colores | `style.css` → bloque `:root { --variables }` |
| Textos del formulario | `index.html` directamente |
| Simular cupos llenos | `script.js` → cambiar `totalRegistrados: 73` a `100` |

---

## Modo demo (sin Google Sheets)

Mientras `SCRIPT_URL` tenga el valor `"PEGAR_AQUI_URL_DE_GOOGLE_APPS_SCRIPT"`, el formulario simula el envío con un delay de 1.5s y muestra el mensaje de éxito sin guardar datos reales. Útil para revisar el diseño antes de conectar el backend.
