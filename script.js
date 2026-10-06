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

// Elementos de la lista
const listaContactos = document.getElementById("listaContactos");
const listaVacia = document.getElementById("listaVacia");
const contador = document.getElementById("contador");
const buscador = document.getElementById("buscador");

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
  mostrarContactos();

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

// ===== Listar contactos =====

// Crea un elemento HTML con una clase y un texto
function crearElemento(etiqueta, clase, texto) {
  let elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = texto;
  return elemento;
}

// Crea la tarjeta HTML de un contacto
function crearTarjeta(contacto) {
  let tarjeta = crearElemento("article", "contacto", "");
  tarjeta.dataset.id = contacto.id;

  let avatar = crearElemento("div", "avatar", contacto.nombre.charAt(0).toUpperCase());

  let datos = crearElemento("div", "contacto-datos", "");
  datos.appendChild(crearElemento("h3", "contacto-nombre", contacto.nombre));
  datos.appendChild(crearElemento("p", "contacto-dato", "📞 " + contacto.telefono));
  datos.appendChild(crearElemento("p", "contacto-dato", "✉️ " + contacto.correo));

  tarjeta.appendChild(avatar);
  tarjeta.appendChild(datos);
  return tarjeta;
}

// Muestra en pantalla los contactos ordenados por nombre,
// filtrados según el texto del buscador
function mostrarContactos() {
  let filtro = buscador.value.trim().toLowerCase();

  let visibles = contactos
    .filter(function (c) {
      return (
        c.nombre.toLowerCase().includes(filtro) ||
        c.telefono.includes(filtro) ||
        c.correo.includes(filtro)
      );
    })
    .sort(function (a, b) {
      return a.nombre.localeCompare(b.nombre, "es");
    });

  // Se borra la lista anterior y se vuelve a dibujar
  listaContactos.innerHTML = "";
  visibles.forEach(function (contacto) {
    listaContactos.appendChild(crearTarjeta(contacto));
  });

  contador.textContent = contactos.length;

  // Mensaje cuando no hay nada que mostrar
  if (contactos.length === 0) {
    listaVacia.textContent = "Aún no tienes contactos registrados.";
    listaVacia.hidden = false;
  } else if (visibles.length === 0) {
    listaVacia.textContent = "No se encontraron contactos que coincidan con la búsqueda.";
    listaVacia.hidden = false;
  } else {
    listaVacia.hidden = true;
  }
}

// La lista se filtra mientras el usuario escribe en el buscador
buscador.addEventListener("input", mostrarContactos);

// Se muestra la lista al cargar la página
mostrarContactos();
