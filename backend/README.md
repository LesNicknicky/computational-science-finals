Deforestation Simulation — Backend

FastAPI backend for the reforestation/deforestation offset simulator. Computes required sapling counts and safe lead time based on water absorption and flood-risk modeling, using real barangay/region presets (soil type, land cover, species mix).

Runs fully local/LAN only — no cloud services required.

Prerequisites
Python 3.11+ (see .python-version for the exact pinned version)
uv installed for dependency and environment management
Setup

From the backend/ folder:

bash
uv sync

This creates/updates the .venv and installs everything locked in uv.lock.

Environment variables

Copy or check .env for local config (host/port overrides, any local file paths). No API keys are required — the project doesn't call external/cloud services.

Running the server
bash
uv run fastapi dev main.py

If your FastAPI app instance is defined in app.py instead of main.py, point the command at that file instead: uv run fastapi dev app.py.

This starts the dev server with auto-reload at:

http://127.0.0.1:8000

Interactive API docs (Swagger UI) are available automatically at:

http://127.0.0.1:8000/docs
Connecting the frontend

The React/Vite frontend (in ../frontend) should point its API base URL at http://127.0.0.1:8000. If you hit CORS issues during local dev, either:

add a CORS middleware allowing http://localhost:5173 (Vite's default dev port), or
use Vite's dev server proxy config to forward /api requests to the backend.
Project structure
backend/
├── simulation/        # core simulation logic (absorption, runoff, flood risk, sapling growth)
│   └── data/           # barangay/region presets, species profiles, surface coefficients
├── static/             # static assets served by the backend, if any
├── app.py              # FastAPI app instance and route registration
├── main.py             # run entrypoint
├── pyproject.toml       # project metadata and dependencies (uv-managed)
└── uv.lock              # locked dependency versions
Running tests
bash
uv run pytest

(Add test files under simulation/tests/ or tests/ as the simulation logic grows.)


## Running the project

You need two terminals, one for the backend and one for the frontend.

### Prerequisites
- [uv](https://docs.astral.sh/uv/) (Python environment manager)
- Node.js and npm

### 1. Backend (FastAPI, port 8000)

```bash
cd backend
uv sync
uv run uvicorn main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### 2. Frontend (React + Vite, port 5173)

```bash
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173
- The frontend calls the backend at `http://localhost:8000` by default. To change it, create `frontend/.env`:

```
VITE_API_URL=http://localhost:8000
```

### Notes
- Start the backend first, otherwise the Simulator shows "Failed to fetch".
- The backend only allows requests from `http://localhost:5173` (CORS), so the frontend must run on that port.