from db.db import crear_usuario, leer_usuario
import os, json
import mimetypes
from urllib.parse import parse_qs

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
STATIC_DIR = os.path.join(BASE_DIR, "static")

def response_json(start_response, status, data):
    response_body = json.dumps(data).encode("utf-8")
    start_response(status, [
        ("Content-Type", "application/json"),
        ("Content-Length", str(len(response_body)))
    ])
    return [response_body]

def handle_api(environ, start_response):
    path = environ.get("PATH_INFO", "/")
    method = environ.get("REQUEST_METHOD")

    if path == "/api/registro" and method == "POST":
        try:
            content_length = int(environ.get('CONTENT_LENGTH', 0))
            if content_length == 0:
                return response_json(start_response, "400 Bad Request", {"mensaje": "Cuerpo vacío"})
            body = environ['wsgi.input'].read(content_length).decode('utf-8')
            data = json.loads(body)

            nombre = data.get("nombre")
            email = data.get("email")
            password = data.get("password")
            recibir_correos = data.get("recibir_correos", False)

            usuario_existente = leer_usuario(email) 
            
            if usuario_existente:
                return response_json(start_response, "409 Conflict", {"mensaje": "El correo ya está registrado"})
            
            """ EN CASO VALIDACION SALIO BIEN """
            datos_usuario = {
                "nombre": nombre,
                "email": email
            }
            crear_usuario(email, nombre, password, recibir_correos)

            return response_json(start_response, "201 Created", {
                "mensaje": "Usuario registrado exitosamente",
                "usuario": datos_usuario  #
            })
        except Exception as e:
            print(f"Error interno: {e}")
            return response_json(start_response, "500 Internal Server Error", {"mensaje": "Error interno del servidor"})
    if path == "/api/login" and method == "POST":
        try:
            content_length = int(environ.get('CONTENT_LENGTH', 0))
            request_body = environ['wsgi.input'].read(content_length).decode('utf-8')
            data = json.loads(request_body)
            email = data.get("email")
            password = data.get("password")
            usuario = leer_usuario(email)

            if usuario is None:
                return response_json(start_response, "401 Unauthorized", {
                    "mensaje": "Correo o contraseña incorrectos"
                })

            if usuario and usuario['contrasenia'] == password:
                return response_json(start_response, "200 OK", {
                    "mensaje": "Inicio de sesión exitoso",
                    "usuario": {
                        "nombre": usuario['nombre'],
                        "email": usuario['gmail']
                    }
                })
            else:
                return response_json(start_response, "401 Unauthorized", {
                    "mensaje": "Correo o contraseña incorrectos"
                })
        except Exception as e:
            return response_json(start_response, "500 Internal Error", {"mensaje": str(e)})
        
    return response_json(start_response, "404 Not Found", {"mensaje": "API no encontrado"})

def serve_html(filename, start_response):
    path = os.path.join(TEMPLATES_DIR, filename)
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    start_response("200 OK", [("Content-Type", "text/html; charset=utf-8")])
    return [html.encode("utf-8")]


def serve_static(path, start_response):
    file_path = os.path.join(STATIC_DIR, path.replace("/static/", ""))
    if not os.path.exists(file_path):
        return None
    content_type, _ = mimetypes.guess_type(file_path)
    start_response("200 OK", [("Content-Type", content_type or "application/octet-stream")])
    with open(file_path, "rb") as f:
        return [f.read()]


def application(environ, start_response):
    path = environ.get("PATH_INFO", "/")

    if path.startswith("/api/"):
        return handle_api(environ, start_response)

    routes = {
        "/": "index.html",
        "/index": "index.html",
        "/habilidades": "habilidades.html",
        "/personaje": "personaje.html",
        "/inicio_sesion": "inicio_sesion.html",
        "/registrarse": "registrarse.html",
    }

    if path in routes:
        response = serve_html(routes[path], start_response)
        if response:
            return response

    if path.startswith("/static/"):
        response = serve_static(path, start_response)
        if response:
            return response

    start_response("404 Not Found", [("Content-Type", "text/plain")])
    return [b"404 - Not Found"]
