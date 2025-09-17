// client/js/collegeDetails.js
async function initDetails(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) { document.getElementById('collegeContainer').innerHTML = '<p>No college id.</p>'; return; }

  try {
    const college = await apiGet(`/colleges/${id}`);
    q('#collegeName').textContent = college.name;
    q('#collegeLocation').textContent = `${college.city || ''}, ${college.state || ''}`;
    const ad = q('#admissionDates'); ad.innerHTML = '';
    (college.admissionDates || []).forEach(a => {
      const el = document.createElement('div');
      const s = a.start ? new Date(a.start).toLocaleDateString() : '-';
      const e = a.end ? new Date(a.end).toLocaleDateString() : '-';
      el.textContent = `${a.title}: ${s} — ${e}`; ad.appendChild(el);
    });
  } catch (err) {
    q('#collegeContainer').innerHTML = `<p>Error loading college: ${err.message}</p>`;
  }

  // timeline fetch - requires auth
  try {
    const evs = await apiGet('/timeline', { collegeId: id });
    renderTimeline(evs);
  } catch (err) {
    q('#timelineList').innerHTML = '<p class="muted">Login to view/add timeline events.</p>';
  }

  q('#timelineForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = q('#evTitle').value.trim(); const date = q('#evDate').value; const note = q('#evNote').value.trim();
    if (!title || !date) return alert('Title & date required');
    try {
      await apiPost('/timeline', { collegeId: id, title, date, note, type: 'other' });
      alert('Event added');
      const evs2 = await apiGet('/timeline', { collegeId: id });
      renderTimeline(evs2);
      q('#evTitle').value=''; q('#evDate').value=''; q('#evNote').value='';
    } catch (err) { alert('Could not add event: ' + err.message); }
  });
}

function renderTimeline(events){
  const list = q('#timelineList'); list.innerHTML = '';
  if (!events || !events.length) { list.innerHTML = '<p>No events yet.</p>'; return; }
  events.forEach(ev => {
    const d = document.createElement('div'); d.className='result-item';
    d.innerHTML = `<div><strong>${ev.title}</strong></div><div>${new Date(ev.date).toLocaleDateString()}</div><div class="muted">${ev.note||''}</div>`;
    list.appendChild(d);
  });
}

document.addEventListener('DOMContentLoaded', initDetails);
