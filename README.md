# Notice Board

A full-stack Notice Board application built with Next.js (Pages Router), Prisma, and Tailwind CSS.

## Features
- **Create, Read, Update, Delete (CRUD)** operations for notices.
- **Urgent First Ordering:** Urgent notices always appear at the top, sorted via Prisma `orderBy`.
- **Responsive Design:** Beautiful, mobile-friendly UI using Tailwind CSS.
- **Image Support:** Optional image URLs can be added to notices.

## How to run the project locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Database Setup:**
   By default, this project is configured to use SQLite for local development. 
   - Initialize the database and run migrations:
     ```bash
     npx prisma migrate dev --name init
     ```
   
   *Note for Vercel Deployment: You MUST switch the database provider to `postgresql` or `mysql` in `prisma/schema.prisma` and provide a hosted database `DATABASE_URL` in your `.env` file before deploying, as Vercel does not support persistent SQLite.*

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## One thing I would improve with more time
Given more time, I would implement robust image uploading directly to a cloud storage provider (like AWS S3 or Vercel Blob) instead of relying on external image URLs. Additionally, adding pagination or infinite scrolling would improve performance when the number of notices grows significantly.

## Where and how AI was used
AI (Gemini) was used as a pair-programming assistant to:
- Generate the boilerplate and component structure using Tailwind CSS for a polished, modern look.
- Write the Prisma schema and the Next.js API routes, ensuring server-side validation and database-level sorting logic were implemented according to the requirements.
- Assist in writing this README and ensuring all assignment constraints were met.
