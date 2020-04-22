// ==UserScript==
// @namespace       https://openuserjs.org/users/Taddiboy
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
// @copyright       2020, Taddiboy (https://openuserjs.org/users/Taddiboy)
// @license         MIT
// @author          Taddiboy
// @version         1.1.0
// @icon            https://i.imgur.com/7OeXVaf.png
// @include         https://*.google.tld/*tbm=isch*
// @grant           GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  // Add Google's own CSS used for image dimensions
  GM_addStyle(`
  .img-dims {
    background-color: rgba(0,0,0,.5);
    border-radius: 2px 0 0 0;
    bottom: 0;
    box-shadow: 0 0 1px 0 rgba(0,0,0,.16);
    box-sizing: border-box;
    color: #f1f3f4;
    font-family: Roboto-Medium,Roboto,arial,sans-serif;
    font-size: 10px;
    right: 0;
    line-height: 12px;
    overflow: hidden;
    padding: 4px;
    position: absolute;
    white-space: nowrap;
  }
  `);

  function showDims() {
    // Find all thumbnails & exclude the "already handled" class we set below
    const images = document.querySelectorAll('[data-ow]:not(.img-dims-added)');

    // Loop through all thumbnails
    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      // Get original width from 'data-ow' attribute
      const width = image.getAttribute('data-ow');

      // Get original height from 'data-oh' attribute
      const height = image.getAttribute('data-oh');

      // Create DIV and insert text
      const dimensionsDiv = document.createElement("div");
      const dimensionsContent = document.createTextNode(width + " × " + height);
      dimensionsDiv.appendChild(dimensionsContent);

      // Assign CSS class
      dimensionsDiv.classList.add("img-dims");

      // Append everything to thumbnail
      image.firstChild.appendChild(dimensionsDiv);

      // Add "already handled" type of class to the thumbnail
      image.classList.add("img-dims-added");
    }
  }

  // Run script once on document ready
  showDims();

  // Initialize new MutationObserver
  const mutationObserver = new MutationObserver(showDims);

  // Let MutationObserver target the grid containing all thumbnails
  const targetNode = document.querySelector('div[data-id="GRID_STATE0"]');

  // Run MutationObserver
  mutationObserver.observe(targetNode, {childList: true,subtree: true});
})();