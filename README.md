# ESP32 LED Boss Fight

Interactive web demo for my physical **ESP32 LED Boss Fight** arcade project.

This project started as a real hardware game built with an **ESP32**, a **100-pixel WS2812B LED strip**, arcade buttons, and a buzzer.  
This repository now includes a browser-based React demo that recreates the game logic visually.

## Live Demo

[Play the web demo](https://larjas007.github.io/esp32-led-boss-fight/)

## What it does

A color-based arcade battle where the player shoots bullets across a 100-LED stage.

- Blue bullets destroy blue minions.
- Red bullets destroy red minions.
- Yellow bullets destroy yellow minions.
- Wrong-color hits move the boss closer.
- Minion waves increase in difficulty.
- The boss loses HP after each cleared wave.
- If enemies reach the player, the stage flashes red and resets.
- Victory triggers when the boss is defeated.

## Tech Stack

- **React** — component-based frontend library.
- **Vite** — fast development and build tool.
- **Tailwind CSS** — utility-first styling system.
- **JavaScript** — game logic, state, collision detection, and sound.
- **Web Audio API** — generated arcade-style sound effects.
- **GitHub Pages** — deployed public web demo.
- **ESP32 / Arduino C++** — original hardware version.

## Original Hardware Concept

The physical version uses:

| Component | Purpose |
|---|---|
| ESP32 | Main microcontroller |
| WS2812B LED strip | 100-pixel game stage |
| Arcade buttons | Player controls |
| Passive buzzer | Sound feedback |
| External 5V power supply | LED strip power |

## Game Logic

The game uses several phases:

| Phase | Description |
|---|---|
| `hiatus` | Rainbow idle animation |
| `spawning` | Minions appear in front of the boss |
| `playing` | Player shoots color-matching bullets |
| `victory` | Boss defeated |
| `gameOver` | Enemies reached the player |

Core logic includes:

- `useState` for game state.
- `useEffect` for animation loops and timers.
- Array-based bullets and minions.
- Collision detection between bullets and enemies.
- Boss movement and wave progression.
- Generated sound effects using browser audio.

## Why I built this

I built this project to combine:

- Embedded systems
- Physical arcade controls
- LED animation
- Game logic
- Web visualization
- Portfolio-ready frontend development

The goal was to turn a real ESP32 hardware project into something people can test directly in the browser.

## Screenshots / Gallery

Add screenshots or GIFs here:

```md
![Web demo screenshot](./gallery/demo-screenshot.png)
![Hardware prototype](./gallery/hardware-prototype.jpg)
