// ==========================================
// CITIZEN CONNECT - HOME PAGE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // GET LOGGED-IN USER
    // ==========================================

    const storedUser = localStorage.getItem(
        "citizenConnectUser"
    );


    // If no user is logged in,
    // redirect to login page

    if (!storedUser) {

        window.location.href = "login.html";

        return;

    }


    const user = JSON.parse(storedUser);


    // ==========================================
    // ROLE PROTECTION
    // ==========================================

    // Authority should not access citizen home page

    if (user.role === "authority") {

        window.location.href = "admin.html";

        return;

    }


    // ==========================================
    // DISPLAY USER NAME
    // ==========================================

    const userName =
        document.getElementById("userName");


    if (userName && user.name) {

        userName.textContent =
            `Hi, ${user.name}`;

    }


    // ==========================================
    // LOGOUT
    // ==========================================

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "citizenConnectUser"
                );


                window.location.href =
                    "login.html";

            }
        );

    }

});