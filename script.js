// Agenda de Contactos
// Lista donde se guardan los contactos registrados.
// Cada contacto tiene: id, nombre, telefono y correo.
let contactos = [];

// Expresiones regulares para las validaciones
// Nombre: solo letras (incluye tildes y ñ) y espacios
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
// Teléfono: puede empezar con +, luego entre 7 y 15 dígitos
const REGEX_TELEFONO = /^\+?\d{7,15}$/;
// Correo: texto@dominio.extension
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

// Elementos del formulario
const formContacto = document.getElementById("formContacto");
const campoNombre = document.getElementById("nombre");
const campoTelefono = document.getElementById("telefono");
const campoCorreo = document.getElementById("correo");
const mensaje = document.getElementById("mensaje");

// Muestra un mensaje de éxito o error debajo del formulario
function mostrarMensaje(texto, tipo) {
  let icono = tipo === "exito" ? "✔ " : "✖ ";
  mensaje.innerText = icono + texto;
  mensaje.className = "mensaje " + tipo;
}

// Marca en rojo el campo con error y lo selecciona
function marcarError(campo, texto) {
  campo.classList.add("campo-error");
  campo.focus();
  mostrarMensaje(texto, "error");
}

// Quita las marcas de error de todos los campos
function limpiarErrores() {
  [campoNombre, campoTelefono, campoCorreo].forEach(function (campo) {
    campo.classList.remove("campo-error");
  });
}

// Valida los datos del formulario.
// Devuelve true si todo es correcto, o false si encontró un error.
function validarContacto(nombre, telefono, correo) {
  if (nombre === "") {
    marcarError(campoNombre, "Debe ingresar el nombre.");
    return false;
  }
  if (nombre.length < 3) {
    marcarError(campoNombre, "El nombre debe tener al menos 3 caracteres.");
    return false;
  }
  if (!REGEX_NOMBRE.test(nombre)) {
    marcarError(campoNombre, "El nombre solo puede contener letras y espacios.");
    return false;
  }
  if (telefono === "") {
    marcarError(campoTelefono, "Debe ingresar el teléfono.");
    return false;
  }
  if (!REGEX_TELEFONO.test(telefono)) {
    marcarError(campoTelefono, "El teléfono debe tener entre 7 y 15 dígitos, sin letras.");
    return false;
  }
  if (contactos.some(function (c) { return c.telefono === telefono; })) {
    marcarError(campoTelefono, "Ya existe un contacto con ese teléfono.");
    return false;
  }
  if (correo === "") {
    marcarError(campoCorreo, "Debe ingresar el correo.");
    return false;
  }
  if (!REGEX_CORREO.test(correo)) {
    marcarError(campoCorreo, "El formato del correo no es válido. Ejemplo: maria@gmail.com");
    return false;
  }
  return true;
}

// Registra un nuevo contacto al enviar el formulario
formContacto.addEventListener("submit", function (evento) {
  // Evita que la página se recargue al enviar el formulario
  evento.preventDefault();
  limpiarErrores();

  let nombre = campoNombre.value.trim();
  // Se quitan los espacios del teléfono para aceptar "987 654 321"
  let telefono = campoTelefono.value.replace(/\s/g, "");
  let correo = campoCorreo.value.trim().toLowerCase();

  if (!validarContacto(nombre, telefono, correo)) {
    return;
  }

  // Se crea el contacto con un id único basado en la fecha y hora
  let contacto = {
    id: Date.now(),
    nombre: nombre,
    telefono: telefono,
    correo: correo,
  };
  contactos.push(contacto);

  mostrarMensaje("Contacto " + nombre + " agregado correctamente.", "exito");
  formContacto.reset();
  campoNombre.focus();
});

// Al escribir en un campo con error, se quita la marca roja
[campoNombre, campoTelefono, campoCorreo].forEach(function (campo) {
  campo.addEventListener("input", function () {
    campo.classList.remove("campo-error");
  });
});
