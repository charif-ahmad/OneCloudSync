# 🏗️ System Architecture

## Architectural Pattern

The system follows a **decoupled Client-Server Model**. The frontend and backend are fully decoupled and communicate exclusively via REST API over HTTPS.

---

## System Topology

```
        📱 Phone / 💻 Browser
         React PWA (client)
      ┌───────────┐  ┌──────────┐
      │ Upload UI │  │ Gallery  │
      │ + Drag &  │  │ Viewer   │
      │ Drop      │  │ + Grid   │
      └─────┬─────┘  └────┬─────┘
            │             │
            │  REST API   │
            │ (optionally through a VPN
            │  such as Tailscale)
┌───────────┼─────────────┼───────────────────────────┐
│           ▼             ▼                           │
│  ┌──────────────────────────────────────────────┐   │
│  │           Nginx (Reverse Proxy)               │   │
│  │  • Serves the built PWA (static files)       │   │
│  │  • Request Routing /api → Express :3000       │   │
│  └──────────────────────┬───────────────────────┘   │
│                         ▼                           │
│  ┌──────────────────────────────────────────────┐   │
│  │        Node.js + Express (REST API)           │   │
│  │                                              │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐  │   │
│  │  │  Routes  │ │Controller│ │ Middleware    │  │   │
│  │  │ /upload  │→│ process  │→│ • Auth        │  │   │
│  │  │ /photos  │ │ validate │ │ • Validation  │  │   │
│  │  │ /health  │ │ store    │ │ • Error       │  │   │
│  │  └──────────┘ └──────────┘ │ • Rate Limit  │  │   │
│  │         │                  └──────────────┘  │   │
│  │    ┌────┴────────────┐                       │   │
│  │    ▼                 ▼                       │   │
│  │ ┌──────────┐  ┌──────────────┐               │   │
│  │ │Filesystem│  │ PostgreSQL   │               │   │
│  │ │/uploads/ │  │ (Metadata)   │               │   │
│  │ │YYYY/MM/DD│  │ • file_name  │               │   │
│  │ │          │  │ • file_path  │               │   │
│  │ │ Raw      │  │ • file_size  │               │   │
│  │ │ Photos   │  │ • hash       │               │   │
│  │ │ (Binary) │  │ • upload_date│               │   │
│  │ └──────────┘  └──────────────┘               │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│     🖥️ Any host — old laptop, Raspberry Pi, VPS      │
│        (all components run as Docker containers,     │
│         or installed manually)                        │
└─────────────────────────────────────────────────────┘
```

---

## Component Responsibilities

### Frontend
| Component | Responsibility |
|-----------|---------------|
| **Upload UI** | Drag-and-drop or file picker for photo selection |
| **Gallery Viewer** | Grid/list view of uploaded photos with lazy loading |

### Backend
| Component | Responsibility |
|-----------|---------------|
| **Nginx** | Serves the built PWA, proxies `/api` to Express |
| **Express API** | Business logic, routing, validation, auth, rate limiting |
| **Filesystem** | Raw photo binary storage in date-organized folders |
| **PostgreSQL** | Photo metadata, search indexes, storage stats |

### Network Layer
| Component | Responsibility |
|-----------|---------------|
| **Tailscale VPN (optional)** | Restricts access to your own devices — no open ports, encrypted WireGuard tunnel |

---

## Request Flow Example: Upload Photo

```
1. User selects photo on phone
2. React app reads file → generates SHA-256 hash
3. React sends POST /api/photos/upload (multipart/form-data)
4. Nginx receives request → forwards to Express :3000
5. Auth middleware validates API key
6. Controller checks hash for duplicates in PostgreSQL
7. Saves file to /uploads/YYYY/MM/DD/filename.jpg
8. Inserts metadata into PostgreSQL
9. Returns 201 Created + photo metadata
```

---

## Design Decisions

| Decision | Reasoning |
|----------|-----------|
| **Separate frontend/backend** | Decoupled architecture allows independent scaling and hosting |
| **Filesystem for photos** | Faster I/O than storing BLOBs in PostgreSQL; simpler backups |
| **PostgreSQL for metadata** | Enables complex queries, full-text search, and future extensibility |
| **Tailscale for remote access** | Free, no port forwarding, handles dynamic IP, secure by default |
| **API Key auth (not OAuth)** | Single user = no need for complex auth; API key is sufficient |
| **Date-based folder structure** | Prevents single-directory bottleneck; easy to browse and backup |

---

> **Next**: [API Design →](./api-design.md)
