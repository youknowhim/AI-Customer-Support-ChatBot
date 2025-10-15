"use client";
import { documentData } from "@/base";
import BackgroundInfo from "@/components/BackgroundInfo";
import Chatbox from "@/components/Chatbox";
import { useCallback, useEffect, useRef, useState } from "react";

// --- Component Start ---
export default function Home() {
  const [documentText, setDocumentText] = useState(documentData.data);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("Initializing session and loading document...");
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const [isDocumentIndexed, setIsDocumentIndexed] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);
  const [documentChunks, setDocumentChunks] = useState(0);
  const [currentQueryId, setCurrentQueryId] = useState(null);
  const [showConfidence, setShowConfidence] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [messages, setMessages] = useState([]); // Chat conversation history
  const [feedbackGiven, setFeedbackGiven] = useState({}); // Track feedback per message
  const messagesEndRef = useRef(null); // Ref for auto-scroll

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Core RAG Functions (Using Backend API) ---

  // Create a new session on component mount
  useEffect(() => {
    const createSessionAndLoadDoc = async () => {
      try {
        // Step 1: Create session
        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentChunks: 0 })
        });
        
        const data = await response.json();
        if (data.success) {
          const newSessionId = data.data.id;
          setSessionId(newSessionId);
          console.log('Session created:', newSessionId);
          
          // Step 2: Load document immediately after session creation
          if (documentText.trim()) {
            setIsLoading(true);
            setResponse("Loading and indexing document...");
            
            const loadResponse = await fetch('/api/document/load', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionId: newSessionId,
                documentText
              })
            });

            const loadData = await loadResponse.json();
            
            if (loadData.success) {
              setDocumentChunks(loadData.data.documentChunks);
              setIsDocumentIndexed(true);
              setResponse(loadData.data.message);
              // Add system message to chat
              setMessages([{
                type: 'system',
                text: `✅ Document loaded successfully! ${loadData.data.documentChunks} chunks ready. You can now ask questions.`,
                timestamp: new Date()
              }]);
            } else {
              setResponse(`Error: ${loadData.error}`);
              setIsDocumentIndexed(false);
            }
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error creating session or loading document:', error);
        setResponse(`Error: ${error.message}`);
        setIsLoading(false);
      }
    };

    createSessionAndLoadDoc();
  }, []); // Run once on mount

  const handleLoadDocument = useCallback(async () => {
    if (!documentText.trim()) {
      setResponse("Please paste content into the document area before loading.");
      return;
    }

    if (!sessionId) {
      setResponse("Session not ready. Please wait...");
      return;
    }
    
    setIsLoading(true);
    setResponse("Loading and indexing document...");
    setIsDocumentIndexed(false);
    
    try {
      const response = await fetch('/api/document/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          documentText
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setDocumentChunks(data.data.documentChunks);
        setIsDocumentIndexed(true);
        setResponse(data.data.message);
      } else {
        setResponse(`Error: ${data.error}`);
        setIsDocumentIndexed(false);
      }
    } catch (error) {
      console.error("Error loading document:", error);
      setResponse(`Error loading document: ${error.message}`);
      setIsDocumentIndexed(false);
    } finally {
      setIsLoading(false);
    }
  }, [documentText, sessionId]);

  const handleQuery = useCallback(async () => {
    if (!isDocumentIndexed) {
      setResponse("Please load and index a document first.");
      return;
    }
    if (!query.trim()) {
      setResponse("Please enter a question.");
      return;
    }
    if (!sessionId) {
      setResponse("Session not ready. Please wait...");
      return;
    }

    // Add user message to chat
    const userMessage = {
      type: 'user',
      text: query.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Clear input immediately
    const currentQuery = query.trim();
    setQuery("");

    setIsLoading(true);
    
    // Add loading message
    const loadingMessage = {
      type: 'assistant',
      text: 'Thinking...',
      isLoading: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          question: currentQuery,
          documentText
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove loading message and add actual response
        setMessages(prev => {
          const withoutLoading = prev.filter(msg => !msg.isLoading);
          return [...withoutLoading, {
            type: 'assistant',
            text: data.data.answer,
            queryId: data.data.queryId,
            confidence: data.data.confidence,
            isUnanswered: data.data.isUnanswered,
            needsImprovement: data.data.needsImprovement,
            timestamp: new Date()
          }];
        });
        
        setCurrentQueryId(data.data.queryId);
        setConfidenceScore(data.data.confidence);
        setShowConfidence(data.data.isUnanswered || data.data.needsImprovement);
        setQueryHistory(prev => [...prev, {
          queryId: data.data.queryId,
          question: data.data.question,
          answer: data.data.answer,
          processingTime: data.data.processingTime,
          confidence: data.data.confidence,
          isUnanswered: data.data.isUnanswered
        }]);
      } else {
        // Remove loading and show error
        setMessages(prev => {
          const withoutLoading = prev.filter(msg => !msg.isLoading);
          return [...withoutLoading, {
            type: 'error',
            text: `Error: ${data.error}`,
            timestamp: new Date()
          }];
        });
      }
    } catch (error) {
      console.error("Error during query:", error);
      // Remove loading and show error
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        return [...withoutLoading, {
          type: 'error',
          text: `An error occurred: ${error.message}`,
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  }, [isDocumentIndexed, query, sessionId, documentText]);

  // Function to submit user feedback
  const handleFeedback = useCallback(async (queryId, feedback) => {
    if (!queryId) return;

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryId,
          feedback
        })
      });

      const data = await response.json();
      if (data.success) {
        // Mark feedback as given for this query
        setFeedbackGiven(prev => ({...prev, [queryId]: feedback}));
        console.log('Feedback submitted:', feedback);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  }, []);

  // --- UI Rendering ---
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Background Information Page */}
      <BackgroundInfo />

      {/* Floating Chatbox */}
      <Chatbox
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        isDocumentIndexed={isDocumentIndexed}
        documentChunks={documentChunks}
        messages={messages}
        messagesEndRef={messagesEndRef}
        feedbackGiven={feedbackGiven}
        handleFeedback={handleFeedback}
        query={query}
        setQuery={setQuery}
        handleQuery={handleQuery}
        isLoading={isLoading}
      />
    </div>
  );
}
