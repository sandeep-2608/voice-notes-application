# 🎤 Voice Notes with AI Summarization

A full-stack MERN application that enables users to record voice notes, transcribe them using Web Speech API, and generate AI-powered summaries using free GenAI APIs (Google Gemini & Groq).

## ✨ Features

- 🎙️ **Voice Recording**: Record notes directly in browser using Web Speech API
- 📝 **Real-time Transcription**: Automatic speech-to-text conversion
- 🤖 **AI Summarization**: Generate summaries using Google Gemini & Groq APIs
- ✏️ **CRUD Operations**: Create, read, update, and delete voice notes
- 🔄 **Smart Summary Logic**: Summary clears when transcript is edited (as per requirements)
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🆓 **Free APIs**: Uses only free-tier AI services

## 🛠 Tech Stack

### Backend

- **Node.js** + **Express.js** - Server and API
- **MongoDB** + **Mongoose** - Database and ODM
- **Google AI Studio** - Gemini 1.5 Flash API for summarization
- **Groq** - Llama 3.1 API as fallback
- **Axios** - HTTP client for AI API calls

### Frontend

- **React.js** - User interface with functional components and hooks
- **Axios** - API communication
- **Web Speech API** - Browser-native voice recognition
- **CSS3** - Modern styling and responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Modern browser (Chrome, Safari, or Edge for voice features)
- Free API keys from Google AI Studio and Groq

### 1. Clone Repository

git clone https://github.com/sandeep-2608/voice-notes-application.git
cd voice-notes-application

### 2. Install Dependencies

Install all dependencies (both frontend and backend)
npm install

### 3. Environment Setup

    Copy environment files
    Create .env

    Edit `.env` file with your configuration:
    Database
    MONGODB_URI=mongodb://localhost:27017/voicenotes

    AI APIs (Get these for free)
    GOOGLE_AI_API_KEY=your_google_ai_studio_key
    GROQ_API_KEY=your_groq_api_key

    Server
    PORT=5000
    NODE_ENV=development

    Frontend (for production)
    REACT_APP_API_URL=/api

### 4. Get Free API Keys

#### Google AI Studio (Primary - Recommended)

    Visit [Google AI Studio](https://aistudio.google.com)

#### Groq (Fallback)

    Visit [Groq Console](https://console.groq.com)

### 5. Run Locally

npm run server # Backend only
npm run client # Frontend only

Visit `http://localhost:3000` to see the app running.

## 📝 How to Use

1. **Record Voice Note**:

   - Click "Start Recording" button
   - Speak your note (transcript appears in real-time)
   - Click "Stop Recording" to finish

2. **Save Note**:

   - Review the transcript
   - Click "Save Note" to store it

3. **Generate AI Summary**:

   - Click "Generate Summary" on any saved note
   - AI will create a concise summary
   - Button becomes disabled until you edit the note

4. **Edit Notes**:

   - Click "Edit" to modify title or content
   - Editing transcript clears existing summary (as per requirements)

5. **Delete Notes**:
   - Click "Delete" to remove notes
   - Confirm deletion in popup

## 🔧 API Endpoints

### Voice Notes

- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/summary` - Generate AI summary
