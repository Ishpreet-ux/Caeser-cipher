document.addEventListener("DOMContentLoaded", () => {
  let currentMode = "encrypt"

  // DOM Elements
  const modeButtons = document.querySelectorAll(".mode-btn")
  const inputText = document.getElementById("input-text")
  const outputText = document.getElementById("output-text")
  const shiftSlider = document.getElementById("shift")
  const shiftValue = document.getElementById("shift-value")
  const processBtn = document.getElementById("process-btn")
  const btnText = document.getElementById("btn-text")
  const copyBtn = document.getElementById("copy-btn")
  const errorMessage = document.getElementById("error-message")

  // Mode toggle
  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeButtons.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      currentMode = btn.dataset.mode
      btnText.textContent = currentMode === "encrypt" ? "Encrypt Message" : "Decrypt Message"
      errorMessage.classList.remove("show")
      outputText.value = ""
    })
  })

  // Shift slider
  shiftSlider.addEventListener("input", (e) => {
    shiftValue.textContent = e.target.value
  })

  // Process button
  processBtn.addEventListener("click", async () => {
    const text = inputText.value.trim()
    const shift = Number.parseInt(shiftSlider.value)

    if (!text) {
      showError("Please enter some text to process.")
      return
    }

    try {
      const response = await fetch("/api/caesar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          shift: shift,
          encrypt: currentMode === "encrypt",
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      outputText.value = data.result || ""
      errorMessage.classList.remove("show")
    } catch (error) {
      console.error("Connection error:", error)
      showError(`Failed to connect or process: ${error.message}`)
    }
  })

  // Copy button
  copyBtn.addEventListener("click", () => {
    if (outputText.value) {
      navigator.clipboard.writeText(outputText.value)
      const originalHTML = copyBtn.innerHTML
      copyBtn.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML
      }, 2000)
    }
  })

  // Show error
  function showError(message) {
    errorMessage.textContent = message
    errorMessage.classList.add("show")
    outputText.value = ""
  }

  // Clear error on input
  inputText.addEventListener("input", () => {
    errorMessage.classList.remove("show")
  })
})

