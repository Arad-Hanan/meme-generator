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

    if (textInput) textInput.addEventListener('input', onTextInput)
    if (textColorPicker) textColorPicker.addEventListener('input', onTextColorInput)
    if (drawColorPicker) drawColorPicker.addEventListener('input', onDrawColorInput)
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

// TODO : enable download
