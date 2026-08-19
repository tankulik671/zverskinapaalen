import { albumsData } from './data/albums.js';

export function initAlbum(slug, options = {}) {
  const album = albumsData.find(a => a.slug === slug);
  if (!album) {
    console.error(`Album not found: ${slug}`);
    return;
  }

  const albumRight = document.getElementById('albumRight');
  const tracksUl = document.getElementById('tracksUl');
  const albumCover = document.getElementById('albumCover');
  const albumTitle = document.getElementById('albumTitle');
  const albumDesc = document.getElementById('albumDesc');

  if (albumDesc) albumDesc.textContent = album.description;

  let activeIndex = -1;

  function renderTrackList() {
    if (!tracksUl) return;
    tracksUl.innerHTML = '';
    album.tracks.forEach((t, idx) => {
      const li = document.createElement('li');
      li.dataset.index = String(idx);
      li.innerHTML = `<div class="track-title">${escapeHtml(t.title)}</div>${t.performer ? `<div class="track-feat">${escapeHtml(t.performer)}</div>` : ''}`;
      li.addEventListener('click', () => showTrackInfo(t, idx));
      tracksUl.appendChild(li);
    });
  }

  function showTrackInfo(track, idx) {
    activeIndex = idx;
    highlightActiveTrack();
    if (!albumRight) return;

    albumRight.innerHTML = `
      <h3>${escapeHtml(track.title)} ${track.performer ? escapeHtml(track.performer) : ''}</h3>
      <div class="fw-tabs">
        <button id="tabText" class="fw-tab-active">Текст</button>
        <button id="tabHist" class="fw-tab-inactive">История создания</button>
      </div>
      <div id="tabContent" class="fw-tab-content">${escapeHtml(track.text)}</div>
      <div class="soundcloud-btn">
        <a href="${escapeHtml(track.link)}" target="_blank" rel="noopener noreferrer">
          <img src="images/listenbutton.png" alt="Listen on SoundCloud">
        </a>
      </div>
    `;

    const tabText = document.getElementById('tabText');
    const tabHist = document.getElementById('tabHist');
    const tabContent = document.getElementById('tabContent');

    if (tabText && tabHist && tabContent) {
      tabText.addEventListener('click', () => {
        tabText.className = 'fw-tab-active';
        tabHist.className = 'fw-tab-inactive';
        tabContent.textContent = track.text;
      });
      tabHist.addEventListener('click', () => {
        tabHist.className = 'fw-tab-active';
        tabText.className = 'fw-tab-inactive';
        tabContent.textContent = track.history;
      });
    }
  }

  function showAlbumDesc() {
    activeIndex = -1;
    highlightActiveTrack();
    if (!albumRight) return;
    albumRight.innerHTML = `
      <h3>Об альбоме:</h3>
      <div class="album-desc">${escapeHtml(album.description)}</div>
    `;
  }

  function highlightActiveTrack() {
    if (!tracksUl) return;
    const items = tracksUl.querySelectorAll('li');
    items.forEach((li, i) => {
      if (i === activeIndex) {
        li.style.background = 'rgba(0,160,255,0.08)';
        li.style.transform = 'translateX(4px)';
      } else {
        li.style.background = 'rgba(255,255,255,0.02)';
        li.style.transform = '';
      }
    });
  }

  if (albumCover) {
    albumCover.addEventListener('click', () => window.open(album.cover, '_blank'));
  }
  if (albumTitle) {
    albumTitle.addEventListener('click', showAlbumDesc);
  }

  renderTrackList();

  const scale = options.scale ?? 0.7;
  const wrap = document.querySelector('.ui-scale-inner');
  if (wrap) wrap.style.transform = `scale(${scale})`;

  const albumWrap = document.querySelector('.album-wrap');
  if (albumWrap) {
    albumWrap.style.flexDirection = 'row';
    albumWrap.style.flexWrap = 'nowrap';
    albumWrap.style.alignItems = 'flex-start';
  }
}

function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}
