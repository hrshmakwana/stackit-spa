// list.js — Responsible for rendering questions.html list page

(function () {
  const listContainer = document.getElementById('questionsList');
  if (!listContainer) return;

  const questions = JSON.parse(localStorage.getItem('questions') || '[]');

  if (questions.length === 0) {
    listContainer.innerHTML =
      `<p class="text-gray-500">No questions asked yet. Be the first!</p>`;
    return;
  }

  questions.forEach(q => {
    const link = document.createElement('a');
    link.href = `details.html?id=${q.id}`;
    link.className = 'block card-hover rounded hover:bg-gray-100';

    const card = document.createElement('div');
    card.className = 'p-4 border border-gray-200 rounded bg-gray-50';

    const tagsHTML = (q.tags || '')
      .split(',')
      .map(tag => `<span class="tag-chip">${tag.trim()}</span>`)
      .join(' ');

    card.innerHTML = `
      <h2 class="text-lg font-semibold mb-1">${q.title}</h2>
      <p class="text-sm text-gray-700 truncate">${q.desc}</p>
      <div class="text-xs text-gray-600 mt-2">Tags: ${tagsHTML}</div>
      <p class="text-sm mt-2">👍 ${q.votes || 0}</p>
    `;

    link.appendChild(card);
    listContainer.appendChild(link);
  });
})();