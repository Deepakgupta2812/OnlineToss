// Sound manager using Howler.js
import { Howl } from 'howler'

// We use procedurally generated audio via AudioContext as fallback
// since we have no actual audio files bundled
const ctx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null

function beep({ frequency = 440, type = 'sine', duration = 0.3, gain = 0.4, detune = 0 } = {}) {
  if (!ctx) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.connect(g)
  g.connect(ctx.destination)
  o.type = type
  o.frequency.setValueAtTime(frequency, ctx.currentTime)
  o.detune.setValueAtTime(detune, ctx.currentTime)
  g.gain.setValueAtTime(gain, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  o.start(ctx.currentTime)
  o.stop(ctx.currentTime + duration)
}

export const sounds = {
  hover: () => beep({ frequency: 880, duration: 0.08, gain: 0.15, type: 'sine' }),
  click: () => beep({ frequency: 660, duration: 0.12, gain: 0.3, type: 'triangle' }),
  flip: () => {
    // Ascending rapid beeps simulate a spinning coin
    for (let i = 0; i < 8; i++) {
      setTimeout(() => beep({ frequency: 300 + i * 80, duration: 0.15, gain: 0.2, type: 'sawtooth' }), i * 80)
    }
  },
  whoosh: () => {
    if (!ctx) return
    const bufferSize = ctx.sampleRate * 0.4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 800
    source.connect(filter)
    filter.connect(ctx.destination)
    source.start()
  },
  land: () => {
    beep({ frequency: 120, duration: 0.25, gain: 0.5, type: 'triangle' })
    setTimeout(() => beep({ frequency: 200, duration: 0.15, gain: 0.3, type: 'sine' }), 60)
  },
  victory: () => {
    const notes = [523, 659, 784, 1047]
    notes.forEach((f, i) => setTimeout(() => beep({ frequency: f, duration: 0.3, gain: 0.35 }), i * 150))
  },
  loss: () => {
    beep({ frequency: 220, duration: 0.4, gain: 0.3, type: 'sawtooth' })
    setTimeout(() => beep({ frequency: 180, duration: 0.5, gain: 0.25, type: 'sawtooth' }), 200)
  },
  countdown: (n) => beep({ frequency: n === 1 ? 880 : 440, duration: 0.2, gain: 0.4 }),
}

let muted = false
export const setMuted = (v) => { muted = v }
export const isMuted = () => muted

export function playSound(name, ...args) {
  if (muted) return
  if (ctx?.state === 'suspended') ctx.resume()
  sounds[name]?.(...args)
}
