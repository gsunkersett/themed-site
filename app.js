(function () {
  const STORAGE_KEY = "themed-site:theme";
  const MODE_STORAGE_KEY = "themed-site:mode";
  const themes = window.THEMES || [];
  const root = document.documentElement;
  const savedMode = localStorage.getItem(MODE_STORAGE_KEY);
  let mode = savedMode === "dark" ? "dark" : "light";

  function luminance(hex) {
    const n = parseInt(hex.replace("#", ""), 16);
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  }

  // Pick near-black or near-white text, whichever contrasts better.
  function onColor(hex) {
    const L = luminance(hex);
    const dark = (L + 0.05) / (0.012 + 0.05);
    const light = (1.05) / (L + 0.05);
    return dark >= light ? "#161616" : "#FAFAFA";
  }

  function colorsForMode(colors) {
    const c = { ...colors };
    const sorted = Object.values(c).sort((a, b) => luminance(a) - luminance(b));
    const background = mode === "dark" ? sorted[0] : sorted[sorted.length - 1];
    const primary = mode === "dark" ? sorted[sorted.length - 1] : sorted[0];
    // Swap roles rather than replacing colors so the whole palette stays in use.
    for (const [role, color] of [["background", background], ["primary", primary]]) {
      const source = Object.keys(c).find((key) => c[key] === color);
      [c[role], c[source]] = [c[source], c[role]];
    }
    return c;
  }

  function applyTheme(id) {
    const theme = themes.find((t) => t.id === id) || themes[0];
    if (!theme) return;
    const c = colorsForMode(theme.colors);
    for (const role of ["background", "primary", "secondary", "accent"]) {
      root.style.setProperty(`--color-${role}`, c[role]);
      root.style.setProperty(`--on-${role}`, onColor(c[role]));
    }
    root.dataset.scheme = mode;
    root.style.colorScheme = mode;
    root.dataset.theme = theme.id;
    localStorage.setItem(STORAGE_KEY, theme.id);
    localStorage.setItem(MODE_STORAGE_KEY, mode);
    document.querySelectorAll("button[data-mode]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
    });
    renderSwitcher(theme.id);
  }

  function swatches(colors) {
    const c = colorsForMode(colors);
    return ["background", "primary", "secondary", "accent"]
      .map((r) => `<span style="background:${c[r]}" title="${r}: ${c[r]}"></span>`)
      .join("");
  }

  function renderSwitcher(activeId) {
    const list = document.getElementById("theme-list");
    const current = document.getElementById("theme-current");
    const active = themes.find((t) => t.id === activeId);
    if (current && active) current.innerHTML = `<span class="swatches">${swatches(active.colors)}</span><span class="label">${active.name}</span>`;
    if (!list) return;
    list.innerHTML = themes
      .map(
        (t) => `<li role="option" aria-selected="${t.id === activeId}">
          <button type="button" data-theme="${t.id}">
            <span class="swatches">${swatches(t.colors)}</span>
            <span class="label">${t.name}</span>
          </button></li>`
      )
      .join("");

    const gallery = document.getElementById("palette-gallery");
    if (gallery) {
      gallery.innerHTML = themes
        .map(
          (t) => `<button type="button" class="palette-card${t.id === activeId ? " active" : ""}" data-theme="${t.id}">
            <span class="swatches big">${swatches(t.colors)}</span>
            <span class="label">${t.name}</span>
          </button>`
        )
        .join("");
    }
  }

  const switcher = document.getElementById("theme-switcher");
  const toggle = document.getElementById("theme-toggle");

  function setSwitcherOpen(open) {
    switcher.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  document.addEventListener("click", (e) => {
    const modeButton = e.target.closest("button[data-mode]");
    if (modeButton) {
      mode = modeButton.dataset.mode;
      applyTheme(root.dataset.theme);
      setSwitcherOpen(false);
      return;
    }
    const btn = e.target.closest("button[data-theme]");
    if (btn) {
      const fromSwitcher = switcher.contains(btn);
      applyTheme(btn.dataset.theme);
      setSwitcherOpen(false);
      if (fromSwitcher) toggle.focus();
      return;
    }
    if (e.target.closest("#theme-toggle")) {
      setSwitcherOpen(!switcher.classList.contains("open"));
    } else if (!e.target.closest("#theme-switcher")) {
      setSwitcherOpen(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && switcher.classList.contains("open")) {
      setSwitcherOpen(false);
      toggle.focus();
    }
  });

  applyTheme(localStorage.getItem(STORAGE_KEY) || (themes[0] && themes[0].id));
})();
