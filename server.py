from wsgiref.simple_server import make_server
from app import application

server = make_server("localhost", 8000, application)
print("Servidor ejecutándose en http://localhost:8000")
server.serve_forever()