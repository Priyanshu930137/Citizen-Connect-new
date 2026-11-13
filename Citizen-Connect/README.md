# Citizen Connect

Citizen Connect is a FastAPI and MySQL grievance reporting app. The backend
serves the frontend, REST API, uploaded photos, and API docs from one local URL.

## 1. Prerequisites

- Python 3.10 or newer
- MySQL Server running locally
- MySQL Workbench or the `mysql` command line (optional)

## 2. Create the local MySQL database and user

Log in to MySQL as an administrator and run the following. Change the local
password if you prefer, then use the same value in the `.env` connection URL.

```sql
CREATE DATABASE citizen_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'citizen_connect'@'localhost' IDENTIFIED BY 'LocalDb@12345';
GRANT ALL PRIVILEGES ON citizen_connect.* TO 'citizen_connect'@'localhost';
FLUSH PRIVILEGES;
```

## 3. Install Python packages

Run these commands from the project root (`Citizen-Connect-new`):

```bash
python3 -m venv venv
```

Activate the environment:

```bash
# Linux / macOS
source venv/bin/activate

# Windows PowerShell
venv\Scripts\Activate.ps1
```

Then install requirements:

```bash
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt
```

## 4. Configure MySQL

Copy `backend/.env.example` to `backend/.env`, then update it as needed. If your MySQL username or password
contains URL-reserved characters, URL-encode them in `DATABASE_URL`.

```env
DATABASE_URL=mysql+pymysql://citizen_connect:LocalDb%4012345@127.0.0.1:3306/citizen_connect?charset=utf8mb4
# Optional. Without this key, local keyword-based grievance categorization is used.
GEMINI_API_KEY=
```

The MySQL account must be allowed to connect from `127.0.0.1`; if you created it
only for `localhost`, either connect with `localhost` in the URL or grant access
to `citizen_connect`@`127.0.0.1` too. Tables are created automatically at startup.

## 5. Create demo logins

From the project root, with the virtual environment active:

```bash
cd backend
python seed_demo_users.py
```

This safely creates or refreshes the demo users in the selected database. All
demo accounts use the local-only password `Demo@12345`.

| Access | Login email | Password | Login role |
|---|---|---|---|
| Site admin / authority dashboard | `admin@citizenconnect.local` | `Demo@12345` | Authority |
| Citizen | `citizen@citizenconnect.local` | `Demo@12345` | Citizen |
| Public Works manager | `manager.public-works@citizenconnect.local` | `Demo@12345` | Management; Public Works Department |
| Public Works technician | `tech.public-works@citizenconnect.local` | `Demo@12345` | Technician; Public Works Department |
| Water Supply manager | `manager.water-supply@citizenconnect.local` | `Demo@12345` | Management; Water Supply Department |
| Water Supply technician | `tech.water-supply@citizenconnect.local` | `Demo@12345` | Technician; Water Supply Department |
| Electricity manager | `manager.electricity@citizenconnect.local` | `Demo@12345` | Management; Electricity Department |
| Electricity technician | `tech.electricity@citizenconnect.local` | `Demo@12345` | Technician; Electricity Department |
| Municipal manager | `manager.municipal-corporation@citizenconnect.local` | `Demo@12345` | Management; Municipal Corporation |
| Municipal technician | `tech.municipal-corporation@citizenconnect.local` | `Demo@12345` | Technician; Municipal Corporation |
| Police manager | `manager.police@citizenconnect.local` | `Demo@12345` | Management; Police Department |
| Police technician | `tech.police@citizenconnect.local` | `Demo@12345` | Technician; Police Department |
| Health manager | `manager.health@citizenconnect.local` | `Demo@12345` | Management; Health Department |
| Health technician | `tech.health@citizenconnect.local` | `Demo@12345` | Technician; Health Department |
| Traffic Management manager | `manager.traffic-management@citizenconnect.local` | `Demo@12345` | Management; Traffic Management Department |
| Traffic Management technician | `tech.traffic-management@citizenconnect.local` | `Demo@12345` | Technician; Traffic Management Department |
| Public Administration manager | `manager.public-administration@citizenconnect.local` | `Demo@12345` | Management; Public Administration |
| Public Administration technician | `tech.public-administration@citizenconnect.local` | `Demo@12345` | Technician; Public Administration |

These are predictable demo credentials. Use them only in a local development
database. Public signup is limited to citizens; staff accounts are provisioned
by the seed script or administrator.

## 6. Start the website

From `backend/` (after step 5):

```bash
uvicorn main:app --reload
```

Open these URLs:

- Website: <http://127.0.0.1:8000>
- API health check: <http://127.0.0.1:8000/api>
- Interactive API docs: <http://127.0.0.1:8000/docs>

If you serve the frontend separately with VS Code Live Server on port `5500`,
the frontend now sends API requests to port `8000` automatically. Keep the
backend running and use `http://localhost:5500/register.html`; do not open the
HTML file directly from disk. If you run the backend on another port, set
`window.CITIZEN_CONNECT_API_URL` in `frontend/js/config.js` to that backend URL.

Stop the server with `Ctrl+C`. The app stores complaint photos in `backend/uploads/`.

## Main data flow

1. A citizen registers or signs in; accounts and grievances are stored in MySQL.
2. The citizen submits a complaint; the API verifies their account, checks for
   duplicate reports, categorizes it, and saves the grievance.
3. Authorities and department managers read the same grievance records from the
   API. Managers assign technicians; technicians update progress and resolution.
4. Citizens see status changes through their dashboard and tracking page.

## Dashboard features and data sources

- **Account creation confirmation:** after the API successfully saves a citizen
  account, the registration page shows a persistent success message and a
  `Sign in now` link. The message appears only after the successful API response.
- **Department management dashboard:** the signed-in manager sees only their
  department’s grievance records. The status, open-priority, and technician
  workload charts, plus the overdue, unassigned, resolution-rate, and workload
  insights, are computed from the same department grievance response used by
  the case table (`GET /api/departments/{department}/grievances`).
- **Authority overview:** the authority dashboard can review grievances across
  all departments, compare system-wide charts and workload, and see active
  high-priority, unassigned, and over-seven-day case counts from
  `GET /api/dashboard/stats` and `GET /api/dashboard/analytics`.
- **Authority case review:** search across citizen, location, technician,
  department, and case details; filter by status, priority, category, and
  department; then export the currently filtered rows as CSV. The result count
  and export both use the same all-grievances response (`GET /api/grievances`).
- **Management URL compatibility:** `management.html` redirects to the active
  department dashboard at `department.html`, which is the page used after
  management login.

With no `GEMINI_API_KEY`, local keyword categorization keeps this workflow
usable. Add a valid key to enable Gemini assessment. New MySQL installations get
tables automatically; this project does not currently migrate an older schema.
