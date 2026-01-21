# Frontend - Clinicians Semantic Search

Modern React + TypeScript frontend for the Clinicians Semantic Search application. Built with Vite for fast development and optimized production builds.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Format code with Prettier (if configured)
npm run format
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
├── App.css             # App styles
├── theme.ts            # Theme configuration
└── vite-env.d.ts       # Vite type definitions
```

## 🎨 Components

### SearchInterface
Main search component that handles:
- Query input
- Search submission
- Result display

### DynamicFilters
Filtering component providing:
- Specialty filtering
- Location filtering
- Insurance provider filtering
- Custom criteria

### TherapistCard
Displays individual therapist information:
- Name and specialties
- Location
- Insurance accepted
- Contact information
- Rating (if available)

## 🔌 API Integration

The frontend communicates with the backend via REST API:

```typescript
// Search endpoint
POST /api/v1/search
{
  "query": "therapist for anxiety",
  "criteria": {
    "location": "New York",
    "insurance": "UnitedHealth"
  }
}

// Get available filters
GET /api/v1/filters

// Health check
GET /health
```

See [API Documentation](../docs/API.md) for full endpoint details.

## 🎯 Features

- **Semantic Search** - Natural language search powered by AI embeddings
- **Multi-Criteria Filtering** - Filter by specialty, location, insurance, and more
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Results** - Instant search results as you type
- **Error Handling** - Graceful error messages and fallbacks

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
VITE_API_URL=http://localhost:8000
```

For production, create `.env.production`:

```env
VITE_API_URL=https://api.example.com
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🏗️ Building

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## 🚀 Deployment

### Static Hosting (Vercel, Netlify, AWS S3)

```bash
# Build the application
npm run build

# Deploy the dist/ folder to your hosting service
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

## 🎨 Styling

- **CSS Modules** - For component-specific styles
- **Global Styles** - `index.css` for application-wide styles
- **Theme** - Centralized theme configuration in `theme.ts`

## 🔄 State Management

Currently using React hooks (`useState`, `useContext`) for state management. For larger state, consider:
- Redux
- Zustand
- TanStack Query (for server state)

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## 🐛 Troubleshooting

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
# Use a different port
npm run dev -- --port 3000
```

### API connection issues
- Ensure backend is running on the correct port
- Check VITE_API_URL in `.env.local`
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
    ...reactDom.configs.recommended.rules,
  },
})
```
