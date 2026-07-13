# 🔌 API Design

> This document describes the API **as implemented** in `backend/src/routes/api.js` and its controllers. If you change an endpoint, update this page in the same commit.

## Base Configuration

| Property | Value |
|----------|-------|
| **Base URL (Docker)** | `http://<host>:8080/api` — nginx proxies to the backend |
| **Base URL (manual/dev)** | `http://<host>:3000/api` |
| **Auth Method** | API key via `X-API-Key` header |
| **Content Type** | `application/json` (multipart for uploads) |
| **Max Upload Size** | 25 MB per file (`MAX_FILE_SIZE`) |
| **Allowed Types** | `image/jpeg`, `image/png`, `image/webp`, `image/heic` |

> Note: `fileSize` values in responses are returned as **strings** (PostgreSQL `BIGINT`).

---

## Authentication

Every request except `GET /api/health` requires the header:

```http
X-API-Key: your-secret-api-key
```

Missing or invalid keys receive `401`:

```json
{ "error": "Unauthorized", "message": "Invalid API key.", "status": 401 }
```

---

## Health & Auth

### 🟢 `GET /api/health` — Health check *(no auth)*

Runs a real database query, so it reflects DB health too.

**`200 OK`**
```json
{ "status": "online", "uptime": 86400, "timestamp": "2026-07-13T12:00:00.000Z" }
```

**`503 Service Unavailable`** — database unreachable:
```json
{ "status": "degraded", "message": "Database connection issue", "timestamp": "..." }
```

### 🔐 `POST /api/auth` — Validate API key

The key is validated by the auth middleware from the `X-API-Key` **header** (there is no request body).

**`200 OK`**
```json
{ "authenticated": true, "message": "Welcome back, Sharif ☁️" }
```

---

## Photos

### 📤 `POST /api/photos/upload` — Upload a single photo

`Content-Type: multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `photo` | File | ✅ | The image file |
| `hash` | String | ❌ | Client-computed hash for deduplication. If omitted, the server computes `sha256:<hex>` itself |
| `folderId` | UUID | ❌ | Destination folder (default: root/unfiled) |
| `takenAt` | String | ❌ | ISO 8601 capture date |

Files are stored as `<uuid>.<ext>` under date-organized directories (`YYYY/MM/DD/`).

**`201 Created`**
```json
{
  "id": "98ce0850-db89-4868-9b58-caca3096128a",
  "fileName": "8f66ddae-9a64-43c7-8bf1-169600d24f18.png",
  "originalName": "IMG_20260713_143022.png",
  "filePath": "2026/07/13/8f66ddae-9a64-43c7-8bf1-169600d24f18.png",
  "fileSize": "4521398",
  "mimeType": "image/png",
  "hash": "sha256:f988ac8e0353b0e02e29927c849583e715bdc909e90e73e84cdd40265a5386a5",
  "folderId": null,
  "uploadedAt": "2026-07-13T11:53:59.518Z"
}
```

**Errors**: `400` no file provided · `409` duplicate hash (includes `existingId`) · `413` file exceeds 25 MB · `400` invalid file type

### 📤 `POST /api/photos/batch` — Batch upload (sync queue)

`Content-Type: multipart/form-data` — max **10 files** per request.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `photos` | File[] | ✅ | Image files |
| `metadata` | JSON string | ❌ | Array aligned by index: `[{ "hash": "...", "folderId": "...", "takenAt": "..." }]` |

**`200 OK`** — per-file results; a partial failure does not fail the batch:
```json
{
  "total": 3,
  "successful": 2,
  "duplicates": 1,
  "failed": 0,
  "results": [
    { "index": 0, "status": "created", "id": "..." },
    { "index": 1, "status": "duplicate", "existingId": "..." },
    { "index": 2, "status": "created", "id": "..." }
  ]
}
```
Failed entries have `{ "index": n, "status": "failed", "error": "<message>" }`.

### 📋 `GET /api/photos` — List photos (paginated)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | Number | `1` | Page number |
| `limit` | Number | `20` | Items per page (max 100) |
| `sort` | String | `uploaded_at` | One of `uploaded_at`, `file_size`, `file_name` |
| `order` | String | `desc` | `asc` or `desc` |
| `folderId` | String | — | UUID = photos in that folder · `root` = unfiled photos · omitted = all photos |

**`200 OK`**
```json
{
  "photos": [
    {
      "id": "...", "fileName": "<uuid>.jpg", "originalName": "IMG_1234.jpg",
      "fileSize": "4521398", "mimeType": "image/jpeg",
      "folderId": null, "uploadedAt": "2026-07-13T11:53:59.518Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 1423, "totalPages": 72 }
}
```

### 🖼️ `GET /api/photos/:id` — Download photo

Returns the binary file with its `Content-Type` and `Content-Disposition: inline`. `404` if the record or the file on disk is missing.

### 🗑️ `DELETE /api/photos/:id` — Delete photo

Deletes the database record and the file on disk.

**`200 OK`**: `{ "deleted": true, "id": "..." }`

### 📁 `PUT /api/photos/:id/move` — Move photo to folder

**Body**: `{ "folderId": "<uuid>" }` — or `null` to move to root.

**`200 OK`**: `{ "id": "...", "folderId": "...", "message": "Photo moved to folder." }`
**Errors**: `404` photo or target folder not found

### 📁 `PUT /api/photos/batch-move` — Move multiple photos

**Body**: `{ "photoIds": ["<uuid>", ...], "folderId": "<uuid>" | null }`

**`200 OK`**: `{ "success": true, "movedCount": 5, "folderId": "...", "message": "..." }`
**Errors**: `400` empty/missing `photoIds` · `404` target folder not found

---

## Folders

### ➕ `POST /api/folders` — Create folder

**Body**: `{ "name": "Vacation", "parentId": "<uuid>" }` (`parentId` optional → root)

Names may not contain `< > : " / \ | ? *`. Names are unique within the same parent.

**`201 Created`**: `{ "id": "...", "name": "Vacation", "parentId": null, "createdAt": "..." }`
**Errors**: `400` empty/invalid name · `404` parent not found · `409` duplicate name in same parent

### 📋 `GET /api/folders` — List folders

| `parentId` value | Returns |
|------------------|---------|
| omitted | All folders |
| `root` (or empty) | Root-level folders only |
| `<uuid>` | Children of that folder |

**`200 OK`**
```json
{
  "folders": [
    { "id": "...", "name": "Vacation", "parentId": null,
      "photoCount": 42, "subfolderCount": 2, "createdAt": "..." }
  ]
}
```

### 📄 `GET /api/folders/:id` — Get folder with breadcrumb

**`200 OK`**
```json
{
  "id": "...", "name": "Summer", "parentId": "...",
  "photoCount": 12,
  "breadcrumb": [ { "id": "...", "name": "Vacation" }, { "id": "...", "name": "Summer" } ],
  "createdAt": "..."
}
```

### ✏️ `PUT /api/folders/:id` — Rename folder

**Body**: `{ "name": "New Name" }` — same validation and `409` rules as create.

### 📁 `PUT /api/folders/:id/move` — Move folder

**Body**: `{ "parentId": "<uuid>" | null }` (`null` → move to root)

**Errors**: `400` moving a folder into itself or one of its own subfolders · `404` folder or target parent not found · `409` name conflict in destination

### 🗑️ `DELETE /api/folders/:id` — Delete folder ⚠️

**Destructive**: recursively deletes all subfolders and **permanently deletes every photo inside them** (database records and files on disk).

**`200 OK`**: `{ "deleted": true, "id": "...", "photosDeleted": 17 }`

---

## Storage

### 📊 `GET /api/storage/stats`

**`200 OK`**
```json
{
  "totalPhotos": 1423,
  "totalFolders": 12,
  "totalSize": "6.2 GB",
  "totalSizeBytes": 6654321098,
  "firstUpload": "2026-04-01T10:00:00.000Z",
  "lastUpload": "2026-07-13T12:14:20.070Z"
}
```

---

## Error Response Format

All errors follow a consistent shape:

```json
{ "error": "ErrorType", "message": "Human-readable description", "status": 400 }
```

| Status | Meaning |
|--------|---------|
| `400` | Bad Request — invalid input |
| `401` | Unauthorized — missing or invalid API key |
| `404` | Not Found — resource doesn't exist |
| `409` | Conflict — duplicate photo hash or folder name |
| `413` | Payload Too Large — file exceeds 25 MB |
| `429` | Too Many Requests — rate limit exceeded |
| `500` | Internal Server Error |

---

## Rate Limiting

Configured in `backend/src/server.js`:

| Scope | Limit |
|-------|-------|
| All `/api` routes | 1000 requests / minute |
| `POST /api/photos/upload` | 30 requests / minute |
| `POST /api/photos/batch` | 5 requests / minute |

---

> **Next**: [Server Specs →](../03-infrastructure/server-specs.md)
