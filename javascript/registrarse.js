const formulario = document.querySelector(".contenedorFormulario__formulario");

const inputs = {
    nombre: document.getElementById("nombre"),
    email: document.getElementById("correo"),
    password: document.getElementById("contrasenia"),
    confirmPassword: document.getElementById("conf_contrasenia"),
    terminos: document.getElementById("terminos"),
};

const contenedor_error = document.getElementById("contenedor_error");

const mostrarError = (mensaje) => {
    contenedor_error.textContent = mensaje;
    contenedor_error.classList.add("contenedor_error");
};

const limpiarError = () => {
    contenedor_error.textContent = "";
    contenedor_error.classList.remove("contenedor_error");
};

const validarFormulario = () => {
    const nombre = inputs.nombre.value.trim();
    const email = inputs.email.value.trim();
    const password = inputs.password.value.trim();
    const confirmPassword = inputs.confirmPassword.value.trim();

    const regexEmail = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

    if (!nombre) return "El nombre no puede estar vacío.";
    if (!email) return "El email no puede estar vacío.";
    if (!regexEmail.test(email)) return "El formato del email no es válido.";
    if (!password) return "La contraseña no puede estar vacía.";
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!confirmPassword) return "Debe confirmar la contraseña.";
    if (password !== confirmPassword) return "Las contraseñas no coinciden.";
    if (!inputs.terminos.checked) return "Debe aceptar los términos y condiciones.";
    /*
    Aqui vendria validacion de que no se repita el email en la db
    if (!validacion) return "Este email ya estaba registrado";
    */
    return null;
};

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarError();
    const error = validarFormulario();
    if (error) {
        mostrarError(error);
        return;
    }
    console.log("Formulario válido. Enviando...");
});
