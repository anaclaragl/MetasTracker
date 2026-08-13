# MetasTracker

A serverless, offline-first Single Page Application (SPA) designed to manage and track daily habits, tasks (Kanban), projects, and long-term milestones with a built-in AI assistant.

---

## 🛠️ Technologies & Tools

*   **Structure:** Semantic HTML5.
*   **Styling:** Vanilla CSS3 (Retro Neo-Brutalist Design System, native variables for light/dark themes, and responsiveness).
*   **State Logic:** Asynchronous and event-driven JavaScript (ES6+).
*   **Persistence:** Browser's LocalStorage API (100% client-side storage).
*   **AI Assistant:** Google Gemini API (Interactions API using the `gemini-3.1-flash-lite` model).
*   **Icons:** FontAwesome CDN.
*   **Animations & Effects:** Canvas-Confetti (CDN) and tactile CSS transitions.

---

## ⚙️ Technical Concepts & Architecture

*   **Serverless & Offline-First Architecture:** The application runs entirely within the user's browser, enabling zero infrastructure costs and simplified static hosting.
*   **State Synchronization:** The global application state is hydrated from `localStorage` on boot and reactively synchronized with each mutation (tasks/habits/milestones CRUD).
*   **Day Rollover Routine:** Upon detecting a change in date on the user's system, the engine automatically resets daily habit completion counters while preserving and incrementing streak counts.
*   **Backup & Portability:** Complete import and export of user data via JSON serialization and deserialization files.
*   **Dynamic Visualizations:** Weekly analytics and category distribution charts are rendered programmatically using HTML and CSS, without relying on heavy external charting library dependencies.
