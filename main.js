var picList = null;
var lightboxDiv = document.getElementById("container-lightbox");
var lightboxImage = document.getElementById("lightbox-image");
var imageTitle = document.getElementById("image-title");

//
//		GALLERY VIEW
//

function retrieveData() {
    var request = new XMLHttpRequest();
    var url = "https://www.flickr.com/services/rest/?method=flickr.photos.search" + 
    		  "&api_key=f0acf8413c19cafc668726c43a93c6cf&format=json&safe_search=1&" +
    		  "content_type=1&sort=relevance&extras=url_q,url_z&page=1&per_page=28&text=kittens" +
    		  "&nojsoncallback=1";

    request.open('GET', url, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Data has been successfully retrieved.
            var response = JSON.parse(request.responseText);
            displayThumbnails(response);
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

function displayThumbnails(response) {
    picList = response.photos.photo;
    var thumbnailContainer = document.getElementById("container-thumbnails");

    for (var i in picList) {
        var thumbnail = document.createElement("img");
        thumbnail.setAttribute("src", picList[i].url_q);
        thumbnail.setAttribute("id", i);
        thumbnail.setAttribute("class", "thumbnail");
        thumbnail.setAttribute("onclick", "openLightbox('" + picList[i].url_z + "'," 
        	+ i + ',"' + picList[i].title + '")');
        thumbnailContainer.appendChild(thumbnail);
    }
    document.getElementById("loading-text").style.display = "none";
}

function openLightbox(url, id, title) {
    lightboxDiv.style.display = "block";
    lightboxImage.setAttribute("src", url);
    lightboxImage.setAttribute("alt", id);

    imageTitle.textContent = title;
}

//
//		LIGHTBOX VIEW
//

function getImageUrl(id) {
    return picList[id].url_z;
}

function getImageTitle(id) {
    return picList[id].title;
}

function exitLightbox() {
    lightboxDiv.style.display = "none";
        lightboxImage.setAttribute("src", null);
        lightboxImage.setAttribute("alt", null);
}

function nextImage() {
    var newID = parseInt(lightboxImage.alt) + 1;

    if (newID < 28) {
        lightboxImage.setAttribute("src", getImageUrl(newID));
        lightboxImage.setAttribute("alt", newID);
        imageTitle.textContent = getImageTitle(newID);
    }
}

function previousImage() {
    var newID = parseInt(lightboxImage.alt) - 1;

    if (newID > -1) {
        lightboxImage.setAttribute("src", getImageUrl(newID));
        lightboxImage.setAttribute("alt", newID);
        imageTitle.textContent = getImageTitle(newID);
    }
}