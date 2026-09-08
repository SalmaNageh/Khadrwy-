// =====================================================
// KHADRWY - AI PLANT DOCTOR
// =====================================================


// =====================================================
// CONFIG
// =====================================================

const API_BASE_URL =
    "http://127.0.0.1:8000";

const API_URL =
    `${API_BASE_URL}/predict`;

const REGISTER_URL =
    `${API_BASE_URL}/register`;

const LOGIN_URL =
    `${API_BASE_URL}/login`;

const ME_URL =
    `${API_BASE_URL}/me`;

const TOKEN_KEY =
    "khadrwy_access_token";

const USERNAME_KEY =
    "khadrwy_username";


// =====================================================
// ELEMENTS - PLANT DOCTOR
// =====================================================

const imageInput =
    document.getElementById("imageInput");

const cameraInput =
    document.getElementById("cameraInput");

const uploadArea =
    document.getElementById("uploadArea");

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

const resultDetails =
    document.getElementById("resultDetails");

const anotherButton =
    document.getElementById("anotherButton");


// =====================================================
// ELEMENTS - AUTHENTICATION
// =====================================================

const authButtons =
    document.getElementById("authButtons");

const loginButton =
    document.getElementById("loginButton");

const signupButton =
    document.getElementById("signupButton");

const userMenu =
    document.getElementById("userMenu");

const userName =
    document.getElementById("userName");

const logoutButton =
    document.getElementById("logoutButton");

const authOverlay =
    document.getElementById("authOverlay");

const authClose =
    document.getElementById("authClose");

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const loginFormElement =
    document.getElementById("loginFormElement");

const signupFormElement =
    document.getElementById("signupFormElement");

const showSignup =
    document.getElementById("showSignup");

const showLogin =
    document.getElementById("showLogin");

const loginUsername =
    document.getElementById("loginUsername");

const loginPassword =
    document.getElementById("loginPassword");

const signupUsername =
    document.getElementById("signupUsername");

const signupEmail =
    document.getElementById("signupEmail");

const signupPassword =
    document.getElementById("signupPassword");

const loginMessage =
    document.getElementById("loginMessage");

const signupMessage =
    document.getElementById("signupMessage");


// =====================================================
// SELECTED FILE
// =====================================================

let selectedFile = null;


// =====================================================
// AUTHENTICATION STATE
// =====================================================

let accessToken =
    localStorage.getItem(TOKEN_KEY);

let loggedInUsername =
    localStorage.getItem(USERNAME_KEY);


// =====================================================
// AUTH - OPEN LOGIN
// =====================================================

function openLogin() {

    if (!authOverlay) {
        return;
    }

    authOverlay.style.display =
        "flex";

    if (loginForm) {
        loginForm.style.display =
            "block";
    }

    if (signupForm) {
        signupForm.style.display =
            "none";
    }

    clearAuthMessages();

    if (loginUsername) {
        setTimeout(
            function () {
                loginUsername.focus();
            },
            100
        );
    }
}


// =====================================================
// AUTH - OPEN SIGN UP
// =====================================================

function openSignup() {

    if (!authOverlay) {
        return;
    }

    authOverlay.style.display =
        "flex";

    if (loginForm) {
        loginForm.style.display =
            "none";
    }

    if (signupForm) {
        signupForm.style.display =
            "block";
    }

    clearAuthMessages();

    if (signupUsername) {
        setTimeout(
            function () {
                signupUsername.focus();
            },
            100
        );
    }
}


// =====================================================
// AUTH - CLOSE MODAL
// =====================================================

function closeAuth() {

    if (!authOverlay) {
        return;
    }

    authOverlay.style.display =
        "none";

    clearAuthMessages();
}


// =====================================================
// AUTH - CLEAR MESSAGES
// =====================================================

function clearAuthMessages() {

    if (loginMessage) {
        loginMessage.textContent = "";
    }

    if (signupMessage) {
        signupMessage.textContent = "";
    }
}


// =====================================================
// AUTH - MESSAGE
// =====================================================

function showLoginMessage(
    message,
    isError = true
) {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent =
        message;

    loginMessage.style.color =
        isError
            ? "#d9534f"
            : "#4d9b5a";
}


function showSignupMessage(
    message,
    isError = true
) {

    if (!signupMessage) {
        return;
    }

    signupMessage.textContent =
        message;

    signupMessage.style.color =
        isError
            ? "#d9534f"
            : "#4d9b5a";
}


// =====================================================
// AUTH - UPDATE NAVBAR
// =====================================================

function updateAuthUI() {

    if (
        accessToken &&
        loggedInUsername
    ) {

        if (authButtons) {

            authButtons.style.display =
                "none";
        }

        if (userMenu) {

            userMenu.style.display =
                "flex";
        }

        if (userName) {

            userName.textContent =
                `👤 ${loggedInUsername}`;
        }

    }

    else {

        if (authButtons) {

            authButtons.style.display =
                "flex";
        }

        if (userMenu) {

            userMenu.style.display =
                "none";
        }
    }
}


// =====================================================
// AUTH - SAVE LOGIN
// =====================================================

function saveLogin(
    token,
    username
) {

    accessToken =
        token;

    loggedInUsername =
        username;

    localStorage.setItem(
        TOKEN_KEY,
        token
    );

    localStorage.setItem(
        USERNAME_KEY,
        username
    );

    updateAuthUI();
}


// =====================================================
// AUTH - LOGOUT
// =====================================================

function logout() {

    accessToken = null;

    loggedInUsername = null;

    localStorage.removeItem(
        TOKEN_KEY
    );

    localStorage.removeItem(
        USERNAME_KEY
    );

    updateAuthUI();

    closeAuth();

    console.log(
        "User logged out."
    );
}


// =====================================================
// AUTH - VALIDATE TOKEN
// =====================================================

async function validateToken() {

    if (!accessToken) {

        updateAuthUI();

        return;
    }

    try {

        const response =
            await fetch(
                ME_URL,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            `Bearer ${accessToken}`
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Invalid token"
            );
        }


        const data =
            await response.json();


        loggedInUsername =
            data.username;


        localStorage.setItem(
            USERNAME_KEY,
            data.username
        );


        updateAuthUI();

    }

    catch (error) {

        console.warn(
            "Session expired or invalid."
        );

        accessToken = null;

        loggedInUsername = null;

        localStorage.removeItem(
            TOKEN_KEY
        );

        localStorage.removeItem(
            USERNAME_KEY
        );

        updateAuthUI();
    }
}


// =====================================================
// AUTH - LOGIN
// =====================================================

async function handleLogin(event) {

    event.preventDefault();

    clearAuthMessages();


    const username =
        loginUsername
            ? loginUsername.value.trim()
            : "";

    const password =
        loginPassword
            ? loginPassword.value
            : "";


    if (!username || !password) {

        showLoginMessage(
            "Please enter your username and password."
        );

        return;
    }


    const submitButton =
        loginFormElement
            ? loginFormElement.querySelector(
                ".auth-submit"
            )
            : null;


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Logging in...";
    }


    try {

        const response =
            await fetch(
                LOGIN_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );


        const contentType =
            response.headers.get(
                "content-type"
            );


        let data;


        if (
            contentType &&
            contentType.includes(
                "application/json"
            )
        ) {

            data =
                await response.json();

        }

        else {

            const text =
                await response.text();

            throw new Error(
                text ||
                `Server Error ${response.status}`
            );
        }


        console.log(
            "Login response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.detail ||
                data.message ||
                "Login failed."
            );
        }


        if (!data.access_token) {

            throw new Error(
                "No access token received from server."
            );
        }


        saveLogin(
            data.access_token,
            data.username || username
        );


        showLoginMessage(
            "Login successful!",
            false
        );


        setTimeout(
            function () {

                closeAuth();

            },
            700
        );


    }

    catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        showLoginMessage(
            error.message ||
            "Login failed. Please try again."
        );

    }

    finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Login";
        }
    }
}


// =====================================================
// AUTH - SIGN UP
// =====================================================

async function handleSignup(event) {

    event.preventDefault();

    clearAuthMessages();


    const username =
        signupUsername
            ? signupUsername.value.trim()
            : "";

    const email =
        signupEmail
            ? signupEmail.value.trim()
            : "";

    const password =
        signupPassword
            ? signupPassword.value
            : "";


    if (
        !username ||
        !email ||
        !password
    ) {

        showSignupMessage(
            "Please fill in all fields."
        );

        return;
    }


    if (password.length < 8) {

        showSignupMessage(
            "Password must be at least 8 characters."
        );

        return;
    }


    const submitButton =
        signupFormElement
            ? signupFormElement.querySelector(
                ".auth-submit"
            )
            : null;


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Creating account...";
    }


    try {

        const response =
            await fetch(
                REGISTER_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                }
            );


        const contentType =
            response.headers.get(
                "content-type"
            );


        let data;


        if (
            contentType &&
            contentType.includes(
                "application/json"
            )
        ) {

            data =
                await response.json();

        }

        else {

            const text =
                await response.text();

            throw new Error(
                text ||
                `Server Error ${response.status}`
            );
        }


        console.log(
            "Signup response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.detail ||
                data.message ||
                "Registration failed."
            );
        }


        showSignupMessage(
            "Account created successfully!",
            false
        );


        // -------------------------------------------------
        // Move to Login
        // -------------------------------------------------

        setTimeout(
            function () {

                openLogin();

                if (loginUsername) {

                    loginUsername.value =
                        username;
                }

                if (loginPassword) {

                    loginPassword.value =
                        "";
                }

                showLoginMessage(
                    "Account created. Please login.",
                    false
                );

            },
            800
        );


    }

    catch (error) {

        console.error(
            "SIGNUP ERROR:",
            error
        );


        showSignupMessage(
            error.message ||
            "Registration failed. Please try again."
        );

    }

    finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Create Account";
        }
    }
}


// =====================================================
// AUTH EVENT LISTENERS
// =====================================================

if (loginButton) {

    loginButton.addEventListener(
        "click",
        openLogin
    );
}


if (signupButton) {

    signupButton.addEventListener(
        "click",
        openSignup
    );
}


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );
}


if (authClose) {

    authClose.addEventListener(
        "click",
        closeAuth
    );
}


if (showSignup) {

    showSignup.addEventListener(
        "click",
        openSignup
    );
}


if (showLogin) {

    showLogin.addEventListener(
        "click",
        openLogin
    );
}


if (loginFormElement) {

    loginFormElement.addEventListener(
        "submit",
        handleLogin
    );
}


if (signupFormElement) {

    signupFormElement.addEventListener(
        "submit",
        handleSignup
    );
}


// =====================================================
// CLOSE AUTH BY CLICKING OUTSIDE
// =====================================================

if (authOverlay) {

    authOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                authOverlay
            ) {

                closeAuth();
            }
        }
    );
}


// =====================================================
// CLOSE AUTH WITH ESC
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            authOverlay &&
            authOverlay.style.display !== "none"
        ) {

            closeAuth();
        }
    }
);


// =====================================================
// INITIAL AUTH STATE
// =====================================================

updateAuthUI();

validateToken();


// =====================================================
// GALLERY
// =====================================================

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) {
                return;
            }

            handleImage(file);
        }
    );
}


// =====================================================
// CAMERA
// =====================================================

if (cameraInput) {

    cameraInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) {
                return;
            }

            handleImage(file);
        }
    );
}


// =====================================================
// HANDLE IMAGE
// =====================================================

function handleImage(file) {

    // -------------------------------------------------
    // Check image
    // -------------------------------------------------

    if (
        !file.type ||
        !file.type.startsWith("image/")
    ) {

        alert(
            "Please select a valid image."
        );

        return;
    }


    // -------------------------------------------------
    // Maximum 10MB
    // -------------------------------------------------

    const maxSize =
        10 * 1024 * 1024;


    if (file.size > maxSize) {

        alert(
            "Image is too large. Please choose an image smaller than 10MB."
        );

        return;
    }


    // -------------------------------------------------
    // Save file
    // -------------------------------------------------

    selectedFile =
        file;


    // -------------------------------------------------
    // Preview
    // -------------------------------------------------

    if (previewImage) {

        previewImage.src =
            URL.createObjectURL(file);
    }


    // -------------------------------------------------
    // Show preview
    // -------------------------------------------------

    if (previewContainer) {

        previewContainer.classList.add(
            "show"
        );
    }


    // -------------------------------------------------
    // Hide upload area
    // -------------------------------------------------

    if (uploadArea) {

        uploadArea.style.display =
            "none";
    }


    // -------------------------------------------------
    // Enable analyze button
    // -------------------------------------------------

    if (analyzeButton) {

        analyzeButton.disabled =
            false;

        analyzeButton.style.display =
            "flex";
    }


    // -------------------------------------------------
    // Hide old result
    // -------------------------------------------------

    if (resultCard) {

        resultCard.classList.remove(
            "show"
        );
    }


    // -------------------------------------------------
    // Clear old details
    // -------------------------------------------------

    if (resultDetails) {

        resultDetails.innerHTML =
            "";
    }
}


// =====================================================
// REMOVE IMAGE
// =====================================================

if (removeButton) {

    removeButton.addEventListener(
        "click",
        resetUploader
    );
}


function resetUploader() {

    selectedFile =
        null;


    // -------------------------------------------------
    // Reset inputs
    // -------------------------------------------------

    if (imageInput) {

        imageInput.value =
            "";
    }


    if (cameraInput) {

        cameraInput.value =
            "";
    }


    // -------------------------------------------------
    // Reset preview
    // -------------------------------------------------

    if (previewImage) {

        previewImage.src =
            "";
    }


    if (previewContainer) {

        previewContainer.classList.remove(
            "show"
        );
    }


    // -------------------------------------------------
    // Show upload area
    // -------------------------------------------------

    if (uploadArea) {

        uploadArea.style.display =
            "flex";
    }


    // -------------------------------------------------
    // Disable analyze
    // -------------------------------------------------

    if (analyzeButton) {

        analyzeButton.disabled =
            true;

        analyzeButton.style.display =
            "flex";
    }


    // -------------------------------------------------
    // Hide loading
    // -------------------------------------------------

    if (loading) {

        loading.classList.remove(
            "show"
        );
    }


    // -------------------------------------------------
    // Hide result
    // -------------------------------------------------

    if (resultCard) {

        resultCard.classList.remove(
            "show"
        );
    }


    // -------------------------------------------------
    // Reset confidence
    // -------------------------------------------------

    if (confidenceProgress) {

        confidenceProgress.style.width =
            "0%";
    }


    // -------------------------------------------------
    // Reset values
    // -------------------------------------------------

    if (resultPlant) {

        resultPlant.textContent =
            "-";
    }


    if (resultCondition) {

        resultCondition.textContent =
            "-";
    }


    if (resultConfidence) {

        resultConfidence.textContent =
            "0%";
    }


    if (confidenceLevel) {

        confidenceLevel.textContent =
            "-";
    }


    if (resultRecommendation) {

        resultRecommendation.textContent =
            "-";
    }


    if (resultIcon) {

        resultIcon.textContent =
            "🌿";
    }


    // -------------------------------------------------
    // Reset details
    // -------------------------------------------------

    if (resultDetails) {

        resultDetails.innerHTML =
            "";
    }
}


// =====================================================
// DRAG & DROP
// =====================================================

if (uploadArea) {

    uploadArea.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            uploadArea.classList.add(
                "dragover"
            );
        }
    );


    uploadArea.addEventListener(
        "dragleave",
        function () {

            uploadArea.classList.remove(
                "dragover"
            );
        }
    );


    uploadArea.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();

            uploadArea.classList.remove(
                "dragover"
            );


            const files =
                event.dataTransfer.files;


            if (
                !files ||
                !files.length
            ) {

                return;
            }


            handleImage(
                files[0]
            );
        }
    );
}


// =====================================================
// ANALYZE BUTTON
// =====================================================

if (analyzeButton) {

    analyzeButton.addEventListener(
        "click",
        analyzePlant
    );
}


// =====================================================
// ANALYZE PLANT
// =====================================================

async function analyzePlant() {

    if (!selectedFile) {

        alert(
            "Please select an image first."
        );

        return;
    }


    // -------------------------------------------------
    // LOGIN REQUIRED
    // -------------------------------------------------

    if (!accessToken) {

        alert(
            "Please login to analyze your plant."
        );

        openLogin();

        return;
    }


    // -------------------------------------------------
    // Console
    // -------------------------------------------------

    console.log(
        "================================="
    );

    console.log(
        "KHADRWY - PLANT ANALYSIS"
    );

    console.log(
        "================================="
    );

    console.log(
        "File:",
        selectedFile.name
    );

    console.log(
        "API:",
        API_URL
    );


    // -------------------------------------------------
    // Disable button
    // -------------------------------------------------

    analyzeButton.disabled =
        true;

    analyzeButton.style.display =
        "none";


    // -------------------------------------------------
    // Hide previous result
    // -------------------------------------------------

    if (resultCard) {

        resultCard.classList.remove(
            "show"
        );
    }


    // -------------------------------------------------
    // Show loading
    // -------------------------------------------------

    if (loading) {

        loading.classList.add(
            "show"
        );
    }


    // -------------------------------------------------
    // Create FormData
    // -------------------------------------------------

    const formData =
        new FormData();


    formData.append(
        "file",
        selectedFile,
        selectedFile.name
    );


    try {

        console.log(
            "Sending request..."
        );


        // -------------------------------------------------
        // Send request
        // -------------------------------------------------

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${accessToken}`
                    },

                    body: formData
                }
            );


        console.log(
            "Status:",
            response.status
        );


        // -------------------------------------------------
        // Check content type
        // -------------------------------------------------

        const contentType =
            response.headers.get(
                "content-type"
            );


        let data;


        if (
            contentType &&
            contentType.includes(
                "application/json"
            )
        ) {

            data =
                await response.json();

        }

        else {

            const text =
                await response.text();


            throw new Error(
                `Server returned ${response.status}: ${text}`
            );
        }


        // -------------------------------------------------
        // Console result
        // -------------------------------------------------

        console.log(
            "Result:",
            data
        );


        // -------------------------------------------------
        // TOKEN EXPIRED
        // -------------------------------------------------

        if (
            response.status === 401
        ) {

            logout();

            throw new Error(
                "Your session has expired. Please login again."
            );
        }


        // -------------------------------------------------
        // Check response
        // -------------------------------------------------

        if (!response.ok) {

            throw new Error(
                data.detail ||
                data.message ||
                `Server Error ${response.status}`
            );
        }


        // -------------------------------------------------
        // Display result
        // -------------------------------------------------

        displayResult(data);

    }


    catch (error) {

        console.error(
            "FULL ERROR:",
            error
        );


        let message =
            error.message;


        // -------------------------------------------------
        // Connection error
        // -------------------------------------------------

        if (
            error.name === "TypeError"
        ) {

            message =
                "Cannot connect to the AI server.\n\n" +
                "Make sure FastAPI is running on:\n" +
                API_BASE_URL;
        }


        alert(
            "Analysis failed!\n\n" +
            message
        );

    }


    finally {

        // -------------------------------------------------
        // Hide loading
        // -------------------------------------------------

        if (loading) {

            loading.classList.remove(
                "show"
            );
        }


        // -------------------------------------------------
        // Enable button
        // -------------------------------------------------

        if (analyzeButton) {

            analyzeButton.disabled =
                false;

            analyzeButton.style.display =
                "flex";
        }
    }
}


// =====================================================
// DISPLAY RESULT
// =====================================================

function displayResult(data) {

    // -------------------------------------------------
    // Plant
    // -------------------------------------------------

    if (resultPlant) {

        resultPlant.textContent =
            data.plant ||
            "Unknown";
    }


    // -------------------------------------------------
    // Condition
    // -------------------------------------------------

    if (resultCondition) {

        resultCondition.textContent =
            data.condition ||
            "Unknown";
    }


    // -------------------------------------------------
    // Confidence
    // -------------------------------------------------

    let confidence =
        Number(data.confidence) || 0;


    confidence =
        Math.max(
            0,
            Math.min(
                confidence,
                100
            )
        );


    if (resultConfidence) {

        resultConfidence.textContent =
            confidence.toFixed(2) + "%";
    }


    // -------------------------------------------------
    // Progress bar
    // -------------------------------------------------

    if (confidenceProgress) {

        confidenceProgress.style.width =
            "0%";


        setTimeout(
            function () {

                confidenceProgress.style.width =
                    confidence + "%";

            },
            100
        );
    }


    // -------------------------------------------------
    // Confidence level
    // -------------------------------------------------

    setConfidenceLevel(
        data,
        confidence
    );


    // -------------------------------------------------
    // Recommendation
    // -------------------------------------------------

    const recommendation =
        data.recommendation || {};


    // -------------------------------------------------
    // Result icon
    // -------------------------------------------------

    if (resultIcon) {

        if (data.healthy === true) {

            resultIcon.textContent =
                "🌿";
        }

        else if (
            recommendation.status ===
            "uncertain"
        ) {

            resultIcon.textContent =
                "❓";
        }

        else {

            resultIcon.textContent =
                "🩺";
        }
    }


    // -------------------------------------------------
    // Main recommendation
    // -------------------------------------------------

    if (resultRecommendation) {

        if (recommendation.message) {

            resultRecommendation.textContent =
                recommendation.message;
        }

        else if (recommendation.description) {

            resultRecommendation.textContent =
                recommendation.description;
        }

        else {

            resultRecommendation.textContent =
                "Monitor your plant regularly.";
        }
    }


    // -------------------------------------------------
    // Clear old details
    // -------------------------------------------------

    if (resultDetails) {

        resultDetails.innerHTML =
            "";


        // -------------------------------------------------
        // Symptoms
        // -------------------------------------------------

        if (
            Array.isArray(
                recommendation.symptoms
            ) &&
            recommendation.symptoms.length
        ) {

            createRecommendationSection(
                "🔎 Symptoms",
                recommendation.symptoms
            );
        }


        // -------------------------------------------------
        // Actions
        // -------------------------------------------------

        if (
            Array.isArray(
                recommendation.actions
            ) &&
            recommendation.actions.length
        ) {

            createRecommendationSection(
                "🌱 Recommended Actions",
                recommendation.actions
            );
        }


        // -------------------------------------------------
        // Prevention
        // -------------------------------------------------

        if (
            Array.isArray(
                recommendation.prevention
            ) &&
            recommendation.prevention.length
        ) {

            createRecommendationSection(
                "🛡️ Prevention",
                recommendation.prevention
            );
        }
    }


    // -------------------------------------------------
    // Show result
    // -------------------------------------------------

    if (resultCard) {

        resultCard.classList.add(
            "show"
        );


        // -------------------------------------------------
        // Scroll to result
        // -------------------------------------------------

        setTimeout(
            function () {

                resultCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            },
            150
        );
    }
}


// =====================================================
// CONFIDENCE LEVEL
// =====================================================

function setConfidenceLevel(
    data,
    confidence
) {

    if (!confidenceLevel) {
        return;
    }


    // -------------------------------------------------
    // Backend confidence level
    // -------------------------------------------------

    if (data.confidence_level) {

        confidenceLevel.textContent =
            data.confidence_level;

        return;
    }


    // -------------------------------------------------
    // Automatic level
    // -------------------------------------------------

    if (confidence >= 90) {

        confidenceLevel.textContent =
            "Very High";
    }

    else if (confidence >= 75) {

        confidenceLevel.textContent =
            "High";
    }

    else if (confidence >= 50) {

        confidenceLevel.textContent =
            "Medium";
    }

    else {

        confidenceLevel.textContent =
            "Low";
    }
}


// =====================================================
// CREATE RECOMMENDATION SECTION
// =====================================================

function createRecommendationSection(
    title,
    items
) {

    if (!resultDetails) {
        return;
    }


    const section =
        document.createElement(
            "div"
        );


    section.className =
        "recommendation-list";


    const heading =
        document.createElement(
            "h4"
        );


    heading.textContent =
        title;


    section.appendChild(
        heading
    );


    const list =
        document.createElement(
            "ul"
        );


    items.forEach(
        function (item) {

            const li =
                document.createElement(
                    "li"
                );


            if (
                typeof item ===
                "string"
            ) {

                li.textContent =
                    item;
            }


            else if (
                item !== null &&
                typeof item === "object"
            ) {

                li.textContent =
                    item.text ||
                    item.description ||
                    JSON.stringify(item);
            }


            else {

                li.textContent =
                    String(item);
            }


            list.appendChild(
                li
            );
        }
    );


    section.appendChild(
        list
    );


    resultDetails.appendChild(
        section
    );
}


// =====================================================
// ANALYZE ANOTHER
// =====================================================

if (anotherButton) {

    anotherButton.addEventListener(
        "click",
        function () {

            resetUploader();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );
}


// =====================================================
// NAVBAR ACTIVE LINK
// =====================================================

const sections =
    document.querySelectorAll(
        "main section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".navbar nav a"
    );


function updateActiveNav() {

    let currentSection =
        "home";


    sections.forEach(
        function (section) {

            const sectionTop =
                section.offsetTop - 120;


            if (
                window.scrollY >=
                sectionTop
            ) {

                currentSection =
                    section.getAttribute(
                        "id"
                    );
            }
        }
    );


    navLinks.forEach(
        function (link) {

            link.classList.remove(
                "active"
            );


            const href =
                link.getAttribute(
                    "href"
                );


            if (
                href ===
                "#" + currentSection
            ) {

                link.classList.add(
                    "active"
                );
            }
        }
    );
}


window.addEventListener(
    "scroll",
    updateActiveNav
);


// =====================================================
// PREVENT BROWSER DROP
// =====================================================

document.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();
    }
);


document.addEventListener(
    "drop",
    function (event) {

        if (
            uploadArea &&
            !uploadArea.contains(
                event.target
            )
        ) {

            event.preventDefault();
        }
    }
);


// =====================================================
// DEBUG
// =====================================================

console.log(
    "🌿 KHADRWY JavaScript loaded successfully."
);

console.log(
    "API:",
    API_BASE_URL
);

console.log(
    "Logged in:",
    Boolean(accessToken)
);