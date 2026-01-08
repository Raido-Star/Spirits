# 🚀 Getting Started with Study Buddy

## Step-by-Step Setup (5 minutes)

### Step 1: Get Your OpenAI API Key (2 min)

1. Visit: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click **"Create new secret key"**
4. Give it a name like "Study Buddy"
5. **COPY THE KEY** (you won't see it again!)

💰 **Billing:** Add $5-10 to start. You'll get hundreds of explanations.

---

### Step 2: Install the App (1 min)

Open your terminal in the `study-buddy` folder and run:

```bash
npm install
```

This downloads all the dependencies (Express, OpenAI SDK, etc.)

---

### Step 3: Add Your API Key (1 min)

**Option A: Quick Setup**
```bash
# Copy the example file
cp .env.example .env

# Then open .env in your text editor and replace:
# OPENAI_API_KEY=your-openai-api-key-here
# with your actual key
```

**Option B: Manual Setup**
1. Create a file named `.env` in the `study-buddy` folder
2. Add this line:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

---

### Step 4: Start the App (30 sec)

```bash
npm start
```

You should see:
```
🎓 Study Buddy API running on http://localhost:3002
📸 Open http://localhost:3002 to start learning!
✅ OpenAI API configured
```

---

### Step 5: Test It Out!

1. Open http://localhost:3002 in your browser
2. Take a screenshot of some code (or use one you have)
3. Upload it to Study Buddy
4. Choose "Beginner" level
5. Click "Explain This"
6. Wait 5-10 seconds... Magic! ✨

---

## ❓ Troubleshooting

### "OpenAI API key not configured"
- Check that your `.env` file exists
- Make sure the key starts with `sk-`
- Restart the server after adding the key

### "Failed to explain image"
- Check your internet connection
- Verify you have billing set up on OpenAI
- Make sure the image is a valid format (JPG, PNG)

### "Port 3002 already in use"
- Change `PORT=3002` to `PORT=3003` in your `.env` file
- Or stop the other app using port 3002

### Need help?
- Check the full README.md
- Look at the OpenAI API docs
- Google the error message

---

## 🎯 Your First Test

Try this:
1. Take a screenshot of this simple code:
   ```python
   def greet(name):
       return f"Hello, {name}!"

   print(greet("World"))
   ```

2. Upload to Study Buddy
3. Select "Beginner"
4. Ask: "How does this function work?"

You should get a clear explanation of the function, the f-string, and how it's called!

---

## 💡 Tips for Best Results

✅ **DO:**
- Use clear screenshots with readable text
- Ask specific questions
- Try different explanation levels
- Use follow-up questions to dig deeper

❌ **DON'T:**
- Upload blurry or tiny images
- Expect it to do homework FOR you (it explains, not solves)
- Forget about API costs (monitor your usage!)

---

## 🎓 What to Learn Next

After getting Study Buddy working:
1. Read through `server.js` - see how the API calls work
2. Check `public/app.js` - learn about fetch() and DOM manipulation
3. Modify the UI - change colors, add features
4. Deploy it online (see README.md)

**You just built a real AI app!** 🎉

---

Ready? Run `npm start` and let's go! 🚀
