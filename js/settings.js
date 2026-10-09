/* =========================================================
   DAILY ROUTINE - SETTINGS JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       DARK MODE
    ===================================================== */

    const darkModeToggle =
        document.getElementById(
            "darkModeToggle"
        );


    const savedTheme =
        localStorage.getItem(
            "dailyRoutineTheme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }

    }


    if (darkModeToggle) {

        darkModeToggle.addEventListener(
            "change",
            () => {

                if (darkModeToggle.checked) {

                    document.body.classList.add(
                        "dark-mode"
                    );

                    localStorage.setItem(
                        "dailyRoutineTheme",
                        "dark"
                    );

                } else {

                    document.body.classList.remove(
                        "dark-mode"
                    );

                    localStorage.setItem(
                        "dailyRoutineTheme",
                        "light"
                    );

                }

            }
        );

    }


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    const notificationToggle =
        document.getElementById(
            "notificationToggle"
        );


    if (notificationToggle) {

        const enabled =
            localStorage.getItem(
                "notificationsEnabled"
            );


        notificationToggle.checked =
            enabled !== "false";


        notificationToggle.addEventListener(
            "change",
            () => {

                localStorage.setItem(
                    "notificationsEnabled",
                    notificationToggle.checked
                );


                showToast(
                    notificationToggle.checked
                        ? "Notifications enabled."
                        : "Notifications disabled.",
                    "success"
                );

            }
        );

    }


    /* =====================================================
       SHARE WEBSITE
    ===================================================== */

    const shareButton =
        document.getElementById(
            "shareWebsite"
        );


    if (shareButton) {

        shareButton.addEventListener(
            "click",
            async () => {

                const shareData = {

                    title:
                        "Daily Routine",

                    text:
                        "Check out Daily Routine - a smart daily planning website.",

                    url:
                        window.location.origin

                };


                try {

                    if (
                        navigator.share
                    ) {

                        await navigator.share(
                            shareData
                        );

                    } else {

                        await navigator.clipboard.writeText(
                            window.location.href
                        );

                        showToast(
                            "Website link copied!",
                            "success"
                        );

                    }

                } catch (error) {

                    console.log(
                        "Share cancelled."
                    );

                }

            }
        );

    }


    /* =====================================================
       CHANGE PASSWORD MODAL
    ===================================================== */

    const changePasswordButton =
        document.getElementById(
            "changePasswordButton"
        );


    const changePasswordModal =
        document.getElementById(
            "changePasswordModal"
        );


    if (
        changePasswordButton &&
        changePasswordModal
    ) {

        changePasswordButton.addEventListener(
            "click",
            () => {

                changePasswordModal.classList.add(
                    "active"
                );

            }
        );

    }


    /* =====================================================
       CLOSE PASSWORD MODAL
    ===================================================== */

    document
        .querySelectorAll(
            "[data-close-password-modal]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    changePasswordModal?.classList.remove(
                        "active"
                    );

                }
            );

        });


    /* =====================================================
       CHANGE PASSWORD FORM
    ===================================================== */

    const passwordForm =
        document.getElementById(
            "changePasswordForm"
        );


    if (passwordForm) {

        passwordForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const currentPassword =
                    document.getElementById(
                        "currentPassword"
                    )?.value;


                const newPassword =
                    document.getElementById(
                        "newPassword"
                    )?.value;


                const confirmPassword =
                    document.getElementById(
                        "confirmNewPassword"
                    )?.value;


                const storedUser =
                    localStorage.getItem(
                        "demoRegisteredUser"
                    );


                if (!storedUser) {

                    showToast(
                        "User account not found.",
                        "error"
                    );

                    return;

                }


                const user =
                    JSON.parse(
                        storedUser
                    );


                if (
                    currentPassword !==
                    user.password
                ) {

                    showToast(
                        "Current password is incorrect.",
                        "error"
                    );

                    return;

                }


                if (
                    !newPassword ||
                    newPassword.length < 6
                ) {

                    showToast(
                        "New password must contain at least 6 characters.",
                        "error"
                    );

                    return;

                }


                if (
                    newPassword !==
                    confirmPassword
                ) {

                    showToast(
                        "New passwords do not match.",
                        "error"
                    );

                    return;

                }


                user.password =
                    newPassword;


                localStorage.setItem(
                    "demoRegisteredUser",
                    JSON.stringify(user)
                );


                localStorage.setItem(
                    "demoCurrentUser",
                    JSON.stringify(user)
                );


                passwordForm.reset();


                changePasswordModal?.classList.remove(
                    "active"
                );


                showToast(
                    "Password changed successfully!",
                    "success"
                );

            }
        );

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmed) {
                    return;
                }


                localStorage.removeItem(
                    "demoLoggedIn"
                );

                localStorage.removeItem(
                    "demoCurrentUser"
                );


                window.location.href =
                    "login.html";

            }
        );

    }


    /* =====================================================
       PROFILE INFORMATION
    ===================================================== */

    const profileName =
        document.getElementById(
            "settingsUserName"
        );

    const profileEmail =
        document.getElementById(
            "settingsUserEmail"
        );


    const storedUser =
        localStorage.getItem(
            "demoCurrentUser"
        );


    if (storedUser) {

        try {

            const user =
                JSON.parse(
                    storedUser
                );


            if (profileName) {
                profileName.textContent =
                    user.name || "User";
            }


            if (profileEmail) {
                profileEmail.textContent =
                    user.email || "";
            }

        } catch (error) {

            console.error(error);

        }

    }

});