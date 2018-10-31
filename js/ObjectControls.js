/* --------------------------------------------------------
THREE.ObjectControls
version: 1.0
author: Alberto Piras
email: a.piras.ict@gmail.com
github: https://github.com/albertopiras
license: MIT
----------------------------------------------------------*/

/**
 * THREE.ObjectControls
 * @constructor
 * @param camera - The camera.
 * @param domElement - the renderer's dom element
 * @param objectToMove - the object to control.
 */

THREE.ObjectControls = function (camera, domElement, objectToMove) {
	this.camera = camera;
	this.objectToMove = objectToMove;
	this.domElement = (domElement !== undefined) ? domElement : document;

	var maxZoom = 2,
		minZoom = 0.5,
		minAngle = -0.5
		maxAngle = 0.5,
		zoomSpeed = 1,
		rotationSpeed = 1;

	this.setZoomlevel = function (min, max) {
		minZoom = min;
        maxZoom = max;
	};

	this.setAngle = function (min, max) {
		minAngle = min;
        maxAngle = max;
	};

	this.setZoomSpeed = function (speed) {
		zoomSpeed = speed;
	};

	this.setRotationSpeed = function (speed) {
		rotationSpeed = speed;
	};

	var mouseFlags = {
		MOUSEDOWN: 0,
		MOUSEMOVE: 1
	};

	var flag;
	var isDragging = false;
	var previousMousePosition = {
		x: 0,
		y: 0
	};

	/**currentTouches
	 * length 0 : no zoom
	 * length 2 : is zoomming
	 */
	var currentTouches = [];

	var prevZoomDiff = {
		X: null,
		Y: null
	};

	/******************* Interaction Controls (rotate & zoom, desktop & mobile) - Start ************/
	// MOUSE - move
	this.domElement.addEventListener('mousedown', mouseDown, false);
	this.domElement.addEventListener('mousemove', mouseMove, false);
	this.domElement.addEventListener('mouseup', mouseUp, false);
	// MOUSE - zoom
	this.domElement.addEventListener('wheel', wheel, false);

	function mouseDown(e) {
		isDragging = true;
		flag = mouseFlags.MOUSEDOWN;
	}

	function mouseMove(e) {
		var deltaMove = {
			x: e.offsetX - previousMousePosition.x,
			y: e.offsetY - previousMousePosition.y
		};

		if (isDragging) {
			if (deltaMove.x != 0) {
				objectToMove.rotation.y += rotationSpeed*deltaMove.x / 200;
                flag = mouseFlags.MOUSEMOVE;
			}
		}
        if (isDragging) {
            if (deltaMove.y != 0) {
                objectToMove.rotation.x += rotationSpeed*deltaMove.y / 200;
                flag = mouseFlags.MOUSEMOVE;
                if(objectToMove.rotation.x<-0.5){
                    objectToMove.rotation.x = -0.5;
                }
                if(objectToMove.rotation.x>0.5){
                    objectToMove.rotation.x = 0.5;
                }
            }
        }
		previousMousePosition = {
			x: e.offsetX,
			y: e.offsetY
		};
	}

	function mouseUp(e) {
		isDragging = false;
	}

	function wheel(e) {

		if (e.deltaY > 0 && objectToMove.scale.x > minZoom) {
            objectToMove.scale.set(0.9*objectToMove.scale.x,0.9*objectToMove.scale.y,0.9*objectToMove.scale.z);
		} else if (e.deltaY < 0 && objectToMove.scale.x < maxZoom) {
            objectToMove.scale.set(1.1*objectToMove.scale.x,1.1*objectToMove.scale.y,1.1*objectToMove.scale.z);
		}
	}

	// TOUCH - move
	this.domElement.addEventListener('touchstart', onTouchStart, false);
	this.domElement.addEventListener('touchmove', onTouchMove, false);
	this.domElement.addEventListener('touchend', onTouchEnd, false);

	function onTouchStart(e) {
		e.preventDefault();
		flag = mouseFlags.MOUSEDOWN;
		if (e.touches.length === 2) {
			prevZoomDiff.X = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
			prevZoomDiff.Y = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
			currentTouches = new Array(2);
		} else {
			previousMousePosition = {
				x: e.touches[0].pageX,
				y: e.touches[0].pageY
			};
		}
	}

	function onTouchEnd(e) {
		prevZoomDiff.X = null;
		prevZoomDiff.Y = null;

		// if you were zooming out, currentTouches is updated for each finger you leave up the screen
		// so each time a finger leaves up the screen, currentTouches length is decreased of a unit.
		// When you leave up both 2 fingers, currentTouches.length is 0, this means the zoomming phase is ended
		if (currentTouches.length > 0) {
			currentTouches.pop();
		} else {
			currentTouches = [];
		}
		e.preventDefault();
		if (flag === mouseFlags.MOUSEDOWN) {
			// console.log("touchClick");
			// you can invoke more other functions for animations and so on...
		}
		else if (flag === mouseFlags.MOUSEMOVE) {
			// console.log("touch drag");
			// you can invoke more other functions for animations and so on...
		}
		// console.log("onTouchEnd");
	}

	//TOUCH - Zoom
	function onTouchMove(e) {
		e.preventDefault();
		flag = mouseFlags.MOUSEMOVE;
		// If two pointers are down, check for pinch gestures
		if (e.touches.length === 2) {
			currentTouches = new Array(2);
			// console.log("onTouchZoom");
			// Calculate the distance between the two pointers
			var curDiffX = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
			var curDiffY = Math.abs(e.touches[0].clientY - e.touches[1].clientY);

			if (prevZoomDiff && prevZoomDiff.X > 0 && prevZoomDiff.Y > 0) {
				if ((curDiffX > prevZoomDiff.X) &&
					(curDiffY > prevZoomDiff.Y) && (camera.position.z > minZoom)) {
					// console.log("Pinch moving IN -> Zoom in", e);
					zoomIn();
				} else if (curDiffX < prevZoomDiff.X && camera.position.z < maxZoom && curDiffY < prevZoomDiff.Y) {
					// console.log("Pinch moving OUT -> Zoom out", e);
					zoomOut();
				}
			}
			// Cache the distance for the next move event 
			prevZoomDiff.X = curDiffX;
			prevZoomDiff.Y = curDiffY;

		} else if (currentTouches.length === 0) {
			prevZoomDiff.X = null;
			prevZoomDiff.Y = null;
			// console.log("onTouchMove");
			var deltaMove = {
				x: e.touches[0].pageX - previousMousePosition.x,
				y: e.touches[0].pageY - previousMousePosition.y
			};

			if (deltaMove.x != 0) {
				// console.log(deltaMove.x);
				objectToMove.rotation.y += rotationSpeed*deltaMove.x / 150;
			}
            if (deltaMove.y != 0) {
                objectToMove.rotation.x += rotationSpeed*deltaMove.y / 200;
                if(objectToMove.rotation.x<-0.5){
                    objectToMove.rotation.x = -0.5;
                }
                if(objectToMove.rotation.x>0.5){
                    objectToMove.rotation.x = 0.5;
                }
            }

			previousMousePosition = {
				x: e.touches[0].pageX,
				y: e.touches[0].pageY
			};
		}
	}



};
