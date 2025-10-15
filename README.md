# 🤖 Gemini RAG Q&A System

A modern, production-ready RAG (Retrieval-Augmented Generation) Q&A application with a complete backend API, database persistence, and beautiful UI.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?logo=react)
![Prisma](https://img.shields.io/badge/Prisma-6.1-2D3748?logo=prisma)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?logo=google)

## ✨ Features

### 🎨 Beautiful UI
- **Floating Chatbox**: Elegant chatbox in the bottom-right corner
- **Information Page**: Beautiful gradient background with system information
- **Responsive Design**: Works on all screen sizes
- **Modern Aesthetics**: Purple/pink gradient theme with smooth animations

### 🔧 Complete Backend
- **REST API**: 8 comprehensive endpoints for all operations
- **Database Persistence**: All sessions and queries saved to database
- **Session Tracking**: Full session management with query history
- **Performance Monitoring**: Processing time tracked for each query

### 🧠 AI-Powered
- **LLM-as-Retriever**: Uses Gemini AI for both retrieval and generation
- **Context Grounding**: Answers strictly based on document content
- **Smart Extraction**: Automatically identifies 3-4 most relevant paragraphs
- **Retry Logic**: Exponential backoff with up to 5 retry attempts

### 📊 Analytics
- **Query History**: All Q&A pairs stored with context
- **Error Logging**: Failed queries tracked with error messages
- **Performance Metrics**: Processing time for every query
- **Database UI**: Visual database browser with Prisma Studio

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Update `.env` file with your Gemini API key:
   ```env
   DATABASE_URL="file:./dev.db"
   GEMINI_API_KEY="your-api-key-here"
   ```

3. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
unthinkable-master/
├── app/
│   ├── api/                    # Backend REST API
│   │   ├── sessions/           # Session management endpoints
│   │   ├── query/              # Query processing endpoints
│   │   └── document/           # Document loading endpoints
│   ├── page.js                 # Main UI (chatbox & info page)
│   ├── layout.js               # App layout
│   └── globals.css             # Global styles
├── lib/
│   ├── db.js                   # Prisma database client
│   └── llm.js                  # LLM utility functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── dev.db                  # SQLite database (generated)
├── .env                        # Environment variables
├── package.json                # Dependencies
├── API_DOCUMENTATION.md        # API reference
├── SETUP_GUIDE.md             # Detailed setup guide
├── ARCHITECTURE.md            # System architecture
└── README.md                   # This file
```

## 🔌 API Endpoints

### Session Management
- `POST /api/sessions` - Create new session
- `GET /api/sessions` - List all sessions
- `GET /api/sessions/[id]` - Get specific session
- `PATCH /api/sessions/[id]` - Update session
- `DELETE /api/sessions/[id]` - Delete session

### Document Management
- `POST /api/document/load` - Load and index document

### Query Processing
- `POST /api/query` - Process RAG query
- `GET /api/query?sessionId=xxx` - Get query history

**See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API reference.**

## 💾 Database Schema

### Session Table
```sql
Session {
  id              String (Primary Key)
  documentChunks  Int
  isActive        Boolean
  createdAt       DateTime
  updatedAt       DateTime
  queries         Query[]
}
```

### Query Table
```sql
Query {
  id              String (Primary Key)
  sessionId       String (Foreign Key)
  question        String
  context         String
  answer          String
  processingTime  Int
  errorMessage    String?
  isLoading       Boolean
  createdAt       DateTime
}
```

## 🧪 Testing

### Test the API
```bash
node test-api.js
```

### View Database
```bash
npx prisma studio
```
Opens at http://localhost:5555

### Example API Call
```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"documentChunks": 0}'
```

## 🎯 How It Works

1. **User opens the app** → Frontend creates a session
2. **Document is loaded** → Split into chunks, saved to database
3. **User asks a question** → Sent to backend API
4. **Backend processes**:
   - Uses LLM to extract relevant context
   - Uses LLM to generate answer from context
   - Saves query to database
5. **Answer displayed** → User sees the response
6. **Everything persisted** → All data saved for analytics

## 🛠️ Technology Stack

- **Frontend**: React 19, Next.js 15, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (dev), Prisma ORM
- **AI**: Google Gemini 2.5 Flash
- **Styling**: Tailwind CSS 4

## 📖 Documentation

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture diagrams
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation overview

## 🔐 Security

- ✅ API keys stored server-side only
- ✅ Environment variable configuration
- ✅ Input validation on all endpoints
- ✅ SQL injection protection (Prisma ORM)
- ✅ Sanitized error messages

## 📈 Performance

- **Retry Logic**: Exponential backoff (up to 5 attempts)
- **Performance Tracking**: All queries timed
- **Error Logging**: Comprehensive error tracking
- **Database Indexes**: Optimized queries

## 🚀 Production Deployment

Before deploying to production:

1. **Switch to PostgreSQL**
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/db"
   ```

2. **Add Redis for caching**
3. **Implement rate limiting**
4. **Add user authentication**
5. **Configure CORS properly**
6. **Set up monitoring (e.g., Sentry)**
7. **Enable connection pooling**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Database with [Prisma](https://www.prisma.io/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For questions or issues:
1. Check the [documentation files](./API_DOCUMENTATION.md)
2. Run `npx prisma studio` to inspect database
3. Check browser console for errors
4. Review server logs

---

**Status**: ✅ Production Ready

Built with ❤️ using Next.js, Prisma, and Gemini AI
