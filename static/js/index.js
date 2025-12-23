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


// VERIFICAR SESION Y AJUSTAR INTERFAZ
document.addEventListener("DOMContentLoaded", async () => {
    const sesion = localStorage.getItem("usuarioSesion");
    
    if (sesion) {
        const usuario = JSON.parse(sesion);

        // --- VALIDACIÓN ADICIONAL (Opcional pero recomendada) ---
        try {
            const response = await fetch(`/api/verificar?email=${usuario.email}`);
            if (!response.ok) {
                // Si el servidor dice que el usuario ya no existe
                localStorage.removeItem("usuarioSesion");
                window.location.reload();
                return;
            }
            
            // Si existe, actualizamos la UI
            document.querySelectorAll(".auth-invitado").forEach(el => el.style.display = "none");
            document.querySelectorAll(".auth-usuario").forEach(el => el.style.display = "block");
            document.getElementById("nombre_usuario").textContent = usuario.nombre;

        } catch (error) {
            console.error("Error validando sesión");
        }
    }
});