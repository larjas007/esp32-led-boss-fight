# ESP32 LED Boss Fight

An embedded arcade-style game built on ESP32 with WS2812B LEDs, three color-coded buttons, and buzzer-based audio feedback.

## Overview
This project implements a real-time boss fight system on an LED strip using color-matched projectiles, wave spawning, collision logic, progressive difficulty, and event-driven sound.

## Technical highlights
- Finite game states: hiatus, spawning, playing
- Bullet and enemy entity systems
- Collision handling between projectiles and minions
- Boss health and wave progression
- Difficulty scaling through timing reduction
- Sound cues for shooting, hit, penalty, intro, and victory
- Real-time LED rendering on a 100-pixel strip

## Hardware
- ESP32
- WS2812B LED strip (100 LEDs)
- 3 push buttons
- Passive buzzer

## Status
In progress. A browser-based playable showcase in HTML, CSS, and JavaScript will be added to demonstrate the game logic without requiring the physical hardware.
