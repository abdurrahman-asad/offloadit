# OffloadIt

**This is a WIP**

OffloadIt is a task automation platform that leverages AI-powered browser agents to handle mundane, repetitive tasks for you. Simply describe what you need done, where you want the results, and let the agent take care of the rest.

## Main Idea

We spend countless hours on repetitive browser-based tasks—filling forms, data entry, web scraping, monitoring websites, and more. OffloadIt transforms this workflow by:

- **Task Delegation**: Describe any browser-based task in natural language
- **AI-Powered Automation**: Advanced AI agents execute tasks autonomously using real browser interactions
- **Smart Notifications**: Get notified via email when tasks complete, or send results directly to Slack/Discord
- **Real-Time Tracking**: Monitor task progress and completion status through an intuitive dashboard

### Use Cases

- **Data Collection**: "Find and extract pricing information from competitor websites"
- **Form Filling**: "Fill out and submit this survey form with the provided data"
- **Web Monitoring**: "Check if a specific product is back in stock every hour"
- **Content Management**: "Post this content to multiple social media platforms"
- **Research Tasks**: "Compile a list of contact emails from company websites in this industry"

## Technical Stack

### Frontend
- React 19 + TypeScript
- Vite
- React Router 7
- Tailwind CSS 4
- Shadcn
- Lucide React icons

### Backend & Infrastructure
- **Supabase**: Auth, PostgreSQL, real-time subscriptions, Edge Functions
- **Deno**: Serverless runtime for edge functions
- **Browser Use SDK**: AI browser automation
- **Resend**: Email delivery

### Architecture

```
┌─────────────────┐
│   React App     │
│  (Vite + TS)    │
└────────┬────────┘
         │
         ├─────────── Authentication
         │            User Management
         ↓
┌─────────────────┐
│    Supabase     │
│   PostgreSQL    │
└────────┬────────┘
         │
         ├─────────── Edge Functions (Deno)
         │            
         ↓
┌─────────────────┐         ┌──────────────┐
│  create-task    │────────>│  Browser Use │
│   Function      │         │     SDK      │
└─────────────────┘         └──────────────┘
         │                          │
         │                          ↓
         │                  ┌──────────────┐
         │                  │  Claude AI   │
         │                  │   (Sonnet)   │
         │                  └──────────────┘
         ↓
┌─────────────────┐         ┌──────────────┐
│  check-status   │────────>│    Resend    │
│   Function      │         │    (Email)   │
└─────────────────┘         └──────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 22.12.0
- pnpm 9.15.4+
- Supabase account
- Browser Use API key
- Resend API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdurrahman-asad/offloadit.git
   cd offloadit
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   
   Create `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Edge Functions**
   
   Configure secrets for your functions:
   ```bash
   supabase secrets set BROWSER_USE_API_KEY=your_browser_use_key
   supabase secrets set RESEND_KEY=your_resend_key
   ```

5. **Run development server**
   ```bash
   pnpm dev
   ```

## Deployment

The application is configured for seamless deployment:
- Frontend: Optimized Vite build with Netlify redirects (`public/_redirects`)
- Backend: Supabase Edge Functions
- Environment: Node.js 22+ required
