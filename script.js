const botonFacil = document.getElementById("facil");
const botonMedio = document.getElementById("medio");
const botonDificil = document.getElementById("dificil");

const juego = document.getElementById("juego");
const teclas = juego.querySelectorAll("div");

let tablero = [];
let rows = 10;
let columns = 10;

let anchuraTecla = 48;
let alturaTecla = 48;
let minasNum = 10;
let minasLocation = []; // formato de las posiciones 0-0, 2-5 (fila - columna)

botonFacil.addEventListener('click', () => {
    juego.style.width = "500px";
    juego.style.height = '500px';
    anchuraTecla=48;
    alturaTecla=48;
    rows=10;
    columns=10;
    minasNum=10;
    crearTablero()
});

botonMedio.addEventListener('click', () => {
    juego.style.width = "620px";
    juego.style.height = '620px';
    anchuraTecla=40;
    alturaTecla=40;
    rows=15;
    columns=15;
    minasNum=20;
    crearTablero();
});

botonDificil.addEventListener('click', () => {
    juego.style.width = "720px";
    juego.style.height = '720px';
    anchuraTecla=35;
    alturaTecla=35;
    rows=20;
    columns=20;
    minasNum=30;
    crearTablero();
});

function generaMinas() {
    let minesLeft = minasNum;
    minasLocation = [];
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minasLocation.includes(id)) {
            minasLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function crearTablero(){
    juego.innerHTML='';
    for(let r=0; r<rows; r++){
        let row=[]
        for(let c=0; c<columns;c++){
            // <div id="0-0"></div>
            let tecla = document.createElement("div");
            tecla.id = r.toString() + "-" + c.toString();
            tecla.style.width=anchuraTecla.toString()+'px';
            tecla.style.height=alturaTecla.toString()+'px';
            tecla.addEventListener('click', clickTecla);
            juego.append(tecla);
            row.push(tecla);
        }
        tablero.push(row);
    }
}

function clickTecla(){
    
}
