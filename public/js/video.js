/* eslint-disable space-before-function-paren */
/* eslint semi: "error" */

console.log('Init video script');

/* Get our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.player__video');

const playToggle = player.querySelector('.player__play-toggle');
const playToggleIcon = playToggle.querySelector('svg');
const playIcon = playToggleIcon.innerHTML;
const pauseIcon =
  '<title id="play-title">Pause</title>' +
  '<rect width="10" height="20" />' +
  '<rect width="10" height="20" x="18" />';

const progressTimeCurrent = player.querySelector(
  '.player__progress-time-current'
);
const progressTimeRemaining = player.querySelector(
  '.player__progress-time-remaining'
);
const progressRange = player.querySelector('.player__progress-range');
const audioToggle = player.querySelector('.player__audio-toggle');
const audioToggleIcon = audioToggle.querySelector('svg');
const audioOnIcon = audioToggleIcon.innerHTML;
const audioMutedIcon =
  '<title id="audio-title">Audio Muted</title>' +
  '<path d="M8.8 0L2.8 6H0V8.8V11.2V14H2.8L8.8 20V0Z" />' +
  '<path d="M12 4L19 16M19 4L12 16" stroke="currentColor" stroke-width="2"/>';

const volumeRange = player.querySelector('.player__volume-range');
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
  const percent = video.currentTime / video.duration;
  // const timeDuration = Math.floor(video.duration);
  const timeCurrent = Math.floor(video.currentTime);
  const timeRemaining = video.duration - timeCurrent;
  progressRange.value = percent;
  progressTimeCurrent.textContent = formatTime(timeCurrent);
  progressTimeRemaining.textContent = formatTime(timeRemaining);
  console.log(progressRange.value);
}

// function scrub(e) {
//   const scrubTime = (e.offsetX / progressRange.offsetWidth) * video.duration;
//   video.currentTime = scrubTime;
// }

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

/* Hook up the event listeners */
let mousedown = false;
let playing = false;

video.addEventListener('canplay', () => { updateProgress(); updateAudioControls(); });
video.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayToggle);
video.addEventListener('pause', updatePlayToggle);
video.addEventListener('timeupdate', updateProgress);

playToggle.addEventListener('click', togglePlay);

progressRange.addEventListener('input', scrub);
// progressRange.addEventListener('click', scrub);
// progressRange.addEventListener('mousemove', e => mousedown && scrub(e));
progressRange.addEventListener('mousedown', () => {
  mousedown = true;
  if (playing === true) { video.pause(); }
});
progressRange.addEventListener('mouseup', () => {
  mousedown = false;
  if (playing === true) { video.play(); }
});

audioToggle.addEventListener('click', toggleMuted);
volumeRange.addEventListener('input', updateVolume);

fullscreenToggle.addEventListener('click', () => video.requestFullscreen());
