from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from cipher import encrypt, decrypt

app = Flask(__name__, static_folder='public')
CORS(app)


@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)


@app.route('/api/caesar', methods=['POST'])
def caesar_api():
    try:
        data = request.get_json()

        text = data.get('text')
        shift = data.get('shift')
        encrypt_mode = data.get('encrypt', True)

        if not text:
            return jsonify({'error': 'Text is required'}), 400

        if shift is None:
            return jsonify({'error': 'Shift value is required'}), 400

        shift = int(shift)

        result = encrypt(text, shift) if encrypt_mode else decrypt(text, shift)
        return jsonify({'result': result})

    except ValueError as e:
        return jsonify({'error': str(e)}), 400

    except Exception:
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(debug=True)
