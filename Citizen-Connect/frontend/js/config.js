// Override this only when the frontend and backend are hosted separately.
window.CITIZEN_CONNECT_API_URL = window.CITIZEN_CONNECT_API_URL || "";

window.CitizenConnect = {
    apiOrigin() {
        const configuredUrl = (window.CITIZEN_CONNECT_API_URL || "").trim();
        if (configuredUrl) return configuredUrl.replace(/\/$/, "");

        const { protocol, hostname, port, origin } = window.location;
        const localHost = ["localhost", "127.0.0.1", "::1"].includes(hostname);

        // Live Server and similar frontend dev servers run on a different port
        // from FastAPI. Point those pages at the backend instead of asking the
        // static file server for /api (which responds with HTML/empty 404s).
        if (localHost && port !== "8000") {
            const apiHost = hostname.includes(":") ? `[${hostname}]` : hostname;
            return `${protocol}//${apiHost}:8000`;
        }

        return origin.replace(/\/$/, "");
    },

    apiBase() {
        return `${this.apiOrigin()}/api`;
    }
};
