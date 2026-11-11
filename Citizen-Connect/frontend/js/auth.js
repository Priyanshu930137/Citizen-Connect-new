// ==========================================
// CITIZEN CONNECT - AUTHENTICATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const API_BASE = window.CitizenConnect.apiBase();


    // ==========================================
    // SHOW MESSAGE
    // ==========================================

    function showMessage(message, type = "error") {

        const messageBox =
            document.getElementById("authMessage");


        if (!messageBox) {
            return;
        }


        messageBox.textContent = message;

        messageBox.className =
            "auth-message show " + type;

    }


    // ==========================================
    // PASSWORD VISIBILITY
    // ==========================================

    const passwordButtons =
        document.querySelectorAll(".toggle-password");


    passwordButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    button.getAttribute("data-target");


                const passwordInput =
                    document.getElementById(targetId);


                if (!passwordInput) {
                    return;
                }


                if (
                    passwordInput.type === "password"
                ) {

                    passwordInput.type = "text";

                    button.textContent = "🙈";

                } else {

                    passwordInput.type = "password";

                    button.textContent = "👁";

                }

            }
        );

    });


    // ==========================================
    // GET SELECTED ROLE
    // ==========================================

    function getSelectedRole() {

        const selectedRole =
            document.querySelector(
                'input[name="role"]:checked'
            );


        if (!selectedRole) {
            return null;
        }


        return selectedRole.value;

    }


    // ==========================================
    // DEPARTMENT VISIBILITY
    // ==========================================

    const departmentGroup =
        document.getElementById("departmentGroup");


    const departmentSelect =
        document.getElementById("department");


    function updateDepartmentVisibility() {

        if (!departmentGroup) {
            return;
        }


        const role =
            getSelectedRole();


        // Department required only for:
        // Management and Technician

        if (
            role === "management" ||
            role === "technician"
        ) {

            departmentGroup.style.display =
                "block";

        } else {

            departmentGroup.style.display =
                "none";


            if (departmentSelect) {

                departmentSelect.value = "";

            }

        }

    }


    // ==========================================
    // ROLE CHANGE LISTENERS
    // ==========================================

    const roleInputs =
        document.querySelectorAll(
            'input[name="role"]'
        );


    roleInputs.forEach(function (input) {

        input.addEventListener(
            "change",
            updateDepartmentVisibility
        );

    });


    updateDepartmentVisibility();


    // ==========================================
    // REGISTER USER
    // ==========================================

    const registerForm =
        document.getElementById("registerForm");


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                // ==================================
                // GET FORM VALUES
                // ==================================

                const name =
                    document
                        .getElementById("name")
                        .value
                        .trim();


                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                const password =
                    document
                        .getElementById("password")
                        .value;


                const role =
                    getSelectedRole();


                // ==================================
                // VALIDATE ROLE
                // ==================================

                if (!role) {

                    showMessage(
                        "Please select a role."
                    );

                    return;

                }


                // ==================================
                // DEPARTMENT
                // ==================================

                let department = null;


                if (
                    role === "management" ||
                    role === "technician"
                ) {

                    if (
                        !departmentSelect ||
                        !departmentSelect.value
                    ) {

                        showMessage(
                            "Please select a department."
                        );

                        return;

                    }


                    department =
                        departmentSelect.value;

                }


                // ==================================
                // SUBMIT BUTTON
                // ==================================

                const submitButton =
                    registerForm.querySelector(
                        'button[type="submit"]'
                    );


                const originalText =
                    submitButton.textContent;


                submitButton.disabled = true;

                submitButton.textContent =
                    "Creating Account...";


                try {

                    // ==================================
                    // REQUEST DATA
                    // ==================================

                    const requestData = {

                        name: name,

                        email: email,

                        password: password,

                        role: role,

                        department: department

                    };


                    // ==================================
                    // API REQUEST
                    // ==================================

                    const response =
                        await fetch(
                            API_BASE + "/register",
                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        requestData
                                    )

                            }
                        );


                    const data =
                        await response.json();


                    // ==================================
                    // ERROR
                    // ==================================

                    if (!response.ok) {

                        throw new Error(

                            data.detail ||
                            "Registration failed."

                        );

                    }


                    // ==================================
                    // SUCCESS
                    // ==================================

                    showMessage(

                        "Account created successfully! Redirecting to login...",

                        "success"

                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "login.html";

                        },
                        1200
                    );


                } catch (error) {

                    showMessage(

                        error.message ||
                        "Something went wrong."

                    );


                } finally {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        originalText;

                }

            }
        );

    }


    // ==========================================
    // LOGIN USER
    // ==========================================

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                // ==================================
                // GET VALUES
                // ==================================

                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                const password =
                    document
                        .getElementById("password")
                        .value;


                const role =
                    getSelectedRole();


                // ==================================
                // VALIDATE ROLE
                // ==================================

                if (!role) {

                    showMessage(
                        "Please select a role."
                    );

                    return;

                }


                // ==================================
                // DEPARTMENT
                // ==================================

                let department = null;


                if (
                    role === "management" ||
                    role === "technician"
                ) {

                    if (
                        !departmentSelect ||
                        !departmentSelect.value
                    ) {

                        showMessage(
                            "Please select your department."
                        );

                        return;

                    }


                    department =
                        departmentSelect.value;

                }


                // ==================================
                // SUBMIT BUTTON
                // ==================================

                const submitButton =
                    loginForm.querySelector(
                        'button[type="submit"]'
                    );


                const originalText =
                    submitButton.textContent;


                submitButton.disabled = true;

                submitButton.textContent =
                    "Logging in...";


                try {

                    // ==================================
                    // LOGIN DATA
                    // ==================================

                    const loginData = {

                        email: email,

                        password: password,

                        role: role

                    };


                    // Add department only when needed

                    if (department) {

                        loginData.department =
                            department;

                    }


                    // ==================================
                    // API REQUEST
                    // ==================================

                    const response =
                        await fetch(
                            API_BASE + "/login",
                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        loginData
                                    )

                            }
                        );


                    const data =
                        await response.json();


                    // ==================================
                    // ERROR
                    // ==================================

                    if (!response.ok) {

                        throw new Error(

                            data.detail ||
                            "Login failed."

                        );

                    }


                    // ==================================
                    // SAVE USER
                    // ==================================

                    localStorage.setItem(

                        "citizenConnectUser",

                        JSON.stringify(
                            data.user
                        )

                    );


                    // ==================================
                    // SUCCESS
                    // ==================================

                    showMessage(

                        "Login successful! Redirecting...",

                        "success"

                    );


                    // ==================================
                    // ROLE REDIRECTION
                    // ==================================

                    setTimeout(
                        function () {

                            const userRole =
                                data.user.role;


                            // CITIZEN

                            if (
                                userRole === "citizen"
                            ) {

                                window.location.href =
                                    "index.html";

                            }


                            // MAIN AUTHORITY

                            else if (
                                userRole === "authority"
                            ) {

                                window.location.href =
                                    "admin.html";

                            }


                            // DEPARTMENT MANAGEMENT

                            else if (
                                userRole === "management"
                            ) {

                                window.location.href =
                                    "department.html";

                            }


                            // TECHNICIAN

                            else if (
                                userRole === "technician"
                            ) {

                                window.location.href =
                                    "technician.html";

                            }


                            // FALLBACK

                            else {

                                window.location.href =
                                    "index.html";

                            }

                        },
                        800
                    );


                } catch (error) {

                    showMessage(

                        error.message ||
                        "Something went wrong."

                    );


                } finally {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        originalText;

                }

            }
        );

    }

});
