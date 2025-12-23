// REFERENCIAS AL DOM
const formulario = document.querySelector(".contenedorFormulario__formulario");
const inputs = {
    nombre: document.getElementById("nombre"),
    email: document.getElementById("correo"),
    password: document.getElementById("contrasenia"),
    confirmPassword: document.getElementById("conf_contrasenia"),
    terminos: document.getElementById("terminos"),
    recibir_correos: document.getElementById("correos_recibidos")
};
const contenedorError = document.getElementById("contenedor_error");
const btnRegistrar = document.getElementById("btn_registrar");
const strengthFill = document.getElementById("password_strength_fill");
const strengthLabel = document.getElementById("password_strength_label");

// MANEJO DE ERRORES
const mostrarError = (mensaje) => {
    contenedorError.textContent = mensaje;
    contenedorError.classList.add("contenedor_error");
};
const limpiarError = () => {
    contenedorError.textContent = "";
    contenedorError.classList.remove("contenedor_error");
};

// VALIDACIÓN FRONTEND
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

    return null;
};

// FUERZA DE CONTRASEÑA
const calcularFuerzaPassword = (password) => {
    let score = 0;
    if (!password) return score;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score; // 0 - 5
};

const actualizarBarraFuerza = (password) => {
    const score = calcularFuerzaPassword(password);
    const porcentaje = (score / 5) * 100;

    const colores = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#27ae60'];
    const etiquetas = ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Muy buena'];

    if (score === 0) {
        strengthFill.style.width = "0%";
        strengthFill.style.background = "transparent";
        strengthLabel.textContent = "";
        return;
    }

    strengthFill.style.width = porcentaje + "%";
    strengthFill.style.background = colores[score - 1];
    strengthLabel.textContent = etiquetas[score - 1];
    strengthLabel.style.color = colores[score - 1];
};

// TOGGLE MOSTRAR / OCULTAR CONTRASEÑA
const inicializarTogglesPassword = () => {
    const toggles = document.querySelectorAll(".toggle-pass");

    toggles.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);

            if (!input) return;

            const esPassword = input.type === "password";
            input.type = esPassword ? "text" : "password";
            btn.textContent = esPassword ? "Ocultar" : "Mostrar";
            btn.setAttribute("aria-pressed", String(esPassword));
        });
    });
};

// EVENTOS
// Barra de fuerza
inputs.password.addEventListener("input", (e) => {
    actualizarBarraFuerza(e.target.value);
});
// Inicializar toggles
inicializarTogglesPassword();
// Submit formulario
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    limpiarError();
    const error = validarFormulario();
    if (error) {
        mostrarError(error);
        return;
    }
    try {
        // Deshabilitar boton
        btnRegistrar.disabled = true;
        btnRegistrar.textContent = "Registrando...";
        const response = await fetch("/api/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre: inputs.nombre.value,
                email: inputs.email.value,
                password: inputs.password.value,
                recibir_correos: inputs.recibir_correos.checked
            })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.mensaje || "Error al registrar");
        }
        localStorage.setItem("usuarioSesion", JSON.stringify(data.usuario));
        window.location.href = "/index";

    } catch (err) {
        mostrarError(err.message);
    } finally {
        btnRegistrar.disabled = false;
        btnRegistrar.textContent = "Registrarse";
    }
});
