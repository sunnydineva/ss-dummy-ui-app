import { useEffect, useMemo, useRef, useState } from "react";
import keycloak from "../auth/keycloak";
import { apiGet } from "../api/client";
import { useAuth } from "../auth/AuthProvider";

type CallResult = {
    endpoint: string;
    status?: number;
    body?: string;
    error?: string;
    at?: string;
};

export default function VariantA() {
    const { ready, authenticated, initError } = useAuth();
    const loginTriggeredRef = useRef(false);

    const [result, setResult] = useState<CallResult | null>(null);
    const [busy, setBusy] = useState(false);

    const pageTitle = useMemo(
        () => "variant B - API only (no auto redirect) → user clicks Login",
        []
    );

    // ✅ само един login effect + guard
    useEffect(() => {
        if (!ready) return;
        if (authenticated) return;

        if (!loginTriggeredRef.current) {
            loginTriggeredRef.current = true;
            keycloak.login({ redirectUri: window.location.origin + "/variant-a" });
        }
    }, [ready, authenticated]);

    async function call(endpoint: string) {
        setBusy(true);
        setResult(null);
        try {
            const r = await apiGet(endpoint);
            setResult({ endpoint, status: r.status, body: r.body, at: new Date().toISOString() });
        } catch (e: any) {
            setResult({ endpoint, error: e?.message ?? String(e), at: new Date().toISOString() });
        } finally {
            setBusy(false);
        }
    }

    function logout() {
        keycloak.logout({ redirectUri: window.location.origin + "/variant-a" });
    }

    function login() {
        keycloak.login({ redirectUri: window.location.origin + "/variant-a" });
    }

    function prettyBody(body?: string) {
        if (!body) return "";

        // намери JSON-а в текста (пример: след празен ред)
        const start = body.indexOf("{");
        if (start === -1) return body;

        const jsonPart = body.slice(start);

        try {
            return JSON.stringify(JSON.parse(jsonPart), null, 2);
        } catch {
            return body; // ако не е валиден JSON, показвай сурово
        }
    }

    const tokenPreview =
        keycloak?.token ? `${keycloak.token.slice(0, 28)}…${keycloak.token.slice(-18)}` : "(no token)";

    if (!ready) {
        return (
            <div style={{ fontFamily: "system-ui", padding: 24 }}>
                <h2>{pageTitle}</h2>
                <p>Loading…</p>
            </div>
        );
    }

    if (initError) {
        return <div style={{ padding: 24, color: "crimson" }}>Init error: {initError}</div>;
    }

    return (
        <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 980, margin: "0 auto" }}>
            <h2 style={{ marginBottom: 8, fontSize: 24, fontWeight: 800 }}>{pageTitle}</h2>

            <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10, marginBottom: 16, fontSize: 18 }}>
                <div><b>Auth:</b> {authenticated ? "✅ authenticated" : "❌ not authenticated"}</div>
                <div><b>User:</b> {(keycloak?.tokenParsed as any)?.preferred_username ?? "(unknown)"}</div>
                <div><b>Client:</b> {import.meta.env.VITE_KEYCLOAK_CLIENT_ID}</div>
                <div style={{ wordBreak: "break-all" }}><b>Token preview:</b> {tokenPreview}</div>

                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button onClick={login} disabled={busy}>Login</button>
                    <button onClick={logout} disabled={busy}>Logout</button>
                </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                <button onClick={() => call("/api/me")} disabled={busy}>Call /me</button>
                <button onClick={() => call("/api/test")} disabled={busy}>Call /me/test</button>
                <button onClick={() => call("/api/debug-token")} disabled={busy}>Call /me/debug-token</button>
            </div>

            <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
                <h3 style={{ marginTop: 0 }}>Result</h3>
                {!result ? (
                    <p style={{ margin: 0, opacity: 0.7 }}>No calls yet.</p>
                ) : (
                    <div>
                        <div><b>Endpoint:</b> {result.endpoint}</div>
                        <div><b>At:</b> {result.at}</div>
                        {result.status !== undefined && <div><b>Status:</b> {result.status}</div>}
                        {result.error && (
                            <div style={{ marginTop: 8, color: "crimson" }}>
                                <b>Error:</b> {result.error}
                            </div>
                        )}
                        {result.body && (
                            <pre style={{ marginTop: 10, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {prettyBody(result.body)}
              </pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}