console.log('Init video script')

/* Get our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.player__video');

const playToggle = player.querySelector('.player__play-toggle');
const playToggleIcon = playToggle.querySelector('svg');
const playIcon = playToggleIcon.innerHTML;
const pauseIcon = '<title id="play-title">Pause</title>' +
    '<rect width="10" height="20" />' +
    '<rect width="10" height="20" x="18" />';

const progressTimeCurrent = player.querySelector('.player__progress-time-current');
const progressTimeRemaining = player.querySelector('.player__progress-time-remaining');
const progressRange = player.querySelector('.player__progress-range');
const audioToggle = player.querySelector('.player__audio-toggle');
const volumeRange = player.querySelector('.player__volume-range');
const fullscreenToggle = player.querySelector('.player__fullscreen-toggle');

/* Build out functions */
function stringPadLeft(string, pad, length) {
    return (new Array(length+1).join(pad) + string).slice(-length);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    // return minutes + ':' + seconds;
    return stringPadLeft(minutes, '0', 2) + ':' + stringPadLeft(seconds, '0', 2);
}

function togglePlay() {
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function updatePlayToggle() {
    const icon = this.paused ? playIcon : pauseIcon;
    playToggleIcon.innerHTML = icon;
}

function updateVolume() {
    video['volume'] = this.value;
}

function updateProgress() {
    const percent = video.currentTime / video.duration;
    // const timeDuration = Math.floor(video.duration);
    const timeCurrent = Math.floor(video.currentTime);
    const timeRemaining = video.duration - timeCurrent;
    progressRange.value = percent;
    progressTimeCurrent.textContent = formatTime(timeCurrent);
    progressTimeRemaining.textContent = formatTime(timeRemaining);
}

function scrub(e) {
    const scrubTime = (e.offsetX / progressRange.offsetWidth * video.duration);
    video.currentTime = scrubTime;
}

/* Hook up the event listeners */
let mousedown = false;

video.addEventListener('canplay', updateProgress);
video.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayToggle);
video.addEventListener('pause', updatePlayToggle);
video.addEventListener('timeupdate', updateProgress);

playToggle.addEventListener('click', togglePlay);


progressRange.addEventListener('click', scrub);
progressRange.addEventListener('mousemove', (e) => mousedown && scrub(e));
progressRange.addEventListener('mousedown', () => mousedown = true);
progressRange.addEventListener('mouseup', () => mousedown = false);

volumeRange.addEventListener('change', updateVolume);

fullscreenToggle.addEventListener('click', () => video.requestFullscreen())


