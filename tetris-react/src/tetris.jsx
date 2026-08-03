import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { useEffect, useRef, useState, useCallback } from 'react';

const ANCHO_TABLERO = 10;
const ALTO_TABLERO = 20;
const MARGEN_SUPERIOR = 4;
const ANCHO_F = 40;
const ALTO_F = 40;
const FPS = 50;

const COLORES = {
  1: '#FF0000',
  2: '#800080',
  3: '#FF8C00',
  4: '#FFD700',
  5: '#008000',
  6: '#00CED1',
  7: '#0000CD',
};

// Fichas con rotaciones correspondientes
const FICHA_GRAFICO = [
  [
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
  ],
  [
    [
      [0,2,0,0],
      [0,2,0,0],
      [0,2,0,0],
      [0,2,0,0]
    ],
    [
      [0,0,0,0],
      [2,2,2,2],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,2,0,0],
      [0,2,0,0],
      [0,2,0,0],
      [0,2,0,0]
    ],
    [
      [0,0,0,0],
      [2,2,2,2],
      [0,0,0,0],
      [0,0,0,0]
    ],
  ],
  [
    [
      [0,0,0,0],
      [0,3,0,0],
      [0,3,0,0],
      [0,3,3,0]
    ],
    [
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,3],
      [0,3,3,3]
    ],
    [
      [0,0,0,0],
      [0,3,3,0],
      [0,0,3,0],
      [0,0,3,0]
    ],
    [
      [0,0,0,0],
      [0,3,3,3],
      [0,3,0,0],
      [0,0,0,0]
    ],
  ],
  [
    [
      [0,0,0,0],
      [0,0,4,0],
      [0,0,4,0],
      [0,4,4,0]
    ],
    [
      [0,0,0,0],
      [0,0,0,0],
      [4,0,0,0],
      [4,4,4,0]
    ],
    [
      [0,0,0,0],
      [0,4,4,0],
      [0,4,0,0],
      [0,4,0,0]
    ],
    [
      [0,0,0,0],
      [4,4,4,0],
      [0,0,4,0],
      [0,0,0,0]
    ],
  ],
  [
    [
      [0,0,0,0],
      [0,0,5,5],
      [0,5,5,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,5,0,0],
      [0,5,5,0],
      [0,0,5,0]
    ],
    [
      [0,0,0,0],
      [0,0,5,5],
      [0,5,5,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,5,0,0],
      [0,5,5,0],
      [0,0,5,0]
    ],
  ],
  [
    [
      [0,0,0,0],
      [6,6,0,0],
      [0,6,6,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,0,6,0],
      [0,6,6,0],
      [0,6,0,0]
    ],
    [
      [0,0,0,0],
      [6,6,0,0],
      [0,6,6,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,0,6,0],
      [0,6,6,0],
      [0,6,0,0]
    ],
  ],
  [
    [
      [0,0,0,0],
      [0,7,0,0],
      [7,7,7,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,7,0,0],
      [0,7,7,0],
      [0,7,0,0]
    ],
    [
      [0,0,0,0],
      [0,0,0,0],
      [7,7,7,0],
      [0,7,0,0]
    ],
    [
      [0,0,0,0],
      [0,7,0,0],
      [7,7,0,0],
      [0,7,0,0]
    ],
  ],
];

// Lógica del juego 

function tableroVacio() {
  const filas = [];
  for (let y = 0; y < 20; y++) {
    const fila = new Array(12).fill(0);
    fila[0] = 1;
    fila[11] = 1;
    filas.push(fila);
  }
  filas.push(new Array(12).fill(1));
  return filas;
}

function crearPieza() {
  return { tipo: Math.floor(Math.random() * 7), angulo: 0, x: 4, y: 0 };
}

function hayColision(tablero, tipo, angulo, y, x) {
  for (let py = 0; py < 4; py++) {
    for (let px = 0; px < 4; px++) {
      if (FICHA_GRAFICO[tipo][angulo][py][px] > 0) {
        const fila = tablero[y + py];
        if (!fila || fila[x + px] > 0) return true;
      }
    }
  }
  return false;
}

function fijarPieza(tablero, pieza) {
  const nuevo = tablero.map((f) => [...f]);
  for (let py = 0; py < 4; py++) {
    for (let px = 0; px < 4; px++) {
      const v = FICHA_GRAFICO[pieza.tipo][pieza.angulo][py][px];
      if (v > 0) nuevo[pieza.y + py][pieza.x + px] = v;
    }
  }
  return nuevo;
}

function filaVacia() {
  const fila = new Array(12).fill(0);
  fila[0] = 1;
  fila[11] = 1;
  return fila;
}

function limpiarLineas(tablero) {
  let nuevo = tablero.map((f) => [...f]);
  let lineas = 0;

  for (let py = MARGEN_SUPERIOR; py < ALTO_TABLERO; py++) {
    let completa = true;
    for (let px = 1; px <= ANCHO_TABLERO; px++) {
      if (nuevo[py][px] === 0) completa = false;
    }
    if (completa) {
      lineas++;
      // saca la fila completa y baja todo lo que estaba arriba un puesto,
      // metiendo una fila vacía nueva justo debajo del margen superior
      nuevo.splice(py, 1);
      nuevo.splice(MARGEN_SUPERIOR, 0, filaVacia());
    }
  }
  return { tablero: nuevo, lineas };
}

function pierdeJuego(tablero) {
  for (let px = 1; px <= ANCHO_TABLERO; px++) {
    if (tablero[2][px] > 0) return true;
  }
  return false;
}

// React

export default function Tetris() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    tablero: tableroVacio(),
    pieza: crearPieza(),
    fotograma: 0,
    retraso: 25,
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const dibuja = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { tablero, pieza } = stateRef.current;

    for (let py = MARGEN_SUPERIOR; py < ALTO_TABLERO; py++) {
      for (let px = 0; px <= ANCHO_TABLERO; px++) {
        if (tablero[py][px] !== 0) {
          ctx.fillStyle = COLORES[tablero[py][px]] || '#d70e0e';
          ctx.fillRect((px - 1) * ANCHO_F, (py - MARGEN_SUPERIOR) * ALTO_F, ANCHO_F, ALTO_F);
        }
      }
    }

    for (let py = 0; py < 4; py++) {
      for (let px = 0; px < 4; px++) {
        const v = FICHA_GRAFICO[pieza.tipo][pieza.angulo][py][px];
        if (v !== 0) {
          ctx.fillStyle = COLORES[v];
          ctx.fillRect((pieza.x + px - 1) * ANCHO_F, (pieza.y + py - MARGEN_SUPERIOR) * ALTO_F, ANCHO_F, ALTO_F);
        }
      }
    }
  }, []);

  const tick = useCallback(() => {
    if (gameOver) return;
    const s = stateRef.current;

    if (s.fotograma < s.retraso) {
      s.fotograma++;
    } else {
      s.fotograma = 0;
      if (!hayColision(s.tablero, s.pieza.tipo, s.pieza.angulo, s.pieza.y + 1, s.pieza.x)) {
        s.pieza.y++;
      } else {
        s.tablero = fijarPieza(s.tablero, s.pieza);
        const { tablero: limpio, lineas } = limpiarLineas(s.tablero);
        s.tablero = limpio;
        if (lineas > 0) setScore((prev) => prev + lineas * 100);
        s.pieza = crearPieza();

        if (pierdeJuego(s.tablero)) {
          setGameOver(true);
        }
      }
    }
    dibuja();
  }, [dibuja, gameOver]);

  useEffect(() => {
    const interval = setInterval(tick, 1000 / FPS);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    function onKeyDown(e) {
      if (gameOver) return;
      const s = stateRef.current;
      const { pieza, tablero } = s;

      if (e.key === 'ArrowUp') {
        const nuevoAngulo = (pieza.angulo + 1) % 4;
        if (!hayColision(tablero, pieza.tipo, nuevoAngulo, pieza.y, pieza.x)) {
          pieza.angulo = nuevoAngulo;
        }
      }
      if (e.key === 'ArrowDown') {
        if (!hayColision(tablero, pieza.tipo, pieza.angulo, pieza.y + 1, pieza.x)) pieza.y++;
      }
      if (e.key === 'ArrowLeft') {
        if (!hayColision(tablero, pieza.tipo, pieza.angulo, pieza.y, pieza.x - 1)) pieza.x--;
      }
      if (e.key === 'ArrowRight') {
        if (!hayColision(tablero, pieza.tipo, pieza.angulo, pieza.y, pieza.x + 1)) pieza.x++;
      }
      dibuja();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dibuja, gameOver]);

  function reiniciar() {
    stateRef.current = { tablero: tableroVacio(), pieza: crearPieza(), fotograma: 0, retraso: 25 };
    setScore(0);
    setGameOver(false);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        fontFamily: 'system-ui, sans-serif',
        color: '#e5e5e5',
        background: '#0f0f14',
        padding: 24,
        borderRadius: 12,
        width: 'fit-content',
      }}
    >
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <h1 style={{ fontSize: 20, margin: 0, letterSpacing: 1 }}>TETRIS</h1>
        <div style={{ fontSize: 16 }}>
          Puntaje: <strong>{score}</strong>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={640}
          style={{ background: '#000', borderRadius: 4, display: 'block' }}
        />
        {gameOver && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 22 }}>Game Over</div>
            <button onClick={reiniciar} style={{ padding: '8px 16px', cursor: 'pointer' }}>
              Reintentar
            </button>
          </div>
        )}
      </div>
      <p style={{ fontSize: 13, opacity: 0.7 }}>Flechas: mover / girar</p>
    </div>
  );
}
