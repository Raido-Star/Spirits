#!/bin/bash

echo "🎓 Study Buddy - Quick Setup"
echo "=============================="
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file already exists"
else
    echo ""
    echo "🔑 OpenAI API Key Setup"
    echo "Get your key at: https://platform.openai.com/api-keys"
    echo ""
    read -p "Paste your OpenAI API key (or press Enter to skip): " api_key

    if [ -z "$api_key" ]; then
        echo "⚠️  No API key provided. Creating .env file anyway..."
        cp .env.example .env
        echo "Edit .env file and add your API key before running!"
    else
        echo "OPENAI_API_KEY=$api_key" > .env
        echo "PORT=3002" >> .env
        echo "NODE_ENV=development" >> .env
        echo "✅ .env file created with your API key"
    fi
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "🚀 Starting Study Buddy..."
echo "   Open http://localhost:3002 in your browser"
echo ""

npm start
