# Palette Studio — Themed Site

Static demo site with a 4-color theme switcher. No build step — open `index.html` in a browser.

## Included palettes

These hex values are chosen interpretations of the supplied color names.

| Theme | Colors |
| --- | --- |
| Ecru & Terracotta | Ecru `#F0E6D2`, light warm gray `#D6D1CA`, medium terracotta `#C4775B`, dark brown `#493127` |
| Chartreuse & Red | Warm white `#FAF7F0`, light tan `#D8BE9C`, chartreuse `#C5D83D`, muted warm red `#AE5147` |
| Pink & Forest | Beige `#E8DCC8`, soft pink `#EAC3CC`, bright orange `#FF751A`, forest green `#244B38` |
| Yellow & Navy | White `#FFFFFF`, light warm gray `#D6D1CA`, vivid yellow `#FFE000`, dark navy `#14243B` |
| Blue & Red | Dark blue `#182D50`, muted red `#B64D56`, medium gray `#888888`, off-white `#F5F3ED` |

## Adding a theme

Append an entry to `themes.js`:

```js
{ id: "my-theme", name: "My Theme", colors: { background: "#FFFFFF", primary: "#123456", secondary: "#654321", accent: "#FFCC00" } },
```

- **background** – page background
- **primary** – header, primary buttons, links
- **secondary** – stats band, secondary buttons
- **accent** – badges, tags, highlights

Every palette automatically has Light and Dark variants. The Light/Dark buttons
next to the palette dropdown select the mode and preserve it when changing palettes.
Relative luminance determines the lightest and darkest shades: Light uses the
lightest background and darkest primary; Dark reverses those roles. Colors are
swapped between roles so all four original colors remain in use. Palette previews
reflect the selected mode. New palettes get both variants without extra configuration.

Readable text colors for each role are computed automatically. The selected palette
and mode are saved in `localStorage` and restored on the next visit. The default mode
is Light.
