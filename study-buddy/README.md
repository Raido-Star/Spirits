# 🎓 Study Buddy

**AI-Powered Learning Assistant** - Screenshot any code or concept and get instant explanations using GPT-4 Vision.

Perfect for students, bootcamp learners, and anyone learning to code!

## ✨ Features

- 📸 **Screenshot Upload** - Drag & drop or upload images
- 🧠 **AI Explanations** - Powered by GPT-4 Vision API
- 🎯 **3 Learning Levels** - Beginner, Intermediate, Advanced
- 💬 **Follow-up Questions** - Ask for clarification
- 📋 **Copy & Save** - Export explanations for later

## 🚀 Quick Start

### 1. Get an OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create an account (if you don't have one)
3. Click "Create new secret key"
4. Copy your API key

**Cost:** ~$0.01-0.05 per image explanation (very affordable!)

### 2. Install Dependencies

```bash
cd study-buddy
npm install
```

### 3. Set Up Environment

```bash
# Copy the example env file
cp .env.example .env

# Open .env and add your OpenAI API key
# Replace 'your-openai-api-key-here' with your actual key
```

### 4. Run the App

```bash
npm start
```

Open http://localhost:3002 in your browser!

## 📖 How to Use

1. **Upload a Screenshot**
   - Take a screenshot of code, diagrams, or any concept
   - Drag & drop or click to upload

2. **Choose Your Level**
   - 🌱 Beginner: Simple, clear explanations
   - 🌿 Intermediate: More technical detail
   - 🌳 Advanced: Deep dives and best practices

3. **Optional: Ask a Specific Question**
   - "How does this loop work?"
   - "What's the difference between these two approaches?"

4. **Get Your Explanation**
   - Click "Explain This"
   - Wait 5-10 seconds for AI analysis

5. **Ask Follow-ups**
   - Use suggested questions or ask your own
   - Build on the conversation

## 💡 Great Use Cases

- **Understanding Code** - Paste code snippets you're struggling with
- **Learning Concepts** - Screenshot documentation or tutorials
- **Debugging** - Get explanations of error messages
- **Reviewing** - Study algorithm diagrams or architecture
- **Homework Help** - Get explanations (not answers!) for assignments

## 🛠️ Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Vanilla HTML/CSS/JavaScript (no frameworks!)
- **AI:** OpenAI GPT-4 Vision API
- **File Upload:** Multer

## 📂 Project Structure

```
study-buddy/
├── server.js          # Express backend with GPT-4 Vision integration
├── public/
│   ├── index.html     # Main UI
│   ├── styles.css     # Styling
│   └── app.js         # Frontend logic
├── package.json
├── .env.example       # Environment template
└── README.md
```

## 💰 Cost Estimate

Using GPT-4 Vision API:
- ~$0.01-0.05 per explanation
- ~$1 = 20-100 explanations
- Set up billing limits in OpenAI dashboard!

## 🚀 Deployment

### Deploy to Render (Free)

1. Push to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect your repo
5. Add environment variable: `OPENAI_API_KEY`
6. Deploy!

### Deploy to Railway

1. Push to GitHub
2. Go to https://railway.app
3. New Project → Deploy from GitHub
4. Add `OPENAI_API_KEY` to variables
5. Deploy!

## 🎯 Future Ideas

- [ ] Save explanations to local storage
- [ ] Export as PDF
- [ ] Quiz generation from screenshots
- [ ] Compare two code snippets side-by-side
- [ ] Mobile app version
- [ ] User accounts & history
- [ ] Share explanations with friends

## 🤝 Contributing

This is a learning project! Feel free to:
- Add features
- Improve the UI
- Fix bugs
- Share with other learners

## 📄 License

MIT - Use it, learn from it, build on it!

## 🙏 Credits

Built by a new developer, for new developers.

Powered by OpenAI's GPT-4 Vision API.

---

**Happy Learning! 🎓**
