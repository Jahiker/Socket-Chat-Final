var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

//Referencias de Jquery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
var SalaChat = $('#SalaChat');

//Funcion para renderizar la sala de chat
function renderizarSala() {
    var html = '';

    html += '<h3 class="box-title">Sala de chat <small>' + params.get('sala') + '</small></h3>';

    SalaChat.html(html);
}

//Funciones para renderizar ususarios
function renderizarUsuarios(personas) {

    console.log(personas);

    var html = '';

    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {

        html += '<li>';
        html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';

    }

    divUsuarios.html(html);

}

function renderizarMensajes(mensaje, yo) {

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {

        html += '<li class="reverse">';
        html += '   <div class="chat-content">';
        html += '       <h5>' + mensaje.nombre + '</h5>';
        html += '       <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '   </div>';
        html += '   <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '   <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    } else {

        html += '<li class="animated fadeIn">';
        if (mensaje.nombre != 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '        <div class="chat-content">';
        html += '            <h5>' + mensaje.nombre + '</h5>';
        html += '            <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '        </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    }

    divChatbox.append(html);

}

function enviarNotificacion() {

    if (!("Notification" in window)) { //Verificar si el navegador soporta notificaciones

        console.log("El navegador no cuenta con soporte para Notificacione");

    } else if (Notification.permission === "granted") { //Lanzar la notificacion si el permiso de notificaciones esta garantizado o activado

        var notificacion = new Notification("Tienes un Nuevo Mensaje");

    } else if (Notification.permission !== "denied") { //Solicitar permiso de notificaciones si no es ha concedido aun

        Notification.requestPermission(function(permission) {

            if (Notification.permission === "granted") {

                var notificacion = new Notification("Notificaciones Activadas");

            }

        });

    }

}

//Scroll automatico para mostrar el ultimo mensaje
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

//Listeners de Jquery
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }
});

formEnviar.on('submit', function(e) {
    e.preventDefault();
    console.log(txtMensaje.val());

    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    //Enviar información
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {

        console.log('respuesta server: ', mensaje);
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();

    });

});