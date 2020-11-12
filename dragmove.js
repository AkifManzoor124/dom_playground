// https://github.com/knadh/dragmove.js
// Kailash Nadh (c) 2020.
// MIT License.

let _loaded = false;
let _callbacks = [];
const _isTouch = window.ontouchstart !== undefined;
console.log('hello')

function dragmove(target, handler, onStart, onEnd) {
  // Register a global event to capture mouse moves (once).
  if (!_loaded) {
    document.addEventListener(_isTouch ? "touchmove" : "mousemove", function(e) {
      if(isMoving) {
        let c = e;
        if (e.touches) {
          c = e.touches[0];
        }
        console.log(`mousemove: x - ${e.clientX} | y = ${e.clientY}`)
        // On mouse move, dispatch the coords to all registered callbacks.
        for (var i = 0; i < _callbacks.length; i++) {
          _callbacks[i](c.clientX, c.clientY);
        }
      }
      
    });
  }

  _loaded = true;
  let isMoving = false, hasStarted = false;
  let startX = 0, startY = 0, lastX = 0, lastY = 0;

  // On the first click and hold, record the offset of the pointer in relation
  // to the point of click inside the element.
  handler.addEventListener(_isTouch ? "touchstart" : "mousedown", function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (target.dataset.dragEnabled === "false") {
      return;
    }

    let c = e;
    if (e.touches) {
      c = e.touches[0];
    }

    isMoving = true;
    startX = target.offsetLeft - c.clientX;
    startY = target.offsetTop - c.clientY;
  });

  // On leaving click, stop moving.
  document.addEventListener(_isTouch ? "touchend" : "mouseup", function() {
    isMoving = false;
    hasStarted = false;

    if (onEnd) {
      onEnd(target, parseInt(target.style.left), parseInt(target.style.top));
    }
  });

  // Register mouse-move callback to move the element.
  _callbacks.push(function move(x, y) {
    if (!isMoving) {
      return;
    }

    if (!hasStarted) {
      hasStarted = true;
      if (onStart) {
        onStart(target, lastX, lastY);
      }
    }

    lastX = x + startX;
    lastY = y + startY;

    // If boundary checking is on, don't let the element cross the viewport.
    if (target.dataset.dragBoundary === "true") {
      if (lastX < 1 || lastX >= window.innerWidth - target.offsetWidth) {
        return;
      }
      if (lastY < 1 || lastY >= window.innerHeight - target.offsetHeight) {
        return;
      }
    }

    target.style.left = lastX + "px";
    target.style.top = lastY + "px";
  });
}

