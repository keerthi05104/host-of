# Send Me — Secure, Simple File Sharing

A polished MERN-style file-sharing MVP built with React + Vite, Express, Multer, Mongoose, and MongoDB Atlas. A sender uploads files and receives a random sharing code; a recipient enters the code to view and download the files.

## Requirements
- Node.js 18+ (Node 20+ recommended)
- MongoDB Atlas database or local MongoDB

## 1. Configure MongoDB
1. Create a free cluster at https://cloud.mongodb.com.
2. Create a database user and keep its password private.
3. In Network Access, allow your current IP for local development.
4. Choose Connect → Drivers and copy the connection string.
5. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`. Replace `<password>` and set the database name, for example `sendme`.

Never commit `.env` or share database credentials.

## 2. Install dependencies
Open a terminal in this folder:

```bash
cd server
npm install
```

Open a second terminal:

```bash
cd client
npm install
```

## 3. Start the application
Terminal 1:
```bash
cd server
npm run dev
```
Terminal 2:
```bash
cd client
npm run dev
```
Open the Vite URL shown in the terminal, normally http://localhost:5173.

The API defaults to http://localhost:5000. The frontend uses `/api` through the Vite proxy.

## Core workflow
1. Drag files into the upload area or browse for them.
2. Select **Create share** and copy the generated code.
3. On another browser/device, open the app and enter the code.
4. Download a file from the shared list.

## MVP limits and security notes
- Up to 5 files per share, 25 MB per file.
- Local files are stored in `server/uploads`; they are intentionally not served as a public static directory.
- Share codes are cryptographically random bearer secrets. Anyone with a code can access that share, so share codes privately.
- This MVP does not include accounts, password-protected shares, antivirus scanning, or end-to-end encryption.
- Local disk storage is for development only. Use persistent object storage (such as S3) for production; ephemeral hosting disks may delete uploaded files.
- For production, configure a specific allowed frontend origin via `CLIENT_ORIGIN` and use HTTPS.

## API
- `GET /api/health` — health check
- `POST /api/shares` — multipart upload; field name `files`
- `GET /api/shares/:id` — list metadata for a share
- `GET /api/shares/:id/files/:fileId/download` — download a file

## Project structure
- `client/` — React UI, styles, and API helper
- `server/models/` — MongoDB share metadata
- `server/services/` — local storage adapter
- `server/controllers/` — upload, lookup, and download logic
- `server/routes/` — API route definitions
- `server/uploads/` — private local file storage
