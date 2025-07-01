import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container"]

  connect() {
    this.handleKeydown = this.handleKeydown.bind(this)
    window.addEventListener("keydown", this.handleKeydown)
  }

  disconnect() {
    window.removeEventListener("keydown", this.handleKeydown)
  }

  handleKeydown(event) {
    const tag = document.activeElement.tagName
    if (tag === "INPUT" || tag === "TEXTAREA") return

    const key = event.key.toLowerCase()
    if (key === "i") {
      this.scrollLines(-10)
    } else if (key === "o") {
      this.scrollLines(10)
    }
  }

  scrollLines(lines) {
    const style = window.getComputedStyle(this.containerTarget)
    const lineHeight = parseFloat(style.lineHeight)
    this.containerTarget.scrollBy({ top: lines * lineHeight, behavior: "smooth" })
  }
}