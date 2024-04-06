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
// @version         1.4.0
// @license         MIT
// @homepageURL     https://github.com/tadwohlrapp/google-image-search-show-image-dimensions-userscript
// @supportURL      https://github.com/tadwohlrapp/google-image-search-show-image-dimensions-userscript/issues
// @icon            https://github.com/tadwohlrapp/google-image-search-show-image-dimensions-userscript/raw/main/icon.png
// @inject-into     content
// @include         https://*.google.tld/*tbm=isch*
// @include         https://*.google.tld/*udm=2*
// @compatible      firefox Tested on Firefox v124 with Violentmonkey v2.18.0, Tampermonkey v5.1.0 and Greasemonkey v4.12.0
// @compatible      chrome Tested on Chrome v123 with Violentmonkey v2.18.0 and Tampermonkey v5.1.0
// @downloadURL     https://update.greasyfork.org/scripts/401432/Google%20Image%20Search%20-%20Show%20Image%20Dimensions.user.js
// @updateURL       https://update.greasyfork.org/scripts/401432/Google%20Image%20Search%20-%20Show%20Image%20Dimensions.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const isNewUi = (new URL(location.href).searchParams.get('udm') === '2') && !(new URL(location.href).searchParams.get('tbm'));
  const DELAY_TIME = 500;

  // Add Google's own CSS used for image dimensions
  addGlobalStyle(`
    .img-dims p {
      position: absolute;
      bottom: 0;
      right: 0;
      margin: 0;
      padding: 4px;
      color: #f1f3f4;
      background-color: rgba(0,0,0,.6);
      border-radius: 2px 0 ${isNewUi ? `12px` : `0`} 0;
      font-family: Roboto-Medium,Roboto,Arial,sans-serif;
      font-size: 10px;
      line-height: 12px;
    }
  `);

  function showDims() {

    // Find all thumbnails & exclude the "already handled" class we set below
    const thumbnails = document.querySelectorAll(
      isNewUi ? 'div[data-attrid="images universal"]:not(.img-dims)' : '[data-ow]:not(.img-dims):not([data-ismultirow])'
    );

    // Loop through all thumbnails
    thumbnails.forEach((thumbnail) => {
      try {
        if (isNewUi) {

          // Dispatch a mouseover event for every thumbnail to generate the href attribute
          const dimensionsTrigger = thumbnail.querySelector('h3>a:not([href])>div');
          if (!dimensionsTrigger) return;
          dimensionsTrigger.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

          setTimeout(() => {

            // Check if link element received its href attribute
            const linkElement = dimensionsTrigger.parentElement;
            if (linkElement?.href) {

              // Add CSS class to the thumbnail
              thumbnail.classList.add('img-dims');

              // Extract width and height from url parameters using destructuring
              const [, width, height] = /&w=(\d+)&h=(\d+)/.exec(linkElement.href) || [];

              // Create p tag and insert text
              const dimensionsElement = document.createElement('p');
              dimensionsElement.textContent = `${width} × ${height}`;

              // Append everything to thumbnail
              linkElement.appendChild(dimensionsElement);
            }
          }, DELAY_TIME);
        } else {

          // Get original width from 'data-ow' attribute
          const width = thumbnail.getAttribute('data-ow');

          // Get original height from 'data-oh' attribute
          const height = thumbnail.getAttribute('data-oh');

          // Create p tag and insert text
          const dimensionsElement = document.createElement('p');
          dimensionsElement.textContent = `${width} × ${height}`;

          // Append everything to thumbnail
          thumbnail.children[1].appendChild(dimensionsElement);

          // Add CSS class to the thumbnail
          thumbnail.classList.add('img-dims');
        }

      } catch (error) {
        console.error(error);
      }
    });
  }

  // Run script once on document ready
  showDims();

  // Initialize new MutationObserver
  const mutationObserver = new MutationObserver(showDims);

  // Let MutationObserver target the grid containing all thumbnails
  const targetNode = document.querySelector(isNewUi ? 'div#rso' : 'div[data-cid="GRID_STATE0"]');

  // Run MutationObserver
  mutationObserver.observe(targetNode, { childList: true, subtree: true });

  function addGlobalStyle(css) {
    const head = document.querySelector('head');
    if (!head) return;
    const style = document.createElement('style');
    style.textContent = css;
    head.appendChild(style);
  }
})();
