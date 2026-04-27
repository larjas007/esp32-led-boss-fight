import React, { useEffect, useState } from 'react'

function App() {
  // Variables
  // JavaScript comments use //
  const ledCount = 100
  const leds = Array.from({ length: ledCount })

  const initialBossPosition = ledCount - 3
  const maxBossHp = 3
  const waveSizes = [10, 15, 20]
  const minionColors = ['red', 'blue', 'yellow']

  // State
  // state = data that changes and makes React re-render the screen
  const [offset, setOffset] = useState(0)
  const [gamePhase, setGamePhase] = useState('hiatus')
  const [playerPos] = useState(0)

  const [bullets, setBullets] = useState([])
  const [minions, setMinions] = useState([])

  const [bossPosition, setBossPosition] = useState(initialBossPosition)
  const [bossHp, setBossHp] = useState(maxBossHp)
  const [waveIndex, setWaveIndex] = useState(0)
  const [spawnIndex, setSpawnIndex] = useState(0)
  const [enemyDelay, setEnemyDelay] = useState(300)

  function playTone(startFrequency, endFrequency, duration, volume = 0.15) {
    // Web Audio API = browser tool to generate sound with JavaScript
    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = 'square'

    oscillator.frequency.setValueAtTime(
      startFrequency,
      audioContext.currentTime
    )

    oscillator.frequency.exponentialRampToValueAtTime(
      endFrequency,
      audioContext.currentTime + duration
    )

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime)

    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration
    )

    oscillator.start()
    oscillator.stop(audioContext.currentTime + duration)
  }

  function playShootSound() {
    // Equivalent to pew()
    playTone(900, 180, 0.12, 0.15)
  }

  function playHitSound() {
    // Equivalent to puf()
    playTone(220, 120, 0.08, 0.12)
  }

  function playMissSound() {
    // Equivalent to mehhh()
    playTone(300, 120, 0.22, 0.12)
  }

  function playVictorySound() {
    playTone(523, 659, 0.10, 0.12)

    setTimeout(() => {
      playTone(783, 1046, 0.14, 0.12)
    }, 120)

    setTimeout(() => {
      playTone(1046, 1567, 0.20, 0.12)
    }, 280)
  }

  function playGameOverSound() {
    playTone(220, 120, 0.18, 0.14)

    setTimeout(() => {
      playTone(180, 80, 0.24, 0.14)
    }, 180)
  }

  function resetGame() {
    setBullets([])
    setMinions([])
    setBossPosition(initialBossPosition)
    setBossHp(maxBossHp)
    setWaveIndex(0)
    setSpawnIndex(0)
    setEnemyDelay(300)
  }

  function startGame() {
    resetGame()
    setGamePhase('spawning')
  }

  function stopGame() {
    resetGame()
    setGamePhase('hiatus')
  }

  function triggerGameOver() {
    playGameOverSound()
    setBullets([])
    setGamePhase('gameOver')

    // Let the red flash show, then return to rainbow/hiatus
    setTimeout(() => {
      resetGame()
      setGamePhase('hiatus')
    }, 1400)
  }

  function toggleGamePhase() {
    if (gamePhase === 'hiatus' || gamePhase === 'victory') {
      startGame()
      return
    }

    stopGame()
  }

  function shootBullet(color) {
    if (gamePhase !== 'playing') {
      return
    }

    playShootSound()

    const newBullet = {
      id: Date.now() + Math.random(),
      position: playerPos,
      color: color,
    }

    setBullets((prevBullets) => [...prevBullets, newBullet])
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOffset((prevOffset) => prevOffset + 1)
    }, 40)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (gamePhase !== 'spawning') {
      return
    }

    const intervalId = setInterval(() => {
      const currentWaveSize = waveSizes[Math.min(waveIndex, 2)]

      if (spawnIndex < currentWaveSize) {
        const randomColor =
          minionColors[Math.floor(Math.random() * minionColors.length)]

        const newMinion = {
          id: Date.now() + Math.random(),
          position: bossPosition - 1 - spawnIndex,
          color: randomColor,
        }

        setMinions((prevMinions) => [...prevMinions, newMinion])
        setSpawnIndex((prevSpawnIndex) => prevSpawnIndex + 1)
        return
      }

      setGamePhase('playing')
    }, 80)

    return () => clearInterval(intervalId)
  }, [gamePhase, spawnIndex, waveIndex, bossPosition])

  useEffect(() => {
    if (gamePhase !== 'playing') {
      return
    }

    const intervalId = setInterval(() => {
      setBossPosition((prevBossPosition) => prevBossPosition - 1)

      setMinions((prevMinions) =>
        prevMinions.map((minion) => ({
          ...minion,
          position: minion.position - 1,
        }))
      )
    }, enemyDelay)

    return () => clearInterval(intervalId)
  }, [gamePhase, enemyDelay])

  useEffect(() => {
    if (gamePhase !== 'playing') {
      return
    }

    const intervalId = setInterval(() => {
      setBullets((prevBullets) =>
        prevBullets.map((bullet) => ({
          ...bullet,
          position: bullet.position + 1,
        }))
      )
    }, 30)

    return () => clearInterval(intervalId)
  }, [gamePhase])

  useEffect(() => {
    if (gamePhase !== 'playing') {
      return
    }

    const bulletsToRemove = new Set()
    const minionsToRemove = new Set()

    let shouldPenalizeBoss = false
    let shouldPlayHit = false
    let shouldPlayMiss = false

    bullets.forEach((bullet) => {
      if (bullet.position >= ledCount) {
        bulletsToRemove.add(bullet.id)
        shouldPenalizeBoss = true
        shouldPlayMiss = true
        return
      }

      minions.forEach((minion) => {
        const samePosition = bullet.position === minion.position
        const sameColor = bullet.color === minion.color

        if (!samePosition) {
          return
        }

        bulletsToRemove.add(bullet.id)

        if (sameColor) {
          minionsToRemove.add(minion.id)
          shouldPlayHit = true
          return
        }

        shouldPenalizeBoss = true
        shouldPlayMiss = true
      })
    })

    if (bulletsToRemove.size > 0) {
      setBullets((prevBullets) =>
        prevBullets.filter((bullet) => !bulletsToRemove.has(bullet.id))
      )
    }

    if (minionsToRemove.size > 0) {
      setMinions((prevMinions) =>
        prevMinions.filter((minion) => !minionsToRemove.has(minion.id))
      )
    }

    if (shouldPenalizeBoss) {
      setBossPosition((prevBossPosition) => prevBossPosition - 2)
    }

    if (shouldPlayHit) {
      playHitSound()
    }

    if (shouldPlayMiss) {
      playMissSound()
    }
  }, [bullets, minions, gamePhase])

  useEffect(() => {
    if (gamePhase !== 'playing') {
      return
    }

    const minionReachedPlayer = minions.some(
      (minion) => minion.position <= playerPos
    )

    const bossReachedPlayer = bossPosition <= playerPos

    if (minionReachedPlayer || bossReachedPlayer) {
      triggerGameOver()
    }
  }, [minions, bossPosition, playerPos, gamePhase])

  useEffect(() => {
    if (gamePhase !== 'playing') {
      return
    }

    if (minions.length > 0) {
      return
    }

    setBossHp((prevBossHp) => {
      const nextBossHp = prevBossHp - 1

      if (nextBossHp <= 0) {
        playVictorySound()
        setBullets([])
        setGamePhase('victory')
        return 0
      }

      setWaveIndex((prevWaveIndex) => prevWaveIndex + 1)
      setEnemyDelay((prevEnemyDelay) => Math.max(80, prevEnemyDelay - 40))
      setSpawnIndex(0)
      setGamePhase('spawning')

      return nextBossHp
    })
  }, [minions, gamePhase])

  function getLedColor(index) {
    const bullet = bullets.find(
      (currentBullet) => currentBullet.position === index
    )

    const minion = minions.find(
      (currentMinion) => currentMinion.position === index
    )

    const bossStart = bossPosition
    const bossEnd = bossPosition + bossHp - 1
    const isBossPixel = index >= bossStart && index <= bossEnd

    if (gamePhase === 'gameOver') {
      const flashIsOn = Math.floor(offset / 4) % 2 === 0

      return flashIsOn ? 'red' : '#1f0000'
    }

    if (gamePhase === 'hiatus' || gamePhase === 'victory') {
      return `hsl(${(((index + offset) % ledCount) / ledCount) * 360}, 100%, 50%)`
    }

    if (bullet) {
      return bullet.color
    }

    if (minion) {
      return minion.color
    }

    if (isBossPixel) {
      return 'purple'
    }

    if (index === playerPos) {
      return 'white'
    }

    return '#3f3f46'
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* HERO SECTION */}
      <section className="mx-auto flex flex-col items-center px-6 py-24 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-zinc-400">
          A small arcade game built on ESP32
        </p>

        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
          ESP32 LED Boss Fight
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-zinc-300">
          A small arcade game I built with an ESP32, a 100-LED strip,
          color-based attacks, minion waves, boss movement, collision logic,
          and arcade-style sound feedback.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://www.tiktok.com/@luis.larjas/video/7629614159126105364?_r=1&_t=ZS-95bjJQ5EfIq"
            className="rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            Watch Demo
          </a>

          <a
            href="https://github.com/larjas007"
            className="rounded-2xl border border-zinc-700 px-6 py-3 font-semibold text-white transition hover:bg-zinc-800"
          >
            View GitHub
          </a>
        </div>
      </section>

      {/* STAGE SECTION */}
      <section id="demo" className="px-2 pb-12">
        {/* Stage Container */}
        <div className="mt-10 w-full overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-[0_0_35px_rgba(255,255,255,0.08)]">
          <div
            className="grid w-full gap-px"
            style={{ gridTemplateColumns: `repeat(${ledCount}, minmax(0, 1fr))` }}
          >
            {leds.map((_, index) => (
              <div
                key={index}
                className="h-8 rounded-md"
                style={{
                  backgroundColor: getLedColor(index),
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={toggleGamePhase}
            className={
              gamePhase === 'hiatus' || gamePhase === 'victory'
                ? 'rounded-2xl border border-cyan-300 bg-cyan-500 px-8 py-4 font-black uppercase tracking-[0.2em] text-black shadow-[0_0_24px_rgba(34,211,238,0.9),inset_0_4px_8px_rgba(255,255,255,0.55),inset_0_-6px_10px_rgba(0,0,0,0.35)] transition hover:scale-105 hover:bg-cyan-300 active:scale-95 active:shadow-[inset_0_6px_12px_rgba(0,0,0,0.45)]'
                : 'rounded-2xl border border-red-300 bg-red-600 px-8 py-4 font-black uppercase tracking-[0.2em] text-white shadow-[0_0_24px_rgba(239,68,68,0.9),inset_0_4px_8px_rgba(255,255,255,0.35),inset_0_-6px_10px_rgba(0,0,0,0.45)] transition hover:scale-105 hover:bg-red-500 active:scale-95 active:shadow-[inset_0_6px_12px_rgba(0,0,0,0.55)]'
            }
          >
            {gamePhase === 'hiatus' || gamePhase === 'victory'
              ? 'Start Game'
              : 'Stop Game'}
          </button>
        </div>

        {gamePhase === 'victory' && (
          <p className="mt-4 text-center text-lg font-bold text-lime-400">
            Victory. Boss defeated.
          </p>
        )}

        {(gamePhase === 'playing' || gamePhase === 'spawning') && (
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => shootBullet('blue')}
              className="w-28 rounded-2xl bg-blue-700 px-6 py-3 font-semibold text-white active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.45)] border border-gray-700 active:brightness-90 transition hover:bg-blue-600"
            >
              Blue
            </button>

            <button
              onClick={() => shootBullet('red')}
              className="w-28 rounded-2xl bg-red-700 px-6 py-3 font-semibold text-white active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.45)] border border-gray-700 active:brightness-90 transition hover:bg-red-600"
            >
              Red
            </button>

            <button
              onClick={() => shootBullet('yellow')}
              className="w-28 rounded-2xl bg-yellow-400 px-6 py-3 font-semibold text-black active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.45)] border border-gray-700 active:brightness-90 transition hover:bg-yellow-300"
            >
              Yellow
            </button>
          </div>
        )}

        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-center text-sm text-zinc-300">
          <p className="mb-2 font-semibold text-white">Game rules</p>

          <p>
            Shoot bullets that match the minion color. Blue destroys blue, red
            destroys red, and yellow destroys yellow. Wrong-color hits move the
            boss closer. When all minions in a wave are destroyed, the boss
            loses one HP and the next wave starts faster.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
