# Frontend - Clinicians Semantic Search

Modern React + TypeScript frontend for the Clinicians Semantic Search application. Built with Vite for fast development and optimized production builds.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- yarn

### Setup

```bash
# Install dependencies
yarn

# Start development server
yarn dev
```

The application will be available at `http://localhost:5173`

## 📦 Available Scripts

```bash
# Development server with hot reload
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Run ESLint
yarn lint
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── SearchInterface.tsx      # Main search interface
│   ├── DynamicFilters.tsx       # Multi-criteria filters
│   └── TherapistCard.tsx        # Therapist result card
├── pages/              # Page components
│   └── Home.tsx        # Home page
├── services/           # External service integrations
│   └── api.ts          # Backend API calls
├── types/              # TypeScript type definitions
│   └── therapist.ts    # Therapist data types
├── api/                # API client functions
├── lib/                # Utility functions
│   └── utils.ts        # Helper utilities
├── App.tsx             # Root component
├── main.tsx            # Entry point
├── index.css           # Global styles
├── theme.ts            # Theme configuration
└── vite-env.d.ts       # Vite type definitions
```

## 🎨 Components

### SearchInterface
Main search component that handles:
- Multi-criteria query input
- Search submission
- Result display

### DynamicFilters
Filtering component providing:
- Specialty filtering
- Insurance provider filtering
- Service type filtering

### TherapistCard
Displays individual therapist information:
- Name, title, and credentials
- Bio and ideal client summary
- Insurance accepted
- Therapeutic approaches and specialties
- Contact information

## 🔌 API Integration

The frontend communicates with the backend via REST API:

```typescript
// Search endpoint
POST /api/v1/search
{
  "criteria": ["therapist for anxiety", "accepts Medicaid"],
  "insurance": ["Medicaid"],
  "titles": ["LCSW"]
}

// Get available filters
GET /api/v1/filters

// Health check
GET /health
```

See [API Documentation](../docs/API.md) for full endpoint details.

## 🎯 Features

- **Semantic Search** - Natural language search powered by AI embeddings
- **Multi-Criteria Filtering** - Filter by specialty, insurance, service type, and more
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Favorites** - Save and revisit therapists across sessions

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

For production:

```env
VITE_API_URL=https://your-api-domain.com/api/v1
```

### Cloudflare Pages

This frontend can be deployed to Cloudflare Pages as a static Vite site.

Use these build settings:

```txt
Framework preset: Vite
Root directory: frontend
Build command: yarn build
Build output directory: dist
```

Set this environment variable in the Cloudflare Pages project:

```txt
VITE_API_URL=https://your-api-domain.com/api/v1
```

Notes:
- `VITE_API_URL` must point at your deployed backend, not `localhost`.
- If your backend is on a different domain, its CORS configuration must allow your Cloudflare Pages site.
- `public/_redirects` enables SPA fallback so direct visits to app routes still load `index.html`.

Typical deploy flow:

```bash
git push origin <your-branch>
```

Then in Cloudflare Pages:
1. Create a new Pages project connected to your Git repo.
2. Select the branch you want to deploy.
3. Set the root directory to `frontend`.
4. Set `VITE_API_URL` in Settings -> Environment variables.
5. Trigger the first deployment.

## 🏗️ Building

### Development
```bash
yarn dev
```

### Production
```bash
yarn build
```

This creates an optimized build in the `dist/` directory.

### Docker

A production-ready Dockerfile is included that builds the app and serves it via nginx:

```bash
docker build -t pdx-therapist-search-frontend .
docker run -p 80:80 pdx-therapist-search-frontend
```

Or use Docker Compose from the project root:

```bash
docker compose up frontend
```

## 🎨 Styling

- **Material UI v5** - Component library with Emotion styling
- **Custom Theme** - Forest/clay/parchment palette in `theme.ts`
- **Google Fonts** - Cormorant Garamond (display) + DM Sans (body)

## 🔄 State Management

- React hooks (`useState`, `useRef`) for local UI state
- React Query for server/async state
- `localStorage` for favorites persistence
- URL search params for shareable search links

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## 🐛 Troubleshooting

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
yarn
```

### Port already in use
```bash
# Use a different port
yarn dev --port 3001
```

### API connection issues
- Ensure backend is running on the correct port
- Check `VITE_API_URL` in `.env.local`
- Verify CORS settings on backend

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Backend README](../backend/README.md)

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

## 📝 License

MIT License - see [LICENSE](../LICENSE) file for details.
