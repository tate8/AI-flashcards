
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


// get handle to canvas element
const paintCanvas = document.querySelector( '.paint-canvas' );
const context = paintCanvas.getContext( '2d' );

// get flashcard dimensions and set canvas's dimensions to them
width = document.querySelector('.flashcard').clientWidth;
height = document.querySelector('.flashcard').clientHeight;
context.canvas.width = width;
context.canvas.height = height;


let clearCanvas = function()
{
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}
clear.addEventListener('click', clearCanvas);



let x = 0, y = 0;
let isMouseDown = false;

// on mouse out/up
const stopDrawing = () => { isMouseDown = false; }

// on mouse down
const startDrawing = event =>
{
    isMouseDown = true;   
    [x, y] = [event.offsetX, event.offsetY];  
}

// on mouse move
const drawLine = event =>
{
    // checks if pencil mode is on
    if ( isMouseDown && pencilActive )
    {
        const newX = event.offsetX;
        const newY = event.offsetY;
        context.beginPath();
        context.strokeStyle = 'black'
        context.lineCap = 'round';
        context.lineWidth = 20;
        context.moveTo( x, y );
        context.lineTo( newX, newY );
        context.stroke();
        x = newX;
        y = newY;
    }
    // checks if erase mode is on
    else if (isMouseDown && !pencilActive)
    {
        const newX = event.offsetX;
        const newY = event.offsetY;
        context.beginPath();
        context.strokeStyle = 'white'   // drawing white to 'erase'
        context.lineCap = 'round';
        context.lineWidth = 30;         // slightly bigger
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


let checkButton = document.querySelector('.check-word');
checkButton.addEventListener( 'click', checkButtonClicked);


function checkButtonClicked()
{
    // set robot dialogue to ... to look like its thinking
    document.getElementById("robot-dialogue").textContent=". . .";

    let canvasHeight = context.canvas.clientHeight;
    let canvasWidth = context.canvas.clientWidth;
    let imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    let greyImageData = []

    // each pixel in image data is              [R, G, B, A]
    // all black pixels are represented as      [0, 0, 0, 255]

    // this just parses out the all black pixels and stores them into greyImageData
    for (let i = 3; i < imageData.data.length; i += 4) {
        let greyPixel = imageData.data[i]

        greyImageData.push(greyPixel)
    }

    // send an ajax POST request to my flask server with all the pixel data
    $.ajax({
        url: '/post-pixel-data',
        type: 'POST',
        ContentType: 'application/json',
        data: {data: greyImageData}
      }).done(function()
      { // reload page
        window.location.href = '/cards';
      }).fail(function(jqXHR, textStatus, errorThrown)
      { // if ajax POST request fails
        alert('Something went wrong. error: ' + errorThrown);
      });
}

