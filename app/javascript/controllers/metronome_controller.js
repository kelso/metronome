import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["toggleButton", "bpm", "timeSignature", "volume"]
  static values = {
    playlistId: Number,
    songId: Number,
    songsJson: Array
  }

  connect() {
    this.isPlaying = false
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    this.outputGain = this.audioContext.createGain()

    const savedLinearVolume = parseFloat(localStorage.getItem("metronome:volume") || "1")
    const gainValue = savedLinearVolume ** 2
    this.outputGain.gain.value = gainValue
    if (this.hasVolumeTarget) this.volumeTarget.value = savedLinearVolume
    this.outputGain.connect(this.audioContext.destination)

    this.currentBeat = 0
    this.nextNoteTime = 0
    this.lookahead = 25.0
    this.scheduleAheadTime = 0.1
    this.timerID = null

    window.addEventListener("keydown", this.handleKeyDown)
  }

  disconnect() {
    this.stop()
    window.removeEventListener("keydown", this.handleKeyDown)
  }

  handleKeyDown = (event) => {
    if (event.code === "Space") {
      event.preventDefault()
      this.toggle()
    }

    if (event.code === "ArrowUp") {
      event.preventDefault()
      this.changeVolume(+0.05)
    }

    if (event.code === "ArrowDown") {
      event.preventDefault()
      this.changeVolume(-0.05)
    }

    if (event.code === "ArrowRight") {
      this.gotoNextSong()
    }

    if (event.code === "ArrowLeft") {
      this.gotoPreviousSong()
    }
  }

  start() {
    if (this.isPlaying) return
    this.isPlaying = true
    this.currentBeat = 0
    this.nextNoteTime = this.audioContext.currentTime + 0.05
    this.scheduler()
    this._setButtonPlayingState(true)
  }
  
  stop() {
    this.isPlaying = false
    clearTimeout(this.timerID)
    this._setButtonPlayingState(false)
  }

  toggle() {
    this.isPlaying ? this.stop() : this.start()
  }

  scheduler = () => {
    const bpm = parseInt(this.bpmTarget.value)
    const interval = 60.0 / bpm

    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleClick(this.nextNoteTime)
      this.nextNoteTime += interval
      this.currentBeat = (this.currentBeat + 1) % this.getBeatsPerBar()
    }

    this.timerID = setTimeout(this.scheduler, this.lookahead)
  }

  scheduleClick(time) {
    const isAccented = this.currentBeat === 0

    const osc = this.audioContext.createOscillator()
    const envelope = this.audioContext.createGain()

    osc.frequency.value = isAccented ? 2500 : 2000
    envelope.gain.value = 1

    osc.connect(envelope)
    envelope.connect(this.outputGain)

    osc.start(time)
    osc.stop(time + 0.05)
  }

  getBeatsPerBar() {
    const ts = this.timeSignatureTarget.value
    const [beats] = ts.split("/").map(Number)
    return beats || 4
  }

  gotoNextSong() {
    this.navigateSong(1)
  }

  gotoPreviousSong() {
    this.navigateSong(-1)
  }

  navigateSong(direction) {
    const songs = this.songsJsonValue
    const currentIndex = songs.findIndex(s => s.id === this.songIdValue)

    const newIndex = currentIndex + direction
    if (newIndex >= 0 && newIndex < songs.length) {
      const newSong = songs[newIndex]
      Turbo.visit(newSong.url)
    }
  }

  changeVolume(delta) {
    let linearVolume = parseFloat(this.volumeTarget?.value || Math.sqrt(this.outputGain.gain.value))
    linearVolume = Math.max(0, Math.min(1, linearVolume + delta))
    const gainValue = linearVolume ** 2
    this.outputGain.gain.value = gainValue
    if (this.hasVolumeTarget) this.volumeTarget.value = linearVolume
    localStorage.setItem("metronome:volume", linearVolume)
  }

  setVolume(event) {
    const linearVolume = parseFloat(event.target.value)
    const gainValue = linearVolume ** 2
    this.outputGain.gain.value = gainValue
    localStorage.setItem("metronome:volume", linearVolume)
  }

  _setButtonPlayingState(playing) {
    const btn = this.toggleButtonTarget
    btn.querySelector("[data-playing-shown]").style.display = playing ? "inline" : "none"
    btn.querySelector("[data-playing-hidden]").style.display = playing ? "none" : "inline"
  }
}
