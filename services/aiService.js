/**
 * API Configuration
 * For Android emulator: Use 'http://10.0.2.2:5000/chat'
 * For iOS simulator: Use 'http://localhost:5000/chat'
 * For physical device: Use 'http://YOUR_COMPUTER_IP:5000/chat'
 */
// For Android emulator use: 'http://10.0.2.2:5000/chat'
const OLLAMA_API_URL = 'http://192.168.1.15:5000/chat';

/**
 * Sends a message to the Habit AI assistant
 * @param {string} message - The user's message
 * @param {Array} [tasks=[]] - Array of current tasks (optional)
 * @returns {Promise<string>} The AI's response
 */
// Add a small timeout helper
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function chatWithHabit(message, tasks = []) {
  // Always use tinyllama for faster responses
  const model = 'tinyllama';
  let retryCount = 0;
  const maxRetries = 2;
  const retryDelay = 1000; // 1 second

  while (retryCount <= maxRetries) {
    try {
      const prompt = `You are Habit, a friendly and supportive AI coach. Help users build good habits through positive reinforcement and practical advice. Keep responses natural, warm, and concise (1-2 sentences).

${tasks.length ? `Current tasks: ${tasks.join(", ")}\n\n` : ''}User: ${message}
Habit:`;

      console.log('Sending to Ollama:', { message, tasks });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      console.log('Sending request to:', OLLAMA_API_URL);
      
      const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({ 
          message: prompt,
          model: model
        }),
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ollama API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        if (response.status === 429) { // Too Many Requests
          const retryAfter = response.headers.get('Retry-After') || 5;
          await timeout(retryAfter * 1000);
          retryCount++;
          continue;
        }
        
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received from Ollama:', data);
      
      if (!data) {
        throw new Error('No data received from server');
      }
      
      // Handle different response formats
      if (data.success === false) {
        throw new Error(data.error || 'Request failed');
      }
      
      // Extract just the AI's response (text after 'Habit:')
      let responseText = data.response || data.text || data.message || "I'm here to help you with your habits!";
      
      // If the response contains 'Habit:', take only what's after it
      if (responseText.includes('Habit:')) {
        responseText = responseText.split('Habit:')[1].split('\n')[0].trim();
      }
      
      // If we still don't have a response, use a default message
      if (!responseText || responseText.length === 0) {
        responseText = "I'm here to help you with your habits!";
      }
      
      return String(responseText);
      
    } catch (error) {
      console.error(`Attempt ${retryCount + 1} failed:`, error);
      
      if (error.name === 'AbortError') {
        console.error('Request timed out. Please check your network connection.');
        return "The request timed out. Please check your internet connection and try again.";
      }
      
      if (retryCount === maxRetries) {
        console.error('Max retries reached. Giving up.');
        return "I'm having trouble connecting to the AI service. Please check your connection and try again.";
      }
      
      // Wait before retrying
      await timeout(retryDelay * (retryCount + 1));
      retryCount++;
    }
  }
  
  return "I'm having trouble connecting right now. Please try again in a moment.";
}

/**
 * Get a motivational quote from the AI
 * @param {string} [topic='consistency'] - The topic for the motivational quote
 * @returns {Promise<string>} A motivational quote
 */
export async function getMotivationalQuote(topic = 'consistency') {
  try {
    const response = await chatWithHabit(`Give me a very short (1-2 sentence) motivational quote about ${topic}.`);
    return response || "Every small step counts. Keep going! 💪";
  } catch (error) {
    console.error('Error getting motivational quote:', error);
    return [
      "Progress is progress, no matter how small.",
      "Small steps lead to big results.",
      "Consistency is the key to success.",
      "You're capable of amazing things!"
    ][Math.floor(Math.random() * 4)];
  }
}

/**
 * Get the current API URL (for debugging)
 * @returns {string} The current API URL
 */
export function getApiUrl() {
  return OLLAMA_API_URL;
}

/**
 * Update the API URL (for switching between environments)
 * @param {string} newUrl - The new API URL
 */
export function setApiUrl(newUrl) {
  OLLAMA_API_URL = newUrl;
  console.log('API URL updated to:', newUrl);
}
