document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("uploadForm");
    const fileInput = document.getElementById("fileInput");
    const predictButton = document.getElementById("predictButton");
    const loadingIcon = document.getElementById("loadingIcon");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Show loading icon and change button text
        loadingIcon.style.display = "inline-block";
        predictButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Predicting...';

        const formData = new FormData(form);
        fetch("/predict", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            // Hide loading icon and reset button text
            loadingIcon.style.display = "none";
            predictButton.innerHTML = 'Predict';

            displayPredictionResult(data);
        })
        .catch(error => {
            // Hide loading icon in case of error and reset button text
            loadingIcon.style.display = "none";
            predictButton.innerHTML = 'Predict';

            console.error("Error:", error);
        });
    });

    // Image preview on file input change
    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file) {
            displayImagePreview(file);
        }
    });

    predictButton.addEventListener("click", function () {
        // Disable the button to prevent multiple clicks during the countdown
        predictButton.disabled = true;

        // Start a countdown for 80 seconds
        let countdown = 80;
        predictButton.innerHTML = `Predicting in ${countdown} seconds...`;

        const countdownInterval = setInterval(() => {
            countdown--;
            predictButton.innerHTML = `Predicting in ${countdown} seconds...`;

            if (countdown === 0) {
                // Re-enable the button after the countdown is complete
                predictButton.disabled = false;
                predictButton.innerHTML = 'Predict';
                clearInterval(countdownInterval);
            }
        }, 1000);
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
