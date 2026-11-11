const API_BASE_URL = window.CitizenConnect.apiOrigin();


// ========================================
// CHECK AUTHORITY LOGIN
// ========================================

const storedUser =
    localStorage.getItem("citizenConnectUser");


if (!storedUser) {

    window.location.href = "login.html";

}

else {

    const user =
        JSON.parse(storedUser);


    if (user.role !== "authority") {

        window.location.href = "index.html";

    }


    const userNameElement =
        document.getElementById("userName");


    if (userNameElement) {

        userNameElement.textContent =
            user.name || "Authority";

    }

}


// ========================================
// LOGOUT
// ========================================

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


// ========================================
// GET GRIEVANCE ID
// ========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const grievanceId =
    urlParams.get("id");


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(
    message,
    type = "error"
) {

    const messageBox =
        document.getElementById(
            "detailsMessage"
        );


    if (!messageBox) return;


    messageBox.style.display =
        "block";


    messageBox.textContent =
        message;


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

}


// ========================================
// UPDATE STATUS BADGE
// ========================================

function updateStatusBadge(status) {

    const badge =
        document.getElementById(
            "statusBadge"
        );


    if (!badge) return;


    badge.textContent = status;


    if (status === "Pending") {

        badge.style.background =
            "#fef3c7";

        badge.style.color =
            "#92400e";

    }

    else if (status === "In Progress") {

        badge.style.background =
            "#dbeafe";

        badge.style.color =
            "#1d4ed8";

    }

    else if (status === "Resolved") {

        badge.style.background =
            "#dcfce7";

        badge.style.color =
            "#166534";

    }

    else if (status === "Rejected") {

        badge.style.background =
            "#fee2e2";

        badge.style.color =
            "#991b1b";

    }

}


// ========================================
// UPDATE PRIORITY BADGE
// ========================================

function updatePriorityBadge(priority) {

    const badge =
        document.getElementById(
            "priorityBadge"
        );


    if (!badge) return;


    badge.textContent =
        "Priority: " +
        (priority || "Medium");


    if (priority === "High") {

        badge.style.background =
            "#fee2e2";

        badge.style.color =
            "#991b1b";

    }

    else if (priority === "Medium") {

        badge.style.background =
            "#fef3c7";

        badge.style.color =
            "#92400e";

    }

    else {

        badge.style.background =
            "#dcfce7";

        badge.style.color =
            "#166534";

    }

}


// ========================================
// DISPLAY GRIEVANCE DETAILS
// ========================================

function displayGrievance(grievance) {


    // ====================================
    // BASIC INFORMATION
    // ====================================

    document.getElementById(
        "grievanceId"
    ).textContent =
        "#" + grievance.id;


    document.getElementById(
        "grievanceSubject"
    ).textContent =
        grievance.subject || "-";


    document.getElementById(
        "grievanceDescription"
    ).textContent =
        grievance.description || "-";


    // ====================================
    // CITIZEN INFORMATION
    // ====================================

    document.getElementById(
        "citizenName"
    ).textContent =
        grievance.citizen_name || "-";


    document.getElementById(
        "citizenEmail"
    ).textContent =
        grievance.email || "-";


    document.getElementById(
        "citizenPhone"
    ).textContent =
        grievance.phone || "-";


    document.getElementById(
        "grievanceLocation"
    ).textContent =
        grievance.location || "-";


    // ====================================
    // AI INTELLIGENCE
    // ====================================

    document.getElementById(
        "grievanceCategory"
    ).textContent =
        grievance.category || "General";


    document.getElementById(
        "grievanceDepartment"
    ).textContent =
        grievance.department ||
        "Public Administration";


    document.getElementById(
        "grievancePriority"
    ).textContent =
        grievance.priority || "Medium";


    document.getElementById(
        "aiAssessment"
    ).textContent =
        grievance.ai_reason ||
        "The grievance has been sent for authority review.";


    // ====================================
    // STATUS
    // ====================================

    const currentStatus =
        grievance.status || "Pending";


    updateStatusBadge(
        currentStatus
    );


    document.getElementById(
        "statusSelect"
    ).value =
        currentStatus;


    // ====================================
    // PRIORITY BADGE
    // ====================================

    updatePriorityBadge(
        grievance.priority
    );

}


// ========================================
// LOAD GRIEVANCE DETAILS
// ========================================

async function loadGrievanceDetails() {

    const loadingElement =
        document.getElementById(
            "loadingDetails"
        );


    const detailsContent =
        document.getElementById(
            "detailsContent"
        );


    if (!grievanceId) {

        loadingElement.style.display =
            "none";


        showMessage(
            "No grievance ID was provided."
        );


        return;

    }


    try {

        const response =
            await fetch(

                `${API_BASE_URL}/api/grievances/${grievanceId}`

            );


        const data =
            await response.json();


        console.log(
            "Grievance Details:",
            data
        );


        if (!response.ok) {

            throw new Error(

                data.detail ||
                "Unable to load grievance."

            );

        }


        displayGrievance(data);


        loadingElement.style.display =
            "none";


        detailsContent.style.display =
            "block";

    }


    catch (error) {

        console.error(
            "Details Loading Error:",
            error
        );


        loadingElement.style.display =
            "none";


        showMessage(

            error.message ||
            "Unable to load grievance details."

        );

    }

}


// ========================================
// UPDATE GRIEVANCE STATUS
// ========================================

const statusForm =
    document.getElementById(
        "statusForm"
    );


if (statusForm) {

    statusForm.addEventListener(

        "submit",

        async function (event) {

            event.preventDefault();


            if (!grievanceId) {

                showMessage(
                    "Invalid grievance ID."
                );

                return;

            }


            const selectedStatus =
                document.getElementById(
                    "statusSelect"
                ).value;


            const updateButton =
                document.getElementById(
                    "updateStatusButton"
                );


            const originalButtonText =
                updateButton.innerHTML;


            updateButton.disabled =
                true;


            updateButton.innerHTML =
                "⏳ Updating...";


            try {

                const response =
                    await fetch(

                        `${API_BASE_URL}/api/grievances/${grievanceId}/status`,

                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    status:
                                        selectedStatus

                                })

                        }

                    );


                const data =
                    await response.json();


                console.log(
                    "Status Update Response:",
                    data
                );


                if (!response.ok) {

                    throw new Error(

                        data.detail ||
                        "Unable to update status."

                    );

                }


                updateStatusBadge(
                    selectedStatus
                );


                showMessage(

                    "Grievance status updated successfully!",

                    "success"

                );


                setTimeout(
                    loadGrievanceDetails,
                    500
                );

            }


            catch (error) {

                console.error(
                    "Status Update Error:",
                    error
                );


                showMessage(

                    error.message ||
                    "Something went wrong while updating the status."

                );

            }


            finally {

                updateButton.disabled =
                    false;


                updateButton.innerHTML =
                    originalButtonText;

            }

        }

    );

}


// ========================================
// INITIAL LOAD
// ========================================

loadGrievanceDetails();
