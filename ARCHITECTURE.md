# System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                                 │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  Beautiful Gradient Background Page with Information              │  │
│  │                                                                    │  │
│  │  ┌──────────────────────────────────────────────────────────┐    │  │
│  │  │  Floating Chatbox (Bottom-Right Corner)                  │    │  │
│  │  │  ┌────────────────────────────────────────────────────┐  │    │  │
│  │  │  │ Header: AI Document Assistant                     │  │    │  │
│  │  │  ├────────────────────────────────────────────────────┤  │    │  │
│  │  │  │ Status Badge: Ready (45 chunks)                   │  │    │  │
│  │  │  ├────────────────────────────────────────────────────┤  │    │  │
│  │  │  │ Response Display Area                             │  │    │  │
│  │  │  ├────────────────────────────────────────────────────┤  │    │  │
│  │  │  │ Input: [Ask a question...] [Send Button]          │  │    │  │
│  │  │  └────────────────────────────────────────────────────┘  │    │  │
│  │  └──────────────────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │ HTTP Requests
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React/Next.js)                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  page.js - Main Component                                       │   │
│  │  • Session Management (sessionId state)                         │   │
│  │  • Query Handling (API calls)                                   │   │
│  │  • UI State Management                                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │ REST API Calls
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND API (Next.js Routes)                     │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────┐  │
│  │ /api/sessions        │  │ /api/document/load   │  │ /api/query   │  │
│  ├──────────────────────┤  ├──────────────────────┤  ├──────────────┤  │
│  │ POST - Create        │  │ POST - Load & Index  │  │ POST - RAG   │  │
│  │ GET  - List All      │  │                      │  │ GET  - List  │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────┘  │
│  ┌──────────────────────┐                                               │
│  │ /api/sessions/[id]   │                                               │
│  ├──────────────────────┤                                               │
│  │ GET    - Get One     │                                               │
│  │ PATCH  - Update      │                                               │
│  │ DELETE - Delete      │                                               │
│  └──────────────────────┘                                               │
└───────────────┬────────────────────────────────┬────────────────────────┘
                │                                │
                │ Prisma ORM                     │ LLM Utilities
                ▼                                ▼
┌────────────────────────────┐  ┌────────────────────────────────────────┐
│     DATABASE (SQLite)      │  │     LLM INTEGRATION (lib/llm.js)       │
│  ┌──────────────────────┐  │  │  ┌──────────────────────────────────┐  │
│  │  Session Table       │  │  │  │ generateContext()                │  │
│  ├──────────────────────┤  │  │  │ • Split document into chunks     │  │
│  │ • id (PK)            │  │  │  │ • Use LLM to extract relevant    │  │
│  │ • documentChunks     │  │  │  │   paragraphs (3-4 chunks)        │  │
│  │ • isActive           │  │  │  └──────────────────────────────────┘  │
│  │ • createdAt          │  │  │  ┌──────────────────────────────────┐  │
│  │ • updatedAt          │  │  │  │ generateAnswer()                 │  │
│  └──────────────────────┘  │  │  │ • Use context to generate answer │  │
│                             │  │  │ • Ground answer in context only  │  │
│  ┌──────────────────────┐  │  │  └──────────────────────────────────┘  │
│  │  Query Table         │  │  │  ┌──────────────────────────────────┐  │
│  ├──────────────────────┤  │  │  │ fetchWithRetry()                 │  │
│  │ • id (PK)            │  │  │  │ • Exponential backoff            │  │
│  │ • sessionId (FK)     │  │  │  │ • Up to 5 retry attempts         │  │
│  │ • question           │  │  │  │ • Error handling                 │  │
│  │ • context            │  │  │  └──────────────────────────────────┘  │
│  │ • answer             │  │  │                                        │
│  │ • processingTime     │  │  │         Uses ↓                         │
│  │ • errorMessage       │  │  │  ┌──────────────────────────────────┐  │
│  │ • isLoading          │  │  │  │  GOOGLE GEMINI AI API            │  │
│  │ • createdAt          │  │  │  │  Model: gemini-2.5-flash         │  │
│  └──────────────────────┘  │  │  │  • Context Extraction            │  │
│                             │  │  │  • Answer Generation             │  │
└─────────────────────────────┘  │  └──────────────────────────────────┘  │
                                 └────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW SEQUENCE                               │
└─────────────────────────────────────────────────────────────────────────┘

1. User Opens Application
   └──> Frontend creates Session (POST /api/sessions)
        └──> Database stores Session record
             └──> Returns sessionId to Frontend

2. Document Loading (automatic on mount)
   └──> Frontend sends document (POST /api/document/load)
        └──> Backend splits into chunks
             └──> Database updates Session.documentChunks
                  └──> Returns success to Frontend

3. User Asks Question
   └──> Frontend sends query (POST /api/query)
        └──> Backend creates Query record (isLoading = true)
             └──> LLM: Extract relevant context
                  └──> LLM: Generate answer from context
                       └──> Database updates Query record
                            └──> Returns answer to Frontend
                                 └──> Frontend displays answer

4. View History (optional)
   └──> Frontend requests (GET /api/query?sessionId=xxx)
        └──> Database returns all queries for session
             └──> Frontend displays history

┌─────────────────────────────────────────────────────────────────────────┐
│                         TECHNOLOGY STACK                                 │
└─────────────────────────────────────────────────────────────────────────┘

Frontend:
  • React 19
  • Next.js 15 (App Router)
  • Tailwind CSS 4
  • Fetch API

Backend:
  • Next.js API Routes
  • Server-side JavaScript

Database:
  • SQLite (Development)
  • Prisma ORM 6
  • Can migrate to PostgreSQL

AI/LLM:
  • Google Gemini 2.5 Flash
  • REST API integration
  • Retry logic with backoff

┌─────────────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYERS                                  │
└─────────────────────────────────────────────────────────────────────────┘

1. API Key Protection
   └──> Stored in .env (server-side only)
        └──> Never exposed to client

2. Input Validation
   └──> All endpoints validate request data
        └──> Returns 400 for invalid input

3. Database Security
   └──> Prisma ORM prevents SQL injection
        └──> Type-safe queries

4. Error Handling
   └──> Sanitized error messages to client
        └──> Detailed logs server-side

┌─────────────────────────────────────────────────────────────────────────┐
│                         MONITORING & ANALYTICS                           │
└─────────────────────────────────────────────────────────────────────────┘

Tracked Metrics:
  • Processing time per query (milliseconds)
  • Document chunks processed
  • Error rates and messages
  • Query history per session
  • Session creation timestamps

View Database:
  npx prisma studio → http://localhost:5555

┌─────────────────────────────────────────────────────────────────────────┐
│                         SCALABILITY NOTES                                │
└─────────────────────────────────────────────────────────────────────────┘

Current Setup (Development):
  • SQLite database
  • In-memory session management
  • Direct API calls

Production Ready Options:
  • Switch to PostgreSQL/MySQL
  • Add Redis for caching
  • Implement connection pooling
  • Add rate limiting
  • CDN for static assets
  • Load balancing for API

┌─────────────────────────────────────────────────────────────────────────┐
│                         API ENDPOINT SUMMARY                             │
└─────────────────────────────────────────────────────────────────────────┘

Session Management:
  POST   /api/sessions        → Create new session
  GET    /api/sessions        → List all sessions
  GET    /api/sessions/[id]   → Get session details
  PATCH  /api/sessions/[id]   → Update session
  DELETE /api/sessions/[id]   → Delete session

Document Management:
  POST   /api/document/load   → Load & index document

Query Processing:
  POST   /api/query           → Process RAG query
  GET    /api/query           → Get query history
                                (requires ?sessionId=xxx)

Total: 8 REST endpoints
```
