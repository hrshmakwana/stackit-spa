// api.js – Works without import/export

const STORAGE_KEY = 'questions';

function getAllQuestions() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveQuestions(questions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

function generateId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function createQuestion({ title, desc, tags }) {
  const questions = getAllQuestions();
  const newQ = {
    id: generateId(),
    title,
    desc,
    tags,
    votes: 0,
    answers: []
  };
  questions.push(newQ);
  saveQuestions(questions);
  return newQ;
}

function getQuestionById(id) {
  const questions = getAllQuestions();
  return questions.find(q => q.id === id);
}

function addAnswer(questionId, answerBody) {
  const questions = getAllQuestions();
  const q = questions.find(q => q.id === questionId);
  if (!q) return false;

  q.answers ??= [];
  q.answers.push({
    id: generateId(),
    body: answerBody,
    votes: 0
  });

  saveQuestions(questions);
  return true;
}

function voteAnswer(answerId, delta) {
  const questions = getAllQuestions();
  for (const q of questions) {
    const ans = q.answers?.find(a => a.id === answerId);
    if (ans) {
      const key = `vote_${answerId}`;
      const prev = parseInt(localStorage.getItem(key) || 0);
      if (prev === delta) return false;
      ans.votes += delta - prev;
      localStorage.setItem(key, delta);
      saveQuestions(questions);
      return true;
    }
  }
  return false;
}