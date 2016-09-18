const SCROLL_AT_TITLEBAR_FADE = 150;
const TITLEBAR_FADE_LENGTH = 150;
const NAVBAR_TARGET_OUTLINE_WIDTH = 2;
const NAVBAR_RGB = "200, 200, 200"
const NAVBAR_STARTING_TOP_MARGIN = 10;
const NAVBAR_TARGET_OPACITY = 0.8;
const FADE_IN_ACTION = 1;
const FADE_OUT_ACTION = -1;
const BANNER_INITIAL_HEIGHT_CLIP = 225;
const WIDTH_AT_MOBILE_MODE = 600;

var lastScrollPos = 0;
var lastFadeAction = 0;
var inMobileMode = false;

function onScroll() {
    if (document.body.scrollTop > SCROLL_AT_TITLEBAR_FADE) {
        if (lastScrollPos <= SCROLL_AT_TITLEBAR_FADE) {
            fadeTitleBar(FADE_IN_ACTION);
        }
    } else if (lastScrollPos > SCROLL_AT_TITLEBAR_FADE) {
        fadeTitleBar(FADE_OUT_ACTION)
    }
    
    lastScrollPos = document.body.scrollTop;
    clipBannerImage();
}

function fadeTitleBar(fadeAction) {
    lastFadeAction = fadeAction;
    var navbar = document.getElementsByClassName("navbar")[0];
    var id = setInterval(animate, 16)
    var targetFrames = Math.round(TITLEBAR_FADE_LENGTH / 16.0);
    var framesComplete = 0;
    
    function animate() {
        percentToFull = framesComplete / targetFrames;
        
        if (framesComplete >= targetFrames || lastFadeAction != fadeAction) {
            clearInterval(id);
            percentToFull = 1;
        }
        
        if (fadeAction == FADE_OUT_ACTION) {
            percentToFull = 1 - percentToFull;
        }
        
        navbar.style.borderWidth = (percentToFull * NAVBAR_TARGET_OUTLINE_WIDTH) + "px";
        navbar.style.backgroundColor = "rgba(" + NAVBAR_RGB + ", " + (percentToFull * NAVBAR_TARGET_OPACITY) + ")";
        navbar.style.marginTop = NAVBAR_STARTING_TOP_MARGIN * (1 - percentToFull) + "px";
        navbar.children[0].style.opacity = percentToFull;

        framesComplete++;
    }
}

function clipBannerImage() {
    document.getElementsByClassName("banner_image")[0].style.clip = "rect(0px, auto, " + (BANNER_INITIAL_HEIGHT_CLIP - document.body.scrollTop) + "px , 0px)";
}

function onWindowResize() {
    width = window.innerWidth;
    if (width < WIDTH_AT_MOBILE_MODE) {
        if (!inMobileMode) {
            setMobileModeEnabled(true);
        }
    } else if (inMobileMode) {
        setMobileModeEnabled(false);
    }
}

function setMobileModeEnabled(enabled) {
    inMobileMode = enabled;
    var name = document.getElementsByClassName("name_header")[0];
    
    if (enabled) {
        name.style.display = "none";
    } else {
        name.style.display = "initial";
    }
}

window.addEventListener("scroll", function() {onScroll()});
window.addEventListener("resize", onWindowResize);
onWindowResize();
onScroll();