# DocSage

DocSage is a web application that allows users to upload PDF documents, get summaries, and ask questions about the document content.

## Features

*   **PDF Upload:** Upload PDF documents for processing.
*   **Summarization:** Get a summary of the uploaded document.
*   **Question Answering:** Ask questions about the content of the uploaded document.

## Tech Stack

*   **Frontend:**
    *   React
    *   Vite
    *   React Router
*   **Backend:**
    *   Node.js
    *   Express
    *   PostgreSQL with pgvector
    *   OpenAI API (`gpt-3.5-turbo`, `text-embedding-ada-002`)
*   **Other:**
    *   `pdf-parse` for text extraction from PDFs
    *   `multer` for file uploads

## Setup and Installation

### Prerequisites

*   Node.js
*   npm
*   PostgreSQL

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and add the following environment variables:
    ```
    PORT=5000
    PGVECTOR_DATABASE_URL=your_postgresql_connection_string
    OPENAI_API_KEY=your_openai_api_key
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```

### Frontend Setup

1.  Navigate to the root project directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```

## API Endpoints

*   `POST /api/upload`: Uploads a PDF file. The server extracts the text, creates embeddings, and stores them in the database.
*   `GET /api/summary/:id`: Retrieves a summary for the given document ID. If a summary doesn't exist, it's generated using the OpenAI API and stored in the database.

## Database Schema

The database consists of two tables:

### `documents`

| Column    | Type    | Description                                  |
| --------- | ------- | -------------------------------------------- |
| `id`      | SERIAL  | Primary Key                                  |
| `filename`| TEXT    | The name of the uploaded file.               |
| `text`    | TEXT    | The full text extracted from the PDF.        |
| `summary` | TEXT    | The generated summary of the document.       |

### `chunks`

| Column      | Type        | Description                                  |
| ----------- | ----------- | -------------------------------------------- |
| `id`        | SERIAL      | Primary Key                                  |
| `doc_id`    | INTEGER     | Foreign key referencing the `documents` table. |
| `content`   | TEXT        | A chunk of text from the document.           |
| `embedding` | VECTOR(1536)| The embedding vector for the content.         |