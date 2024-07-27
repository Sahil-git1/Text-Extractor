# Image Text Extractor

![Project Logo](https://img.icons8.com/color/144/000000/image.png)

This project provides a web application for extracting text from images using OCR (Optical Character Recognition). Built with Flask and Keras OCR, the application allows users to upload images and receive the extracted text.

## Features

- Upload and preview images.
- Extract text from images using Keras OCR.
- Display extracted text with a sleek UI.
- Space-themed design with responsive layout.

![Features](https://img.icons8.com/color/600/000000/feature-list.png)

## Technology Stack

- **Backend**: Flask
- **OCR**: Keras OCR
- **Frontend**: HTML, CSS, JavaScript

## Screenshots

### Home Page

![Home Page](https://img.icons8.com/color/600/000000/home-page.png)

### File Upload and Preview

![File Upload](https://img.icons8.com/color/600/000000/file-upload.png)

### Extracted Text Result

![Extracted Text](https://img.icons8.com/color/600/000000/extracted-text.png)

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/image-text-extractor.git
    ```

2. **Navigate to the project directory:**

    ```sh
    cd image-text-extractor
    ```

3. **Install the required packages:**

    ```sh
    pip install -r requirements.txt
    ```

4. **Run the Flask application:**

    ```sh
    python app.py
    ```

    The application will be available at `http://127.0.0.1:5000/`.

## Usage

1. **Open your browser** and go to `http://127.0.0.1:5000/`.
2. **Upload an image** by dragging it into the upload area or selecting it from your file system.
3. **Preview the image** and click on "Extract Text" to process it.
4. **View the extracted text** displayed on the result area.

## Code Overview

### `app.py`

Handles the Flask web server, file uploads, and text extraction.

```python
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
