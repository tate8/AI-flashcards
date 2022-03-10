
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
        // default: put new things over old things
        context.globalCompositeOperation = 'source-over';
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

        clearSize = 20
        
        // existing content is kept where it doesn't overlap the new shape
        // so this basically 'cuts out' a circle with radius 20 from the canvas
        context.globalCompositeOperation = 'destination-out';
        context.beginPath();
        context.arc(newX, newY, clearSize, 0, 2*Math.PI, false);
        context.fill();
        context.restore();
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
    document.getElementById("robot-dialogue").textContent = ". . .";

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
      }).done(function(status) // status from server
      { // reload page
        if (status == 'success')
        {
            // changing the robot dialogue like we would in the server
            document.getElementById("robot-dialogue").textContent = "Nice, you got it right!";
            setTimeout(() => {window.location.href = '/new-word';}, 1500)
        }
        else
        {
            window.location.href = '/cards';
        }
                
      }).fail(function(jqXHR, textStatus, errorThrown)
      { // if ajax POST request fails
        alert('Something went wrong. error: ' + errorThrown);
      });
}



// FlIP FUNCTIONALITY

$(".flip-container").flip({
    trigger: "manual"
  });

$(".enter-help").click(function() {
    $(this).closest(".flip-container").flip(true);
});

$(".exit-help").click(function() {
    $(this).closest(".flip-container").flip(false);
});


// LABEL CANVAS
function drawLabelCanvas(pixelData)
{
    // get handle to canvas element
    const labelCanvas = document.querySelector( '.label-canvas' );
    const ctx = labelCanvas.getContext( '2d' );

    // get flashcard dimensions and set canvas's dimensions to them
    width = document.querySelector('.flashcard').clientWidth;
    height = document.querySelector('.flashcard').clientHeight;
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    pixel_len = Math.floor(width / 28);

    // draw pixel data to screen
    for (let i = 0; i < 28; i++)
    {
        for (let j = 0; j < 28; j++)
        {
            if (pixelData[j][i] > 0)
            {
                ctx.beginPath();
                ctx.fillStyle = "black";
                ctx.rect(pixel_len*i, pixel_len*j, pixel_len, pixel_len);
                ctx.fill();
            }
        }
    }
}

function helpButtonClicked()
{
    $.get("/get-label-data", function(data, status){
        let labelData = data;
    
        // reshape label data
        reshapedLabelData = []
        for (let i = 0; i < 28; i++)
        {
            row = labelData.slice(i*28, (i+1)*28)
            reshapedLabelData.push(row)
        }
        drawLabelCanvas(reshapedLabelData)

     });
}

helpButton = document.querySelector('.enter-help');
helpButton.addEventListener( 'click', helpButtonClicked);


