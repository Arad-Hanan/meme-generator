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
    ],
    // Freehand drawings. Each stroke is one mouse-drag: { color, size, points:[{x,y}] }
    strokes: []
}

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

function setLineTxt(txt){
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setLineColor(color){
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

// Begin a new freehand stroke (called once when the mouse goes down).
function addStroke(color, size){
    gMeme.strokes.push({ color: color, size: size, points: [] })
}

// Add one point to the stroke currently being drawn (called as the mouse moves).
function addStrokePoint(x, y){
    if(gMeme.strokes.length === 0) return
    var lastStroke = gMeme.strokes[gMeme.strokes.length - 1]
    lastStroke.points.push({ x: x, y: y })
}

// Remove all freehand strokes.
function clearStrokes(){
    gMeme.strokes = []
}

var memeService = {
    getImgs: getImgs,
    getMeme: getMeme,
    setImgById: setImgById,
    setLineTxt: setLineTxt,
    setLineColor: setLineColor,
    addStroke: addStroke,
    addStrokePoint: addStrokePoint,
    clearStrokes: clearStrokes
}

