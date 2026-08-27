import './styles.css';

const root = document.querySelector('#app');

if (!root) {
  throw new Error('Crown of Words mount point #app is missing.');
}

root.innerHTML = `
  <main class="scaffold" aria-labelledby="game-title">
    <section class="scaffold__card">
      <p class="scaffold__eyebrow">Tula's Island</p>
      <h1 id="game-title">Crown of Words</h1>
      <p>Projektbasis bereit. Gameplay startet in den nächsten planmäßigen Branches.</p>
      <p class="scaffold__status" role="status">Branch 1 · Contracts / Scaffold</p>
    </section>
  </main>
`;
