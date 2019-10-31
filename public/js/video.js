/* eslint-disable space-before-function-paren */
/* eslint semi: "error" */

/* Get our Elements */
const video = document.querySelector('.block__video');
const sourceNodes = video.querySelectorAll('source');
const sources = new Array(sourceNodes.length);
for (let i = 0; i < sources.length; i++) {
  sources[i] = {
    type: sourceNodes[i].getAttribute('type'),
    src: sourceNodes[i].getAttribute('src'),
    quality: Number(sourceNodes[i].getAttribute('data-quality'))
  };
}

// Make sure sources are in order for quality testing later
sources.sort(function(a, b) {
  return a.quality - b.quality;
});

/* Build out functions */

/* Check current video height and return optimal video quality */
function autoQuality() {
  const videoHeight = video.offsetHeight;
  let newQuality;
  for (let i = 0; i < sources.length; i++) {
    if (videoHeight <= sources[i].quality) {
      newQuality = sources[i].quality;
      break;
    }
  }
  return newQuality;
}

/* If new quality is different than current quality, switch video sources */
function updateSource(newQuality) {
  const currentSrc = new URL(video.currentSrc);
  const index = sources.findIndex(source => source.quality === newQuality);
  const newSrc = new URL(sources[index].src, currentSrc.origin);
  if (currentSrc.href !== newSrc.href) {
    const currentTime = video.currentTime;
    const paused = video.paused;
    video.src = newSrc.href;
    video.currentTime = currentTime;
    if (!paused) {
      video.play();
    }
  }
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this;
    var args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

var debounceUpdateSource = debounce(function() {
  updateSource(autoQuality());
}, 250);

video.addEventListener('loadedmetadata', () => {
  updateSource(autoQuality());
}, {
  once: true
});

window.addEventListener('resize', debounceUpdateSource);
