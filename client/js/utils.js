// client/js/utils.js
function formatDistance(meters){
  if (meters === undefined || meters === null) return 'N/A';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters/1000).toFixed(2)} km`;
}

function q(sel){ return document.querySelector(sel); }
function qAll(sel){ return Array.from(document.querySelectorAll(sel)); }
