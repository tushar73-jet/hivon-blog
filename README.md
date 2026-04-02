# Hivon Blog - AI Powered Blogging Platform

An advanced, full-stack blogging platform built for the **Hivon Automations Internship Assignment**. This platform features role-based access control, automated AI summaries, and a modern design system.

---

## 🚀 Features

-   **AI Power:** Automatic ~200-word summaries generated for every new article using **Groq (Llama 3)**.
-   **Role-Based Access Control (RBAC):**
    -   **Viewer:** Can read posts, view summaries, and comment.
    -   **Author:** Can create and edit their *own* articles.
    -   **Admin:** Full platform control (edit and delete *any* post or comment).
-   **Security:** Server-side ownership verification for every update/delete operation.
-   **Core Platform:** 
    -   Search & Pagination on Home Page.
    -   Dynamic Commenting System.
    -   Central Dashboard for editing and article management.
-   **Design:** Premium Glassmorphism UI with Dark Mode support.

---

## 🛠 Tech Stack

-   **Frontend/Backend:** Next.js (App Router)
-   **Authentication:** Supabase Auth
-   **Database:** Supabase (Postgres)
-   **AI Engine:** Groq API (Llama 3) for summaries.
-   **Styling:** Tailwind CSS (Modern Vanilla Config)

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
    GROQ_API_KEY=your_groq_api_key
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    *Note: The project uses the `--turbo` flag for maximum performance on macOS.*

---

## 💡 Technical Decisions & Submission Requirements

### 1. AI Tool Usage (Antigravity)
-   **Tool Used:** **Antigravity AI (Agentic Assistant)**.
-   **Why I chose it:** I selected Antigravity because it allows for rapid, secure iteration of full-stack code and can handle complex database relationships (Supabase) while enforcing security patterns without manual oversight. It helped troubleshoot complex Next.js caching issues in real-time.

### 2. Implementation Logic
-   **Authentication Flow:** Used a custom `requireAuthorOrAdmin` utility that checks roles on the server side *before* any action is executed.
-   **Post Creation Logic:** When a post is saved, the body is sent to the Groq API. If the API fails, the post is still saved, but a "failed" notice is stored to prevent user data loss while ensuring the UI doesn't crash.
-   **SOLID Principles:** The project follows strict **Single Responsibility** (separate action files) and **Dependency Inversion** (Supabase client abstraction).

### 3. Key Bug Resolution: The "Mac Lag" Issue
-   **The Problem:** During development on macOS, standard `next dev` caused 100% CPU spikes and typing lag in the terminal.
-   **The Fix:** I migrated the local development environment to **Next.js Turbopack** (`--turbo`) and optimized Node memory settings (`--max-old-space-size`). This completely stabilized the UI for smooth development.

### 4. Cost Optimization (AI Integration)
-   **Token Reduction Strategies:** Summaries are generated **ONLY ONCE** at the time of creation and stored permanently in the database. 
-   This avoids repeated API costs every time a reader visits the post page and significantly reduces user-perceived latency.

---

## 🧪 Database Schema
The database includes the following tables enforced by the `supabase-schema.sql`:
-   **Users:** `id`, `name`, `email`, `role`.
-   **Posts:** `id`, `title`, `body`, `image_url`, `author_id`, `summary`.
-   **Comments:** `id`, `post_id`, `user_id`, `comment_text`.

---

**Developed & Designed for Hivon Automations LLP.**
