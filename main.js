var picList = null;
//
//		GALLERY VIEW
//

function getData() {
	var request = new XMLHttpRequest();
	var url = "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=f0acf8413c19cafc668726c43a93c6cf&format=json&safe_search=1&content_type=1&sort=relevance&extras=url_t,url_z&page=1&per_page=25&text=kittens&nojsoncallback=1";

	request.open('GET', url, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var resp = JSON.parse(request.responseText);
	    displayData(resp);
	  } else {
	    // We reached our target server, but it returned an error
	  }
	};

	request.onerror = function() {
	  // There was a connection error of some sort
	};
	request.send();

}

function displayData(response) {
	picList = response.photos.photo;
	var container = document.getElementById("container-thumbnails");

	for (var i in picList){
		var image = document.createElement("img");
		image.setAttribute("src", picList[i].url_t);
		image.setAttribute("id", i);
		image.setAttribute("class", "thumbnail")
		image.setAttribute("onclick", "imageClick('" + picList[i].url_z + "'," + i + ",'" + picList[i].title + "')");
		container.appendChild(image);
	}
}

function imageClick(url, id, title) {
	document.getElementById("container-popup").style.display = "block";
	document.getElementById("lightboxImage").setAttribute("src", url);
	document.getElementById("lightboxImage").setAttribute("alt", id);
	document.getElementById("image-title").textContent =  title;
}

//
//		LIGHTBOX VIEW
//

function getLargeImageUrl(id) {
	return picList[id].url_z;
}

function getImageTitle(id) {
	return picList[id].title;
}

function exitLightbox() {
	document.getElementById("container-popup").style.display = "none";
}

function rightArrow() {
	var lightbox = document.getElementById("lightboxImage");
	var newID = parseInt(lightbox.alt) + 1;
	var nextImageUrl = getLargeImageUrl(newID);
	var title = document.getElementById("image-title");
	// TO-DO: Add check to see if it's at the end of the list

	lightbox.setAttribute("src", nextImageUrl);
	lightbox.setAttribute("alt", newID);
	title.textContent = getImageTitle(newID);
}

function leftArrow() {
	var lightbox = document.getElementById("lightboxImage");
	var newID = parseInt(lightbox.alt) - 1;
	var nextImageUrl = getLargeImageUrl(newID);
	var title = document.getElementById("image-title");
	// TO-DO: Add check to see if it's at the end of the list

	lightbox.setAttribute("src", nextImageUrl);
	lightbox.setAttribute("alt", newID);
	title.textContent = getImageTitle(newID);

}
