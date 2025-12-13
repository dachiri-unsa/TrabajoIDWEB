const formulario = document.querySelector(".contenedorFormulario__formulario");
const inputEmail = document.getElementById("correo");
const inputContra = document.getElementById("contrasenia");

// Para mostrar el error si algo falla o se envio correctamente
const contenedor_error = document.getElementById("contenedor_error");
const mostrarError = (mensaje) => {
    contenedor_error.classList.add("contenedor_error")
    contenedor_error.textContent = mensaje;
}

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = inputEmail.value.trim();
    const contrasenia = inputContra.value.trim();
    try {
        if (email === "" || contrasenia === "") {
            throw new Error("El email y contraseña no pueden estar vacios.");
        }
        const regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            throw new Error("El formato del email tiene que ser valido.");
        }
        /*
        Aqui vendria la validacion del email y contraseña
        if (!validacion) {
            throw new Error("Datos no validos, verifique su email y contraseña.");
        }
        */
    }
    catch (error) {
        mostrarError(error.message);
    }
})
