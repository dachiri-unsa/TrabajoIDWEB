import os
import mimetypes

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
STATIC_DIR = os.path.join(BASE_DIR, "static")


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
