var canvasEl
var ctx
var drawLayer      // offscreen canvas holding ONLY the freehand drawing
var drawCtx        // 2d context of the drawing layer
var currentImg     // the loaded Image, kept so text/color edits redraw without reloading
var currentImgId   // which image id currentImg currently holds
var isDrawing = false   // true while the mouse is held down on the canvas
var isErasing = false   // true when the eraser tool is active (instead of the brush)
var lastPoint = null    // previous mouse point, so we can draw a line segment to the new one
var isDraggingLine = false   // true while a text line is being dragged
var dragOffsetX = 0     // gap between the cursor and the line anchor, so it doesn't jump
var dragOffsetY = 0
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

// Mouse pressed: if it landed on a text line, select and start dragging it; otherwise draw.
function onCanvasMouseDown(ev){
	var pos = getCanvasPos(ev)
	var hitIdx = getLineIdxAtPos(pos)
	if(hitIdx !== -1){
		memeService.setSelectedLine(hitIdx)
		startLineDrag(hitIdx, pos)
		refreshSelectedLine()
		return
	}
	isDrawing = true
	lastPoint = pos
	paintSegment(lastPoint, lastPoint)
	drawMeme()
}

// Remember which line we grabbed and the offset from the cursor to its anchor.
function startLineDrag(idx, pos){
	var meme = memeService.getMeme()
	var anchor = getLinePos(meme.lines[idx], idx)
	isDraggingLine = true
	dragOffsetX = pos.x - anchor.x
	dragOffsetY = pos.y - anchor.y
}

// Mouse moved: drag a line, keep drawing, or just update the hover cursor.
function onCanvasMouseMove(ev){
	var pos = getCanvasPos(ev)
	if(isDraggingLine){
		memeService.setLinePos(pos.x - dragOffsetX, pos.y - dragOffsetY)
		drawMeme()
		return
	}
	if(isDrawing){
		paintSegment(lastPoint, pos)
		lastPoint = pos
		drawMeme()
		return
	}
	updateHoverCursor(pos)
}

// Show a "move" cursor over a text line, otherwise the drawing crosshair.
function updateHoverCursor(pos){
	canvasEl.style.cursor = (getLineIdxAtPos(pos) !== -1) ? 'move' : 'crosshair'
}

// Mouse released or left the canvas: end any stroke or line drag.
function onCanvasStopDraw(){
	isDrawing = false
	isDraggingLine = false
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
	if(!currentImg || !currentImg.naturalWidth) return
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

// Loop over every text line, drawing each one and a highlight box around the selected one.
function drawLines(){
	var meme = memeService.getMeme()
	for(var j=0;j<meme.lines.length;j++){
		drawLine(meme.lines[j], j)
		if(j === meme.selectedLineIdx) drawLineHighlight(meme.lines[j], j)
	}
}

// A line's anchor: its own dragged x/y if set, otherwise the default stacked position.
function getLinePos(line, idx){
	var x = (line.x === null || line.x === undefined) ? canvasEl.width / 2 : line.x
	var y = (line.y === null || line.y === undefined) ? (60 + idx * (line.size + 10)) : line.y
	return { x: x, y: y }
}

// Draw a single text line, centered on its anchor point.
function drawLine(line, idx){
	var pos = getLinePos(line, idx)
	ctx.fillStyle = line.color || '#ffffff'
	ctx.strokeStyle = '#000'
	ctx.lineWidth = Math.max(2, Math.floor(line.size/12))
	ctx.textAlign = 'center'
	ctx.font = line.size + 'px Impact, Arial'
	ctx.fillText(line.txt, pos.x, pos.y)
	ctx.strokeText(line.txt, pos.x, pos.y)
}

// Draw a dashed orange box around a line to show it is the selected one.
function drawLineHighlight(line, idx){
	var box = getLineBox(line, idx)
	ctx.save()
	ctx.strokeStyle = '#f7941d'
	ctx.lineWidth = 2
	ctx.setLineDash([6,4])
	ctx.strokeRect(box.x, box.y, box.w, box.h)
	ctx.restore()
}

// Compute the rectangle that surrounds a line's text (used for the box and hit-testing).
function getLineBox(line, idx){
	ctx.font = line.size + 'px Impact, Arial'
	ctx.textAlign = 'center'
	var pos = getLinePos(line, idx)
	var textW = ctx.measureText(line.txt || '').width
	var pad = 8
	var boxW = Math.max(textW, 30) + pad * 2
	var boxH = line.size + pad * 2
	var boxX = pos.x - boxW / 2
	var boxY = pos.y - line.size + pad / 2
	return { x: boxX, y: boxY, w: boxW, h: boxH }
}

// Return the index of the topmost line whose box contains pos, or -1 if none.
function getLineIdxAtPos(pos){
	var meme = memeService.getMeme()
	for(var i=meme.lines.length-1;i>=0;i--){
		var box = getLineBox(meme.lines[i], i)
		if(pos.x >= box.x && pos.x <= box.x + box.w && pos.y >= box.y && pos.y <= box.y + box.h){
			return i
		}
	}
	return -1
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
