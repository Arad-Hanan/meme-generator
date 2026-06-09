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
    var downloadLink = document.querySelector('.download-link')

    if (textInput) textInput.addEventListener('input', onTextInput)
    if (colorPicker) colorPicker.addEventListener('input', onColorInput)
    if (downloadLink) downloadLink.addEventListener('click', onDownloadClick)
}

// Fires as the user types meme text (rendering hookup comes later).
function onTextInput(e) {
    // will bind to meme rendering later
    console.log('text:', e.target.value)
}

// Fires when the user picks a text color.
function onColorInput(e) {
    console.log('color:', e.target.value)
}

// Stop the link navigating; download is a TODO until the canvas is editable.
function onDownloadClick(e) {
    e.preventDefault()
    alert('Download will be enabled once you create and render a meme on the canvas.')
}
