## 🔐 Keycloak – задължителни настройки за `dummy-ui-app` (React SPA)

Този frontend е React SPA (Vite + TypeScript) и използва **Keycloak (OIDC)** чрез `keycloak-js`.
Клиентът в Keycloak **ЗАДЪЛЖИТЕЛНО** трябва да е конфигуриран като **public SPA client**.

---

### 1️⃣ Client configuration (Capability config)

**Keycloak Admin Console → Realm → Clients → `dummy-ui-app` → Settings**

| Setting | Value |
|------|------|
| Client authentication | ❌ **OFF** |
| Standard flow | ✅ **ON** |
| Implicit flow | ❌ OFF |
| Direct access grants | ❌ OFF |
| Service accounts roles | ❌ OFF |

> ⚠️ React SPA **НЕ трябва** да използва client secret.  
> Ако `Client authentication` е **ON**, login и redirect процесът може да не работи коректно.

---

### 2️⃣ Redirect & CORS configuration (Access settings)

Скролни надолу до **Access settings** и попълни:

#### ✅ Valid redirect URIs
```text
http://localhost:5173/* 
http://localhost:8088/* 
```

#### ✅ Valid post logout redirect URIs
```text
http://localhost:5173/*
http://localhost:8088/*
```

#### ✅ Web origins
```text
http://localhost:5173/*
http://localhost:8088/*
```

Redirect whitelist-ът се проверява само срещу:
👉 Valid redirect URIs

### 4️⃣ Runtime behavior (sanity check)
| URL                               | Очаквано поведение                |
| --------------------------------- | --------------------------------- |
| `http://localhost:5173/variant-a` | Auto redirect към Keycloak login  |
| `http://localhost:5173/variant-b` | НЯМА auto redirect, login с бутон |