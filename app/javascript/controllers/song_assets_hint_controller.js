import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["audio"]

  connect() {
    this.handleKeydown = this.handleKeydown.bind(this)
    window.addEventListener("keydown", this.handleKeydown)
  }

  disconnect() {
    window.removeEventListener("keydown", this.handleKeydown)
  }

  handleKeydown(event) {
    // Ignore if typing in input or textarea
    const tag = document.activeElement.tagName
    if (tag === "INPUT" || tag === "TEXTAREA") return

    // Play with number keys (1-9)
    if (/^[1-9]$/.test(event.key)) {
      const idx = parseInt(event.key, 10) - 1
      if (this.audioTargets[idx]) {
        this.stopAll()
        this.audioTargets[idx].currentTime = 0
        this.audioTargets[idx].play()
      }
    }

    // Stop all with "s"
    if (event.key === "s" || event.key === "S") {
      this.stopAll()
    }
  }

  stopAll() {
    this.audioTargets.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
  }
}
