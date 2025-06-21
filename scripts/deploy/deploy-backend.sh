#chore: update backend deployment script

#!/bin/bash
echo "🚀 Deploying backend to Render..."

cd backend
git add .
git commit -m "Deploy backend - $(date)"
git push origin main

echo "✅ Backend deployment triggered!"
echo "📊 Check Render dashboard for status"
echo "🔗 Your API will be available at: https://your-app-name.onrender.com"