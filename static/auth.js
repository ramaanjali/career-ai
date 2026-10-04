
/* =========================================================
   PDF AI ASSISTANT
   AUTH.JS
   Login + Signup
   ========================================================= */


/* =========================================================
   PASSWORD SHOW / HIDE
   ========================================================= */

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (!input) {
        console.error("Password input not found:", inputId);
        return;
    }

    if (input.type === "password") {
        input.type = "text";

        button.textContent = "🙈";

        button.setAttribute(
            "aria-label",
            "Hide password"
        );

    } else {

        input.type = "password";

        button.textContent = "👁";

        button.setAttribute(
            "aria-label",
            "Show password"
        );
    }
}


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("auth.js loaded successfully");


    /* =====================================================
       SIGNUP ELEMENTS
       ===================================================== */

    const signupForm =
        document.getElementById("signupForm");

    const password =
        document.getElementById("password");

    const confirmPassword =
        document.getElementById("confirm_password");

    const passwordMatch =
        document.getElementById("passwordMatch");

    const strengthText =
        document.getElementById("strengthText");

    const strengthBars =
        document.querySelectorAll(
            ".strength-bar span"
        );


    /* =====================================================
       PASSWORD STRENGTH
       ===================================================== */

    if (password) {

        password.addEventListener(
            "input",
            function () {

                const value = password.value;

                let score = 0;

                if (value.length >= 6) {
                    score++;
                }

                if (/[A-Z]/.test(value)) {
                    score++;
                }

                if (/[0-9]/.test(value)) {
                    score++;
                }

                if (/[^A-Za-z0-9]/.test(value)) {
                    score++;
                }


                /* -----------------------------------------
                   UPDATE BARS
                   ----------------------------------------- */

                strengthBars.forEach(
                    function (bar, index) {

                        if (index < score) {
                            bar.classList.add("active");
                        } else {
                            bar.classList.remove("active");
                        }

                    }
                );


                /* -----------------------------------------
                   UPDATE TEXT
                   ----------------------------------------- */

                if (value.length === 0) {

                    if (strengthText) {
                        strengthText.textContent =
                            "Create a strong password";
                    }

                } else if (score === 1) {

                    if (strengthText) {
                        strengthText.textContent =
                            "Weak password";
                    }

                } else if (score === 2) {

                    if (strengthText) {
                        strengthText.textContent =
                            "Medium password";
                    }

                } else if (score === 3) {

                    if (strengthText) {
                        strengthText.textContent =
                            "Good password";
                    }

                } else {

                    if (strengthText) {
                        strengthText.textContent =
                            "Strong password ✓";
                    }
                }


                checkPasswordMatch();

            }
        );
    }


    /* =====================================================
       CONFIRM PASSWORD
       ===================================================== */

    if (confirmPassword) {

        confirmPassword.addEventListener(
            "input",
            checkPasswordMatch
        );
    }


    function checkPasswordMatch() {

        if (!password || !confirmPassword || !passwordMatch) {
            return;
        }

        const pass =
            password.value;

        const confirm =
            confirmPassword.value;


        passwordMatch.classList.remove(
            "success",
            "error"
        );


        if (confirm.length === 0) {

            passwordMatch.textContent = "";

            return;
        }


        if (pass === confirm) {

            passwordMatch.textContent =
                "✓ Passwords match";

            passwordMatch.classList.add(
                "success"
            );

        } else {

            passwordMatch.textContent =
                "✕ Passwords do not match";

            passwordMatch.classList.add(
                "error"
            );
        }
    }


    /* =====================================================
       SIGNUP FORM
       ===================================================== */

    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            function (event) {

                console.log(
                    "Signup form submitted"
                );


                /* -----------------------------------------
                   GET VALUES
                   ----------------------------------------- */

                const name =
                    document.getElementById("name");

                const email =
                    document.getElementById("email");

                const username =
                    document.getElementById("username");


                const nameValue =
                    name ? name.value.trim() : "";

                const emailValue =
                    email ? email.value.trim() : "";

                const usernameValue =
                    username ?
                    username.value.trim() :
                    "";

                const passwordValue =
                    password ?
                    password.value :
                    "";

                const confirmValue =
                    confirmPassword ?
                    confirmPassword.value :
                    "";


                /* -----------------------------------------
                   NAME VALIDATION
                   ----------------------------------------- */

                if (nameValue.length < 2) {

                    event.preventDefault();

                    alert(
                        "Please enter your full name."
                    );

                    if (name) {
                        name.focus();
                    }

                    return;
                }


                /* -----------------------------------------
                   EMAIL VALIDATION
                   ----------------------------------------- */

                if (
                    !emailValue ||
                    !emailValue.includes("@")
                ) {

                    event.preventDefault();

                    alert(
                        "Please enter a valid email address."
                    );

                    if (email) {
                        email.focus();
                    }

                    return;
                }


                /* -----------------------------------------
                   USERNAME VALIDATION
                   ----------------------------------------- */

                if (usernameValue.length < 3) {

                    event.preventDefault();

                    alert(
                        "Username must contain at least 3 characters."
                    );

                    if (username) {
                        username.focus();
                    }

                    return;
                }


                /* -----------------------------------------
                   PASSWORD LENGTH
                   ----------------------------------------- */

                if (passwordValue.length < 6) {

                    event.preventDefault();

                    alert(
                        "Password must be at least 6 characters."
                    );

                    if (password) {
                        password.focus();
                    }

                    return;
                }


                /* -----------------------------------------
                   CONFIRM PASSWORD
                   ----------------------------------------- */

                if (
                    passwordValue !==
                    confirmValue
                ) {

                    event.preventDefault();

                    alert(
                        "Passwords do not match."
                    );

                    if (confirmPassword) {
                        confirmPassword.focus();
                    }

                    return;
                }


                /* -----------------------------------------
                   VALID SIGNUP
                   ----------------------------------------- */

                console.log(
                    "Signup validation successful"
                );


                /*
                   IMPORTANT:
                   We DO NOT call event.preventDefault()
                   here.

                   Browser will submit the form to:

                   {{ url_for('signup') }}
                */


                const button =
                    signupForm.querySelector(
                        ".auth-button"
                    );

                if (button) {

                    button.disabled = true;

                    button.style.opacity = "0.8";

                    const buttonText =
                        button.querySelector(
                            ".button-text"
                        );

                    const buttonIcon =
                        button.querySelector(
                            ".button-icon"
                        );

                    if (buttonText) {
                        buttonText.textContent =
                            "Creating Account...";
                    }

                    if (buttonIcon) {
                        buttonIcon.textContent =
                            "✨";
                    }
                }

            }
        );
    }


    /* =====================================================
       LOGIN FORM
       ===================================================== */

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                console.log(
                    "Login form submitted"
                );


                /*
                   DO NOT prevent default.

                   Flask receives:

                   username
                   password
                */


                const button =
                    loginForm.querySelector(
                        ".auth-button"
                    );


                if (button) {

                    button.disabled = true;

                    button.style.opacity = "0.8";

                    button.textContent =
                        "Logging in...";
                }

            }
        );
    }

});

