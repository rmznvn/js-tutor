const episodes = ["Execution Contexts", "Closures", "Maps and Sets"];

function createPlayer(playlist, output, toggleButton) {
  return {
    playlist: [...playlist], // Copy the array so outside code cannot reorder the player's queue accidentally.
    currentIndex: 0,
    isPlaying: false,

    render() {
      const currentTitle = this.playlist.at(this.currentIndex) ?? "No episodes";
      output.textContent = `${currentTitle} — ${this.isPlaying ? "playing" : "paused"}`;
      toggleButton.textContent = this.isPlaying ? "Pause" : "Play";
    },

    toggle() {
      if (this.playlist.length === 0) return;
      this.isPlaying = !this.isPlaying;
      this.render();
    },

    next() {
      if (this.playlist.length === 0) return;
      // Remainder wraps the index from the last episode back to zero.
      this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
      this.render();
    },
  };
}

const output = document.querySelector("#now-playing");
const toggleButton = document.querySelector("#toggle");
const nextButton = document.querySelector("#next");
const player = createPlayer(episodes, output, toggleButton);

// A method passed directly becomes a plain callback, so its receiver would be the button.
// bind creates functions whose `this` permanently points to player.
const handleToggle = player.toggle.bind(player);
const handleNext = player.next.bind(player);

toggleButton.addEventListener("click", handleToggle);
nextButton.addEventListener("click", handleNext);
player.render();

// Debug checkpoint: `const broken = player.next; broken()` loses the player receiver.
// An arrow method would not fix this because arrows capture `this` from their outer scope.
