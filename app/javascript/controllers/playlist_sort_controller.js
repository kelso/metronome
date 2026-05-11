import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["item", "position"]

  connect() {
    this.draggedItem = null
    this.originalNextSibling = null
    this.dropHandled = false
  }

  dragStart(event) {
    this.draggedItem = event.currentTarget
    this.originalNextSibling = this.draggedItem.nextElementSibling
    this.dropHandled = false

    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", this.draggedItem.dataset.playlistSortSongId)

    this.draggedItem.classList.add("song-sort-item-dragging")
  }

  dragOver(event) {
    if (!this.draggedItem) return

    event.preventDefault()

    const target = event.currentTarget
    if (target === this.draggedItem) return

    const bounds = target.getBoundingClientRect()
    const placeAfterTarget = event.clientY > bounds.top + bounds.height / 2

    target.parentNode.insertBefore(
      this.draggedItem,
      placeAfterTarget ? target.nextElementSibling : target
    )

    this.updatePositions()
  }

  drop(event) {
    if (!this.draggedItem) return

    event.preventDefault()
    this.dropHandled = true

    const item = this.draggedItem
    const position = this.itemTargets.indexOf(item)

    if (position === Number(item.dataset.playlistSortOriginalPosition)) return

    this.persistPosition(item, position, this.originalNextSibling)
  }

  dragEnd() {
    if (!this.draggedItem) return

    this.draggedItem.classList.remove("song-sort-item-dragging")

    if (!this.dropHandled) {
      this.restoreOriginalPosition()
    }

    this.updatePositions()
    this.draggedItem = null
    this.originalNextSibling = null
  }

  async persistPosition(item, position, originalNextSibling) {
    item.classList.add("song-sort-item-saving")

    try {
      const response = await fetch(item.dataset.playlistSortReorderUrl, {
        method: "PATCH",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken()
        },
        body: JSON.stringify({ row_order_position: position })
      })

      if (!response.ok) throw new Error("Song reorder failed")

      this.itemTargets.forEach((target, index) => {
        target.dataset.playlistSortOriginalPosition = index
      })
      this.updateMetronomeSongOrder()
    } catch (_error) {
      this.element.insertBefore(item, originalNextSibling)
      this.updatePositions()
    } finally {
      item.classList.remove("song-sort-item-saving")
    }
  }

  restoreOriginalPosition() {
    if (!this.draggedItem) return

    this.element.insertBefore(this.draggedItem, this.originalNextSibling)
  }

  updatePositions() {
    this.itemTargets.forEach((item, index) => {
      const position = item.querySelector("[data-playlist-sort-target~='position']")
      if (position) position.textContent = index + 1
    })
  }

  updateMetronomeSongOrder() {
    const metronome = document.querySelector("[data-controller~='metronome']")
    if (!metronome) return

    const songs = this.itemTargets.map((item) => ({
      id: Number(item.dataset.playlistSortSongId),
      url: item.dataset.playlistSortSongUrl
    }))

    metronome.dataset.metronomeSongsJsonValue = JSON.stringify(songs)
  }

  csrfToken() {
    return document.querySelector("meta[name='csrf-token']")?.content
  }
}
