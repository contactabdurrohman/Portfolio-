/* ============================================================
   ABDUR RAHMAN PORTFOLIO - SCRIPT.JS
   ============================================================ */

/* ---- Year ---- */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ---- Mobile burger ---- */
const burger    = document.getElementById('burger');
const navLinks  = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  burger.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(4px,4px)'  : '';
  burger.querySelectorAll('span')[1].style.transform = open ? 'rotate(-45deg) translate(4px,-4px)' : '';
});

navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => s.style.transform = '');
  })
);

document.querySelectorAll('a[href="#top"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  });
});

/* ---- Scroll reveal ---- */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ---- Profile photo upload ---- */
const profilePhoto = document.getElementById('profilePhoto');
const profileInput = document.getElementById('profileInput');

profileInput.addEventListener('change', () => {
  const file = profileInput.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  profilePhoto.src = URL.createObjectURL(file);
});

/* ---- Portfolio filter ---- */
const filterBtns = document.querySelectorAll('.f-btn');
const workGrid = document.getElementById('workGrid');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.f;

    document.querySelectorAll('.work-card').forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      if (match) {
        card.removeAttribute('data-hidden');
        card.style.display = '';
      } else {
        card.setAttribute('data-hidden', '');
        card.style.display = 'none';
      }
    });
  });
});

/* ---- Gallery upload ---- */
const uploadZone = document.getElementById('uploadZone');
const fileInput  = document.getElementById('fileInput');
const gallery    = document.getElementById('galleryGrid');
const uploadType = document.getElementById('uploadType');
const uploadTitle = document.getElementById('uploadTitle');
const uploadDescription = document.getElementById('uploadDescription');
const uploadStore = {};
const originalSlots = {};
const mediaDBName = 'abdur-portfolio-media';
const mediaDBStore = 'uploads';

const slotLabels = {
  design: 'Design',
  video: 'Video Editing',
  logo: 'Logo Design',
  product: 'Product Design',
  sound: 'Motion Video',
  'brand-kit': 'Brand Kit'
};

const upcomingSlots = new Set(['video', 'sound']);
const playlistLinks = {
  video: 'https://www.youtube.com/watch?v=uTkvnba-Uzo&list=PLAdqpHIowGXM',
  sound: 'https://www.youtube.com/watch?v=RvOwTdjhtgs&list=PLfAQnSgMu5lY'
};

const preloadedMedia = {
  "design": [
    {
      "fileName": "Mahfil Poster.jpg",
      "url": "Graphic Design/Mahfil%20Poster.jpg",
      "title": "Mahfil Poster",
      "description": "Design portfolio project.",
      "isVideo": false
    },
    {
      "fileName": "poster 1.jpg",
      "url": "Graphic Design/poster%201.jpg",
      "title": "poster 1",
      "description": "Design portfolio project.",
      "isVideo": false
    },
    {
      "fileName": "Ps Assignment 4.5.jpg",
      "url": "Graphic Design/Ps%20Assignment%204.5.jpg",
      "title": "Ps Assignment 4.5",
      "description": "Design portfolio project.",
      "isVideo": false
    },
    {
      "fileName": "Ps Assignment 4.6.jpg",
      "url": "Graphic Design/Ps%20Assignment%204.6.jpg",
      "title": "Ps Assignment 4.6",
      "description": "Design portfolio project.",
      "isVideo": false
    }
  ],
  "video": [],
  "logo": [
    {
      "fileName": "Sarfaraz Logo.png",
      "url": "Logo Design/Sarfaraz%20Logo.png",
      "title": "Sarfaraz Logo",
      "description": "Logo Design portfolio project.",
      "isVideo": false
    },
    {
      "fileName": "White.png",
      "url": "Logo Design/White.png",
      "title": "White",
      "description": "Logo Design portfolio project.",
      "isVideo": false
    }
  ],
  "product": [
    {
      "fileName": "ChatGPT Image May 24, 2026, 10_46_29 PM.png",
      "url": "Product Design/ChatGPT%20Image%20May%2024%2C%202026%2C%2010_46_29%20PM.png",
      "title": "ChatGPT Image May 24, 2026, 10 46 29 PM",
      "description": "Product Design portfolio project.",
      "isVideo": false
    },
    {
      "fileName": "ChatGPT Image May 8, 2026, 08_57_26 PM.png",
      "url": "Product Design/ChatGPT%20Image%20May%208%2C%202026%2C%2008_57_26%20PM.png",
      "title": "ChatGPT Image May 8, 2026, 08 57 26 PM",
      "description": "Product Design portfolio project.",
      "isVideo": false
    },
    {
      "fileName": "ChatGPT Image May 9, 2026, 03_47_37 PM.png",
      "url": "Product Design/ChatGPT%20Image%20May%209%2C%202026%2C%2003_47_37%20PM.png",
      "title": "ChatGPT Image May 9, 2026, 03 47 37 PM",
      "description": "Product Design portfolio project.",
      "isVideo": false
    },
    {
      "fileName": "Ps Assignment 3.1.jpg",
      "url": "Product Design/Ps%20Assignment%203.1.jpg",
      "title": "Ps Assignment 3.1",
      "description": "Product Design portfolio project.",
      "isVideo": false
    },
    {
      "fileName": "Ps Assignment 4.3.jpg",
      "url": "Product Design/Ps%20Assignment%204.3.jpg",
      "title": "Ps Assignment 4.3",
      "description": "Product Design portfolio project.",
      "isVideo": false
    },
    {
      "fileName": "فخامة (2).jpg",
      "url": "Product Design/%D9%81%D8%AE%D8%A7%D9%85%D8%A9%20(2).jpg",
      "title": "فخامة (2)",
      "description": "Product Design portfolio project.",
      "isVideo": false
    }
  ],
  "sound": [],
  "brand-kit": [
    {
      "fileName": "Brand Presentation.png",
      "url": "Brand/Brand%20Presentation.png",
      "title": "Brand Presentation",
      "description": "Brand Kit portfolio project.",
      "isVideo": false
    },
    {
      "fileName": "Sarfaraz Cover.png",
      "url": "Brand/Sarfaraz%20Cover.png",
      "title": "Sarfaraz Cover",
      "description": "Brand Kit portfolio project.",
      "isVideo": false
    },
    {
      "fileName": "Sarfaraz Logo.png",
      "url": "Brand/Sarfaraz%20Logo.png",
      "title": "Sarfaraz Logo",
      "description": "Brand Kit portfolio project.",
      "isVideo": false
    },
    {
      "fileName": "Sarfaraz.jpg",
      "url": "Brand/Sarfaraz.jpg",
      "title": "Sarfaraz",
      "description": "Brand Kit portfolio project.",
      "isVideo": false
    },
    {
      "fileName": "فخامة (2).jpg",
      "url": "Brand/%D9%81%D8%AE%D8%A7%D9%85%D8%A9%20(2).jpg",
      "title": "فخامة (2)",
      "description": "Brand Kit portfolio project.",
      "isVideo": false
    }
  ]
};

workCards.forEach(card => {
  const slot = card.dataset.slot;
  if (!slot) return;
  uploadStore[slot] = [];
  originalSlots[slot] = {
    thumb: card.querySelector('.work-thumb').innerHTML,
    info: card.querySelector('.work-info').innerHTML
  };
  card.addEventListener('click', e => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('video')) return;
    if (uploadStore[slot].length) openSlotViewer(slot);
  });
});

initMedia();

uploadZone.addEventListener('dragover', e => {
  e.preventDefault();
  uploadZone.classList.add('drag-over');
});
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', () => handleFiles(fileInput.files));

async function handleFiles(files) {
  const validFiles = Array.from(files).filter(file => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    return isImage || isVideo;
  });

  if (!validFiles.length) return;

  const slot = uploadType.value;
  const title = uploadTitle.value.trim();
  const description = uploadDescription.value.trim();

  if (await saveFilesToFolder(slot, title, description, validFiles)) {
    fileInput.value = '';
    uploadTitle.value = '';
    uploadDescription.value = '';
    return;
  }

  validFiles.forEach(file => {
    const isVideo = file.type.startsWith('video/');
    const fallbackTitle = title || cleanFileName(file.name);
    const fallbackDescription = description || defaultDescription(slot);
    const item = {
      id: `user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      url: URL.createObjectURL(file),
      fileName: file.name,
      title: fallbackTitle,
      description: fallbackDescription,
      isVideo,
      saved: true
    };

    uploadStore[slot].push(item);
    saveUpload(slot, item, file);
    renderSlotCard(slot);
    applyActiveFilter();

    gallery.prepend(createGalleryItem(slot, item));
  });
  fileInput.value = '';
  uploadTitle.value = '';
  uploadDescription.value = '';
}

async function initMedia() {
  const loadedFromFolder = await loadFolderMedia();
  if (loadedFromFolder) return;

  await loadPreloadedMedia();
  loadSavedUploads();
}

async function loadFolderMedia() {
  try {
    const response = await fetch('/api/media');
    if (!response.ok) return false;
    const data = await response.json();
    if (!Array.isArray(data.items)) return false;

    data.items.forEach(item => {
      if (!uploadStore[item.slot]) return;
      uploadStore[item.slot].push(item);
      gallery.appendChild(createGalleryItem(item.slot, item));
    });

    Object.keys(uploadStore).forEach(renderSlotCard);
    applyActiveFilter();
    return true;
  } catch {
    return false;
  }
}

async function saveFilesToFolder(slot, title, description, files) {
  try {
    const form = new FormData();
    form.append('slot', slot);
    form.append('title', title);
    form.append('description', description);
    files.forEach(file => form.append('files', file, file.name));

    const response = await fetch('/api/upload', { method: 'POST', body: form });
    if (!response.ok) return false;

    const data = await response.json();
    if (!Array.isArray(data.items)) return false;

    data.items.forEach(item => {
      uploadStore[item.slot].push(item);
      gallery.prepend(createGalleryItem(item.slot, item));
      renderSlotCard(item.slot);
    });
    applyActiveFilter();
    return true;
  } catch {
    return false;
  }
}
async function loadPreloadedMedia() {
  const metadata = await loadStaticMetadata();
  Object.entries(preloadedMedia).forEach(([slot, files]) => {
    const prepared = files
      .map((file, index) => {
        const saved = metadata[`${slot}/${file.fileName}`] || {};
        return {
          file,
          index,
          saved,
          pinnedAt: Number(saved.pinnedAt || 0)
        };
      })
      .sort((a, b) => b.pinnedAt - a.pinnedAt || a.index - b.index);

    prepared.forEach(({ file, index, saved }) => {
      const item = {
        id: `preloaded-${slot}-${index}`,
        url: file.url,
        externalUrl: file.externalUrl,
        fileName: file.fileName,
        title: saved.title || file.title || cleanFileName(file.fileName),
        description: saved.description || file.description || defaultDescription(slot),
        isVideo: Boolean(file.isVideo),
        pinnedAt: Number(saved.pinnedAt || 0)
      };

      uploadStore[slot].push(item);
      gallery.appendChild(createGalleryItem(slot, item));
    });

    renderSlotCard(slot);
  });

  applyActiveFilter();
}

async function loadStaticMetadata() {
  try {
    const response = await fetch('portfolio-media.json', { cache: 'no-store' });
    if (!response.ok) return {};
    return await response.json();
  } catch {
    return {};
  }
}

function renderSlotCard(slot) {
  const card = document.querySelector(`.work-card[data-slot="${slot}"]`);
  const items = uploadStore[slot] || [];
  if (!card) return;

  if (upcomingSlots.has(slot)) {
    const playlistUrl = playlistLinks[slot];
    card.querySelector('.work-thumb').innerHTML = `
      <div class="work-upcoming">
        <span>${slot === 'sound' ? 'Motion Playlist' : 'Video Playlist'}</span>
      </div>
    `;
    card.querySelector('.work-info').innerHTML = `
      <span class="work-tag">${slotLabels[slot]}</span>
      <h3>${slot === 'sound' ? 'Motion Video Playlist' : 'Video Editing Playlist'}</h3>
      <p>Watch the full ${slot === 'sound' ? 'motion video' : 'video editing'} playlist on YouTube.</p>
      <a class="playlist-btn" href="${playlistUrl}" target="_blank" rel="noopener">Open Playlist</a>
    `;
    return;
  }

  if (!items.length) {
    card.querySelector('.work-thumb').innerHTML = originalSlots[slot].thumb;
    card.querySelector('.work-info').innerHTML = originalSlots[slot].info;
    return;
  }

  const first = items[0];
  const thumb = card.querySelector('.work-thumb');
  const info = card.querySelector('.work-info');
  thumb.innerHTML = '';

  const media = createPreviewMedia(first);
  media.addEventListener('click', e => {
    e.stopPropagation();
    openMediaViewer(first);
  });

  const overlay = document.createElement('div');
  overlay.className = 'work-overlay';
  overlay.innerHTML = `<span>${items.length > 1 ? 'Open Collection' : 'View Project'}</span>`;

  thumb.appendChild(media);
  thumb.appendChild(overlay);

  info.innerHTML = `
    <span class="work-tag">${slotLabels[slot]}</span>
    <h3>${escapeHtml(first.title)}</h3>
    <p>${escapeHtml(first.description || defaultDescription(slot))}</p>
    ${items.length > 1 ? '<button class="more-btn" type="button">More</button>' : ''}
  `;

  const moreBtn = info.querySelector('.more-btn');
  if (moreBtn) moreBtn.addEventListener('click', () => openSlotViewer(slot));
}

function createGalleryItem(slot, upload) {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.dataset.slot = slot;
  item.dataset.id = upload.id;

  const media = createPreviewMedia(upload);
  media.addEventListener('click', e => {
    e.stopPropagation();
    openMediaViewer(upload);
  });

  const tag = document.createElement('span');
  tag.className = 'gallery-tag';
  tag.textContent = slotLabels[slot];

  const edit = document.createElement('button');
  edit.className = 'edit-btn';
  edit.textContent = 'Edit';
  edit.setAttribute('aria-label', 'Edit title and description');
  edit.addEventListener('click', () => openEditViewer(slot, upload.id));

  const del = document.createElement('button');
  del.className = 'del-btn';
  del.innerHTML = '&times;';
  del.setAttribute('aria-label', 'Remove');
  del.addEventListener('click', async () => {
    if (upload.folderSaved && !(await deleteFolderMedia(slot, upload))) {
      alert('Could not delete this file from the folder.');
      return;
    }

    uploadStore[slot] = uploadStore[slot].filter(item => item.id !== upload.id);
    item.remove();
    if (upload.url.startsWith('blob:')) URL.revokeObjectURL(upload.url);
    if (upload.saved) deleteSavedUpload(upload.id);
    renderSlotCard(slot);
  });

  item.appendChild(media);
  item.appendChild(tag);
  item.appendChild(edit);
  item.appendChild(del);
  return item;
}

function createPreviewMedia(upload) {
  if (upload.externalUrl) {
    const preview = document.createElement('div');
    preview.className = 'drive-preview';
    preview.innerHTML = `
      <span class="drive-preview-icon">Drive</span>
      <strong>${escapeHtml(upload.title || upload.fileName)}</strong>
      <small>Open folder</small>
    `;
    return preview;
  }

  const media = document.createElement(upload.isVideo ? 'video' : 'img');
  media.src = upload.url;
  media.alt = upload.fileName;
  if (upload.isVideo) {
    media.controls = true;
    media.muted = true;
    media.playsInline = true;
  }
  return media;
}

function openSlotViewer(slot) {
  const items = uploadStore[slot] || [];
  if (!items.length) return;

  closeSlotViewer();

  const modal = document.createElement('div');
  modal.className = 'slot-modal';
  modal.innerHTML = `
    <div class="slot-panel">
      <div class="slot-head">
        <div>
          <p class="kicker">${slotLabels[slot]}</p>
          <h2>${slotLabels[slot]} uploads</h2>
        </div>
        <button class="slot-close" type="button" aria-label="Close">&times;</button>
      </div>
      <div class="slot-list"></div>
    </div>
  `;

  const list = modal.querySelector('.slot-list');
  items.forEach((upload, index) => {
    const entry = document.createElement('article');
    entry.className = 'slot-entry';
    const media = document.createElement(upload.isVideo ? 'video' : 'img');
    media.src = upload.url;
    media.alt = upload.fileName;
    if (upload.isVideo) {
      media.controls = true;
      media.playsInline = true;
    }
    media.addEventListener('click', e => {
      e.stopPropagation();
      openMediaViewer(upload);
    });
    entry.appendChild(media);
    entry.insertAdjacentHTML('beforeend', `
      <div class="slot-entry-info">
        <h3>${escapeHtml(upload.title)}</h3>
        <p>${escapeHtml(upload.description || defaultDescription(slot))}</p>
        <div class="slot-entry-actions">
          <button class="pin-btn" type="button" data-id="${upload.id}">${index === 0 ? 'Pinned' : 'Pin First'}</button>
          <button class="edit-btn" type="button" data-edit-id="${upload.id}">Edit</button>
        </div>
      </div>
    `);
    list.appendChild(entry);
  });

  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('.slot-close')) closeSlotViewer();
    const pinBtn = e.target.closest('.pin-btn');
    if (pinBtn) {
      pinUpload(slot, pinBtn.dataset.id);
      openSlotViewer(slot);
    }
    const editBtn = e.target.closest('[data-edit-id]');
    if (editBtn) {
      openEditViewer(slot, editBtn.dataset.editId);
    }
  });

  document.body.appendChild(modal);
}

function closeSlotViewer() {
  const old = document.querySelector('.slot-modal');
  if (old) old.remove();
}

function pinUpload(slot, id) {
  const items = uploadStore[slot] || [];
  const index = items.findIndex(item => item.id === id);
  if (index <= 0) return;
  const [pinned] = items.splice(index, 1);
  items.unshift(pinned);
  renderSlotCard(slot);
  if (pinned.folderSaved) savePinnedFolderMedia(slot, pinned);
}

function openEditViewer(slot, id) {
  const upload = findUpload(slot, id);
  if (!upload) return;

  closeSlotViewer();

  const modal = document.createElement('div');
  modal.className = 'slot-modal';
  modal.innerHTML = `
    <div class="slot-panel">
      <div class="slot-head">
        <div>
          <p class="kicker">${slotLabels[slot]}</p>
          <h2>Edit project details</h2>
        </div>
        <button class="slot-close" type="button" aria-label="Close">&times;</button>
      </div>
      <form class="edit-form">
        <input name="title" type="text" value="${escapeAttribute(upload.title)}" aria-label="Project title" />
        <textarea name="description" aria-label="Project description">${escapeHtml(upload.description || '')}</textarea>
        <button class="save-edit-btn" type="submit">Save Changes</button>
      </form>
    </div>
  `;

  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('.slot-close')) closeSlotViewer();
  });

  modal.querySelector('.edit-form').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.currentTarget;
    upload.title = form.elements.title.value.trim() || cleanFileName(upload.fileName);
    upload.description = form.elements.description.value.trim() || defaultDescription(slot);
    if (upload.folderSaved) updateFolderMediaDetails(slot, upload);
    if (upload.saved) updateSavedUploadDetails(slot, upload);
    renderSlotCard(slot);
    refreshGalleryItem(slot, upload);
    closeSlotViewer();
  });

  document.body.appendChild(modal);
}

function openMediaViewer(upload) {
  if (upload.externalUrl) {
    window.open(upload.externalUrl, '_blank', 'noopener');
    return;
  }

  closeMediaViewer();

  const modal = document.createElement('div');
  modal.className = 'media-viewer';

  const media = document.createElement(upload.isVideo ? 'video' : 'img');
  media.src = upload.url;
  media.alt = upload.fileName;
  if (upload.isVideo) {
    media.controls = true;
    media.autoplay = true;
    media.playsInline = true;
  }

  modal.innerHTML = `
    <div class="media-viewer-panel">
      <button class="media-viewer-close" type="button" aria-label="Close">&times;</button>
      <div class="media-viewer-stage"></div>
      <div class="media-viewer-info">
        <h3>${escapeHtml(upload.title)}</h3>
        <p>${escapeHtml(upload.description || '')}</p>
      </div>
    </div>
  `;

  modal.querySelector('.media-viewer-stage').appendChild(media);
  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('.media-viewer-close')) closeMediaViewer();
  });
  document.addEventListener('keydown', closeMediaViewerOnEscape);
  document.body.appendChild(modal);
}

function closeMediaViewer() {
  const old = document.querySelector('.media-viewer');
  if (old) old.remove();
  document.removeEventListener('keydown', closeMediaViewerOnEscape);
}

function closeMediaViewerOnEscape(e) {
  if (e.key === 'Escape') closeMediaViewer();
}

async function savePinnedFolderMedia(slot, upload) {
  try {
    await fetch('/api/pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot, fileName: upload.fileName })
    });
  } catch {
    // Pin still works visually if the server is unavailable.
  }
}
function findUpload(slot, id) {
  return (uploadStore[slot] || []).find(item => item.id === id);
}

function refreshGalleryItem(slot, upload) {
  const item = Array.from(gallery.querySelectorAll('.gallery-item')).find(card => {
    return card.dataset.slot === slot && card.dataset.id === upload.id;
  });
  if (!item) return;
  item.replaceWith(createGalleryItem(slot, upload));
}

function applyActiveFilter() {
  const active = document.querySelector('.f-btn.active');
  if (active) active.click();
}

async function updateFolderMediaDetails(slot, upload) {
  try {
    await fetch('/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slot,
        fileName: upload.fileName,
        title: upload.title,
        description: upload.description
      })
    });
  } catch {
    // The page can still update visually if the server is not running.
  }
}

async function deleteFolderMedia(slot, upload) {
  try {
    const response = await fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot, fileName: upload.fileName })
    });
    return response.ok;
  } catch {
    return false;
  }
}
function openMediaDB() {
  if (!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB is not available.'));

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(mediaDBName, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(mediaDBStore)) {
        const store = db.createObjectStore(mediaDBStore, { keyPath: 'id' });
        store.createIndex('slot', 'slot', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveUpload(slot, upload, file) {
  try {
    const db = await openMediaDB();
    const tx = db.transaction(mediaDBStore, 'readwrite');
    tx.objectStore(mediaDBStore).put({
      id: upload.id,
      slot,
      fileName: upload.fileName,
      title: upload.title,
      description: upload.description,
      isVideo: upload.isVideo,
      createdAt: Date.now(),
      blob: file
    });
  } catch (error) {
    console.warn('Could not save upload:', error);
  }
}

async function loadSavedUploads() {
  try {
    const db = await openMediaDB();
    const uploads = await new Promise((resolve, reject) => {
      const tx = db.transaction(mediaDBStore, 'readonly');
      const request = tx.objectStore(mediaDBStore).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    uploads
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
      .forEach(saved => {
        if (!uploadStore[saved.slot]) return;
        const item = {
          id: saved.id,
          url: URL.createObjectURL(saved.blob),
          fileName: saved.fileName,
          title: saved.title || cleanFileName(saved.fileName),
          description: saved.description || defaultDescription(saved.slot),
          isVideo: Boolean(saved.isVideo),
          saved: true
        };

        uploadStore[saved.slot].push(item);
        gallery.appendChild(createGalleryItem(saved.slot, item));
        renderSlotCard(saved.slot);
      });

    applyActiveFilter();
  } catch (error) {
    console.warn('Could not load saved uploads:', error);
  }
}

async function deleteSavedUpload(id) {
  try {
    const db = await openMediaDB();
    const tx = db.transaction(mediaDBStore, 'readwrite');
    tx.objectStore(mediaDBStore).delete(id);
  } catch (error) {
    console.warn('Could not delete saved upload:', error);
  }
}

async function updateSavedUploadDetails(slot, upload) {
  try {
    const db = await openMediaDB();
    const tx = db.transaction(mediaDBStore, 'readwrite');
    const store = tx.objectStore(mediaDBStore);
    const request = store.get(upload.id);

    request.onsuccess = () => {
      const saved = request.result;
      if (!saved) return;
      saved.slot = slot;
      saved.title = upload.title;
      saved.description = upload.description;
      store.put(saved);
    };
  } catch (error) {
    console.warn('Could not update saved upload:', error);
  }
}
function cleanFileName(name) {
  return name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
}

function defaultDescription(slot) {
  return `${slotLabels[slot]} portfolio project.`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, '&#096;');
}

/* ---- Contact form ---- */
const msgForm  = document.getElementById('msgForm');
const formNote = document.getElementById('formNote');

const contactEndpoint = 'https://formsubmit.co/ajax/contact.abdurrohman@gmail.com';

msgForm.addEventListener('submit', async e => {
  e.preventDefault();

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const service = document.getElementById('fservice').value;
  const msg     = document.getElementById('fmsg').value.trim();

  if (!name || !email || !msg) {
    formNote.style.color = '#f87171';
    formNote.textContent = 'Please fill in all required fields.';
    return;
  }

  formNote.style.color = '#fbbf24';
  formNote.textContent = 'Sending message...';

  try {
    const response = await fetch(contactEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        service: service || 'General',
        message: msg,
        _subject: `Portfolio Enquiry - ${service || 'General'}`,
        _template: 'table',
        _captcha: 'false'
      })
    });

    if (!response.ok) throw new Error('Message failed');

    formNote.style.color = '#34d399';
    formNote.textContent = 'Message sent successfully.';
    msgForm.reset();
  } catch {
    formNote.style.color = '#f87171';
    formNote.textContent = 'Message could not be sent. Please try again later.';
  }

  setTimeout(() => {
    formNote.textContent = '';
  }, 5000);
});

/* ---- Smooth active nav on scroll ---- */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active-nav'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active-nav');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObs.observe(s));






