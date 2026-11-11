// ==========================================
// CITIZEN CONNECT - COMMON FUNCTIONS
// ==========================================


function getCurrentUser() {

    const userData =
        localStorage.getItem(
            "citizenConnectUser"
        );


    if (!userData) {

        return null;

    }


    try {

        return JSON.parse(userData);

    } catch {

        return null;

    }

}


// ==========================================
// REQUIRE LOGIN
// ==========================================

function requireLogin() {

    const user =
        getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

        return null;

    }


    return user;

}


// ==========================================
// REQUIRE AUTHORITY
// ==========================================

function requireAuthority() {

    const user =
        requireLogin();


    if (!user) {

        return null;

    }


    if (user.role !== "authority") {

        window.location.href =
            "index.html";

        return null;

    }


    return user;

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(
        "citizenConnectUser"
    );


    window.location.href =
        "index.html";

}


// ==========================================
// STATUS BADGE
// ==========================================

function getStatusBadge(status) {

    if (!status) {

        return "";

    }


    const normalized =
        status
            .toLowerCase()
            .replace(/\s+/g, "");


    let className =
        "badge badge-pending";


    if (
        normalized === "inprogress"
    ) {

        className =
            "badge badge-progress";

    }


    if (
        normalized === "resolved"
    ) {

        className =
            "badge badge-resolved";

    }


    if (
        normalized === "rejected"
    ) {

        className =
            "badge badge-rejected";

    }


    return `
        <span class="${className}">
            ${status}
        </span>
    `;

}


// ==========================================
// PRIORITY BADGE
// ==========================================

function getPriorityBadge(priority) {

    if (!priority) {

        return "";

    }


    const value =
        priority.toLowerCase();


    let className =
        "badge priority-medium";


    if (value === "high") {

        className =
            "badge priority-high";

    }


    if (value === "low") {

        className =
            "badge priority-low";

    }


    return `
        <span class="${className}">
            ${priority}
        </span>
    `;

}


// ==========================================
// NAVIGATION HTML
// ==========================================

function createNavbar() {

    const user =
        getCurrentUser();


    const nav =
        document.getElementById(
            "navbar"
        );


    if (!nav) {

        return;

    }


    let links = `
        <a href="index.html">
            Home
        </a>
    `;


    if (!user) {

        links += `
            <a href="login.html">
                Login
            </a>

            <a
                href="register.html"
                class="btn btn-primary"
            >
                Create Account
            </a>
        `;

    } else if (
        user.role === "citizen"
    ) {

        links += `
            <a href="submit.html">
                Submit Grievance
            </a>

            <a href="track.html">
                Track
            </a>

            <button
                class="btn btn-outline"
                onclick="logout()"
            >
                Logout
            </button>
        `;

    } else if (
        user.role === "authority"
    ) {

        links += `
            <a href="admin.html">
                Dashboard
            </a>

            <button
                class="btn btn-outline"
                onclick="logout()"
            >
                Logout
            </button>
        `;

    }


    nav.innerHTML = `

        <nav class="navbar">

            <div class="nav-container">

                <a
                    href="index.html"
                    class="logo"
                >

                    <div class="logo-icon">
                        🏛️
                    </div>

                    <span>
                        Citizen Connect
                    </span>

                </a>


                <div class="nav-links">

                    ${links}

                </div>

            </div>

        </nav>

    `;

}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createNavbar();

    }
);