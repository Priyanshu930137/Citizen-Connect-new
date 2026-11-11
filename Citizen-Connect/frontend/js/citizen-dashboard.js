// ==========================================
// CITIZEN CONNECT - CITIZEN DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const API_BASE = window.CitizenConnect.apiBase();

    let allGrievances = [];


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


    if (currentUser.role !== "citizen") {

        alert(
            "You are not authorized to access the Citizen Dashboard."
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
                "citizenMessage"
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
    // LOAD CITIZEN GRIEVANCES
    // ==========================================

    async function loadGrievances() {

        const loading =
            document.getElementById(
                "loadingGrievances"
            );


        const tableContainer =
            document.getElementById(
                "tableContainer"
            );


        if (loading) {

            loading.style.display =
                "block";

        }


        if (tableContainer) {

            tableContainer.style.display =
                "none";

        }


        try {

            /*
             * IMPORTANT:
             * This endpoint must return only
             * grievances belonging to the logged-in citizen.
             */

            allGrievances =
                await apiRequest(

                    API_BASE +
                    "/citizens/" +
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


            if (tableContainer) {

                tableContainer.style.display =
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


        const pending =
            allGrievances.filter(
                function (grievance) {

                    return grievance.status ===
                        "Pending";

                }
            ).length;


        const inProgress =
            allGrievances.filter(
                function (grievance) {

                    return (

                        grievance.status ===
                        "Assigned"

                        ||

                        grievance.status ===
                        "In Progress"

                    );

                }
            ).length;


        const resolved =
            allGrievances.filter(
                function (grievance) {

                    return grievance.status ===
                        "Resolved";

                }
            ).length;


        document.getElementById(
            "totalCount"
        ).textContent =
            total;


        document.getElementById(
            "pendingCount"
        ).textContent =
            pending;


        document.getElementById(
            "progressCount"
        ).textContent =
            inProgress;


        document.getElementById(
            "resolvedCount"
        ).textContent =
            resolved;

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

                            grievance.category

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
                "grievanceTableBody"
            );


        if (!tableBody) {

            return;

        }


        // NO GRIEVANCES

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

                        You haven't submitted any grievances yet.

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



                        <!-- CATEGORY -->

                        <td style="padding: 16px;">

                            ${escapeHtml(
                                grievance.category ||
                                "Uncategorized"
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
                                class="btn btn-outline"
                                onclick="viewGrievance(
                                    ${grievance.id}
                                )"
                            >

                                👁 View

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
    // VIEW GRIEVANCE
    // ==========================================

    window.viewGrievance =
        function (grievanceId) {

            window.location.href =
                "citizen-details.html?id=" +
                grievanceId;

        };


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
    // REFRESH
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
