/* eslint-disable space-before-function-paren */
/* eslint semi: "error" */

/* Get our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.player__video');
const sourceNodes = video.querySelectorAll('source');
const sources = new Array(sourceNodes.length);
for (let i = 0; i < sources.length; i++) {
  sources[i] = {
    type: sourceNodes[i].getAttribute('type'),
    src: sourceNodes[i].getAttribute('src'),
    quality: Number(sourceNodes[i].getAttribute('data-quality'))
  };
}
sources.sort(function(a, b) {
  return a.quality - b.quality;
});

const controls = player.querySelector('.player__controls');

const playToggle = player.querySelector('.player__play-toggle');
const playToggleIcon = playToggle.querySelector('svg');
const playIcon = playToggleIcon.innerHTML;
const pauseIcon =
  '<title id="play-title">Pause</title>' +
  '<rect width="10" height="20" />' +
  '<rect width="10" height="20" x="18" />';

const progressTimeCurrent = player.querySelector('.player__time-current');
const progressTimeRemaining = player.querySelector('.player__time-remaining');
const progressRange = player.querySelector('.player__progress-range');
const audioToggle = player.querySelector('.player__audio-toggle');
const audioToggleIcon = audioToggle.querySelector('svg');
const audioOnIcon = audioToggleIcon.innerHTML;
const audioMutedIcon =
  '<title id="audio-title">Audio Muted</title>' +
  '<path d="M8.8 0L2.8 6H0V8.8V11.2V14H2.8L8.8 20V0Z" />' +
  '<path d="M12 4L19 16M19 4L12 16" stroke="currentColor" stroke-width="2"/>';

const volumeRange = player.querySelector('.player__volume-range');

const qualityToggle = player.querySelector('.player__quality');
const qualityMenu = player.querySelector('.quality-menu');
const qualityMenuItems = player.querySelectorAll('.quality-menu__radio');

const fullscreenToggle = player.querySelector('.player__fullscreen-toggle');

/* Build out functions */
function stringPadLeft(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  return stringPadLeft(minutes, '0', 2) + ':' + stringPadLeft(seconds, '0', 2);
}

function togglePlay() {
  if (video.paused) {
    video.play();
    playing = true;
  } else {
    video.pause();
    playing = false;
  }
}

function updatePlayToggle() {
  const icon = this.paused && mousedown === false ? playIcon : pauseIcon;
  playToggleIcon.innerHTML = icon;
}

function updateProgress() {
  const timeCurrent = Math.floor(video.currentTime);
  const timeRemaining = video.duration - timeCurrent;
  progressRange.value = video.currentTime / video.duration;
  progressTimeCurrent.textContent = formatTime(timeCurrent);
  progressTimeRemaining.textContent = formatTime(timeRemaining);
}

function scrub() {
  video.currentTime = progressRange.value * video.duration;
}

function toggleMuted() {
  video.muted = !video.muted;
  updateAudioControls();
}

function updateAudioControls() {
  if (video.muted === true) {
    audioToggleIcon.innerHTML = audioMutedIcon;
    volumeRange.value = 0;
  } else {
    audioToggleIcon.innerHTML = audioOnIcon;
    volumeRange.value = video.volume;
  }
}

function updateVolume() {
  video.muted = false;
  video.volume = this.value;
  updateAudioControls();
}

function hideMenu() {
  qualityMenu.className += ' hidden';
  setTimeout(() => {
    qualityMenu.hidden = true;
    qualityToggle.setAttribute('aria-expanded', 'false');
  }, 200);
}

function toggleMenu() {
  if (qualityMenu.hidden === false) {
    hideMenu();
  } else {
    qualityMenu.hidden = false;
    setTimeout(() => qualityMenu.classList.remove('hidden'), 5);
    qualityToggle.setAttribute('aria-expanded', 'true');
  }
}

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

function changeQuality() {
  const newQuality = sources[this.value].quality;
  updateSource(newQuality);
}

function updateSource(newQuality) {
  const currentSrc = new URL(video.currentSrc);
  const index = sources.findIndex(source => source.quality === newQuality);
  const newSrc = new URL(sources[index].src, currentSrc.origin);
  if (currentSrc.href !== newSrc.href) {
    const currentTime = video.currentTime;
    video.src = newSrc.href;
    video.currentTime = currentTime;
    if (playing === true) {
      video.play();
    }
  }
}

function updateMenu() {
  const currentSrc = new URL(video.currentSrc);
  const index = sources.findIndex(
    source => new URL(source.src, currentSrc.origin).href === currentSrc.href
  );
  qualityMenuItems[index].checked = true;
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

var checkSource = debounce(function() {
  updateSource(autoQuality());
}, 250);

function hideControls() {
  controls.className += ' hidden';
}

var debounceHideControls = debounce(function() {
  hideControls();
}, 2000);

function showControls() {
  controls.classList.remove('hidden');
  debounceHideControls();
}

/* Hook up the event listeners */
let mousedown = false;
let playing = false;

player.addEventListener('mouseleave', () => {
  hideMenu();
  hideControls();
});
player.addEventListener('mousemove', showControls);

video.addEventListener('loadedmetadata', () => updateSource(autoQuality()), {
  once: true
});
video.addEventListener('loadedmetadata', () => {
  updateProgress();
  updateAudioControls();
  updateMenu();
});
video.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayToggle);
video.addEventListener('pause', updatePlayToggle);
video.addEventListener('timeupdate', updateProgress);

playToggle.addEventListener('click', togglePlay);

progressRange.addEventListener('input', scrub);
progressRange.addEventListener('mousedown', () => {
  mousedown = true;
  if (playing === true) {
    video.pause();
  }
});
progressRange.addEventListener('mouseup', () => {
  mousedown = false;
  if (playing === true) {
    video.play();
  }
});

audioToggle.addEventListener('click', toggleMuted);
volumeRange.addEventListener('input', updateVolume);

qualityToggle.addEventListener('click', toggleMenu);
qualityMenu.addEventListener('mouseleave', hideMenu);
qualityMenuItems.forEach(menuItem =>
  menuItem.addEventListener('change', changeQuality)
);

fullscreenToggle.addEventListener('click', () => player.requestFullscreen());

/* Execute */

window.addEventListener('resize', checkSource);
