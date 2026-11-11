// ==========================================
// CITIZEN CONNECT - GRIEVANCE DETAILS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const API_BASE = window.CitizenConnect.apiBase();

    let grievanceId = null;

    let currentGrievance = null;


    // ==========================================
    // GET LOGGED-IN USER
    // ==========================================

    function getCurrentUser() {

        const userData =
            localStorage.getItem("citizenConnectUser");


        if (!userData) {

            window.location.href = "login.html";

            return null;

        }


        try {

            return JSON.parse(userData);

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
    // CHECK AUTHORITY ACCESS
    // ==========================================

    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        return;

    }


    if (currentUser.role !== "authority") {

        alert(
            "You are not authorized to access this page."
        );

        window.location.href =
            "login.html";

        return;

    }


    // ==========================================
    // DISPLAY USER NAME
    // ==========================================

    const userName =
        document.getElementById(
            "userName"
        );


    if (userName) {

        userName.textContent =
            "👋 " + currentUser.name;

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
    // GET GRIEVANCE ID FROM URL
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


        const numericId =
            parseInt(id);


        if (isNaN(numericId)) {

            return null;

        }


        return numericId;

    }


    grievanceId =
        getGrievanceIdFromURL();


    // ==========================================
    // INVALID ID
    // ==========================================

    if (!grievanceId) {

        showMessage(
            "Invalid grievance ID."
        );


        const loading =
            document.getElementById(
                "loadingDetails"
            );


        if (loading) {

            loading.style.display =
                "none";

        }


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
                "detailsMessage"
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


            messageBox.style.border =
                "1px solid #86efac";

        }

        else {

            messageBox.style.background =
                "#fee2e2";


            messageBox.style.color =
                "#991b1b";


            messageBox.style.border =
                "1px solid #fca5a5";

        }


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


        setTimeout(function () {

            messageBox.style.display =
                "none";

        }, 4000);

    }


    // ==========================================
    // API REQUEST HELPER
    // ==========================================

    async function apiRequest(
        url,
        method = "GET",
        body = null
    ) {

        const options = {

            method: method,

            headers: {

                "Content-Type":
                    "application/json"

            }

        };


        if (body) {

            options.body =
                JSON.stringify(body);

        }


        const response =
            await fetch(
                url,
                options
            );


        let data = null;


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
                data.message ||
                "Request failed."

            );

        }


        return data;

    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHtml(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "-";

        }


        const div =
            document.createElement("div");


        div.textContent =
            String(value);


        return div.innerHTML;

    }


    // ==========================================
    // FORMAT DATE
    // ==========================================

    function formatDate(dateValue) {

        if (!dateValue) {

            return "Not available";

        }


        try {

            const date =
                new Date(dateValue);


            return date.toLocaleString();

        }

        catch (error) {

            return dateValue;

        }

    }


    // ==========================================
    // GET STATUS BADGE
    // ==========================================

    function getStatusBadge(status) {

        let className =
            "badge-progress";


        if (status === "Resolved") {

            className =
                "badge-success";

        }


        else if (status === "Pending") {

            className =
                "badge-warning";

        }


        else if (status === "Rejected") {

            className =
                "badge-danger";

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
    // GET PRIORITY BADGE
    // ==========================================

    function getPriorityBadge(priority) {

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
    // SET TEXT SAFELY
    // ==========================================

    function setText(
        elementId,
        value,
        defaultValue = "-"
    ) {

        const element =
            document.getElementById(
                elementId
            );


        if (!element) {

            return;

        }


        element.textContent =

            value !== null &&
            value !== undefined &&
            value !== ""

                ? value

                : defaultValue;

    }


    // ==========================================
    // LOAD GRIEVANCE
    // ==========================================

    async function loadGrievance() {

        const loading =
            document.getElementById(
                "loadingDetails"
            );


        const content =
            document.getElementById(
                "detailsContent"
            );


        if (loading) {

            loading.style.display =
                "block";

        }


        if (content) {

            content.style.display =
                "none";

        }


        try {

            const grievance =
                await apiRequest(

                    API_BASE +
                    "/grievances/" +
                    grievanceId

                );


            currentGrievance =
                grievance;


            renderGrievance(
                grievance
            );


            if (loading) {

                loading.style.display =
                    "none";

            }


            if (content) {

                content.style.display =
                    "block";

            }

        }

        catch (error) {

            console.error(
                "Load grievance error:",
                error
            );


            if (loading) {

                loading.style.display =
                    "none";

            }


            showMessage(
                error.message ||
                "Unable to load grievance."
            );

        }

    }


    // ==========================================
    // RENDER GRIEVANCE
    // ==========================================

    function renderGrievance(grievance) {

        // ======================================
        // PAGE TITLE
        // ======================================

        setText(

            "grievanceTitle",

            grievance.subject ||
            "Grievance Details"

        );


        setText(

            "grievanceSubtitle",

            "Grievance #" +
            grievance.id +
            " submitted by " +
            (
                grievance.citizen_name ||
                "Citizen"
            )

        );


        // ======================================
        // BASIC DETAILS
        // ======================================

        setText(

            "grievanceId",

            "#" + grievance.id

        );


        setText(

            "citizenName",

            grievance.citizen_name

        );


        setText(

            "citizenEmail",

            grievance.email ||
            grievance.citizen_email

        );


        setText(

            "citizenPhone",

            grievance.phone ||
            grievance.citizen_phone ||
            "Not provided"

        );


        // ======================================
        // GRIEVANCE INFORMATION
        // ======================================

        setText(

            "subject",

            grievance.subject

        );


        setText(

            "location",

            grievance.location

        );


        setText(

            "description",

            grievance.description

        );


        setText(

            "createdAt",

            formatDate(
                grievance.created_at
            )

        );


        // ======================================
        // AI ASSESSMENT
        // ======================================

        setText(

            "category",

            grievance.category

        );


        setText(

            "department",

            grievance.department

        );


        setText(

            "aiPriority",

            grievance.priority

        );


        setText(

            "aiReason",

            grievance.ai_reason ||
            "AI reasoning is not available."

        );


        // ======================================
        // TECHNICIAN
        // ======================================

        setText(

            "technicianName",

            grievance.assigned_technician_name ||
            "No technician assigned yet."

        );


        // ======================================
        // BADGES
        // ======================================

        const priorityBadge =
            document.getElementById(
                "priorityBadge"
            );


        if (priorityBadge) {

            priorityBadge.innerHTML =
                getPriorityBadge(
                    grievance.priority
                );

        }


        const statusBadge =
            document.getElementById(
                "statusBadge"
            );


        if (statusBadge) {

            statusBadge.innerHTML =
                getStatusBadge(
                    grievance.status
                );

        }


        // ======================================
        // SET SELECT VALUES
        // ======================================

        const statusSelect =
            document.getElementById(
                "statusSelect"
            );


        if (statusSelect) {

            statusSelect.value =
                grievance.status ||
                "Pending";

        }


        const departmentSelect =
            document.getElementById(
                "departmentSelect"
            );


        if (departmentSelect) {

            departmentSelect.value =
                grievance.department;

        }


        const prioritySelect =
            document.getElementById(
                "prioritySelect"
            );


        if (prioritySelect) {

            prioritySelect.value =
                grievance.priority ||
                "Medium";

        }

    }


    // ==========================================
    // BUTTON LOADING HELPER
    // ==========================================

    async function handleButtonAction(
        button,
        loadingText,
        callback
    ) {

        if (!button) {

            return;

        }


        const originalText =
            button.innerHTML;


        button.disabled =
            true;


        button.innerHTML =
            loadingText;


        try {

            await callback();

        }

        finally {

            button.disabled =
                false;


            button.innerHTML =
                originalText;

        }

    }


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    const updateStatusButton =
        document.getElementById(
            "updateStatusButton"
        );


    if (updateStatusButton) {

        updateStatusButton.addEventListener(

            "click",

            async function () {

                const statusSelect =
                    document.getElementById(
                        "statusSelect"
                    );


                const newStatus =
                    statusSelect.value;


                await handleButtonAction(

                    updateStatusButton,

                    "Updating...",

                    async function () {

                        try {

                            await apiRequest(

                                API_BASE +
                                "/grievances/" +
                                grievanceId +
                                "/status",

                                "PUT",

                                {

                                    status:
                                        newStatus

                                }

                            );


                            showMessage(

                                "Grievance status updated successfully.",

                                "success"

                            );


                            await loadGrievance();

                        }

                        catch (error) {

                            console.error(
                                "Status update error:",
                                error
                            );


                            showMessage(
                                error.message
                            );

                        }

                    }

                );

            }

        );

    }


    // ==========================================
    // UPDATE DEPARTMENT
    // ==========================================

    const updateDepartmentButton =
        document.getElementById(
            "updateDepartmentButton"
        );


    if (updateDepartmentButton) {

        updateDepartmentButton.addEventListener(

            "click",

            async function () {

                const departmentSelect =
                    document.getElementById(
                        "departmentSelect"
                    );


                const newDepartment =
                    departmentSelect.value;


                await handleButtonAction(

                    updateDepartmentButton,

                    "Updating...",

                    async function () {

                        try {

                            await apiRequest(

                                API_BASE +
                                "/grievances/" +
                                grievanceId +
                                "/department",

                                "PUT",

                                {

                                    department:
                                        newDepartment

                                }

                            );


                            showMessage(

                                "Department updated successfully.",

                                "success"

                            );


                            await loadGrievance();

                        }

                        catch (error) {

                            console.error(
                                "Department update error:",
                                error
                            );


                            showMessage(
                                error.message
                            );

                        }

                    }

                );

            }

        );

    }


    // ==========================================
    // UPDATE PRIORITY
    // ==========================================

    const updatePriorityButton =
        document.getElementById(
            "updatePriorityButton"
        );


    if (updatePriorityButton) {

        updatePriorityButton.addEventListener(

            "click",

            async function () {

                const prioritySelect =
                    document.getElementById(
                        "prioritySelect"
                    );


                const newPriority =
                    prioritySelect.value;


                await handleButtonAction(

                    updatePriorityButton,

                    "Updating...",

                    async function () {

                        try {

                            await apiRequest(

                                API_BASE +
                                "/grievances/" +
                                grievanceId +
                                "/priority",

                                "PUT",

                                {

                                    priority:
                                        newPriority

                                }

                            );


                            showMessage(

                                "Priority updated successfully.",

                                "success"

                            );


                            await loadGrievance();

                        }

                        catch (error) {

                            console.error(
                                "Priority update error:",
                                error
                            );


                            showMessage(
                                error.message
                            );

                        }

                    }

                );

            }

        );

    }


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    loadGrievance();

});
