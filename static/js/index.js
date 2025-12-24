const botonesNoDisponibles = document.getElementsByClassName("apartados__lista-link--desactivado");
const contenedor = document.getElementById('notificaciones');

function mostrarNotificacion(mensaje, duracion = 3000) {
    const notif = document.createElement('div');
    notif.classList.add('notificacion');
    notif.textContent = mensaje;

    contenedor.appendChild(notif);

    setTimeout(() => {
        notif.classList.add('mostrar');
    }, 10);

    setTimeout(() => {
        notif.classList.remove('mostrar');
        setTimeout(() => contenedor.removeChild(notif), 500);
    }, duracion);
}

Array.from(botonesNoDisponibles).forEach(boton => {
    boton.addEventListener("click", (event) => {
        event.preventDefault();
        mostrarNotificacion('Esta opcion aún no está disponible.');
    });
});

const elementosInvitado = document.querySelectorAll(".auth-invitado");
const elementosUsuario = document.querySelectorAll(".auth-usuario");
const nombreDisplay = document.getElementById("nombre_usuario");
// VERIFICAR SESION Y AJUSTAR INTERFAZ
document.addEventListener("DOMContentLoaded", async () => {
    const sesion = localStorage.getItem("usuarioSesion");
    
    if (sesion) {
        const usuario = JSON.parse(sesion);
        // Ocultamos los botones de Login/Registro
        elementosInvitado.forEach(el => el.style.setProperty("display", "none", "important"));
        // Mostramos los de Usuario
        elementosUsuario.forEach(el => el.style.setProperty("display", "block", "important"));

        if (nombreDisplay) nombreDisplay.textContent = usuario.nombre;
    } 
    else {
        // Si no hay sesión, nos aseguramos de que se vean los botones de Login/Registro
        elementosInvitado.forEach(el => el.style.display = "block");
        elementosUsuario.forEach(el => el.style.display = "none");
    }

    const btnLogout = document.getElementById("btn_logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("usuarioSesion");
            window.location.href = "/index"; // Al recargar, el script volverá a ejecutarse y mostrará el login
        });
    }
});