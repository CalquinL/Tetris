# Tetris React

Tetris clásico implementado en React, migrado desde una versión original en JavaScript puro con manipulación de canvas.
La ambición de este proyecto nació ante el desafío de programar un Tetris, un ejercicio clásico presente en entrevistas técnicas de desarrolladores.

## 🔗 Demo en vivo

**[Jugar ahora →](https://tetris-nine-topaz.vercel.app/)** 

## 📸 Screenshots

| Tablero en juego | Game Over |
|---|---|
| <img width="562" height="973" alt="image" src="https://github.com/user-attachments/assets/aa80effe-caf9-41bc-8a18-01ab9ed5ca15" />
 | <img width="551" height="943" alt="image" src="https://github.com/user-attachments/assets/bdb87297-2bb4-4532-9473-90905a7f6791" />
 |

## ✨ Características

- Las 7 piezas clásicas con sus 4 rotaciones cada una
- Detección de colisiones con los bordes y piezas ya fijadas
- Limpieza de líneas completas con caída de las piezas superiores
- Sistema de puntaje por líneas eliminadas
- Pantalla de Game Over con opción de reiniciar
- Controles por teclado (flechas para mover y rotar)

## 🛠️ Tecnologías

- React (hooks: `useState`, `useRef`, `useEffect`, `useCallback`)
- Vite
- Canvas API 

## 🚀 Cómo correrlo localmente

```bash
git clone https://github.com/CalquinL/Tetris.git
cd tetris-react
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

## 🎯 Controles

| Tecla | Acción |
|---|---|
| ↑ | Rotar pieza |
| ↓ | Bajar más rápido |
| ← | Mover izquierda |
| → | Mover derecha |

## 👤 Autor
Lucas Calquín — Estudiante de Ing. Civil en Computación e Informática, Universidad Mayor
