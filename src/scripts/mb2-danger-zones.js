import * as THREE from 'three';
import './mb2-danger-zones.css';

export function createDangerZones({stage, pivot, camera, config, points, seek}) {
  stage.classList.add('mb2-danger-stage');
  // Illustrative route stations for anatomical review, not calibrated millimetres.
  const zones = [
    {station: 3, title: 'Hidden MB2 curve', text: '3 millimeters from the pulp chamber floor.'},
    {station: 4.957469, title: 'MB1 to MB2 confluence', text: 'Second danger point: the curve at the canal junction.'},
  ];
  const panel = document.createElement('div');
  panel.className = 'mb2-danger-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'status');
  panel.setAttribute('aria-live', 'polite');
  const eyebrow = document.createElement('p');
  eyebrow.className = 'mb2-danger-eyebrow';
  const title = document.createElement('h2');
  const description = document.createElement('p');
  panel.append(eyebrow, title, description);
  stage.append(panel);
  const navigation = document.createElement('div');
  navigation.className = 'mb2-danger-navigation';
  navigation.setAttribute('aria-label', 'Canal danger points');
  document.querySelector('.instrument').append(navigation);
  const reveal = () => {
    if (matchMedia('(max-width:720px)').matches) stage.scrollIntoView({block: 'start', behavior: 'instant'});
  };
  const markers = zones.map((zone, index) => {
    const sample = Math.max(0, Math.min(points.length / 3 - 1, Math.round((zone.station - config.start) / config.step)));
    const position = new THREE.Vector3().fromArray(points, sample * 3);
    const marker = document.createElement('button');
    marker.type = 'button';
    marker.className = 'mb2-danger-marker';
    marker.textContent = String(index + 1);
    marker.title = zone.title;
    marker.setAttribute('aria-label', `Inspect danger point ${index + 1}: ${zone.title}`);
    marker.onclick = () => {
      seek(zone.station);
      reveal();
    };
    stage.append(marker);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `Danger point ${index + 1}`;
    button.onclick = marker.onclick;
    navigation.append(button);
    return {position, marker, button};
  });
  let active = -1;
  return {
    reveal,
    near: feed => zones.some(zone => Math.abs(feed - zone.station) < .45),
    update(feed, shown) {
      const next = shown ? zones.findIndex(zone => Math.abs(feed - zone.station) < .45) : -1;
      if (active !== next) {
        active = next;
        panel.hidden = active < 0;
        if (active >= 0) {
          eyebrow.textContent = `Danger point ${active + 1}`;
          title.textContent = zones[active].title;
          description.textContent = zones[active].text;
        }
      }
      pivot.updateWorldMatrix(true, false);
      camera.updateMatrixWorld();
      const canvas = stage.querySelector('canvas');
      markers.forEach(({position, marker, button}, index) => {
        const projected = pivot.localToWorld(position.clone()).project(camera);
        const x = (projected.x + 1) * canvas.clientWidth / 2 + canvas.offsetLeft;
        const y = (1 - projected.y) * canvas.clientHeight / 2 + canvas.offsetTop;
        marker.hidden = !shown || projected.z < -1 || projected.z > 1 || x < 16 || x > stage.clientWidth - 16 || y < 16 || y > stage.clientHeight - 16;
        marker.style.left = `${x}px`;
        marker.style.top = `${y}px`;
        marker.classList.toggle('is-active', index === active);
        button.setAttribute('aria-pressed', String(index === active));
      });
    },
  };
}
