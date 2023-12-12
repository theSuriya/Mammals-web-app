document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("uploadForm");
    const fileInput = document.getElementById("fileInput");
    const imagePreview = document.getElementById("imagePreview");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        fetch("/predict", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            displayPredictionResult(data);
        })
        .catch(error => console.error("Error:", error));
    });

    // Image preview on file input change
    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file) {
            displayImagePreview(file);
        }
    });
});

function displayPredictionResult(data) {
    const resultDiv = document.getElementById("predictionResult");
    resultDiv.innerHTML = `
        <p>Predicted: ${data.class}</p>
        <p>Confidence: ${data.confidence}%</p>
    `;
}

function displayImagePreview(file) {
    const imagePreview = document.getElementById("imagePreview");
    const imagePreviewContainer = document.getElementById("imagePreviewContainer");

    const reader = new FileReader();
    reader.onload = function (e) {
        imagePreview.src = e.target.result;
    };

    reader.readAsDataURL(file);
    imagePreviewContainer.style.display = "block";
}
