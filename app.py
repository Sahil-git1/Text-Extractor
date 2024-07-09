import os
from flask import Flask, request, jsonify, render_template, send_from_directory
import keras_ocr

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

pipeline = keras_ocr.pipeline.Pipeline()

def extract_text(image_path):
    images = [keras_ocr.tools.read(image_path)]
    prediction_groups = pipeline.recognize(images)
    extracted_text = []
    for predictions in prediction_groups:
        for word, box in predictions:
            extracted_text.append(word)
    return ' '.join(extracted_text)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/extract', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    if file:
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)
        extracted_text = extract_text(filename)
        return jsonify({'text': extracted_text})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)