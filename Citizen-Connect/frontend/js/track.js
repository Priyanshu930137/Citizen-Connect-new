const API_BASE_URL = window.CitizenConnect.apiOrigin();


// ========================================
// CHECK LOGGED-IN USER
// ========================================

const storedUser = localStorage.getItem("citizenConnectUser");

if (!storedUser) {

    window.location.href = "login.html";

} else {

    const user = JSON.parse(storedUser);

    if (user.role !== "citizen") {

        window.location.href = "login.html";

    }

    const userNameElement =
        document.getElementById("userName");

    if (userNameElement) {

        userNameElement.textContent =
            user.name || "Citizen";

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
// SHOW MESSAGE
// ========================================

function showMessage(message, type = "error") {

    const messageBox =
        document.getElementById("trackMessage");


    if (!messageBox) return;


    messageBox.style.display = "block";

    messageBox.textContent = message;


    if (type === "success") {

        messageBox.style.background =
            "#dcfce7";

        messageBox.style.color =
            "#166534";

        messageBox.style.border =
            "1px solid #86efac";

    } else {

        messageBox.style.background =
            "#fee2e2";

        messageBox.style.color =
            "#991b1b";

        messageBox.style.border =
            "1px solid #fca5a5";

    }

}


// ========================================
// GET STATUS INFORMATION
// ========================================

function getStatusText(status) {

    switch (status) {

        case "Pending":

            return "Your grievance has been submitted successfully and is waiting for authority review.";

        case "In Progress":

            return "The responsible authority is currently working on your grievance.";

        case "Resolved":

            return "Your grievance has been marked as resolved.";

        case "Rejected":

            return "Your grievance has been reviewed but was rejected by the authority.";

        default:

            return "Your grievance is currently being processed.";

    }

}


// ========================================
// SET STATUS BADGE STYLE
// ========================================

function updateStatusBadge(status) {

    const statusBadge =
        document.getElementById("statusBadge");


    if (!statusBadge) return;


    statusBadge.textContent = status;


    // Remove old badge classes

    statusBadge.className = "badge";


    if (status === "Pending") {

        statusBadge.classList.add(
            "badge-progress"
        );

    }

    else if (status === "In Progress") {

        statusBadge.style.background =
            "#dbeafe";

        statusBadge.style.color =
            "#1d4ed8";

    }

    else if (status === "Resolved") {

        statusBadge.style.background =
            "#dcfce7";

        statusBadge.style.color =
            "#166534";

    }

    else if (status === "Rejected") {

        statusBadge.style.background =
            "#fee2e2";

        statusBadge.style.color =
            "#991b1b";

    }

}


// ========================================
// DISPLAY GRIEVANCE
// ========================================

function displayGrievance(grievance) {

    // Show result section

    const resultSection =
        document.getElementById(
            "resultSection"
        );


    resultSection.style.display =
        "block";


    // Grievance ID

    document.getElementById(
        "resultId"
    ).textContent =
        "#" + grievance.id;


    // Subject

    document.getElementById(
        "resultSubject"
    ).textContent =
        grievance.subject || "-";


    // Description

    document.getElementById(
        "resultDescription"
    ).textContent =
        grievance.description || "-";


    // Location

    document.getElementById(
        "resultLocation"
    ).textContent =
        grievance.location || "-";


    // Category

    document.getElementById(
        "resultCategory"
    ).textContent =
        grievance.category || "Not Available";


    // Department

    document.getElementById(
        "resultDepartment"
    ).textContent =
        grievance.department || "Not Available";


    // Priority

    document.getElementById(
        "resultPriority"
    ).textContent =
        grievance.priority || "Normal";


    // AI Assessment

    document.getElementById(
        "resultAiAssessment"
    ).textContent =
        grievance.ai_reason ||
        "AI assessment is not available.";


    // Status

    const status =
        grievance.status || "Pending";


    updateStatusBadge(status);


    document.getElementById(
        "statusInformation"
    ).textContent =
        getStatusText(status);


    // Scroll to result

    resultSection.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ========================================
// TRACK FORM
// ========================================

const trackForm =
    document.getElementById("trackForm");


if (trackForm) {

    trackForm.addEventListener(

        "submit",

        async function (event) {

            event.preventDefault();


            const grievanceId =
                document
                    .getElementById(
                        "grievanceId"
                    )
                    .value
                    .trim();


            // Validation

            if (!grievanceId) {

                showMessage(
                    "Please enter a grievance ID."
                );

                return;

            }


            // Button

            const trackButton =
                document.getElementById(
                    "trackButton"
                );


            const originalButtonText =
                trackButton.innerHTML;


            trackButton.disabled = true;


            trackButton.innerHTML =
                "⏳ Searching...";


            // Hide old results

            document.getElementById(
                "resultSection"
            ).style.display = "none";


            document.getElementById(
                "trackMessage"
            ).style.display = "none";


            try {

                // ========================================
                // API REQUEST
                // ========================================

                const response =
                    await fetch(

                        `${API_BASE_URL}/api/grievances/${grievanceId}`

                    );


                const data =
                    await response.json();


                console.log(
                    "Grievance data:",
                    data
                );


                // ========================================
                // ERROR HANDLING
                // ========================================

                if (!response.ok) {

                    throw new Error(

                        data.detail ||
                        "Unable to find grievance."

                    );

                }


                // ========================================
                // DISPLAY RESULT
                // ========================================

                displayGrievance(data);


            }


            catch (error) {

                console.error(
                    "Tracking Error:",
                    error
                );


                showMessage(

                    error.message ||
                    "Something went wrong. Please try again."

                );

            }


            finally {

                trackButton.disabled = false;


                trackButton.innerHTML =
                    originalButtonText;

            }

        }

    );

}
