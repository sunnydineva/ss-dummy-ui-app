import {useMemo, useState} from "react";
import keycloak from "../auth/keycloak";
import {apiGet} from "../api/client";
import {useAuth} from "../auth/AuthProvider.tsx";

type CallResult = {
    endpoint: string;
    status?: number;
    body?: string;
    error?: string;
    at?: string;
};

export default function VariantB() {
    const {ready, authenticated, initError} = useAuth();
    const [result, setResult] = useState<CallResult | null>(null);
    const [busy, setBusy] = useState(false);

    const pageTitle = useMemo(
        () => "variant A - UI app (Spring MVC) → redirect към Keycloak login",
        []
    );


    async function call(endpoint: string) {
        setBusy(true);
        setResult(null);
        try {
            const r = await apiGet(endpoint);
            setResult({endpoint, status: r.status, body: r.body, at: new Date().toISOString()});
        } catch (e: any) {
            setResult({endpoint, error: e?.message ?? String(e), at: new Date().toISOString()});
        } finally {
            setBusy(false);
        }
    }

    function login() {
        keycloak.login({
            redirectUri: window.location.origin + "/variant-b",
        });
    }

    function logout() {
        keycloak.logout({
            redirectUri: window.location.origin + "/variant-b",
        });
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

    const tokenPreview = keycloak?.token
        ? `${keycloak.token.slice(0, 28)}…${keycloak.token.slice(-18)}`
        : "(no token)";

    if (!ready) {
        return (
            <div style={{fontFamily: "system-ui", padding: 24}}>
                <h2>{pageTitle}</h2>
                <p>Loading…</p>
            </div>
        );
    }

    if (initError) {
        return <div style={{padding: 24, color: "crimson"}}>Init error: {initError}</div>;
    }

    return (
        <div style={{fontFamily: "system-ui", padding: 24}}>
            <h2 style={{marginBottom: 8, fontSize: 24, fontWeight: 800}}>{pageTitle}</h2>

            <div style={{padding: 12, border: "1px solid #ddd", borderRadius: 10, marginBottom: 16, fontSize: 18}}>
                <div><b>Auth:</b> {authenticated ? "✅ authenticated" : "❌ not authenticated"}</div>
                <div><b>User:</b> {(keycloak?.tokenParsed as any)?.preferred_username ?? "(unknown)"}</div>
                <div><b>Client:</b> {import.meta.env.VITE_KEYCLOAK_CLIENT_ID}</div>
                <div style={{wordBreak: "break-all"}}><b>Token preview:</b> {tokenPreview}</div>

                <div style={{marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap"}}>
                    {!authenticated ? (
                        <button style={{fontSize: 16}} onClick={login} disabled={busy}>Login</button>
                    ) : (
                        <button style={{fontSize: 16}} onClick={logout} disabled={busy}>Logout</button>
                    )}
                </div>

                {!authenticated && (
                    <p style={{marginTop: 10, marginBottom: 0, opacity: 0.75}}>
                        Тук няма auto-redirect. Щракни <b>Login</b>, после можеш да викаш API с Bearer токен.
                    </p>
                )}
            </div>

            <div style={{display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16}}>
                <button style={{fontSize: 16}} onClick={() => call("/api/me")} disabled={busy || !authenticated}>Call
                    /me
                </button>
                <button style={{fontSize: 16}} onClick={() => call("/api/test")} disabled={busy || !authenticated}>Call
                    /test
                </button>
                <button style={{fontSize: 16}} onClick={() => call("/api/debug-token")}
                        disabled={busy || !authenticated}>Call /debug-token
                </button>
            </div>

            <div style={{padding: 12, border: "1px solid #ddd", borderRadius: 10}}>
                <h3 style={{marginTop: 0, fontSize: 20}}>Result</h3>
                {!result ? (
                    <p style={{margin: 0, opacity: 0.7}}>No calls yet.</p>
                ) : (
                    <div>
                        <div><b>Endpoint:</b> {result.endpoint}</div>
                        <div><b>At:</b> {result.at}</div>
                        {result.status !== undefined && <div><b>Status:</b> {result.status}</div>}
                        {result.error && (
                            <div style={{marginTop: 8, color: "crimson"}}>
                                <b>Error:</b> {result.error}
                            </div>
                        )}

                        {result.body
                            && (<pre style={{marginTop: 10, whiteSpace: "pre-wrap", wordBreak: "break-word"}}>
                {prettyBody(result.body)}
              </pre>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
}