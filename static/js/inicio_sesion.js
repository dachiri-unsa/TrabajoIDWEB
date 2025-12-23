const formulario = document.querySelector(".contenedorFormulario__formulario");
const inputEmail = document.getElementById("correo");
const inputContra = document.getElementById("contrasenia");

// Para mostrar el error si algo falla o se envio correctamente
const contenedor_error = document.getElementById("contenedor_error");
const mostrarError = (mensaje) => {
    contenedor_error.classList.add("contenedor_error")
    contenedor_error.textContent = mensaje;
}

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = inputEmail.value.trim();
    const contrasenia = inputContra.value.trim();
    // Para limpiar error
    contenedor_error.textContent = "";
    contenedor_error.classList.remove("contenedor_error");
    try {
        if (email === "" || contrasenia === "") {
            throw new Error("El email y contraseña no pueden estar vacíos.");
        }
        const regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            throw new Error("El formato del email tiene que ser válido.");
        }
        // --- VALIDACION BACKEND ---
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: contrasenia
            })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.mensaje || "Error al iniciar sesión");
        }
        localStorage.setItem("usuarioSesion", JSON.stringify(data.usuario));
        window.location.href = "/index";

    }
    catch (error) {
        mostrarError(error.message);
    }
});
