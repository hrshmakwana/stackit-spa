/* --------------------------------------------------
   StackIt Mini — Shared Front‑End Logic (HTML / CSS / JS only)
   Works for: index.html, questions.html, details.html
   -------------------------------------------------- */

(() => {
  /* ---------- Utilities ---------- */
  const $  = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);
  const STORE = 'questions';

  /** Return array of question objects */
  const getAll = () => JSON.parse(localStorage.getItem(STORE) || '[]');
  /** Persist array of question objects */
  const saveAll = list => localStorage.setItem(STORE, JSON.stringify(list));

  /** Simple universally‑unique id (crypto if available) */
  const uuid = () =>
    (crypto.randomUUID ? crypto.randomUUID() :
      Date.now().toString(36) + Math.random().toString(36).slice(2));

  /* ---------- Ask Page (index.html) ---------- */
  const askForm = $('#askForm');
  if (askForm) {
    askForm.addEventListener('submit', e => {
      e.preventDefault();

      const questions = getAll();
      questions.push({
        id: uuid(),
        title: $('#title').value.trim(),
        desc:  $('#desc').value.trim(),
        tags:  $('#tags').value.trim(),
        votes: 0,
        answers: []
      });
      saveAll(questions);
      askForm.reset();
      // go to list page
      location.href = 'questions.html';
    });
  }

  /* ---------- Questions List Page (questions.html) ---------- */
  const listBox = $('#questionsList');
  if (listBox) {
    const questions = getAll();
    if (questions.length === 0) {
      listBox.innerHTML =
        `<p class="text-gray-500">No questions asked yet. Be the first!</p>`;
    } else {
      questions.forEach(q => {
        // anchor wrapper
        const link = document.createElement('a');
        link.href = `details.html?id=${q.id}`;
        link.className = 'block card-hover rounded hover:bg-gray-100';

        const card = document.createElement('div');
        card.className = 'p-4 border border-gray-200 rounded bg-gray-50';
        card.innerHTML = `
          <h2 class="text-lg font-semibold">${q.title}</h2>
          <p class="text-sm mb-1 truncate">${q.desc}</p>
          <p class="text-xs text-gray-500 mb-1">Tags: ${q.tags}</p>
          <p class="text-sm">👍 <span>${q.votes || 0}</span></p>
        `;
        link.appendChild(card);
        listBox.appendChild(link);
      });
    }
  }

  /* ---------- Details Page (details.html) ---------- */
  const qBox      = $('#questionBox');
  const answersEl = $('#answersList');
  const answerFrm = $('#answerForm');

  if (qBox && answersEl) {
    const params     = new URLSearchParams(location.search);
    const questionId = params.get('id');
    let   questions  = getAll();
    const qIndex     = questions.findIndex(q => q.id === questionId);

    if (qIndex === -1) {
      alert('Question not found!'); location.href = 'questions.html';
      return;
    }
    const q = questions[qIndex];
    q.answers ??= [];

    /* ---- render helpers ---- */
    const renderQuestion = () => {
      qBox.innerHTML = `
        <h1 class="text-2xl font-bold mb-2">${q.title}</h1>
        <p class="mb-2">${q.desc}</p>
        <p class="text-xs text-gray-600">Tags: ${q.tags}</p>
      `;
    };

    const renderAnswers = () => {
      answersEl.innerHTML = '';
      if (q.answers.length === 0) {
        answersEl.innerHTML =
          `<p class="text-gray-500">No answers yet – be first!</p>`;
        return;
      }
      q.answers.forEach(ans => {
        const div = document.createElement('div');
        div.className = 'p-4 bg-gray-50 border rounded';
        div.innerHTML = `
          <p>${ans.body}</p>
          <p class="mt-2">👍 <span id="v-${ans.id}">${ans.votes}</span></p>
          <button class="vote-btn text-green-600 mr-2"
                  data-id="${ans.id}" data-delta="1">Upvote</button>
          <button class="vote-btn text-red-600"
                  data-id="${ans.id}" data-delta="-1">Downvote</button>
        `;
        answersEl.appendChild(div);
      });
    };

    /* ---- vote handling ---- */
    const vote = (ansId, delta) => {
      const voteKey = `vote_${ansId}`;
      const prev    = parseInt(localStorage.getItem(voteKey) || 0);
      if (prev === delta) return;                  // same vote, ignore

      const ans = q.answers.find(a => a.id === ansId);
      ans.votes += delta - prev;

      localStorage.setItem(voteKey, delta);
      questions[qIndex] = q;
      saveAll(questions);
      renderAnswers();
    };

    // delegate clicks
    answersEl.addEventListener('click', e => {
      if (e.target.matches('.vote-btn')) {
        const id    = e.target.dataset.id;
        const delta = parseInt(e.target.dataset.delta, 10);
        vote(id, delta);
      }
    });

    /* ---- answer submit ---- */
    if (answerFrm) {
      answerFrm.addEventListener('submit', e => {
        e.preventDefault();
        const body = $('#answerBody').value.trim();
        if (!body) return;

        q.answers.push({ id: uuid(), body, votes: 0 });
        saveAll(questions);
        $('#answerBody').value = '';
        renderAnswers();
      });
    }

    /* ---- initial paint ---- */
    renderQuestion();
    renderAnswers();
  }
})();

const all = getAllQuestions();
const newQ = createQuestion({ title, desc, tags });
const q = getQuestionById(id);