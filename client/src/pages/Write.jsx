import React, { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../context/authContext";
import AIChatbox from "../components/AIChatbox";

/**
 * Write Component - Enhanced Article Creation Page with AI Writing Assistant
 * 
 * This component provides a comprehensive article writing interface enhanced with
 * AI-powered writing assistance using Google's Gemini AI model.
 * 
 * Key Features:
 * 1. Rich text editor with ReactQuill for article content
 * 2. Image upload functionality for article thumbnails
 * 3. Category selection for article classification
 * 4. AI Writing Assistant chatbox for content suggestions and improvements
 * 5. Responsive design for all device types
 * 6. User authentication integration
 * 7. Create new articles or edit existing ones
 * 
 * AI Writing Assistant Features:
 * - Real-time writing suggestions and improvements
 * - Content generation for article ideas and outlines
 * - Grammar and style recommendations
 * - Direct content application to the editor
 * - Context-aware assistance based on user queries
 */
const Write = () => {
  // Get state from router for editing existing articles
  const state = useLocation().state;
  
  // Core article content state management
  const [value, setValue] = useState(state?.desc || ""); // Article content (rich text)
  const [title, setTitle] = useState(state?.title || ""); // Article title
  const [file, setFile] = useState(null); // Uploaded image file
  const [cat, setCat] = useState(state?.cat || ""); // Selected category
  
  // AI Chatbox state - controls visibility of the AI assistant
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  
  // Loading state for publish button
  const [isPublishing, setIsPublishing] = useState(false);

  // Navigation and authentication hooks
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  /**
   * Upload image file to server
   * Handles image upload for article thumbnails
   * @returns {string} URL of uploaded image
   */
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
    }
  };

  /**
   * Handle article publication or update
   * Creates new article or updates existing one based on state
   * Includes image upload and user authentication validation
   */
  const handleClick = async (e) => {
    e.preventDefault();

    // Prevent double-clicking
    if (isPublishing) return;

    // Ensure user is authenticated before allowing publication
    if (!currentUser) {
      alert("Please log in to publish.");
      return;
    }

    // Validate required fields
    if (!title.trim()) {
      alert("Please enter a title for your post.");
      return;
    }

    if (!value.trim()) {
      alert("Please add some content to your post.");
      return;
    }

    if (!cat) {
      alert("Please select a category for your post.");
      return;
    }

    setIsPublishing(true);

    try {
      // Upload image if file is selected, otherwise use existing image URL
      const imgUrl = file ? await upload() : state?.img || "";

      if (state) {
        // Update existing article
        await api.put(`/posts/${state.id}`, {
          title,
          desc: value,
          cat,
          img: imgUrl,
        });
        alert("Post updated successfully!");
      } else {
        // Create new article with current timestamp
        await api.post(`/posts/`, {
          title,
          desc: value,
          cat,
          img: imgUrl,
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        });
        alert("Post published successfully!");
      }

      // Navigate back to home page after successful publication
      navigate("/");
    } catch (err) {
      console.error("Error publishing post:", err);
      
      // Show user-friendly error message
      if (err.response?.data?.message) {
        alert("Error publishing post: " + err.response.data.message);
      } else if (err.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        alert("You don't have permission to perform this action.");
      } else {
        alert("An error occurred while publishing your post. Please try again.");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  /**
   * AI Suggestion Application Handler
   * 
   * This function handles the integration between the AI chatbox and the article editor.
   * When users click "Apply to Editor" in the AI chatbox, this function processes
   * the AI-generated content and inserts it into the article.
   * 
   * Features:
   * - Seamless content integration from AI suggestions
   * - Preserves existing content by appending new suggestions
   * - Handles both empty editors and editors with existing content
   * - Maintains proper formatting and spacing
   * 
   * @param {string} suggestion - AI-generated content to be added to the article
   */
  const handleAISuggestion = (suggestion) => {
    // Check if there's existing content in the editor
    if (value) {
      // Append AI suggestion to existing content with proper spacing
      setValue(value + "\n\n" + suggestion);
    } else {
      // Set AI suggestion as the initial content
      setValue(suggestion);
    }
  };

  /**
   * Toggle AI Chatbox Visibility
   * Controls the open/closed state of the AI writing assistant
   * Only available for authenticated users
   */
  const toggleChatbox = () => {
    // Check if user is authenticated before allowing AI access
    if (!currentUser) {
      alert("Please log in to access the AI Writing Assistant.");
      return;
    }
    setIsChatboxOpen(!isChatboxOpen);
  };

  return (
    <div className="add">
      {/* Main Content Area - Article Editor */}
      <div className="content">
        {/* Title Input with AI Assistant Toggle Button */}
        <div className="title-with-ai">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!currentUser}
          />
          {/* AI Assistant Toggle Button - Only visible for authenticated users */}
          {currentUser && (
            <button 
              className="ai-toggle-btn"
              onClick={toggleChatbox}
              title="Toggle AI Writing Assistant - Get help with ideas, improvements, and content generation"
            >
              🤖 AI Assistant
            </button>
          )}
          {/* Informational message for non-logged-in users */}
          {!currentUser && (
            <div className="ai-login-prompt">
              <span title="Log in to access AI Writing Assistant with content generation, grammar help, and writing suggestions">
                🤖 AI Assistant (Login Required)
              </span>
            </div>
          )}
        </div>
        
        {/* Rich Text Editor Container */}
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
            readOnly={!currentUser}
          />
        </div>
      </div>

      {/* Sidebar Menu - Publication Controls and Category Selection */}
      <div className="menu">
        {/* Publication Controls */}
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          {/* Hidden file input for image upload */}
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            disabled={!currentUser}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className={`file ${!currentUser ? "disabled" : ""}`} htmlFor="file">
            Upload Image
          </label>
          <div className="buttons">
            <button disabled={!currentUser || isPublishing}>Save as a draft</button>
            <button onClick={handleClick} disabled={!currentUser || isPublishing}>
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          </div>
          {/* Authentication prompt for non-logged-in users */}
          {!currentUser && <h3 style={{ color: "crimson" }}>Please Log in to write and publish posts.</h3>}
        </div>

        {/* Category Selection */}
        <div className="item">
          <h1>Category</h1>
          {/* Available article categories */}
          {[ "futurology","science", "technology","philosophy"].map((c) => (
            <div className="cat" key={c}>
              <input
                type="radio"
                checked={cat === c}
                name="cat"
                value={c}
                id={c}
                onChange={(e) => setCat(e.target.value)}
                disabled={!currentUser}
              />
              <label htmlFor={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</label>
            </div>
          ))}
        </div>
      </div>

      {/* 
        AI Writing Assistant Chatbox - Only available for authenticated users
        
        This component provides intelligent writing assistance using Google's Gemini AI.
        Key features include:
        
        1. Content Generation: Ask for article ideas, outlines, or full content
        2. Writing Improvement: Get suggestions for better phrasing, grammar, and style
        3. Interactive Chat: Natural conversation interface for writing assistance
        4. Direct Integration: Apply AI suggestions directly to the article editor
        5. Responsive Design: Works seamlessly across all device types
        
        Usage Examples:
        - "Give me ideas for an article about artificial intelligence"
        - "Improve this paragraph: [paste your text]"
        - "Create an outline for a technology article"
        - "Suggest a better conclusion for my article"
        - "Help me write an engaging introduction about science"
        
        The chatbox appears as a floating overlay that doesn't interfere with the
        writing process while providing instant access to AI assistance.
        
        Restricted to authenticated users only for security and usage tracking.
      */}
      {currentUser && (
        <AIChatbox
          isOpen={isChatboxOpen}
          onToggle={toggleChatbox}
          onSuggestionApply={handleAISuggestion}
        />
      )}
    </div>
  );
};

export default Write;