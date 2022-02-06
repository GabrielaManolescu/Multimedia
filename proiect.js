//MANOLESCU GABRIELA - VERONICA
//GRUPA 1150, AN 3, ID
//Pentru Canvas:
canvasDrawChenar = document.getElementById("canvasDrawChenar");
var drawCanvas;
var imageDataS;
var mouseClick = new Array();//Retine mouse-ul daca este apasat
var tool = 'btnLine';//tool ul/ instrumentul
var firstColor;//pentru culoarea
var differentDrawnShapes = [];//Array ce retine formele(diferite) care s-au desenat
var mMoving = false;//retine mouse-ul se misca 

function objectArrayDrawn(firstS, secondS, firstE, secondE, drawType) {//obiectul care stocheaza array cu desene

    this.firstS = firstS;
    this.secondS = secondS;
    this.firstE = firstE;
    this.secondE = secondE;
    this.drawType = drawType;
}
class Size {//Clasa ce retine date cu dimensiunile folosite cand se creaza forme cu moseul
    constructor(left, top, width, height) {
        this.left = left;

        this.top = top;
        this.width = width;
        this.height = height;

    }
}
class Position {//retine a b pozitiile/locatia lor
    constructor(a, b) {
        this.a = a,
            this.b = b;
    }

}
var coordinateShapes = new Size(0, 0, 0, 0);//retine formele din stanga (sus) a b, si dimenisunea instrument

class pressedMouse {//retine pozitiile a b cand se apasa mouseul 
    constructor(a, b) {
        this.a = b,
            this.y = b;
    }
}
var mouseP = new pressedMouse(0, 0);//stocheaza locatiile a si b cand dai clic
var position = new Position(0, 0);//stocheaza pozitiile a si b ale mouseului

document.addEventListener('DOMContentLoaded', refreshCanvas);//refresh la pagina apeleaza fcta setUpCanvas

function colorChange() {//functie pentru schimbarea culorii formelor
    var col = "turquoise";
    firstColor = document.getElementById("colorPick");
    col = firstColor.value;
    return col;
}
function canvasChangeColors() {//functie pt a schimba/modifica culoarea canvasului
    firstColor = document.getElementById("colorPick");
    drawCanvas.fillStyle = firstColor.value;
    drawCanvas.fillRect(0, 0, 970, 800);
}
function refreshCanvas() {//cand reimprospatez pagina se da refreh la canvas/pagina

    canvasDrawChenar = document.getElementById("canvasDrawChenar");
    drawCanvas = canvasDrawChenar.getContext('2d');
    drawCanvas.lineWidth = 1;

    canvasDrawChenar.addEventListener("mousedown", xDownM);//cand se e apasat mouseul
    canvasDrawChenar.addEventListener("mousemove", xMoveM);//se executa atunci cand mouseul se misca
    canvasDrawChenar.addEventListener("mouseup", xUpM);//cand nu se mai apasa mouseul, e ridicat
    // if (differentDrawnShapes.length > -1) {//cand se reincarca pagina array ramane gol
    //     var arrayLength = differentDrawnShapes.length;
    //     var i = 0;
    //     while (i < arrayLength) {
    //         differentDrawnShapes.pop();
    //         i += 1;
    //     }
    // }
}
function changeDraw(toolC) {//inlocuieste forma default cu cea selectata

    document.getElementById("btnLine").className = "";
    document.getElementById("btnRectangle").className = "";
    document.getElementById("btnEclipse").className = "";
    // document.getElementById(toolC).className = "sel";//ulima forma selectata
    tool = toolC;//pt schimbarea formelor utilizate cand desenezi
}
function positionMouseCanvas(x, y) {//da pozitiile a,b ale mouseului in canvas
    let sizeCanvas = canvasDrawChenar.getBoundingClientRect();  //afla pozitia si dimensiunea canvasului
    return {
        x: (x - sizeCanvas.left) * (canvasDrawChenar.width / sizeCanvas.width),
        y: (y - sizeCanvas.top) * (canvasDrawChenar.height / sizeCanvas.height)
    };
}
function redrawICanv() {//imagine canvas se redeseneaza
    drawCanvas.putImageData(imageDataS, 0, 0);
}
function CoordNew(loc) {//coordonate noi, cand se schimba h, l,
    mosePositionsUP(loc);
    drawshapeToolPreview(loc);
};

function mosePositionsUP(loc) {//actualizare pozitii mouse
    coordinateShapes.width = Math.abs(loc.x - mouseP.x);
    coordinateShapes.height = Math.abs(loc.y - mouseP.y);
    if (loc.x > mouseP.x) {
        coordinateShapes.left = mouseP.x;
    } else {
        coordinateShapes.left = loc.x;
    }
    if (loc.y > mouseP.y) {
        coordinateShapes.top = mouseP.y;
    } else {
        coordinateShapes.top = loc.y;
    }
}

function xDownM(x) {
    canvasDrawChenar.style.cursor = "canv";
    position = positionMouseCanvas(x.clientX, x.clientY);
    imageDataS = drawCanvas.getImageData(0, 0, canvasDrawChenar.width, canvasDrawChenar.height);//loc salvata
    mouseP.x = position.x;
    mouseP.y = position.y;
    mMoving = true;
};
function xMoveM(x) {
    canvasDrawChenar.style.cursor = "canv";
    position = positionMouseCanvas(x.clientX, x.clientY);
    if (mMoving) {//pt a rerine coord noi cand se misca mouseul
        redrawICanv();
        CoordNew(position);
    }
};
function changeThickness() {// pt groseime instrumente
    var iThick;
    iThick = document.getElementById("nrSize").value;
    return iThick;

}
function xUpM(x) {
    canvasDrawChenar.style.cursor = "canv";
    position = positionMouseCanvas(x.clientX, x.clientY);
    redrawICanv();
    CoordNew(position);
    mMoving = false;
};

function drawshapeToolPreview(loc) {//pt a desena forme cu preview
    var chooseColor = 'turquoise';//culoarea selectata
    var drawNew; //Retine ce s-a desenat
    var thicknessD = 1;

    chooseColor = colorChange();

    if (chooseColor !== null) {
        drawCanvas.strokeStyle = chooseColor;
        drawCanvas.fillStyle = chooseColor;
    }
    else {
        drawCanvas.strokeStyle = "turquoiseed";
        drawCanvas.fillStyle = "turquoiseed";
    }

    thicknessD = changeThickness();
    drawCanvas.lineWidth = thicknessD;

    if (tool === "btnLine") {//pt desenare linie
        drawCanvas.beginPath();
        drawCanvas.moveTo(mouseP.x, mouseP.y);
        drawCanvas.lineTo(loc.x, loc.y);
        drawCanvas.stroke();
        drawNew = new objectArrayDrawn(mouseP.x, mouseP.y, loc.x, loc.y, tool);
        differentDrawnShapes.push(drawNew);
    }
    else if (tool === "btnRectangle") {//desenare dreptunghi
        drawCanvas.strokeRect(coordinateShapes.left, coordinateShapes.top, coordinateShapes.width, coordinateShapes.height);
        drawNew = new objectArrayDrawn(coordinateShapes.left, coordinateShapes.top,
            coordinateShapes.width, coordinateShapes.height, tool);
        differentDrawnShapes.push(drawNew);
    }
    else if (tool === "btnEclipse") {//desenare cerc/eclipsa
        let rX = coordinateShapes.width / 2;
        let rY = coordinateShapes.height / 2;
        drawCanvas.beginPath();
        drawCanvas.ellipse(mouseP.x, mouseP.y, rX, rY, Math.PI / 4, 0, Math.PI * 2);
        drawCanvas.stroke();
        drawNew = new objectArrayDrawn(mouseP.x, mouseP.y, rX, rY, tool);
        differentDrawnShapes.push(drawNew);
    }
}
//savlarea imaginii png
document.getElementById("downloadLink").onclick = function onSave() {
    tool = "downloadLink";
    downloadLink.href = canvasDrawChenar.toDataURL();
    downloadLink.download = "image";
}


