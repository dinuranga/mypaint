let isDown = false;
let points = [];
let beginPoint = null;
let colorValue = "#3c14ff";
let brushSize = 3;
let history = [];
let index = 0;
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

//Resizing
canvas.width = vw;
canvas.height = vh;

//Background color Fill
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

//Event Listeners
canvas.addEventListener('mousedown', down);
canvas.addEventListener('mousemove', move);
canvas.addEventListener('mouseup', up);
canvas.addEventListener('mouseout', up);

//Functions
function getColor(){
    colorValue = document.getElementById('getColor').value;
    //console.log(colorValue);
}
function getBrushSize(){
    brushSize = document.getElementById('getBrushSize').value;
    if(brushSize < 10){
        document.getElementById("showBrushSize").innerHTML = "0"+brushSize;
    }
    else{
        document.getElementById("showBrushSize").innerHTML = brushSize;
    }
}
function chooseColor(colorCode){
    colorValue = colorCode;
}
function saveImage(){
    var canvas = document.getElementById("canvas");
    image = canvas.toDataURL("image/jpeg", 1.0).replace("image/jpeg", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "my-drawing.png";
    link.href = image;
    link.click();
}

function down(evt) {
    isDown = true;
    const { x, y } = getPos(evt);
    points.push({x, y});
    beginPoint = {x, y};

    if(isDown){
        ctx.lineWidth = brushSize*2;
        ctx.lineCap = "round";
        ctx.strokeStyle = colorValue;
        ctx.beginPath();
        ctx.lineTo(evt.clientX,evt.clientY);
        ctx.stroke();
    };
}

function move(evt) {
    if (!isDown) return;

    const { x, y } = getPos(evt);
    points.push({x, y});

    if (points.length > 3) {
        const lastTwoPoints = points.slice(-2);
        const controlPoint = lastTwoPoints[0];
        const endPoint = {
            x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
            y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2,
        }
        drawLine(beginPoint, controlPoint, endPoint);
        beginPoint = endPoint;
    }
}

function up(evt) {
    if (!isDown) return;
    const { x, y } = getPos(evt);
    points.push({x, y});

    if (points.length > 3) {
        const lastTwoPoints = points.slice(-2);
        const controlPoint = lastTwoPoints[0];
        const endPoint = lastTwoPoints[1];
        drawLine(beginPoint, controlPoint, endPoint);
    }
    beginPoint = null;
    isDown = false;
    points = [];
}

function getPos(evt) {
    return {
        x: evt.clientX,
        y: evt.clientY
    }
}

function drawLine(beginPoint, controlPoint, endPoint) {

    //Line Styles
    ctx.strokeStyle = colorValue;
    ctx.lineWidth = brushSize*2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(beginPoint.x, beginPoint.y);
    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
    ctx.stroke();
    ctx.closePath();
}
//Clear
document.getElementById('clear').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}, false);