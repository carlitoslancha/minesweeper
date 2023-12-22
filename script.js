const botonFacil = document.getElementById("facil");
const botonMedio = document.getElementById("medio");
const botonDificil = document.getElementById("dificil");

const menuMinas = document.getElementById('minasNum');

const juego = document.getElementById("juego");
const teclas = juego.querySelectorAll("div");

let tablero = [];
let rows = 10;
let columns = 10;

let anchuraTecla = 48;
let alturaTecla = 48;
let minasNum = 10;
let minasLocation = []; // formato de las posiciones 0-0, 2-5 (fila - columna)
let banderasDisp=minasNum;

let gameOver=false;

botonFacil.addEventListener('click', () => {
    juego.style.width = "500px";
    juego.style.height = '500px';
    anchuraTecla=48;
    alturaTecla=48;
    rows=10;
    columns=10;
    minasNum=10;
    banderasDisp=minasNum;
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
    banderasDisp=minasNum;
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
    banderasDisp=minasNum;
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
    gameOver=false;
    tablero=[]; // Hay que ponerlo para que se pueda jugar, si se cambia de modo se borraran las teclas anteriores
    juego.innerHTML='';
    generaMinas();
    for(let r=0; r<rows; r++){
        let row=[]
        for(let c=0; c<columns;c++){
            // <div id="0-0"></div>
            let tecla = document.createElement("div");
            tecla.id = r.toString() + "-" + c.toString();
            tecla.style.width=anchuraTecla.toString()+'px';
            tecla.style.height=alturaTecla.toString()+'px';
            tecla.addEventListener('click', clickTecla);
            tecla.addEventListener('contextmenu', poneBandera);
            juego.append(tecla);
            row.push(tecla);
        }
        tablero.push(row);
    }
}

function clickTecla(){
    // funcion que se activa cuando se hace click en una tecla
    // debe comprobar que no tiene bomba, y calcular el numero en caso de no tener bomba
    
    if(gameOver){
        alert('El juego ha temrinado, selecciona una dificultad para empezar de nuevo.')
        return;
    }
    let tecla = this;
    if (minasLocation.includes(tecla.id)) {
        // alert("GAME OVER");
        
        gameOver = true;
        revelaMinas();
        return;
    }

    let coordenadas = tecla.id.split('-');
    let r = parseInt(coordenadas[0]);
    let c = parseInt(coordenadas[1]);
    compruebaBomba(r,c);
}


function compruebaBomba(r, c){
    // funcion que calcula el numero que muestra cada tecla en funcion de las bombas adyacentes
    
    if(r < 0 || r >= rows || c < 0 || c >= columns){
        return;
    }
    if(tablero[r][c].classList.contains('comprobada')){
        return;
    }
    if(tablero[r][c].classList.contains('bandera')){
        return;
    }

    tablero[r][c].classList.add('comprobada');

    let bombas = 0; // variable que lleva el recuento del numero de bombas adyacentes
    // comprobacion teclas de arriba
    bombas += calculaTecla(r-1, c-1);
    bombas += calculaTecla(r-1, c);
    bombas += calculaTecla(r-1, c+1);

    // teclas a los lados
    bombas += calculaTecla(r, c-1);
    bombas += calculaTecla(r, c+1);

    //telcas de abajo
    bombas += calculaTecla(r+1, c-1);
    bombas += calculaTecla(r+1, c);
    bombas += calculaTecla(r+1, c+1);

    if (bombas > 0){
        tablero[r][c].innerText = bombas;
        tablero[r][c].classList.add('x' + bombas.toString());
    }else{
        // caso de que comprobemos una tecla que no tiene ninguna boomba adyacente desvela todas las teclas vacias cercanas con llamadas recursivas a esta fuincion
        // pasando las teclas adyacentes y comprobando si estas tambien estan vacias
        tablero[r][c].innerText='';
        // teclas de arriba
        compruebaBomba(r-1, c-1);
        compruebaBomba(r-1, c);
        compruebaBomba(r-1, c+1);

        // teclas a los lados
        compruebaBomba(r, c-1);
        compruebaBomba(r, c+1);

        //telcas de abajo
        compruebaBomba(r+1, c-1);
        compruebaBomba(r+1, c);
        compruebaBomba(r+1, c+1);

        // AÑADIR FUNCION QUE COMPUREBA SI HAN TEMINADO EL JUEGO
    }
}

function calculaTecla(r, c){
    // Devuelve 1 o 0 si la tecla situada en (r,c) es una bomba o no
    if(r < 0 || r > rows || c < 0 || c > columns){
        return 0;
    }
    if(minasLocation.includes(r.toString() + "-" + c.toString())){
        return 1;
    }
    return 0;
}

function revelaMinas() {
    // Esta funcion hace que se revelen todas las bombas y las casillas se pinten de rojo
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tecla = tablero[r][c];
            if (minasLocation.includes(tecla.id)) {
                tecla.innerText = "💣";
                tecla.style.backgroundColor = "red";                
            }
        }
    }
}

function poneBandera(){
    // funcion que se encarga de poner las bandera, el evento que la dispara es el click derecho
    // Hay que llevar el recuento de las banderas que se ponen, nunca puede superar el numero de bombas
    event.preventDefault(); // Esto evita que al hacer clic derecho salga el menu con las opciones del navegador
    let tecla = this;
    let coordenadas = tecla.id.split('-');
    let r = parseInt(coordenadas[0]);
    let c = parseInt(coordenadas[1]);
    

    if(r < 0 || r >= rows || c < 0 || c >= columns){
        return;
    }
    if(tablero[r][c].classList.contains('comprobada')){
        return;
    }
    if(tablero[r][c].classList.contains('bandera')){
        tablero[r][c].classList.toggle('bandera');
        tablero[r][c].innerText='';
        banderasDisp += 1;
    }else if(banderasDisp >0){
        tablero[r][c].classList.toggle('bandera');
        tablero[r][c].innerText='🚩';
        banderasDisp -= 1;
    }else{
        return;
    }

}