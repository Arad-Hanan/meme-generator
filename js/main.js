onPageLoad()

// Entry point: build the gallery, init the canvas, hook up the controls.
function onPageLoad() {
    galleryController.renderGallery()
    memeController.init()
    bindControls()
}

// Find the control elements by class and attach their event handlers.
function bindControls() {
    var textInput = document.querySelector('.text-input')
    var textColorPicker = document.querySelector('.text-color-picker')
    var drawColorPicker = document.querySelector('.draw-color-picker')
    var eraserBtn = document.querySelector('.eraser-btn')
    var clearBtn = document.querySelector('.clear-btn')
    var downloadLink = document.querySelector('.download-link')
    var searchInput = document.querySelector('.search-input')

    if (textInput) textInput.addEventListener('input', onTextInput)
    if (textColorPicker) textColorPicker.addEventListener('input', onTextColorInput)
    if (drawColorPicker) drawColorPicker.addEventListener('input', onDrawColorInput)
    if (eraserBtn) eraserBtn.addEventListener('click', onEraserClick)
    if (clearBtn) clearBtn.addEventListener('click', onClearClick)
    if (downloadLink) downloadLink.addEventListener('click', onDownloadClick)
    if (searchInput) searchInput.addEventListener('input', onSearchInput)
}

// As the user types: update the selected line's text, then redraw the canvas.
function onTextInput(e) {
    memeService.setLineTxt(e.target.value)
    memeController.renderMeme()
}

// Text color picker: recolor the selected text line, then redraw.
function onTextColorInput(e) {
    memeService.setLineColor(e.target.value)
    memeController.renderMeme()
}

// Drawing color picker: set the brush color for future strokes (existing ones keep their color).
function onDrawColorInput(e) {
    memeService.setDrawColor(e.target.value)
}

// Eraser button: toggle erase mode and reflect the on/off state on the button.
function onEraserClick(e) {
    var isOn = memeController.toggleEraser()
    e.currentTarget.classList.toggle('is-active', isOn)
}

// Clear button: remove all freehand drawing (image and text are untouched).
function onClearClick() {
    memeController.clearDrawing()
}

// Download link: point it at a PNG snapshot of the canvas so the browser saves the file.
function onDownloadClick(e) {
    var link = e.currentTarget
    link.href = memeController.getDataUrl()
    link.download = 'my-meme.png'
}

// Search box: filter the gallery by keyword as the user types.
function onSearchInput(e) {
    galleryController.setFilter(e.target.value)
}
