// ==========================================
// CITIZEN CONNECT
// TECHNICIAN GRIEVANCE DETAILS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const API_BASE = window.CitizenConnect.apiBase();

    let currentUser = null;
    let grievanceId = null;
    let currentGrievance = null;


    // ==========================================
    // GET CURRENT USER
    // ==========================================

    function getCurrentUser() {

        const userData =
            localStorage.getItem(
                "citizenConnectUser"
            );


        if (!userData) {

            window.location.href =
                "login.html";

            return null;

        }


        try {

            return JSON.parse(
                userData
            );

        }

        catch (error) {

            localStorage.removeItem(
                "citizenConnectUser"
            );


            window.location.href =
                "login.html";


            return null;

        }

    }


    // ==========================================
    // AUTHORIZE USER
    // ==========================================

    currentUser =
        getCurrentUser();


    if (!currentUser) {

        return;

    }


    if (
        currentUser.role !==
        "technician"
    ) {

        alert(
            "You are not authorized to access this page."
        );


        window.location.href =
            "index.html";


        return;

    }


    // ==========================================
    // DISPLAY USER
    // ==========================================

    const userName =
        document.getElementById(
            "userName"
        );


    if (userName) {

        userName.textContent =
            "👋 " +
            currentUser.name;

    }


    // ==========================================
    // LOGOUT
    // ==========================================

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


    // ==========================================
    // GET GRIEVANCE ID
    // ==========================================

    function getGrievanceIdFromURL() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const id =
            params.get("id");


        if (!id) {

            return null;

        }


        return Number(id);

    }


    grievanceId =
        getGrievanceIdFromURL();


    if (!grievanceId) {

        showMessage(
            "Invalid grievance ID."
        );

        return;

    }


    // ==========================================
    // SHOW MESSAGE
    // ==========================================

    function showMessage(
        message,
        type = "error"
    ) {

        const messageBox =
            document.getElementById(
                "messageBox"
            );


        if (!messageBox) {

            return;

        }


        messageBox.textContent =
            message;


        messageBox.style.display =
            "block";


        if (type === "success") {

            messageBox.style.background =
                "#dcfce7";


            messageBox.style.color =
                "#166534";

        }

        else {

            messageBox.style.background =
                "#fee2e2";


            messageBox.style.color =
                "#991b1b";

        }


        setTimeout(function () {

            messageBox.style.display =
                "none";

        }, 4000);

    }


    // ==========================================
    // API REQUEST
    // ==========================================

    async function apiRequest(
        url,
        options = {}
    ) {

        const response =
            await fetch(
                url,
                options
            );


        let data;


        try {

            data =
                await response.json();

        }

        catch (error) {

            throw new Error(
                "Invalid response from server."
            );

        }


        if (!response.ok) {

            throw new Error(

                data.detail ||
                "Request failed."

            );

        }


        return data;

    }


    // ==========================================
    // LOAD GRIEVANCE
    // ==========================================

    async function loadGrievance() {

        try {

            currentGrievance =
                await apiRequest(

                    API_BASE +
                    "/grievances/" +
                    grievanceId

                );


            // ==================================
            // SECURITY CHECK
            // ==================================

            if (

                currentGrievance
                    .assigned_technician_id !==
                currentUser.id

            ) {

                showMessage(
                    "This grievance is not assigned to you."
                );

                return;

            }


            displayGrievance();

        }

        catch (error) {

            console.error(
                "Loading error:",
                error
            );


            showMessage(
                error.message
            );

        }

    }


    // ==========================================
    // DISPLAY GRIEVANCE
    // ==========================================

    function displayGrievance() {

        document.getElementById(
            "loadingContainer"
        ).style.display =
            "none";


        document.getElementById(
            "detailsContainer"
        ).style.display =
            "block";


        // ======================================
        // BASIC DETAILS
        // ======================================

        document.getElementById(
            "grievanceId"
        ).textContent =
            "Grievance #" +
            currentGrievance.id;


        document.getElementById(
            "subject"
        ).textContent =
            currentGrievance.subject;


        document.getElementById(
            "location"
        ).textContent =
            currentGrievance.location;


        document.getElementById(
            "category"
        ).textContent =
            currentGrievance.category ||
            "Uncategorized";


        document.getElementById(
            "department"
        ).textContent =
            currentGrievance.department ||
            "-";


        document.getElementById(
            "citizenName"
        ).textContent =
            currentGrievance.citizen_name ||
            "-";


        document.getElementById(
            "description"
        ).textContent =
            currentGrievance.description ||
            "-";


        // ======================================
        // BADGES
        // ======================================

        document.getElementById(
            "priorityBadge"
        ).innerHTML =
            getPriorityBadge(
                currentGrievance.priority
            );


        document.getElementById(
            "statusBadge"
        ).innerHTML =
            getStatusBadge(
                currentGrievance.status
            );


        // ======================================
        // EXISTING DATA
        // ======================================

        document.getElementById(
            "diagnosisInput"
        ).value =
            currentGrievance.diagnosis ||
            "";


        document.getElementById(
            "resolutionInput"
        ).value =
            currentGrievance.resolution_note ||
            "";


        if (

            currentGrievance.status ===
            "Resolved"

        ) {

            document.getElementById(
                "updateStatus"
            ).value =
                "Resolved";

        }

        else {

            document.getElementById(
                "updateStatus"
            ).value =
                "In Progress";

        }


        // ======================================
        // EXISTING UPDATE CARD
        // ======================================

        if (

            currentGrievance.diagnosis ||
            currentGrievance.resolution_note

        ) {

            document.getElementById(
                "existingUpdateCard"
            ).style.display =
                "block";


            document.getElementById(
                "existingDiagnosis"
            ).textContent =
                currentGrievance.diagnosis ||
                "No diagnosis provided.";


            document.getElementById(
                "existingResolution"
            ).textContent =
                currentGrievance.resolution_note ||
                "No resolution provided.";

        }

    }


    // ==========================================
    // SAVE UPDATE
    // ==========================================

    const saveUpdateButton =
        document.getElementById(
            "saveUpdateButton"
        );


    saveUpdateButton.addEventListener(
        "click",
        async function () {

            const status =
                document.getElementById(
                    "updateStatus"
                ).value;


            const diagnosis =
                document.getElementById(
                    "diagnosisInput"
                ).value
                    .trim();


            const resolution =
                document.getElementById(
                    "resolutionInput"
                ).value
                    .trim();


            // ======================================
            // VALIDATION
            // ======================================

            if (

                status === "Resolved" &&
                !resolution

            ) {

                showMessage(
                    "Please provide a resolution note before resolving the grievance."
                );

                return;

            }


            try {

                saveUpdateButton.disabled =
                    true;


                saveUpdateButton.textContent =
                    "Saving...";


                const data =
                    await apiRequest(

                        API_BASE +
                        "/grievances/" +
                        grievanceId +
                        "/technician-update",

                        {

                            method:
                                "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    status:
                                        status,

                                    diagnosis:
                                        diagnosis ||
                                        null,

                                    resolution_note:
                                        resolution ||
                                        null

                                })

                        }

                    );


                showMessage(

                    data.message ||
                    "Grievance updated successfully.",

                    "success"

                );


                await loadGrievance();

            }

            catch (error) {

                console.error(
                    "Update error:",
                    error
                );


                showMessage(
                    error.message
                );

            }

            finally {

                saveUpdateButton.disabled =
                    false;


                saveUpdateButton.textContent =
                    "💾 Save Update";

            }

        }
    );


    // ==========================================
    // STATUS BADGE
    // ==========================================

    function getStatusBadge(
        status
    ) {

        let className =
            "badge-progress";


        if (status === "Resolved") {

            className =
                "badge-success";

        }

        else if (status === "Assigned") {

            className =
                "badge-warning";

        }


        return `

            <span class="badge ${className}">

                ${escapeHtml(
                    status || "Unknown"
                )}

            </span>

        `;

    }


    // ==========================================
    // PRIORITY BADGE
    // ==========================================

    function getPriorityBadge(
        priority
    ) {

        let className =
            "badge-progress";


        if (priority === "High") {

            className =
                "badge-danger";

        }

        else if (priority === "Medium") {

            className =
                "badge-warning";

        }

        else if (priority === "Low") {

            className =
                "badge-success";

        }


        return `

            <span class="badge ${className}">

                ${escapeHtml(
                    priority || "Medium"
                )}

            </span>

        `;

    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHtml(value) {

        if (

            value === null ||
            value === undefined

        ) {

            return "";

        }


        const div =
            document.createElement("div");


        div.textContent =
            String(value);


        return div.innerHTML;

    }


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    loadGrievance();

});
