// --- DATOS GLOBALES DEL JUEGO ---
let palabrasDisponibles = []; // Array de todas las palabras (lo llenará el usuario)
let numJugadores = 0;        // Número total de jugadores (lo llenará el usuario)
let palabraElegida = "";     // La palabra que se usará en esta ronda
let indiceImpostor = -1;     // El índice (número de jugador - 1) que será el impostor
let jugadorActual = 1;       // Seguimiento de a qué jugador le toca ver su rol

/**
 * Devuelve n números entero aleatorio entre 0 (incluido) y max (excluido).
 * @param {number} n - Cantidad de números aleatorios a generar.
 * @param {number} max - El límite superior (no incluido).
 */
function obtenerNumerosAleatorios(n, max) {
    const numeros = new Set();
    while (numeros.size < n) {
        do {
            var num = Math.floor(Math.random() * max);
        } while (numeros.has(num));
        numeros.add(num);
    }
    return Array.from(numeros);
}

function cargarJuego() {
    // 1. OBTENER DATOS DEL HTML 
    const inputPalabras = document.getElementById('palabrasInput').value;
    const inputNumJugadores = document.getElementById('jugadoresInput').value;
    
    // VALIDACIÓN BÁSICA
    palabrasDisponibles = inputPalabras.split(',').map(p => p.trim()).filter(p => p.length > 0);
    numJugadores = parseInt(inputNumJugadores);
    
    if (palabrasDisponibles.length === 0 || isNaN(numJugadores) || numJugadores < 3) {
        alert("Por favor, introduce al menos una palabra y un número válido de jugadores (Mín. 3).");
        return;
    }

    // Ocultar configuración y mostrar juego
    document.getElementById('configuracion').classList.add('hidden');
    document.getElementById('resultadoJuego').classList.remove('hidden');

    // Inicializar el mensaje de juego
    document.getElementById('resultadoJuego').innerHTML = `
        <h2>Configuración lista: ${numJugadores} Jugadores.</h2>
        <p>Pulsa el botón de abajo para empezar la primera ronda.</p>
        <button onclick="iniciarRonda()">Iniciar Ronda</button>
    `;
}

function iniciarRonda() {
    if (palabrasDisponibles.length > 0) { // Asegura que las palabras estén cargadas
        // 2. SELECCIONAR PALABRA AL AZAR
        const indicePalabra = obtenerNumerosAleatorios(1, palabrasDisponibles.length)[0];
        palabraElegida = palabrasDisponibles[indicePalabra];
        palabrasDisponibles.splice(indicePalabra, 1); // Eliminar palabra para no repetirla
        
        // 3. ASIGNAR EL ROL DE IMPOSTOR
        // (Selecciona un número de jugador entre 0 y numJugadores - 1)
        indicesImpostores = obtenerNumerosAleatorios(Math.ceil(numJugadores / 5), numJugadores);
        
        // 4. PREPARAR PANTALLA PARA EL PRIMER JUGADOR
        jugadorActual = 0;
        document.getElementById('resultadoJuego').innerHTML = `
            <h2>¡Ronda Iniciada!</h2>
            <p>Pásale el dispositivo al Jugador ${jugadorActual + 1} y pídele que pulse el botón.</p>
            <button onclick="mostrarRolActual()">Mostrar mi Rol</button>
        `;
    }
    else {
        alert("No hay palabras disponibles para iniciar la ronda.");
        document.getElementById('configuracion').classList.remove('hidden');
        document.getElementById('resultadoJuego').classList.add('hidden');  
    }
}

function mostrarRolActual() {
    const contenedor = document.getElementById('resultadoJuego');
    let mensaje = "";
    
    // Comprobar si el jugador actual es el impostor
    if (indicesImpostores.find(i => i === jugadorActual) !== undefined) {
        // --- ES EL IMPOSTOR (1 de cada 5) ---
        mensaje = `
            <h1 style="color: red;">¡ERES EL IMPOSTOR!</h1>
            <p>Tu objetivo es fingir que conoces la palabra. ¡Mucha suerte!</p>
        `;
    } else {
        // --- ES JUGADOR NORMAL ---
        mensaje = `
            <h1 style="color: green;">Tu Palabra es:</h1>
            <p style="font-size: 2.5em; font-weight: bold;">${palabraElegida.toUpperCase()}</p>
        `;
    }

    // Mostrar el resultado y el botón para pasar al siguiente jugador
    contenedor.innerHTML = `
        ${mensaje}
        <hr>
        <button onclick="pasarAlSiguiente()">Leído, Ocultar y Pasar</button>
    `;
}

function pasarAlSiguiente() {
    jugadorActual++;
    if (jugadorActual < numJugadores) {
        // Preparar para el siguiente jugador
        document.getElementById('resultadoJuego').innerHTML = `
            <h2>¡Siguiente Jugador!</h2>
            <p>Pásale el dispositivo al Jugador ${jugadorActual + 1} y pídele que pulse el botón.</p>
            <button onclick="mostrarRolActual()">Mostrar mi Rol</button>
        `;
    } else {
        // Todos los jugadores han visto su rol

        document.getElementById('resultadoJuego').innerHTML = `
            <h2>¡Todos los jugadores han visto sus roles!</h2>
            <p>¡Que comience el juego!</p>
            <button onclick="iniciarRonda()">Iniciar Nueva Ronda</button>
        `;
    }
}