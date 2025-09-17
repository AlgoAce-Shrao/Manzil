// client/js/colleges.js
let map, markers = [];

function initColleges() {
  const btnFind = q('#btnFind');
  const btnUseMapCenter = q('#btnUseMapCenter');
  const radiusInput = q('#radiusInput');
  const radiusValue = q('#radiusValue');

  radiusInput.addEventListener('input', () => { radiusValue.textContent = radiusInput.value; });

  btnFind.addEventListener('click', async () => {
    try { await findNearbyByGeolocation(); } catch (err) { alert(err.message); }
  });

  btnUseMapCenter.addEventListener('click', async () => {
    if (!map) return alert('Map not ready');
    const c = map.getCenter();
    await findNearby(c.lat(), c.lng());
  });

  waitForMaps().then(() => {
    initMap();
    findNearbyByGeolocation().catch(()=>{/*silent*/});
  });
}

function waitForMaps(){
  return new Promise(resolve => {
    if (window.google && google.maps) return resolve();
    const iv = setInterval(() => { if (window.google && google.maps) { clearInterval(iv); resolve(); } }, 100);
    setTimeout(() => { clearInterval(iv); resolve(); }, 10000);
  });
}

function initMap(){
  const center = { lat: 20.5937, lng: 78.9629 };
  map = new google.maps.Map(document.getElementById('map'), { center, zoom: 5 });
  map.addListener('center_changed', () => {});
}

async function findNearbyByGeolocation(){
  if (!navigator.geolocation) throw new Error('Geolocation not supported');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude; const lng = pos.coords.longitude;
      if (map) map.setCenter({ lat, lng });
      await findNearby(lat, lng);
      resolve();
    }, (err) => reject(err), { enableHighAccuracy: true, timeout: 10000 });
  });
}

async function findNearby(lat, lng){
  const stream = q('#streamInput').value.trim();
  const qTerm = q('#searchInput').value.trim();
  const radiusKm = Number(q('#radiusInput').value || 50);
  const radiusMeters = Math.round(radiusKm * 1000);

  const params = { lat, lng, radius: radiusMeters };
  if (stream) params.stream = stream;
  if (qTerm) params.q = qTerm;

  try {
    const colleges = await apiGet('/colleges/nearby', params);
    renderResults(colleges);
    renderMarkers(colleges);
  } catch (err) {
    alert('Error loading colleges: ' + err.message);
  }
}

function clearMarkers(){ markers.forEach(m => m.setMap(null)); markers = []; }

function renderMarkers(colleges){
  clearMarkers();
  if (!map) return;
  const bounds = new google.maps.LatLngBounds();
  colleges.forEach(c => {
    const coords = (c.location && c.location.coordinates) || (c.coords && [c.coords.lng, c.coords.lat]) || [0,0];
    const lat = coords[1], lng = coords[0];
    const marker = new google.maps.Marker({ position: { lat, lng }, map, title: c.name });
    marker.addListener('click', () => { window.location.href = `college-details.html?id=${c._id}`; });
    markers.push(marker);
    bounds.extend({ lat, lng });
  });
  if (colleges.length) map.fitBounds(bounds);
}

function renderResults(colleges){
  const list = q('#resultsList'); list.innerHTML = '';
  if (!colleges.length) { list.innerHTML = '<div class="result-item">No colleges found.</div>'; return; }
  colleges.forEach(c => {
    const el = document.createElement('div'); el.className = 'result-item';
    const dist = formatDistance(c.distance || c.dist || null);
    el.innerHTML = `<strong>${c.name}</strong><div class="muted">${c.city||''}, ${c.state||''} • ${dist}</div>
                    <div>Courses: ${(c.courses || []).map(x=>x.name).join(', ')}</div>
                    <div style="margin-top:8px"><button class="btn" onclick="location.href='college-details.html?id=${c._id}'">Details</button>
                    <button class="btn ghost" onclick="alert('Save - login required')">Save</button></div>`;
    list.appendChild(el);
  });
}

document.addEventListener('DOMContentLoaded', initColleges);
