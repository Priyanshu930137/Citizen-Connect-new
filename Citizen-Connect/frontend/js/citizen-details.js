// ==========================================
// CITIZEN CONNECT - CITIZEN GRIEVANCE DETAILS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const API_BASE = window.CitizenConnect.apiBase();

    let currentUser = null;
    let currentGrievance = null;
    let selectedRating = 0;


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

            console.error(
                "Invalid user data:",
                error
            );


            localStorage.removeItem(
                "citizenConnectUser"
            );


            window.location.href =
                "login.html";


            return null;

        }

    }


    // ==========================================
    // CHECK AUTHORIZATION
    // ==========================================

    currentUser =
        getCurrentUser();


    if (!currentUser) {

        return;

    }


    if (currentUser.role !== "citizen") {

        alert(
            "You are not authorized to access this page."
        );


        window.location.href =
            "index.html";


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

    function getGrievanceId() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const grievanceId =
            params.get("id");


        if (!grievanceId) {

            showMessage(
                "Invalid grievance ID."
            );


            return null;

        }


        return grievanceId;

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
                "citizenDetailsMessage"
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


        setTimeout(
            function () {

                messageBox.style.display =
                    "none";

            },

            4000
        );

    }


    // ==========================================
    // API REQUEST HELPER
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
    // LOAD GRIEVANCE DETAILS
    // ==========================================

    async function loadGrievance() {

        const grievanceId =
            getGrievanceId();


        if (!grievanceId) {

            return;

        }


        const loading =
            document.getElementById(
                "loadingDetails"
            );


        const container =
            document.getElementById(
                "detailsContainer"
            );


        if (loading) {

            loading.style.display =
                "block";

        }


        if (container) {

            container.style.display =
                "none";

        }


        try {

            currentGrievance =
                await apiRequest(

                    API_BASE +
                    "/grievances/" +
                    grievanceId

                );


            // ======================================
            // SECURITY CHECK
            // ======================================

            if (

                currentGrievance.citizen_id !==
                currentUser.id

            ) {

                showMessage(
                    "You are not authorized to view this grievance."
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "citizen-dashboard.html";

                    },

                    1500
                );


                return;

            }


            // ======================================
            // RENDER PAGE
            // ======================================

            renderHero();

            renderProgressTracker();

            renderGrievanceDetails();

            renderAIAssessment();

            renderTechnicianDetails();

            renderResolution();

            renderFeedback();

        }

        catch (error) {

            console.error(
                "Grievance details error:",
                error
            );


            showMessage(
                error.message
            );

        }

        finally {

            if (loading) {

                loading.style.display =
                    "none";

            }


            if (

                container &&
                currentGrievance

            ) {

                container.style.display =
                    "block";

            }

        }

    }


    // ==========================================
    // RENDER HERO
    // ==========================================

    function renderHero() {

        const title =
            document.getElementById(
                "grievanceTitle"
            );


        const subtitle =
            document.getElementById(
                "grievanceSubtitle"
            );


        const statusContainer =
            document.getElementById(
                "statusBadgeContainer"
            );


        if (title) {

            title.textContent =
                currentGrievance.subject;

        }


        if (subtitle) {

            subtitle.textContent =
                "Grievance #" +
                currentGrievance.id +
                " • " +
                formatDate(
                    currentGrievance.created_at
                );

        }


        if (statusContainer) {

            statusContainer.outerHTML =
                getStatusBadge(
                    currentGrievance.status
                );

        }

    }


    // ==========================================
    // STATUS PROGRESS TRACKER
    // ==========================================

    function renderProgressTracker() {

        const tracker =
            document.getElementById(
                "progressTracker"
            );


        if (!tracker) {

            return;

        }


        const steps = [

            {
                name: "Submitted",
                icon: "📨"
            },

            {
                name: "Pending",
                icon: "⏳"
            },

            {
                name: "Assigned",
                icon: "👨‍🔧"
            },

            {
                name: "In Progress",
                icon: "🔧"
            },

            {
                name: "Resolved",
                icon: "✅"
            }

        ];


        let currentStep = 1;


        if (
            currentGrievance.status ===
            "Pending"
        ) {

            currentStep = 2;

        }


        else if (
            currentGrievance.status ===
            "Assigned"
        ) {

            currentStep = 3;

        }


        else if (
            currentGrievance.status ===
            "In Progress"
        ) {

            currentStep = 4;

        }


        else if (
            currentGrievance.status ===
            "Resolved"
        ) {

            currentStep = 5;

        }


        else if (
            currentGrievance.status ===
            "Rejected"
        ) {

            tracker.innerHTML = `

                <div
                    style="
                        width: 100%;
                        padding: 20px;
                        background: #fee2e2;
                        border-radius: 10px;
                        text-align: center;
                        color: #991b1b;
                    "
                >

                    ❌ This grievance has been rejected.

                </div>

            `;


            return;

        }


        let html = "";


        steps.forEach(
            function (step, index) {

                const stepNumber =
                    index + 1;


                const completed =
                    stepNumber <= currentStep;


                html += `

                    <div
                        style="
                            flex: 1;
                            min-width: 120px;
                            text-align: center;
                            padding: 15px;
                            border-radius: 12px;
                            background:
                                ${

                                    completed

                                        ? "#dcfce7"

                                        : "#f1f5f9"

                                };
                        "
                    >

                        <div
                            style="
                                font-size: 1.8rem;
                                margin-bottom: 8px;
                            "
                        >

                            ${step.icon}

                        </div>


                        <strong>

                            ${step.name}

                        </strong>


                        <div
                            style="
                                font-size: 0.8rem;
                                margin-top: 5px;
                                color: var(--text-secondary);
                            "
                        >

                            ${

                                completed

                                    ? "Completed"

                                    : "Waiting"

                            }

                        </div>

                    </div>

                `;

            }
        );


        tracker.innerHTML =
            html;

    }


    // ==========================================
    // RENDER GRIEVANCE DETAILS
    // ==========================================

    function renderGrievanceDetails() {

        const container =
            document.getElementById(
                "grievanceDetails"
            );


        if (!container) {

            return;

        }


        container.innerHTML = `

            ${createDetailRow(
                "🆔 Grievance ID",
                "#" + currentGrievance.id
            )}


            ${createDetailRow(
                "📌 Subject",
                currentGrievance.subject
            )}


            ${createDetailRow(
                "📍 Location",
                currentGrievance.location
            )}


            ${createDetailRow(
                "📅 Submitted On",
                formatDate(
                    currentGrievance.created_at
                )
            )}


            <div
                style="
                    margin-top: 20px;
                "
            >

                <strong>

                    📝 Description

                </strong>


                <p
                    style="
                        margin-top: 10px;
                        line-height: 1.7;
                        color: var(--text-secondary);
                    "
                >

                    ${escapeHtml(
                        currentGrievance.description
                    )}

                </p>

            </div>

        `;

    }


    // ==========================================
    // RENDER AI ASSESSMENT
    // ==========================================

    function renderAIAssessment() {

        const container =
            document.getElementById(
                "aiAssessment"
            );


        if (!container) {

            return;

        }


        container.innerHTML = `

            ${createDetailRow(
                "🏷️ Category",
                currentGrievance.category ||
                "Not available"
            )}


            ${createDetailRow(
                "🏢 Department",
                currentGrievance.department ||
                "Not assigned"
            )}


            ${createDetailRow(
                "⚡ Priority",
                currentGrievance.priority ||
                "Medium"
            )}


            <div
                style="
                    margin-top: 20px;
                "
            >

                <strong>

                    🤖 AI Reasoning

                </strong>


                <p
                    style="
                        margin-top: 10px;
                        line-height: 1.7;
                        color: var(--text-secondary);
                    "
                >

                    ${escapeHtml(
                        currentGrievance.ai_reason ||
                        "No AI reasoning available."
                    )}

                </p>

            </div>

        `;

    }


    // ==========================================
    // RENDER TECHNICIAN DETAILS
    // ==========================================

    function renderTechnicianDetails() {

        const container =
            document.getElementById(
                "technicianDetails"
            );


        if (!container) {

            return;

        }


        if (

            !currentGrievance.assigned_technician_name

        ) {

            container.innerHTML = `

                <div
                    style="
                        padding: 20px;
                        background: #f8fafc;
                        border-radius: 10px;
                        color: var(--text-secondary);
                    "
                >

                    ⏳ No technician has been assigned yet.

                </div>

            `;


            return;

        }


        container.innerHTML = `

            ${createDetailRow(
                "👨‍🔧 Assigned Technician",
                currentGrievance.assigned_technician_name
            )}


            <div
                style="
                    margin-top: 20px;
                "
            >

                <strong>

                    🔍 Diagnosis / Work Details

                </strong>


                <p
                    style="
                        margin-top: 10px;
                        line-height: 1.7;
                        color: var(--text-secondary);
                    "
                >

                    ${escapeHtml(

                        currentGrievance.diagnosis ||

                        "The technician has not added work details yet."

                    )}

                </p>

            </div>

        `;

    }


    // ==========================================
    // RENDER RESOLUTION
    // ==========================================

    function renderResolution() {

        const container =
            document.getElementById(
                "resolutionDetails"
            );


        if (!container) {

            return;

        }


        if (
            currentGrievance.status !==
            "Resolved"
        ) {

            container.innerHTML = `

                <div
                    style="
                        padding: 20px;
                        background: #f8fafc;
                        border-radius: 10px;
                        color: var(--text-secondary);
                    "
                >

                    ⏳ This grievance has not been resolved yet.

                </div>

            `;


            return;

        }


        container.innerHTML = `

            <div
                style="
                    padding: 20px;
                    background: #dcfce7;
                    border-radius: 10px;
                "
            >

                <strong>

                    🎉 Grievance Resolved

                </strong>


                <p
                    style="
                        margin-top: 12px;
                        line-height: 1.7;
                        color: #166534;
                    "
                >

                    ${escapeHtml(

                        currentGrievance.resolution_note ||

                        "The grievance has been marked as resolved."

                    )}

                </p>

            </div>

        `;

    }


    // ==========================================
    // RENDER FEEDBACK SECTION
    // ==========================================

    function renderFeedback() {

        const section =
            document.getElementById(
                "feedbackSection"
            );


        if (!section) {

            return;

        }


        // ONLY SHOW FOR RESOLVED GRIEVANCES

        if (
            currentGrievance.status !==
            "Resolved"
        ) {

            section.style.display =
                "none";

            return;

        }


        section.style.display =
            "block";


        const ratingContainer =
            document.getElementById(
                "ratingContainer"
            );


        const feedbackInput =
            document.getElementById(
                "feedbackInput"
            );


        const submitButton =
            document.getElementById(
                "submitFeedbackButton"
            );


        const existingFeedback =
            document.getElementById(
                "existingFeedback"
            );


        // ======================================
        // EXISTING FEEDBACK
        // ======================================

        if (
            currentGrievance.rating
        ) {

            selectedRating =
                currentGrievance.rating;


            if (ratingContainer) {

                ratingContainer.style.display =
                    "none";

            }


            if (feedbackInput) {

                feedbackInput.style.display =
                    "none";

            }


            if (submitButton) {

                submitButton.style.display =
                    "none";

            }


            if (existingFeedback) {

                existingFeedback.style.display =
                    "block";


                existingFeedback.innerHTML = `

                    <h3>

                        ⭐ Your Feedback

                    </h3>


                    <p
                        style="
                            margin-top: 10px;
                        "
                    >

                        <strong>

                            Rating:

                        </strong>

                        ${"⭐".repeat(
                            currentGrievance.rating
                        )}

                    </p>


                    <p
                        style="
                            margin-top: 10px;
                            color: var(--text-secondary);
                            line-height: 1.6;
                        "
                    >

                        ${escapeHtml(
                            currentGrievance.feedback ||
                            "No written feedback provided."
                        )}

                    </p>

                `;

            }


            return;

        }


        // ======================================
        // RESET INPUTS
        // ======================================

        if (ratingContainer) {

            ratingContainer.style.display =
                "flex";

        }


        if (feedbackInput) {

            feedbackInput.style.display =
                "block";

        }


        if (submitButton) {

            submitButton.style.display =
                "inline-block";

        }


        if (existingFeedback) {

            existingFeedback.style.display =
                "none";

        }

    }


    // ==========================================
    // CREATE DETAIL ROW
    // ==========================================

    function createDetailRow(
        label,
        value
    ) {

        return `

            <div
                style="
                    padding: 15px 0;
                    border-bottom:
                        1px solid #e2e8f0;
                "
            >

                <strong>

                    ${escapeHtml(label)}

                </strong>


                <div
                    style="
                        margin-top: 6px;
                        color: var(--text-secondary);
                    "
                >

                    ${escapeHtml(value)}

                </div>

            </div>

        `;

    }


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


        else if (

            status === "Pending" ||

            status === "Assigned"

        ) {

            className =
                "badge-warning";

        }


        else if (status === "Rejected") {

            className =
                "badge-danger";

        }


        return `

            <span
                id="statusBadgeContainer"
                class="badge ${className}"
            >

                ${escapeHtml(
                    status || "Unknown"
                )}

            </span>

        `;

    }


    // ==========================================
    // FORMAT DATE
    // ==========================================

    function formatDate(
        dateValue
    ) {

        if (!dateValue) {

            return "Not available";

        }


        try {

            const date =
                new Date(dateValue);


            return date.toLocaleString();

        }

        catch (error) {

            return String(
                dateValue
            );

        }

    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHtml(
        value
    ) {

        if (

            value === null ||

            value === undefined

        ) {

            return "";

        }


        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            String(value);


        return div.innerHTML;

    }


    // ==========================================
    // RATING BUTTONS
    // ==========================================

    const ratingButtons =
        document.querySelectorAll(
            ".rating-btn"
        );


    ratingButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    selectedRating =
                        Number(
                            button.dataset.rating
                        );


                    ratingButtons.forEach(
                        function (ratingButton) {

                            const rating =
                                Number(
                                    ratingButton.dataset.rating
                                );


                            if (
                                rating <= selectedRating
                            ) {

                                ratingButton.classList.add(
                                    "btn-primary"
                                );


                                ratingButton.classList.remove(
                                    "btn-outline"
                                );

                            }

                            else {

                                ratingButton.classList.remove(
                                    "btn-primary"
                                );


                                ratingButton.classList.add(
                                    "btn-outline"
                                );

                            }

                        }
                    );

                }
            );

        }
    );


    // ==========================================
    // SUBMIT FEEDBACK
    // ==========================================

    const submitFeedbackButton =
        document.getElementById(
            "submitFeedbackButton"
        );


    if (submitFeedbackButton) {

        submitFeedbackButton.addEventListener(
            "click",
            async function () {

                if (!currentGrievance) {

                    return;

                }


                if (!selectedRating) {

                    showMessage(
                        "Please select a rating."
                    );

                    return;

                }


                const feedbackInput =
                    document.getElementById(
                        "feedbackInput"
                    );


                const feedback =
                    feedbackInput
                        ? feedbackInput.value.trim()
                        : "";


                try {

                    submitFeedbackButton.disabled =
                        true;


                    submitFeedbackButton.textContent =
                        "Submitting...";


                    const data =
                        await apiRequest(

                            API_BASE +
                            "/grievances/" +
                            currentGrievance.id +
                            "/feedback",

                            {

                                method: "PUT",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify({

                                        rating:
                                            selectedRating,

                                        feedback:
                                            feedback

                                    })

                            }

                        );


                    showMessage(

                        data.message ||
                        "Feedback submitted successfully.",

                        "success"

                    );


                    // ==================================
                    // RELOAD DETAILS
                    // ==================================

                    await loadGrievance();

                }

                catch (error) {

                    console.error(
                        "Feedback submission error:",
                        error
                    );


                    showMessage(
                        error.message
                    );

                }

                finally {

                    submitFeedbackButton.disabled =
                        false;


                    submitFeedbackButton.textContent =
                        "⭐ Submit Feedback";

                }

            }
        );

    }


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    loadGrievance();

});
