import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="metronome"
export default class extends Controller {
  static targets = ["startButton", "stopButton", "bpm"]

  connect() {
    this.isPlaying = false
    this.intervalId = null
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }

  start() {
    if (this.isPlaying) return
    this.isPlaying = true

    const bpm = parseInt(this.bpmTarget.value)
    const interval = (60 / bpm) * 1000 // milliseconds between beats

    this.intervalId = setInterval(() => {
      this.playClick()
    }, interval)
  }

  stop() {
    if (!this.isPlaying) return
    this.isPlaying = false
    clearInterval(this.intervalId)
  }

  playClick() {
    const osc = this.audioContext.createOscillator()
    const envelope = this.audioContext.createGain()

    osc.frequency.value = 1000 // Hz
    envelope.gain.value = 1

    osc.connect(envelope)
    envelope.connect(this.audioContext.destination)

    osc.start()
    osc.stop(this.audioContext.currentTime + 0.05) // short click
  }
}
