var canvasEl
var ctx
var currentImg   
var currentImgId  
var isDrawing = false  
var BRUSH_SIZE = 5     

// Grab the canvas + 2d context once, wire up freehand drawing, then draw the meme.
function initMemeController(){
	canvasEl = document.querySelector('.meme-canvas')
	if(!canvasEl) return
	ctx = canvasEl.getContext('2d')
	canvasEl.addEventListener('mousedown', onCanvasMouseDown)
	canvasEl.addEventListener('mousemove', onCanvasMouseMove)
	canvasEl.addEventListener('mouseup', onCanvasStopDraw)
	canvasEl.addEventListener('mouseleave', onCanvasStopDraw)
	renderMeme()
}

// Mouse pressed: start a new stroke (using the brush color) and mark its first point.
function onCanvasMouseDown(ev){
	isDrawing = true
	memeService.addStroke(memeService.getDrawColor(), BRUSH_SIZE)
	addPointFromEvent(ev)
}

// Mouse moved: only while drawing, add the new point and redraw.
function onCanvasMouseMove(ev){
	if(!isDrawing) return
	addPointFromEvent(ev)
}

// Mouse released or left the canvas: stop the current stroke.
function onCanvasStopDraw(){
	isDrawing = false
}

// Convert a mouse event into a canvas point and append it to the current stroke, then redraw.
function addPointFromEvent(ev){
	var pos = getCanvasPos(ev)
	memeService.addStrokePoint(pos.x, pos.y)
	drawMeme()
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

// Wipe the whole canvas before each redraw.
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
// away (instant on text/color edits); otherwise load it first, then draw.
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

// Fit the loaded image to the canvas, then draw the text lines on top.
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
	drawLines()
	drawStrokes()
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

// Paint every saved freehand stroke on top of the image.
function drawStrokes(){
	var meme = memeService.getMeme()
	for(var i=0;i<meme.strokes.length;i++){
		drawStroke(meme.strokes[i])
	}
}

// Draw a single stroke: a dot for one point, otherwise a connected line.
function drawStroke(stroke){
	if(stroke.points.length === 0) return
	ctx.strokeStyle = stroke.color
	ctx.fillStyle = stroke.color
	ctx.lineWidth = stroke.size
	ctx.lineCap = 'round'
	ctx.lineJoin = 'round'

	if(stroke.points.length === 1){
		var p = stroke.points[0]
		ctx.beginPath()
		ctx.arc(p.x, p.y, stroke.size/2, 0, Math.PI*2)
		ctx.fill()
		return
	}

	ctx.beginPath()
	ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
	for(var i=1;i<stroke.points.length;i++){
		ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
	}
	ctx.stroke()
}

var memeController = {
	init: initMemeController,
	renderMeme: renderMeme
}
