var params = new URLSearchParams(window.location.search);

const nombre = params.get('nombre');
const sala = params.get('sala');

const divUsuario = document.getElementById('divUsuarios');
const formEnviar = document.getElementById('formEnviar');
const txtMensaje = document.getElementById('txtMensaje');
const divChatbox = document.getElementById('divChatbox');

// Funciones para renderizar usuarios
function renderizarUsuarios(personas) { // [{},{},{}]
    console.log(personas);

    let html = `<li>
                    <a href="javascript:void(0)" class="active"> Chat de <span>${sala}</span></a>
               </li>`;


    for (let i = 0; i < personas.length; i++) {
        html += `<li>
        <a data-id="${personas[i].id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${personas[i].nombre}<small class="text-success">online</small></span></a>
          </li>`;
    }

    divUsuario.innerHTML = html;
}

function renderizarMensajes(mensaje, yo) {

    const fecha = new Date(mensaje.fecha);
    const hora = fecha.getHours() + ': ' + fecha.getMinutes();

    let adminClass = 'info';

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    let mensajeLi = document.createElement('li');

    if (yo) {
        var html = `<li class="reverse animated fadeIn">
          <div class="chat-content">
              <h5>${mensaje.nombre}</h5>
              <div class="box bg-light-inverse">${mensaje.mensaje}</div>
          </div>
          <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
          <div class="chat-time">${hora}</div>
          </li>`;
    } else {
        var html = '<li class="animated fadeIn">';
        if (mensaje.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += `<div class="chat-content">
          <h5>${mensaje.nombre}</h5>
           <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
          </div>
          <div class="chat-time">${hora}</div>
          </li>`;
    }

    mensajeLi.innerHTML = html;
    divChatbox.appendChild(mensajeLi);
}


function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// Listeners
divUsuario.addEventListener('click', (e) => {
    let id = e.target.getAttribute('data-id');
    if (id) {
        console.log(id);
    }
});

formEnviar.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(txtMensaje.value.trim().length);
    if (txtMensaje.value.trim().length === 0) {
        return;
    }

    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.value
    }, function(mensaje) {
        txtMensaje.value = '';
        txtMensaje.focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });
});