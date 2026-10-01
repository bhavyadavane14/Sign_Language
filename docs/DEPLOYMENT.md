# Deployment Guide

## Frontend
The frontend can be easily deployed to platforms like Vercel or Netlify.
1. Connect the GitHub repository.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add `VITE_API_URL` to the environment variables.

## Backend
The backend can be deployed to Render, Railway, or Fly.io.
1. Use the provided Dockerfile.
2. Ensure the following environment variables are set:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `CORS_ORIGINS`
3. **Model Hosting**: Since the model `.h5` file is large, you may need to download it dynamically during the build process or use object storage (like AWS S3) and mount it, rather than bundling it in the image directly.

## Database
Deploy a managed PostgreSQL instance (e.g., Supabase, Render PostgreSQL) and update the `DATABASE_URL`.
