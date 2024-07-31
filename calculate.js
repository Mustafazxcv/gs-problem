let permutations = [];
let currentBatch = 0;
const batchSize = 10;
let results = [];

document.getElementById('startCalculation').addEventListener('click', startCalculations);

function startCalculations() {
  const distances = calculateDistancesMatrix();
  permutations = getPermutations(markers.map((_, index) => index));
  currentBatch = 0;
  results = [];
  calculateNextBatch(distances);
}

function calculateNextBatch(distances) {
  const batchEnd = Math.min(currentBatch + batchSize, permutations.length);

  for (let i = currentBatch; i < batchEnd; i++) {
    const permutation = permutations[i];
    const route = getRouteFromPermutation(permutation);
    const totalDistance = calculateRouteDistance(route, distances);
    results.push({ route, totalDistance });
  }

  results.sort((a, b) => a.totalDistance - b.totalDistance);
  displayRoutes(results);

  currentBatch = batchEnd;

  if (currentBatch < permutations.length) {
    setTimeout(() => calculateNextBatch(distances), 0);
  } else {
    alert('Hesaplama tamamlandı!');
  }
}

function getPermutations(arr) {
  let result = [];

  function permute(current, remaining) {
    if (remaining.length === 0) {
      result.push(current);
    } else {
      for (let i = 0; i < remaining.length; i++) {
        const next = remaining.slice();
        const nextItem = next.splice(i, 1);
        permute(current.concat(nextItem), next);
      }
    }
  }

  permute([], arr);
  return result;
}

function getRouteFromPermutation(permutation) {
  return permutation.map(index => markers[index].latlng);
}

function calculateRouteDistance(route, distances) {
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += distances[markers.findIndex(marker => marker.latlng === route[i])][markers.findIndex(marker => marker.latlng === route[i + 1])];
  }
  return totalDistance;
}

function displayRoutes(results) {
  let analysisText = '<h3>Rota Analizi</h3><ul>';

  results.forEach((result, index) => {
    let routeText = result.route.map(latlng => {
      const marker = markers.find(marker => marker.latlng === latlng);
      return marker ? marker.label : 'Unknown';
    }).join(' -> ');

    analysisText += `<li>${index + 1}. Yol: ${routeText} - <b>Toplam Bomba Mesafesi:</b> ${result.totalDistance.toFixed(2)} km</li>`;
  });

  analysisText += '</ul>';
  document.getElementById('analysis').innerHTML = analysisText;
}

function calculateDistancesMatrix() {
  const n = markers.length;
  const distances = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        distances[i][j] = haversineDistance(markers[i].latlng, markers[j].latlng);
      }
    }
  }

  return distances;
}

function haversineDistance(latlng1, latlng2) {
  const R = 6371; // Dünya'nın yarıçapı (km)
  const dLat = (latlng2[0] - latlng1[0]) * Math.PI / 180;
  const dLng = (latlng2[1] - latlng1[1]) * Math.PI / 180;
  const lat1 = latlng1[0] * Math.PI / 180;
  const lat2 = latlng2[0] * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
}
