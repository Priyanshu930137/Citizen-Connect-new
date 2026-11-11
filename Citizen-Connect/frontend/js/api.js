// ==========================================
// CITIZEN CONNECT - API CONFIGURATION
// ==========================================


// API BASE URL

const API_BASE = window.CitizenConnect.apiBase();


// ==========================================
// API REQUEST FUNCTION
// ==========================================

async function apiRequest(
    endpoint,
    options = {}
) {

    const response =
        await fetch(
            API_BASE + endpoint,
            {
                headers: {
                    "Content-Type":
                        "application/json",
                    ...(options.headers || {})
                },

                ...options
            }
        );


    let data;


    try {

        data =
            await response.json();

    } catch {

        data = null;

    }


    if (!response.ok) {

        throw new Error(

            data?.detail ||
            data?.message ||
            "Something went wrong."

        );

    }


    return data;

}
