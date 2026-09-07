// =====================================================
// KHADRWY - AI PLANT DOCTOR
// =====================================================

// ================= CONFIG =================

const API_URL = "http://127.0.0.1:8000/predict";


// ================= ELEMENTS =================

const imageInput = document.getElementById("imageInput");
const uploadArea = document.getElementById("uploadArea");

const previewContainer =
    document.getElementById("previewContainer");

const previewImage =
    document.getElementById("previewImage");

const removeButton =
    document.getElementById("removeButton");

const analyzeButton =
    document.getElementById("analyzeButton");

const loading =
    document.getElementById("loading");

const resultCard =
    document.getElementById("resultCard");

const resultPlant =
    document.getElementById("resultPlant");

const resultCondition =
    document.getElementById("resultCondition");

const resultConfidence =
    document.getElementById("resultConfidence");

const confidenceProgress =
    document.getElementById("confidenceProgress");

const confidenceLevel =
    document.getElementById("confidenceLevel");

const resultRecommendation =
    document.getElementById("resultRecommendation");

const resultIcon =
    document.getElementById("resultIcon");

const anotherButton =
    document.getElementById("anotherButton");


// ================= SELECT IMAGE =================

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    handleImage(file);
});


// ================= HANDLE IMAGE =================

function handleImage(file) {

    if (!file.type.startsWith("image/")) {

        alert("Please select a valid image.");

        return;
    }

    const imageURL =
        URL.createObjectURL(file);

    previewImage.src = imageURL;

    previewContainer.classList.add("show");

    analyzeButton.disabled = false;

    uploadArea.style.display = "none";

    resultCard.classList.remove("show");
}


// ================= REMOVE IMAGE =================

removeButton.addEventListener("click", function () {

    resetUploader();

});


function resetUploader() {

    imageInput.value = "";

    previewImage.src = "";

    previewContainer.classList.remove("show");

    uploadArea.style.display = "flex";

    analyzeButton.disabled = true;

    resultCard.classList.remove("show");

    confidenceProgress.style.width = "0%";
}


// ================= DRAG & DROP =================

uploadArea.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        uploadArea.classList.add("dragover");

    }
);


uploadArea.addEventListener(
    "dragleave",
    function () {

        uploadArea.classList.remove("dragover");

    }
);


uploadArea.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        uploadArea.classList.remove("dragover");

        const file =
            event.dataTransfer.files[0];

        if (!file) {
            return;
        }

        imageInput.files =
            event.dataTransfer.files;

        handleImage(file);

    }
);


// ================= ANALYZE =================

analyzeButton.addEventListener(
    "click",
    analyzePlant
);


async function analyzePlant() {

    const file = imageInput.files[0];

    if (!file) {

        alert("Please select an image first.");

        return;
    }

    console.log("Selected file:", file);
    console.log("API URL:", API_URL);

    analyzeButton.disabled = true;

    analyzeButton.style.display = "none";

    resultCard.classList.remove("show");

    loading.classList.add("show");


    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );


    try {

        console.log("Sending request...");

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


        console.log(
            "Response status:",
            response.status
        );


        const responseText =
            await response.text();


        console.log(
            "Response body:",
            responseText
        );
        alert("SERVER RESPONSE:\n\n" + responseText);
    
        if (!response.ok) {

            throw new Error(
                `Server Error ${response.status}: ${responseText}`
            );

        }


        const data =
            JSON.parse(responseText);


        console.log(
            "Prediction result:",
            data
        );


        displayResult(data);

    }


    catch (error) {

        console.error(
            "FULL ERROR:",
            error
        );


        alert(
            "Analysis failed!\n\n" +
            "Error: " +
            error.message
        );

    }


    finally {

        loading.classList.remove("show");

        analyzeButton.disabled = false;

        analyzeButton.style.display = "block";

    }
}


// ================= DISPLAY RESULT =================

function displayResult(data) {

    resultPlant.textContent =
        data.plant || "Unknown";


    resultCondition.textContent =
        data.condition || "Unknown";


    const confidence =
        Number(data.confidence) || 0;


    resultConfidence.textContent =
        confidence.toFixed(2) + "%";


    confidenceProgress.style.width =
        confidence + "%";


    confidenceLevel.textContent =
        data.confidence_level || "Unknown";


    resultRecommendation.textContent =
        data.recommendation ||
        "Monitor your plant regularly.";


    if (data.healthy) {

        resultIcon.textContent = "🌿";

    }

    else {

        resultIcon.textContent = "🩺";

    }


    resultCard.classList.add("show");


    setTimeout(function () {

        resultCard.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);
}


// ================= ANALYZE ANOTHER =================

anotherButton.addEventListener(
    "click",
    function () {

        resetUploader();

        document
            .getElementById("doctor")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);