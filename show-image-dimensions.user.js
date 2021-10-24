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
// @copyright       2021, Taddiboy (https://openuserjs.org/users/Taddiboy)
// @license         MIT
// @author          Taddiboy
// @version         1.3.1
// @inject-into     content
// @icon            https://i.imgur.com/7OeXVaf.png
// @include         https://*.google.tld/*tbm=isch*
// ==/UserScript==

(function () {
  'use strict';

  // Add Google's own CSS used for image dimensions
  addGlobalStyle(`
    .img-dims p {
      position: absolute;
      bottom: 0;
      right: 0;
      margin: 0;
      padding: 4px;
      color: #f1f3f4;
      background-color: rgba(0,0,0,.5);
      border-radius: 2px 0 0 0;
      font-family: Roboto-Medium,Roboto,Arial,sans-serif;
      font-size: 10px;
      line-height: 12px;
    }
    `);

  function showDims() {
    // Find all thumbnails & exclude the "already handled" class we set below
    const images = document.querySelectorAll('[data-ow]:not(.img-dims)');

    // Loop through all thumbnails
    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      // Get original width from 'data-ow' attribute
      const width = image.getAttribute('data-ow');

      // Get original height from 'data-oh' attribute
      const height = image.getAttribute('data-oh');

      // Create P Tag and insert text
      const dimensionsDiv = document.createElement("p");
      const dimensionsContent = document.createTextNode(width + " × " + height);
      dimensionsDiv.appendChild(dimensionsContent);

      // Append everything to thumbnail
      image.firstChild.appendChild(dimensionsDiv);

      // Add CSS class to the thumbnail
      image.classList.add("img-dims");
    }
  }

  // Run script once on document ready
  showDims();

  // Initialize new MutationObserver
  const mutationObserver = new MutationObserver(showDims);

  // Let MutationObserver target the grid containing all thumbnails
  const targetNode = document.querySelector('div[data-cid="GRID_STATE0"]');

  // Run MutationObserver
  mutationObserver.observe(targetNode, { childList: true, subtree: true });

  function addGlobalStyle(css) {
    const head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    const style = document.createElement('style');
    style.textContent = css;
    head.appendChild(style);
  }
})();