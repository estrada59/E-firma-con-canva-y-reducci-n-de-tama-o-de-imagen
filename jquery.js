/*
		El siguiente codigo en JS Contiene mucho codigo
		de las siguietes 3 fuentes:
		https://stipaltamar.github.io/dibujoCanvas/
		https://developer.mozilla.org/samples/domref/touchevents.html - https://developer.mozilla.org/es/docs/DOM/Touch_events
		http://bencentra.com/canvas/signature/signature.html - https://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html


		E-Firma Canvas Elaborado por:
		Luis Alberto Luisjuan Guerrero 
		https://codepen.io/Tito0269/details/BdRbGa

		Editado por Enrique Estrada

		// credit to:   https://gist.github.com/ORESoftware/ba5d03f3e1826dc15d5ad2bcec37f7bf 
		//              https://github.com/Gimyk/resize_base64_image/blob/main/main.js


*/

(function() { // Comenzamos una funcion auto-ejecutable

	// Obtenenemos un intervalo regular(Tiempo) en la pamtalla
	window.requestAnimFrame = (function (callback) {
		return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimaitonFrame ||
					function (callback) {
					 	window.setTimeout(callback, 1000/60);
            // Retrasa la ejecucion de la funcion para mejorar la experiencia
					};
	})();
	document.getElementById("color").hidden = true;
	document.getElementById("puntero").hidden = true;
	// Traemos el canvas mediante el id del elemento html
	var canvas = document.getElementById("draw-canvas");
	var ctx = canvas.getContext("2d");


	// Mandamos llamar a los Elemetos interactivos de la Interfaz HTML
	var drawText = document.getElementById("draw-dataUrl");
	var drawImage = document.getElementById("draw-image");
	var clearBtn = document.getElementById("draw-clearBtn");
	var submitBtn = document.getElementById("draw-submitBtn");

	var drawTextResized = document.getElementById("draw-dataUrl-resized");
	var drawImageResized = document.getElementById("draw-image-resized");
	var oldSizeImage = document.getElementById("draw-image-old-size");
	var newSizeImage = document.getElementById("draw-image-new-size");

	var widthOldImage = document.getElementById("draw-image-old-width");
	var heightOldImage = document.getElementById("draw-image-old-height");
	var widthNewImage = document.getElementById("draw-image-new-width");
	var heightNewImage = document.getElementById("draw-image-new-height");
	

	
	clearBtn.addEventListener("click", function (e) {
		// Definimos que pasa cuando el boton draw-clearBtn es pulsado
		clearCanvas();
		drawImage.setAttribute("src", "");
	}, false);
		// Definimos que pasa cuando el boton draw-submitBtn es pulsado
	submitBtn.addEventListener("click", function (e) {
	var dataUrl = canvas.toDataURL();

	const olds = calc_image_size(dataUrl);
    console.log('Old ize => ', olds, 'KB');

	oldSizeImage.innerHTML ='Tamaño de imagen: '+ olds + 'KB';


	// console.log(dataUrl);

	reduce(dataUrl);
	
	
	drawText.innerHTML = dataUrl;
	drawImage.setAttribute("src", dataUrl);
	 }, false);

	// Activamos MouseEvent para nuestra pagina
	var drawing = false;
	var mousePos = { x:0, y:0 };
	var lastPos = mousePos;
	canvas.addEventListener("mousedown", function (e)
  {
    /*
      Mas alla de solo llamar a una funcion, usamos function (e){...}
      para mas versatilidad cuando ocurre un evento
    */
		var tint = document.getElementById("color");
		var punta = document.getElementById("puntero");
		console.log(e);
		drawing = true;
		lastPos = getMousePos(canvas, e);
	}, false);
	canvas.addEventListener("mouseup", function (e)
  {
		drawing = false;
	}, false);
	canvas.addEventListener("mousemove", function (e)
  {
		mousePos = getMousePos(canvas, e);
	}, false);

	// Activamos touchEvent para nuestra pagina
	canvas.addEventListener("touchstart", function (e) {
		mousePos = getTouchPos(canvas, e);
    console.log(mousePos);
    e.preventDefault(); // Prevent scrolling when touching the canvas
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousedown", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, false);
	canvas.addEventListener("touchend", function (e) {
    e.preventDefault(); // Prevent scrolling when touching the canvas
		var mouseEvent = new MouseEvent("mouseup", {});
		canvas.dispatchEvent(mouseEvent);
	}, false);
  canvas.addEventListener("touchleave", function (e) {
    // Realiza el mismo proceso que touchend en caso de que el dedo se deslice fuera del canvas
    e.preventDefault(); // Prevent scrolling when touching the canvas
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  }, false);
	canvas.addEventListener("touchmove", function (e) {
    e.preventDefault(); // Prevent scrolling when touching the canvas
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousemove", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	}, false);

	// Get the position of the mouse relative to the canvas
	function getMousePos(canvasDom, mouseEvent) {
		var rect = canvasDom.getBoundingClientRect();
    /*
      Devuelve el tamaño de un elemento y su posición relativa respecto
      a la ventana de visualización (viewport).
    */
		return {
			x: mouseEvent.clientX - rect.left,
			y: mouseEvent.clientY - rect.top
		};
	}

	// Get the position of a touch relative to the canvas
	function getTouchPos(canvasDom, touchEvent) {
		var rect = canvasDom.getBoundingClientRect();
    console.log(touchEvent);
    /*
      Devuelve el tamaño de un elemento y su posición relativa respecto
      a la ventana de visualización (viewport).
    */
		return {
			x: touchEvent.touches[0].clientX - rect.left, // Popiedad de todo evento Touch
			y: touchEvent.touches[0].clientY - rect.top
		};
	}

	// Draw to the canvas
	function renderCanvas() {
		if (drawing) {
      var tint = document.getElementById("color");
      var punta = document.getElementById("puntero");
      ctx.strokeStyle = tint.value;
      ctx.beginPath();
			ctx.moveTo(lastPos.x, lastPos.y);
			ctx.lineTo(mousePos.x, mousePos.y);
      console.log(punta.value);
    	ctx.lineWidth = punta.value;
			ctx.stroke();
      ctx.closePath();
			lastPos = mousePos;
		}
	}

	function clearCanvas() {
		canvas.width = canvas.width;
	}

	// Allow for animation
	(function drawLoop () {
		requestAnimFrame(drawLoop);
		renderCanvas();
	})();

	// Reduce el tamaño de la imagen
	async function reduce(dataUrl){
		const resized = await reduce_image_file_size(dataUrl);
		console.log('resized: '+resized);
		const news = calc_image_size(resized)

		console.log('new size => ', news, 'KB')
		newSizeImage.innerHTML ='Tamaño de imagen: '+ news + 'KB';

		drawTextResized.innerHTML = resized;
		drawImageResized.setAttribute("src", resized);
	}

	/**
	 * Resize a base 64 Image
	 * @param {String} base64Str - The base64 string (must include MIME type)
	 * @param {Number} MAX_WIDTH - The width of the image in pixels
	 * @param {Number} MAX_HEIGHT - The height of the image in pixels
	 */
	 async function reduce_image_file_size(base64Str, MAX_WIDTH = 100, MAX_HEIGHT = 100) {
		let resized_base64 = await new Promise((resolve) => {
			let img = new Image()
			img.src = base64Str
			// console.log('entro: '+ base64Str);
			// console.log('width: '+img.width);
			// console.log('height: '+img.height);
			img.onload = () => {
				let canvas = document.createElement('canvas');
				let width = img.width
				let height = img.height
	
				console.log('width 2: '+width);
				console.log('height 2: '+height);

				widthOldImage.innerHTML ='Width: '+ width + 'px'; ;
				heightOldImage.innerHTML ='Height: ' + height+ 'px';

	
	
				if (width > height) {
					if (width > MAX_WIDTH) {
						height *= MAX_WIDTH / width
						width = MAX_WIDTH
					}
				} else {
					if (height > MAX_HEIGHT) {
						width *= MAX_HEIGHT / height
						height = MAX_HEIGHT
					}
				}
				canvas.width = width
				canvas.height = height
	
				console.log('width 3: '+canvas.width);
				console.log('height 3: '+canvas.height);

				widthNewImage.innerHTML = 'Width: '+canvas.width+'px';
				heightNewImage.innerHTML = 'Height: ' +canvas.height+'px';

				let ctx = canvas.getContext('2d')
				ctx.drawImage(img, 0, 0, width, height)
				resolve(canvas.toDataURL()) // this will return base64 image results after resize
			}
		});
		return resized_base64;
	}
	
	function calc_image_size(image) {
		let y = 1;
		if (image.endsWith('==')) {
			y = 2
		}
		const x_size = (image.length * (3 / 4)) - y
		return Math.round(x_size / 1024)
	}
	
	// credit to:   https://gist.github.com/ORESoftware/ba5d03f3e1826dc15d5ad2bcec37f7bf 
	//              https://github.com/Gimyk/resize_base64_image/blob/main/main.js
	

})();
