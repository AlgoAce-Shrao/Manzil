// client/js/colleges-leaflet.js
let map, markersLayer;

function initColleges() {
  const btnFind = q('#btnFind');
  const btnUseMapCenter = q('#btnUseMapCenter');
  const radiusInput = q('#radiusInput');
  const radiusValue = q('#radiusValue');

  radiusInput.addEventListener('input', () => {
    radiusValue.textContent = radiusInput.value;
  });

  btnFind.addEventListener('click', async () => {
    try { await findNearbyByGeolocation(); } catch (err) { alert(err.message); }
  });

  btnUseMapCenter.addEventListener('click', async () => {
    if (!map) return alert('Map not ready');
    const center = map.getCenter();
    await findNearby(center.lat, center.lng);
  });

  initMap();
  findNearbyByGeolocation().catch(()=>{});
}

function initMap() {
  map = L.map('map').setView([20.5937, 78.9629], 5); // India center

  // Tile layer from OpenStreetMap (free)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
}

async function findNearbyByGeolocation() {
  if (!navigator.geolocation) throw new Error('Geolocation not supported');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      map.setView([lat, lng], 12);
      await findNearby(lat, lng);
      resolve();
    }, (err) => reject(err), { enableHighAccuracy: true, timeout: 10000 });
  });
}

// async function findNearby(lat, lng) {
//   const stream = q('#streamInput').value.trim();
//   const qTerm = q('#searchInput').value.trim();
//   const radiusKm = Number(q('#radiusInput').value || 50);
//   const radiusMeters = Math.round(radiusKm * 1000);

//   const params = { lat, lng, radius: radiusMeters };
//   if (stream) params.stream = stream;
//   if (qTerm) params.q = qTerm;

//   try {
//     const colleges = await apiGet('/colleges/nearby', params);
//     renderResults(colleges);
//     renderMarkers(colleges);
//   } catch (err) {
//     alert('Error loading colleges: ' + err.message);
//   }
// }

async function findNearby(lat, lng) {
  const stream = q('#streamInput').value.trim();
  const qTerm = q('#searchInput').value.trim();
  const radiusKm = Number(q('#radiusInput').value || 50);
  const radiusMeters = Math.round(radiusKm * 1000);
  const onlyGovt = q('#onlyGovt').checked;

  const params = { lat, lng, radius: radiusMeters };
  if (stream) params.stream = stream;
  if (qTerm) params.q = qTerm;
  if (onlyGovt) params.onlyGovt = true;

  try {
    const colleges = await apiGet('/colleges/nearby', params);
    renderResults(colleges);
    renderMarkers(colleges);
  } catch (err) {
    alert('Error loading colleges: ' + err.message);
  }
}


// function renderMarkers(colleges) {
//   markersLayer.clearLayers();

//   if (!colleges.length) return;

//   const bounds = [];
//   colleges.forEach(c => {
//     const coords = c.location?.coordinates || [0,0];
//     const lat = coords[1], lng = coords[0];
//     if (!lat || !lng) return;

//     const marker = L.marker([lat, lng]).addTo(markersLayer);
//     marker.bindPopup(`
//       <strong>${c.name}</strong><br/>
//       ${c.city || ''}, ${c.state || ''}<br/>
//       <a href="college-details.html?id=${c._id}">Details</a>
//     `);
//     bounds.push([lat, lng]);
//   });

//   if (bounds.length) map.fitBounds(bounds);
// }

function renderMarkers(colleges) {
  markersLayer.clearLayers();
  if (!colleges.length) return;

  const bounds = [];
  colleges.forEach(c => {
    const coords = c.location?.coordinates || [0,0];
    const lat = coords[1], lng = coords[0];
    if (!lat || !lng) return;

    const avgRating = c.reviews?.length
      ? (c.reviews.reduce((a,r)=>a+(r.rating||0),0)/c.reviews.length).toFixed(1)
      : "No ratings";

    const marker = L.marker([lat, lng]).addTo(markersLayer);
    marker.bindPopup(`
      <strong>${c.name}</strong><br/>
      ${c.city || ''}, ${c.state || ''}<br/>
      <em>Type:</em> ${c.type}<br/>
      <em>Rating:</em> ${avgRating}<br/>
      <a href="college-details.html?id=${c._id}">View details & reviews</a>
    `);
    bounds.push([lat, lng]);
  });

  if (bounds.length) map.fitBounds(bounds);
}


function renderResults(colleges) {
  const list = q('#resultsList'); list.innerHTML = '';
  if (!colleges.length) {
    list.innerHTML = '<div class="result-item">No colleges found.</div>';
    return;
  }

  colleges.forEach(c => {
    const el = document.createElement('div'); el.className = 'result-item';
    const dist = formatDistance(c.distance || null);
    el.innerHTML = `
      <strong>${c.name}</strong>
      <div class="muted">${c.city || ''}, ${c.state || ''} • ${dist}</div>
      <div>Courses: ${(c.courses || []).map(x => x.name).join(', ')}</div>
      <div style="margin-top:8px">
        <button class="btn" onclick="location.href='college-details.html?id=${c._id}'">Details</button>
      </div>
    `;
    list.appendChild(el);
  });
}

document.addEventListener('DOMContentLoaded', initColleges);
