const ANIMATE_IN_DIST = 255;
const ANIMATE_IN_SPEED = 10;
const FADE_IN_DURATION = 500;

function animateIn(itemClass, itemPos) {
    var element = document.getElementsByClassName(itemClass)[itemPos];
    var pos = ANIMATE_IN_DIST;
    var id = setInterval(animate, 16);
    
    function animate() {
        if (pos <= 0) {
            element.style.marginTop = "0px";
            clearInterval(id);
        } else {
            element.style.marginTop = pos + "px";
            pos = pos - ANIMATE_IN_SPEED;
        }
    }
}

function setupPageLoadAnimations(targetClass) {
    var elements = document.getElementsByClassName(targetClass);
    for (var i = 1; i < elements.length; ++i) {
        elements[i].addEventListener("load", animateIn(targetClass, i));
    }
}

// window.onload = setupPageLoadAnimations("section");