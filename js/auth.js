/* =========================================================
   DAILY ROUTINE — REAL API AUTHENTICATION
   Backend: Node.js + Express
   Database: MongoDB
========================================================= */

const API_BASE_URL = "http://localhost:5000/api";


document.addEventListener("DOMContentLoaded", () => {

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    /* =====================================================
       MESSAGE DISPLAY
    ===================================================== */

    function showMessage(elementId, message, type = "error") {

        const box = document.getElementById(elementId);

        if (!box) {
            alert(message);
            return;
        }

        box.textContent = message;
        box.style.display = "block";

        box.style.padding = "12px 14px";
        box.style.marginBottom = "16px";
        box.style.borderRadius = "8px";

        if (type === "success") {

            box.style.color = "#86efac";
            box.style.background = "rgba(34,197,94,0.12)";
            box.style.border = "1px solid rgba(34,197,94,0.3)";

        } else {

            box.style.color = "#fca5a5";
            box.style.background = "rgba(239,68,68,0.12)";
            box.style.border = "1px solid rgba(239,68,68,0.3)";

        }

    }


    function hideMessage(elementId) {

        const box = document.getElementById(elementId);

        if (box) {
            box.style.display = "none";
            box.textContent = "";
        }

    }


    /* =====================================================
       REGISTER
    ===================================================== */

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            hideMessage("registerMessage");

            const name =
                document.getElementById("name")?.value.trim();

            const email =
                document.getElementById("email")?.value.trim();

            const password =
                document.getElementById("password")?.value;

            const confirmPassword =
                document.getElementById("confirmPassword")?.value;

            const terms =
                document.getElementById("terms");


            if (!name || !email || !password || !confirmPassword) {

                showMessage(
                    "registerMessage",
                    "Please fill in all required fields."
                );

                return;

            }


            if (name.length < 2) {

                showMessage(
                    "registerMessage",
                    "Your name must contain at least 2 characters."
                );

                return;

            }


            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                showMessage(
                    "registerMessage",
                    "Please enter a valid email address."
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    "registerMessage",
                    "Your password must contain at least 6 characters."
                );

                return;

            }


            if (password !== confirmPassword) {

                showMessage(
                    "registerMessage",
                    "Your passwords do not match."
                );

                return;

            }


            if (terms && !terms.checked) {

                showMessage(
                    "registerMessage",
                    "Please accept the terms before continuing."
                );

                return;

            }


            const submitButton =
                registerForm.querySelector('button[type="submit"]');

            if (submitButton) {
                submitButton.disabled = true;
            }


            try {

                const response = await fetch(
                    `${API_BASE_URL}/auth/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })
                    }
                );


                const result = await response.json();


                if (!response.ok || !result.success) {

                    throw new Error(
                        result.message || "Registration failed."
                    );

                }


                /*
                   Do not save the password in localStorage.
                   The account is stored in MongoDB by the backend.
                */

                showMessage(
                    "registerMessage",
                    "Account created successfully! Redirecting to login...",
                    "success"
                );


                setTimeout(() => {

                    window.location.href = "login.html";

                }, 1200);


            } catch (error) {

                console.error("Registration error:", error);

                showMessage(
                    "registerMessage",
                    error.message ||
                    "Cannot connect to the server. Make sure your backend is running."
                );

            } finally {

                if (submitButton) {
                    submitButton.disabled = false;
                }

            }

        });

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            hideMessage("loginMessage");

            const email =
                document.getElementById("email")?.value.trim();

            const password =
                document.getElementById("password")?.value;


            if (!email || !password) {

                showMessage(
                    "loginMessage",
                    "Please enter your email and password."
                );

                return;

            }


            const submitButton =
                loginForm.querySelector('button[type="submit"]');

            if (submitButton) {
                submitButton.disabled = true;
            }


            try {

                const response = await fetch(
                    `${API_BASE_URL}/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


                const result = await response.json();


                if (!response.ok || !result.success) {

                    throw new Error(
                        result.message || "Login failed."
                    );

                }


                if (!result.token || !result.user) {

                    throw new Error(
                        "The server did not return valid login details."
                    );

                }


                /*
                   Save the authentication token and public user details.
                   Never save the user's password in browser storage.
                */

                localStorage.setItem(
                    "token",
                    result.token
                );

                localStorage.setItem(
                    "dr_user",
                    JSON.stringify(result.user)
                );


                showMessage(
                    "loginMessage",
                    "Login successful! Opening your dashboard...",
                    "success"
                );


                setTimeout(() => {

                    window.location.href = "dashboard.html";

                }, 700);


            } catch (error) {

                console.error("Login error:", error);

                showMessage(
                    "loginMessage",
                    error.message ||
                    "Cannot connect to the server. Make sure your backend is running."
                );

            } finally {

                if (submitButton) {
                    submitButton.disabled = false;
                }

            }

        });

    }


    /* =====================================================
       SHOW / HIDE PASSWORD
    ===================================================== */

    document.querySelectorAll("[data-password-toggle]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const targetId =
                    button.getAttribute("data-password-toggle");

                const input =
                    document.getElementById(targetId);

                if (!input) {
                    return;
                }


                if (input.type === "password") {

                    input.type = "text";
                    button.textContent = "🙈";

                } else {

                    input.type = "password";
                    button.textContent = "👁️";

                }

            });

        });


    /* =====================================================
       PROTECT PRIVATE PAGES
    ===================================================== */

    const protectedPages = [
        "dashboard.html",
        "routine.html",
        "plan-ai.html",
        "reports.html",
        "settings.html"
    ];


    if (protectedPages.includes(currentPage)) {

        const token = localStorage.getItem("token");

        if (!token) {

            window.location.replace("login.html");

        }

    }


});