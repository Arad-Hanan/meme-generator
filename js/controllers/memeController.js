var canvasEl
var ctx

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

// Start loading the selected image, drawing happens in onImageLoad once it's ready.
function renderMeme(){
	var imgObj = findSelectedImg()
	if(!imgObj) return

	var img = new Image()
	img.crossOrigin = 'anonymous'
	img.src = imgObj.src
	img.onload = onImageLoad
}

// Runs when the image finishes loading: fit it to the canvas, then draw the text.
function onImageLoad(){
	// `this` is the loaded Image element
	var img = this
	var cw = canvasEl.width
	var ch = canvasEl.height
	var ratio = Math.min(cw / img.width, ch / img.height)
	var iw = img.width * ratio
	var ih = img.height * ratio
	var ix = (cw - iw) / 2
	var iy = (ch - ih) / 2
	clearCanvas()
	ctx.drawImage(img, ix, iy, iw, ih)
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
