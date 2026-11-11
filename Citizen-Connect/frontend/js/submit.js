const API_BASE_URL = window.CitizenConnect.apiOrigin();
const imageInput = document.getElementById("image");

// Auto Detect Current Location
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );

            const data = await response.json();

            document.getElementById("location").value =
                data.display_name;
        });
    }
});

// ========================================
// GET LOGGED-IN USER
// ========================================

const storedUser = localStorage.getItem("citizenConnectUser");

let currentUser = null;

if (!storedUser) {

    window.location.href = "login.html";

} else {

    try {

        currentUser = JSON.parse(storedUser);

        console.log(
            "Logged-in user:",
            currentUser
        );


        // Only citizens can access this page

        if (currentUser.role !== "citizen") {

            alert(
                "Only citizens can access the grievance submission page."
            );

            window.location.href = "login.html";

        }


        // Display user name

        const userNameElement =
            document.getElementById("userName");

        if (userNameElement) {

            userNameElement.textContent =
                currentUser.name || "Citizen";

        }

    }

    catch (error) {

        console.error(
            "Error reading user session:",
            error
        );

        localStorage.removeItem(
            "citizenConnectUser"
        );

        window.location.href = "login.html";

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

function showMessage(
    message,
    type = "success"
) {

    const messageBox =
        document.getElementById(
            "submitMessage"
        );


    if (!messageBox) {

        console.warn(
            "submitMessage element not found"
        );

        return;

    }


    messageBox.style.display = "block";


    // Preserve line breaks

    messageBox.style.whiteSpace = "pre-line";


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

}


// ========================================
// GET DETAILED ERROR MESSAGE
// ========================================

function getErrorMessage(errorData) {

    console.log(
        "FULL SERVER ERROR:",
        errorData
    );


    if (!errorData) {

        return (
            "Something went wrong. " +
            "Please try again."
        );

    }


    // ====================================
    // FASTAPI VALIDATION ERRORS
    // ====================================

    if (Array.isArray(errorData.detail)) {

        console.log(
            "FULL VALIDATION ERRORS:",
            errorData.detail
        );


        return errorData.detail
            .map(error => {

                const field =
                    error.loc
                        ? error.loc.join(" → ")
                        : "Unknown field";


                const message =
                    error.msg ||
                    "Invalid input";


                return `${field}: ${message}`;

            })
            .join("\n");

    }


    // ====================================
    // NORMAL FASTAPI ERROR
    // ====================================

    if (
        typeof errorData.detail ===
        "string"
    ) {

        return errorData.detail;

    }


    if (
        typeof errorData.message ===
        "string"
    ) {

        return errorData.message;

    }


    return (
        "Something went wrong. " +
        "Please try again."
    );

}


// ========================================
// FORM SUBMISSION
// ========================================

const grievanceForm =
    document.getElementById(
        "grievanceForm"
    );


if (grievanceForm) {

    grievanceForm.addEventListener(

        "submit",

        async function (event) {

            event.preventDefault();


            console.log(
                "===================================="
            );

            console.log(
                "GRIEVANCE SUBMISSION STARTED"
            );

            console.log(
                "===================================="
            );


            // ====================================
            // GET USER SESSION AGAIN
            // ====================================

            const storedUser =
                localStorage.getItem(
                    "citizenConnectUser"
                );


            if (!storedUser) {

                showMessage(

                    "Your session has expired. Please login again.",

                    "error"

                );

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1500);


                return;

            }


            let user;


            try {

                user =
                    JSON.parse(
                        storedUser
                    );

            }

            catch (error) {

                console.error(
                    "Invalid user session:",
                    error
                );


                showMessage(

                    "Invalid login session. Please login again.",

                    "error"

                );


                return;

            }


            // ====================================
            // DEBUG USER DATA
            // ====================================

            console.log(
                "USER FROM LOCAL STORAGE:",
                user
            );


            console.log(
                "USER ID:",
                user.id
            );


            console.log(
                "USER NAME:",
                user.name
            );


            console.log(
                "USER EMAIL:",
                user.email
            );


            console.log(
                "USER ROLE:",
                user.role
            );


            // ====================================
            // VALIDATE USER DATA
            // ====================================

            if (!user.id) {

                showMessage(

                    "ERROR: Citizen ID is missing from your login session. Please logout and login again.",

                    "error"

                );


                console.error(
                    "CRITICAL ERROR: user.id is missing"
                );


                return;

            }


            if (!user.email) {

                showMessage(

                    "ERROR: Citizen email is missing from your login session. Please logout and login again.",

                    "error"

                );


                console.error(
                    "CRITICAL ERROR: user.email is missing"
                );


                return;

            }


            // ====================================
            // GET FORM VALUES
            // ====================================

            const subject =
                document
                    .getElementById("subject")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const location =
                document
                    .getElementById("location")
                    .value
                    .trim();


            const description =
                document
                    .getElementById("description")
                    .value
                    .trim();


            // ====================================
            // FORM VALIDATION
            // ====================================

            if (!subject) {

                showMessage(

                    "Please enter a grievance subject.",

                    "error"

                );


                return;

            }


            if (!location) {

                showMessage(

                    "Please enter the location.",

                    "error"

                );


                return;

            }


            if (!description) {

                showMessage(

                    "Please describe your grievance.",

                    "error"

                );


                return;

            }


            // ====================================
            // CREATE DATA
            //
            // MUST EXACTLY MATCH:
            // schemas.GrievanceCreate
            // ====================================

            const grievanceData = {

                citizen_id: Number(user.id),

                citizen_name:
                    user.name || "Unknown Citizen",

                citizen_email:
                    user.email,

                citizen_phone:
                    phone || null,

                subject:
                    subject,

                description:
                    description,

                location:
                    location

            };


            // ====================================
            // DEBUG REQUEST DATA
            // ====================================

            console.log(
                "SENDING GRIEVANCE DATA:"
            );

            console.log(
                grievanceData
            );


            console.log(
                "JSON DATA:"
            );

            console.log(
                JSON.stringify(
                    grievanceData
                )
            );


            // ====================================
            // SUBMIT BUTTON
            // ====================================

            const submitButton =
                document.getElementById(
                    "submitButton"
                );


            let originalButtonText =
                "Submit Grievance";


            if (submitButton) {

                originalButtonText =
                    submitButton.innerHTML;


                submitButton.disabled =
                    true;


                submitButton.innerHTML =
                    "⏳ Submitting...";

            }


            // ====================================
            // HIDE OLD MESSAGE
            // ====================================

            const messageBox =
                document.getElementById(
                    "submitMessage"
                );


            if (messageBox) {

                messageBox.style.display =
                    "none";

            }


            try {

                // ====================================
                // SEND REQUEST
                // ====================================

                console.log(
                    "Sending POST request to:"
                );

                console.log(
                    `${API_BASE_URL}/api/grievances`
                );


                // Image + Complaint data

                const formData = new FormData();

                Object.keys(grievanceData).forEach((key) => {
                    formData.append(key, grievanceData[key]);
                });

                const image = document.getElementById("image").files[0];
                if (image) {
                    formData.append("image", image);
                }

                // Send to backend
                const response = await fetch(`${API_BASE_URL}/api/grievances`, {
                    method: "POST",
                    body: formData,
                });


                console.log(
                    "RESPONSE STATUS:",
                    response.status
                );


                // ====================================
                // READ RESPONSE
                // ====================================

                const responseData =
                    await response.json();


                console.log(
                    "SERVER RESPONSE:"
                );


                console.log(
                    responseData
                );


                // ====================================
                // HANDLE ERROR
                // ====================================

                if (!response.ok) {

                    throw new Error(

                        getErrorMessage(
                            responseData
                        )

                    );

                }


                // ====================================
                // SUCCESS
                // ====================================

                console.log(
                    "GRIEVANCE SUBMITTED SUCCESSFULLY!"
                );


                const grievanceId =

                    responseData.grievance_id ||

                    responseData.id ||

                    responseData.grievance?.id ||

                    "Generated Successfully";


                let successText =

                    `Grievance submitted successfully! 🎉

Grievance ID: ${grievanceId}`;


                // AI Assessment is inside
                // responseData.assessment

                if (
                    responseData.assessment
                ) {

                    const assessment =
                        responseData.assessment;


                    successText +=

                        `

Category: ${assessment.category}

Department: ${assessment.department}

Priority: ${assessment.priority}`;

                }


                // ====================================
                // SHOW SUCCESS
                // ====================================

                showMessage(

                    successText,

                    "success"

                );


                // ====================================
                // RESET FORM
                // ====================================

                grievanceForm.reset();


                // ====================================
                // SCROLL TO MESSAGE
                // ====================================

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }


            // ========================================
            // ERROR
            // ========================================

            catch (error) {

                console.error(
                    "===================================="
                );

                console.error(
                    "GRIEVANCE SUBMISSION ERROR:"
                );

                console.error(
                    error
                );

                console.error(
                    "===================================="
                );


                showMessage(

                    error.message ||

                    "Unable to submit grievance. Please try again.",

                    "error"

                );

            }


            // ========================================
            // RESTORE BUTTON
            // ========================================

            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;


                    submitButton.innerHTML =
                        originalButtonText;

                }

            }

        }

    );

}
