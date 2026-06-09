// Clear the grid and rebuild a thumbnail for every image in the service.
function renderGallery(){
	var elGrid = document.querySelector('.gallery-grid')
	if(!elGrid) return
	var imgs = memeService.getImgs()
	elGrid.innerHTML = ''
	for(var i=0;i<imgs.length;i++){
		addGalleryImg(elGrid, imgs[i])
	}
}

// Build one img thumbnail, tag it with its id class, and wire its click.
function addGalleryImg(grid, img){
	var elImg = document.createElement('img')
	elImg.src = img.src
	elImg.alt = 'meme'
	elImg.classList.add('gallery-img')
	elImg.classList.add('js-img-' + img.id)
	elImg.addEventListener('click', onImgClick)
	grid.appendChild(elImg)
}

// On thumbnail click: select that image, scroll to the editor, and redraw.
function onImgClick(ev){
	var id = getImgIdFromEl(ev.currentTarget)
	memeService.setImgById(id)
	scrollToEditor()
	if(typeof memeController !== 'undefined' && memeController.renderMeme){
		memeController.renderMeme()
	}
}

// Recover the numeric image id by reading the class off the element.
function getImgIdFromEl(el){
	var prefix = 'js-img-'
	for(var i=0;i<el.classList.length;i++){
		var name = el.classList[i]
		if(name.indexOf(prefix) === 0){
			return +name.slice(prefix.length)
		}
	}
	return null
}

// Smoothly scroll the editor panel into view.
function scrollToEditor(){
	var editor = document.querySelector('.editor')
	if(editor && editor.scrollIntoView) editor.scrollIntoView({behavior:'smooth'})
}

var galleryController = {
	renderGallery: renderGallery
}
