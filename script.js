const botonFacil = document.getElementById("facil");
const botonMedio = document.getElementById("medio");
const botonDificil = document.getElementById("dificil");
const botonPersonalizado = document.getElementById("cifraInput");

const menuMinas = document.getElementById('minasNum');

const juego = document.getElementById("juego");
const teclas = juego.querySelectorAll("div");

let tablero = [];
let rows = 10;
let columns = 10;

let teclasPulsadas = 0;
let anchuraTecla = 48;
let alturaTecla = 48;
let minasNum = 10;
let minasLocation = []; // formato de las posiciones 0-0, 2-5 (fila - columna)
let banderasDisp=minasNum;

let gameOver=false;

let timer;
let seconds = 0;
let minutes = 0;
let milliseconds = 0;
let stopwatch = false; // variable booleana que se activa y desactiva cuando el reloj ha corrido por primera vez

crearTablero();

function botonFacilFunc(n){
    juego.style.width = "500px";
    juego.style.height = '500px';
    anchuraTecla=48;
    alturaTecla=48;
    rows=10;
    columns=10;
    minasNum=n;
    banderasDisp=minasNum;
    crearTablero()
}

function botonMedioFunc(n){
    juego.style.width = "620px";
    juego.style.height = '620px';
    anchuraTecla=40;
    alturaTecla=40;
    rows=15;
    columns=15;
    minasNum=n;
    banderasDisp=minasNum;
    crearTablero();
}

function botonDificilFunc(n){
    juego.style.width = "720px";
    juego.style.height = '720px';
    anchuraTecla=35;
    alturaTecla=35;
    rows=20;
    columns=20;
    minasNum=n;
    banderasDisp=minasNum;
    crearTablero();
}
botonFacil.addEventListener('click', function() {
    botonFacilFunc(10);
});

botonMedio.addEventListener('click', function() {
    botonMedioFunc(20);
});

botonDificil.addEventListener('click', function() {
    botonDificilFunc(30);
});

botonPersonalizado.addEventListener('keyup', function(event) {
    if(event.key !== 'Enter'){
        return;
    }
    const valor = this.value;
    if(valor < 1){return;}
    if(valor < 26 ){
        botonFacilFunc(valor);
    }else if(valor < 56){
        botonMedioFunc(valor);
    }else if(valor<100){
        botonDificilFunc(valor);
    }else{return;}

})

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
    teclasPulsadas=0;
    gameOver=false;
    tablero=[]; // Hay que ponerlo para que se pueda jugar, si se cambia de modo se borraran las teclas anteriores
    juego.innerHTML='';
    generaMinas();
    menuMinas.innerHTML = '<h1>Minas: <span id="minasRestantes">'+ minasNum.toString()+'</span></h1>';
    setTime0()
    stopTimer();
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
        stopTimer();
        stopwatch=false;
        menuMinas.innerHTML = '<h1 style="color: red; font-size:3em;">GAME OVER!!!</h1>';
        return;
    }
    if(!stopwatch){startTimer(); stopwatch=true;};
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
    teclasPulsadas +=1;
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
        // caso de que comprobemos una tecla que no tiene ninguna bomba adyacente desvela todas las teclas vacias cercanas con llamadas recursivas a esta fuincion
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
    }
    if(teclasPulsadas == rows*columns - minasNum){
        gameOver=true;
        stopTimer();
        stopwatch=false;
        const displayMilliseconds = milliseconds < 10 ? `0${milliseconds}` : milliseconds;
        const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
        const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
        menuMinas.innerHTML = '<h1 style="color: hsl(156, 86%, 28%); font-size: 3em;">¡Correcto!</h1>';
        menuMinas.innerHTML += `<h2 style="color: hsl(21, 89%, 71%); font-size: 2em;">${displayMinutes}:${displaySeconds}:${displayMilliseconds}</h2>`;
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
        document.getElementById('minasRestantes').innerHTML = banderasDisp.toString();
    }else if(banderasDisp >0){
        tablero[r][c].classList.toggle('bandera');
        tablero[r][c].innerText='🚩';
        banderasDisp -= 1;
        document.getElementById('minasRestantes').innerHTML = banderasDisp.toString();
    }else{
        return;
    }
    if(teclasPulsadas == rows*columns - minasNum){
        gameOver=true;
        stopTimer();
        stopwatch=false;
        menuMinas.innerHTML = '<h1 style="color: green;" style="font-size:3em;">¡Correcto!</h1>';
    }
}

function colocaMinas(){
    // establece las posiciones de las bombas en un tablero ficticio para que se puedan ver todas situaciones y ver los colores de cada casilla
    minasLocation = ["0-0","0-2","0-3","0-5","0-6","0-7","0-8","0-9","0-10","1-8","2-9","0-13","0-14","0-15","0-16","0-17","0-18","1-12","1-14","1-16","1-18","2-13","2-14", "2-16","2-17","2-18"];
}

function startTimer(){
    timer = setInterval(updateTimer, 10);
}

function updateTimer() {
    milliseconds++;
    if (milliseconds === 100) {
      milliseconds = 0;
      seconds++;
    }
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
  
    const displayMilliseconds = milliseconds < 10 ? `0${milliseconds}` : milliseconds;
    const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    document.getElementById('time').innerHTML = `${displayMinutes}:${displaySeconds}:${displayMilliseconds}`;
  }

function stopTimer() {
    clearInterval(timer);
}

function setTime0(){
    milliseconds = 0;
    seconds = 0;
    minutes= 0;
    stopwatch=false;
}