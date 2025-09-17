// client/js/dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  q('#navLogout')?.addEventListener('click', (e) => { e.preventDefault(); localStorage.removeItem('token'); localStorage.removeItem('user'); location.href = 'index.html'; });

  // Try to fetch user's results if API supports it
  try {
    if (user && user.id) {
      const res = await apiGet(`/user/${user.id}/results`);
      const list = q('#resultsList'); list.innerHTML = '';
      if (res && res.length) {
        res.forEach(r => {
          const el = document.createElement('div'); el.className='result-item';
          el.innerHTML = `<strong>Result on ${new Date(r.createdAt).toLocaleDateString()}</strong><div class="muted">${(r.aiRecommendations || []).map(x=>x.stream).join(', ')}</div>
            <div><button class="btn" onclick="location.href='results.html?id=${r._id}'">View</button></div>`;
          list.appendChild(el);
        });
        q('#noResults') && (q('#noResults').style.display = 'none');
      } else {
        q('#noResults') && (q('#noResults').style.display = 'block');
      }
    }
  } catch (err) {
    console.warn('Dashboard fetch error', err.message);
  }

  // saved colleges - optional: fetch user and display saved
  try {
    const saved = user && user.savedColleges ? user.savedColleges : [];
    const sc = q('#savedColleges'); sc.innerHTML = '';
    if (!saved.length) sc.innerHTML = '<p>No saved colleges.</p>';
    saved.forEach(c => {
      const el = document.createElement('div'); el.className='result-item';
      el.innerHTML = `<strong>${c.name || c}</strong>`;
      sc.appendChild(el);
    });
  } catch (err) {}
});
