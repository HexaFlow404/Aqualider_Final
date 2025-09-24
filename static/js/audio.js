// --- LÓGICA DE AUDIO GLOBAL ---

const musicHome = new Audio("/static/audio/musica(HOME).mp3");
musicHome.loop = true;
const soundClick = new Audio("/static/audio/sonido(HOME).mp3");

// Variable para asegurar que la música solo se inicie con interacción del usuario
let hasInteracted = localStorage.getItem('userHasInteracted') === 'true';

// Función para intentar reproducir la música de fondo
function playHomeMusic() {
    if (hasInteracted && localStorage.getItem('musicMuted') !== 'true' && musicHome.paused) {
        // CAMBIO: Carga la posición guardada de la canción antes de reproducir
        const savedTime = localStorage.getItem('musicHomeTime');
        if (savedTime) {
            musicHome.currentTime = parseFloat(savedTime);
        }
        musicHome.play().catch(e => console.log("La reproducción fue bloqueada."));
    }
}

// Función para reproducir el sonido de clic
function playClickSound() {
    if (localStorage.getItem('soundMuted') !== 'true') {
        soundClick.currentTime = 0;
        soundClick.play();
    }
}

// Función para actualizar el estado de los botones
function updateGlobalAudioControls(musicBtn, soundBtn) {
    if (localStorage.getItem('musicMuted') === 'true') {
        musicHome.pause();
        if(musicBtn) musicBtn.textContent = '🔇';
    } else {
        playHomeMusic();
        if(musicBtn) musicBtn.textContent = '🎵';
    }
    
    if(soundBtn) {
        soundBtn.textContent = localStorage.getItem('soundMuted') === 'true' ? '🔈' : '🔊';
    }
}

// CAMBIO: Guardar la posición de la música al salir de la página
window.addEventListener('beforeunload', () => {
    localStorage.setItem('musicHomeTime', musicHome.currentTime);
});


document.addEventListener('DOMContentLoaded', () => {
    const musicBtn = document.getElementById('music-btn');
    const soundBtn = document.getElementById('sound-btn');

    updateGlobalAudioControls(musicBtn, soundBtn);

    if (musicBtn) {
        musicBtn.addEventListener('click', function() {
            const muted = localStorage.getItem('musicMuted') === 'true';
            localStorage.setItem('musicMuted', !muted);
            updateGlobalAudioControls(musicBtn, soundBtn);
            this.blur();
        });
    }

    if (soundBtn) {
        soundBtn.addEventListener('click', function() {
            const muted = localStorage.getItem('soundMuted') === 'true';
            localStorage.setItem('soundMuted', !muted);
            updateGlobalAudioControls(musicBtn, soundBtn);
            this.blur();
        });
    }

    const clickableElements = document.querySelectorAll('a.menu-button, button.menu-button, a.connect-button, button.top-button');
    clickableElements.forEach(el => {
        el.addEventListener('click', playClickSound);
    });

    // Registra la primera interacción del usuario en cualquier parte del sitio
    document.body.addEventListener('click', () => {
        if (!hasInteracted) {
            hasInteracted = true;
            localStorage.setItem('userHasInteracted', 'true');
            playHomeMusic();
        }
    }, { once: true });
});