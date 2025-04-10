# Guten Analyze Application

A Next.js application for text analysis and visualization of Project Gutenberg books.

## Development

```bash
# Start the development server with Turbopack
npm run dev

# Build for production
npm run build

# Start the production server
npm start

# Run linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Application Structure

- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - Reusable React components
- `/src/api` - API integrations and services

## Features

- Text analysis of [Project Gutenberg](https://www.gutenberg.org/) books using GROQ AI
- LLM-powered text analysis using the `meta-llama/llama-4-scout-17b-16e-instruct` model
- Interactive visualizations with [ReactFlow](https://reactflow.dev/) and [D3-Force](https://d3js.org/d3-force)
- Animated UI with Framer Motion
- Efficient data fetching and caching with TanStack Query

## Technical Implementation

- Next.js App Router for page routing and API routes
- Next.js API routes as a proxy server to avoid CORS restrictions when communicating with external APIs
- GROQ SDK for integrating with the Llama 4 Scout model
- ReactFlow for building interactive node-based diagrams
- D3-Force for physics-based visualization of text relationships
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) for:
  - Client-side data fetching and state management
  - Automatic caching of API responses
  - Loading and error states management

## Configuration

This application uses environment variables for configuration. Create or modify `.env.local` with the required values:

```
GROQ_API_KEY=your_groq_api_key
```

## Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)
- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to optimize and load [Geist](https://vercel.com/font), a custom font family from Vercel.
