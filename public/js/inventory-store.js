/** Varasto: API (Vercel/local) + session PIN. */
(function () {
  const AUTH_KEY = 'tapsa_admin_auth_v1';
  const PIN_KEY = 'tapsa_admin_pin_v1';

  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  const api = async (path, options = {}) => {
    const headers = { Accept: 'application/json', ...(options.headers || {}) };
    if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    const res = await fetch(path, { cache: 'no-store', ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || `HTTP ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  };

  window.TapsaInventory = {
    escapeHtml,

    async fetchInventory(seedParts = [], seedVehicles = []) {
      try {
        const data = await api('/api/inventory');
        return {
          parts: Array.isArray(data.parts) ? data.parts : seedParts,
          vehicles: Array.isArray(data.vehicles) ? data.vehicles : seedVehicles,
          storage: data.storage,
          updatedAt: data.updatedAt,
        };
      } catch {
        return {
          parts: structuredClone(seedParts),
          vehicles: structuredClone(seedVehicles),
          storage: 'offline',
        };
      }
    },

    async saveInventory(parts, vehicles) {
      const pin = sessionStorage.getItem(PIN_KEY) || '';
      return api('/api/inventory', {
        method: 'PUT',
        headers: { 'x-admin-pin': pin },
        body: JSON.stringify({ parts, vehicles }),
      });
    },

    async login(pin) {
      const data = await api('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ pin: String(pin ?? '') }),
      });
      if (data.ok) {
        sessionStorage.setItem(AUTH_KEY, '1');
        sessionStorage.setItem(PIN_KEY, String(pin ?? ''));
      }
      return data;
    },

    logout() {
      sessionStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem(PIN_KEY);
    },

    isAuthed() {
      return sessionStorage.getItem(AUTH_KEY) === '1' && Boolean(sessionStorage.getItem(PIN_KEY));
    },

    newPartId() {
      return uid('P');
    },

    newVehicleId() {
      return uid('v');
    },

    partCardHtml(part) {
      const label = `${part.title} – ${part.make} ${part.model}${part.code ? ` (${part.code})` : ''}`;
      const inquire = `/varaosakysely/?osa=${encodeURIComponent(label)}&merkki=${encodeURIComponent(`${part.make} ${part.model}`)}`;
      const year =
        part.yearFrom || part.yearTo ? ` · ${part.yearFrom ?? '?'}–${part.yearTo ?? '?'}` : '';

      return `
        <article class="product part-card" data-part
          data-id="${escapeHtml(part.id)}"
          data-make="${escapeHtml(part.make)}"
          data-model="${escapeHtml(part.model)}"
          data-category="${escapeHtml(part.category)}"
          data-title="${escapeHtml(part.title)}"
          data-engine="${escapeHtml(part.engine ?? '')}"
          data-code="${escapeHtml(part.code ?? '')}"
          data-note="${escapeHtml(part.note ?? '')}"
          data-year-from="${part.yearFrom ?? ''}"
          data-year-to="${part.yearTo ?? ''}">
          <div class="part-card__top">
            <span class="tag">${escapeHtml(part.category)}</span>
            ${part.warranty ? '<span class="tag tag--navy">Takuu</span>' : ''}
            ${part.condition === 'Uusi' ? '<span class="tag tag--accent">Uusi</span>' : ''}
          </div>
          <h3>${escapeHtml(part.title)}</h3>
          <p class="part-card__vehicle">${escapeHtml(part.make)} ${escapeHtml(part.model)}${escapeHtml(year)}</p>
          <dl>
            <dt>Tuotenro</dt><dd>${escapeHtml(part.id)}</dd>
            ${part.engine ? `<dt>Moottori</dt><dd>${escapeHtml(part.engine)}</dd>` : ''}
            ${part.code ? `<dt>Koodi</dt><dd>${escapeHtml(part.code)}</dd>` : ''}
            ${part.note ? `<dt>Huom</dt><dd>${escapeHtml(part.note)}</dd>` : ''}
          </dl>
          <div class="price">${part.price != null ? `<strong>${escapeHtml(part.price)} €</strong>` : '<strong>Kysy hinta</strong>'}</div>
          <a class="btn btn--primary" href="${inquire}">Kysy tätä osaa</a>
        </article>`;
    },

    vehicleCardHtml(v) {
      const label = `${v.make} ${v.model}`;
      const inquire = `/varaosakysely/?merkki=${encodeURIComponent(label)}&osa=${encodeURIComponent(`Osat autosta: ${label}${v.year ? ` (${v.year})` : ''}`)}`;
      return `
        <article class="product" data-vehicle-id="${escapeHtml(v.id)}">
          ${
            v.image
              ? `<img src="${escapeHtml(v.image)}" alt="${escapeHtml(label)}" loading="lazy" width="640" height="480" style="border-radius:8px;margin-bottom:1rem;aspect-ratio:4/3;object-fit:cover;width:100%" />`
              : ''
          }
          <span class="tag">${escapeHtml(v.status)}</span>
          <h3>${escapeHtml(label)}</h3>
          <dl>
            ${v.year ? `<dt>Vuosimalli</dt><dd>${escapeHtml(v.year)}</dd>` : ''}
            ${v.engine ? `<dt>Moottori</dt><dd>${escapeHtml(v.engine)}</dd>` : ''}
            ${v.gearbox ? `<dt>Vaihteisto</dt><dd>${escapeHtml(v.gearbox)}</dd>` : ''}
            ${v.fuel ? `<dt>Polttoaine</dt><dd>${escapeHtml(v.fuel)}</dd>` : ''}
            ${v.body ? `<dt>Korityyppi</dt><dd>${escapeHtml(v.body)}</dd>` : ''}
            ${v.color ? `<dt>Väri</dt><dd>${escapeHtml(v.color)}</dd>` : ''}
          </dl>
          ${v.note ? `<p class="note" style="margin-top:0;margin-bottom:1rem">${escapeHtml(v.note)}</p>` : ''}
          <a class="btn btn--primary" href="${inquire}">Kysy osia</a>
        </article>`;
    },
  };
})();
