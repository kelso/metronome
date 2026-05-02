import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["panel", "expanded", "collapsed", "item", "toggle"]
  static values = {
    storageKey: { type: String, default: "metronome:playlistRailExpanded" }
  }

  connect() {
    this.expanded = localStorage.getItem(this.storageKeyValue) === "true"
    this.render()
  }

  toggle() {
    this.expanded = !this.expanded
    localStorage.setItem(this.storageKeyValue, String(this.expanded))
    this.render()
  }

  render() {
    this.element.classList.toggle("lg:grid-cols-[14rem_18rem_minmax(0,1fr)]", this.expanded)
    this.element.classList.toggle("lg:grid-cols-[3.75rem_20rem_minmax(0,1fr)]", !this.expanded)

    this.panelTarget.classList.toggle("p-4", this.expanded)
    this.panelTarget.classList.toggle("p-2", !this.expanded)

    this.expandedTargets.forEach((target) => target.classList.toggle("hidden", !this.expanded))
    this.collapsedTargets.forEach((target) => target.classList.toggle("hidden", this.expanded))

    this.itemTargets.forEach((target) => {
      target.classList.toggle("justify-between", this.expanded)
      target.classList.toggle("justify-center", !this.expanded)
      target.classList.toggle("px-3", this.expanded)
      target.classList.toggle("px-2", !this.expanded)
    })

    this.toggleTarget.setAttribute("aria-expanded", String(this.expanded))
    this.toggleTarget.setAttribute("title", this.expanded ? "Collapse playlists" : "Expand playlists")
  }
}
