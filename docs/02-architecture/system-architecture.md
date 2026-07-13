# 🏗️ System Architecture

## Architectural Pattern

The system follows a **decoupled Client-Server Model**. The frontend and backend are fully decoupled and communicate exclusively via REST API over HTTPS.

> 🐳 The topology below shows the **manual deployment** (Vercel + host Nginx + PM2). In the recommended [Docker deployment](../05-deployment/docker-deployment.md), the same components run as containers on one host: nginx serves the built PWA **and** proxies `/api` to the Express container, with PostgreSQL on an internal network. The component responsibilities and request flow are otherwise identical.

---

## System Topology

```
┌─────────────────────────────────────────────────────┐
│                 VERCEL (Free Tier)                   │
│               React PWA — Frontend                   │
│                                                     │
│        ┌───────────┐         ┌──────────┐           │
│        │  Upload UI │         │ Gallery  │           │
│        │  + Drag &  │         │ Viewer   │           │
│        │  Drop      │         │ + Grid   │           │
│        └─────┬─────┘         └────┬─────┘           │
└──────────────┼────────────────────┼─────────────────┘
               │                    │
               │   HTTPS (REST API) │
             ┌─┴────────────────────┴──┐
             │    Cloudflare Tunnel    │
             │      (Secure Link)      │
             └──────────┬──────────────┘
                        │
┌───────────────────────┼─────────────────────────────┐
│                       ▼                             │
│  ┌──────────────────────────────────────────────┐   │
│  │           Nginx (Reverse Proxy)               │   │
│  │  • SSL Termination                           │   │
│  │  • Rate Limiting                             │   │
│  │  • Request Routing → localhost:3000           │   │
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
│          🖥️ Toshiba Satellite L655                   │
│             Linux Mint • 4.1 GB RAM                  │
│             430 GB Storage                           │
└─────────────────────────────────────────────────────┘
```

---

## Component Responsibilities

### Frontend (Vercel)
| Component | Responsibility |
|-----------|---------------|
| **Upload UI** | Drag-and-drop or file picker for photo selection |
| **Gallery Viewer** | Grid/list view of uploaded photos with lazy loading |

### Backend (Toshiba Server)
| Component | Responsibility |
|-----------|---------------|
| **Nginx** | Reverse proxy, rate limiting, SSL termination |
| **Express API** | Business logic, routing, request validation |
| **Filesystem** | Raw photo binary storage in date-organized folders |
| **PostgreSQL** | Photo metadata, search indexes, storage stats |

### Network Layer
| Component | Responsibility |
|-----------|---------------|
| **Cloudflare Tunnel** | Secure link between internet and local Nginx without exposing ports |
| **HTTPS** | Encrypted data transfer (auto-managed by Vercel + Cloudflare) |

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
| **Cloudflare Tunnel** | Free, no port forwarding, handles dynamic IP, secure by default |
| **API Key auth (not OAuth)** | Single user = no need for complex auth; API key is sufficient |
| **Date-based folder structure** | Prevents single-directory bottleneck; easy to browse and backup |

---

> **Next**: [API Design →](./api-design.md)
