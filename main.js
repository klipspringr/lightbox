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
 * Prepares elements on page for an incoming HTTP request.
 *
 *
 */
function prepareRequest() {
    var request = new XMLHttpRequest();
    var queryElement = document.getElementById("query").value.trim();
    var thumbnailContainer = document.getElementById("container-thumbnails");

    if (queryElement) { // Make a request only if the query element has a value.
        var url =
            // This url is split up for readability.
            "https://www.flickr.com/services/rest/" + 
            "?method=flickr.photos.search" +                
            "&api_key=f0acf8413c19cafc668726c43a93c6cf" +   
            "&format=json" +                               
            "&safe_search=1" +                             
            "&content_type=1" +        //  Method: Flickr's Photo Search                    
            "&sort=relevance" +        //  Documentation can be found at:                 
            "&extras=url_q" +          //  https://www.flickr.com/services/api/flickr.photos.search.html                  
            "&page=1&per_page=28" +                       
            "&nojsoncallback=1" +                       
            "&text=" + queryElement;                            

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
        retrieveData(request);
}

/**
 * Retrieves data by sending HTML request as specified in parameter.
 *
 *
 */
function retrieveData(request) {
        request.open('GET', url, true); // Begin setting up the HTTP request.
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Data has been successfully retrieved.
                var response = JSON.parse(request.responseText);
                displayThumbnails(response); // Send response to displayThumbnails() for parsing.
            } else {
                // The server has returned an error.
                // console.log("The server has returned an error.");
            }
        };
        request.onerror = function() {
            // The connection has returned an error.
            // console.log("The connection has returned an error.");
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
        if (responseList[i].url_q) { // Sometimes the API's response data lacked the 
                                     // specified parameters. This checks that the API returned a URL.

            picList.push(responseList[i]); // Because some of the response data lacked URLs, a 
                                           // a store of all the available images had to be made.
            var thumbnailWrapper = document.createElement("a");
            thumbnailWrapper.setAttribute("href", "#");  
            thumbnailWrapper.setAttribute("onclick", "openLightbox('" + responseList[i].url_q +
                "'," + i + ",'" + responseList[i].title.replace(/'/g, "\\'") +
                "')");                                         
            var thumbnail = document.createElement("img");
            thumbnail.setAttribute("src", responseList[i].url_q);
            thumbnail.setAttribute("id", i); // The image's position in the gallery is stored in its ID.
            thumbnail.setAttribute("class", "thumbnail");
            thumbnailWrapper.appendChild(thumbnail); // Wrap the image in an <a> tag
            thumbnailContainer.appendChild(thumbnailWrapper);
        }
    }
    loadingText.style.display = "none"; 
}

/**
 * If an image is clicked, this function is called to change the thumbnail view to 
 * the lightbox view. This function is called by each thumbnail's onclick attribute.
 *
 */
function openLightbox(url, id, title) {
    lightboxDiv.style.display = "block";
    lightboxImage.setAttribute("src", url.replace("_q.jpg", "_z.jpg"));
    // The src of the Lightbox image has the same src as the thumbnail image, with the 
    // the exception of one character. EXAMPLE: 123_q.jpg (Thumbnail) -> 123_z.jpg (Larger version)
    // Originally, I got URL_z from the API. However, the API sometimes failed to 
    // return this parameter. Thus, manually changing the URL was necessary.
    lightboxImage.setAttribute("data-id", id); // The image's ID is stored in data-id.
    imageTitle.textContent = title;

    checkID(lightboxImage.dataset.id); // Check image's ID for toggling the left and right arrow buttons.
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
    lightboxImage.setAttribute("data-id", "");
}

/**
 * Changes the Lightbox image to the previous image when the left arrow button is clicked.
 *                  
 * 
 */
function previousImage() {
    var newID = parseInt(lightboxImage.dataset.id) - 1; // Set the new ID of the Lightbox image to previous image.

    if (newID > -1) { // Only move to the previous image if it's not the first image.
        lightboxImage.setAttribute("src", getImageUrl(newID));
        lightboxImage.setAttribute("data-id", newID);
        imageTitle.textContent = getImageTitle(newID);
    }
    checkID(lightboxImage.dataset.id); // Check image's ID for toggling the left and right arrow buttons.
}

/**
 * Changes the Lightbox image to the next image when the right arrow button is clicked.
 *                  
 * 
 */
function nextImage() {
    var newID = parseInt(lightboxImage.dataset.id) + 1; // Set the new ID of the Lightbox image to next image.

    if (newID < picList.length) { // Only move to the next image if it's not the last image.
        lightboxImage.setAttribute("src", getImageUrl(newID));
        lightboxImage.setAttribute("data-id", newID);
        imageTitle.textContent = getImageTitle(newID);
    }
    checkID(lightboxImage.dataset.id); // Check image's ID for toggling the left and right arrow buttons.
}

document.onkeydown = checkKey;  // Register the event handler for key presses.

/**
 * Changes the Lightbox image to the previous image when the left arrow button is pressed.
 *                  
 * 
 */
function checkKey(e) {
    e = e || window.event;   // If e is undefined, set it equal to window.event.

    if (e.keyCode == '37') { // If the left arrow key button is pressed, move to the previous image.
        previousImage();
    }
    if (e.keyCode == '39') { // If the right arrow key button is pressed, move to the next image.
        nextImage();
    }
}