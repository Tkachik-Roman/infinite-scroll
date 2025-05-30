const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;  // variable for second scrollEventListener condition 
let imagesLoaded = 0;
let totalImages = 0;  // lets us know when loading images according set counter finished 
let photosArray = [];
let isInitialLoad = true;

// Unsplash API
let initialCount = 5;   // receive photos from Unsplash API by counter
                        // small initial counter value ​​provide the highest performance during initial website loading
const apiKey = 'INSERT_HERE_YOUR_PERSONAL_UNSPLASH_API_KEY';  //to get your personal Api Key register here: https://unsplash.com/documentation
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

// Update Counter for Subsequent (No Longer Initial) Loads
function updateApiUrlWithNewCount (imgCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imgCount}`;
}

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;  // hide animated loader after initial page load
  }
}

// Helper Function to Set Attributes on DOM Elements for DRY Code Purpose
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create Elements For Links & Photos, Add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // Run function for each object in photosArray
  photosArray.forEach((photo) => {
    //Create anchor element <a> to link to Unsplash
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    });
    // Create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
      scr: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    // Event listener, check when each is finished loading
    img.addEventListener('load', imageLoaded);
    // Put <img> inside <a>, then put both inside imageContainer Element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get Photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    if (isInitialLoad) {
      updateApiUrlWithNewCount(30);
      isInitialLoad = false;
    }
  } catch (error) {
    console.log('WARNING', error);
  }
}

// Check to See if Scrolling Near Bottom of Page, if true, Load More Photos
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000  && ready) {
    ready = false;
    getPhotos();
  }
});

// On Load
getPhotos();