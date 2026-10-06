# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```


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