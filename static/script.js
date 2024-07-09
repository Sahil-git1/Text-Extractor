document.addEventListener('DOMContentLoaded', (event) => {
    const fileInput = document.getElementById('file-input');
    const fileLabel = document.getElementById('file-label');
    const previewArea = document.getElementById('preview-area');
    const previewImage = document.getElementById('preview-image');
    const extractButton = document.getElementById('extract-button');
    const resultArea = document.getElementById('result-area');
    const extractedText = document.getElementById('extracted-text');
    const loading = document.getElementById('loading');

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewArea.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    extractButton.addEventListener('click', function() {
        const file = fileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            loading.style.display = 'block';
            resultArea.style.display = 'none';

            fetch('/extract', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                loading.style.display = 'none';
                resultArea.style.display = 'block';
                extractedText.textContent = data.text;
            })
            .catch(error => {
                console.error('Error:', error);
                loading.style.display = 'none';
                alert('An error occurred while extracting text.');
            });
        }
    });

    // Drag and drop functionality
    const uploadArea = document.getElementById('upload-area');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        uploadArea.classList.add('highlight');
    }

    function unhighlight(e) {
        uploadArea.classList.remove('highlight');
    }

    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];

        fileInput.files = dt.files;
        handleFiles(file);
    }

    function handleFiles(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewArea.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});