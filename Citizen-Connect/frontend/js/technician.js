// ==========================================
// CITIZEN CONNECT - TECHNICIAN DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const API_BASE = window.CitizenConnect.apiBase();

    let allGrievances = [];
    let selectedGrievance = null;


    // ==========================================
    // GET CURRENT USER
    // ==========================================

    function getCurrentUser() {

        const userData =
            localStorage.getItem("citizenConnectUser");


        if (!userData) {

            window.location.href =
                "login.html";

            return null;

        }


        try {

            return JSON.parse(userData);

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

    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        return;

    }


    if (currentUser.role !== "technician") {

        alert(
            "You are not authorized to access the Technician Dashboard."
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
    // SHOW MESSAGE
    // ==========================================

    function showMessage(
        message,
        type = "error"
    ) {

        const messageBox =
            document.getElementById(
                "technicianMessage"
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
    // LOAD TECHNICIAN GRIEVANCES
    // ==========================================

    async function loadGrievances() {

        const loading =
            document.getElementById(
                "loadingJobs"
            );


        const container =
            document.getElementById(
                "jobsContainer"
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

            allGrievances =
                await apiRequest(

                    API_BASE +
                    "/technicians/" +
                    currentUser.id +
                    "/grievances"

                );


            updateStatistics();


            applyFilters();

        }

        catch (error) {

            console.error(
                "Grievance loading error:",
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


            if (container) {

                container.style.display =
                    "block";

            }

        }

    }


    // ==========================================
    // UPDATE STATISTICS
    // ==========================================

    function updateStatistics() {

        const total =
            allGrievances.length;


        const assigned =
            allGrievances.filter(
                function (grievance) {

                    return grievance.status ===
                        "Assigned";

                }
            ).length;


        const inProgress =
            allGrievances.filter(
                function (grievance) {

                    return grievance.status ===
                        "In Progress";

                }
            ).length;


        const resolved =
            allGrievances.filter(
                function (grievance) {

                    return grievance.status ===
                        "Resolved";

                }
            ).length;


        const totalElement =
            document.getElementById(
                "totalAssignedCount"
            );


        const assignedElement =
            document.getElementById(
                "assignedCount"
            );


        const progressElement =
            document.getElementById(
                "inProgressCount"
            );


        const resolvedElement =
            document.getElementById(
                "resolvedCount"
            );


        if (totalElement) {

            totalElement.textContent =
                total;

        }


        if (assignedElement) {

            assignedElement.textContent =
                assigned;

        }


        if (progressElement) {

            progressElement.textContent =
                inProgress;

        }


        if (resolvedElement) {

            resolvedElement.textContent =
                resolved;

        }

    }


    // ==========================================
    // APPLY FILTERS
    // ==========================================

    function applyFilters() {

        const searchInput =
            document.getElementById(
                "searchInput"
            );


        const statusFilter =
            document.getElementById(
                "statusFilter"
            );


        const search =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const status =
            statusFilter
                ? statusFilter.value
                : "";


        const filtered =
            allGrievances.filter(
                function (grievance) {

                    const searchableText =
                        [

                            grievance.id,

                            grievance.subject,

                            grievance.location,

                            grievance.description

                        ]
                            .join(" ")
                            .toLowerCase();


                    const matchesSearch =

                        !search ||

                        searchableText.includes(
                            search
                        );


                    const matchesStatus =

                        !status ||

                        grievance.status ===
                        status;


                    return (

                        matchesSearch &&
                        matchesStatus

                    );

                }
            );


        renderGrievances(
            filtered
        );

    }


    // ==========================================
    // RENDER GRIEVANCES
    // ==========================================

    function renderGrievances(
        grievances
    ) {

        const tableBody =
            document.getElementById(
                "jobsTableBody"
            );


        if (!tableBody) {

            return;

        }


        // ======================================
        // NO GRIEVANCES
        // ======================================

        if (grievances.length === 0) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        style="
                            padding: 35px;
                            text-align: center;
                            color: var(--text-secondary);
                        "
                    >

                        No assigned grievances found.

                    </td>

                </tr>

            `;


            return;

        }


        let html = "";


        grievances.forEach(
            function (grievance) {

                html += `

                    <tr
                        style="
                            border-bottom:
                            1px solid #e2e8f0;
                        "
                    >


                        <!-- ID -->

                        <td style="padding: 16px;">

                            #${grievance.id}

                        </td>



                        <!-- SUBJECT -->

                        <td style="padding: 16px;">

                            <strong>

                                ${escapeHtml(
                                    grievance.subject
                                )}

                            </strong>

                        </td>



                        <!-- LOCATION -->

                        <td style="padding: 16px;">

                            ${escapeHtml(
                                grievance.location
                            )}

                        </td>



                        <!-- PRIORITY -->

                        <td style="padding: 16px;">

                            ${getPriorityBadge(
                                grievance.priority
                            )}

                        </td>



                        <!-- STATUS -->

                        <td style="padding: 16px;">

                            ${getStatusBadge(
                                grievance.status
                            )}

                        </td>



                        <!-- ACTION -->

                        <td style="padding: 16px;">

                            <button
                                class="btn btn-primary"
                                onclick="openUpdateModal(
                                    ${grievance.id}
                                )"
                            >

                                🔧 Update

                            </button>

                        </td>


                    </tr>

                `;

            }
        );


        tableBody.innerHTML =
            html;

    }


    // ==========================================
    // OPEN UPDATE MODAL
    // ==========================================

    window.openUpdateModal =
        function (grievanceId) {

            selectedGrievance =
                allGrievances.find(
                    function (grievance) {

                        return grievance.id ===
                            grievanceId;

                    }
                );


            if (!selectedGrievance) {

                showMessage(
                    "Grievance not found."
                );

                return;

            }


            const modal =
                document.getElementById(
                    "updateModal"
                );


            const info =
                document.getElementById(
                    "selectedGrievanceInfo"
                );


            const status =
                document.getElementById(
                    "updateStatus"
                );


            const diagnosis =
                document.getElementById(
                    "diagnosisInput"
                );


            const resolution =
                document.getElementById(
                    "resolutionInput"
                );


            if (info) {

                info.innerHTML = `

                    <strong>
                        Grievance #${selectedGrievance.id}
                    </strong>

                    <br><br>

                    <strong>Subject:</strong>

                    ${escapeHtml(
                        selectedGrievance.subject
                    )}

                    <br><br>

                    <strong>Location:</strong>

                    ${escapeHtml(
                        selectedGrievance.location
                    )}

                    <br><br>

                    <strong>Description:</strong>

                    ${escapeHtml(
                        selectedGrievance.description
                    )}

                `;

            }


            if (status) {

                status.value =
                    selectedGrievance.status ===
                    "Resolved"

                        ? "Resolved"

                        : "In Progress";

            }


            if (diagnosis) {

                diagnosis.value =
                    selectedGrievance.diagnosis ||
                    "";

            }


            if (resolution) {

                resolution.value =
                    selectedGrievance.resolution_note ||
                    "";

            }


            if (modal) {

                modal.style.display =
                    "block";

            }

        };


    // ==========================================
    // CLOSE MODAL
    // ==========================================

    function closeUpdateModal() {

        const modal =
            document.getElementById(
                "updateModal"
            );


        if (modal) {

            modal.style.display =
                "none";

        }


        selectedGrievance =
            null;

    }


    // ==========================================
    // CLOSE BUTTON
    // ==========================================

    const closeModalButton =
        document.getElementById(
            "closeModalButton"
        );


    if (closeModalButton) {

        closeModalButton.addEventListener(
            "click",
            closeUpdateModal
        );

    }


    // ==========================================
    // CLOSE MODAL WHEN CLICKING OUTSIDE
    // ==========================================

    const modal =
        document.getElementById(
            "updateModal"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeUpdateModal();

                }

            }
        );

    }


    // ==========================================
    // SUBMIT UPDATE
    // ==========================================

    const submitUpdateButton =
        document.getElementById(
            "submitUpdateButton"
        );


    if (submitUpdateButton) {

        submitUpdateButton.addEventListener(
            "click",
            async function () {

                if (!selectedGrievance) {

                    showMessage(
                        "No grievance selected."
                    );

                    return;

                }


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


                // ==================================
                // VALIDATE RESOLUTION
                // ==================================

                if (
                    status === "Resolved" &&
                    !resolution
                ) {

                    showMessage(
                        "Please provide a resolution note before marking the grievance as resolved."
                    );

                    return;

                }


                try {

                    submitUpdateButton.disabled =
                        true;


                    submitUpdateButton.textContent =
                        "Saving...";


                    const data =
                        await apiRequest(

                            API_BASE +
                            "/grievances/" +
                            selectedGrievance.id +
                            "/technician-update",

                            {

                                method: "PUT",

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


                    closeUpdateModal();


                    await loadGrievances();

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

                    submitUpdateButton.disabled =
                        false;


                    submitUpdateButton.textContent =
                        "💾 Save Update";

                }

            }
        );

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


        else if (status === "Assigned") {

            className =
                "badge-warning";

        }


        else if (
            status === "In Progress"
        ) {

            className =
                "badge-progress";

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
    // SEARCH EVENT
    // ==========================================

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    // ==========================================
    // STATUS FILTER
    // ==========================================

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    const clearFiltersButton =
        document.getElementById(
            "clearFiltersButton"
        );


    if (clearFiltersButton) {

        clearFiltersButton.addEventListener(
            "click",
            function () {

                if (searchInput) {

                    searchInput.value =
                        "";

                }


                if (statusFilter) {

                    statusFilter.value =
                        "";

                }


                applyFilters();

            }
        );

    }


    // ==========================================
    // REFRESH BUTTON
    // ==========================================

    const refreshButton =
        document.getElementById(
            "refreshButton"
        );


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            async function () {

                refreshButton.disabled =
                    true;


                refreshButton.textContent =
                    "Refreshing...";


                await loadGrievances();


                refreshButton.disabled =
                    false;


                refreshButton.textContent =
                    "🔄 Refresh";

            }
        );

    }


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    loadGrievances();

});
