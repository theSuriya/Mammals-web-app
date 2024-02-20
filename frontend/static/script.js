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

        // Set a timeout for the fetch request
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 120000); // 2 minutes timeout
        });

        // Use Promise.race to handle the fetch and timeout promises
        Promise.race([
            fetch("/predict", { method: "POST", body: formData }),
            timeoutPromise
        ])
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Hide loading icon and reset button text
                loadingIcon.style.display = "none";
                predictButton.innerHTML = 'Predict';

                displayPredictionResult(data);

                // Set a 100 seconds countdown timer on the predict button
                let countdown = 100;
                predictButton.disabled = true;

                const countdownInterval = setInterval(function () {
                    predictButton.innerHTML = `Wait for ${countdown--}`;

                    if (countdown < 0) {
                        clearInterval(countdownInterval);
                        predictButton.disabled = false;
                        predictButton.innerHTML = 'Predict';
                    }
                }, 1000);
            })
            .catch(error => {
                // Hide loading icon in case of error and reset button text
                loadingIcon.style.display = "none";
                predictButton.innerHTML = 'Predict';

                console.error("Error during fetch:", error);
            });
    });

    // Image preview on file input change
    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file) {
            displayImagePreview(file);
        }
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

    // Add event listeners for mouse enter and leave to change cursor style
    predictButton.addEventListener("mouseenter", function () {
        if (predictButton.disabled) {
            predictButton.style.cursor = "not-allowed";
        }
    });

    predictButton.addEventListener("mouseleave", function () {
        if (predictButton.disabled) {
            predictButton.style.cursor = "not-allowed";
        } else {
            predictButton.style.cursor = "pointer";
        }
    });
});
