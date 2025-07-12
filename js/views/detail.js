// ask.js — Handles the "Ask Question" form on index.html

(function () {
  const form  = document.getElementById('askForm');
  if (!form) return;                   // run only on index.html

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Collect and trim user input
    const title = $('#title').value.trim();
    const desc  = $('#desc').value.trim();
    const tags  = $('#tags').value.trim();

    if (!title || !desc) {
      showToast('Title and description are required!');
      return;
    }

    // Store in LocalStorage via api.js helper
    createQuestion({ title, desc, tags });

    // Optional feedback to the user
    showToast('Question posted successfully!');

    // Redirect to list page
    location.href = 'questions.html';
  });
})();