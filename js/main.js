onPageLoad()

// Entry point: build the gallery, init the canvas, hook up the controls, sync the editor.
function onPageLoad() {
    galleryController.renderGallery()
    memeController.init()
    bindControls()
    refreshSelectedLine()
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
    var addLineBtn = document.querySelector('.add-line-btn')
    var deleteLineBtn = document.querySelector('.delete-line-btn')

    if (textInput) textInput.addEventListener('input', onTextInput)
    if (textColorPicker) textColorPicker.addEventListener('input', onTextColorInput)
    if (drawColorPicker) drawColorPicker.addEventListener('input', onDrawColorInput)
    if (eraserBtn) eraserBtn.addEventListener('click', onEraserClick)
    if (clearBtn) clearBtn.addEventListener('click', onClearClick)
    if (downloadLink) downloadLink.addEventListener('click', onDownloadClick)
    if (searchInput) searchInput.addEventListener('input', onSearchInput)
    if (addLineBtn) addLineBtn.addEventListener('click', onAddLineClick)
    if (deleteLineBtn) deleteLineBtn.addEventListener('click', onDeleteLineClick)
}

// As the user types: update the selected line's text, redraw, and refresh its list label.
function onTextInput(e) {
    memeService.setLineTxt(e.target.value)
    memeController.renderMeme()
    linesController.renderLines()
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

// Add line button: create a new empty line, select it, and refresh the editor.
function onAddLineClick() {
    memeService.addLine()
    refreshSelectedLine()
    focusTextInput()
}

// Delete line button: remove the selected line and refresh the editor.
function onDeleteLineClick() {
    memeService.deleteLine()
    refreshSelectedLine()
}

// Move keyboard focus to the text box (after adding a line, so the user can type right away).
function focusTextInput() {
    var textInput = document.querySelector('.text-input')
    if (textInput) textInput.focus()
}

// Sync everything to the currently selected line: text box, text color, the side list, the canvas.
function refreshSelectedLine() {
    var line = memeService.getSelectedLine()
    var textInput = document.querySelector('.text-input')
    var textColorPicker = document.querySelector('.text-color-picker')

    if (textInput) textInput.value = line ? line.txt : ''
    if (textColorPicker && line) textColorPicker.value = line.color

    linesController.renderLines()
    memeController.renderMeme()
}
