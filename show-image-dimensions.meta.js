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