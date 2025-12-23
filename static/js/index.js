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
