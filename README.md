# ESP32 LED Boss Fight

A real-time embedded game system prototyped in Python and implemented on ESP32 using WS2812B LEDs, button input, and event-driven audio.

## Portfolio focus
This project showcases the translation of gameplay logic from software prototyping into a physical interactive system.

It highlights skills in:
- Embedded systems development
- Game logic design
- Real-time interaction systems
- Event-driven programming
- Collision handling
- Hardware input integration
- Audio feedback systems
- Rapid prototyping and iteration
- Technical problem solving
- System design under hardware constraints

## Project overview
This game began as a Python prototype used to test gameplay structure, timing, collisions, and progression logic.  
It was later adapted to an ESP32-based hardware version with:

- 100-pixel WS2812B LED strip rendering
- 3 color-coded input buttons
- buzzer-based sound feedback
- boss and minion wave system
- color-matching projectile mechanic
- progressive difficulty scaling

The result is a compact embedded arcade-style game that combines software logic, hardware control, and player feedback systems.

## Core systems
### State machine
The game is organized around clear runtime states:
- `hiatus`
- `spawning`
- `playing`

This keeps the flow structured and makes the behavior easier to scale and debug.

### Gameplay logic
Core gameplay includes:
- boss health system
- enemy wave spawning
- projectile firing by color
- movement timing
- penalty and reward logic
- win-state reset loop

### Collision system
The collision system checks projectile positions against enemy positions in real time.

Behavior includes:
- successful hit when projectile color matches enemy color
- enemy removal on valid collision
- penalty when the color match is incorrect
- penalty when a projectile misses and exits the LED range

### Difficulty scaling
Difficulty increases dynamically by reducing movement delay after each cleared wave.

This creates:
- faster enemy pressure
- stronger gameplay pacing
- escalating challenge without changing the basic control scheme

### Audio feedback
The game uses event-based sound cues for:
- shooting
- successful hit
- failed hit / miss
- boss intro
- victory

This improves feedback, readability, and game feel under simple hardware constraints.

## Technical skills demonstrated
### Programming
- C++
- Python
- JavaScript
- HTML
- CSS

### Embedded and hardware
- ESP32
- Arduino-style firmware development
- WS2812B LED control
- button input handling
- buzzer audio output

### Software and workflow
- Git
- GitHub
- VS Code

### Engineering and design
- real-time logic
- system architecture
- debugging
- interaction design
- iterative prototyping
- hardware/software translation

## Why this project matters
This project is not just a hardware demo. It demonstrates the ability to:
- prototype a game system in software
- translate logic into embedded hardware
- manage real-time input, output, and state
- design under memory and hardware constraints
- build a playable and understandable interactive product

## Hardware
- ESP32
- WS2812B LED strip (100 LEDs)
- 3 push buttons
- passive buzzer

## Repository structure
```text
firmware/    ESP32 implementation
web-demo/    browser-based playable showcase
docs/        technical breakdowns
assets/      images, GIFs, video, diagrams
