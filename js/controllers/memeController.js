var canvasEl
var ctx
var currentImg     // the loaded Image, kept so text/color edits redraw without reloading
var currentImgId   // which image id currentImg currently holds

// Grab the canvas + 2d context once, then draw the current meme.
function initMemeController(){
	canvasEl = document.querySelector('.meme-canvas')
	if(!canvasEl) return
	ctx = canvasEl.getContext('2d')
	renderMeme()
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

var memeController = {
	init: initMemeController,
	renderMeme: renderMeme
}
