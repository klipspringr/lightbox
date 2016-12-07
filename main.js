//
//      ELEMENTS & VARIABLES
//

var lightboxDiv = document.getElementById("container-lightbox");
// A div that contains the lightbox pop-up.
var lightboxImage = document.getElementById("lightbox-image");
// The image displayed in the lightbox pop-up.
var imageTitle = document.getElementById("image-title");
// The title of the image.
var picList = { "projects": 
                [
                    {"title": "Dogs","image": "./img/dog.jpg"},
                    {"title": "Cats","image": "./img/cat.jpg"}
]};
// An array containing all information about the queried images.


//
//      GALLERY VIEW
//


/**
 * Displays thumbnails of the data in picList.
 *
 *
 */
function displayThumbnails() {
    var thumbnailContainer = document.getElementById("container-thumbnails");

    for (var i in picList.projects) {
            var thumbnailWrapper = document.createElement("a");
            thumbnailWrapper.setAttribute("href", "#");  
            thumbnailWrapper.setAttribute("onclick", "openLightbox('" + picList.projects[i].image +
                "'," + i + ",'" + picList.projects[i].title.replace(/'/g, "\\'") +
                "')");                                         

            var thumbnail = document.createElement("img");
            thumbnail.setAttribute("src", picList.projects[i].image);
            thumbnail.setAttribute("id", i); // The image's position in the gallery is stored in its ID.
            thumbnail.setAttribute("class", "thumbnail");
            thumbnailWrapper.appendChild(thumbnail); // Wrap the image in an <a> tag
            thumbnailContainer.appendChild(thumbnailWrapper);
    }
}

/**
 * If an image is clicked, this function is called to change the thumbnail view to 
 * the lightbox view. This function is called by each thumbnail's onclick attribute.
 *
 */
function openLightbox(url, id, title) {
    lightboxDiv.style.display = "block";
    lightboxImage.setAttribute("src", url);
    lightboxImage.setAttribute("data-id", id); // The image's ID is stored in data-id.
    imageTitle.textContent = title;

    checkID(lightboxImage.dataset.id); // Check image's ID for toggling the left and right arrow buttons.
}

//
//      LIGHTBOX VIEW
//

/**
 * Returns the image url attribute of the given id
 * @param string id                    
 * @return string url
 */
function getImageUrl(id) {
    return picList.projects[id].image;
}

/**
 * Returns the title of the image with with the given id
 * @param string id                    
 * @return string title
 */
function getImageTitle(id) {
    return picList.projects[id].title;
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
    } else if (id == picList.projects.length - 1) {
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

    if (newID < picList.projects.length) { // Only move to the next image if it's not the last image.
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

displayThumbnails()