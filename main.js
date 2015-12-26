var picList = [];
var lightboxDiv = document.getElementById("container-lightbox");
var lightboxImage = document.getElementById("lightbox-image");
var imageTitle = document.getElementById("image-title");
var loadingText = document.getElementById("loading-text");

//
//		GALLERY VIEW
//

function retrieveData() {
    var request = new XMLHttpRequest();
    var query = document.getElementById("query").value.trim();
    var thumbnailContainer = document.getElementById("container-thumbnails");
    if (query) {
        var url =
            "https://www.flickr.com/services/rest/?method=flickr.photos.search" +
            "&api_key=f0acf8413c19cafc668726c43a93c6cf&format=json&safe_search=1&" +
            "content_type=1&sort=relevance&extras=url_q&page=1&per_page=28&nojsoncallback=1" +
            "&text=" + query;

        loadingText.style.display = "block";
        while (thumbnailContainer.firstChild) {
            thumbnailContainer.removeChild(thumbnailContainer.firstChild);
        }
        picList = [];
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
}

function displayThumbnails(response) {
    var responseList = response.photos.photo;
    var thumbnailContainer = document.getElementById("container-thumbnails");
    for (var i in responseList) {
    	if (responseList[i].url_q) {
    		picList.push(responseList[i]);

	        var thumbnail = document.createElement("img");
	        thumbnail.setAttribute("src", responseList[i].url_q);
	        thumbnail.setAttribute("id", i);
	        thumbnail.setAttribute("class", "thumbnail");
	        thumbnail.setAttribute("onclick", "openLightbox('" + responseList[i].url_q +
	            "'," + i + ",'" + responseList[i].title.replace(/'/g, "\\'") +
	            "')");
	        thumbnailContainer.appendChild(thumbnail);    		
    	}
    }
    loadingText.style.display = "none";
}

function openLightbox(url, id, title) {
        lightboxDiv.style.display = "block";
        lightboxImage.setAttribute("src", url.replace("_q.jpg", "_z.jpg"));
        lightboxImage.setAttribute("alt", id);
        checkID(lightboxImage.alt);
        imageTitle.textContent = title;
    }

//
//		LIGHTBOX VIEW
//

function getImageUrl(id) {
    return picList[id].url_q.replace("_q.jpg", "_z.jpg");
}

function getImageTitle(id) {
    return picList[id].title;
}

function checkID(id) {
    var rightButton = document.getElementById("right-button");
    var leftButton = document.getElementById("left-button");
    if (id == 0) {
        rightButton.style.display = "block";
        leftButton.style.display = "none";
    } else if (id == picList.length - 1) {
        rightButton.style.display = "none";
        leftButton.style.display = "block";
    } else {
        rightButton.style.display = "block";
        leftButton.style.display = "block";
    }
}

function exitLightbox() {
    lightboxDiv.style.display = "none";
    lightboxImage.setAttribute("src", "");
    lightboxImage.setAttribute("alt", "");
}

function nextImage() {
    var newID = parseInt(lightboxImage.alt) + 1;
    if (newID < picList.length) {
        lightboxImage.setAttribute("src", getImageUrl(newID));
        lightboxImage.setAttribute("alt", newID);
        imageTitle.textContent = getImageTitle(newID);
    }
    checkID(lightboxImage.alt);
}

function previousImage() {
    var newID = parseInt(lightboxImage.alt) - 1;

    if (newID > -1) {
        lightboxImage.setAttribute("src", getImageUrl(newID));
        lightboxImage.setAttribute("alt", newID);
        imageTitle.textContent = getImageTitle(newID);
    }
    checkID(lightboxImage.alt);
}