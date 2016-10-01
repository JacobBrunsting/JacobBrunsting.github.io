const SCROLL_AT_TITLEBAR_FADE = 150;
const TITLEBAR_FADE_LENGTH = 150;
const NAVBAR_TARGET_OUTLINE_WIDTH = 2;
const NAVBAR_RGB = "200, 200, 200"
const NAVBAR_STARTING_TOP_MARGIN = 10;
const NAVBAR_TARGET_OPACITY = 0.8;
const FADE_IN_ACTION = 1;
const FADE_OUT_ACTION = -1;
const BANNER_INITIAL_HEIGHT_CLIP = 225;
const WIDTH_AT_MOBILE_MODE = 800;
const NAVBAR_FONT_SIZE = "20px";
const NAVBAR_MOBILE_FONT_SIZE = "30px";

var lastScrollPos = 0;
var lastFadeAction = 0;
var inMobileMode = false;

function refreshNavbarState() {
    // in mobile mode, we want the title bar to always be faded in
    if (inMobileMode) {
        return;
    }
    
    if (document.body.scrollTop > SCROLL_AT_TITLEBAR_FADE) {
        if (lastScrollPos <= SCROLL_AT_TITLEBAR_FADE) {
            fadeTitleBar(FADE_IN_ACTION, true);
        }
    } else if (lastScrollPos > SCROLL_AT_TITLEBAR_FADE) {
        fadeTitleBar(FADE_OUT_ACTION, true)
    }
    
    lastScrollPos = document.body.scrollTop;
    clipBannerImage();
}

function fadeTitleBar(fadeAction, animateFade) {
    lastFadeAction = fadeAction;
    var navbar = document.getElementsByClassName("navbar")[0];
    var id = setInterval(animate, 16)
    var targetFrames = Math.round(TITLEBAR_FADE_LENGTH / 16.0);
    var framesComplete = 0;

    function animate() {
        percentToFull = framesComplete / targetFrames;

        if (!animateFade || framesComplete >= targetFrames || lastFadeAction != fadeAction) {
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
    if (window.matchMedia("all and (max-width: 800px) , all and (max-device-width: 800px)").matches) {
        if (!inMobileMode) {
            setMobileModeEnabled(true);
        }
    } else if (inMobileMode) {
        setMobileModeEnabled(false);
    }
    var parent = document.getElementById("experience_tiles");
    setChildMarginsToFit(parent, "hover_image_wrapper", 10);
}

/* sets the margins of the children of parent with class childClass so 
   that the maximum number of the children fit on a line while still 
   having at least the minimumMargin. All children must have uniform
   width. */
function setChildMarginsToFit(parent, childClass, minimumMargin) {
    if (parent == null) {
        return;
    }
    var targetChildren = parent.getElementsByClassName(childClass);
    if (targetChildren == null) {
        return;
    }
    
    var firstChild = targetChildren[0];
    var childWidth = firstChild.offsetWidth;
    var availableWidth = parseFloat(window.getComputedStyle(parent).width);
    /* not 100% accurate, but good enough. We are adding the minimum
       margin to each child, but ignoring the margin between the last
       child and the end of the parent */
    var childrenPerLine = Math.floor(availableWidth / (childWidth + minimumMargin));
    var noMarginLineWidth = childrenPerLine * childWidth;
    var totalMargin = availableWidth - noMarginLineWidth - 20;
    var lineCount = Math.ceil(targetChildren.length / childrenPerLine);
    var margin = ((totalMargin / (childrenPerLine + 1)) / 2) + "px";
    for (var i = 0; i < targetChildren.length; ++i) {
        if ((i + 1) % childrenPerLine == 0) {
            /* Sometimes rounding errors cause the last element
                in a line to wrap around, so we set the margin to -10 to account for these errors, ensuring
                it is on the correct line */
            targetChildren[i].style.marginRight = "-10px";
        } else {
            targetChildren[i].style.marginRight = margin;
        }
        targetChildren[i].style.marginLeft = margin;
        targetChildren[i].style.martinTop = margin;
        targetChildren[i].style.marginBottom = margin;
    }
}

function setMobileModeEnabled(enabled) {
    var name = document.getElementsByClassName("name_header")[0];
    var prev = inMobileMode;
    inMobileMode = enabled;
    return;
}

window.addEventListener("scroll", function() {refreshNavbarState();});
window.addEventListener("resize", onWindowResize);
onWindowResize();
refreshNavbarState();