"use strict";var videos=document.querySelectorAll("video");function autoQuality(o){var r,n=1e4;return o.sources.forEach(function(e){var t=o.offsetHeight*window.devicePixelRatio,u=Number(e.dataset.quality);t<=u&&u<=n&&(n=u,r=e.src)}),r}function updateSource(e,t){if(e.currentSrc!==t){var u=e.currentTime,o=e.paused;e.src=t,e.currentTime=u,o||e.play()}}function debounce(o,r,n){var c;return function(){var e=this,t=arguments,u=n&&!c;clearTimeout(c),c=setTimeout(function(){c=null,n||o.apply(e,t)},r),u&&o.apply(e,t)}}videos.forEach(function(e){e.sources=e.querySelectorAll("source")});var debounceUpdateSources=debounce(function(){videos.forEach(function(e){return updateSource(e,autoQuality(e))})},250);videos.forEach(function(e){return e.addEventListener("loadedmetadata",function(){updateSource(e,autoQuality(e))},{once:!0})}),window.addEventListener("resize",debounceUpdateSources);