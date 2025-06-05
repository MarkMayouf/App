import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AIChatbox Component - AI Writing Assistant for Article Creation
 * 
 * This component provides an intelligent writing assistant that helps users create better articles
 * using Google's Gemini AI. It offers suggestions, improvements, and content generation.
 * 
 * Features:
 * - Real-time AI suggestions and writing help
 * - Content generation for articles
 * - Grammar and style improvements
 * - Direct integration with the article editor
 * - Responsive design for all devices
 * 
 * @param {Function} onSuggestionApply - Callback to apply AI suggestions to the editor
 * @param {boolean} isOpen - Controls chatbox visibility
 * @param {Function} onToggle - Callback to toggle chatbox open/closed state
 */
const AIChatbox = ({ onSuggestionApply, isOpen, onToggle }) => {
  // State management for chat messages with initial welcome message
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m here to help you write amazing articles. You can ask me to:\n• Generate ideas for your topic\n• Improve your writing\n• Create outlines\n• Suggest better phrases\n• Help with grammar and style\n\nWhat would you like help with today?'
    }
  ]);
  
  // State for user input and loading status
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Reference for auto-scrolling to newest messages
  const messagesEndRef = useRef(null);

  /**
   * Auto-scroll to the bottom of messages when new messages are added
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Send user message to AI and get response
   * Uses Google Gemini Pro model for intelligent article writing assistance
   */
  const sendMessage = async () => {
    // Validation: Don't send empty messages or when already loading
    if (!input.trim() || isLoading) return;

    // Get API key from environment variables
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY 
    
    // Check if API key is configured
    if (!apiKey) {
      const errorMessage = { 
        role: 'assistant', 
        content: 'API key not configured. Please add REACT_APP_GEMINI_API_KEY to your environment variables.' 
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Initialize Google Generative AI with API key
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      // Create a specialized prompt for article writing assistance
      const prompt = `You are an AI writing assistant helping users create better articles. 
      The user asked: "${input}"
      
      Please provide helpful, concise advice for article writing. Keep responses practical and actionable.
      If the user asks for content generation, provide high-quality, original content.
      If they ask for improvements, be specific about what could be better.
      Focus on clarity, engagement, and readability.`;

      // Generate AI response
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Add AI response to chat
      const assistantMessage = { role: 'assistant', content: text };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Handle API errors gracefully
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please check your internet connection and try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle keyboard shortcuts in the input field
   * Enter = Send message, Shift+Enter = New line
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * Apply AI suggestion directly to the article editor
   * @param {string} content - The AI-generated content to apply
   */
  const applyToEditor = (content) => {
    onSuggestionApply(content);
  };

  /**
   * Clear chat history and reset to initial state
   */
  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Hi! I\'m here to help you write amazing articles. What would you like help with today?'
    }]);
  };

  // Don't render if chatbox is closed
  if (!isOpen) return null;

  return (
    <div className="ai-chatbox">
      {/* Chatbox Header with controls */}
      <div className="chatbox-header">
        <h3>AI Writing Assistant</h3>
        <div className="header-controls">
          <button onClick={clearChat} className="clear-btn" title="Clear chat">
            🗑️
          </button>
          <button onClick={onToggle} className="close-btn" title="Close">
            ✕
          </button>
        </div>
      </div>

      {/* Messages Container - Scrollable chat area */}
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">
              {message.content}
              {/* Show "Apply to Editor" button for AI responses longer than 50 characters */}
              {message.role === 'assistant' && message.content.length > 50 && (
                <button 
                  className="apply-btn"
                  onClick={() => applyToEditor(message.content)}
                  title="Apply this suggestion to your article"
                >
                  Apply to Editor
                </button>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading indicator with animated typing dots */}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section - User message input and send button */}
      <div className="input-section">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask for writing help... (Press Enter to send, Shift+Enter for new line)"
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage} 
          disabled={isLoading || !input.trim()}
          className="send-btn"
          title="Send message"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default AIChatbox; 