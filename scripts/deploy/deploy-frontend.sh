#chore: update frontend deployment script
 
#!/bin/bash
echo "�� Deploying frontend..."

cd frontend
npm run build

echo "✅ Frontend build complete!"
echo "📁 Build files in: frontend/dist/"
echo "🚀 Deploy to GitHub Pages or Vercel"