var canvasEl
var ctx
var drawLayer      // offscreen canvas holding ONLY the freehand drawing
var drawCtx        // 2d context of the drawing layer
var currentImg     // the loaded Image, kept so text/color edits redraw without reloading
var currentImgId   // which image id currentImg currently holds
var isDrawing = false   // true while the mouse is held down on the canvas
var isErasing = false   // true when the eraser tool is active (instead of the brush)
var lastPoint = null    // previous mouse point, so we can draw a line segment to the new one
var BRUSH_SIZE = 5      // thickness of the freehand brush
var ERASER_SIZE = 20    // thickness of the eraser

// Grab the canvas + 2d context once, set up the drawing layer + mouse events, then draw.
function initMemeController(){
	canvasEl = document.querySelector('.meme-canvas')
	if(!canvasEl) return
	ctx = canvasEl.getContext('2d')
	createDrawLayer()
	canvasEl.addEventListener('mousedown', onCanvasMouseDown)
	canvasEl.addEventListener('mousemove', onCanvasMouseMove)
	canvasEl.addEventListener('mouseup', onCanvasStopDraw)
	canvasEl.addEventListener('mouseleave', onCanvasStopDraw)
	renderMeme()
}

// Build the hidden canvas that holds the drawing, same size as the visible one.
function createDrawLayer(){
	drawLayer = document.createElement('canvas')
	drawLayer.width = canvasEl.width
	drawLayer.height = canvasEl.height
	drawCtx = drawLayer.getContext('2d')
}

// Turn the eraser on/off; returns the new state so the UI can show it.
function toggleEraser(){
	isErasing = !isErasing
	return isErasing
}

// Wipe the drawing layer only (image + text stay), then redraw.
function clearDrawing(){
	if(!drawCtx) return
	drawCtx.clearRect(0,0,drawLayer.width,drawLayer.height)
	drawMeme()
}

// Mouse pressed: begin a stroke and paint a dot at the start point.
function onCanvasMouseDown(ev){
	isDrawing = true
	lastPoint = getCanvasPos(ev)
	paintSegment(lastPoint, lastPoint)
	drawMeme()
}

// Mouse moved: only while drawing, paint from the last point to the new one.
function onCanvasMouseMove(ev){
	if(!isDrawing) return
	var pos = getCanvasPos(ev)
	paintSegment(lastPoint, pos)
	lastPoint = pos
	drawMeme()
}

// Mouse released or left the canvas: end the stroke.
function onCanvasStopDraw(){
	isDrawing = false
	lastPoint = null
}

// Paint one line segment onto the drawing layer: brush paints, eraser cuts pixels away.
function paintSegment(from, to){
	drawCtx.lineCap = 'round'
	drawCtx.lineJoin = 'round'
	if(isErasing){
		// 'destination-out' removes existing drawing pixels instead of adding color.
		drawCtx.globalCompositeOperation = 'destination-out'
		drawCtx.lineWidth = ERASER_SIZE
		drawCtx.strokeStyle = 'rgba(0,0,0,1)'
	} else {
		drawCtx.globalCompositeOperation = 'source-over'
		drawCtx.lineWidth = BRUSH_SIZE
		drawCtx.strokeStyle = memeService.getDrawColor()
	}
	drawCtx.beginPath()
	drawCtx.moveTo(from.x, from.y)
	drawCtx.lineTo(to.x, to.y)
	drawCtx.stroke()
}

// Translate page mouse coordinates into canvas coordinates (handles CSS scaling).
function getCanvasPos(ev){
	var rect = canvasEl.getBoundingClientRect()
	var scaleX = canvasEl.width / rect.width
	var scaleY = canvasEl.height / rect.height
	return {
		x: (ev.clientX - rect.left) * scaleX,
		y: (ev.clientY - rect.top) * scaleY
	}
}

// Wipe the whole visible canvas before each redraw.
function clearCanvas(){
	if(!ctx) return
	ctx.clearRect(0,0,canvasEl.width,canvasEl.height)
}

// Look up the image data object the user currently has selected.
function findSelectedImg(){
	var meme = memeService.getMeme()
	var imgs = memeService.getImgs()
	for(var i=0;i<imgs.length;i++){
		if(imgs[i].id === meme.selectedImgId) return imgs[i]
	}
	return null
}

// Draw the current meme. If the selected image is already loaded, redraw right
// away (instant on text/color/draw edits); otherwise load it first, then draw.
function renderMeme(){
	var imgObj = findSelectedImg()
	if(!imgObj) return

	if(currentImg && currentImgId === imgObj.id){
		drawMeme()
		return
	}
	currentImgId = imgObj.id
	currentImg = new Image()
	currentImg.onload = drawMeme
	currentImg.src = imgObj.src
}

// Compose the visible canvas: image at the back, the drawing layer, then text on top.
function drawMeme(){
	if(!currentImg) return
	var cw = canvasEl.width
	var ch = canvasEl.height
	var ratio = Math.min(cw / currentImg.width, ch / currentImg.height)
	var iw = currentImg.width * ratio
	var ih = currentImg.height * ratio
	var ix = (cw - iw) / 2
	var iy = (ch - ih) / 2
	clearCanvas()
	ctx.drawImage(currentImg, ix, iy, iw, ih)
	ctx.drawImage(drawLayer, 0, 0)
	drawLines()
}

// Loop over every text line in the meme and draw each one.
function drawLines(){
	var meme = memeService.getMeme()
	for(var j=0;j<meme.lines.length;j++){
		drawLine(meme.lines[j], j)
	}
}

// Draw a single text line, centered; idx stacks it below the previous lines.
function drawLine(line, idx){
	var cw = canvasEl.width
	ctx.fillStyle = line.color || '#ffffff'
	ctx.strokeStyle = '#000'
	ctx.lineWidth = Math.max(2, Math.floor(line.size/12))
	ctx.textAlign = 'center'
	ctx.font = line.size + 'px Impact, Arial'
	var x = cw/2
	var y = 60 + idx * (line.size + 10)
	ctx.fillText(line.txt, x, y)
	ctx.strokeText(line.txt, x, y)
}

// Export the current canvas (image + drawing + text) as a PNG data URL.
function getDataUrl(){
	if(!canvasEl) return ''
	return canvasEl.toDataURL('image/png')
}

var memeController = {
	init: initMemeController,
	renderMeme: renderMeme,
	toggleEraser: toggleEraser,
	clearDrawing: clearDrawing,
	getDataUrl: getDataUrl
}
