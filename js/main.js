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
    var colorPicker = document.querySelector('.color-picker')

    if (textInput) textInput.addEventListener('input', onTextInput)
    if (colorPicker) colorPicker.addEventListener('input', onColorInput)
}

// As the user types: update the selected line's text, then redraw the canvas.
function onTextInput(e) {
    memeService.setLineTxt(e.target.value)
    memeController.renderMeme()
}

// When the user picks a color: update the selected line's color, then redraw.
function onColorInput(e) {
    memeService.setLineColor(e.target.value)
    memeController.renderMeme()
}

// TODO : enable download
