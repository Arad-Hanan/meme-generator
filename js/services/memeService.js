// The catalog of meme pictures. Each id matches its file name in the img/ folder.
var imgs = [
    { id: 1, src: 'img/1.jpg', keywords: ['meme'] },
    { id: 2, src: 'img/2.jpg', keywords: ['meme'] },
    { id: 3, src: 'img/3.jpg', keywords: ['meme'] },
    { id: 4, src: 'img/4.jpg', keywords: ['meme'] },
    { id: 5, src: 'img/5.jpg', keywords: ['meme'] },
    { id: 6, src: 'img/6.jpg', keywords: ['meme'] },
    { id: 7, src: 'img/7.jpg', keywords: ['meme'] },
    { id: 8, src: 'img/8.jpg', keywords: ['meme'] },
    { id: 9, src: 'img/9.jpg', keywords: ['meme'] },
    { id: 10, src: 'img/10.jpg', keywords: ['meme'] },
    { id: 11, src: 'img/11.jpg', keywords: ['meme'] },
    { id: 12, src: 'img/12.jpg', keywords: ['meme'] },
    { id: 13, src: 'img/13.jpg', keywords: ['meme'] },
    { id: 14, src: 'img/14.jpg', keywords: ['meme'] },
    { id: 15, src: 'img/15.jpg', keywords: ['meme'] },
    { id: 16, src: 'img/16.jpg', keywords: ['meme'] },
    { id: 17, src: 'img/17.jpg', keywords: ['meme'] },
    { id: 18, src: 'img/18.jpg', keywords: ['meme'] }
]

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Type here...',
            size: 40,
            color: '#ffffff',
            x: null,
            y: null
        }
    ]
}

// Current brush color for freehand drawing (separate from the text color).
var gDrawColor = '#000000'

function getImgs(){
    return imgs
}

function getMeme(){
    return gMeme
}

function setImgById(id){
    for(var i=0;i<imgs.length;i++){
        if(imgs[i].id === id){
            gMeme.selectedImgId = id
            return
        }
    }
}

// The text line the user is currently editing (or null if there are none).
function getSelectedLine(){
    return gMeme.lines[gMeme.selectedLineIdx] || null
}

// Switch which line is being edited.
function setSelectedLine(idx){
    if(idx >= 0 && idx < gMeme.lines.length){
        gMeme.selectedLineIdx = idx
    }
}

// Add a fresh empty line and make it the selected one.
function addLine(){
    gMeme.lines.push({ txt: '', size: 40, color: '#ffffff', x: null, y: null })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

// Remove the selected line and keep the selection on a valid line.
function deleteLine(){
    if(gMeme.lines.length === 0) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if(gMeme.selectedLineIdx >= gMeme.lines.length){
        gMeme.selectedLineIdx = gMeme.lines.length - 1
    }
    if(gMeme.selectedLineIdx < 0){
        gMeme.selectedLineIdx = 0
    }
}

function setLineTxt(txt){
    var line = getSelectedLine()
    if(line) line.txt = txt
}

function setLineColor(color){
    var line = getSelectedLine()
    if(line) line.color = color
}

// Read the current freehand brush color.
function getDrawColor(){
    return gDrawColor
}

// Change the freehand brush color (affects strokes drawn from now on).
function setDrawColor(color){
    gDrawColor = color
}

var memeService = {
    getImgs: getImgs,
    getMeme: getMeme,
    setImgById: setImgById,
    setLineTxt: setLineTxt,
    setLineColor: setLineColor,
    getSelectedLine: getSelectedLine,
    setSelectedLine: setSelectedLine,
    addLine: addLine,
    deleteLine: deleteLine,
    getDrawColor: getDrawColor,
    setDrawColor: setDrawColor
}

