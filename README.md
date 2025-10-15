\
✈️ TravelWise AI Chatbot
Video-Link: https://drive.google.com/file/d/18nLNdb7wcGBm0QivukVxu1OAsBZoLAqe/view?usp=sharing
A smart, production-ready AI customer support chatbot for the travel and tourism industry. Built with a complete backend API, database persistence, and a beautiful, user-friendly UI.

✨ Features
🎨 Beautiful & Intuitive UI
Floating Chatbox: An elegant and accessible chatbox in the bottom-right corner of your site.

Information Page: A beautiful landing page with a gradient background to provide system information.

Responsive Design: Flawless user experience on desktops, tablets, and mobile devices.

Modern Aesthetics: A sleek purple/pink gradient theme with smooth, welcoming animations.

🧠 Intelligent Customer Support
Instant, 24/7 Answers: Provides immediate responses to customer queries at any time of day.

Handles Diverse Queries: Expertly answers questions about tour packages, pricing, cancellations, booking procedures, and destination info.

Context-Aware: Understands conversation flow to provide relevant and accurate information based on your travel data.

Reduces Support Load: Automates responses to frequently asked questions, freeing up your human agents for complex issues.

🔧 Robust Backend & Analytics
REST API: 8 comprehensive endpoints for managing chat sessions and queries.

Database Persistence: All conversations are saved to a database for review and analysis.

Session Tracking: Full session management with complete query history for each user.

Performance Monitoring: Tracks the processing time for each query to ensure a speedy user experience.

🚀 Quick Start
Prerequisites
Node.js 18+

npm or yarn

Installation
Install dependencies

Bash

npm install
Set up environment variables

Update the .env file with your Gemini API key:

Code snippet

DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your-api-key-here"
Initialize database

Bash

npx prisma generate
npx prisma db push
Start development server

Bash

npm run dev
Open the app

http://localhost:3000
📁 Project Structure
travelwise-ai-main/
├── app/
│   ├── api/              # Backend REST API
│   │   ├── sessions/     # Session management endpoints
│   │   ├── query/        # Query processing endpoints
│   │   └── document/     # Document loading endpoints
│   ├── page.js           # Main UI (chatbox & info page)
│   ├── layout.js         # App layout
│   └── globals.css       # Global styles
├── lib/
│   ├── db.js             # Prisma database client
│   └── llm.js            # LLM utility functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── dev.db            # SQLite database (generated)
├── .env                  # Environment variables
├── package.json          # Dependencies
├── API_DOCUMENTATION.md  # API reference
└── README.md             # This file
🔌 API Endpoints
Session Management
POST /api/sessions - Create new session

GET /api/sessions - List all sessions

GET /api/sessions/[id] - Get specific session

DELETE /api/sessions/[id] - Delete session

Document Management
POST /api/document/load - Load and index travel data

Query Processing
POST /api/query - Process a customer query

GET /api/query?sessionId=xxx - Get query history for a session

See API_DOCUMENTATION.md for detailed API reference.

💾 Database Schema
Session Table
SQL

Session {
  id              String (Primary Key)
  documentChunks  Int
  createdAt       DateTime
  updatedAt       DateTime
  queries         Query[]
}
Query Table
SQL

Query {
  id              String (Primary Key)
  sessionId       String (Foreign Key)
  question        String
  context         String
  answer          String
  processingTime  Int
  errorMessage    String?
  createdAt       DateTime
}
🎯 How It Works
Visitor lands on your travel website → The frontend creates a new chat session.

Knowledge Base is Loaded → The chatbot is pre-loaded with your travel & tourism data (FAQs, package details, policies).

Visitor asks a question → The question is sent to the backend API (e.g., "How much is the Bali package?").

Backend Processes the Query:

Uses Gemini AI to find the most relevant information from the knowledge base.

Uses Gemini AI again to generate a helpful, natural-sounding answer from that context.

Saves the question, context, and answer to the database.

Answer is displayed in the chatbox → The visitor receives a quick and accurate response.

🛠️ Technology Stack
Frontend: React 19, Next.js 15, Tailwind CSS

Backend: Next.js API Routes

Database: SQLite (dev), Prisma ORM

AI: Google Gemini 2.5 Flash

Styling: Tailwind CSS 4

📖 Documentation
API_DOCUMENTATION.md - Complete API reference

SETUP_GUIDE.md - Detailed setup instructions

ARCHITECTURE.md - System architecture diagrams

🔐 Security
✅ API keys are stored securely on the server-side.

✅ Environment variables for configuration.

✅ Input validation on all API endpoints.

✅ SQL injection protection via Prisma ORM.

🚀 Production Deployment
Before deploying to a live environment:

Switch to a robust database like PostgreSQL.

Implement rate limiting to prevent abuse.

Configure CORS for your domain.

Set up monitoring and logging services (e.g., Sentry).

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

📝 License
This project is licensed under the MIT License.

Status: ✅ Ready to be deployed as a live Travel Support Chatbot.

Built with ❤️ using Next.js, Prisma, and Gemini AI