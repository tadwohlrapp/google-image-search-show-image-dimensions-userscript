// ==UserScript==
// @name            Google Image Search - Show Image Dimensions
// @name:de         Google Bildersuche - Bildabmessungen anzeigen
// @name:fr         Google Image Search - Afficher les dimensions de l'image
// @name:es         Búsqueda de imágenes de Google - Mostrar las dimensiones de la imagen
// @name:it         Ricerca immagini su Google - Mostra le dimensioni delle immagini
// @name:pl         Wyszukiwanie obrazów Google - Pokaż wymiary obrazu
// @name:ru         Поиск изображений Google - Показать размеры изображений
// @description     Displays image dimensions (eg. "1920 × 1080") for each thumbnail on the Google Image Search results page.
// @description:de  Zeigt die Bildabmessungen (z. B. "1920 × 1080") für jedes Vorschaubild auf der Ergebnisseite der Google-Bildsuche an.
// @description:fr  Affiche les dimensions de l'image (par exemple, "1920 × 1080") pour chaque miniature sur la page de résultats de Google Image Search.
// @description:es  Muestra las dimensiones de la imagen (p. ej., "1920 × 1080") para cada miniatura de la página de resultados de Google Image Search.
// @description:it  Visualizza le dimensioni dell'immagine (ad es. "1920 × 1080") per ogni miniatura nella pagina dei risultati della ricerca immagini di Google.
// @description:pl  Wyświetla wymiary obrazu (np. "1920 × 1080") dla każdej miniaturki na stronie wyników wyszukiwania obrazów Google.
// @description:ru  Отображает размеры изображения (например, "1920 × 1080") для каждой миниатюры на странице результатов поиска изображений Google.
// @namespace       https://github.com/tadwohlrapp
// @author          Tad Wohlrapp
// @version         1.5.0
// @license         MIT
// @homepageURL     https://github.com/tadwohlrapp/google-image-search-show-image-dimensions-userscript
// @supportURL      https://github.com/tadwohlrapp/google-image-search-show-image-dimensions-userscript/issues
// @icon            https://github.com/tadwohlrapp/google-image-search-show-image-dimensions-userscript/raw/main/icon.png
// @grant           unsafeWindow
// @include         https://*.google.tld/*tbm=isch*
// @include         https://*.google.tld/*udm=2*
// @compatible      firefox Tested on Firefox v146 with Violentmonkey v2.31.0, Tampermonkey v5.4.1 and Greasemonkey v4.13.0
// @compatible      chrome Tested on Chrome v143 with Violentmonkey v2.31.0 and Tampermonkey v5.4.1
// @compatible      edge Tested on Edge v143 with Violentmonkey v2.31.0 and Tampermonkey v5.4.0
// @compatible      opera Tested on Opera v125 with Tampermonkey v5.3.6222
// @downloadURL     https://update.greasyfork.org/scripts/401432/Google%20Image%20Search%20-%20Show%20Image%20Dimensions.user.js
// @updateURL       https://update.greasyfork.org/scripts/401432/Google%20Image%20Search%20-%20Show%20Image%20Dimensions.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DELAY_TIME = 500;

  function showDims() {
    setTimeout(() => {
      // Find all results & exclude the "already handled" class we set below
      const results = document.querySelectorAll('div[data-attrid="images universal"]:not(.img-dims)');

      // Loop through all results
      results.forEach((result) => {
        try {
          // Get result ID from jsdata attribute
          const jsdata = result.getAttribute('jsdata');
          const resultId = jsdata.split(';')[2];

          // Access "W_jd" in window object
          const W_jd = unsafeWindow.W_jd;
          const rawResultData = W_jd[resultId];
          const symbols = Object.getOwnPropertySymbols(rawResultData);

          // Traverse down to the data we want
          const level0 = rawResultData[symbols[0]];
          if (!level0) return;
          const level1 = Object.values(level0)[0]?.[1];
          if (!level1) return;
          const level2 = Object.values(level1)[0]?.[3];
          if (!level2) return;

          // Extract full res URL, width and height. Abort if not found
          const [imgurl, height, width] = level2;
          if (!width || !height || !imgurl) return;

          // Filter out Meta sites & TikTok which prevent direct full res linking. It's brainrot anyways
          const hn = (new URL(imgurl)).hostname;
          const goodUrl = !hn.startsWith('lookaside') && !hn.startsWith('www.tiktok.com');

          // Create svg icon for full res lightbox
          const icon = createSVG('svg', { viewBox: '0 0 24 24', width: '16', height: '16' }, [
            createSVG('path', { d: 'M19 21H5l-2-2V5l2-2h7v2H5v14h14v-7h2v7l-2 2z' }),
            createSVG('path', { d: 'M21 10h-2V5h-5V3h7z' }),
            createSVG('path', { d: 'M8 14 19 3l2 2-11 11z' })
          ]);

          // Create element for dimensions text
          const dimensionsElement = document.createElement(goodUrl ? 'a' : 'p');
          dimensionsElement.textContent = '';
          if (goodUrl) dimensionsElement.append(icon);
          dimensionsElement.append(`${width} × ${height}`);
          dimensionsElement.classList.add('dims');

          // Create full res link
          if (goodUrl) {
            dimensionsElement.href = imgurl;
            dimensionsElement.onclick = (e) => {
              if (!isKeyPressed) {
                e.preventDefault();
                showLightbox(imgurl);
              }
            };
          }

          // Append everything to the thumbnail
          const thumbnail = result.querySelector('h3');
          thumbnail.append(dimensionsElement);

          // Add CSS class to result
          result.classList.add('img-dims');
        } catch (error) {
          console.warn('Show Image Dimensions UserScript:', error);
        }
      });
    }, DELAY_TIME);
  }

  // Run script once on document ready
  showDims();

  // Initialize new MutationObserver
  const mutationObserver = new MutationObserver(showDims);

  // Let MutationObserver target the grid containing all results
  const targetNode = document.querySelector('div#rso');

  // Run MutationObserver
  mutationObserver.observe(targetNode, { childList: true, subtree: true });

  // Create lightbox for full res images
  const lightboxBackdrop = document.createElement('div');
  lightboxBackdrop.classList.add('img-backdrop');
  const lightboxWrap = document.createElement('div');
  lightboxWrap.classList.add('img-wrap');
  const lightboxImg = document.createElement('img');
  lightboxWrap.append(lightboxImg);
  lightboxBackdrop.append(lightboxWrap);
  document.body.append(lightboxBackdrop);

  let isKeyPressed = false;
  document.addEventListener('keydown', () => isKeyPressed = true);
  document.addEventListener('keyup', () => isKeyPressed = false);

  // Show full res image
  const showLightbox = imgurl => {
    lightboxBackdrop.classList.add('show');
    lightboxImg.src = imgurl;
    lightboxImg.onload = () => {
      lightboxWrap.classList.add('show');
    }
    lightboxBackdrop.onclick = (e) => {
      hideLightbox(e);
    };
    lightboxImg.onclick = (e) => {
      window.open(imgurl, '_blank');
    };
    document.addEventListener('keydown', closeOnEsc);
  }

  // Hide full res image
  const hideLightbox = () => {
    lightboxBackdrop.classList.remove('show');
    lightboxWrap.classList.remove('show');
    lightboxImg.removeAttribute('src');
    delete lightboxImg.dataset.ilt;
    document.removeEventListener('keydown', closeOnEsc);
  }

  const closeOnEsc = (e) => {
    if (e.key === 'Escape') hideLightbox(e);
  };

  // Helper function to generate small svg icon
  const createSVG = (type, attrs = {}, children = []) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', type);
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
    if (children.length > 0) el.append(...children);
    return el;
  }

  // Add CSS function
  const addStyles = css => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Styles for dimensions and full res lightbox
  addStyles(`
    .img-dims .dims {
      display: flex;
      gap: 3px;
      position: absolute;
      bottom: 0;
      right: 0;
      margin: 0;
      padding: 4px;
      color: #f1f3f4;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 2px 0 12px 0;
      font-family: Roboto-Medium, Roboto, Arial, sans-serif;
      font-size: 10px;
      line-height: 12px;
      text-decoration: none;
    }
    .img-dims .dims svg {
      fill: #f1f3f4;
      height: 12px;
      width: 12px;
      opacity: 0.4;
    }
    .img-dims .dims:hover svg {
      opacity: 1;
    }
    .img-backdrop {
      position: fixed;
      display: flex;
      pointer-events: none;
      opacity: 0;
      transition: all 0.2s ease-in-out;
      top: 0;
      left: 0;
      z-index: 1010;
      justify-content: center;
      align-items: center;
    }
    .img-backdrop.show {
      pointer-events: all;
      bottom: 0;
      right: 0;
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.6);
    }
    .img-backdrop.show .img-wrap {
      z-index: 1011;
      border-radius: 12px;
      cursor: pointer;
      display: block;
      position: relative;
      overflow: hidden;
      transition: all 0.2s ease-in-out;
      background-color: rgba(255, 255, 255, 0.33);
      box-shadow: inset 0px 0px 50px 10px rgba(0, 0, 0, 0.66);
    }
    .img-backdrop.show .img-wrap img {
      position: relative;
      display: block;
      z-index: 1012;
      max-width: 95vw;
      max-height: 95vh;
      opacity: 0;
      transition: all 0.2s ease-in-out;
    }
    .img-backdrop.show .img-wrap.show {
      background-color: #fff;
      box-shadow: 0px 0px 100px 20px rgba(0, 0, 0, 0.66);
    }
    .img-backdrop.show .img-wrap.show img {
      opacity: 1;
    }
  `);
})();
