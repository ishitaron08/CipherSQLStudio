# CipherSQLStudio

A browser-based SQL learning platform where students can practice SQL queries against pre-configured assignments with real-time execution and intelligent hints.

## Features

- **Assignment Listing**: Browse available SQL assignments with difficulty levels
- **SQL Editor**: Monaco Editor with syntax highlighting for writing SQL queries
- **Real-time Execution**: Execute queries against PostgreSQL and see instant results
- **Schema Viewer**: View table structures and sample data for each assignment
- **AI Hints**: Get intelligent hints (not solutions) powered by NVIDIA NIM

## Tech Stack

### Frontend
- React.js with Vite
- Monaco Editor for SQL editing
- Vanilla SCSS with mobile-first responsive design
- Axios for API calls

### Backend
- Node.js with Express.js
- PostgreSQL (Sandbox database for query execution)
- MongoDB (Persistence for assignments, users, attempts)
- Vercel AI SDK with NVIDIA NIM for hint generation

## Project Structure

```
cipher-sql-studio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── styles/         # SCSS files
│   │   └── App.jsx
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Database & environment config
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── app.js
│   └── package.json
├── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL
- MongoDB (Atlas recommended)
- NVIDIA NIM API Key (https://build.nvidia.com)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cipher-sql-studio
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Set up PostgreSQL sandbox database:
```bash
# Create database
createdb sql_sandbox

# Run seed script (from server folder)
npm run seed --workspace=server
```

5. Start development servers:
```bash
npm run dev
```

The client will be available at `http://localhost:5173`
The server will be available at `http://localhost:5000`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NIM_API_KEY` | NVIDIA NIM API key for AI hints |
| `MONGODB_URI` | MongoDB connection string |
| `POSTGRES_HOST` | PostgreSQL host |
| `POSTGRES_PORT` | PostgreSQL port |
| `POSTGRES_DB` | PostgreSQL database name |
| `POSTGRES_USER` | PostgreSQL username |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `JWT_SECRET` | Secret for JWT tokens (optional auth) |
| `CLIENT_URL` | Frontend URL for CORS |

## API Endpoints

### Assignments
- `GET /api/assignments` - List all assignments
- `GET /api/assignments/:id` - Get assignment details with schema

### Query Execution
- `POST /api/query/execute` - Execute SQL query

### Hints
- `POST /api/hints` - Get AI-powered hint for current query

### Auth (Optional)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

## Technology Choices

### Why PostgreSQL for Sandbox?
PostgreSQL is the industry-standard relational database that students will encounter in real-world scenarios. It provides full SQL compliance and advanced features for learning.

### Why MongoDB for Persistence?
MongoDB's flexible schema is ideal for storing varied assignment structures, user progress data, and query history without rigid schema constraints.

### Why NVIDIA NIM?
NVIDIA NIM provides optimized inference for powerful language models like DeepSeek-R1, offering high-quality hints through an OpenAI-compatible API via Vercel AI SDK.

### Why Vanilla SCSS?
Demonstrates fundamental CSS skills with variables, mixins, nesting, and partials while maintaining full control over responsive design without framework overhead.

## License
