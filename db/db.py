import mysql.connector
# Usando variables de entorno
import os
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASS = os.getenv('DB_PASS', '1234')
DB_NAME = os.getenv('DB_NAME', 'BD_IDWEB_individual')

def get_conexion():
    conexion = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME
    )
    return conexion

def crear_usuario(gmail, nombre, contrasenia, recibir_correos):
    conn = get_conexion()
    cursor = conn.cursor()
    try:
        sql = """
            INSERT INTO usuario (gmail, nombre, contrasenia, recibir_correos)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(sql, (gmail, nombre, contrasenia, recibir_correos))
        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        print("Error al crear usuario:", e)
        return False
    finally:
        cursor.close()
        conn.close()

def leer_usuario(gmail):
    conn = get_conexion()
    cursor = conn.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM usuario WHERE gmail = %s"
        cursor.execute(sql, (gmail,))
        usuario = cursor.fetchone()

        if usuario is None:
            return None

        return usuario
    except Exception as e:
        print("Error al obtener usuario:", e)
        return None
    finally:
        cursor.close()
        conn.close()

def leer_usuarios():
    conn = get_conexion()
    cursor = conn.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM usuario"
        cursor.execute(sql)
        usuarios = cursor.fetchall()
        return usuarios
    except Exception as e:
        print("Error al obtener usuarios:", e)
        return []
    finally:
        cursor.close()
        conn.close()

def actualizar_usuario(gmail, nombre, contrasenia, recibir_correos):
    conn = get_conexion()
    cursor = conn.cursor()
    try:
        sql = """
            UPDATE usuario
            SET nombre = %s,
                contrasenia = %s,
                recibir_correos = %s
            WHERE gmail = %s
        """
        cursor.execute(sql, (nombre, contrasenia, recibir_correos, gmail))
        conn.commit()

        if cursor.rowcount == 0:
            raise Exception(f"No existe usuario con gmail {gmail}")

        return True
    except Exception as e:
        print("Error al actualizar usuario:", e)
        return False
    finally:
        cursor.close()
        conn.close()

def borrar_usuario(gmail):
    conn = get_conexion()
    cursor = conn.cursor()
    try:
        sql = "DELETE FROM usuario WHERE gmail = %s"
        cursor.execute(sql, (gmail,))
        conn.commit()

        if cursor.rowcount == 0:
            raise Exception(f"No existe usuario con gmail {gmail}")

        return True
    except Exception as e:
        print("Ocurrió un error al eliminar usuario:", e)
        return False
    finally:
        cursor.close()
        conn.close()
