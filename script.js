// Extended spam word list
const spamWords = ['free', 'urgent', 'click here', 'act now', 'guarantee', 'offer', 'limited', 'winner', 'risk-free', 'cheap'];

function cleanEmail() {
  let email = document.getElementById('emailInput').value;
  email = email.replace(/\u200B/g, '').replace(/\s+$/gm, '');
  document.getElementById('preview').textContent = email;
}

function checkSpam() {
  let email = document.getElementById('preview').textContent;
  let warnings = [];
  spamWords.forEach(word => {
    let regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(email)) warnings.push(word);
  });
  if (warnings.length > 0) {
    document.getElementById('preview').innerHTML = email + "\n\n" +
      '<span class="spam-warning">⚠ Spam words detected: ' + warnings.join(', ') + '</span>';
  } else {
    alert("No common spam words detected!");
  }
}

async function getAISuggestions() {
  const email = document.getElementById('preview').textContent;
  const clientName = prompt("Enter Client Name (optional):");
  const projectName = prompt("Enter Project Name (optional):");

  try {
    const response = await fetch('http://localhost:3000/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailText: email, clientName, projectName })
    });

    const data = await response.json();
    const preview = document.getElementById('preview');
    preview.innerHTML = preview.textContent + '\n\n' + 
      '<span class="ai-suggestion">' + data.suggestion + '</span>';

  } catch (error) {
    alert("Failed to fetch AI suggestion. Make sure the backend is running.");
    console.error(error);
  }
}

function copyPreview() {
  const preview = document.getElementById('preview');
  navigator.clipboard.writeText(preview.textContent)
    .then(() => alert("Email copied to clipboard!"))
    .catch(() => alert("Failed to copy."));
}

function downloadHTML() {
  const previewContent = document.getElementById('preview').innerHTML;
  const blob = new Blob([previewContent], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'optimized-email.html';
  link.click();
}
