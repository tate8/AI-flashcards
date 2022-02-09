/// --------------------------------ctx.getImageData(sx, sy, sw, sh);------------------------------------

let eraser = document.querySelector('.eraser')
let pencil = document.querySelector('.pencil')
let clear = document.querySelector('.clear')

let pencilActive = true;

let setEraserActive = function() {
    eraser.classList.add('active')
    pencil.classList.remove('active')
    pencilActive = false;
}
let setPencilActive = function() {
    eraser.classList.remove('active')
    pencil.classList.add('active')
    pencilActive = true;
}


// change drawing tool
eraser.addEventListener('click', setEraserActive);
pencil.addEventListener('click', setPencilActive);



// DRAW ON FLASHCARD CAPABILITY
//
//
const paintCanvas = document.querySelector( '.paint-canvas' );
const context = paintCanvas.getContext( '2d' );

// get flashcard dimensions and set canvas's dimensions to them
width = document.querySelector('.flashcard').clientWidth;
height = document.querySelector('.flashcard').clientHeight;

context.canvas.width = width;
context.canvas.height = height;


let clearCanvas = function() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}
clear.addEventListener('click', clearCanvas);



let x = 0, y = 0;
let isMouseDown = false;

const stopDrawing = () => { isMouseDown = false; }
const startDrawing = event => {
    isMouseDown = true;   
[x, y] = [event.offsetX, event.offsetY];  
}
const drawLine = event => {
    if ( isMouseDown && pencilActive ) {
        const newX = event.offsetX;
        const newY = event.offsetY;
        context.beginPath();
        context.strokeStyle = 'black'
        context.lineCap = 'round';
        context.lineWidth = 10;
        context.moveTo( x, y );
        context.lineTo( newX, newY );
        context.stroke();
        x = newX;
        y = newY;
    }
    else if (isMouseDown && !pencilActive) {
        const newX = event.offsetX;
        const newY = event.offsetY;
        context.beginPath();
        context.strokeStyle = 'white'
        context.lineCap = 'round';
        context.lineWidth = 30;
        context.moveTo( x, y );
        context.lineTo( newX, newY );
        context.stroke();
        x = newX;
        y = newY;
    }
}

paintCanvas.addEventListener( 'mousedown', startDrawing );
paintCanvas.addEventListener( 'mousemove', drawLine );
paintCanvas.addEventListener( 'mouseup', stopDrawing );
paintCanvas.addEventListener( 'mouseout', stopDrawing );


// CLEAR FUNCTIONALITY

let clearButton = document.querySelector('')