// client/js/results.js
document.addEventListener('DOMContentLoaded', async () => {
  const saved = localStorage.getItem('lastAnalysis');
  let data = saved ? JSON.parse(saved) : null;

  // if id param passed, try to fetch from API (if backend stored full analysis)
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (id && !data) {
    try {
      data = await apiGet(`/quiz/${id}`); // optional endpoint; if not available skip
    } catch (e) { /* ignore */ }
  }

  const recDiv = q('#recommendations');
  const treeDiv = q('#careerTree');
  const collDiv = q('#recommendedColleges');

  if (!data) {
    recDiv.innerHTML = '<p>No analysis found. Take the quiz first.</p>';
    return;
  }

  const ai = data.aiRecommendations || data.analysis?.aiRecommendations || data.recommendations || data.analysis || data;
  // render recommendations (try multiple shapes)
  recDiv.innerHTML = '';
  const arr = ai.aiRecommendations || ai.careerPaths || ai.streams || ai;
  if (Array.isArray(arr)) {
    arr.forEach(item => {
      const card = document.createElement('div'); card.className = 'panel';
      card.innerHTML = `<strong>${item.stream || item}</strong><div class="muted">${item.why || item}</div>`;
      recDiv.appendChild(card);
    });
  } else {
    recDiv.textContent = JSON.stringify(ai, null, 2);
  }

  // career tree: if careerTreeJson exists, render simple node list
  const tree = data.careerTreeJson || (data.analysis && data.analysis.careerTreeJson) || (data.careerTree || null);
  treeDiv.innerHTML = '';
  if (tree && tree.nodes) {
    const ul = document.createElement('ul');
    tree.nodes.forEach(n => { const li = document.createElement('li'); li.textContent = n.label || n.id; ul.appendChild(li); });
    treeDiv.appendChild(ul);
  } else {
    treeDiv.innerHTML = '<p>No career tree available.</p>';
  }

  // recommended colleges
  const recs = data.recommendedColleges || data.analysis?.recommendedColleges || [];
  collDiv.innerHTML = '';
  if (recs.length) {
    recs.forEach(c => {
      const el = document.createElement('div'); el.className = 'result-item';
      el.innerHTML = `<strong>${c.name || c.collegeName || c}</strong><div class="muted">Score: ${c.score ?? 'N/A'}</div>`;
      collDiv.appendChild(el);
    });
  } else {
    collDiv.innerHTML = '<p>No recommended colleges produced by AI.</p>';
  }
});
