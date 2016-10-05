/**
 * SWIPE : swipe.js
 */
 
var _swipe = {}
_swipe.container     = document.getElementsByClassName("panes").length ? document.getElementsByClassName("panes")[0] : null
_swipe.dots          = document.getElementsByClassName("dots").length ? Array.prototype.slice.call(document.getElementsByClassName("dots")[0].children, 0) : null;
_swipe.panes         = Array.prototype.slice.call(_swipe.container.children, 0)
_swipe.containerSize = null;
_swipe.currentIndex  = 0;
    dots =

_swipe.show = function(showIndex, percent, animate){
    showIndex = Math.max(0, Math.min(showIndex, _swipe.panes.length - 1))
    percent = showIndex == 0 && percent > 0 || showIndex == _swipe.panes.length - 1 && percent < 0 ? percent/3 || 0 : percent || 0
    var className = _swipe.container.className
    if(animate) {
        if(className.indexOf('animate') === -1) {
            _swipe.container.className += ' animate';
        }
    } else {
        if(className.indexOf('animate') !== -1) {
            _swipe.container.className = className.replace('animate', '').trim()
        }
    }
    var paneIndex, pos, translate
    for (paneIndex = 0; paneIndex < _swipe.panes.length; paneIndex++) {
        pos = (_swipe.containerSize / 100) * (((paneIndex - showIndex) * 100) + percent)
        translate = 'translate3d(' + pos + 'px, 0, 0)';
        _swipe.panes[paneIndex].style.transform = translate
        _swipe.panes[paneIndex].style.mozTransform = translate
        _swipe.panes[paneIndex].style.webkitTransform = translate
    }

    // update Dots
    for(var i = 0; i < _swipe.dots.length; i++){
        _swipe.dots[i].className = "dot"
    }
    _swipe.dots[showIndex].className = "dot selected"
}

_swipe.onPan = function(ev) {
    var delta = ev.deltaX;
    var percent = (100 / _swipe.containerSize) * delta;
    var animate = false;
    if (ev.type == 'panend' || ev.type == 'pancancel') {
        if (Math.abs(percent) > 20 && ev.type == 'panend') {
            _swipe.currentIndex += (percent < 0) ? 1 : -1;
        }
        percent = 0;
        animate = true;
    }
    _swipe.show(_swipe.currentIndex, percent, animate)
}

_swipe.init = function(index){
    _swipe.setSize()
    var mc = new Hammer(_swipe.container)
    mc.on("panstart panmove panend pancancel", _swipe.onPan)
    _swipe.show(index)
}

_swipe.setSize = function(){
    _swipe.containerSize = _swipe.container.offsetWidth || 1000
}

_swipe.init(0)

window.onresize = function(event) {
    _swipe.setSize()
}