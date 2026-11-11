// ==========================================
// CITIZEN CONNECT - MANAGEMENT DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const API_BASE = window.CitizenConnect.apiBase();

    let currentUser = null;

    let department = null;

    let grievances = [];

    let technicians = [];

    let selectedGrievanceId = null;


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
    // AUTHORIZATION
    // ==========================================

    currentUser =
        getCurrentUser();


    if (!currentUser) {

        return;

    }


    if (currentUser.role !== "management") {

        alert(
            "You are not authorized to access the Management Dashboard."
        );

        window.location.href =
            "login.html";

        return;

    }


    // ==========================================
    // DEPARTMENT CHECK
    // ==========================================

    department =
        currentUser.department;


    if (!department) {

        alert(
            "No department is assigned to your management account."
        );

        return;

    }


    // ==========================================
    // DISPLAY USER INFORMATION
    // ==========================================

    const userName =
        document.getElementById(
            "userName"
        );


    if (userName) {

        userName.textContent =
            "👋 " + currentUser.name;

    }


    const departmentTitle =
        document.getElementById(
            "departmentTitle"
        );


    if (departmentTitle) {

        departmentTitle.textContent =
            "Managing grievances for " +
            department;

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
                "managementMessage"
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
    // LOAD TECHNICIANS
    // ==========================================

    async function loadTechnicians() {

        try {

            technicians =
                await apiRequest(

                    API_BASE +
                    "/departments/" +
                    encodeURIComponent(
                        department
                    ) +
                    "/technicians"

                );


            renderTechnicians();

        }

        catch (error) {

            console.error(
                "Technician error:",
                error
            );

        }

    }


    // ==========================================
    // RENDER TECHNICIANS
    // ==========================================

    function renderTechnicians() {

        const container =
            document.getElementById(
                "techniciansContainer"
            );


        if (!container) {

            return;

        }


        if (technicians.length === 0) {

            container.innerHTML = `

                <p style="color: var(--text-secondary);">

                    No technicians are registered for this department.

                </p>

            `;

            return;

        }


        let html = "";


        technicians.forEach(
            function (technician) {

                html += `

                    <div
                        class="card"
                        style="
                            padding: 20px;
                            background: #f8fafc;
                        "
                    >

                        <h3>

                            👨‍🔧 ${technician.name}

                        </h3>


                        <p
                            style="
                                margin-top: 8px;
                                color: var(--text-secondary);
                            "
                        >

                            ${technician.email}

                        </p>


                        <p
                            style="
                                margin-top: 8px;
                                color: var(--text-secondary);
                            "
                        >

                            ${technician.department}

                        </p>

                    </div>

                `;

            }
        );


        container.innerHTML =
            html;

    }


    // ==========================================
    // LOAD GRIEVANCES
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

            grievances =
                await apiRequest(

                    API_BASE +
                    "/departments/" +
                    encodeURIComponent(
                        department
                    ) +
                    "/grievances"

                );


            renderStatistics();

            renderGrievances();

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
    // STATISTICS
    // ==========================================

    function renderStatistics() {

        const total =
            grievances.length;


        const pending =
            grievances.filter(
                grievance =>
                    grievance.status === "Pending"
            ).length;


        const assigned =
            grievances.filter(
                grievance =>
                    grievance.status === "Assigned"
            ).length;


        const resolved =
            grievances.filter(
                grievance =>
                    grievance.status === "Resolved"
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
            "assignedCount"
        ).textContent =
            assigned;


        document.getElementById(
            "resolvedCount"
        ).textContent =
            resolved;

    }


    // ==========================================
    // STATUS BADGE
    // ==========================================

    function getStatusBadge(status) {

        let className =
            "badge-progress";


        if (status === "Pending") {

            className =
                "badge-warning";

        }

        else if (status === "Resolved") {

            className =
                "badge-success";

        }

        else if (status === "Rejected") {

            className =
                "badge-danger";

        }


        return `

            <span class="badge ${className}">

                ${status}

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

                ${priority}

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
    // RENDER GRIEVANCES
    // ==========================================

    function renderGrievances() {

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

                        No grievances found for this department.

                    </td>

                </tr>

            `;

            return;

        }


        let html = "";


        grievances.forEach(
            function (grievance) {

                const technician =
                    grievance.assigned_technician_name ||
                    "Not Assigned";


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

                            ${escapeHtml(
                                technician
                            )}

                        </td>


                        <td style="padding: 16px;">

                            <button
                                class="btn btn-primary"
                                onclick="
                                    openAssignModal(
                                        ${grievance.id}
                                    )
                                "
                            >

                                👨‍🔧 Assign

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
    // OPEN ASSIGN MODAL
    // ==========================================

    window.openAssignModal =
        function (grievanceId) {

            selectedGrievanceId =
                grievanceId;


            const grievance =
                grievances.find(
                    item =>
                        item.id === grievanceId
                );


            const modal =
                document.getElementById(
                    "assignModal"
                );


            const info =
                document.getElementById(
                    "assignGrievanceInfo"
                );


            const select =
                document.getElementById(
                    "technicianSelect"
                );


            if (grievance && info) {

                info.textContent =
                    "Assign grievance #" +
                    grievance.id +
                    " — " +
                    grievance.subject;

            }


            select.innerHTML = `

                <option value="">

                    Select a technician

                </option>

            `;


            technicians.forEach(
                function (technician) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        technician.id;


                    option.textContent =
                        technician.name +
                        " (" +
                        technician.email +
                        ")";


                    select.appendChild(
                        option
                    );

                }
            );


            modal.style.display =
                "block";

        };


    // ==========================================
    // CLOSE MODAL
    // ==========================================

    function closeAssignModal() {

        const modal =
            document.getElementById(
                "assignModal"
            );


        modal.style.display =
            "none";


        selectedGrievanceId =
            null;

    }


    document.getElementById(
        "closeModalButton"
    ).addEventListener(
        "click",
        closeAssignModal
    );


    document.getElementById(
        "cancelAssignButton"
    ).addEventListener(
        "click",
        closeAssignModal
    );


    // ==========================================
    // CONFIRM ASSIGNMENT
    // ==========================================

    document.getElementById(
        "confirmAssignButton"
    ).addEventListener(

        "click",

        async function () {

            const select =
                document.getElementById(
                    "technicianSelect"
                );


            const technicianId =
                parseInt(
                    select.value
                );


            if (!technicianId) {

                showMessage(
                    "Please select a technician."
                );

                return;

            }


            const button =
                document.getElementById(
                    "confirmAssignButton"
                );


            const originalText =
                button.innerHTML;


            button.disabled =
                true;


            button.innerHTML =
                "Assigning...";


            try {

                await apiRequest(

                    API_BASE +
                    "/grievances/" +
                    selectedGrievanceId +
                    "/assign",

                    "PUT",

                    {

                        technician_id:
                            technicianId

                    }

                );


                showMessage(

                    "Grievance assigned successfully.",

                    "success"

                );


                closeAssignModal();


                await loadGrievances();

            }

            catch (error) {

                showMessage(
                    error.message
                );

            }

            finally {

                button.disabled =
                    false;


                button.innerHTML =
                    originalText;

            }

        }

    );


    // ==========================================
    // REFRESH
    // ==========================================

    document.getElementById(
        "refreshButton"
    ).addEventListener(

        "click",

        async function () {

            await Promise.all([

                loadTechnicians(),

                loadGrievances()

            ]);

        }

    );


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    async function initializeDashboard() {

        await Promise.all([

            loadTechnicians(),

            loadGrievances()

        ]);

    }


    initializeDashboard();

});
