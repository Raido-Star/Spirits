// State
let uploadedFile = null;
let currentExplanation = null;

// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadBox = document.getElementById('uploadBox');
const uploadSection = document.getElementById('uploadSection');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const options = document.getElementById('options');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const explanationContent = document.getElementById('explanationContent');
const levelBadge = document.getElementById('levelBadge');
const suggestions = document.getElementById('suggestions');
const followUpAnswers = document.getElementById('followUpAnswers');
const followUpInput = document.getElementById('followUpInput');
const costInfo = document.getElementById('costInfo');

// File Input Change
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    handleFile(file);
  }
});

// Drag and Drop
uploadBox.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadBox.classList.add('drag-over');
});

uploadBox.addEventListener('dragleave', () => {
  uploadBox.classList.remove('drag-over');
});

uploadBox.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadBox.classList.remove('drag-over');

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    handleFile(file);
  } else {
    alert('Please drop an image file');
  }
});

// Handle File Upload
function handleFile(file) {
  uploadedFile = file;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    uploadBox.style.display = 'none';
    imagePreview.style.display = 'block';
    options.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

// Reset Upload
function resetUpload() {
  uploadedFile = null;
  currentExplanation = null;
  fileInput.value = '';
  previewImg.src = '';
  uploadBox.style.display = 'block';
  imagePreview.style.display = 'none';
  options.style.display = 'none';
  results.style.display = 'none';
  loading.style.display = 'none';
  followUpAnswers.innerHTML = '';
  followUpInput.value = '';
  costInfo.textContent = '';
}

// Explain Image
async function explainImage() {
  if (!uploadedFile) {
    alert('Please upload an image first');
    return;
  }

  const level = document.getElementById('levelSelect').value;
  const question = document.getElementById('questionInput').value;

  // Show loading
  uploadSection.style.display = 'none';
  results.style.display = 'none';
  loading.style.display = 'block';

  try {
    const formData = new FormData();
    formData.append('image', uploadedFile);
    formData.append('explanationLevel', level);
    if (question) {
      formData.append('question', question);
    }

    const response = await fetch('/api/explain', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to explain image');
    }

    // Store explanation for follow-ups
    currentExplanation = data.explanation;

    // Show results
    loading.style.display = 'none';
    results.style.display = 'block';

    explanationContent.textContent = data.explanation;
    levelBadge.textContent = getLevelEmoji(level) + ' ' + capitalizeFirst(level);

    // Show suggestions
    suggestions.innerHTML = '';
    if (data.followUpSuggestions) {
      data.followUpSuggestions.forEach(suggestion => {
        const chip = document.createElement('button');
        chip.className = 'suggestion-chip';
        chip.textContent = suggestion;
        chip.onclick = () => {
          followUpInput.value = suggestion;
          askFollowUp();
        };
        suggestions.appendChild(chip);
      });
    }

    // Show cost info
    if (data.usage) {
      costInfo.textContent = `Tokens used: ${data.usage.tokens} • Est. cost: ${data.usage.estimatedCost}`;
    }

  } catch (error) {
    loading.style.display = 'none';
    uploadSection.style.display = 'block';
    alert('Error: ' + error.message);
  }
}

// Ask Follow-up Question
async function askFollowUp() {
  const question = followUpInput.value.trim();

  if (!question) {
    alert('Please enter a question');
    return;
  }

  if (!currentExplanation) {
    alert('Please get an initial explanation first');
    return;
  }

  // Disable input while loading
  followUpInput.disabled = true;

  try {
    const response = await fetch('/api/follow-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question,
        previousExplanation: currentExplanation
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get answer');
    }

    // Display answer
    const answerDiv = document.createElement('div');
    answerDiv.className = 'follow-up-answer';
    answerDiv.innerHTML = `
      <div class="question">Q: ${escapeHtml(question)}</div>
      <div class="answer">${escapeHtml(data.answer)}</div>
    `;
    followUpAnswers.appendChild(answerDiv);

    // Clear input
    followUpInput.value = '';

    // Scroll to answer
    answerDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (error) {
    alert('Error: ' + error.message);
  } finally {
    followUpInput.disabled = false;
    followUpInput.focus();
  }
}

// Copy Explanation
function copyExplanation() {
  let textToCopy = currentExplanation;

  // Add follow-up Q&As if they exist
  const followUps = followUpAnswers.querySelectorAll('.follow-up-answer');
  if (followUps.length > 0) {
    textToCopy += '\n\n--- Follow-up Questions ---\n\n';
    followUps.forEach(qa => {
      const q = qa.querySelector('.question').textContent;
      const a = qa.querySelector('.answer').textContent;
      textToCopy += `${q}\n${a}\n\n`;
    });
  }

  navigator.clipboard.writeText(textToCopy).then(() => {
    alert('Explanation copied to clipboard!');
  }).catch(() => {
    alert('Failed to copy. Please select and copy manually.');
  });
}

// Helpers
function getLevelEmoji(level) {
  const emojis = {
    beginner: '🌱',
    intermediate: '🌿',
    advanced: '🌳'
  };
  return emojis[level] || '🌱';
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Allow Enter key to submit follow-up questions
followUpInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    askFollowUp();
  }
});

// Check API health on load
fetch('/api/health')
  .then(r => r.json())
  .then(data => {
    if (!data.visionEnabled) {
      console.warn('OpenAI API not configured');
    }
  })
  .catch(err => {
    console.error('API health check failed:', err);
  });
