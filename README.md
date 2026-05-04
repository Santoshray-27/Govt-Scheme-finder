# 🇮🇳 YojanaSetu (योजनासेतु)

**Bridging the Gap between Citizens and Government Welfare.**

YojanaSetu is a sophisticated, AI-powered platform designed to help Indian citizens discover, understand, and access government schemes tailored specifically to their demographic and socio-economic profiles. Leveraging advanced **Retrieval-Augmented Generation (RAG)** and **Semantic Search**, it simplifies the complex landscape of 3,400+ central and state government schemes.

---

## ✨ Key Features

-   **🤖 AI-Powered Recommendations**: Uses Gemini AI embeddings to match user profiles with relevant schemes using semantic similarity (cosine similarity).
-   **👤 Smart Profiling**: Create and manage multiple profiles (e.g., for self, family, or business) to get personalized results.
-   **🔍 Comprehensive Directory**: Access a searchable database of 3,400+ schemes across various ministries and categories.
-   **📊 Modern Dashboard**: A premium, high-performance UI built with React and Framer Motion for smooth interactions.
-   **⚡ Real-time Filtering**: Instant search and filter by category, state, level (Central/State), and target groups.
-   **🔐 Secure & Private**: JWT-based authentication with OTP verification.

---

## 🚀 Tech Stack

### Frontend
-   **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Data Fetching**: [React Query](https://tanstack.com/query/latest)
-   **Icons**: [Lucide React](https://lucide.dev/)

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   **AI Engine**: [Google Gemini AI](https://ai.google.dev/) (Generative AI & Embeddings)
-   **Auth**: [JWT](https://jwt.io/) & [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
-   **Workflow**: [Turborepo](https://turbo.build/) (Monorepo Management)

---

## 📂 Project Structure

```text
YojnaSetu/
├── apps/
│   ├── frontend/       # React + Vite Application
│   └── backend/        # Express + Node.js API
├── packages/
│   └── shared/         # Shared TypeScript types and utilities
├── turbo.json          # Turborepo configuration
├── package.json        # Root workspace configuration
└── tsconfig.json       # Base TypeScript config
```

---

## 🛠️ Getting Started

### Prerequisites
-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
-   [Gemini AI API Key](https://aistudio.google.com/app/apikey) (Optional, for AI recommendations)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Santoshray-27/Govt-Scheme-finder.git
    cd YojnaSetu
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in `apps/backend/`:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/yojanasetu
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Seed Data**:
    Import the initial schemes data and generate AI embeddings:
    ```bash
    # In the root directory
    npm run seed -w @yojana/backend
    npm run generate-embeddings -w @yojana/backend
    ```

### Running the App

Start the development server for both frontend and backend simultaneously:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## 🧠 AI Architecture (RAG)

YojanaSetu uses a **Retrieval-Augmented Generation (RAG)** approach to provide accurate recommendations:

1.  **Embedding**: Every scheme in the database is converted into a high-dimensional vector using `gemini-embedding-001`.
2.  **User Profile Vectorization**: When a user updates their profile, their attributes are synthesized into a descriptive text and converted into a vector.
3.  **Similarity Search**: The system performs a **Cosine Similarity** search between the user's vector and the scheme vectors to find the most relevant matches.
4.  **Ranking**: Schemes are ranked by their similarity score, providing a "Match Percentage" to the user.

---

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for a better India.**
