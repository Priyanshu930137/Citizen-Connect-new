====================================================
CITIZEN CONNECT - PROJECT MEMORY FILE
====================================================

PROJECT NAME:
Citizen Connect

PROJECT TYPE:
AI-Based Citizen Engagement and Public Grievance
Management System

====================================================
PROJECT DESCRIPTION
====================================================

Citizen Connect is a web-based platform that allows
citizens to submit public grievances and complaints.

The system uses AI-based analysis to automatically:

- Categorize grievances
- Assign the responsible department
- Determine priority levels
- Provide an AI assessment/reason

Authorities can:

- View all submitted grievances
- Search grievances
- Filter grievances
- View detailed grievance information
- Update grievance status
- Monitor grievance statistics
- View analytics and charts

====================================================
TECHNOLOGY STACK
====================================================

FRONTEND:

- HTML
- CSS
- JavaScript
- Chart.js

BACKEND:

- Python
- FastAPI
- SQLAlchemy

DATABASE:

- SQLite

AI SYSTEM:

- Rule-based AI grievance analysis
- Keyword-based categorization
- Priority detection

====================================================
PROJECT FOLDER STRUCTURE
====================================================

Client Connect/

│
├── backend/
│   │
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── ai_service.py
│
├── frontend/
│   │
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── submit.html
│   ├── track.html
│   ├── admin.html
│   ├── details.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── script.js
│       ├── login.js
│       ├── register.js
│       ├── submit.js
│       ├── track.js
│       ├── admin.js
│       └── details.js
│
├── venv/
│
└── citizen_connect.db

====================================================
DATABASE
====================================================

The project uses SQLite with SQLAlchemy ORM.

DATABASE FILE:

citizen_connect.db

====================================================
USER SYSTEM
====================================================

Two user roles exist:

1. Citizen
2. Authority

====================================================
USER REGISTRATION
====================================================

API ENDPOINT:

POST /api/register

The registration system collects:

- Name
- Email
- Password
- Role

Allowed roles:

- citizen
- authority

The system checks whether an email is already registered.

====================================================
USER LOGIN
====================================================

API ENDPOINT:

POST /api/login

The login system verifies:

- Email
- Password
- Selected role

After successful login, user information is stored
in browser localStorage.

LOCAL STORAGE KEY:

citizenConnectUser

Stored information includes:

- id
- name
- email
- role

====================================================
CITIZEN FEATURES
====================================================

Citizens can:

- Register an account
- Login
- Submit grievances
- Track grievances
- View grievance information

====================================================
GRIEVANCE SUBMISSION
====================================================

API ENDPOINT:

POST /api/grievances

The grievance submission contains:

- citizen_name
- email
- phone
- location
- subject
- description

The system automatically performs AI analysis before
saving the grievance.

====================================================
AI GRIEVANCE ANALYSIS
====================================================

FILE:

backend/ai_service.py

FUNCTION:

analyze_grievance(subject, description)

The AI analysis determines:

- Category
- Department
- Priority
- AI Reason

====================================================
SUPPORTED AI CATEGORIES
====================================================

ROAD & INFRASTRUCTURE

Keywords include:

- road
- pothole
- street
- highway
- footpath

Department:

Public Works Department


WATER & SANITATION

Keywords include:

- water
- pipeline
- water leakage
- water supply
- drain

Department:

Water Supply Department


ELECTRICITY

Keywords include:

- electricity
- electric
- power
- wire
- street light
- transformer

Department:

Electricity Department


CLEANLINESS & WASTE

Keywords include:

- garbage
- waste
- dirty
- cleanliness
- dustbin
- sewage

Department:

Municipal Corporation


PUBLIC SAFETY

Keywords include:

- crime
- robbery
- theft
- unsafe
- violence
- police

Department:

Police Department

Priority:

High

====================================================
PRIORITY SYSTEM
====================================================

HIGH PRIORITY KEYWORDS:

- fire
- accident
- emergency
- death
- injury
- danger
- gas leak
- collapsed
- flood
- electrocution
- hospital emergency

These grievances are automatically assigned:

Priority: High

Medium priority is the default.

Low priority may be assigned for keywords such as:

- small
- minor
- suggestion
- request

====================================================
GRIEVANCE STATUS SYSTEM
====================================================

Available statuses:

- Pending
- In Progress
- Resolved
- Rejected

Default status for a newly submitted grievance:

Pending

====================================================
BACKEND API ENDPOINTS
====================================================

API HOME:

GET /api


USER REGISTRATION:

POST /api/register


USER LOGIN:

POST /api/login


CREATE GRIEVANCE:

POST /api/grievances


GET ALL GRIEVANCES:

GET /api/grievances


GET SINGLE GRIEVANCE:

GET /api/grievances/{grievance_id}


UPDATE GRIEVANCE STATUS:

PUT /api/grievances/{grievance_id}/status


DASHBOARD STATISTICS:

GET /api/dashboard/stats


DASHBOARD ANALYTICS:

GET /api/dashboard/analytics


AUTOMATED INSIGHTS:

GET /api/dashboard/insights

====================================================
AUTHORITY DASHBOARD
====================================================

FILE:

frontend/admin.html

JAVASCRIPT:

frontend/js/admin.js

The Authority Dashboard currently provides:

- Total grievance count
- Pending grievance count
- In Progress grievance count
- Resolved grievance count

====================================================
SEARCH AND FILTER SYSTEM
====================================================

Authorities can search grievances using:

- Grievance ID
- Citizen name
- Subject

Authorities can filter grievances by:

- Status
- Priority
- Category

There is also:

- Clear Filters button
- Refresh button

====================================================
GRIEVANCE TABLE
====================================================

The Authority Dashboard displays:

- ID
- Subject
- Citizen
- Category
- Priority
- Status
- View button

The View button opens:

details.html?id=GRIEVANCE_ID

====================================================
ANALYTICS DASHBOARD
====================================================

Chart.js is used for analytics visualization.

Three charts currently exist:

1. Status Distribution
2. Category Distribution
3. Priority Distribution

STATUS CHART:

Doughnut chart

Displays:

- Pending
- In Progress
- Resolved
- Rejected


CATEGORY CHART:

Bar chart

Displays the number of grievances in each category.


PRIORITY CHART:

Pie chart

Displays:

- High
- Medium
- Low

====================================================
GRIEVANCE DETAILS PAGE
====================================================

FILE:

frontend/details.html

JAVASCRIPT:

frontend/js/details.js

The page loads grievance information using the
grievance ID from the URL.

Example:

details.html?id=1

====================================================
DETAILS PAGE FEATURES
====================================================

The Authority can view:

GRIEVANCE INFORMATION:

- Grievance ID
- Subject
- Description
- Current Status


CITIZEN INFORMATION:

- Full Name
- Email Address
- Phone Number
- Location


AI ANALYSIS:

- Category
- Department
- Priority
- AI Assessment


STATUS MANAGEMENT:

Authorities can update the grievance status to:

- Pending
- In Progress
- Resolved
- Rejected

====================================================
AUTHORITY AUTHENTICATION
====================================================

The Authority Dashboard checks localStorage.

If no user is logged in:

Redirect to:

login.html


If a citizen tries to access the Authority Dashboard:

Redirect to:

index.html


Only users with the role:

authority

can access:

- admin.html
- details.html

====================================================
CURRENT BACKEND STATUS
====================================================

The backend main.py is currently working.

It includes:

- FastAPI application
- SQLite database connection
- SQLAlchemy models
- User registration
- User login
- Grievance creation
- AI grievance analysis
- Get all grievances
- Get single grievance
- Update grievance status
- Dashboard statistics
- Dashboard analytics
- Automated insights
- Frontend static file serving

====================================================
CURRENT PROJECT STATUS
====================================================

COMPLETED:

[✓] Project structure

[✓] FastAPI backend

[✓] SQLite database

[✓] SQLAlchemy integration

[✓] User registration

[✓] User login

[✓] Citizen role

[✓] Authority role

[✓] Citizen grievance submission

[✓] AI grievance categorization

[✓] Department assignment

[✓] Priority detection

[✓] AI assessment reason

[✓] Grievance tracking system

[✓] Authority Dashboard

[✓] Dashboard statistics

[✓] Search system

[✓] Filter system

[✓] Category filtering

[✓] Status filtering

[✓] Priority filtering

[✓] Grievance table

[✓] Grievance Details page

[✓] Status update system

[✓] Status badges

[✓] Chart.js analytics

[✓] Status distribution chart

[✓] Category distribution chart

[✓] Priority distribution chart

[✓] Automated backend analytics endpoint

[✓] Automated backend insights endpoint

====================================================
IMPORTANT CURRENT FILE STATUS
====================================================

admin.html:

Working and structurally correct.


admin.js:

Needs to remain the corrected clean version
compatible with admin.html.


details.html:

Working.


details.js:

Working.


main.py:

Working.


ai_service.py:

Working.

====================================================
IMPORTANT NOTES
====================================================

1. Do not add image upload functionality currently.

The image functionality was intentionally removed
from the project approach.

2. The project currently focuses on text-based
grievance submission and AI analysis.

3. When updating files, provide COMPLETE FILE CODE
instead of partial changes whenever possible.

4. Avoid changing working backend code unnecessarily.

5. Keep the existing API endpoint structure unless
a feature specifically requires a new endpoint.

====================================================
NEXT DEVELOPMENT STEPS
====================================================

The next recommended features are:

1. Improve Automated Insights on the Dashboard

2. Add Department-based grievance management

3. Add sorting options

4. Add date/time display for grievances

5. Improve citizen grievance tracking page

6. Add resolution progress timeline

7. Add authority notes/comments

8. Add better dashboard analytics

9. Add notification/status update simulation

10. Improve UI responsiveness and polish

====================================================
CURRENT DEVELOPMENT STAGE
====================================================

The project is now in the ADVANCED FUNCTIONAL
DEVELOPMENT stage.

The main citizen workflow and authority workflow
are working.

NEXT FOCUS:

Improving the Authority Dashboard with smarter
analytics and automated insights.

====================================================
END OF MEMORY FILE
====================================================

test@example.com
123456
auth@
admin123