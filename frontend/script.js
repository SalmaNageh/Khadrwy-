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
// 1. HANDLE IMAGE (يظهر الصورة والزراير الجديدة)
// =====================================================
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

    // تغيير الأيقونة بالصورة
    const defaultIcon = document.getElementById("defaultIcon");
    const previewImg = document.getElementById("previewImage");
    if (defaultIcon) defaultIcon.style.display = "none";
    if (previewImg) {
        previewImg.src = URL.createObjectURL(file);
        previewImg.style.display = "block";
    }

    // إخفاء زراير الرفع وإظهار زراير (Analyze & Dismiss)
    const uploadOptions = document.getElementById("uploadOptions");
    const actionOptions = document.getElementById("actionOptions");
    const loadingSpinner = document.getElementById("loading");

    if (uploadOptions) uploadOptions.style.display = "none";
    if (actionOptions) actionOptions.style.display = "flex";
    if (loadingSpinner) loadingSpinner.style.display = "none";

    // التأكد إن الشاشة لسه ملمومة والنتيجة مخفية
    const workspace = document.getElementById("doctorWorkspace");
    const resCard = document.getElementById("resultCard");
    if (workspace) workspace.classList.remove("has-result");
    if (resCard) resCard.classList.remove("show");
}

// =====================================================
// 2. RESET UPLOADER (زرار الـ Dismiss)
// =====================================================

if (removeButton) {
    removeButton.addEventListener("click", resetUploader);
}

function resetUploader() {
    selectedFile = null;
    const imageInput = document.getElementById("imageInput");
    const cameraInput = document.getElementById("cameraInput");
    if (imageInput) imageInput.value = "";
    if (cameraInput) cameraInput.value = "";

    // إرجاع الأيقونة وإخفاء الصورة
    const defaultIcon = document.getElementById("defaultIcon");
    const previewImg = document.getElementById("previewImage");
    if (previewImg) {
        previewImg.src = "";
        previewImg.style.display = "none";
    }
    if (defaultIcon) defaultIcon.style.display = "block";

    // إرجاع زراير الرفع الأصلية
    const uploadOptions = document.getElementById("uploadOptions");
    const actionOptions = document.getElementById("actionOptions");
    const loadingSpinner = document.getElementById("loading");

    if (uploadOptions) uploadOptions.style.display = "flex";
    if (actionOptions) actionOptions.style.display = "none";
    if (loadingSpinner) loadingSpinner.style.display = "none";

    // إرجاع الشاشة لحالتها وإخفاء النتيجة
    const workspace = document.getElementById("doctorWorkspace");
    const resCard = document.getElementById("resultCard");
    if (workspace) workspace.classList.remove("has-result");
    if (resCard) resCard.classList.remove("show");

    // تفريغ البيانات القديمة لو موجودة
    const resultDetails = document.getElementById("resultDetails");
    if (resultDetails) resultDetails.innerHTML = "";
}

// =====================================================
// 3. DRAG & DROP (السحب والإفلات)
// =====================================================
const uploadCardArea = document.getElementById("uploadCard");

if (uploadCardArea) {
    uploadCardArea.addEventListener("dragover", function (event) {
        event.preventDefault();
        uploadCardArea.classList.add("dragover");
    });

    uploadCardArea.addEventListener("dragleave", function () {
        uploadCardArea.classList.remove("dragover");
    });

    uploadCardArea.addEventListener("drop", function (event) {
        event.preventDefault();
        uploadCardArea.classList.remove("dragover");

        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            handleImage(files[0]);
        }
    });
}

// منع المتصفح من فتح الصورة في صفحة تانية لو اليوزر رماها بره المربع
document.addEventListener("dragover", function (event) {
    event.preventDefault();
});

document.addEventListener("drop", function (event) {
    if (uploadCardArea && !uploadCardArea.contains(event.target)) {
        event.preventDefault();
    }
});

// =====================================================
// 4. ANALYZE BUTTON & API FETCH
// =====================================================
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

    // إخفاء زراير التحكم وإظهار الـ Loading
    const actionOptions = document.getElementById("actionOptions");
    const loadingSpinner = document.getElementById("loading");

    if (actionOptions) actionOptions.style.display = "none";
    if (loadingSpinner) loadingSpinner.style.display = "block";

    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);

    try {
        // إرسال الصورة للـ Backend بتاعك
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

        // إخفاء الـ Loading
        if (loadingSpinner) loadingSpinner.style.display = "none";

        // تقسيم الشاشة نصين وإظهار النتيجة
        const workspace = document.getElementById("doctorWorkspace");
        const resCard = document.getElementById("resultCard");
        if (workspace) workspace.classList.add("has-result");
        if (resCard) resCard.classList.add("show");

        // استدعاء دالة العرض الموجودة عندك تحت في الكود
        displayResult(data);

    } catch (error) {
        console.error("ANALYSIS ERROR:", error);
        alert("Analysis failed!\n\n" + (error.name === "TypeError" ? "Cannot connect to the AI server." : error.message));

        // لو حصل خطأ، نرجع زراير التحكم (Analyze/Dismiss) تاني عشان اليوزر يقدر يحاول
        if (loadingSpinner) loadingSpinner.style.display = "none";
        if (actionOptions) actionOptions.style.display = "flex";
    }
}
// =====================================================
// LOCAL TRANSLATION DICTIONARY (القاموس الثابت الشامل)
// =====================================================
const localTranslations = {
    // --- أسماء النباتات ---
    "Peach": "خوخ",
    "Tomato": "طماطم",
    "Apple": "تفاح",
    "Potato": "بطاطس",
    "Corn": "ذرة",
    "Grape": "عنب",
    "Orange": "برتقال",
    "Strawberry": "فراولة",
    "Squash": "كوسا",
    "Pepper": "فلفل",

    // --- أسماء الأمراض (الأكثر شيوعاً) ---
    "Bacterial spot": "تبقع بكتيري",
    "Late blight": "لفحة متأخرة",
    "Early blight": "لفحة مبكرة",
    "Healthy": "سليم",
    "Powdery mildew": "بياض دقيقي",
    "Black rot": "عفن أسود",
    "Apple scab": "جرب التفاح",
    "Cedar apple rust": "صدأ التفاح والعرعر",
    "Leaf scorch": "احتراق الأوراق",
    "Septoria leaf spot": "تبقع السبتوريا",
    // --- العناوين الثابتة ---
    "🔎 Symptoms": "الأعراض 🔎",
    "Symptoms 🔎": "الأعراض 🔎",
    "🌱 Recommended Actions": "الإجراءات الموصى بها 🌱",
    "Recommended Actions 🌱": "الإجراءات الموصى بها 🌱",
    "🛡️ Prevention": "الوقاية 🛡️",
    "Prevention 🛡️": "الوقاية 🛡️",

    // --- الحالات العامة (سليم أو غير معروف) ---
    "The plant appears healthy. Continue regular monitoring and proper plant care.": "يبدو النبات سليماً. استمر في المراقبة المنتظمة والرعاية المناسبة للنبات.",
    "Continue regular monitoring.": "استمر في المراقبة المنتظمة.",
    "Maintain appropriate irrigation.": "حافظ على ري مناسب.",
    "Maintain balanced plant nutrition.": "حافظ على تغذية متوازنة للنبات.",
    "Monitor for any new symptoms.": "راقب ظهور أي أعراض جديدة.",
    "No specific recommendation is available for this condition.": "لا توجد توصيات محددة متاحة لهذه الحالة حالياً.",
    "Take a clearer image if possible.": "التقط صورة أوضح إن أمكن.",
    "Consult an agricultural specialist if symptoms continue.": "استشر أخصائي زراعي إذا استمرت الأعراض.",

    // --- التفاح (Apple) ---
    "Apple scab is a fungal disease that mainly affects apple leaves and fruits.": "جرب التفاح هو مرض فطري يصيب بشكل رئيسي أوراق وثمار التفاح.",
    "Olive or dark spots on leaves": "بقع زيتونية أو داكنة على الأوراق",
    "Dark lesions on fruits": "تقرحات داكنة على الثمار",
    "Premature leaf drop": "تساقط الأوراق المبكر",
    "Remove and dispose of severely infected leaves and fruits.": "قم بإزالة والتخلص من الأوراق والثمار المصابة بشدة.",
    "Improve air circulation around the trees.": "قم بتحسين التهوية حول الأشجار.",
    "Keep the orchard clean from fallen infected leaves.": "حافظ على نظافة البستان من الأوراق المصابة المتساقطة.",
    "Monitor trees regularly.": "راقب الأشجار بانتظام.",
    "Remove fallen infected leaves.": "قم بإزالة الأوراق المصابة المتساقطة.",
    "Avoid conditions that keep leaves wet for long periods.": "تجنب الظروف التي تبقي الأوراق مبللة لفترات طويلة.",
    "Black rot is a fungal disease that can affect apple leaves, branches, and fruits.": "العفن الأسود هو مرض فطري يمكن أن يصيب أوراق وأغصان وثمار التفاح.",
    "Dark leaf spots": "بقع داكنة على الأوراق",
    "Rotting fruit": "تعفن الثمار",
    "Dead or damaged branches": "أغصان ميتة أو تالفة",
    "Remove infected fruits and branches.": "قم بإزالة الثمار والأغصان المصابة.",
    "Remove diseased plant material from the orchard.": "قم بإزالة أجزاء النباتات المريضة من البستان.",
    "Maintain good orchard sanitation.": "حافظ على نظافة البستان بشكل جيد.",
    "Remove fallen or mummified fruits.": "قم بإزالة الثمار المتساقطة أو المحنطة.",
    "Cedar apple rust is a fungal disease affecting apple leaves and fruits.": "صدأ التفاح والعرعر هو مرض فطري يصيب أوراق وثمار التفاح.",
    "Yellow or orange spots on leaves": "بقع صفراء أو برتقالية على الأوراق",
    "Premature leaf damage": "تلف مبكر للأوراق",
    "Remove severely affected leaves.": "قم بإزالة الأوراق المصابة بشدة.",
    "Monitor the tree regularly.": "راقب الشجرة بانتظام.",
    "Inspect plants regularly.": "افحص النباتات بانتظام.",
    "Maintain orchard sanitation.": "حافظ على نظافة البستان.",
    "Monitor for recurring symptoms.": "راقب تكرار ظهور الأعراض.",

    // --- الكرز (Cherry) ---
    "Powdery mildew is a fungal disease that produces a white powdery growth on plant surfaces.": "البياض الدقيقي هو مرض فطري ينتج نمواً أبيض مسحوقياً على أسطح النبات.",
    "White powdery growth on leaves": "نمو أبيض مسحوقي على الأوراق",
    "Leaf distortion": "تشوه الأوراق",
    "Reduced plant growth": "ضعف نمو النبات",
    "Remove heavily infected leaves when appropriate.": "قم بإزالة الأوراق شديدة الإصابة عند الاقتضاء.",
    "Improve air circulation around plants.": "حسّن التهوية حول النباتات.",
    "Avoid excessive humidity around the foliage.": "تجنب الرطوبة الزائدة حول المجموع الخضري.",
    "Maintain proper plant spacing.": "حافظ على مسافات مناسبة بين النباتات.",
    "Keep foliage dry when possible.": "حافظ على جفاف الأوراق قدر الإمكان.",

    // --- الذرة (Corn) ---
    "Gray leaf spot is a fungal disease that affects corn leaves and can reduce plant productivity.": "تبقع الأوراق الرمادي هو مرض فطري يصيب أوراق الذرة ويمكن أن يقلل من إنتاجية النبات.",
    "Long gray or brown lesions on leaves": "تقرحات رمادية أو بنية طويلة على الأوراق",
    "Progressive leaf damage": "تلف تدريجي للأوراق",
    "Reduced photosynthetic activity": "انخفاض نشاط التمثيل الضوئي",
    "Remove or properly manage infected plant residues.": "قم بإزالة أو إدارة بقايا النباتات المصابة بشكل صحيح.",
    "Monitor the crop regularly.": "راقب المحصول بانتظام.",
    "Improve field ventilation where possible.": "حسّن تهوية الحقل حيثما أمكن.",
    "Maintain good field sanitation.": "حافظ على نظافة الحقل بشكل جيد.",
    "Use appropriate crop rotation practices.": "استخدم ممارسات الدورة الزراعية المناسبة.",
    "Monitor the crop during favorable disease conditions.": "راقب المحصول خلال الظروف المواتية لانتشار المرض.",
    "Common rust is a fungal disease that produces rust-colored lesions on corn leaves.": "الصدأ العادي هو مرض فطري ينتج تقرحات بلون الصدأ على أوراق الذرة.",
    "Small reddish-brown pustules": "بثور صغيرة بنية محمرة",
    "Leaf discoloration": "تغير لون الأوراق",
    "Monitor affected plants closely.": "راقب النباتات المصابة عن كثب.",
    "Remove severely affected leaves when practical.": "قم بإزالة الأوراق المصابة بشدة عندما يكون ذلك عملياً.",
    "Maintain proper crop management.": "حافظ على إدارة سليمة للمحصول.",
    "Inspect crops regularly.": "افحص المحاصيل بانتظام.",
    "Use appropriate resistant varieties when available.": "استخدم الأصناف المقاومة المناسبة عند توفرها.",
    "Maintain good field management.": "حافظ على إدارة جيدة للحقل.",
    "Northern leaf blight is a fungal disease that causes large lesions on corn leaves.": "لفحة الأوراق الشمالية هو مرض فطري يسبب تقرحات كبيرة على أوراق الذرة.",
    "Long gray-green lesions": "تقرحات طويلة رمادية مخضرة",
    "Leaf yellowing": "اصفرار الأوراق",
    "Manage infected crop residues.": "تعامل مع بقايا المحاصيل المصابة بشكل سليم.",
    "Improve field conditions and airflow where possible.": "حسّن ظروف الحقل والتهوية حيثما أمكن.",
    "Practice crop rotation.": "طبق الدورة الزراعية.",
    "Maintain field sanitation.": "حافظ على نظافة الحقل.",

    // --- العنب (Grape) ---
    "Black rot is a fungal disease affecting grape leaves, shoots, and berries.": "العفن الأسود هو مرض فطري يصيب أوراق وأغصان وثمار العنب.",
    "Brown or reddish leaf spots": "بقع بنية أو محمرة على الأوراق",
    "Dark lesions on berries": "تقرحات داكنة على الثمار (العنب)",
    "Shriveled infected grapes": "انكماش حبات العنب المصابة",
    "Remove infected berries and leaves.": "قم بإزالة الثمار والأوراق المصابة.",
    "Maintain good vineyard sanitation.": "حافظ على نظافة الكرم (مزرعة العنب) بشكل جيد.",
    "Improve air circulation around vines.": "حسّن التهوية حول الكروم.",
    "Remove mummified berries.": "قم بإزالة الثمار المحنطة.",
    "Monitor vines regularly.": "راقب الكروم بانتظام.",
    "Esca is a complex grapevine disease that can affect leaves, shoots, and fruit.": "إسكا العنب هو مرض معقد يصيب أوراق وأغصان وثمار العنب.",
    "Discolored areas between leaf veins": "مناطق متغيرة اللون بين عروق الأوراق",
    "Leaf deterioration": "تدهور الأوراق",
    "Dark spots on berries": "بقع داكنة على الثمار",
    "Remove severely affected plant parts.": "قم بإزالة أجزاء النبات المصابة بشدة.",
    "Monitor the vineyard regularly.": "راقب مزرعة العنب بانتظام.",
    "Maintain proper vineyard sanitation.": "حافظ على نظافة مزرعة العنب السليمة.",
    "Manage pruning wounds carefully.": "تعامل مع جروح التقليم بعناية.",
    "Remove severely diseased material when appropriate.": "قم بإزالة المواد المريضة بشدة عند الاقتضاء.",
    "Leaf blight can cause spotting and damage to grapevine leaves.": "لفحة الأوراق يمكن أن تسبب تبقع وتلف لأوراق العنب.",

    // --- البرتقال / الموالح (Orange) ---
    "Citrus greening is a serious bacterial disease that affects citrus trees.": "اخضرار الموالح (التنين الأصفر) هو مرض بكتيري خطير يصيب أشجار الحمضيات.",
    "Uneven yellowing of leaves": "اصفرار غير منتظم للأوراق",
    "Reduced fruit quality": "انخفاض جودة الثمار",
    "Poor tree growth": "ضعف نمو الشجرة",
    "Remove severely affected trees according to local agricultural guidance.": "قم بإزالة الأشجار المصابة بشدة وفقاً للإرشادات الزراعية المحلية.",
    "Manage insect vectors such as psyllids.": "كافح الحشرات الناقلة للمرض مثل حشرة البسيلا.",
    "Use healthy planting material.": "استخدم مواد زراعة سليمة وموثوقة.",
    "Monitor for insect vectors.": "راقب وجود الحشرات الناقلة للمرض.",
    "Inspect citrus trees regularly.": "افحص أشجار الحمضيات بانتظام.",

    // --- الخوخ (Peach) ---
    "Bacterial spot affects peach leaves and fruits and can reduce crop quality.": "يؤثر التبقع البكتيري على أوراق وثمار الخوخ ويمكن أن يقلل من جودة المحصول.",
    "Small dark spots on leaves": "بقع داكنة صغيرة على الأوراق",
    "Lesions on fruit": "تقرحات على الثمار",
    "Leaf damage": "تلف الأوراق",
    "Remove severely infected plant material when appropriate.": "قم بإزالة أجزاء النبات المصابة بشدة عند الاقتضاء.",
    "Avoid overhead irrigation.": "تجنب الري العلوي (الرش).",

    // --- الفلفل (Pepper) ---
    "Bacterial spot is a disease that affects pepper leaves and fruits.": "التبقع البكتيري هو مرض يصيب أوراق وثمار الفلفل.",
    "Fruit lesions": "تقرحات على الثمار",
    "Leaf yellowing or damage": "اصفرار أو تلف الأوراق",
    "Remove severely infected plant material.": "قم بإزالة أجزاء النبات المصابة بشدة.",
    "Avoid overhead watering.": "تجنب الري العلوي.",
    "Avoid working with wet plants.": "تجنب التعامل مع النباتات وهي مبللة.",

    // --- البطاطس (Potato) ---
    "Early blight is a fungal disease that commonly affects potato leaves.": "اللفحة المبكرة هو مرض فطري يصيب عادة أوراق البطاطس.",
    "Dark circular spots": "بقع دائرية داكنة",
    "Concentric ring patterns": "أنماط حلقات متداخلة",
    "Yellowing around lesions": "اصفرار حول التقرحات",
    "Maintain proper crop sanitation.": "حافظ على النظافة المناسبة للمحصول.",
    "Remove infected crop residues.": "قم بإزالة بقايا المحاصيل المصابة.",
    "Late blight is a serious disease that can rapidly damage potato foliage and tubers.": "اللفحة المتأخرة مرض خطير يمكن أن يتلف أوراق ودرنات البطاطس بسرعة.",
    "Dark water-soaked lesions": "تقرحات داكنة مشبعة بالماء",
    "Rapid leaf deterioration": "تدهور سريع للأوراق",
    "Brown or damaged tubers": "درنات بنية أو تالفة",
    "Avoid prolonged leaf moisture.": "تجنب بقاء الأوراق رطبة لفترات طويلة.",
    "Monitor the crop closely.": "راقب المحصول عن كثب.",
    "Avoid unnecessary leaf wetness.": "تجنب بلل الأوراق غير الضروري.",
    "Use disease management practices recommended locally.": "استخدم ممارسات إدارة الأمراض الموصى بها محلياً.",

    // --- الكوسا / القرعيات (Squash) ---
    "Powdery mildew produces a white powdery coating on squash leaves.": "البياض الدقيقي ينتج طبقة بيضاء مسحوقية على أوراق الكوسا.",
    "White powdery patches": "بقع بيضاء مسحوقية",
    "Reduce excessive humidity around foliage.": "قلل من الرطوبة الزائدة حول الأوراق.",
    "Avoid excessive moisture on foliage.": "تجنب الرطوبة الزائدة على الأوراق.",

    // --- الفراولة (Strawberry) ---
    "Leaf scorch causes dark lesions and damage to strawberry leaves.": "احتراق الأوراق يسبب تقرحات داكنة وتلفاً في أوراق الفراولة.",
    "Purple or dark leaf spots": "بقع أرجوانية أو داكنة على الأوراق",
    "Leaf browning": "تحول الأوراق للون البني",
    "Reduced leaf health": "تدهور صحة الأوراق",
    "Keep the growing area clean.": "حافظ على نظافة منطقة الزراعة.",

    // --- الطماطم (Tomato) ---
    "Bacterial spot affects tomato leaves and fruits.": "يؤثر التبقع البكتيري على أوراق وثمار الطماطم.",
    "Avoid handling wet plants.": "تجنب التعامل مع النباتات المبللة.",
    "Early blight is a fungal disease that commonly affects tomato leaves.": "اللفحة المبكرة هو مرض فطري يصيب عادة أوراق الطماطم.",
    "Dark circular lesions": "تقرحات دائرية داكنة",
    "Yellowing around infected areas": "اصفرار حول المناطق المصابة",
    "Maintain good garden sanitation.": "حافظ على نظافة الحديقة بشكل جيد.",
    "Remove infected plant debris.": "قم بإزالة بقايا النباتات المصابة.",
    "Late blight is a rapidly developing disease that can severely damage tomato plants.": "اللفحة المتأخرة مرض سريع التطور يمكن أن يتلف نباتات الطماطم بشدة.",
    "Brown or dark areas on stems and fruit": "مناطق بنية أو داكنة على السيقان والثمار",
    "Avoid unnecessary overhead irrigation.": "تجنب الري العلوي غير الضروري.",
    "Tomato leaf mold is a fungal disease favored by high humidity.": "عفن أوراق الطماطم هو مرض فطري ينشط في الرطوبة العالية.",
    "Yellow spots on upper leaf surfaces": "بقع صفراء على الأسطح العلوية للأوراق",
    "Mold growth on the underside of leaves": "نمو العفن على الجانب السفلي للأوراق",
    "Improve greenhouse or field ventilation.": "حسّن تهوية الصوبة الزراعية أو الحقل.",
    "Reduce excessive humidity.": "قلل الرطوبة الزائدة.",
    "Avoid excessive humidity.": "تجنب الرطوبة الزائدة.",
    "Septoria leaf spot is a fungal disease that mainly affects tomato leaves.": "تبقع أوراق السبتوريا هو مرض فطري يصيب بشكل رئيسي أوراق الطماطم.",
    "Small circular spots": "بقع دائرية صغيرة",
    "Dark borders around lesions": "حواف داكنة حول التقرحات",
    "Leaf yellowing and drop": "اصفرار وتساقط الأوراق",
    "Two-spotted spider mites are small pests that feed on plant leaves.": "سوس العنكبوت ذو البقعتين هي آفات صغيرة تتغذى على أوراق النبات.",
    "Tiny yellow or pale spots": "بقع صغيرة صفراء أو باهتة",
    "Fine webbing in severe infestations": "نسيج عنكبوتي دقيق في الإصابات الشديدة",
    "Inspect the underside of leaves.": "افحص الجانب السفلي للأوراق.",
    "Monitor the infestation closely.": "راقب الإصابة عن كثب.",
    "Maintain appropriate plant conditions.": "حافظ على ظروف بيئية مناسبة للنبات.",
    "Monitor for increasing pest populations.": "راقب تزايد أعداد الآفات.",
    "Target spot is a fungal disease that affects tomato leaves and fruit.": "البقعة المستهدفة (تارجت سبوت) هو مرض فطري يصيب أوراق وثمار الطماطم.",
    "Circular brown lesions": "تقرحات بنية دائرية",
    "Concentric rings": "حلقات متداخلة",
    "Maintain plant sanitation.": "حافظ على نظافة النبات.",
    "Tomato yellow leaf curl virus is a viral disease commonly associated with whitefly transmission.": "فيروس تجعد واصفرار أوراق الطماطم هو مرض فيروسي يرتبط عادة بانتقاله عبر الذبابة البيضاء.",
    "Yellowing of leaves": "اصفرار الأوراق",
    "Leaf curling": "تجعد الأوراق",
    "Stunted plant growth": "تقزم نمو النبات",
    "Monitor and manage whitefly populations.": "راقب وكافح مجموعات الذبابة البيضاء.",
    "Separate affected plants when possible.": "افصل النباتات المصابة متى أمكن.",
    "Monitor whiteflies regularly.": "راقب الذبابة البيضاء بانتظام.",
    "Remove infected plants when appropriate.": "قم بإزالة النباتات المصابة عند الاقتضاء.",
    "Tomato mosaic virus is a viral disease that can cause leaf and plant growth abnormalities.": "فيروس تبرقش الطماطم (الموزايك) هو مرض فيروسي يسبب تشوهات في الأوراق ونمو النبات.",
    "Mottled or mosaic leaf patterns": "أنماط مبرقشة أو فسيفسائية على الأوراق",
    "Disinfect tools between plants.": "عقم الأدوات بين النباتات.",
    "Avoid spreading plant sap between healthy and infected plants.": "تجنب نقل عصارة النبات بين النباتات السليمة والمصابة.",
    "Use clean planting material.": "استخدم مواد زراعة نظيفة.",
    "Disinfect tools regularly.": "عقم الأدوات بانتظام.",
    "Monitor plants for new symptoms.": "راقب النباتات لظهور أعراض جديدة.",

    // --- أوامر مكررة تم دمجها للسرعة ---
    "Improve air circulation.": "تحسين التهوية.",
    "Monitor the plant regularly.": "راقب النبات بانتظام.",
    "Monitor plants regularly.": "مراقبة النباتات بانتظام.",
    "Maintain proper spacing.": "حافظ على مسافات مناسبة.",
    "Avoid prolonged leaf wetness.": "تجنب بلل الأوراق لفترات طويلة.",
    "Remove severely infected leaves.": "قم بإزالة الأوراق المصابة بشدة.",
}
// =====================================================
// DISPLAY RESULT
// =====================================================

function displayResult(data) {

    // -------------------------------------------------
    // Plant
    // -------------------------------------------------

    if (resultPlant) {

        resultPlant.textContent = getLocalTranslation(
            data.plant ||
            "Unknown"
        );
    }


    // -------------------------------------------------
    // Condition
    // -------------------------------------------------

    if (resultCondition) {

        resultCondition.textContent = getLocalTranslation(
            data.condition ||
            "Unknown"
        );
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

            resultRecommendation.textContent = getLocalTranslation(
                recommendation.message
            );
        }

        else if (recommendation.description) {

            resultRecommendation.textContent = getLocalTranslation(
                recommendation.description
            );
        }

        else {

            resultRecommendation.textContent = getLocalTranslation(
                "Monitor your plant regularly."
            );
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
                getLocalTranslation("🔎 Symptoms"),
                recommendation.symptoms.map(item => getLocalTranslation(item))
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
                getLocalTranslation("🌱 Recommended Actions"),
                recommendation.actions.map(item => getLocalTranslation(item))
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
                getLocalTranslation("🛡️ Prevention"),
                recommendation.prevention.map(item => getLocalTranslation(item))
            );
        }
    }


    // -------------------------------------------------
    // Show result
    // -------------------------------------------------

    if (resultCard) {
        // إظهار زرار فحص نبات آخر
        document.getElementById("anotherButton").style.display = "block";

        // 🪄 السطرين دول هما اللي هيظهروا زرار القراءة!
        const speakBtn = document.getElementById("speakResultButton");
        if (speakBtn) speakBtn.style.display = "block";

        // السطر ده بيرجع يظهر الكارت تاني بعد التحليل
        resultCard.style.display = "flex";

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
// دالة الترجمة اللي الكود بيدور عليها
function getLocalTranslation(text) {
    if (!text) return "";
    const currentLang = document.documentElement.lang || 'en';

    if (currentLang === 'en') return text;

    return localTranslations[text] || text;
}
// =====================================================
// TEXT TO SPEECH - RESULT
// =====================================================

const speakResultButton =
    document.getElementById("speakResultButton");

let speechUtterance = null;


// =====================================================
// GET RESULT TEXT
// =====================================================

function getResultTextForSpeech() {

    const lang =
        document.documentElement.lang || "en";

    let text = "";


    // -------------------------------------------------
    // Plant
    // -------------------------------------------------

    if (resultPlant && resultPlant.textContent.trim()) {

        text +=
            lang === "ar"
                ? `النبات المكتشف هو ${resultPlant.textContent}. `
                : `The identified plant is ${resultPlant.textContent}. `;
    }


    // -------------------------------------------------
    // Condition
    // -------------------------------------------------

    if (resultCondition && resultCondition.textContent.trim()) {

        text +=
            lang === "ar"
                ? `الحالة أو المرض المكتشف هو ${resultCondition.textContent}. `
                : `The detected disease or condition is ${resultCondition.textContent}. `;
    }


    // -------------------------------------------------
    // Confidence
    // -------------------------------------------------

    if (resultConfidence && resultConfidence.textContent.trim()) {

        text +=
            lang === "ar"
                ? `نسبة ثقة الذكاء الاصطناعي هي ${resultConfidence.textContent}. `
                : `The AI confidence score is ${resultConfidence.textContent}. `;
    }


    // -------------------------------------------------
    // Recommendation
    // -------------------------------------------------

    if (
        resultRecommendation &&
        resultRecommendation.textContent.trim()
    ) {

        text +=
            lang === "ar"
                ? `التوصية: ${resultRecommendation.textContent}. `
                : `Recommendation: ${resultRecommendation.textContent}. `;
    }


    // -------------------------------------------------
    // Details
    // -------------------------------------------------

    if (resultDetails) {

        const sections =
            resultDetails.querySelectorAll(
                ".recommendation-list"
            );


        sections.forEach(function (section) {

            const heading =
                section.querySelector("h4");

            const items =
                section.querySelectorAll("li");


            if (heading) {

                text +=
                    `${heading.textContent}. `;
            }


            items.forEach(function (item) {

                text +=
                    `${item.textContent}. `;
            });

        });
    }


    return text.trim();
}


// =====================================================
// SPEAK RESULT
// =====================================================

function speakResult() {

    if (!("speechSynthesis" in window)) {

        alert(
            "Text-to-speech is not supported by your browser."
        );

        return;
    }


    const text =
        getResultTextForSpeech();


    if (!text) {
        return;
    }


    // إيقاف أي قراءة شغالة
    window.speechSynthesis.cancel();


    const lang =
        document.documentElement.lang || "en";


    speechUtterance =
        new SpeechSynthesisUtterance(text);


    // تحديد اللغة
    if (lang === "ar") {

        speechUtterance.lang =
            "ar-EG";

    } else {

        speechUtterance.lang =
            "en-US";
    }


    speechUtterance.rate = 0.9;
    speechUtterance.pitch = 1;
    speechUtterance.volume = 1;


    // -------------------------------------------------
    // تغيير شكل الزر أثناء القراءة
    // -------------------------------------------------

    if (speakResultButton) {

        speakResultButton.textContent =
            lang === "ar"
                ? "⏹ إيقاف القراءة"
                : "⏹ Stop Reading";
    }


    speechUtterance.onend =
        function () {

            updateSpeakButton();
        };


    speechUtterance.onerror =
        function () {

            updateSpeakButton();
        };


    window.speechSynthesis.speak(
        speechUtterance
    );
}


// =====================================================
// UPDATE SPEAK BUTTON
// =====================================================

function updateSpeakButton() {

    if (!speakResultButton) {
        return;
    }


    const lang =
        document.documentElement.lang || "en";


    speakResultButton.textContent =
        lang === "ar"
            ? "🔊 قراءة النتيجة"
            : "🔊 Read Result";
}


// =====================================================
// BUTTON CLICK
// =====================================================

if (speakResultButton) {

    speakResultButton.addEventListener(
        "click",
        function () {

            if (window.speechSynthesis.speaking) {

                window.speechSynthesis.cancel();

                updateSpeakButton();

            } else {

                speakResult();
            }

        }
    );
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
// =====================================================
// HAMBURGER MENU TOGGLE
// =====================================================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navContainer = document.getElementById('navContainer');

if (hamburgerBtn && navContainer) {
    hamburgerBtn.addEventListener('click', () => {
        // Toggle the 'active' class to show/hide the menu
        navContainer.classList.toggle('active');

        // Change icon between ☰ and ✕
        if (navContainer.classList.contains('active')) {
            hamburgerBtn.textContent = '✕';
        } else {
            hamburgerBtn.textContent = '☰';
        }
    });

    // Close menu when clicking a link (optional but good for UX)
    const navLinksList = navContainer.querySelectorAll('nav a');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('active');
            hamburgerBtn.textContent = '☰';
        });
    });
}


// =====================================================
// TRANSLATION & BILINGUAL SUPPORT (EN/AR)
// =====================================================
// =====================================================
// TRANSLATION & BILINGUAL SUPPORT (EN/AR)
// =====================================================

const btnEn = document.getElementById("btnEn");
const btnAr = document.getElementById("btnAr");

const translations = {
    en: {
        // Head & Nav
        page_title: "Khadrwy | AI Plant Doctor",
        nav_home: "Home",
        nav_doctor: "Plant Doctor",
        nav_monitor: "Monitoring",
        nav_assist: "AI Assistant",
        nav_about: "About",
        btn_login: "Login",
        btn_signup: "Sign Up",
        btn_logout: "Logout",

        // Auth Modals
        auth_login_title: "Welcome Back",
        auth_login_desc: "Login to your Khadrwy account.",
        auth_user: "Username",
        auth_pass: "Password",
        auth_email: "Email",
        auth_login_btn: "Login",
        auth_no_acc: "Don't have an account?",
        auth_signup_link: "Sign Up",
        auth_signup_title: "Create Account",
        auth_signup_desc: "Join Khadrwy and start caring for your plants.",
        auth_signup_btn: "Create Account",
        auth_has_acc: "Already have an account?",
        auth_login_link: "Login",

        // Placeholders
        auth_user_ph: "Enter your username",
        auth_pass_ph: "Enter your password",
        auth_user_ph2: "Choose a username",
        auth_email_ph: "Enter your email",
        auth_pass_ph2: "Create a password",

        // Hero
        hero_badge: "AI-Powered Agricultural Platform — Khadrwy",
        hero_title: "Smart Care for <br><span class='serif-highlight'>Healthier Plants.</span>",
        hero_desc: "Detect diseases instantly, monitor your farm in real-time, and get AI-driven recommendations — in Arabic or English. Built for every farmer, from smallholders to agri-enterprises.",
        hero_btn_start: "Diagnose Your Plant &rarr;",
        hero_btn_demo: "How It Works",
        stat_1_val: "38", stat_1_label: "Plant Conditions",
        stat_2_val: "AI", stat_2_label: "Powered Detection",
        stat_3_val: "Fast", stat_3_label: "Analysis",
        badge_ai: "AI Analysis Active",
        badge_pro: "Pro Feature Unlocked",

        // Plant Doctor
        doc_badge: "FREE FEATURE — ACTIVE",
        doc_title: "AI Plant<br>Doctor",
        doc_desc: "Upload a photo of your crop and our AI diagnoses disease, pests, and nutrient deficiencies in seconds — completely free.",
        up_title: "Drop your plant photo here",
        up_support: "Supports JPG, PNG, HEIC — Max 10MB",
        up_choose: "Choose Image",
        up_camera: "Take Photo",
        up_dismiss: "Dismiss",
        up_analyze: "Analyze",
        up_loading: "Analyzing...",

        // Result Card
        res_id_label: "IDENTIFIED PLANT",
        res_critical: "⚠ CRITICAL",
        res_disease_label: "Detected Disease / Condition",
        res_conf_label: "AI Confidence Score",
        res_treat_label: "TREATMENT RECOMMENDATION",
        res_scan_btn: "Scan Another Plant",

        // --- How it Works ---
        how_badge: "HOW IT WORKS",
        how_title: "Diagnosis Made Simple",
        how_desc: "From a simple leaf photo to practical plant care advice.",
        step_1_title: "Capture",
        step_1_desc: "Take a clear photo or upload an existing image of your plant leaf.",
        step_2_title: "Analyze",
        step_2_desc: "Our AI model analyzes the image and identifies the most likely condition.",
        step_3_title: "Get Advice",
        step_3_desc: "Receive an AI diagnosis with symptoms, actions, and prevention tips.",

        // --- Smart Monitoring ---
        mon_badge: "SMART MONITORING",
        mon_title: "Your Farm, Always<br>in Sight",
        mon_desc: "Real-time environmental data from precision sensors deployed across your fields<br>— delivered to you instantly, interpreted intelligently.",
        sens_temp_label: "AIR TEMPERATURE",
        sens_hum_label: "HUMIDITY",
        sens_soil_label: "SOIL MOISTURE",
        sens_light_label: "LIGHT INTENSITY",
        status_optimal: "Optimal",
        status_normal: "Normal",
        status_review: "Review",
        status_high: "High",

        // --- AI Assistant ---
        ai_badge: "AI ASSISTANT",
        ai_title: "Your Expert Agronomist,<br>Available 24 / 7",
        ai_desc: "Khadrawy's AI speaks your language — ask anything from soil chemistry to harvest timing. It learns your farm, so advice gets sharper over time.",
        ai_feat1_title: "Instant advice",
        ai_feat1_desc: "Actionable answers in seconds — no waiting, no call centres.",
        ai_feat2_title: "Pest & disease identification",
        ai_feat2_desc: "Upload a photo and get a diagnosis with a treatment plan.",
        ai_feat3_title: "Seasonal crop planning",
        ai_feat3_desc: "Personalised sowing and irrigation schedules built around your climate.",
        ai_feat4_title: "Arabic & English support",
        ai_feat4_desc: "Switch languages mid-conversation — the AI keeps up.",
        chat_name: "Khadrawy AI",
        chat_welcome: "Hello! I'm here to help with your crops. What's on your mind today?",
        chat_placeholder: "Ask anything about your farm...",

        // About (Our Mission)
        abt_mission_badge: "OUR MISSION",
        abt_mission_title: "Empowering Farmers with AI",
        abt_mission_desc: "Khadrawy was founded on a simple conviction: every farmer — regardless of farm size or technical background — deserves access to world-class agricultural intelligence.",
        abt_card1_title: "Sustainability",
        abt_card1_desc: "We design every feature to reduce chemical use, conserve water, and protect soil health — because long-term yield depends on long-term stewardship.",
        abt_card2_title: "Innovation",
        abt_card2_desc: "From satellite imagery to in-field sensor networks, we combine the best available technology to give farmers an edge rooted in evidence, not guesswork.",
        abt_card3_title: "Community",
        abt_card3_desc: "We grow stronger together. Khadrawy connects farmers, agronomists, and researchers into a shared knowledge network that benefits everyone on the platform.",
        abt_stat1_label: "ACTIVE FARMERS",
        abt_stat2_label: "HECTARES MONITORED",
        abt_stat3_label: "SATISFACTION RATE",
        abt_stat4_label: "AI AVAILABILITY",

        // Footer
        ftr_brand_desc: "Precision agriculture intelligence for the farmers who feed the world. Smarter growing starts here.",
        ftr_quick_links: "QUICK LINKS",
        ftr_link_home: "Home",
        ftr_link_monitor: "Smart Monitoring",
        ftr_link_ai: "AI Assistant",
        ftr_link_about: "About Us",
        ftr_link_pricing: "Pricing",
        ftr_link_contact: "Contact",
        ftr_resources: "RESOURCES",
        ftr_link_docs: "Documentation",
        ftr_link_blog: "Blog & Insights",
        ftr_link_guides: "Crop Guides",
        ftr_link_api: "API Access",
        ftr_link_support: "Support Centre",
        ftr_link_forum: "Community Forum",
        ftr_newsletter: "STAY IN THE KNOW",
        ftr_news_desc: "Seasonal tips, new features, and agronomy insights — delivered monthly. No spam.",
        ftr_news_ph: "your@email.com",
        ftr_news_btn: "Subscribe",
        ftr_news_privacy: "We respect your privacy. Unsubscribe any time.",
        ftr_copyright: "© 2026 Khadrawy — خضراوي. All rights reserved.",
        ftr_privacy: "Privacy Policy",
        ftr_terms: "Terms of Service",
        ftr_cookies: "Cookie Settings",
        mon_badge: "SMART MONITORING",
        mon_title: "Your Farm, Always<br>in Sight",
        mon_desc: "Real-time environmental data from precision sensors deployed across your fields<br>— delivered to you instantly, interpreted intelligently.",
        sens_temp_label: "AIR TEMPERATURE",
        sens_hum_label: "HUMIDITY",
        sens_soil_label: "SOIL MOISTURE",
        sens_light_label: "LIGHT INTENSITY",
        status_optimal: "Optimal",
        status_normal: "Normal",
        status_review: "Review",
        status_high: "High",

        // Control Panel
        ctrl_panel_title: "🚰 Irrigation Control Panel",
        ctrl_panel_desc: "Manage water pumps instantly or switch system overrides",
        status_auto: "🟢 SYSTEM: AUTO",
        status_manual: "🟠 SYSTEM: MANUAL OVERRIDE",
        btn_water_now: "💧 Water Now",
        btn_stop: "Stop",
        btn_run_for: "⏱ Run for...",
        timer_10m: "10 Minutes",
        timer_30m: "30 Minutes",
        timer_1h: "1 Hour",

        // --- Smart Automation Settings Modal ---
        nav_settings: "Settings",
        set_badge: "IOT AUTOMATION",
        set_title: "Smart Automation Settings",
        set_desc: "Configure intelligent irrigation rules for your connected water pump based on real-time sensor data.",
        set_preset_title: "Apply Smart Presets",
        set_preset_desc: "Auto-fill optimal values based on selected crop & growth stage",
        set_preset_btn: "Apply Smart Presets",
        set_c1_title: "Field & Crop Profile",
        set_c1_desc: "Define the crop context for smart threshold calibration",
        set_lbl_crop: "CROP TYPE",
        set_opt_select_crop: "Select crop...",
        set_opt_apple: "Apple",
        set_opt_blueberry: "Blueberry",
        set_opt_cherry: "Cherry",
        set_opt_corn: "Corn / Maize",
        set_opt_grape: "Grape",
        set_opt_orange: "Orange",
        set_opt_peach: "Peach",
        set_opt_pepper: "Pepper bell",
        set_opt_potato: "Potato",
        set_opt_raspberry: "Raspberry",
        set_opt_soybean: "Soybean",
        set_opt_squash: "Squash",
        set_opt_strawberry: "Strawberry",
        set_opt_tomato: "Tomato",
        set_lbl_growth: "GROWTH STAGE",
        set_opt_seed: "Seed",
        set_opt_germination: "Germination",
        set_opt_seedling: "Seedling",
        set_opt_vegetative: "Vegetative Growth",
        set_opt_budding: "Budding",
        set_opt_flowering: "Flowering",
        set_opt_fruiting: "Fruiting",
        set_opt_ripening: "Ripening / Maturity",
        set_lbl_soil: "SOIL TYPE",
        set_opt_loamy: "Loamy Soil",
        set_opt_sandy: "Sandy Soil",
        set_opt_clay: "Clay Soil",
        set_opt_silty: "Silty Soil",
        set_opt_peaty: "Peaty Soil",
        set_opt_chalky: "Chalky Soil",
        set_c2_title: "Automation Thresholds",
        set_c2_desc: "Set the soil moisture levels that trigger pump ON/OFF cycles",
        set_lbl_turnon: "TURN ON BELOW",
        set_lbl_turnoff: "TURN OFF ABOVE",
        set_lbl_hightemp: "HIGH TEMPERATURE OVERRIDE",
        set_hightemp_title: "High Temperature Override",
        set_hightemp_desc: "Briefly run the pump for cooling when air temperature exceeds the set threshold",
        set_c3_title: "Pump & Safety Settings",
        set_c3_desc: "Protect equipment and prevent flooding with hard limits",
        set_lbl_mode: "OPERATION MODE",
        set_mode_auto: "Auto",
        set_mode_timer: "Timer",
        set_mode_manual: "Manual",
        set_lbl_maxrun: "MAX RUN TIME",
        set_lbl_cooldown: "COOLDOWN PERIOD",
        set_c4_title: "Time Restrictions",
        set_c4_desc: "Prevent irrigation during peak-sun hours to reduce evaporation loss",
        set_lbl_start: "DO NOT WATER — START",
        set_lbl_through: "through",
        set_lbl_end: "DO NOT WATER — END",
        set_btn_reset: "Reset to Defaults",
        set_btn_save: "💾 Save Automation Settings",
        ctrl_panel_title: "🚰 Irrigation Control Panel",
        ctrl_panel_desc: "Manage water pumps instantly or switch system overrides",
        status_auto_label: "🟢 SYSTEM: AUTO",
        status_manual_label: "🟠 SYSTEM: MANUAL OVERRIDE",
        btn_water_now: "💧 Water Now",
        btn_stop: "Stop",
        btn_run_for: "⏱ Run for...",
        timer_10m: "10 Minutes",
        timer_30m: "30 Minutes",
        timer_1h: "1 Hour",
        btn_water_now: "💧 Water Now",
        btn_stop: "🛑 Stop Water",
    },
    ar: {
        // Head & Nav
        page_title: "خضراوي | طبيب النباتات الذكي",
        nav_home: "الرئيسية",
        nav_doctor: "الفحص الذكي",
        nav_monitor: "المراقبة",
        nav_assist: "المساعد الذكي",
        nav_about: "من نحن",
        btn_login: "تسجيل الدخول",
        btn_signup: "حساب جديد",
        btn_logout: "تسجيل الخروج",

        // Auth Modals
        auth_login_title: "مرحباً بعودتك",
        auth_login_desc: "سجل الدخول إلى حسابك في خضراوي.",
        auth_user: "اسم المستخدم",
        auth_pass: "كلمة المرور",
        auth_email: "البريد الإلكتروني",
        auth_login_btn: "دخول",
        auth_no_acc: "ليس لديك حساب؟",
        auth_signup_link: "سجل الآن",
        auth_signup_title: "إنشاء حساب",
        auth_signup_desc: "انضم لخضراوي وابدأ في العناية بنباتاتك.",
        auth_signup_btn: "إنشاء حساب",
        auth_has_acc: "لديك حساب بالفعل؟",
        auth_login_link: "تسجيل الدخول",

        // Placeholders
        auth_user_ph: "أدخل اسم المستخدم",
        auth_pass_ph: "أدخل كلمة المرور",
        auth_user_ph2: "اختر اسم مستخدم",
        auth_email_ph: "أدخل بريدك الإلكتروني",
        auth_pass_ph2: "أنشئ كلمة مرور",

        // Hero
        hero_badge: "منصة زراعية مدعومة بالذكاء الاصطناعي — خضراوي",
        hero_title: "رعاية ذكية لـ <br><span class='serif-highlight'>محاصيل أكثر صحة.</span>",
        hero_desc: "اكتشف الأمراض فوراً، راقب مزرعتك في الوقت الفعلي، واحصل على توصيات دقيقة بالذكاء الاصطناعي — صُمم ليناسب كل مزارع.",
        hero_btn_start: "افحص نباتك الآن &larr;",
        hero_btn_demo: "كيف يعمل؟",
        stat_1_val: "38", stat_1_label: "حالة مرضية",
        stat_2_val: "AI", stat_2_label: "فحص بالذكاء الاصطناعي",
        stat_3_val: "سريع", stat_3_label: "تحليل فوري",
        badge_ai: "التحليل الذكي مُفعل",
        badge_pro: "ميزة Pro مُتاحة",

        // Plant Doctor
        doc_badge: "ميزة مجانية — مُفعلة",
        doc_title: "طبيب النباتات<br>الذكي",
        doc_desc: "ارفع صورة لمحصولك وسيقوم الذكاء الاصطناعي بتشخيص الأمراض والآفات ونقص التغذية في ثوانٍ — مجاناً تماماً.",
        up_title: "اسحب صورة النبات هنا",
        up_support: "يدعم JPG, PNG, HEIC — بحد أقصى 10MB",
        up_choose: "اختر صورة",
        up_camera: "التقط صورة",
        up_dismiss: "إلغاء",
        up_analyze: "تحليل",
        up_loading: "جاري التحليل...",

        // Result Card
        res_id_label: "النبات المُكتشف",
        res_critical: "⚠ خطير",
        res_disease_label: "المرض / الحالة المُكتشفة",
        res_conf_label: "نسبة دقة الذكاء الاصطناعي",
        res_treat_label: "توصيات العلاج",
        res_scan_btn: "فحص نبات آخر",

        // --- How it Works ---
        how_badge: "كيف يعمل؟",
        how_title: "التشخيص الزراعي أصبح أسهل",
        how_desc: "من مجرد صورة لورقة النبات إلى نصائح عملية للعناية به.",
        step_1_title: "التقط صورة",
        step_1_desc: "التقط صورة واضحة أو ارفع صورة موجودة لورقة نباتك.",
        step_2_title: "الفحص والتحليل",
        step_2_desc: "يقوم نموذج الذكاء الاصطناعي الخاص بنا بتحليل الصورة وتحديد الحالة الأكثر احتمالاً.",
        step_3_title: "احصل على النصيحة",
        step_3_desc: "احصل على تشخيص دقيق مع الأعراض، والإجراءات، ونصائح الوقاية.",

        // --- Smart Monitoring ---
        mon_badge: "المراقبة الذكية",
        mon_title: "مزرعتك، دائماً<br>تحت نظرك",
        mon_desc: "بيانات بيئية لحظية من مستشعرات دقيقة موزعة في حقلك<br>— تصلك فوراً، وتُحلل بذكاء.",
        sens_temp_label: "درجة حرارة الهواء",
        sens_hum_label: "الرطوبة",
        sens_soil_label: "رطوبة التربة",
        sens_light_label: "شدة الإضاءة",
        status_optimal: "مثالي",
        status_normal: "طبيعي",
        status_review: "يحتاج مراجعة",
        status_high: "مرتفع",

        // --- AI Assistant ---
        ai_badge: "المساعد الذكي",
        ai_title: "مهندسك الزراعي الخبير،<br>متاح على مدار الساعة",
        ai_desc: "الذكاء الاصطناعي في خضراوي يتحدث لغتك — اسأل عن أي شيء من كيمياء التربة إلى مواعيد الحصاد. إنه يتعلم تفاصيل مزرعتك لتصبح النصائح أدق بمرور الوقت.",
        ai_feat1_title: "نصائح فورية",
        ai_feat1_desc: "إجابات عملية في ثوانٍ — بلا انتظار، وبلا حاجة لمراكز الاتصال.",
        ai_feat2_title: "التعرف على الآفات والأمراض",
        ai_feat2_desc: "ارفع صورة واحصل على تشخيص دقيق مع خطة علاج متكاملة.",
        ai_feat3_title: "تخطيط المحاصيل الموسمي",
        ai_feat3_desc: "جداول مخصصة للزراعة والري مصممة خصيصاً لتناسب مناخ منطقتك.",
        ai_feat4_title: "دعم باللغتين العربية والإنجليزية",
        ai_feat4_desc: "بدّل بين اللغتين في منتصف المحادثة — والذكاء الاصطناعي سيجاريك بسهولة.",
        chat_name: "خضراوي AI",
        chat_welcome: "أهلاً بك! أنا هنا لمساعدتك في محاصيلك. بم تفكر اليوم؟",
        chat_placeholder: "اسأل عن أي شيء يخص مزرعتك...",

        // About (Our Mission)
        abt_mission_badge: "مهمتنا",
        abt_mission_title: "تمكين المزارعين من خلال الذكاء الاصطناعي",
        abt_mission_desc: "تأسست خضراوي على قناعة بسيطة: كل مزارع — بغض النظر عن حجم مزرعته أو خلفيته التقنية — يستحق الوصول إلى ذكاء زراعي بمستوى عالمي.",
        abt_card1_title: "الاستدامة",
        abt_card1_desc: "نصمم كل ميزة لتقليل استخدام المواد الكيميائية، والحفاظ على المياه، وحماية صحة التربة — لأن المحصول طويل الأجل يعتمد على الرعاية طويلة الأجل.",
        abt_card2_title: "الابتكار",
        abt_card2_desc: "من صور الأقمار الصناعية إلى شبكات الاستشعار في الحقل، نجمع أفضل التقنيات المتاحة لمنح المزارعين ميزة مبنية على الأدلة، وليس التخمين.",
        abt_card3_title: "المجتمع",
        abt_card3_desc: "ننمو معاً بقوة أكبر. تربط خضراوي المزارعين والمهندسين الزراعيين والباحثين في شبكة معرفية مشتركة تفيد الجميع على المنصة.",
        abt_stat1_label: "مزارع نشط",
        abt_stat2_label: "هكتار تحت المراقبة",
        abt_stat3_label: "نسبة الرضا",
        abt_stat4_label: "توفر الذكاء الاصطناعي",

        // Footer
        ftr_brand_desc: "ذكاء زراعي دقيق للمزارعين الذين يطعمون العالم. الزراعة الأذكى تبدأ من هنا.",
        ftr_quick_links: "روابط سريعة",
        ftr_link_home: "الرئيسية",
        ftr_link_monitor: "المراقبة الذكية",
        ftr_link_ai: "المساعد الذكي",
        ftr_link_about: "من نحن",
        ftr_link_pricing: "الباقات والأسعار",
        ftr_link_contact: "اتصل بنا",
        ftr_resources: "المصادر",
        ftr_link_docs: "دليل الاستخدام",
        ftr_link_blog: "المدونة والمقالات",
        ftr_link_guides: "أدلة المحاصيل",
        ftr_link_api: "الوصول للـ API",
        ftr_link_support: "مركز الدعم",
        ftr_link_forum: "مجتمع المزارعين",
        ftr_newsletter: "ابقَ على اطلاع",
        ftr_news_desc: "نصائح موسمية، ميزات جديدة، ورؤى زراعية دقيقة — تصلك شهرياً. بدون رسائل مزعجة.",
        ftr_news_ph: "بريدك@الإلكتروني.com",
        ftr_news_btn: "اشتراك",
        ftr_news_privacy: "نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.",
        ftr_copyright: "© 2026 خضراوي. جميع الحقوق محفوظة.",
        ftr_privacy: "سياسة الخصوصية",
        ftr_terms: "شروط الخدمة",
        ftr_cookies: "إعدادات ملفات تعريف الارتباط",
        // --- Smart Monitoring & Control Panel ---
        mon_badge: "المراقبة الذكية",
        mon_title: "مزرعتك، دائماً<br>تحت نظرك",
        mon_desc: "بيانات بيئية لحظية من مستشعرات دقيقة موزعة في حقلك<br>— تصلك فوراً، وتُحلل بذكاء.",
        sens_temp_label: "درجة حرارة الهواء",
        sens_hum_label: "الرطوبة",
        sens_soil_label: "رطوبة التربة",
        sens_light_label: "شدة الإضاءة",
        status_optimal: "مثالي",
        status_normal: "طبيعي",
        status_review: "يحتاج مراجعة",
        status_high: "مرتفع",

        // Control Panel
        ctrl_panel_title: "🚰 لوحة تحكم الري",
        ctrl_panel_desc: "إدارة مضخات المياه فورياً أو تبديل وضع النظام",
        btn_run_for: "⏱ Run for...",
        timer_10m: "10 دقائق",
        timer_30m: "30 دقيقة",
        timer_1h: "ساعة واحدة",

        // --- Smart Automation Settings Modal ---
        nav_settings: "الإعدادات",
        set_badge: "أتمتة إنترنت الأشياء",
        set_title: "إعدادات الأتمتة الذكية",
        set_desc: "تهيئة قواعد الري الذكية لمضخة المياه المتصلة بناءً على بيانات المستشعرات في الوقت الفعلي.",
        set_preset_title: "تطبيق الإعدادات المسبقة الذكية",
        set_preset_desc: "املأ القيم المثلى تلقائياً بناءً على المحصول المختار ومرحلة النمو",
        set_preset_btn: "تطبيق الإعدادات المسبقة الذكية",
        set_c1_title: "ملف الحقل والمحصول",
        set_c1_desc: "حدد سياق المحصول معايرة العتبات الذكية",
        set_lbl_crop: "نوع المحصول",
        set_opt_select_crop: "اختر المحصول...",
        set_opt_apple: "تفاح",
        set_opt_blueberry: "توت أزرق",
        set_opt_cherry: "كرز",
        set_opt_corn: "ذرة",
        set_opt_grape: "عنب",
        set_opt_orange: "برتقال",
        set_opt_peach: "خوخ",
        set_opt_pepper: "فلفل حلو",
        set_opt_potato: "بطاطس",
        set_opt_raspberry: "توت عليق",
        set_opt_soybean: "فول صويا",
        set_opt_squash: "كوسة",
        set_opt_strawberry: "فراولة",
        set_opt_tomato: "طماطم",
        set_lbl_growth: "مرحلة النمو",
        set_opt_seed: "بذرة",
        set_opt_germination: "إنبات",
        set_opt_seedling: "بادرة",
        set_opt_vegetative: "نمو خضري",
        set_opt_budding: "تزهر / براعم",
        set_opt_flowering: "إزهار",
        set_opt_fruiting: "إثمار",
        set_opt_ripening: "نضج / اكتمال",
        set_lbl_soil: "نوع التربة",
        set_opt_loamy: "تربة طينية صفصالية",
        set_opt_sandy: "تربة رملية",
        set_opt_clay: "تربة طينية",
        set_opt_silty: "تربة غرينية",
        set_opt_peaty: "تربة عضوية (بيتي)",
        set_opt_chalky: "تربة طباشيرية",
        set_c2_title: "عتبات الأتمتة",
        set_c2_desc: "ضبط مستويات رطوبة التربة التي تؤدي إلى دورات تشغيل/إيقاف المضخة",
        set_lbl_turnon: "التحفيز للتشغيل أدنى من",
        set_lbl_turnoff: "إيقاف التشغيل أعلى من",
        set_lbl_hightemp: "تجاوز درجة الحرارة المرتفعة",
        set_hightemp_title: "تجاوز درجة الحرارة المرتفعة",
        set_hightemp_desc: "تشغيل المضخة لفترة وجيزة للتبريد عندما تتجاوز درجة حرارة الهواء العتبة المحددة",
        set_c3_title: "إعدادات المضخة والأمان",
        set_c3_desc: "حماية المعدات ومنع الفيضانات بحدود صارمة",
        set_lbl_mode: "وضع التشغيل",
        set_mode_auto: "تلقائي",
        set_mode_timer: "مؤقت",
        set_mode_manual: "يدوي",
        set_lbl_maxrun: "أقصى وقت تشغيل",
        set_lbl_cooldown: "فترة التبريد",
        set_c4_title: "قيود الوقت",
        set_c4_desc: "منع الري خلال ساعات ذروة الشمس لتقليل الفقد الناتج عن التبخر",
        set_lbl_start: "عدم الري — البدء",
        set_lbl_through: "إلى",
        set_lbl_end: "عدم الري — الانتهاء",
        set_btn_reset: "إعادة الضبط إلى الافتراضيات",
        set_btn_save: "💾 حفظ إعدادات الأتمتة",
        // --- Control Panel ---
        ctrl_panel_title: "🚰 لوحة تحكم الري",
        ctrl_panel_desc: "إدارة مضخات المياه فورياً أو تبديل وضع النظام",
        status_auto_label: "🟢 النظام: تلقائي",
        status_manual_label: "🟠 النظام: تحكم يدوي",
        btn_water_now: "💧 اروي الآن",
        btn_stop: "إيقاف",
        btn_run_for: "⏱ تشغيل لمدة...",
        timer_10m: "10 دقائق",
        timer_30m: "30 دقيقة",
        timer_1h: "ساعة واحدة",
        btn_water_now: "💧 اروي الآن",
        btn_stop: "🛑 إيقاف الري",
    }
};

function setLanguage(lang) {
    localStorage.setItem('khadrwy_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    if (lang === 'ar') {
        if (btnAr) btnAr.classList.add('active');
        if (btnEn) btnEn.classList.remove('active');
        // تعديلات ستايل إضافية للعربي عشان الخط يكون متناسق
        document.body.style.fontFamily = "'Cairo', Arial, sans-serif";
        document.querySelectorAll('.serif-highlight').forEach(el => el.style.fontFamily = "'Cairo', serif");
    } else {
        if (btnEn) btnEn.classList.add('active');
        if (btnAr) btnAr.classList.remove('active');
        document.body.style.fontFamily = "Arial, Helvetica, sans-serif";
        document.querySelectorAll('.serif-highlight').forEach(el => el.style.fontFamily = "'Georgia', serif");
    }

    // ترجمة النصوص العادية
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            // لو كان العنوان بتاع الصفحة
            if (el.tagName === 'TITLE') {
                document.title = translations[lang][key];
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });

    // ترجمة الـ Placeholders في الـ Inputs
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
    updateSpeakButton();
}

// إضافة المستمعين لزراير اللغة
if (btnEn) btnEn.addEventListener("click", () => setLanguage("en"));
if (btnAr) btnAr.addEventListener("click", () => setLanguage("ar"));

// تشغيل اللغة المحفوظة أول ما الصفحة تفتح
document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem('khadrwy_lang') || 'en';
    setLanguage(savedLang);
});
// =====================================================
// RESET BUTTON (إخفاء النتيجة لفحص نبات جديد) 
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    // استخدمنا anotherButton زي ما هو مكتوب في الـ HTML عندك
    const resetBtn = document.getElementById("anotherButton");
    const cardToHide = document.getElementById("resultCard");

    if (resetBtn) {
        resetBtn.addEventListener("click", (e) => {
            // إخفاء زرار قراءة النتيجة
            const speakBtn = document.getElementById("speakResultButton");
            if (speakBtn) speakBtn.style.display = "none";
            // منع أي تحديث للصفحة
            document.getElementById("anotherButton").style.display = "none";
            if (cardToHide) {
                // إخفاء الكارت نهائياً
                cardToHide.classList.remove("show");
                cardToHide.style.display = "none";
            }

            // تمرير الشاشة لفوق عند مربع سحب الصورة
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});
// =====================================================
// AI CHATBOT LOGIC (Front-end Simulation)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatBody = document.getElementById("chatBody");

    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const userText = chatInput.value.trim();
            if (!userText) return;

            // 1. إضافة رسالة المستخدم
            appendMessage(userText, "user-message");
            chatInput.value = "";

            // 2. إظهار حالة جاري الكتابة "Typing..."
            const typingId = showTypingIndicator();

            // 3. محاكاة رد الـ API بعد ثانيتين
            setTimeout(() => {
                removeTypingIndicator(typingId);
                // هنا مستقبلاً هتحطي الـ Response اللي راجع من الموديل بتاعك
                const aiResponse = "I recommend checking the soil moisture levels first. If drainage is fine, consider applying a balanced NPK feed to support healthy growth.";
                appendMessage(aiResponse, "ai-message");
            }, 2000);
        });
    }

    // دالة لطباعة الرسالة في الشات
    function appendMessage(text, className) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${className}`;
        msgDiv.innerHTML = `
            <div class="bubble">${text}</div>
            <span class="msg-time">${time}</span>
        `;
        chatBody.appendChild(msgDiv);
        scrollToBottom();
    }

    // دالة لإظهار النقط المتحركة (جاري الكتابة)
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

    // دالة لإخفاء النقط
    function removeTypingIndicator(id) {
        const typingDiv = document.getElementById(id);
        if (typingDiv) {
            typingDiv.remove();
        }
    }

    // دالة للنزول لآخر رسالة أوتوماتيك
    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});// =====================================================
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

    // دالة فتح النافذة
    function openSettingsModal(e) {
        if (e) e.preventDefault();
        if (settingsOverlay) settingsOverlay.style.display = "flex";
        loadSavedSettingsState();
    }

    // دالة غلق النافذة
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

    // قفل أو فتح الحقول
    function setFormFieldsDisabled(disabled) {
        const elements = [
            cropTypeSelect, growthStageSelect, soilTypeSelect,
            sliderOnInput, sliderOffInput, tempOverrideToggle,
            tempThresholdInput, maxRunInput, cooldownInput,
            timeStartInput, timeEndInput, resetSettingsBtn,
            document.getElementById("applyPresetsBtn")
        ];

        elements.forEach(el => {
            if (el) el.disabled = disabled;
        });
    }

    // تحديث نص زر الحفظ ليصبح Save أو Update حسب الحالة
    function updateSaveButtonState() {
        const saveBtn = automationForm?.querySelector("button[type='submit']");
        if (!saveBtn) return;

        const lang = document.documentElement.lang || 'en';
        if (isEditMode) {
            saveBtn.textContent = lang === 'ar' ? "💾 تحديث الإعدادات (Update)" : "💾 Update Settings";
        } else {
            saveBtn.textContent = lang === 'ar' ? "💾 حفظ إعدادات الأتمتة" : "💾 Save Automation Settings";
        }
    }

    function loadSavedSettingsState() {
        const isSaved = localStorage.getItem('khadrwy_settings_saved') === 'true';
        const data = getSavedSettings();

        if (isSaved && data) {
            if (cropTypeSelect) cropTypeSelect.value = data.cropType || "";
            if (growthStageSelect) growthStageSelect.value = data.growthStage || "";
            if (soilTypeSelect) soilTypeSelect.value = data.soilType || "";
            if (sliderOnInput) sliderOnInput.value = data.sliderOn || 52;
            if (sliderOffInput) sliderOffInput.value = data.sliderOff || 70;
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

    // دالة التحقق من صحة المدخلات (Validation)
    function validateForm() {
        const lang = document.documentElement.lang || 'en';

        // 1. التحقق من اختيار نوع المحصول
        if (!cropTypeSelect || !cropTypeSelect.value) {
            alert(lang === 'ar' ? "خطأ: يرجى اختيار نوع المحصول!" : "Error: Please select a crop type!");
            cropTypeSelect?.focus();
            return false;
        }

        // 2. التحقق من عتبات الرطوبة (Turn On يجب أن تكون أقل من Turn Off)
        const onVal = parseInt(sliderOnInput?.value || 0);
        const offVal = parseInt(sliderOffInput?.value || 0);
        if (onVal >= offVal) {
            alert(lang === 'ar' 
                ? "خطأ: قيمة 'الفتح أدنى من' يجب أن تكون أقل من قيمة 'الإيقاف أعلى من'!" 
                : "Error: 'Turn On Below' value must be less than 'Turn Off Above' value!");
            sliderOnInput?.focus();
            return false;
        }

        // 3. التحقق من درجة الحرارة العالية
        const tempVal = parseInt(tempThresholdInput?.value || 0);
        if (tempVal < 20 || tempVal > 50) {
            alert(lang === 'ar' 
                ? "خطأ: درجة حرارة تجاوز الحرارة يجب أن تكون بين 20 و 50 درجة مئوية!" 
                : "Error: Temperature threshold must be between 20°C and 50°C!");
            tempThresholdInput?.focus();
            return false;
        }

        // 4. التحقق من أقصى وقت تشغيل (Max Run Time)
        const maxRunVal = parseInt(maxRunInput?.value || 0);
        if (maxRunVal < 1 || maxRunVal > 120) {
            alert(lang === 'ar' 
                ? "خطأ: أقصى وقت تشغيل يجب أن يكون بين 1 و 120 دقيقة!" 
                : "Error: Max run time must be between 1 and 120 minutes!");
            maxRunInput?.focus();
            return false;
        }

        // 5. التحقق من فترة التبريد (Cooldown Period)
        const cooldownVal = parseInt(cooldownInput?.value || 0);
        if (cooldownVal < 1 || cooldownVal > 24) {
            alert(lang === 'ar' 
                ? "خطأ: فترة التبريد يجب أن تكون بين 1 و 24 ساعة!" 
                : "Error: Cooldown period must be between 1 and 24 hours!");
            cooldownInput?.focus();
            return false;
        }

        // 6. التحقق من أوقات الحظر (Time Restrictions)
        if (!timeStartInput?.value || !timeEndInput?.value) {
            alert(lang === 'ar' ? "خطأ: يرجى تحديد أوقات حظر الري بنجاح!" : "Error: Please specify valid restriction times!");
            return false;
        }

        return true; // كل الفاليديشن سليمة
    }

    // التعامل مع الحفظ أو التحديث
    if (automationForm) {
        automationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const lang = document.documentElement.lang || 'en';

            // 1. التأكد من تسجيل الدخول
            if (!accessToken) {
                const loginMsg = lang === 'ar' 
                    ? "يجب تسجيل الدخول أولاً لحفظ الإعدادات!" 
                    : "You must login first to save settings!";
                alert(loginMsg);
                closeSettingsModal();
                openLogin();
                return;
            }

            // لو الحقول مقفولة وهو داس على الزرار، معناه إنه عايز يعمل "تعديل" (Edit) ويفتح الحقول
            if (isEditMode && cropTypeSelect.disabled) {
                setFormFieldsDisabled(false);
                updateSaveButtonState();
                return;
            }

            // 2. تطبيق الفاليديشن قبل الحفظ النهائي
            if (!validateForm()) {
                return; // هيوقف التنفيذ ويظهر الأخطاء لغاية ما كل الشروط تتحقق
            }

            // 3. حفظ البيانات بعد تخطي الفاليديشن بنجاح
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

            // قفل الحقول وتحويل الزر لوضع الـ Edit
            isEditMode = true;
            setFormFieldsDisabled(true);
            updateSaveButtonState();

            // إغلاق المودال والانتقال التلقائي لسيكشن الـ Monitoring
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

    // دالة ذكية لتلوين الشريط حسب النسبة واللغة
    function updateSliderFill(slider, valElement) {
        if (!slider || !valElement) return;
        const value = slider.value;
        valElement.textContent = value;
        const progress = (value / slider.max) * 100;

        // التحقق هل الموقع عربي ولا إنجليزي لضبط اتجاه التلوين
        const isRTL = document.documentElement.dir === 'rtl';
        const direction = isRTL ? 'to left' : 'to right';

        // تلوين الجزء اللي قبل الدايرة بالأخضر واللي بعدها بالرمادي
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

    // عشان اللون يظبط تلقائياً لو غيرنا اللغة من النافبار
    document.getElementById("btnAr")?.addEventListener("click", () => {
        setTimeout(() => { updateSliderFill(sliderOn, valOn); updateSliderFill(sliderOff, valOff); }, 50);
    });
    document.getElementById("btnEn")?.addEventListener("click", () => {
        setTimeout(() => { updateSliderFill(sliderOn, valOn); updateSliderFill(sliderOff, valOff); }, 50);
    });

    // زرار الـ Smart Presets
    const applyPresetsBtn = document.getElementById("applyPresetsBtn");
    if (applyPresetsBtn) {
        applyPresetsBtn.addEventListener("click", () => {
            const crop = document.getElementById("cropType").value;
            if (!crop) {
                alert(document.documentElement.lang === 'ar' ? "يرجى اختيار نوع المحصول أولاً!" : "Please select a crop type first!");
                return;
            }
            // أرقام عشوائية كمثال لتطبيق الإعدادات
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

    // دالة مساعدة لمعرفة هل اللغة الحالية عربية أم لا
    function isArabic() {
        return document.documentElement.getAttribute("dir") === "rtl";
    }

    // 1. تبديل حالة زرار Manual (تشغيل / إيقاف)
    if (manualWaterBtn) {
        manualWaterBtn.addEventListener("click", () => {
            isManualRunning = !isManualRunning;

            if (isManualRunning) {
                // تفعيل وضع اليدوي
                manualWaterBtn.textContent = isArabic() ? "🛑 إيقاف الري" : "🛑 Stop Water";
                manualWaterBtn.classList.add("active-stop");
                setSystemStatus("manual", isArabic() ? "🟠 النظام: تحكم يدوي" : "🟠 SYSTEM: MANUAL OVERRIDE");

                // إلغاء أي مؤقت سابق لو كان شغال
                if (activeTimer) clearTimeout(activeTimer);
            } else {
                // إيقاف الوضع اليدوي والرجوع للأوتوماتيك
                resetManualState();
            }
        });
    }

    // 2. إظهار/إخفاء قائمة الـ Timer السريع
    if (timerDropdownBtn && timerMenu) {
        timerDropdownBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = timerMenu.style.display === "flex";
            timerMenu.style.display = isOpen ? "none" : "flex";
        });

        // غلق القائمة لو اليوزر داس بره
        document.addEventListener("click", () => {
            timerMenu.style.display = "none";
        });
    }

    // 3. اختيار مدة المؤقت السريع (10 دقائق، 30 دقيقة، ساعة)
    const timerOptions = document.querySelectorAll(".timer-option");
    timerOptions.forEach(option => {
        option.addEventListener("click", function () {
            const minutes = parseInt(this.getAttribute("data-minutes"));

            // تفعيل حالة التشغيل اليدوي المؤقت
            isManualRunning = true;
            if (manualWaterBtn) {
                manualWaterBtn.textContent = isArabic() ? "🛑 إيقاف الري" : "🛑 Stop Water";
                manualWaterBtn.classList.add("active-stop");
            }

            const timerTextAr = minutes === 60 ? "ساعة واحدة" : `${minutes} دقائق`;
            const timerTextEn = minutes === 60 ? "1 Hour" : `${minutes}m Timer`;

            setSystemStatus("manual", isArabic() ? `🟠 النظام: يدوي (${timerTextAr})` : `🟠 SYSTEM: MANUAL (${timerTextEn})`);
            if (timerMenu) timerMenu.style.display = "none";

            // محاكاة انتهاء المؤقت تلقائياً وإرجاع السيستم للوضع الأوتوماتيكي
            if (activeTimer) clearTimeout(activeTimer);
            activeTimer = setTimeout(() => {
                resetManualState();
            }, minutes * 60 * 1000);
        });
    });

    // دالة إعادة السيستم للوضع التلقائي
    function resetManualState() {
        isManualRunning = false;
        if (manualWaterBtn) {
            manualWaterBtn.textContent = isArabic() ? "💧 اوي الآن" : "💧 Water Now";
            manualWaterBtn.classList.remove("active-stop");
        }
        setSystemStatus("auto", isArabic() ? "🟢 النظام: تلقائي" : "🟢 SYSTEM: AUTO");
        if (activeTimer) clearTimeout(activeTimer);
    }

    // دالة تغيير مؤشر الحالة والتصميم
    function setSystemStatus(mode, text) {
        if (!systemStatusBadge) return;
        systemStatusBadge.textContent = text;
        systemStatusBadge.className = "status-badge-indicator " + (mode === "manual" ? "status-manual" : "status-auto");
    }
});