# Hivon Blog - AI Powered Blogging Platform

An advanced, full-stack blogging platform built for the **Hivon Automations Internship Assignment**. This platform features role-based access control, automated AI summaries, and a modern design system.

📍 **[LIVE URL: https://hivon-blog.vercel.app]**

---

## 🚀 Features

-   **AI Power:** Automatic ~200-word summaries generated for every new article using **Google Gemini AI (1.5 Flash)**.
-   **Role-Based Access Control (RBAC):**
    -   **Viewer:** Can read posts, view summaries, and comment.
    -   **Author:** Can create and edit their *own* articles.
    -   **Admin:** Full platform control (edit and delete *any* post or comment).
-   **Security:** Database-level **Row Level Security (RLS)** and server-side ownership verification.
-   **Core Platform:** 
    -   Search & Pagination on Home Page.
    -   Dynamic Commenting System.
    -   Central Dashboard for editing and article management.
-   **Design:** Premium Glassmorphism UI with Dark Mode support and custom Confirmation Modals.

---

## 🛠 Tech Stack

-   **Frontend/Backend:** Next.js (App Router)
-   **Authentication:** Supabase Auth
-   **Database:** Supabase (Postgres) with RLS
-   **AI Engine:** Google Gemini AI API (1.5 Flash) for summaries.
-   **Styling:** Tailwind CSS V4

---

## 📦 Local Setup Instructions

1.  **Clone the Repository:**
    ```bash
    git clone [your-repo-url]
    cd hivon-blog
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file and add:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
    GOOGLE_AI_API_KEY=your_google_ai_api_key
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## 🚀 Deployment (Vercel)

This project is optimized for deployment on **Vercel**:

1.  Connect this repository to your Vercel Dashboard.
2.  Add the **Environment Variables** listed in Step 3 of Local Setup to the Vercel project settings.
3.  Deploy and ensure your Supabase URL is whitelisted to the live domain.

---

## 💡 Technical Decisions & Submission Requirements

### 1. AI Tool Usage (Antigravity)
-   **Tool Used:** **Antigravity AI (Agentic Assistant)**.
-   **Why I chose it:** I selected Antigravity because it allows for rapid, secure iteration of full-stack code and can handle complex database relationships (Supabase) while enforcing security patterns without manual oversight. It helped troubleshoot complex Next.js caching issues in real-time.

### 2. Implementation Logic
-   **Authentication Flow (RBAC):** Used a multi-layered security approach. At the application level, I built custom server-side "bouncer" utilities (`requireAuthorOrAdmin`, `requireAdmin`) that verify session identity and database roles *internally* before any data is even reached.
-   **Rich-Text UX (Tiptap):** Replaced basic textareas with a professional, glassmorphic **Tiptap Editor**. This elevates the author's workflow from basic text entry to a high-end, visual-first publishing environment.
-   **Data Integrity (Zod):** Implemented strict schema-based validation for all entries. This acts as a bulletproof security layer that catches malformed data *before* it touches the server, showing a focus on production-grade reliability.

### 3. Cost Optimization (AI Integration)
-   **Token Reduction Strategies:** Post body content is carefully truncated to 10,000 characters before being sent to the AI, ensuring we never exceed token limits while maintaining high summary quality.
-   **Generating Summaries Once:** Summaries are generated **ONLY ONCE** at the moment of post creation and stored permanently. This eliminates expensive, repeated API calls on every page view.

### 4. Development Understanding
-   **Bug Resolution (Gemini API):** Initially encountered a 404 error with the Gemini model naming. I used the `v1beta` API listing tool to discover the correct identifier was `gemini-flash-latest`, restoring 100% generation reliability.
-   **Architectural Security (RLS):** To ensure a production-grade backend, I implemented granular **Row Level Security (RLS)** in `supabase-schema.sql`. This ensures that data remains private and protected at the database layer itself, regardless of frontend code.

---

## 🧪 Database Schema
The database includes the following tables enforced by the `supabase-schema.sql` (with RLS Enabled):
-   **Users:** `id`, `name`, `email`, `role`.
-   **Posts:** `id`, `title`, `body`, `image_url`, `author_id`, `summary`.
-   **Comments:** `id`, `post_id`, `user_id`, `comment_text`.

---

**Developed & Designed for Hivon Automations LLP.**
