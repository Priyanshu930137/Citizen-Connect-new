// ==========================================
// CITIZEN CONNECT - AUTHORITY DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const API_BASE = window.CitizenConnect.apiBase();

    let allGrievances = [];
    let visibleGrievances = [];

    let statusChart = null;
    let categoryChart = null;
    let priorityChart = null;


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

        } catch (error) {

            localStorage.removeItem(
                "citizenConnectUser"
            );

            window.location.href = "login.html";

            return null;

        }

    }


    // ==========================================
    // USER AUTHORIZATION
    // ==========================================

    const currentUser = getCurrentUser();

    if (!currentUser) {

        return;

    }


    if (currentUser.role !== "authority") {

        alert(
            "You are not authorized to access the Authority Dashboard."
        );

        window.location.href = "index.html";

        return;

    }


    // ==========================================
    // DISPLAY USER NAME
    // ==========================================

    const userName =
        document.getElementById("userName");


    if (userName) {

        userName.textContent =
            "👋 " + currentUser.name;

    }


    // ==========================================
    // LOGOUT
    // ==========================================

    const logoutButton =
        document.getElementById("logoutButton");


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

    function showMessage(message, type = "error") {

        const messageBox =
            document.getElementById(
                "adminMessage"
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

    async function apiRequest(url) {

        const response =
            await fetch(url);


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
    // LOAD DASHBOARD STATISTICS
    // ==========================================

    async function loadStatistics() {

        try {

            const data =
                await apiRequest(
                    API_BASE + "/dashboard/stats"
                );


            document.getElementById(
                "totalCount"
            ).textContent =
                data.total || 0;


            document.getElementById(
                "pendingCount"
            ).textContent =
                data.pending || 0;


            document.getElementById(
                "progressCount"
            ).textContent =
                data.in_progress || 0;


            document.getElementById(
                "resolvedCount"
            ).textContent =
                data.resolved || 0;


            document.getElementById(
                "highPriorityCount"
            ).textContent =
                data.open_high_priority ?? data.high_priority ?? 0;

            document.getElementById("unassignedOpenCount").textContent =
                data.unassigned_open ?? 0;

            document.getElementById("overdueOpenCount").textContent =
                data.overdue_open ?? 0;


        }

        catch (error) {

            console.error(
                "Statistics error:",
                error
            );

        }

    }


    // ==========================================
    // GET HIGHEST VALUE
    // ==========================================

    function getHighestEntry(object) {

        if (
            !object ||
            Object.keys(object).length === 0
        ) {

            return null;

        }


        return Object.entries(object)
            .sort(function (a, b) {

                return b[1] - a[1];

            })[0];

    }


    // ==========================================
    // LOAD ANALYTICS
    // ==========================================

    async function loadAnalytics() {

        try {

            const data =
                await apiRequest(
                    API_BASE + "/dashboard/analytics"
                );


            // ==============================
            // TOP CATEGORY
            // ==============================

            const topCategory =
                getHighestEntry(
                    data.categories
                );


            const topCategoryElement =
                document.getElementById(
                    "topCategory"
                );


            const topCategoryCount =
                document.getElementById(
                    "topCategoryCount"
                );


            if (topCategory) {

                topCategoryElement.textContent =
                    topCategory[0];


                topCategoryCount.textContent =
                    topCategory[1] +
                    " grievance(s)";

            }

            else {

                topCategoryElement.textContent =
                    "No data";


                topCategoryCount.textContent =
                    "-";

            }


            // ==============================
            // TOP DEPARTMENT
            // ==============================

            const topDepartment =
                getHighestEntry(
                    data.departments
                );


            const topDepartmentElement =
                document.getElementById(
                    "topDepartment"
                );


            const topDepartmentCount =
                document.getElementById(
                    "topDepartmentCount"
                );


            if (topDepartment) {

                topDepartmentElement.textContent =
                    topDepartment[0];


                topDepartmentCount.textContent =
                    topDepartment[1] +
                    " grievance(s)";

            }

            else {

                topDepartmentElement.textContent =
                    "No data";


                topDepartmentCount.textContent =
                    "-";

            }


            // ==============================
            // RESOLUTION RATE
            // ==============================

            const total =
                data.total || 0;


            const resolved =
                data.statuses?.Resolved || 0;


            let resolutionRate = 0;


            if (total > 0) {

                resolutionRate =
                    Math.round(
                        (resolved / total) * 100
                    );

            }


            document.getElementById(
                "resolutionRate"
            ).textContent =
                resolutionRate + "%";


            // ==============================
            // CHARTS
            // ==============================

            createCharts(data);


            // ==============================
            // DEPARTMENT WORKLOAD
            // ==============================

            renderDepartmentWorkload(
                data.departments
            );


        }

        catch (error) {

            console.error(
                "Analytics error:",
                error
            );

        }

    }


    // ==========================================
    // CREATE CHARTS
    // ==========================================

    function createCharts(data) {

        if (typeof Chart === "undefined") {

            console.error(
                "Chart.js is not loaded."
            );

            return;

        }


        // ==============================
        // STATUS CHART
        // ==============================

        const statusCanvas =
            document.getElementById(
                "statusChart"
            );


        if (statusChart) {

            statusChart.destroy();

        }


        if (statusCanvas) {

            statusChart =
                new Chart(
                    statusCanvas,
                    {

                        type: "doughnut",

                        data: {

                            labels:
                                Object.keys(
                                    data.statuses || {}
                                ),

                            datasets: [
                                {

                                    data:
                                        Object.values(
                                            data.statuses || {}
                                        )

                                }
                            ]

                        },

                        options: {

                            responsive: true,

                            plugins: {

                                legend: {

                                    position:
                                        "bottom"

                                }

                            }

                        }

                    }
                );

        }


        // ==============================
        // CATEGORY CHART
        // ==============================

        const categoryCanvas =
            document.getElementById(
                "categoryChart"
            );


        if (categoryChart) {

            categoryChart.destroy();

        }


        if (categoryCanvas) {

            categoryChart =
                new Chart(
                    categoryCanvas,
                    {

                        type: "bar",

                        data: {

                            labels:
                                Object.keys(
                                    data.categories || {}
                                ),

                            datasets: [
                                {

                                    label:
                                        "Grievances",

                                    data:
                                        Object.values(
                                            data.categories || {}
                                        )

                                }
                            ]

                        },

                        options: {

                            responsive: true,

                            plugins: {

                                legend: {

                                    display:
                                        false

                                }

                            }

                        }

                    }
                );

        }


        // ==============================
        // PRIORITY CHART
        // ==============================

        const priorityCanvas =
            document.getElementById(
                "priorityChart"
            );


        if (priorityChart) {

            priorityChart.destroy();

        }


        if (priorityCanvas) {

            priorityChart =
                new Chart(
                    priorityCanvas,
                    {

                        type: "pie",

                        data: {

                            labels:
                                Object.keys(
                                    data.priorities || {}
                                ),

                            datasets: [
                                {

                                    data:
                                        Object.values(
                                            data.priorities || {}
                                        )

                                }
                            ]

                        },

                        options: {

                            responsive: true,

                            plugins: {

                                legend: {

                                    position:
                                        "bottom"

                                }

                            }

                        }

                    }
                );

        }

    }


    // ==========================================
    // DEPARTMENT WORKLOAD
    // ==========================================

    function renderDepartmentWorkload(departments) {

        const container =
            document.getElementById(
                "departmentWorkload"
            );


        if (!container) {

            return;

        }


        const entries =
            Object.entries(
                departments || {}
            );


        if (entries.length === 0) {

            container.innerHTML = `

                <p style="color: var(--text-secondary);">
                    No department workload data available.
                </p>

            `;

            return;

        }


        entries.sort(function (a, b) {

            return b[1] - a[1];

        });


        let html = "";


        entries.forEach(function (item) {

            const department =
                item[0];


            const count =
                item[1];


            html += `

                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 14px 0;
                        border-bottom: 1px solid #e2e8f0;
                    "
                >

                    <span>
                        ${department}
                    </span>

                    <strong>
                        ${count}
                    </strong>

                </div>

            `;

        });


        container.innerHTML = html;

    }


    // ==========================================
    // LOAD AUTOMATED INSIGHTS
    // ==========================================

    async function loadInsights() {

        const container =
            document.getElementById(
                "insightsContainer"
            );


        if (!container) {

            return;

        }


        try {

            const data =
                await apiRequest(
                    API_BASE +
                    "/dashboard/insights"
                );


            if (
                !data.insights ||
                data.insights.length === 0
            ) {

                container.innerHTML = `

                    <p style="color: var(--text-secondary);">
                        No insights available.
                    </p>

                `;

                return;

            }


            let html = "";


            data.insights.forEach(
                function (insight) {

                    html += `

                        <div
                            style="
                                padding: 14px;
                                margin-bottom: 12px;
                                background: #f8fafc;
                                border-radius: 10px;
                            "
                        >

                            💡 ${insight}

                        </div>

                    `;

                }
            );


            container.innerHTML = html;

        }

        catch (error) {

            container.innerHTML = `

                <p style="color: #991b1b;">
                    Unable to load insights.
                </p>

            `;

        }

    }


    // ==========================================
    // LOAD ALL GRIEVANCES
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

            allGrievances =
                await apiRequest(
                    API_BASE + "/grievances"
                );


            populateCategoryFilter();
            populateDepartmentFilter();


            applyFilters();

        }

        catch (error) {

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
    // POPULATE CATEGORY FILTER
    // ==========================================

    function populateCategoryFilter() {

        const categoryFilter =
            document.getElementById(
                "categoryFilter"
            );


        if (!categoryFilter) {

            return;

        }


        const selectedValue =
            categoryFilter.value;


        const categories =
            [
                ...new Set(

                    allGrievances
                        .map(function (grievance) {

                            return grievance.category;

                        })
                        .filter(Boolean)

                )
            ];


        categoryFilter.innerHTML = `

            <option value="">
                All Categories
            </option>

        `;


        categories.forEach(
            function (category) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    category;


                option.textContent =
                    category;


                categoryFilter.appendChild(
                    option
                );

            }
        );


        categoryFilter.value =
            selectedValue;

    }

    function populateDepartmentFilter() {
        const filter = document.getElementById("departmentFilter");
        if (!filter) return;
        const selected = filter.value;
        const departments = [...new Set(allGrievances.map(item => item.department).filter(Boolean))].sort();
        filter.replaceChildren(new Option("All Departments", ""));
        departments.forEach(department => filter.add(new Option(department, department)));
        filter.value = selected;
    }


    // ==========================================
    // APPLY FILTERS
    // ==========================================

    function applyFilters() {

        const search =
            document.getElementById(
                "searchInput"
            ).value
                .toLowerCase()
                .trim();


        const status =
            document.getElementById(
                "statusFilter"
            ).value;


        const priority =
            document.getElementById(
                "priorityFilter"
            ).value;


        const category =
            document.getElementById(
                "categoryFilter"
            ).value;

        const department = document.getElementById("departmentFilter").value;


        const filtered =
            allGrievances.filter(
                function (grievance) {

                    const searchableText =
                        [

                            grievance.id,

                            grievance.subject,

                            grievance.citizen_name,

                            grievance.category,
                            grievance.email,
                            grievance.department,
                            grievance.location,
                            grievance.assigned_technician_name

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


                    const matchesPriority =
                        !priority ||
                        grievance.priority ===
                        priority;


                    const matchesCategory =
                        !category ||
                        grievance.category ===
                        category;

                    const matchesDepartment =
                        !department || grievance.department === department;


                    return (

                        matchesSearch &&
                        matchesStatus &&
                        matchesPriority &&
                        matchesCategory &&
                        matchesDepartment

                    );

                }
            );


        renderGrievances(
            filtered
        );

        visibleGrievances = filtered;
        const resultCount = document.getElementById("grievanceResultCount");
        if (resultCount) {
            resultCount.textContent = `Showing ${filtered.length} of ${allGrievances.length} grievances`;
        }

    }


    // ==========================================
    // RENDER GRIEVANCES
    // ==========================================

    function renderGrievances(grievances) {

        const tableBody =
            document.getElementById(
                "grievanceTableBody"
            );


        if (!tableBody) {

            return;

        }


        if (grievances.length === 0) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        style="
                            padding: 30px;
                            text-align: center;
                            color: var(--text-secondary);
                        "
                    >

                        No grievances found.

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

                        <td style="padding: 16px;">

                            #${grievance.id}

                        </td>


                        <td style="padding: 16px;">

                            <strong>
                                ${escapeHtml(
                                    grievance.subject
                                )}
                            </strong>

                        </td>


                        <td style="padding: 16px;">

                            ${escapeHtml(
                                grievance.citizen_name
                            )}

                        </td>


                        <td style="padding: 16px;">

                            ${escapeHtml(
                                grievance.category ||
                                "Uncategorized"
                            )}

                        </td>


                        <td style="padding: 16px;">

                            ${getPriorityBadge(
                                grievance.priority
                            )}

                        </td>


                        <td style="padding: 16px;">

                            ${getStatusBadge(
                                grievance.status
                            )}

                        </td>


                        <td style="padding: 16px;">

                            <button
                                class="btn btn-outline"
                                onclick="viewGrievance(
                                    ${grievance.id}
                                )"
                            >

                                View

                            </button>

                        </td>

                    </tr>

                `;

            }
        );


        tableBody.innerHTML = html;

    }


    // ==========================================
    // STATUS BADGE
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
                ${status || "Unknown"}
            </span>

        `;

    }


    // ==========================================
    // PRIORITY BADGE
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
                ${priority || "Medium"}
            </span>

        `;

    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHtml(value) {

        if (!value) {

            return "";

        }


        const div =
            document.createElement("div");


        div.textContent =
            value;


        return div.innerHTML;

    }


    // ==========================================
    // VIEW GRIEVANCE
    // ==========================================

    window.viewGrievance =
        function (grievanceId) {

            window.location.href =
                "grievance-details.html?id=" +
                grievanceId;

        };


    // ==========================================
    // FILTER EVENT LISTENERS
    // ==========================================

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const priorityFilter =
        document.getElementById(
            "priorityFilter"
        );


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );

    const departmentFilter = document.getElementById("departmentFilter");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (priorityFilter) {

        priorityFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            applyFilters
        );

    }

    if (departmentFilter) {
        departmentFilter.addEventListener("change", applyFilters);
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

                searchInput.value = "";

                statusFilter.value = "";

                priorityFilter.value = "";

                categoryFilter.value = "";
                departmentFilter.value = "";

                applyFilters();

            }
        );

    }


    const exportCsvButton = document.getElementById("exportCsvButton");
    if (exportCsvButton) {
        exportCsvButton.addEventListener("click", function () {
            if (!visibleGrievances.length) {
                showMessage("There are no grievances in the current view to export.");
                return;
            }

            const columns = [
                ["ID", "id"], ["Subject", "subject"], ["Citizen", "citizen_name"],
                ["Email", "email"], ["Department", "department"], ["Category", "category"],
                ["Priority", "priority"], ["Status", "status"],
                ["Assigned technician", "assigned_technician_name"], ["Location", "location"],
                ["Created at", "created_at"]
            ];
            const escapeCell = value => {
                let text = value == null ? "" : String(value);
                if (/^[=+@-]/.test(text)) text = `'${text}`;
                return `"${text.replace(/"/g, '""')}"`;
            };
            const csv = [columns.map(([label]) => escapeCell(label)).join(",")]
                .concat(visibleGrievances.map(row => columns.map(([, key]) => escapeCell(row[key])).join(",")))
                .join("\r\n");
            const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `citizen-connect-grievances-${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        });
    }


    // ==========================================
    // REFRESH DASHBOARD
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


                await loadDashboard();


                refreshButton.disabled =
                    false;


                refreshButton.textContent =
                    "🔄 Refresh";

            }
        );

    }


    // ==========================================
    // LOAD COMPLETE DASHBOARD
    // ==========================================

    async function loadDashboard() {

        await Promise.all([

            loadStatistics(),

            loadAnalytics(),

            loadInsights(),

            loadGrievances()

        ]);

    }


    // ==========================================
    // INITIALIZE DASHBOARD
    // ==========================================

    loadDashboard();

});
