from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import jwt
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Configuración
SECRET_KEY = os.environ.get('SECRET_KEY', 'tu_clave_secreta_jwt_12345')
DATABASE = 'eventos.db'

# Inicializar base de datos
def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS eventos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            fecha TEXT NOT NULL,
            lugar TEXT NOT NULL,
            capacidad INTEGER NOT NULL,
            precio REAL NOT NULL,
            entradas_vendidas INTEGER DEFAULT 0,
            activo INTEGER DEFAULT 1,
            fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Middleware para verificar JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'mensaje': 'Token no proporcionado'}), 401
        
        try:
            # Extraer token (formato: "Bearer <token>")
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            
            # Verificar token
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            request.user_id = data.get('id')
            request.user_rol = data.get('role')
            
        except jwt.ExpiredSignatureError:
            return jsonify({'mensaje': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'mensaje': 'Token inválido'}), 401
        
        return f(*args, **kwargs)
    
    return decorated

# Middleware para verificar si es administrador
def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.user_rol != 'admin':
            return jsonify({'mensaje': 'Acceso denegado. Se requiere rol de administrador'}), 403
        return f(*args, **kwargs)
    return decorated

# Ruta de salud del servicio
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'servicio': 'Eventos',
        'estado': 'activo',
        'timestamp': datetime.now().isoformat()
    }), 200

# Obtener todos los eventos (público)
@app.route('/eventos', methods=['GET'])
def obtener_eventos():
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Solo eventos activos
        cursor.execute('''
            SELECT id, nombre, fecha, lugar, capacidad, precio, entradas_vendidas,
                   (capacidad - entradas_vendidas) as entradas_disponibles
            FROM eventos 
            WHERE activo = 1
            ORDER BY fecha ASC
        ''')
        
        eventos = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({
            'eventos': eventos,
            'total': len(eventos)
        }), 200
        
    except Exception as e:
        return jsonify({'mensaje': f'Error al obtener eventos: {str(e)}'}), 500

# Obtener un evento específico
@app.route('/eventos/<int:evento_id>', methods=['GET'])
def obtener_evento(evento_id):
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, nombre, fecha, lugar, capacidad, precio, entradas_vendidas,
                   (capacidad - entradas_vendidas) as entradas_disponibles
            FROM eventos 
            WHERE id = ? AND activo = 1
        ''', (evento_id,))
        
        evento = cursor.fetchone()
        conn.close()
        
        if evento:
            return jsonify(dict(evento)), 200
        else:
            return jsonify({'mensaje': 'Evento no encontrado'}), 404
            
    except Exception as e:
        return jsonify({'mensaje': f'Error al obtener evento: {str(e)}'}), 500

# Crear evento (solo administradores)
@app.route('/eventos', methods=['POST'])
@token_required
@admin_required
def crear_evento():
    try:
        datos = request.get_json()
        
        # Validar campos requeridos
        campos_requeridos = ['nombre', 'fecha', 'lugar', 'capacidad', 'precio']
        for campo in campos_requeridos:
            if campo not in datos:
                return jsonify({'mensaje': f'Campo requerido: {campo}'}), 400
        
        # Validar tipos de datos
        if not isinstance(datos['capacidad'], int) or datos['capacidad'] <= 0:
            return jsonify({'mensaje': 'Capacidad debe ser un número entero positivo'}), 400
        
        if not isinstance(datos['precio'], (int, float)) or datos['precio'] < 0:
            return jsonify({'mensaje': 'Precio debe ser un número positivo'}), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO eventos (nombre, fecha, lugar, capacidad, precio)
            VALUES (?, ?, ?, ?, ?)
        ''', (datos['nombre'], datos['fecha'], datos['lugar'], 
              datos['capacidad'], datos['precio']))
        
        evento_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'mensaje': 'Evento creado exitosamente',
            'evento_id': evento_id
        }), 201
        
    except Exception as e:
        return jsonify({'mensaje': f'Error al crear evento: {str(e)}'}), 500

# Actualizar evento (solo administradores)
@app.route('/eventos/<int:evento_id>', methods=['PUT'])
@token_required
@admin_required
def actualizar_evento(evento_id):
    try:
        datos = request.get_json()
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Verificar si el evento existe
        cursor.execute('SELECT id FROM eventos WHERE id = ?', (evento_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({'mensaje': 'Evento no encontrado'}), 404
        
        # Construir query dinámica
        campos_actualizables = ['nombre', 'fecha', 'lugar', 'capacidad', 'precio']
        campos_a_actualizar = []
        valores = []
        
        for campo in campos_actualizables:
            if campo in datos:
                campos_a_actualizar.append(f'{campo} = ?')
                valores.append(datos[campo])
        
        if not campos_a_actualizar:
            conn.close()
            return jsonify({'mensaje': 'No hay campos para actualizar'}), 400
        
        valores.append(evento_id)
        query = f"UPDATE eventos SET {', '.join(campos_a_actualizar)} WHERE id = ?"
        
        cursor.execute(query, valores)
        conn.commit()
        conn.close()
        
        return jsonify({'mensaje': 'Evento actualizado exitosamente'}), 200
        
    except Exception as e:
        return jsonify({'mensaje': f'Error al actualizar evento: {str(e)}'}), 500

# Eliminar evento (solo administradores) - Eliminación lógica
@app.route('/eventos/<int:evento_id>', methods=['DELETE'])
@token_required
@admin_required
def eliminar_evento(evento_id):
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('SELECT id FROM eventos WHERE id = ?', (evento_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({'mensaje': 'Evento no encontrado'}), 404
        
        # Eliminación lógica
        cursor.execute('UPDATE eventos SET activo = 0 WHERE id = ?', (evento_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'mensaje': 'Evento eliminado exitosamente'}), 200
        
    except Exception as e:
        return jsonify({'mensaje': f'Error al eliminar evento: {str(e)}'}), 500

# Verificar disponibilidad y reservar entradas (para el servicio de Compras)
@app.route('/eventos/<int:evento_id>/verificar-disponibilidad', methods=['POST'])
@token_required
def verificar_disponibilidad(evento_id):
    try:
        datos = request.get_json()
        cantidad = datos.get('cantidad', 1)
        
        if not isinstance(cantidad, int) or cantidad <= 0:
            return jsonify({'mensaje': 'Cantidad debe ser un número entero positivo'}), 400
        
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, nombre, capacidad, entradas_vendidas, precio
            FROM eventos 
            WHERE id = ? AND activo = 1
        ''', (evento_id,))
        
        evento = cursor.fetchone()
        
        if not evento:
            conn.close()
            return jsonify({'mensaje': 'Evento no encontrado'}), 404
        
        entradas_disponibles = evento['capacidad'] - evento['entradas_vendidas']
        
        if entradas_disponibles < cantidad:
            conn.close()
            return jsonify({
                'disponible': False,
                'mensaje': 'No hay suficientes entradas disponibles',
                'entradas_disponibles': entradas_disponibles
            }), 200
        
        conn.close()
        
        return jsonify({
            'disponible': True,
            'evento_id': evento['id'],
            'nombre_evento': evento['nombre'],
            'precio_unitario': evento['precio'],
            'precio_total': evento['precio'] * cantidad,
            'cantidad': cantidad
        }), 200
        
    except Exception as e:
        return jsonify({'mensaje': f'Error al verificar disponibilidad: {str(e)}'}), 500

# Actualizar entradas vendidas (llamado por el servicio de Compras)
@app.route('/eventos/<int:evento_id>/actualizar-vendidas', methods=['POST'])
@token_required
def actualizar_entradas_vendidas(evento_id):
    try:
        datos = request.get_json()
        cantidad = datos.get('cantidad', 1)
        
        if not isinstance(cantidad, int) or cantidad <= 0:
            return jsonify({'mensaje': 'Cantidad debe ser un número entero positivo'}), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Verificar disponibilidad
        cursor.execute('''
            SELECT capacidad, entradas_vendidas 
            FROM eventos 
            WHERE id = ? AND activo = 1
        ''', (evento_id,))
        
        evento = cursor.fetchone()
        
        if not evento:
            conn.close()
            return jsonify({'mensaje': 'Evento no encontrado'}), 404
        
        capacidad, vendidas = evento
        
        if (vendidas + cantidad) > capacidad:
            conn.close()
            return jsonify({'mensaje': 'No hay suficientes entradas disponibles'}), 400
        
        # Actualizar entradas vendidas
        cursor.execute('''
            UPDATE eventos 
            SET entradas_vendidas = entradas_vendidas + ? 
            WHERE id = ?
        ''', (cantidad, evento_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'mensaje': 'Entradas actualizadas exitosamente',
            'evento_id': evento_id,
            'cantidad_vendida': cantidad
        }), 200
        
    except Exception as e:
        return jsonify({'mensaje': f'Error al actualizar entradas: {str(e)}'}), 500

if __name__ == '__main__':
    init_db()
    print("Microservicio de Eventos iniciado en el puerto 5002")
    app.run(host='0.0.0.0', port=5002, debug=True)