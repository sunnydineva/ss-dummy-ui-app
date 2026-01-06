import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/AuthProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
        <AuthProvider mode="check-sso">
            <App />
        </AuthProvider>
);