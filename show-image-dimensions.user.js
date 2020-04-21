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
// @namespace       https://greasyfork.org/de/users/522821-taddiboy
// @version         1.0.0
// @license         MIT
// @author          Taddiboy
// @icon            https://i.imgur.com/7OeXVaf.png
// @include         https://*.google.tld/*tbm=isch*
// @grant           none
// ==/UserScript==

(function () {
    'use strict';
  
    // Find all thumbnails
    const images = document.querySelectorAll('[data-ow]');
  
    // Copy Google's own CSS used for image dimensions
    const styles = `
        .image-dimensions {
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
      `;
  
    // Append stylesheet to the document
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  
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
      dimensionsDiv.classList.add("image-dimensions");
  
      // Append everything to thumbnail
      image.firstChild.appendChild(dimensionsDiv);
    }
  })();  