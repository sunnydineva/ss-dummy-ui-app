import keycloak from "../auth/keycloak.ts";

async function ensureFreshToken(minValiditySeconds = 30) {
    if (!keycloak.authenticated) return;
    try {
        await keycloak.updateToken(minValiditySeconds);
    } catch {
        // ако refresh fail-не, force login пак
        keycloak.login();
    }
}

export async function apiGet(path: string): Promise<{ status: number; body: string }> {
    await ensureFreshToken();

    const baseUrl = import.meta.env.VITE_USER_SERVICE_BASE_URL;
    const url = `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json, text/plain, */*",
            ...(keycloak.token ? { Authorization: `Bearer ${keycloak.token}` } : {}),
        },
    });

    const body = await res.text();
    return { status: res.status, body };
}