/* linesController - renders the side list of text lines and handles switching between them.
   The line index is carried on a class ("js-line-<idx>"), not an id/dataset attribute.
*/

// Rebuild the side list, one button per text line, marking the selected one active.
function renderLines(){
	var elList = document.querySelector('.lines-list')
	if(!elList) return
	var meme = memeService.getMeme()
	elList.innerHTML = ''
	for(var i=0;i<meme.lines.length;i++){
		addLineItem(elList, meme.lines[i], i, meme.selectedLineIdx)
	}
}

// Build one list button for a line; shows its text or a "Line N" placeholder.
function addLineItem(list, line, idx, selectedIdx){
	var elItem = document.createElement('button')
	elItem.type = 'button'
	elItem.classList.add('line-item')
	elItem.classList.add('js-line-' + idx)
	if(idx === selectedIdx) elItem.classList.add('is-active')
	elItem.textContent = line.txt ? line.txt : ('Line ' + (idx + 1))
	elItem.addEventListener('click', onLineItemClick)
	list.appendChild(elItem)
}

// Clicking a list item selects that line and refreshes the editor.
function onLineItemClick(ev){
	var idx = getLineIdxFromEl(ev.currentTarget)
	memeService.setSelectedLine(idx)
	refreshSelectedLine()
}

// Recover the line index by reading the "js-line-<idx>" class off the element.
function getLineIdxFromEl(el){
	var prefix = 'js-line-'
	for(var i=0;i<el.classList.length;i++){
		var name = el.classList[i]
		if(name.indexOf(prefix) === 0){
			return +name.slice(prefix.length)
		}
	}
	return -1
}

var linesController = {
	renderLines: renderLines
}
