# Prepify — AI-Driven Mock Interview Platform

Prepify is a **production-ready, full-stack mock interview platform** that leverages **Large Language Models (LLMs)** and **real-time voice agents** to simulate realistic interview scenarios. The platform enables users to practice interviews interactively, receive structured AI-generated feedback, and track performance across sessions.

🔗 **Live Demo:** https://prepify-mock-interview.vercel.app  

## Project Overview
Interview preparation tools often lack realism, adaptability, and actionable evaluation. Prepify addresses these limitations by combining modern web architecture with AI-powered reasoning and voice interaction.
The system is designed with a **scalable, modular architecture**, emphasizing clean separation of concerns, maintainability, and extensibility.

## Core Capabilities

### Authentication & User Management
- Secure user authentication using **Supabase Auth**
- Session-based access control
- User-specific interview history and metadata persistence

### AI-Powered Interview Engine
- Role- and level-specific interview question generation
- Context-aware follow-up questioning using LLMs
- Configurable interview parameters (role, experience level, tech stack)

### Real-Time Voice Interaction
- Natural, conversational interview experience via **Vapi AI**
- Speech-to-text transcription and AI-driven responses
- Event-driven handling of call lifecycle states

### Automated Feedback & Evaluation
- AI-generated qualitative feedback on user responses
- Identification of strengths, weaknesses, and improvement areas
- Consistent evaluation logic across interview sessions

### Interview History & Progress Tracking
- Persistent storage of completed interviews
- Structured interview records for future analytics
- User dashboard for reviewing past sessions

## Technology Stack
### Frontend
- **Next.js (App Router)**
- **React**
- **Tailwind CSS**
- **shadcn/ui**

### Backend & Services
- **Next.js API Routes**
- **Supabase** (Authentication & Database)
- **Groq API** (LLM-powered interview question generation and evaluation)
- **Vapi AI** (Voice agents and real-time conversation)

### Deployment
- **Vercel**


## System Architecture
Prepify follows a layered architecture:
- **Presentation Layer**  
  Server and client components rendered via Next.js for optimal performance and SEO.
- **Application Layer**  
  API routes manage interview orchestration, AI service integration, and session handling.
- **AI Layer**  
  LLMs generate interview content and evaluate responses; voice agents manage real-time conversation.
- **Data Layer**  
  Supabase stores user profiles, interview sessions, feedback, and metadata.
This architecture ensures **scalability, reliability, and ease of future enhancements**.

## Setup & Installation
### Prerequisites
- Node.js ≥ 16
- Supabase project credentials
- Groq API key
- Vapi AI API key
- 
### Installation
```bash
git clone https://github.com/Madhuri36/Prepify.git
cd Prepify
npm install
```
### Enviroment Configuration
Create a .env.local file
```bash
# Supabase (public – safe for frontend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key

# Supabase (server-only – NEVER expose)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# AI & Voice (server-only unless explicitly required)
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id
```
### Run Locally
```bash
npm run dev
```
Application will be locally available at: 
```bash
http://localhost:3000
```

Contributions are welcome. <br>
Please open an issue or submit a pull request for improvements or bug fixes.
