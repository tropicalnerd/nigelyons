console.log('Init video script')

/* Get our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.player__video');
// const progress = player.querySelector('.player__slider--progress');
// const progressBar = progress.querySelector('.range-slider__fill');
const playToggle = player.querySelector('.player__button--play-toggle');
// const ranges = player.querySelectorAll('.player__slider');

const playToggleIcon = playToggle.querySelector('svg');
const playIcon = playToggleIcon.innerHTML;
const pauseIcon = '<title id="play-title">Pause</title>' +
    '<rect width="10" height="20" />' +
    '<rect width="10" height="20" x="18" />';

/* Build out functions */
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

/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayToggle);
video.addEventListener('pause', updatePlayToggle);

playToggle.addEventListener('click', togglePlay);