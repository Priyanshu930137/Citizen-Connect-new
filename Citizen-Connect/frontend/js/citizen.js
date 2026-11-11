// ==========================================
// CITIZEN CONNECT - CITIZEN DASHBOARD
// ==========================================


document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ======================================
        // GET LOGGED-IN USER
        // ======================================

        const storedUser =
            localStorage.getItem(
                "citizenConnectUser"
            );


        // ======================================
        // USER NOT LOGGED IN
        // ======================================

        if (!storedUser) {

            window.location.href =
                "login.html";

            return;

        }


        const user =
            JSON.parse(storedUser);


        // ======================================
        // ROLE PROTECTION
        // ======================================

        if (user.role !== "citizen") {

            redirectUser(user);

            return;

        }


        // ======================================
        // WELCOME USER
        // ======================================

        const welcomeUser =
            document.getElementById(
                "welcomeUser"
            );


        if (welcomeUser) {

            welcomeUser.textContent =
                "Hi, " + user.name;

        }


        // ======================================
        // LOGOUT
        // ======================================

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        "citizenConnectUser"
                    );


                    window.location.href =
                        "login.html";

                }
            );

        }


        // ======================================
        // LOAD RECENT GRIEVANCES
        // ======================================

        loadRecentGrievances(user.id);


    }
);


// ==========================================
// LOAD RECENT GRIEVANCES
// ==========================================

async function loadRecentGrievances(citizenId) {


    const container =
        document.getElementById(
            "recentGrievances"
        );


    if (!container) {
        return;
    }


    try {


        const response =
            await fetch(
                window.CitizenConnect.apiBase() + "/citizens/" +
                citizenId +
                "/grievances"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load grievances."
            );

        }


        const grievances =
            await response.json();


        // ======================================
        // NO GRIEVANCES
        // ======================================

        if (grievances.length === 0) {

            container.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        📭
                    </div>

                    <h3>
                        No grievances yet
                    </h3>

                    <p>
                        You haven't submitted any
                        grievance yet.
                    </p>

                    <a
                        href="submit-grievance.html"
                        class="btn btn-primary"
                    >

                        Submit Your First Grievance

                    </a>

                </div>

            `;

            return;

        }


        // ======================================
        // SHOW ONLY LAST 3
        // ======================================

        const recentGrievances =
            grievances.slice(0, 3);


        container.innerHTML = "";


        recentGrievances.forEach(
            function (grievance) {


                const grievanceCard =
                    document.createElement("div");


                grievanceCard.className =
                    "grievance-card";


                grievanceCard.innerHTML = `

                    <div class="grievance-card-header">

                        <div>

                            <span class="grievance-id">

                                #${grievance.id}

                            </span>


                            <h3>

                                ${escapeHTML(
                                    grievance.subject
                                )}

                            </h3>

                        </div>


                        <span
                            class="status-badge status-${formatStatus(
                                grievance.status
                            )}"
                        >

                            ${escapeHTML(
                                grievance.status
                            )}

                        </span>

                    </div>


                    <p class="grievance-description">

                        ${escapeHTML(
                            grievance.description
                        )}

                    </p>


                    <div class="grievance-meta">

                        <span>

                            🏢
                            ${escapeHTML(
                                grievance.department ||
                                "Processing"
                            )}

                        </span>


                        <span>

                            🔥
                            ${escapeHTML(
                                grievance.priority ||
                                "Medium"
                            )}

                        </span>

                    </div>

                `;


                container.appendChild(
                    grievanceCard
                );

            }
        );


    } catch (error) {


        container.innerHTML = `

            <div class="error-box">

                Unable to load grievances.

            </div>

        `;


        console.error(error);

    }

}


// ==========================================
// REDIRECT USER BASED ON ROLE
// ==========================================

function redirectUser(user) {


    if (user.role === "authority") {

        window.location.href =
            "admin.html";

    }


    else if (user.role === "management") {

        window.location.href =
            "department.html";

    }


    else if (user.role === "technician") {

        window.location.href =
            "technician.html";

    }


    else {

        window.location.href =
            "index.html";

    }

}


// ==========================================
// FORMAT STATUS
// ==========================================

function formatStatus(status) {


    return status
        .toLowerCase()
        .replace(/\s+/g, "-");

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {


    if (!value) {
        return "";
    }


    const div =
        document.createElement("div");


    div.textContent = value;


    return div.innerHTML;

}
