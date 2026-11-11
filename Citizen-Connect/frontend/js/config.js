// Set this to your deployed Render backend URL before deploying the frontend.
// Keep it empty when serving the frontend and API from the same origin locally.
window.CITIZEN_CONNECT_API_URL = "https://citizen-grievance-ai-zr7z.onrender.com";

window.CitizenConnect = {
    apiOrigin() {
        const configuredUrl = window.CITIZEN_CONNECT_API_URL.trim();

        return (configuredUrl || window.location.origin).replace(/\/$/, "");
    },

    apiBase() {
        return `${this.apiOrigin()}/api`;
    }
};
