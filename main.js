//
//      ELEMENTS & VARIABLES
//

var picList = [];
// An array containing all information about the queried images.
var lightboxDiv = document.getElementById("container-lightbox");
// A div that controls the lightbox pop-up.
var lightboxImage = document.getElementById("lightbox-image");
// The image displayed in the lightbox pop-up.
var imageTitle = document.getElementById("image-title");
// The title of the lightbox image.
var loadingText = document.getElementById("loading-text");
// The text that is shown when data is being retrieved.

//
//      GALLERY VIEW
//

/**
 * Retrieves data according to query specified in "query" input element.
 *
 *
 */
function retrieveData() {
    var request = new XMLHttpRequest();
    var query = document.getElementById("query").value.trim();
    var thumbnailContainer = document.getElementById("container-thumbnails");

    if (query) { // Make a request only if the query element has a value.
        var url =
            // This url was really long. I split it up for readability.
            "https://www.flickr.com/services/rest/?method=flickr.photos.search" +
            "&api_key=f0acf8413c19cafc668726c43a93c6cf&format=json&safe_search=1&" +
            "content_type=1&sort=relevance&extras=url_q&page=1&per_page=28&nojsoncallback=1" +
            "&text=" + query;
        // PARAMS FOR REQUEST:
        //  Method: Flickr's Photo Search
        //  Format: JSON
        //  Safe Search: On
        //  Content Type: Photos only
        //  Sort Content by: Relevance
        //  Extra Data to be Returned: URL (url_q, a 150px x 150px image)
        //  Pages & Images per Page: 1, 28 (28 total items returned)
        //  NoJSONCallback: return data as a JSON object

        loadingText.style.display = "block"; // While the request is being prepared,
                                             // show the loading text.

        while (thumbnailContainer.firstChild) {
            thumbnailContainer.removeChild(thumbnailContainer.firstChild);
            // When multiple queries are entered, all irrelevant 
            // thumbnails need to be removed from the view.
        }

        picList = [];
        // When multiple queries are entered, all irrelevant 
        // images need to be removed from the picList store.

        request.open('GET', url, true); // Begin setting up the HTTP request.
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Data has been successfully retrieved.
                var response = JSON.parse(request.responseText);
                displayThumbnails(response);
                // Send response to displayThumbnails() for parsing.
            } else {
                // The server has returned an error.
                console.log("The server has returned an error.");
            }
        };
        request.onerror = function() {
            // The connection has returned an error.
            console.log("The connection has returned an error.");
        };
        request.send();
    }
}

/**
 * Displays thumbnails according to the response given by the retrieveData function.
 *
 *
 */
function displayThumbnails(response) {
    var responseList = response.photos.photo;
    var thumbnailContainer = document.getElementById("container-thumbnails");

    for (var i in responseList) {
        if (responseList[i].url_q) { // I had some issues with the Flickr API. Sometimes
                                     // the response data lacked the specified parameters. This if
                                     // statement is in place to ensure the API returned a URL.

            picList.push(responseList[i]); // Because some of the response data lacked URLs, a 
                                           // a store of all the available images had to be made.

            var thumbnail = document.createElement("img");
            thumbnail.setAttribute("src", responseList[i].url_q);
            thumbnail.setAttribute("id", i); // The image's position in the gallery is stored in its ID.
            thumbnail.setAttribute("class", "thumbnail");
            thumbnail.setAttribute("onclick", "openLightbox('" + responseList[i].url_q +
                "'," + i + ",'" + responseList[i].title.replace(/'/g, "\\'") +
                "')"); // When an image is clicked, open the Lightbox view.
            thumbnailContainer.appendChild(thumbnail);
        }
    }
    loadingText.style.display = "none"; // When all thumbnails have been added, hide the loading text.
}

/**
 * If an image is clicked, this function is called to change the thumbnail view to 
 * the lightbox view.
 *
 */
function openLightbox(url, id, title) {
    lightboxDiv.style.display = "block";
    lightboxImage.setAttribute("src", url.replace("_q.jpg", "_z.jpg"));
    // The source of the Lightbox image has the same url as the thumbnail image, with the 
    // the exception of the character after the underscore. (EX: 123_q.jpg -> 123_z.jpg)
    // Originally, this project was written to get the URL_z from the API. However, the API
    // sometimes failed to return this. Thus, manually changing the URL was necessary.
    lightboxImage.setAttribute("alt", id); // The image's ID is stored in alt.
    imageTitle.textContent = title;

    checkID(lightboxImage.alt); // Check image's ID for toggling the left and right arrow buttons.
}

//
//      LIGHTBOX VIEW
//

/**
 * Returns the url_z (larger version of thumbnail) of the image with ID "id".
 * @param string id                    
 * @return string url_z
 */
function getImageUrl(id) {
    return picList[id].url_q.replace("_q.jpg", "_z.jpg");
}

/**
 * Returns the title of the image with ID "id".
 * @param string id                    
 * @return string title
 */
function getImageTitle(id) {
    return picList[id].title;
}

/**
 * Toggles the left and right arrow buttons in the Lightbox view.
 * @param string id                    
 * 
 */
function checkID(id) {
    var rightButton = document.getElementById("right-button");
    var leftButton = document.getElementById("left-button");

    if (id == 0) {
        // If the Lightbox image is the first image in the Gallery view, hide the left arrow button
        // because there is no "previous" image.
        rightButton.style.display = "block";
        leftButton.style.display = "none";
    } else if (id == picList.length - 1) {
        // If the Lightbox image is the last image in the Gallery view, hide the right arrow button
        // because there is no 'next" image.        
        rightButton.style.display = "none";
        leftButton.style.display = "block";
    } else {
        // Show both buttons if the Lightbox image is not the first or last image.
        rightButton.style.display = "block";
        leftButton.style.display = "block";
    }
}

/**
 * Closes the Lightbox view when the exit button is clicked.
 *                  
 * 
 */
function exitLightbox() {
    lightboxDiv.style.display = "none";
    lightboxImage.setAttribute("src", "");
    lightboxImage.setAttribute("alt", "");
}

/**
 * Changes the Lightbox image to the previous image when the left arrow button is clicked.
 *                  
 * 
 */
function previousImage() {
    var newID = parseInt(lightboxImage.alt) - 1; // Set the new ID of the Lightbox image to previous image.

    if (newID > -1) { // Only move to the previous image if it's not the first image.
        lightboxImage.setAttribute("src", getImageUrl(newID));
        lightboxImage.setAttribute("alt", newID);
        imageTitle.textContent = getImageTitle(newID);
    }
    checkID(lightboxImage.alt); // Check image's ID for toggling the left and right arrow buttons.
}

/**
 * Changes the Lightbox image to the next image when the right arrow button is clicked.
 *                  
 * 
 */
function nextImage() {
    var newID = parseInt(lightboxImage.alt) + 1; // Set the new ID of the Lightbox image to next image.

    if (newID < picList.length) { // Only move to the next image if it's not the last image.
        lightboxImage.setAttribute("src", getImageUrl(newID));
        lightboxImage.setAttribute("alt", newID);
        imageTitle.textContent = getImageTitle(newID);
    }
    checkID(lightboxImage.alt); // Check image's ID for toggling the left and right arrow buttons.
}

document.onkeydown = checkKey;  // Register the event handler: when a key is pressed, 
                                // call the checkKey function.

/**
 * Changes the Lightbox image to the previous image when the left arrow button is clicked.
 *                  
 * 
 */
function checkKey(e) {
    e = e || window.event;   // if e is undefined, set it equal to window.event 
                             // (compatibility for older versions of IE)
    if (e.keyCode == '37') { // If the left arrow key button is pressed, move to the previous image.
        previousImage();
    }
    if (e.keyCode == '39') { // If the right arrow key button is pressed, move to the next image.
        nextImage();
    }
}