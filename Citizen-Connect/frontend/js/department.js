// ==========================================
// CITIZEN CONNECT
// DEPARTMENT MANAGEMENT DASHBOARD
// ==========================================


document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ======================================
        // API BASE
        // ======================================

        const API_BASE = window.CitizenConnect.apiBase();


        // ======================================
        // GET LOGGED-IN USER
        // ======================================

        const storedUser =
            localStorage.getItem(
                "citizenConnectUser"
            );


        if (!storedUser) {

            window.location.href =
                "login.html";

            return;

        }


        let user;


        try {

            user =
                JSON.parse(storedUser);

        } catch (error) {

            localStorage.removeItem(
                "citizenConnectUser"
            );


            window.location.href =
                "login.html";

            return;

        }


        // ======================================
        // ROLE SECURITY
        // ======================================

        if (
            user.role !== "management"
        ) {

            alert(
                "You are not authorized to access the Department Management Portal."
            );


            window.location.href =
                "index.html";

            return;

        }


        // ======================================
        // USER DATA
        // ======================================

        const userName =
            document.getElementById(
                "userName"
            );


        const userDepartment =
            document.getElementById(
                "userDepartment"
            );


        if (userName) {

            userName.textContent =
                user.name || "Department Manager";

        }


        if (userDepartment) {

            userDepartment.textContent =
                user.department ||
                "No Department";

        }


        // ======================================
        // CHECK DEPARTMENT
        // ======================================

        const department =
            user.department;


        if (!department) {

            showMessage(

                "No department is assigned to this management account.",

                "error"

            );

            return;

        }


        // ======================================
        // GLOBAL DATA
        // ======================================

        let grievances = [];

        let technicians = [];

        let selectedGrievanceId = null;


        // ======================================
        // MESSAGE FUNCTION
        // ======================================

        function showMessage(
            message,
            type = "error"
        ) {

            const messageBox =
                document.getElementById(
                    "departmentMessage"
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
        // LOAD TECHNICIANS
        // ======================================

        async function loadTechnicians() {

            const container =
                document.getElementById(
                    "techniciansContainer"
                );


            if (container) {

                container.innerHTML = `

                    <p style="color: var(--text-secondary);">
                        ⏳ Loading technicians...
                    </p>

                `;

            }


            try {

                const response =
                    await fetch(

                        API_BASE +
                        "/departments/" +
                        encodeURIComponent(
                            department
                        ) +
                        "/technicians"

                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(

                        data.detail ||
                        "Failed to load technicians."

                    );

                }


                technicians = data;


                renderTechnicians();

                updateTechnicianSelect();


            } catch (error) {

                if (container) {

                    container.innerHTML = `

                        <p style="color: #dc2626;">
                            ❌ ${error.message}
                        </p>

                    `;

                }

            }

        }


        // ======================================
        // RENDER TECHNICIANS
        // ======================================

        function renderTechnicians() {

            const container =
                document.getElementById(
                    "techniciansContainer"
                );


            if (!container) {

                return;

            }


            if (
                technicians.length === 0
            ) {

                container.innerHTML = `

                    <div
                        class="card"
                        style="
                            padding: 25px;
                            grid-column: 1 / -1;
                        "
                    >

                        <h3>
                            No Technicians Found
                        </h3>

                        <p
                            style="
                                color: var(--text-secondary);
                                margin-top: 8px;
                            "
                        >
                            No technician is currently registered
                            in this department.
                        </p>

                    </div>

                `;

                return;

            }


            container.innerHTML =
                technicians.map(
                    function (technician) {

                        return `

                            <div
                                class="card"
                                style="padding: 22px;"
                            >

                                <div
                                    style="
                                        font-size: 2rem;
                                        margin-bottom: 12px;
                                    "
                                >
                                    👷
                                </div>


                                <h3
                                    style="
                                        font-family: 'Poppins', sans-serif;
                                    "
                                >
                                    ${technician.name}
                                </h3>


                                <p
                                    style="
                                        color: var(--text-secondary);
                                        margin-top: 8px;
                                        word-break: break-word;
                                    "
                                >
                                    ${technician.email}
                                </p>


                                <p
                                    style="
                                        margin-top: 12px;
                                        font-size: 0.9rem;
                                    "
                                >
                                    🏢 ${technician.department}
                                </p>

                            </div>

                        `;

                    }
                ).join("");

        }


        // ======================================
        // UPDATE TECHNICIAN SELECT
        // ======================================

        function updateTechnicianSelect() {

            const select =
                document.getElementById(
                    "technicianSelect"
                );


            if (!select) {

                return;

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

        }


        // ======================================
        // LOAD GRIEVANCES
        // ======================================

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

                const response =
                    await fetch(

                        API_BASE +
                        "/departments/" +
                        encodeURIComponent(
                            department
                        ) +
                        "/grievances"

                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(

                        data.detail ||
                        "Failed to load grievances."

                    );

                }


                grievances = data;


                updateStatistics();

                renderGrievances(
                    grievances
                );


            } catch (error) {

                showMessage(
                    error.message
                );


                const tableBody =
                    document.getElementById(
                        "grievanceTableBody"
                    );


                if (tableBody) {

                    tableBody.innerHTML = `

                        <tr>

                            <td
                                colspan="7"
                                style="
                                    padding: 30px;
                                    text-align: center;
                                    color: #dc2626;
                                "
                            >

                                ❌ ${error.message}

                            </td>

                        </tr>

                    `;

                }

            } finally {

                if (loading) {

                    loading.style.display =
                        "none";

                }

            }

        }


        // ======================================
        // UPDATE STATISTICS
        // ======================================

        function updateStatistics() {

            const total =
                grievances.length;


            const pending =
                grievances.filter(
                    grievance =>
                        grievance.status === "Pending"
                ).length;


            const inProgress =
                grievances.filter(
                    grievance =>
                        grievance.status === "In Progress"
                ).length;


            const resolved =
                grievances.filter(
                    grievance =>
                        grievance.status === "Resolved"
                ).length;


            document.getElementById(
                "totalCount"
            ).textContent = total;


            document.getElementById(
                "pendingCount"
            ).textContent = pending;


            document.getElementById(
                "progressCount"
            ).textContent = inProgress;


            document.getElementById(
                "resolvedCount"
            ).textContent = resolved;

        }


        // ======================================
        // RENDER GRIEVANCES
        // ======================================

        function renderGrievances(
            grievanceList
        ) {

            const tableBody =
                document.getElementById(
                    "grievanceTableBody"
                );


            const tableContainer =
                document.getElementById(
                    "tableContainer"
                );


            if (!tableBody) {

                return;

            }


            if (
                grievanceList.length === 0
            ) {

                tableBody.innerHTML = `

                    <tr>

                        <td
                            colspan="7"
                            style="
                                padding: 35px;
                                text-align: center;
                                color: var(--text-secondary);
                            "
                        >

                            📭 No grievances found
                            for this department.

                        </td>

                    </tr>

                `;


                if (tableContainer) {

                    tableContainer.style.display =
                        "block";

                }

                return;

            }


            tableBody.innerHTML =
                grievanceList.map(
                    function (grievance) {

                        const technicianName =
                            grievance.assigned_technician_name ||
                            "Not Assigned";


                        return `

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
                                        ${escapeHTML(
                                            grievance.subject
                                        )}
                                    </strong>

                                </td>


                                <td style="padding: 16px;">

                                    ${escapeHTML(
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

                                    ${escapeHTML(
                                        technicianName
                                    )}

                                </td>


                                <td style="padding: 16px;">

                                    <button

                                        class="btn btn-primary assign-button"

                                        data-id="${grievance.id}"

                                        style="
                                            padding: 9px 14px;
                                            font-size: 0.85rem;
                                        "

                                    >

                                        👷 Assign

                                    </button>

                                </td>

                            </tr>

                        `;

                    }
                ).join("");


            if (tableContainer) {

                tableContainer.style.display =
                    "block";

            }


            addAssignButtonListeners();

        }


        // ======================================
        // STATUS BADGE
        // ======================================

        function getStatusBadge(status) {

            let background = "#e5e7eb";
            let color = "#374151";


            if (status === "Pending") {

                background = "#fef3c7";
                color = "#92400e";

            }

            else if (status === "Assigned") {

                background = "#dbeafe";
                color = "#1d4ed8";

            }

            else if (status === "In Progress") {

                background = "#e0f2fe";
                color = "#0369a1";

            }

            else if (status === "Resolved") {

                background = "#dcfce7";
                color = "#166534";

            }

            else if (status === "Rejected") {

                background = "#fee2e2";
                color = "#991b1b";

            }


            return `

                <span
                    style="
                        background: ${background};
                        color: ${color};
                        padding: 6px 10px;
                        border-radius: 20px;
                        font-size: 0.82rem;
                        font-weight: 600;
                    "
                >

                    ${status}

                </span>

            `;

        }


        // ======================================
        // PRIORITY BADGE
        // ======================================

        function getPriorityBadge(priority) {

            let background = "#e5e7eb";
            let color = "#374151";


            if (priority === "High") {

                background = "#fee2e2";
                color = "#dc2626";

            }

            else if (priority === "Medium") {

                background = "#fef3c7";
                color = "#92400e";

            }

            else if (priority === "Low") {

                background = "#dcfce7";
                color = "#166534";

            }


            return `

                <span
                    style="
                        background: ${background};
                        color: ${color};
                        padding: 6px 10px;
                        border-radius: 20px;
                        font-size: 0.82rem;
                        font-weight: 600;
                    "
                >

                    ${priority}

                </span>

            `;

        }


        // ======================================
        // ESCAPE HTML
        // ======================================

        function escapeHTML(value) {

            if (!value) {

                return "";

            }


            const div =
                document.createElement(
                    "div"
                );


            div.textContent = value;


            return div.innerHTML;

        }


        // ======================================
        // ASSIGN BUTTON LISTENERS
        // ======================================

        function addAssignButtonListeners() {

            const buttons =
                document.querySelectorAll(
                    ".assign-button"
                );


            buttons.forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            selectedGrievanceId =
                                button.getAttribute(
                                    "data-id"
                                );


                            openAssignmentModal();

                        }
                    );

                }
            );

        }


        // ======================================
        // OPEN MODAL
        // ======================================

        function openAssignmentModal() {

            const modal =
                document.getElementById(
                    "assignmentModal"
                );


            const info =
                document.getElementById(
                    "assignmentGrievanceInfo"
                );


            if (info) {

                info.textContent =
                    "Assigning technician to Grievance #" +
                    selectedGrievanceId;

            }


            if (modal) {

                modal.style.display =
                    "flex";

            }

        }


        // ======================================
        // CLOSE MODAL
        // ======================================

        function closeAssignmentModal() {

            const modal =
                document.getElementById(
                    "assignmentModal"
                );


            if (modal) {

                modal.style.display =
                    "none";

            }


            selectedGrievanceId = null;


            document.getElementById(
                "technicianSelect"
            ).value = "";

        }


        // ======================================
        // CONFIRM ASSIGNMENT
        // ======================================

        async function assignTechnician() {

            const technicianSelect =
                document.getElementById(
                    "technicianSelect"
                );


            const technicianId =
                technicianSelect.value;


            if (!technicianId) {

                showMessage(
                    "Please select a technician."
                );

                return;

            }


            if (!selectedGrievanceId) {

                showMessage(
                    "No grievance selected."
                );

                return;

            }


            const confirmButton =
                document.getElementById(
                    "confirmAssignmentButton"
                );


            const originalText =
                confirmButton.textContent;


            confirmButton.disabled = true;

            confirmButton.textContent =
                "Assigning...";


            try {

                const response =
                    await fetch(

                        API_BASE +
                        "/grievances/" +
                        selectedGrievanceId +
                        "/assign",

                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    technician_id:
                                        Number(
                                            technicianId
                                        )

                                })

                        }

                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(

                        data.detail ||
                        "Assignment failed."

                    );

                }


                closeAssignmentModal();


                showMessage(

                    "Technician assigned successfully!",

                    "success"

                );


                await loadGrievances();


            } catch (error) {

                showMessage(
                    error.message
                );

            } finally {

                confirmButton.disabled = false;

                confirmButton.textContent =
                    originalText;

            }

        }


        // ======================================
        // SEARCH
        // ======================================

        const searchInput =
            document.getElementById(
                "searchInput"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                function () {

                    const query =
                        searchInput.value
                            .toLowerCase()
                            .trim();


                    const filtered =
                        grievances.filter(
                            function (grievance) {

                                return (

                                    String(
                                        grievance.id
                                    ).includes(query)

                                    ||

                                    grievance.subject
                                        .toLowerCase()
                                        .includes(query)

                                    ||

                                    grievance.citizen_name
                                        .toLowerCase()
                                        .includes(query)

                                );

                            }
                        );


                    renderGrievances(
                        filtered
                    );

                }
            );

        }


        // ======================================
        // REFRESH GRIEVANCES
        // ======================================

        const refreshButton =
            document.getElementById(
                "refreshButton"
            );


        if (refreshButton) {

            refreshButton.addEventListener(
                "click",
                loadGrievances
            );

        }


        // ======================================
        // REFRESH TECHNICIANS
        // ======================================

        const refreshTechniciansButton =
            document.getElementById(
                "refreshTechniciansButton"
            );


        if (refreshTechniciansButton) {

            refreshTechniciansButton.addEventListener(
                "click",
                loadTechnicians
            );

        }


        // ======================================
        // MODAL BUTTONS
        // ======================================

        document.getElementById(
            "closeModalButton"
        ).addEventListener(
            "click",
            closeAssignmentModal
        );


        document.getElementById(
            "cancelAssignmentButton"
        ).addEventListener(
            "click",
            closeAssignmentModal
        );


        document.getElementById(
            "confirmAssignmentButton"
        ).addEventListener(
            "click",
            assignTechnician
        );


        // ======================================
        // INITIAL LOAD
        // ======================================

        loadTechnicians();

        loadGrievances();


    }
);
