// LLM utility functions for RAG operations

const MAX_RETRIES = 5;
const GENERATION_MODEL = 'gemini-2.5-flash-preview-05-20';

// Utility function to perform fetch with exponential backoff
export const fetchWithRetry = async (url, options) => {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    
    const fullUrl = url.includes('?') ? `${url}&key=${apiKey}` : `${url}?key=${apiKey}`;
    
    let lastError;
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const response = await fetch(fullUrl, options);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Body: ${errorBody}`);
            }
            return response;
        } catch (error) {
            lastError = error;
            const delay = Math.pow(2, i) * 1000 + Math.random() * 500;
            if (i < MAX_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw new Error(`Fetch failed after ${MAX_RETRIES} attempts: ${lastError.message}`);
};

// Function to use the LLM to identify and extract the most relevant context chunks
export const generateContext = async (query, allChunks) => {
    const combinedChunks = allChunks.join('\n\n---\n\n');

    const retrievalPrompt = `
        Read the following entire document text provided below in the [DOCUMENT] section.
        Your task is to identify and extract ONLY the 3 to 4 most relevant paragraphs or sections 
        that directly answer the user's question. 
        
        Output only the extracted, relevant text. Do not add any commentary, summary, or prefix/suffix.

        Question: ${query}

        [DOCUMENT]
        ${combinedChunks}
        
        Extracted Relevant Text:
    `;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GENERATION_MODEL}:generateContent`;

    const payload = {
        contents: [{ parts: [{ text: retrievalPrompt }] }],
        generationConfig: {
            temperature: 0.1,
        },
    };

    const response = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || 
           "No relevant context could be extracted from the document.";
};

// Function to generate final answer using retrieved context
export const generateAnswer = async (query, context) => {
    const promptTemplate = `
        You are a helpful assistant. Use ONLY the following context to answer the user's question.
        If the answer is not in the context, state clearly and concisely that the information is not available in the provided document.
        Do not use external knowledge or make up answers.

        Context:
        ---
        ${context}
        ---

        Question: ${query}
        
        Answer:
    `;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GENERATION_MODEL}:generateContent`;

    const payload = {
        contents: [{ parts: [{ text: promptTemplate }] }],
        generationConfig: {
            temperature: 0,
        },
    };

    const response = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || 
           "Failed to get a response from the model.";
};

// Function to analyze if the answer is meaningful or if the question was unanswered
export const analyzeAnswerQuality = (answer, context) => {
    // Indicators that the question was not answered
    const unansweredPatterns = [
        /not.*available/i,
        /cannot.*find/i,
        /no.*information/i,
        /don't.*have/i,
        /unable.*to.*answer/i,
        /not.*mentioned/i,
        /not.*provided/i,
        /doesn't.*contain/i,
        /does not.*contain/i,
        /no.*relevant.*information/i,
        /cannot.*determine/i,
        /insufficient.*information/i,
        /not.*specified/i,
        /unclear/i,
        /i.*don't.*know/i,
        /sorry.*but/i
    ];

    const isUnanswered = unansweredPatterns.some(pattern => pattern.test(answer));
    
    // Calculate confidence score
    let confidence = 1.0;
    
    if (isUnanswered) {
        confidence = 0.1;
    } else if (answer.length < 20) {
        confidence = 0.4; // Very short answers might not be complete
    } else if (!context || context.length < 50) {
        confidence = 0.5; // Low context might mean unreliable answer
    } else if (answer.includes("might") || answer.includes("possibly") || answer.includes("maybe")) {
        confidence = 0.7; // Tentative language
    }
    
    return {
        wasAnswered: !isUnanswered,
        confidence,
        isUnanswered,
        needsImprovement: confidence < 0.7
    };
};

// Simple text splitter: splits the document into chunks by double newline
export const splitText = (text) => {
    return text.split('\n\n')
        .map((chunk) => chunk.trim())
        .filter(chunk => chunk.length > 0);
};
