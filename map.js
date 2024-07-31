let map;
let markers = [];
let lines = [];
const speed = 100; // Sabit hız (km/h)

const fixedPoints = [
  { lat: 39.9334, lng: 25.8597, label: '1'},  // Ankara, Türkiye (Bilkent)
  { lat: 41.0246, lng: 28.9632, label: '2' }, // İstanbul, Türkiye (Kadıköy)
  { lat: 39.9334, lng: 23.8597, label: '3'}, // Ankara, Türkiye (Anıtkabir)
  { lat: 48.9335, lng: 32.8597, label: '4'}, // Ankara, Türkiye (Kızılay)
  { lat: 11.0082, lng: 28.9784, label: '5'}, // İstanbul, Türkiye (Sultanahmet Meydanı)
  { lat: 29.9334, lng: 32.8597, label: '6'}, // Ankara, Türkiye (Çankaya)
  { lat: 31.0082, lng: 28.9784, label: '7'}, // İstanbul, Türkiye (Beşiktaş)
];

const userLocation = { lat: 39.9255, lng: 32.8663, label: 'X' }; // Ankara, Turkey

document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
  addFixedMarkers();
  calculateAllRoutes();
});

function initMap() {
  map = L.map('map').setView([39.0, 35.2], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}

function addFixedMarkers() {
  placeMarker(userLocation);
  fixedPoints.forEach(point => {
    const latlng = L.latLng(point.lat, point.lng);
    placeMarker({ ...point, latlng });
  });
}

function placeMarker(point) {
  const markerOptions = { color: point.label === 'X' ? 'blue' : 'red' };
  const marker = L.circleMarker([point.lat, point.lng], markerOptions).addTo(map).bindPopup(point.label.toString());
  markers.push({ latlng: [point.lat, point.lng], label: point.label });
}

function clearMap() {
  markers.forEach(marker => map.removeLayer(marker));
  lines.forEach(line => map.removeLayer(line));
  markers = [];
  lines = [];
  document.getElementById('analysis').innerHTML = '';
  addFixedMarkers();
}
