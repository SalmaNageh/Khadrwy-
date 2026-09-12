// =====================================================
// KHADRWY - AI PLANT DOCTOR & SMART FARMING
// =====================================================

// =====================================================
// CONFIG
// =====================================================
const API_BASE_URL = "http://127.0.0.1:8000";
const API_URL = `${API_BASE_URL}/predict`;
const CHAT_URL = `${API_BASE_URL}/chat`;
const REGISTER_URL = `${API_BASE_URL}/register`;
const LOGIN_URL = `${API_BASE_URL}/login`;
const ME_URL = `${API_BASE_URL}/me`;
const TOKEN_KEY = "khadrwy_access_token";
const USERNAME_KEY = "khadrwy_username";

// =====================================================
// ELEMENTS - PLANT DOCTOR & AUTHENTICATION
// =====================================================
const imageInput = document.getElementById("imageInput");
const cameraInput = document.getElementById("cameraInput");
const uploadArea = document.getElementById("uploadArea");
const previewContainer = document.getElementById("previewContainer");
const previewImage = document.getElementById("previewImage");
const removeButton = document.getElementById("removeButton");
const analyzeButton = document.getElementById("analyzeButton");
const loading = document.getElementById("loading");
const resultCard = document.getElementById("resultCard");
const resultPlant = document.getElementById("resultPlant");
const resultCondition = document.getElementById("resultCondition");
const resultConfidence = document.getElementById("resultConfidence");
const confidenceProgress = document.getElementById("confidenceProgress");
const confidenceLevel = document.getElementById("confidenceLevel");
const resultRecommendation = document.getElementById("resultRecommendation");
const resultIcon = document.getElementById("resultIcon");
const resultDetails = document.getElementById("resultDetails");
const anotherButton = document.getElementById("anotherButton");

const authButtons = document.getElementById("authButtons");
const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");
const userMenu = document.getElementById("userMenu");
const userName = document.getElementById("userName");
const logoutButton = document.getElementById("logoutButton");
const authOverlay = document.getElementById("authOverlay");
const authClose = document.getElementById("authClose");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginFormElement = document.getElementById("loginFormElement");
const signupFormElement = document.getElementById("signupFormElement");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const signupUsername = document.getElementById("signupUsername");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const loginMessage = document.getElementById("loginMessage");
const signupMessage = document.getElementById("signupMessage");

let selectedFile = null;
let lastDiagnosis = null; // لتخزين بيانات التشخيص للـ RAG Chat
let accessToken = localStorage.getItem(TOKEN_KEY);
let loggedInUsername = localStorage.getItem(USERNAME_KEY);

// =====================================================
// AUTHENTICATION LOGIC
// =====================================================
function openLogin() {
    if (!authOverlay) return;
    authOverlay.style.display = "flex";
    if (loginForm) loginForm.style.display = "block";
    if (signupForm) signupForm.style.display = "none";
    clearAuthMessages();
    if (loginUsername) setTimeout(() => loginUsername.focus(), 100);
}

function openSignup() {
    if (!authOverlay) return;
    authOverlay.style.display = "flex";
    if (loginForm) loginForm.style.display = "none";
    if (signupForm) signupForm.style.display = "block";
    clearAuthMessages();
    if (signupUsername) setTimeout(() => signupUsername.focus(), 100);
}

function closeAuth() {
    if (authOverlay) authOverlay.style.display = "none";
    clearAuthMessages();
}

function clearAuthMessages() {
    if (loginMessage) loginMessage.textContent = "";
    if (signupMessage) signupMessage.textContent = "";
}

function showLoginMessage(message, isError = true) {
    if (!loginMessage) return;
    loginMessage.textContent = message;
    loginMessage.style.color = isError ? "#d9534f" : "#4d9b5a";
}

function showSignupMessage(message, isError = true) {
    if (!signupMessage) return;
    signupMessage.textContent = message;
    signupMessage.style.color = isError ? "#d9534f" : "#4d9b5a";
}

function updateAuthUI() {
    if (accessToken && loggedInUsername) {
        if (authButtons) authButtons.style.display = "none";
        if (userMenu) userMenu.style.display = "flex";
        if (userName) userName.textContent = `👤 ${loggedInUsername}`;
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (userMenu) userMenu.style.display = "none";
    }
}

function saveLogin(token, username) {
    accessToken = token;
    loggedInUsername = username;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
    updateAuthUI();
}

function logout() {
    accessToken = null;
    loggedInUsername = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    updateAuthUI();
    closeAuth();
    console.log("User logged out.");
}

async function validateToken() {
    if (!accessToken) {
        updateAuthUI();
        return;
    }
    try {
        const response = await fetch(ME_URL, {
            method: "GET",
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        if (!response.ok) throw new Error("Invalid token");
        const data = await response.json();
        loggedInUsername = data.username;
        localStorage.setItem(USERNAME_KEY, data.username);
        updateAuthUI();
    } catch (error) {
        console.warn("Session expired or invalid.");
        logout();
    }
}

async function handleLogin(event) {
    event.preventDefault();
    clearAuthMessages();
    const username = loginUsername ? loginUsername.value.trim() : "";
    const password = loginPassword ? loginPassword.value : "";

    if (!username || !password) {
        showLoginMessage("Please enter your username and password.");
        return;
    }

    const submitButton = loginFormElement ? loginFormElement.querySelector(".auth-submit") : null;
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Logging in...";
    }

    try {
        const response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(text || `Server Error ${response.status}`);
        }
        if (!response.ok) throw new Error(data.detail || data.message || "Login failed.");
        if (!data.access_token) throw new Error("No access token received.");

        saveLogin(data.access_token, data.username || username);
        showLoginMessage("Login successful!", false);
        setTimeout(() => closeAuth(), 700);
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        showLoginMessage(error.message || "Login failed. Please try again.");
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Login";
        }
    }
}

async function handleSignup(event) {
    event.preventDefault();
    clearAuthMessages();
    const username = signupUsername ? signupUsername.value.trim() : "";
    const email = signupEmail ? signupEmail.value.trim() : "";
    const password = signupPassword ? signupPassword.value : "";

    if (!username || !email || !password) {
        showSignupMessage("Please fill in all fields.");
        return;
    }
    if (password.length < 8) {
        showSignupMessage("Password must be at least 8 characters.");
        return;
    }

    const submitButton = signupFormElement ? signupFormElement.querySelector(".auth-submit") : null;
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Creating account...";
    }

    try {
        const response = await fetch(REGISTER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(text || `Server Error ${response.status}`);
        }
        if (!response.ok) throw new Error(data.detail || data.message || "Registration failed.");

        showSignupMessage("Account created successfully!", false);
        setTimeout(() => {
            openLogin();
            if (loginUsername) loginUsername.value = username;
            if (loginPassword) loginPassword.value = "";
            showLoginMessage("Account created. Please login.", false);
        }, 800);
    } catch (error) {
        console.error("SIGNUP ERROR:", error);
        showSignupMessage(error.message || "Registration failed. Please try again.");
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Create Account";
        }
    }
}

// Auth Event Listeners
if (loginButton) loginButton.addEventListener("click", openLogin);
if (signupButton) signupButton.addEventListener("click", openSignup);
if (logoutButton) logoutButton.addEventListener("click", logout);
if (authClose) authClose.addEventListener("click", closeAuth);
if (showSignup) showSignup.addEventListener("click", openSignup);
if (showLogin) showLogin.addEventListener("click", openLogin);
if (loginFormElement) loginFormElement.addEventListener("submit", handleLogin);
if (signupFormElement) signupFormElement.addEventListener("submit", handleSignup);

if (authOverlay) {
    authOverlay.addEventListener("click", (event) => {
        if (event.target === authOverlay) closeAuth();
    });
}
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && authOverlay && authOverlay.style.display !== "none") closeAuth();
});

// Init Auth
updateAuthUI();
validateToken();


// =====================================================
// PLANT DOCTOR & IMAGE HANDLING
// =====================================================
if (imageInput) {
    imageInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) handleImage(file);
    });
}
if (cameraInput) {
    cameraInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) handleImage(file);
    });
}

function handleImage(file) {
    if (!file.type || !file.type.startsWith("image/")) {
        alert("Please select a valid image.");
        return;
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        alert("Image is too large. Max 10MB.");
        return;
    }

    selectedFile = file;
    const defaultIcon = document.getElementById("defaultIcon");
    const previewImg = document.getElementById("previewImage");
    if (defaultIcon) defaultIcon.style.display = "none";
    if (previewImg) {
        previewImg.src = URL.createObjectURL(file);
        previewImg.style.display = "block";
    }

    const uploadOptions = document.getElementById("uploadOptions");
    const actionOptions = document.getElementById("actionOptions");
    const loadingSpinner = document.getElementById("loading");

    if (uploadOptions) uploadOptions.style.display = "none";
    if (actionOptions) actionOptions.style.display = "flex";
    if (loadingSpinner) loadingSpinner.style.display = "none";

    const workspace = document.getElementById("doctorWorkspace");
    const resCard = document.getElementById("resultCard");
    if (workspace) workspace.classList.remove("has-result");
    if (resCard) resCard.classList.remove("show");
}

if (removeButton) {
    removeButton.addEventListener("click", resetUploader);
}

function resetUploader() {
    selectedFile = null;
    lastDiagnosis = null; // Reset AI chat context
    if (imageInput) imageInput.value = "";
    if (cameraInput) cameraInput.value = "";

    const defaultIcon = document.getElementById("defaultIcon");
    const previewImg = document.getElementById("previewImage");
    if (previewImg) {
        previewImg.src = "";
        previewImg.style.display = "none";
    }
    if (defaultIcon) defaultIcon.style.display = "block";

    const uploadOptions = document.getElementById("uploadOptions");
    const actionOptions = document.getElementById("actionOptions");
    const loadingSpinner = document.getElementById("loading");

    if (uploadOptions) uploadOptions.style.display = "flex";
    if (actionOptions) actionOptions.style.display = "none";
    if (loadingSpinner) loadingSpinner.style.display = "none";

    const workspace = document.getElementById("doctorWorkspace");
    const resCard = document.getElementById("resultCard");
    if (workspace) workspace.classList.remove("has-result");
    if (resCard) resCard.classList.remove("show");

    if (resultDetails) resultDetails.innerHTML = "";
}

// Drag & Drop
const uploadCardArea = document.getElementById("uploadCard");
if (uploadCardArea) {
    uploadCardArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        uploadCardArea.classList.add("dragover");
    });
    uploadCardArea.addEventListener("dragleave", () => {
        uploadCardArea.classList.remove("dragover");
    });
    uploadCardArea.addEventListener("drop", (event) => {
        event.preventDefault();
        uploadCardArea.classList.remove("dragover");
        const files = event.dataTransfer.files;
        if (files && files.length > 0) handleImage(files[0]);
    });
}
document.addEventListener("dragover", (event) => event.preventDefault());
document.addEventListener("drop", (event) => {
    if (uploadCardArea && !uploadCardArea.contains(event.target)) event.preventDefault();
});

// Analyze Button
const analyzeBtn = document.getElementById("analyzeButton");
if (analyzeBtn) {
    analyzeBtn.addEventListener("click", analyzePlant);
}

async function analyzePlant() {
    if (!selectedFile) {
        alert("Please select an image first.");
        return;
    }
    if (!accessToken) {
        alert("Please login to analyze your plant.");
        openLogin();
        return;
    }

    const actionOptions = document.getElementById("actionOptions");
    const loadingSpinner = document.getElementById("loading");

    if (actionOptions) actionOptions.style.display = "none";
    if (loadingSpinner) loadingSpinner.style.display = "block";

    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Authorization": `Bearer ${accessToken}` },
            body: formData
        });

        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Server returned ${response.status}: ${text}`);
        }

        if (response.status === 401) {
            logout();
            throw new Error("Your session has expired. Please login again.");
        }

        if (!response.ok) {
            throw new Error(data.detail || data.message || `Server Error ${response.status}`);
        }

        if (loadingSpinner) loadingSpinner.style.display = "none";

        const workspace = document.getElementById("doctorWorkspace");
        const resCard = document.getElementById("resultCard");
        if (workspace) workspace.classList.add("has-result");
        if (resCard) resCard.classList.add("show");

        displayResult(data);

    } catch (error) {
        console.error("ANALYSIS ERROR:", error);
        alert("Analysis failed!\n\n" + (error.name === "TypeError" ? "Cannot connect to the AI server." : error.message));
        if (loadingSpinner) loadingSpinner.style.display = "none";
        if (actionOptions) actionOptions.style.display = "flex";
    }
}

// =====================================================
// DISPLAY RESULT & TTS
// =====================================================
function displayResult(data) {
    // Store diagnosis for AI RAG Chat context
    lastDiagnosis = {
        plant: data.plant || "Unknown",
        condition: data.condition || "Unknown",
        confidence: data.confidence || 0
    };

    if (resultPlant) resultPlant.textContent = getLocalTranslation(data.plant || "Unknown");
    if (resultCondition) resultCondition.textContent = getLocalTranslation(data.condition || "Unknown");

    let confidence = Number(data.confidence) || 0;
    confidence = Math.max(0, Math.min(confidence, 100));

    if (resultConfidence) resultConfidence.textContent = confidence.toFixed(2) + "%";
    if (confidenceProgress) {
        confidenceProgress.style.width = "0%";
        setTimeout(() => confidenceProgress.style.width = confidence + "%", 100);
    }
    setConfidenceLevel(data, confidence);

    const recommendation = data.recommendation || {};

    if (resultIcon) {
        if (data.healthy === true) resultIcon.textContent = "🌿";
        else if (recommendation.status === "uncertain") resultIcon.textContent = "❓";
        else resultIcon.textContent = "🩺";
    }

    if (resultRecommendation) {
        if (recommendation.message) resultRecommendation.textContent = getLocalTranslation(recommendation.message);
        else if (recommendation.description) resultRecommendation.textContent = getLocalTranslation(recommendation.description);
        else resultRecommendation.textContent = getLocalTranslation("Monitor your plant regularly.");
    }

    if (resultDetails) {
        resultDetails.innerHTML = "";
        if (Array.isArray(recommendation.symptoms) && recommendation.symptoms.length) {
            createRecommendationSection(getLocalTranslation("🔎 Symptoms"), recommendation.symptoms.map(item => getLocalTranslation(item)));
        }
        if (Array.isArray(recommendation.actions) && recommendation.actions.length) {
            createRecommendationSection(getLocalTranslation("🌱 Recommended Actions"), recommendation.actions.map(item => getLocalTranslation(item)));
        }
        if (Array.isArray(recommendation.prevention) && recommendation.prevention.length) {
            createRecommendationSection(getLocalTranslation("🛡️ Prevention"), recommendation.prevention.map(item => getLocalTranslation(item)));
        }
    }

    if (resultCard) {
        document.getElementById("anotherButton").style.display = "block";
        const speakBtn = document.getElementById("speakResultButton");
        if (speakBtn) speakBtn.style.display = "block";
        resultCard.style.display = "flex";
        resultCard.classList.add("show");
        setTimeout(() => resultCard.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
    }
}

function setConfidenceLevel(data, confidence) {
    if (!confidenceLevel) return;
    if (data.confidence_level) {
        confidenceLevel.textContent = data.confidence_level;
        return;
    }
    if (confidence >= 90) confidenceLevel.textContent = "Very High";
    else if (confidence >= 75) confidenceLevel.textContent = "High";
    else if (confidence >= 50) confidenceLevel.textContent = "Medium";
    else confidenceLevel.textContent = "Low";
}

function createRecommendationSection(title, items) {
    if (!resultDetails) return;
    const section = document.createElement("div");
    section.className = "recommendation-list";
    const heading = document.createElement("h4");
    heading.textContent = title;
    section.appendChild(heading);
    const list = document.createElement("ul");
    items.forEach(item => {
        const li = document.createElement("li");
        if (typeof item === "string") li.textContent = item;
        else if (item !== null && typeof item === "object") li.textContent = item.text || item.description || JSON.stringify(item);
        else li.textContent = String(item);
        list.appendChild(li);
    });
    section.appendChild(list);
    resultDetails.appendChild(section);
}

if (anotherButton) {
    anotherButton.addEventListener("click", () => {
        resetUploader();
        const speakBtn = document.getElementById("speakResultButton");
        if (speakBtn) speakBtn.style.display = "none";
        anotherButton.style.display = "none";
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// Text to Speech
const speakResultButton = document.getElementById("speakResultButton");
let speechUtterance = null;

function getResultTextForSpeech() {
    const lang = document.documentElement.lang || "en";
    let text = "";
    if (resultPlant && resultPlant.textContent.trim()) text += lang === "ar" ? `النبات المكتشف هو ${resultPlant.textContent}. ` : `The identified plant is ${resultPlant.textContent}. `;
    if (resultCondition && resultCondition.textContent.trim()) text += lang === "ar" ? `الحالة المكتشفة هو ${resultCondition.textContent}. ` : `The detected condition is ${resultCondition.textContent}. `;
    if (resultConfidence && resultConfidence.textContent.trim()) text += lang === "ar" ? `نسبة الثقة هي ${resultConfidence.textContent}. ` : `Confidence score is ${resultConfidence.textContent}. `;
    if (resultRecommendation && resultRecommendation.textContent.trim()) text += lang === "ar" ? `التوصية: ${resultRecommendation.textContent}. ` : `Recommendation: ${resultRecommendation.textContent}. `;

    if (resultDetails) {
        const sections = resultDetails.querySelectorAll(".recommendation-list");
        sections.forEach(section => {
            const heading = section.querySelector("h4");
            const items = section.querySelectorAll("li");
            if (heading) text += `${heading.textContent}. `;
            items.forEach(item => text += `${item.textContent}. `);
        });
    }
    return text.trim();
}

function speakResult() {
    if (!("speechSynthesis" in window)) {
        alert("Text-to-speech is not supported by your browser.");
        return;
    }
    const text = getResultTextForSpeech();
    if (!text) return;

    window.speechSynthesis.cancel();
    const lang = document.documentElement.lang || "en";
    speechUtterance = new SpeechSynthesisUtterance(text);
    speechUtterance.lang = lang === "ar" ? "ar-EG" : "en-US";
    speechUtterance.rate = 0.9;

    if (speakResultButton) speakResultButton.textContent = lang === "ar" ? "⏹ إيقاف القراءة" : "⏹ Stop Reading";
    speechUtterance.onend = updateSpeakButton;
    speechUtterance.onerror = updateSpeakButton;
    window.speechSynthesis.speak(speechUtterance);
}

function updateSpeakButton() {
    if (!speakResultButton) return;
    const lang = document.documentElement.lang || "en";
    speakResultButton.textContent = lang === "ar" ? "🔊 قراءة النتيجة" : "🔊 Read Result";
}

if (speakResultButton) {
    speakResultButton.addEventListener("click", () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            updateSpeakButton();
        } else {
            speakResult();
        }
    });
}


// =====================================================
// SETTINGS MODAL & AUTOMATION LOGIC (With Auth, Validation & Edit Mode)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    const settingsOverlay = document.getElementById("settingsOverlay");
    const navSettingsBtn = document.getElementById("navSettingsBtn");
    const settingsClose = document.getElementById("settingsClose");
    const automationForm = document.getElementById("automationForm");

    // عناصر الفورم
    const cropTypeSelect = document.getElementById("cropType");
    const growthStageSelect = document.getElementById("growthStage");
    const soilTypeSelect = document.getElementById("soilType");
    const sliderOnInput = document.getElementById("sliderOn");
    const sliderOffInput = document.getElementById("sliderOff");
    const tempOverrideToggle = document.getElementById("tempOverrideToggle");
    const tempThresholdInput = document.getElementById("tempThreshold");
    const maxRunInput = document.getElementById("maxRun");
    const cooldownInput = document.getElementById("cooldown");
    const timeStartInput = document.getElementById("timeStart");
    const timeEndInput = document.getElementById("timeEnd");
    const resetSettingsBtn = document.getElementById("resetSettingsBtn");

    let isEditMode = false;

    function openSettingsModal(e) {
        if (e) e.preventDefault();
        if (settingsOverlay) settingsOverlay.style.display = "flex";
        loadSavedSettingsState();
    }

    function closeSettingsModal() {
        if (settingsOverlay) settingsOverlay.style.display = "none";
    }

    if (navSettingsBtn) navSettingsBtn.addEventListener("click", openSettingsModal);
    if (settingsClose) settingsClose.addEventListener("click", closeSettingsModal);

    if (settingsOverlay) {
        settingsOverlay.addEventListener("click", (e) => {
            if (e.target === settingsOverlay) closeSettingsModal();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && settingsOverlay && settingsOverlay.style.display !== "none") {
            closeSettingsModal();
        }
    });

    function saveSettingsToLocalStorage(data) {
        localStorage.setItem('khadrwy_settings', JSON.stringify(data));
        localStorage.setItem('khadrwy_settings_saved', 'true');
    }

    function getSavedSettings() {
        const saved = localStorage.getItem('khadrwy_settings');
        return saved ? JSON.parse(saved) : null;
    }

    function setFormFieldsDisabled(disabled) {
        const elements = [
            cropTypeSelect, growthStageSelect, soilTypeSelect,
            sliderOnInput, sliderOffInput, tempOverrideToggle,
            tempThresholdInput, maxRunInput, cooldownInput,
            timeStartInput, timeEndInput, resetSettingsBtn,
            document.getElementById("applyPresetsBtn")
        ];
        elements.forEach(el => { if (el) el.disabled = disabled; });
    }

function updateSaveButtonState() {
    const saveBtn = automationForm?.querySelector("button[type='submit']");
    if (!saveBtn) return;
    
    const lang = document.documentElement.lang || 'en';
    const isSaved = localStorage.getItem('khadrwy_settings_saved') === 'true';
    const isFormDisabled = cropTypeSelect?.disabled;

    if (!isSaved) {
        // الحالة الأولى: أول مرة اليوزر يفتح الإعدادات (لا يوجد حفظ مسبق)
        saveBtn.textContent = lang === 'ar' ? "💾 حفظ إعدادات الأتمتة" : "💾 Save Automation Settings";
    } else if (isFormDisabled) {
        // الحالة الثانية: الإعدادات محفوظة والفورم مقفول (وضع القراءة)
        saveBtn.textContent = lang === 'ar' ? "✏️ تعديل الإعدادات (Edit)" : "✏️ Edit Settings";
    } else {
        // الحالة الثالثة: اليوزر ضغط "تعديل" والفورم مفتوح دلوقتي وبيغير البيانات
        saveBtn.textContent = lang === 'ar' ? "💾 تحديث الإعدادات (Update)" : "💾 Update Settings";
    }
}

    function loadSavedSettingsState() {
        const isSaved = localStorage.getItem('khadrwy_settings_saved') === 'true';
        const data = getSavedSettings();

        if (isSaved && data) {
            if (cropTypeSelect) cropTypeSelect.value = data.cropType || "";
            if (growthStageSelect) growthStageSelect.value = data.growthStage || "";
            if (soilTypeSelect) soilTypeSelect.value = data.soilType || "";
            // داخل دالة loadSavedSettingsState()

            if (sliderOnInput) {
                sliderOnInput.value = data.sliderOn || 52;
                // السطر ده هيجبر الكود يعيد حساب الخلفية الخضراء بالاتجاه الصحيح
                sliderOnInput.dispatchEvent(new Event("input"));
            }

            if (sliderOffInput) {
                sliderOffInput.value = data.sliderOff || 70;
                // السطر ده هيجبر الكود يعيد حساب الخلفية الخضراء بالاتجاه الصحيح
                sliderOffInput.dispatchEvent(new Event("input"));
            }
            if (tempOverrideToggle) tempOverrideToggle.checked = data.tempOverride !== undefined ? data.tempOverride : true;
            if (tempThresholdInput) tempThresholdInput.value = data.tempThreshold || 32;
            if (maxRunInput) maxRunInput.value = data.maxRun || 20;
            if (cooldownInput) cooldownInput.value = data.cooldown || 2;
            if (timeStartInput) timeStartInput.value = data.timeStart || "12:00";
            if (timeEndInput) timeEndInput.value = data.timeEnd || "15:00";

            document.getElementById("valOn").textContent = sliderOnInput?.value || 52;
            document.getElementById("valOff").textContent = sliderOffInput?.value || 70;

            isEditMode = true;
            setFormFieldsDisabled(true);
        } else {
            isEditMode = false;
            setFormFieldsDisabled(false);
        }
        updateSaveButtonState();
    }

    function validateForm() {
        const lang = document.documentElement.lang || 'en';

        if (!cropTypeSelect || !cropTypeSelect.value) {
            alert(lang === 'ar' ? "خطأ: يرجى اختيار نوع المحصول!" : "Error: Please select a crop type!");
            cropTypeSelect?.focus();
            return false;
        }

        const onVal = parseInt(sliderOnInput?.value || 0);
        const offVal = parseInt(sliderOffInput?.value || 0);
        if (onVal >= offVal) {
            alert(lang === 'ar'
                ? "خطأ: قيمة 'الفتح أدنى من' يجب أن تكون أقل من قيمة 'الإيقاف أعلى من'!"
                : "Error: 'Turn On Below' value must be less than 'Turn Off Above' value!");
            sliderOnInput?.focus();
            return false;
        }

        const tempVal = parseInt(tempThresholdInput?.value || 0);
        if (tempVal < 20 || tempVal > 50) {
            alert(lang === 'ar'
                ? "خطأ: درجة حرارة تجاوز الحرارة يجب أن تكون بين 20 و 50 درجة مئوية!"
                : "Error: Temperature threshold must be between 20°C and 50°C!");
            tempThresholdInput?.focus();
            return false;
        }

        const maxRunVal = parseInt(maxRunInput?.value || 0);
        if (maxRunVal < 1 || maxRunVal > 120) {
            alert(lang === 'ar'
                ? "خطأ: أقصى وقت تشغيل يجب أن يكون بين 1 و 120 دقيقة!"
                : "Error: Max run time must be between 1 and 120 minutes!");
            maxRunInput?.focus();
            return false;
        }

        const cooldownVal = parseInt(cooldownInput?.value || 0);
        if (cooldownVal < 1 || cooldownVal > 24) {
            alert(lang === 'ar'
                ? "خطأ: فترة التبريد يجب أن تكون بين 1 و 24 ساعة!"
                : "Error: Cooldown period must be between 1 and 24 hours!");
            cooldownInput?.focus();
            return false;
        }

        if (!timeStartInput?.value || !timeEndInput?.value) {
            alert(lang === 'ar' ? "خطأ: يرجى تحديد أوقات حظر الري بنجاح!" : "Error: Please specify valid restriction times!");
            return false;
        }

        return true;
    }

    if (automationForm) {
        automationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const lang = document.documentElement.lang || 'en';

            if (!accessToken) {
                const loginMsg = lang === 'ar'
                    ? "يجب تسجيل الدخول أولاً لحفظ الإعدادات!"
                    : "You must login first to save settings!";
                alert(loginMsg);
                closeSettingsModal();
                openLogin();
                return;
            }

            if (isEditMode && cropTypeSelect.disabled) {
                setFormFieldsDisabled(false);
                updateSaveButtonState();
                return;
            }

            if (!validateForm()) return;

            const formData = {
                cropType: cropTypeSelect?.value,
                growthStage: growthStageSelect?.value,
                soilType: soilTypeSelect?.value,
                sliderOn: sliderOnInput?.value,
                sliderOff: sliderOffInput?.value,
                tempOverride: tempOverrideToggle?.checked,
                tempThreshold: tempThresholdInput?.value,
                maxRun: maxRunInput?.value,
                cooldown: cooldownInput?.value,
                timeStart: timeStartInput?.value,
                timeEnd: timeEndInput?.value
            };

            saveSettingsToLocalStorage(formData);

            const successMsg = lang === 'ar'
                ? "تم حفظ وتحديث الإعدادات بنجاح!"
                : "Settings successfully saved!";
            alert(successMsg);

            isEditMode = true;
            setFormFieldsDisabled(true);
            updateSaveButtonState();
            closeSettingsModal();
            window.location.hash = "#monitoring";
        });
    }
});


// =====================================================
// SMART AUTOMATION SETTINGS LOGIC (SLIDERS & PRESETS)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    const sliderOn = document.getElementById("sliderOn");
    const valOn = document.getElementById("valOn");
    const sliderOff = document.getElementById("sliderOff");
    const valOff = document.getElementById("valOff");

    function updateSliderFill(slider, valElement) {
        if (!slider || !valElement) return;
        const value = slider.value;
        valElement.textContent = value;
        const progress = (value / slider.max) * 100;
        const isRTL = document.documentElement.dir === 'rtl';
        const direction = isRTL ? 'to left' : 'to right';
        slider.style.background = `linear-gradient(${direction}, #2e7d32 ${progress}%, #eef2ef ${progress}%)`;
    }

    if (sliderOn) {
        sliderOn.addEventListener("input", () => updateSliderFill(sliderOn, valOn));
        updateSliderFill(sliderOn, valOn);
    }
    if (sliderOff) {
        sliderOff.addEventListener("input", () => updateSliderFill(sliderOff, valOff));
        updateSliderFill(sliderOff, valOff);
    }

    document.getElementById("btnAr")?.addEventListener("click", () => {
        setTimeout(() => { updateSliderFill(sliderOn, valOn); updateSliderFill(sliderOff, valOff); }, 50);
    });
    document.getElementById("btnEn")?.addEventListener("click", () => {
        setTimeout(() => { updateSliderFill(sliderOn, valOn); updateSliderFill(sliderOff, valOff); }, 50);
    });

    const applyPresetsBtn = document.getElementById("applyPresetsBtn");
    if (applyPresetsBtn) {
        applyPresetsBtn.addEventListener("click", () => {
            const crop = document.getElementById("cropType").value;
            if (!crop) {
                alert(document.documentElement.lang === 'ar' ? "يرجى اختيار نوع المحصول أولاً!" : "Please select a crop type first!");
                return;
            }
            sliderOn.value = 55; updateSliderFill(sliderOn, valOn);
            sliderOff.value = 75; updateSliderFill(sliderOff, valOff);
            document.getElementById("maxRun").value = 15;
            document.getElementById("cooldown").value = 3;

            const btnText = applyPresetsBtn.innerHTML;
            applyPresetsBtn.innerHTML = "✅ Applied!";
            setTimeout(() => { applyPresetsBtn.innerHTML = btnText; }, 2000);
        });
    }
});


// =====================================================
// SMART MONITORING CONTROL PANEL LOGIC (Multilingual)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    const manualWaterBtn = document.getElementById("manualWaterBtn");
    const timerDropdownBtn = document.getElementById("timerDropdownBtn");
    const timerMenu = document.getElementById("timerMenu");
    const systemStatusBadge = document.getElementById("systemStatusBadge");

    let isManualRunning = false;
    let activeTimer = null;

    function isArabic() {
        return document.documentElement.getAttribute("dir") === "rtl";
    }

    if (manualWaterBtn) {
        manualWaterBtn.addEventListener("click", () => {
            isManualRunning = !isManualRunning;

            if (isManualRunning) {
                manualWaterBtn.textContent = isArabic() ? "🛑 إيقاف الري" : "🛑 Stop Water";
                manualWaterBtn.classList.add("active-stop");
                setSystemStatus("manual", isArabic() ? "🟠 النظام: تحكم يدوي" : "🟠 SYSTEM: MANUAL OVERRIDE");
                if (activeTimer) clearTimeout(activeTimer);
            } else {
                resetManualState();
            }
        });
    }

    if (timerDropdownBtn && timerMenu) {
        timerDropdownBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = timerMenu.style.display === "flex";
            timerMenu.style.display = isOpen ? "none" : "flex";
        });

        document.addEventListener("click", () => {
            timerMenu.style.display = "none";
        });
    }

    const timerOptions = document.querySelectorAll(".timer-option");
    timerOptions.forEach(option => {
        option.addEventListener("click", function () {
            const minutes = parseInt(this.getAttribute("data-minutes"));
            isManualRunning = true;
            if (manualWaterBtn) {
                manualWaterBtn.textContent = isArabic() ? "🛑 إيقاف الري" : "🛑 Stop Water";
                manualWaterBtn.classList.add("active-stop");
            }

            const timerTextAr = minutes === 60 ? "ساعة واحدة" : `${minutes} دقائق`;
            const timerTextEn = minutes === 60 ? "1 Hour" : `${minutes}m Timer`;

            setSystemStatus("manual", isArabic() ? `🟠 النظام: يدوي (${timerTextAr})` : `🟠 SYSTEM: MANUAL (${timerTextEn})`);
            if (timerMenu) timerMenu.style.display = "none";

            if (activeTimer) clearTimeout(activeTimer);
            activeTimer = setTimeout(() => {
                resetManualState();
            }, minutes * 60 * 1000);
        });
    });

    function resetManualState() {
        isManualRunning = false;
        if (manualWaterBtn) {
            manualWaterBtn.textContent = isArabic() ? "💧 اروي الآن" : "💧 Water Now";
            manualWaterBtn.classList.remove("active-stop");
        }
        setSystemStatus("auto", isArabic() ? "🟢 النظام: تلقائي" : "🟢 SYSTEM: AUTO");
        if (activeTimer) clearTimeout(activeTimer);
    }

    function setSystemStatus(mode, text) {
        if (!systemStatusBadge) return;
        systemStatusBadge.textContent = text;
        systemStatusBadge.className = "status-badge-indicator " + (mode === "manual" ? "status-manual" : "status-auto");
    }
});


// =====================================================
// TRANSLATION & BILINGUAL SUPPORT (EN/AR)
// =====================================================
const localTranslations = {
    // ... Plant names & conditions translated ...
    "Peach": "خوخ", "Tomato": "طماطم", "Apple": "تفاح", "Potato": "بطاطس", "Corn": "ذرة", "Grape": "عنب",
    "Orange": "برتقال", "Strawberry": "فراولة", "Squash": "كوسا", "Pepper": "فلفل",
    "Bacterial spot": "تبقع بكتيري", "Late blight": "لفحة متأخرة", "Early blight": "لفحة مبكرة", "Healthy": "سليم",
    "Powdery mildew": "بياض دقيقي", "Black rot": "عفن أسود", "Apple scab": "جرب التفاح", "Cedar apple rust": "صدأ التفاح والعرعر",
    "Leaf scorch": "احتراق الأوراق", "Septoria leaf spot": "تبقع السبتوريا",
    "🔎 Symptoms": "الأعراض 🔎", "Symptoms 🔎": "الأعراض 🔎",
    "🌱 Recommended Actions": "الإجراءات الموصى بها 🌱", "Recommended Actions 🌱": "الإجراءات الموصى بها 🌱",
    "🛡️ Prevention": "الوقاية 🛡️", "Prevention 🛡️": "الوقاية 🛡️"
};

function getLocalTranslation(text) {
    if (!text) return "";
    const currentLang = document.documentElement.lang || 'en';
    if (currentLang === 'en') return text;
    return localTranslations[text] || text;
}

const translations = {
    en: {
        page_title: "Khadrwy | AI Plant Doctor",
        nav_home: "Home", nav_doctor: "Plant Doctor", nav_monitor: "Monitoring", nav_assist: "AI Assistant", nav_about: "About", nav_settings: "Settings",
        btn_login: "Login", btn_signup: "Sign Up", btn_logout: "Logout",
        auth_login_title: "Welcome Back", auth_login_desc: "Login to your Khadrwy account.", auth_user: "Username", auth_pass: "Password", auth_email: "Email",
        auth_login_btn: "Login", auth_no_acc: "Don't have an account?", auth_signup_link: "Sign Up", auth_signup_title: "Create Account",
        auth_signup_desc: "Join Khadrwy and start caring for your plants.", auth_signup_btn: "Create Account", auth_has_acc: "Already have an account?", auth_login_link: "Login",
        auth_user_ph: "Enter your username", auth_pass_ph: "Enter your password", auth_user_ph2: "Choose a username", auth_email_ph: "Enter your email", auth_pass_ph2: "Create a password",
        hero_badge: "AI-Powered Agricultural Platform — Khadrwy", hero_title: "Smart Care for <br><span class='serif-highlight'>Healthier Plants.</span>",
        hero_desc: "Detect diseases instantly, monitor your farm in real-time, and get AI-driven recommendations.",
        hero_btn_start: "Diagnose Your Plant &rarr;", hero_btn_demo: "How It Works",
        stat_1_val: "38", stat_1_label: "Plant Conditions", stat_2_val: "AI", stat_2_label: "Powered Detection", stat_3_val: "Fast", stat_3_label: "Analysis",
        badge_ai: "AI Analysis Active", badge_pro: "Pro Feature Unlocked",
        doc_badge: "FREE FEATURE — ACTIVE", doc_title: "AI Plant<br>Doctor", doc_desc: "Upload a photo of your crop and our AI diagnoses diseases in seconds.",
        up_title: "Drop your plant photo here", up_support: "Supports JPG, PNG, HEIC — Max 10MB", up_choose: "Choose Image", up_camera: "Take Photo", up_dismiss: "Dismiss", up_analyze: "Analyze", up_loading: "Analyzing...",
        res_id_label: "IDENTIFIED PLANT", res_critical: "⚠ CRITICAL", res_disease_label: "Detected Disease / Condition", res_conf_label: "AI Confidence Score", res_treat_label: "TREATMENT RECOMMENDATION", res_scan_btn: "Scan Another Plant",
        how_badge: "HOW IT WORKS", how_title: "Diagnosis Made Simple", how_desc: "From a simple leaf photo to practical plant care advice.",
        step_1_title: "Capture", step_1_desc: "Take a clear photo or upload an existing image.", step_2_title: "Analyze", step_2_desc: "Our AI model analyzes the image and identifies the condition.", step_3_title: "Get Advice", step_3_desc: "Receive an AI diagnosis with treatment and prevention tips.",
        mon_badge: "SMART MONITORING", mon_title: "Your Farm, Always<br>in Sight", mon_desc: "Real-time environmental data from precision sensors.",
        sens_temp_label: "AIR TEMPERATURE", sens_hum_label: "HUMIDITY", sens_soil_label: "SOIL MOISTURE", sens_light_label: "LIGHT INTENSITY",
        status_optimal: "Optimal", status_normal: "Normal", status_review: "Review", status_high: "High",
        ctrl_panel_title: "🚰 Irrigation Control Panel", ctrl_panel_desc: "Manage water pumps instantly or switch system overrides",
        status_auto_label: "🟢 SYSTEM: AUTO", status_manual_label: "🟠 SYSTEM: MANUAL OVERRIDE", btn_water_now: "💧 Water Now", btn_stop: "🛑 Stop Water", btn_run_for: "⏱ Run for...", timer_10m: "10 Minutes", timer_30m: "30 Minutes", timer_1h: "1 Hour",
        ai_badge: "AI ASSISTANT", ai_title: "Your Expert Agronomist,<br>Available 24 / 7", ai_desc: "Khadrawy's AI speaks your language and learns your farm.",
        ai_feat1_title: "Instant advice", ai_feat1_desc: "Actionable answers in seconds.", ai_feat2_title: "Pest & disease identification", ai_feat2_desc: "Upload a photo and get a diagnosis.", ai_feat3_title: "Seasonal crop planning", ai_feat3_desc: "Personalised sowing and irrigation schedules.", ai_feat4_title: "Arabic & English support", ai_feat4_desc: "Switch languages mid-conversation.",
        chat_name: "Khadrawy AI", chat_welcome: "Hello! I'm here to help with your crops. What's on your mind today?", chat_placeholder: "Ask anything about your farm...",
        set_badge: "IOT AUTOMATION", set_title: "Smart Automation Settings", set_desc: "Configure intelligent irrigation rules for your connected water pump.",
        set_preset_title: "Apply Smart Presets", set_preset_desc: "Auto-fill optimal values based on selected crop & growth stage", set_preset_btn: "Apply Smart Presets",
        set_c1_title: "Field & Crop Profile", set_c1_desc: "Define the crop context for smart threshold calibration", set_lbl_crop: "CROP TYPE", set_opt_select_crop: "Select crop...",
        set_lbl_growth: "GROWTH STAGE", set_lbl_soil: "SOIL TYPE", set_c2_title: "Automation Thresholds", set_c2_desc: "Set soil moisture levels to trigger pump ON/OFF",
        set_lbl_turnon: "TURN ON BELOW", set_lbl_turnoff: "TURN OFF ABOVE", set_lbl_hightemp: "HIGH TEMPERATURE OVERRIDE", set_hightemp_title: "High Temperature Override", set_hightemp_desc: "Briefly run the pump for cooling when temp is high.",
        set_c3_title: "Pump & Safety Settings", set_c3_desc: "Protect equipment and prevent flooding.", set_lbl_mode: "OPERATION MODE", set_mode_auto: "Auto", set_mode_timer: "Timer", set_mode_manual: "Manual",
        set_lbl_maxrun: "MAX RUN TIME", set_lbl_cooldown: "COOLDOWN PERIOD", set_c4_title: "Time Restrictions", set_c4_desc: "Prevent irrigation during peak-sun hours.", set_lbl_start: "DO NOT WATER — START", set_lbl_through: "through", set_lbl_end: "DO NOT WATER — END",
        set_btn_reset: "Reset to Defaults", set_btn_save: "💾 Save Automation Settings",
        abt_mission_badge: "OUR MISSION", abt_mission_title: "Empowering Farmers with AI", abt_mission_desc: "Every farmer deserves access to world-class agricultural intelligence.",
        abt_card1_title: "Sustainability", abt_card1_desc: "Reduce chemical use, conserve water, and protect soil.", abt_card2_title: "Innovation", abt_card2_desc: "From satellite imagery to in-field sensor networks.", abt_card3_title: "Community", abt_card3_desc: "A shared knowledge network that benefits everyone.",
        abt_stat1_label: "ACTIVE FARMERS", abt_stat2_label: "HECTARES MONITORED", abt_stat3_label: "SATISFACTION RATE", abt_stat4_label: "AI AVAILABILITY",
        ftr_brand_desc: "Precision agriculture intelligence for the farmers who feed the world.", ftr_quick_links: "QUICK LINKS", ftr_link_home: "Home", ftr_link_monitor: "Smart Monitoring", ftr_link_ai: "AI Assistant", ftr_link_about: "About Us", ftr_link_pricing: "Pricing", ftr_link_contact: "Contact",
        ftr_resources: "RESOURCES", ftr_link_docs: "Documentation", ftr_link_blog: "Blog & Insights", ftr_link_guides: "Crop Guides", ftr_link_api: "API Access", ftr_link_support: "Support Centre", ftr_link_forum: "Community Forum",
        ftr_newsletter: "STAY IN THE KNOW", ftr_news_desc: "Seasonal tips, new features, and agronomy insights.", ftr_news_ph: "your@email.com", ftr_news_btn: "Subscribe", ftr_news_privacy: "We respect your privacy.", ftr_copyright: "© 2026 Khadrawy — خضراوي. All rights reserved.", ftr_privacy: "Privacy Policy", ftr_terms: "Terms of Service", ftr_cookies: "Cookie Settings"
    },
    ar: {
        page_title: "خضراوي | طبيب النباتات الذكي",
        nav_home: "الرئيسية", nav_doctor: "الفحص الذكي", nav_monitor: "المراقبة", nav_assist: "المساعد الذكي", nav_about: "من نحن", nav_settings: "الإعدادات",
        btn_login: "تسجيل الدخول", btn_signup: "حساب جديد", btn_logout: "تسجيل الخروج",
        auth_login_title: "مرحباً بعودتك", auth_login_desc: "سجل الدخول إلى حسابك في خضراوي.", auth_user: "اسم المستخدم", auth_pass: "كلمة المرور", auth_email: "البريد الإلكتروني",
        auth_login_btn: "دخول", auth_no_acc: "ليس لديك حساب؟", auth_signup_link: "سجل الآن", auth_signup_title: "إنشاء حساب",
        auth_signup_desc: "انضم لخضراوي وابدأ في العناية بنباتاتك.", auth_signup_btn: "إنشاء حساب", auth_has_acc: "لديك حساب بالفعل؟", auth_login_link: "تسجيل الدخول",
        auth_user_ph: "أدخل اسم المستخدم", auth_pass_ph: "أدخل كلمة المرور", auth_user_ph2: "اختر اسم مستخدم", auth_email_ph: "أدخل بريدك الإلكتروني", auth_pass_ph2: "أنشئ كلمة مرور",
        hero_badge: "منصة زراعية مدعومة بالذكاء الاصطناعي — خضراوي", hero_title: "رعاية ذكية لـ <br><span class='serif-highlight'>محاصيل أكثر صحة.</span>",
        hero_desc: "اكتشف الأمراض فوراً، راقب مزرعتك، واحصل على توصيات دقيقة بالذكاء الاصطناعي.",
        hero_btn_start: "افحص نباتك الآن &larr;", hero_btn_demo: "كيف يعمل؟",
        stat_1_val: "38", stat_1_label: "حالة مرضية", stat_2_val: "AI", stat_2_label: "فحص بالذكاء الاصطناعي", stat_3_val: "سريع", stat_3_label: "تحليل فوري",
        badge_ai: "التحليل الذكي مُفعل", badge_pro: "ميزة Pro مُتاحة",
        doc_badge: "ميزة مجانية — مُفعلة", doc_title: "طبيب النباتات<br>الذكي", doc_desc: "ارفع صورة لمحصولك وسيقوم الذكاء الاصطناعي بتشخيصه مجاناً.",
        up_title: "اسحب صورة النبات هنا", up_support: "يدعم JPG, PNG, HEIC — بحد أقصى 10MB", up_choose: "اختر صورة", up_camera: "التقط صورة", up_dismiss: "إلغاء", up_analyze: "تحليل", up_loading: "جاري التحليل...",
        res_id_label: "النبات المُكتشف", res_critical: "⚠ خطير", res_disease_label: "المرض / الحالة المُكتشفة", res_conf_label: "نسبة دقة الذكاء الاصطناعي", res_treat_label: "توصيات العلاج", res_scan_btn: "فحص نبات آخر",
        how_badge: "كيف يعمل؟", how_title: "التشخيص الزراعي أصبح أسهل", how_desc: "من مجرد صورة لورقة النبات إلى نصائح عملية.",
        step_1_title: "التقط صورة", step_1_desc: "التقط صورة واضحة أو ارفع صورة موجودة.", step_2_title: "الفحص والتحليل", step_2_desc: "يقوم نموذج الذكاء الاصطناعي بتحليل الصورة وتحديد الحالة.", step_3_title: "احصل على النصيحة", step_3_desc: "احصل على تشخيص دقيق مع خطة علاج متكاملة.",
        mon_badge: "المراقبة الذكية", mon_title: "مزرعتك، دائماً<br>تحت نظرك", mon_desc: "بيانات بيئية لحظية من مستشعرات دقيقة موزعة في حقلك.",
        sens_temp_label: "درجة حرارة الهواء", sens_hum_label: "الرطوبة", sens_soil_label: "رطوبة التربة", sens_light_label: "شدة الإضاءة",
        status_optimal: "مثالي", status_normal: "طبيعي", status_review: "يحتاج مراجعة", status_high: "مرتفع",
        ctrl_panel_title: "🚰 لوحة تحكم الري", ctrl_panel_desc: "إدارة مضخات المياه فورياً أو تبديل وضع النظام",
        status_auto_label: "🟢 النظام: تلقائي", status_manual_label: "🟠 النظام: تحكم يدوي", btn_water_now: "💧 اروي الآن", btn_stop: "🛑 إيقاف الري", btn_run_for: "⏱ تشغيل لمدة...", timer_10m: "10 دقائق", timer_30m: "30 دقيقة", timer_1h: "ساعة واحدة",
        ai_badge: "المساعد الذكي", ai_title: "مهندسك الزراعي الخبير،<br>متاح 24/7", ai_desc: "الذكاء الاصطناعي يتحدث لغتك ويتعلم تفاصيل مزرعتك.",
        ai_feat1_title: "نصائح فورية", ai_feat1_desc: "إجابات عملية في ثوانٍ بلا انتظار.", ai_feat2_title: "التعرف على الآفات والأمراض", ai_feat2_desc: "احصل على تشخيص دقيق مع خطة علاج.", ai_feat3_title: "تخطيط المحاصيل الموسمي", ai_feat3_desc: "جداول مخصصة للزراعة والري.", ai_feat4_title: "دعم بالعربية والإنجليزية", ai_feat4_desc: "بدّل بين اللغتين في منتصف المحادثة.",
        chat_name: "خضراوي AI", chat_welcome: "أهلاً بك! أنا هنا لمساعدتك في محاصيلك. بم تفكر اليوم؟", chat_placeholder: "اسأل عن أي شيء يخص مزرعتك...",
        set_badge: "أتمتة إنترنت الأشياء", set_title: "إعدادات الأتمتة الذكية", set_desc: "تهيئة قواعد الري الذكية لمضخة المياه المتصلة بناءً على المستشعرات.",
        set_preset_title: "تطبيق الإعدادات المسبقة", set_preset_desc: "املأ القيم تلقائياً بناءً على المحصول", set_preset_btn: "تطبيق الإعدادات",
        set_c1_title: "ملف الحقل والمحصول", set_c1_desc: "حدد المحصول لمعايرة العتبات", set_lbl_crop: "نوع المحصول", set_opt_select_crop: "اختر المحصول...",
        set_lbl_growth: "مرحلة النمو", set_lbl_soil: "نوع التربة", set_c2_title: "عتبات الأتمتة", set_c2_desc: "ضبط مستويات الرطوبة لتشغيل المضخة",
        set_lbl_turnon: "الفتح أدنى من", set_lbl_turnoff: "الإيقاف أعلى من", set_lbl_hightemp: "تجاوز الحرارة المرتفعة", set_hightemp_title: "تجاوز الحرارة", set_hightemp_desc: "تشغيل المضخة للتبريد عند ارتفاع الحرارة.",
        set_c3_title: "إعدادات المضخة والأمان", set_c3_desc: "حماية المعدات بحدود صارمة.", set_lbl_mode: "وضع التشغيل", set_mode_auto: "تلقائي", set_mode_timer: "مؤقت", set_mode_manual: "يدوي",
        set_lbl_maxrun: "أقصى وقت تشغيل", set_lbl_cooldown: "فترة التبريد", set_c4_title: "قيود الوقت", set_c4_desc: "منع الري خلال ساعات الذروة.", set_lbl_start: "عدم الري — البدء", set_lbl_through: "إلى", set_lbl_end: "عدم الري — الانتهاء",
        set_btn_reset: "إعادة الضبط", set_btn_save: "💾 حفظ إعدادات الأتمتة",
        abt_mission_badge: "مهمتنا", abt_mission_title: "تمكين المزارعين بالذكاء الاصطناعي", abt_mission_desc: "كل مزارع يستحق الوصول إلى ذكاء زراعي عالمي.",
        abt_card1_title: "الاستدامة", abt_card1_desc: "تقليل الكيماويات والحفاظ على المياه.", abt_card2_title: "الابتكار", abt_card2_desc: "نجمع أفضل التقنيات المتاحة للمزارعين.", abt_card3_title: "المجتمع", abt_card3_desc: "شبكة معرفية تفيد الجميع على المنصة.",
        abt_stat1_label: "مزارع نشط", abt_stat2_label: "هكتار تحت المراقبة", abt_stat3_label: "نسبة الرضا", abt_stat4_label: "توفر الذكاء الاصطناعي",
        ftr_brand_desc: "ذكاء زراعي دقيق للمزارعين الذين يطعمون العالم.", ftr_quick_links: "روابط سريعة", ftr_link_home: "الرئيسية", ftr_link_monitor: "المراقبة", ftr_link_ai: "المساعد", ftr_link_about: "من نحن", ftr_link_pricing: "الأسعار", ftr_link_contact: "اتصل بنا",
        ftr_resources: "المصادر", ftr_link_docs: "دليل الاستخدام", ftr_link_blog: "المدونة", ftr_link_guides: "أدلة المحاصيل", ftr_link_api: "الـ API", ftr_link_support: "الدعم", ftr_link_forum: "المجتمع",
        ftr_newsletter: "النشرة البريدية", ftr_news_desc: "نصائح موسمية ورؤى زراعية دقيقة.", ftr_news_ph: "بريدك@الإلكتروني.com", ftr_news_btn: "اشتراك", ftr_news_privacy: "نحترم خصوصيتك.", ftr_copyright: "© 2026 خضراوي. جميع الحقوق محفوظة.", ftr_privacy: "سياسة الخصوصية", ftr_terms: "شروط الخدمة", ftr_cookies: "ملفات الارتباط"
    }
};

const btnEn = document.getElementById("btnEn");
const btnAr = document.getElementById("btnAr");

function setLanguage(lang) {
    localStorage.setItem('khadrwy_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    if (lang === 'ar') {
        if (btnAr) btnAr.classList.add('active');
        if (btnEn) btnEn.classList.remove('active');
        document.body.style.fontFamily = "'Cairo', Arial, sans-serif";
        document.querySelectorAll('.serif-highlight').forEach(el => el.style.fontFamily = "'Cairo', serif");
    } else {
        if (btnEn) btnEn.classList.add('active');
        if (btnAr) btnAr.classList.remove('active');
        document.body.style.fontFamily = "Arial, Helvetica, sans-serif";
        document.querySelectorAll('.serif-highlight').forEach(el => el.style.fontFamily = "'Georgia', serif");
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'TITLE') document.title = translations[lang][key];
            else el.innerHTML = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) el.placeholder = translations[lang][key];
    });

    updateSpeakButton();
}

if (btnEn) btnEn.addEventListener("click", () => setLanguage("en"));
if (btnAr) btnAr.addEventListener("click", () => setLanguage("ar"));

document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem('khadrwy_lang') || 'en';
    setLanguage(savedLang);
});

// =====================================================
// HELPER LOGIC (Hamburger, ScrollSpy)
// =====================================================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navContainer = document.getElementById('navContainer');
if (hamburgerBtn && navContainer) {
    hamburgerBtn.addEventListener('click', () => {
        navContainer.classList.toggle('active');
        hamburgerBtn.textContent = navContainer.classList.contains('active') ? '✕' : '☰';
    });
    navContainer.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('active');
            hamburgerBtn.textContent = '☰';
        });
    });
}

// -------------------------------------------------
// SCROLL SPY LOGIC (From HEAD)
// -------------------------------------------------
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".navbar nav a");

function updateActiveNav() {
    let currentSection = "home";
    sections.forEach(section => {
        if (window.scrollY >= (section.offsetTop - 120)) currentSection = section.getAttribute("id");
    });
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + currentSection) link.classList.add("active");
    });
}
window.addEventListener("scroll", updateActiveNav);

// =====================================================
// KHADRWY - AI AGRICULTURAL ASSISTANT
// REAL BACKEND RAG CHAT (From origin/main)
// =====================================================

function shouldUseLastDiagnosis(message) {
    if (!lastDiagnosis) return false;
    if (!message || !message.trim()) return false;

    const text = message.toLowerCase().trim();

    const arabicDiagnosisKeywords = [
        "الصورة", "الصوره", "الصورة دي", "الصوره دي", "الصورة اللي", "الصوره اللي", "الصورة التي", "الصوره التي",
        "النبات ده", "النبات دا", "النبات دي", "النبات ده اللي", "النبات اللي", "النبات اللى", "النبات الذي", "النبات الذى",
        "النبات الي", "النبات السابق", "النبات المصور", "النبات اللي صورته", "النبات اللي صورتهولك", "النبات اللي رفعته",
        "النبات الذي رفعته", "التشخيص", "التشخيص ده", "التشخيص السابق", "النتيجة", "النتيجة دي", "النتيجة السابقة",
        "النتيجة اللي ظهرت", "المرض اللي ظهر", "المرض الذي ظهر", "المرض المكتشف", "المرض ده", "الحالة اللي ظهرت",
        "الحالة التي ظهرت", "الحالة المكتشفة", "الحالة دي", "نسبة الثقة", "نسبة الدقة", "التحليل", "التحليل ده", "الفحص", "الفحص ده"
    ];

    const englishDiagnosisKeywords = [
        "this plant", "this image", "this photo", "the image", "the photo", "the plant i uploaded", "the plant i uploaded before",
        "the plant i showed", "the plant i sent", "the picture i uploaded", "the picture i sent", "the uploaded image",
        "the uploaded photo", "the previous image", "the previous photo", "the previous plant", "my uploaded plant",
        "my plant image", "my plant photo", "the diagnosis", "this diagnosis", "previous diagnosis", "the result",
        "this result", "previous result", "detected disease", "detected condition", "the detected disease",
        "the detected condition", "confidence score", "confidence", "analysis result", "the analysis", "this analysis"
    ];

    for (const keyword of arabicDiagnosisKeywords) {
        if (text.includes(keyword)) return true;
    }

    for (const keyword of englishDiagnosisKeywords) {
        if (text.includes(keyword)) return true;
    }

    const diagnosisQuestionPatterns = [
        "أعالجه", "اعالجه", "أتعامل معاه", "اتعامل معاه", "هل هو مصاب", "هل الحالة خطيرة", "هل المرض خطير",
        "what should i do with it", "how should i treat it", "how do i treat it", "is it infected", "is it serious",
        "is the disease serious", "what is the treatment", "how can i treat it"
    ];

    for (const pattern of diagnosisQuestionPatterns) {
        if (text.includes(pattern)) return true;
    }

    return false;
}

document.addEventListener("DOMContentLoaded", function () {
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatBody = document.getElementById("chatBody");

    if (!chatForm || !chatInput || !chatBody) {
        console.warn("AI Assistant elements were not found.");
        return;
    }

    chatForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const userText = chatInput.value.trim();

        if (!userText) return;

        if (!accessToken) {
            appendMessage(
                document.documentElement.lang === "ar"
                    ? "من فضلك سجل الدخول أولاً لاستخدام المساعد الذكي."
                    : "Please login first to use the AI Assistant.",
                "ai-message"
            );
            openLogin();
            return;
        }

        appendMessage(userText, "user-message");
        chatInput.value = "";
        const typingId = showTypingIndicator();
        chatInput.disabled = true;

        const submitButton = chatForm.querySelector("button[type='submit']");
        if (submitButton) submitButton.disabled = true;

        try {
            const useDiagnosis = shouldUseLastDiagnosis(userText);
            const requestBody = {
                message: userText,
                plant: useDiagnosis && lastDiagnosis ? lastDiagnosis.plant : null,
                condition: useDiagnosis && lastDiagnosis ? lastDiagnosis.condition : null,
                confidence: useDiagnosis && lastDiagnosis ? lastDiagnosis.confidence : null
            };

            console.log("🌱 Sending Chat Request:", requestBody);
            console.log("🩺 Diagnosis context used:", useDiagnosis);

            const response = await fetch(CHAT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(requestBody)
            });

            const contentType = response.headers.get("content-type");
            let data;

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || `Server returned ${response.status}`);
            }

            console.log("🤖 Chat Response:", data);

            if (response.status === 401) {
                logout();
                throw new Error(
                    document.documentElement.lang === "ar"
                        ? "انتهت جلسة تسجيل الدخول. من فضلك سجل الدخول مرة أخرى."
                        : "Your session has expired. Please login again."
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.detail || data.message ||
                    (document.documentElement.lang === "ar"
                        ? "حدث خطأ أثناء الاتصال بالمساعد الذكي."
                        : "An error occurred while contacting the AI Assistant.")
                );
            }

            removeTypingIndicator(typingId);
            const answer = data.answer || (document.documentElement.lang === "ar" ? "لم يتم الحصول على إجابة." : "No answer was returned.");
            appendMessage(answer, "ai-message");

            if (Array.isArray(data.sources) && data.sources.length > 0) {
                appendSources(data.sources);
            }

        } catch (error) {
            console.error("AI CHAT ERROR:", error);
            removeTypingIndicator(typingId);
            const errorMessage = document.documentElement.lang === "ar"
                ? "حدث خطأ أثناء الاتصال بالمساعد الذكي. تأكدي أن الـ Backend يعمل."
                : "Something went wrong while connecting to the AI Assistant. Please make sure the backend is running.";
            appendMessage(errorMessage, "ai-message");
        } finally {
            chatInput.disabled = false;
            if (submitButton) submitButton.disabled = false;
            chatInput.focus();
        }
    });

    function appendMessage(text, className) {
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${className}`;

        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.textContent = text;

        const timeSpan = document.createElement("span");
        timeSpan.className = "msg-time";
        timeSpan.textContent = time;

        msgDiv.appendChild(bubble);
        msgDiv.appendChild(timeSpan);
        chatBody.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const id = "typing-" + Date.now();
        const typingDiv = document.createElement("div");
        typingDiv.className = "typing-indicator";
        typingDiv.id = id;
        typingDiv.innerHTML = `<span></span><span></span><span></span>`;
        chatBody.appendChild(typingDiv);
        scrollToBottom();
        return id;
    }

    function removeTypingIndicator(id) {
        const typingDiv = document.getElementById(id);
        if (typingDiv) typingDiv.remove();
    }

    function appendSources(sources) {
        if (!Array.isArray(sources) || sources.length === 0) return;

        const sourcesDiv = document.createElement("div");
        sourcesDiv.className = "ai-sources";

        const title = document.createElement("div");
        title.className = "ai-sources-title";
        title.textContent = document.documentElement.lang === "ar" ? "📚 مصادر المعلومات" : "📚 Information Sources";
        sourcesDiv.appendChild(title);

        sources.forEach(function (source) {
            if (!source) return;

            const sourceTitle = source.title || source.name || source.source_title || "Unknown";
            const sourceName = source.source_name || source.source || source.source_type || "";
            const sourceItem = document.createElement("div");
            sourceItem.className = "ai-source-item";

            const sourceTitleElement = document.createElement("div");
            sourceTitleElement.className = "ai-source-title";
            sourceTitleElement.textContent = `• ${sourceTitle}`;
            sourceItem.appendChild(sourceTitleElement);

            if (sourceName) {
                const sourceNameElement = document.createElement("div");
                sourceNameElement.className = "ai-source-name";
                sourceNameElement.textContent = sourceName;
                sourceItem.appendChild(sourceNameElement);
            }

            if (source.source_type && source.source_type !== sourceName) {
                const sourceTypeElement = document.createElement("div");
                sourceTypeElement.className = "ai-source-type";
                sourceTypeElement.textContent = source.source_type;
                sourceItem.appendChild(sourceTypeElement);
            }
            sourcesDiv.appendChild(sourceItem);
        });

        chatBody.appendChild(sourcesDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});