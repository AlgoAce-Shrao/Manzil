// client/js/quiz.js
// Simple 10-question demo quiz. You can replace with dynamic questions fetched from the server.
const QUIZ_QUESTIONS = [
  { id: 'q1', q: 'Do you enjoy solving problems with code?', opts: ['Strongly agree','Agree','Neutral','Disagree'] },
  { id: 'q2', q: 'Do you like working with numbers and logic?', opts: ['Strongly agree','Agree','Neutral','Disagree'] },
  { id: 'q3', q: 'Do you enjoy drawing/designing or creativity?', opts: ['Strongly agree','Agree','Neutral','Disagree'] },
  { id: 'q4', q: 'Do you prefer working with people or independently?', opts: ['People','Independently','Both','Unsure'] },
  { id: 'q5', q: 'Do you like biology/chemistry subjects?', opts: ['Yes','Somewhat','No','Not sure'] },
  { id: 'q6', q: 'Do you prefer practical hands-on work?', opts: ['Yes','Sometimes','No','Unsure'] },
  { id: 'q7', q: 'Are you interested in business, finance or management?', opts: ['Yes','Somewhat','No','Unsure'] },
  { id: 'q8', q: 'Do you enjoy research and reading papers?', opts: ['Yes','Sometimes','No','Unsure'] },
  { id: 'q9', q: 'Are you comfortable with mathematics?', opts: ['Yes','Somewhat','No','Unsure'] },
  { id: 'q10', q: 'Would you like to study abroad?', opts: ['Yes','Maybe','No','Unsure'] }
];

let currentIndex = 0;
const answers = {};

function renderQuestion() {
  const area = q('#questionArea');
  area.innerHTML = '';
  const qObj = QUIZ_QUESTIONS[currentIndex];
  const title = document.createElement('h3'); title.textContent = `${currentIndex+1}. ${qObj.q}`;
  area.appendChild(title);

  qObj.opts.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'btn ghost';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      answers[qObj.id] = opt;
      // auto move next if not last
      if (currentIndex < QUIZ_QUESTIONS.length - 1) {
        currentIndex++;
        renderQuestion();
      } else {
        // submit
        submitQuiz();
      }
    });
    area.appendChild(btn);
  });

  // progress
  const progress = document.createElement('div'); progress.className = 'muted';
  progress.textContent = `Question ${currentIndex+1} of ${QUIZ_QUESTIONS.length}`;
  area.appendChild(progress);
}

async function submitQuiz() {
  // optional: ask for 12th percentage
  const perc = prompt('Enter your 12th percentage (0-100). Leave empty to skip.');
  const percentage12 = perc ? Number(perc) : undefined;
  try {
    // go to loading page quickly
    window.location.href = 'loading.html';
    // send quiz answers to backend
    const payload = { userId: (JSON.parse(localStorage.getItem('user')||'{}').id), answers: Object.keys(answers).map(k => ({ qId: k, choice: answers[k] })), percentage12 };
    const res = await apiPost('/quiz/submit', payload);
    // receive resultId or analysis; redirect to results with id param (if resultId)
    const id = res.resultId || res._id || (res.analysis && res.analysis.id);
    // store last analysis in localStorage for retrieval
    localStorage.setItem('lastAnalysis', JSON.stringify(res));
    window.location.href = `results.html?id=${id || ''}`;
  } catch (err) {
    alert('Failed to submit quiz: ' + err.message);
    window.location.href = 'quiz.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (q('#questionArea')) renderQuestion();
  if (q('#prevBtn')) q('#prevBtn').addEventListener('click', () => { if (currentIndex>0) { currentIndex--; renderQuestion(); }});
  if (q('#nextBtn')) q('#nextBtn').addEventListener('click', () => { if (currentIndex<QUIZ_QUESTIONS.length-1) { currentIndex++; renderQuestion(); }});
});
