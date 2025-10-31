import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Configure CORS
const corsOptions = {
  origin: [
    'http://localhost:19006',  // Expo web
    'http://localhost:19000',  // Expo dev tools
    'exp://*',                 // All Expo apps
    'http://*',                // Any HTTP request (for testing)
    'https://*',               // Any HTTPS request
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.post('/chat', async (req, res) => {
  const { message, model = 'tinyllama' } = req.body;  // Default to tinyllama if not specified
  
  if (!message) {
    return res.status(400).json({
      success: false,
      error: 'Message is required'
    });
  }
  
  // List of allowed models
  const allowedModels = ['tinyllama', 'mistral-small:22b', 'llama3:latest', 'llama2:70b'];
  if (!allowedModels.includes(model)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid model specified',
      availableModels: allowedModels
    });
  }

  try {
    console.log('Received message:', message);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000); // 45 second timeout

    console.log(`Using model: ${model}`);
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: model,  // Use the specified model
        prompt: message,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: model === 'tinyllama' ? 100 : 200  // Allow more tokens for larger models
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Ollama API error:', error);
      throw new Error(`Ollama API error: ${error}`);
    }

    const data = await response.json();
    console.log('Ollama response:', JSON.stringify(data, null, 2));

    res.json({
      success: true,
      response: data.response || data.text || 'No response from model',
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    
    if (error.name === 'AbortError') {
      return res.status(504).json({
        success: false,
        error: 'Request to Ollama timed out. The model might be loading or busy.'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to process your request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET  /health',
      'POST /chat'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`- Health check: http://localhost:${PORT}/health`);
  console.log(`- Chat endpoint: POST http://localhost:${PORT}/chat`);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
