import { BrowserRouter, NavLink, Route, Routes, Navigate } from "react-router-dom";
import VariantA from "./pages/VariantA";
import VariantB from "./pages/VariantB";

export default function App() {
    const linkStyle = ({ isActive }: { isActive: boolean }) => ({
        padding: "12px 16px",
        borderRadius: 14,
        textDecoration: "none",
        fontWeight: 700,
        fontSize: 16,
        letterSpacing: 0.2,
        border: isActive ? "1px solid rgba(99,102,241,0.55)" : "1px solid rgba(255,255,255,0.14)",
        color: isActive ? "#fff" : "rgba(255,255,255,0.9)",
        background: isActive
            ? "linear-gradient(135deg, #6366f1 0%, #22c55e 100%)"
            : "rgba(255,255,255,0.08)",
        boxShadow: isActive ? "0 10px 24px rgba(99,102,241,0.28)" : "none",
        transition: "transform 160ms ease, box-shadow 160ms ease, background 160ms ease",
    });

    return (
        <BrowserRouter>
            <div
                style={{
                    minHeight: "100vh",
                    padding: 24,
                    background:
                        "radial-gradient(1200px 600px at 20% 0%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(34,197,94,0.28), transparent 55%), linear-gradient(180deg, #0b1220 0%, #0a0f1c 100%)",
                    color: "rgba(255,255,255,0.92)",
                    fontFamily:
                        'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
                }}
            >
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <header
                        style={{
                            display: "flex",
                            gap: 12,
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 18,
                            padding: "14px 16px",
                            borderRadius: 18,
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.10)",
                            boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 0.2 }}>
                                Dummy UI App
                            </div>
                            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>
                                Keycloak login → Bearer token → user-service
                            </div>
                        </div>

                        <nav style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <NavLink
                                to="/variant-a"
                                style={linkStyle}
                                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                                Variant A (API only UX)
                            </NavLink>
                            <NavLink
                                to="/variant-b"
                                style={linkStyle}
                                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                                Variant B (redirect)
                            </NavLink>
                        </nav>
                    </header>

                    <main
                        style={{
                            padding: 18,
                            borderRadius: 18,
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.10)",
                            boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<Navigate to="/variant-a" replace />} />
                            <Route path="/variant-a" element={<VariantA />} />
                            <Route path="/variant-b" element={<VariantB />} />
                            <Route
                                path="*"
                                element={
                                    <div style={{ padding: 20 }}>
                                        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>404</div>
                                        <div style={{ opacity: 0.8 }}>Няма такава страница.</div>
                                    </div>
                                }
                            />
                        </Routes>
                    </main>

                    <footer style={{ marginTop: 14, fontSize: 12, opacity: 0.7, textAlign: "center" }}>
                        © {new Date().getFullYear()} dummy-ui-app - Sunny Dineva • Vite + React + Keycloak
                    </footer>
                </div>
            </div>
        </BrowserRouter>
    );
}