import { useState } from "react";

const initialTracks = [
  { id: 1, title: "Northern Lights", artist: "Mira Lane" },
  { id: 2, title: "Late Train", artist: "The Signals" },
  { id: 3, title: "Paper Planes", artist: "June Atlas" },
  { id: 4, title: "Quiet City", artist: "Low Tide" },
];

export default function App() {
  // Store the queue because removing a track changes application data.
  const [tracks, setTracks] = useState(initialTracks);
  // Store a stable ID instead of an index, because indices change after deletion.
  const [currentTrackId, setCurrentTrackId] = useState(initialTracks[0].id);

  // The current index and object are derived from the two real state values.
  const currentIndex = tracks.findIndex((track) => track.id === currentTrackId);
  const currentTrack = tracks[currentIndex] ?? null;

  function playTrack(trackId) {
    setCurrentTrackId(trackId);
  }

  function playNext() {
    if (tracks.length === 0) return;

    // Wrap to the first track after the last track.
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrackId(tracks[nextIndex].id);
  }

  function playPrevious() {
    if (tracks.length === 0) return;

    // Adding the length prevents a negative modulo result at index zero.
    const previousIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackId(tracks[previousIndex].id);
  }

  function removeTrack(trackId) {
    setTracks((currentTracks) => {
      const removedIndex = currentTracks.findIndex((track) => track.id === trackId);
      const nextTracks = currentTracks.filter((track) => track.id !== trackId);

      // Removing a non-current track must not interrupt the current selection.
      if (trackId !== currentTrackId) return nextTracks;

      if (nextTracks.length === 0) {
        setCurrentTrackId(null);
        return nextTracks;
      }

      // Prefer the track that moves into the removed position; for the last item,
      // the final remaining track is selected with Math.min.
      const fallbackIndex = Math.min(removedIndex, nextTracks.length - 1);
      setCurrentTrackId(nextTracks[fallbackIndex].id);
      return nextTracks;
    });
  }

  return (
    <main>
      <h1>Audio queue</h1>

      {currentTrack ? (
        <section aria-live="polite">
          <h2>Now playing: {currentTrack.title}</h2>
          <p>{currentTrack.artist}</p>
          <button onClick={playPrevious}>Previous</button>
          <button onClick={playNext}>Next</button>
        </section>
      ) : (
        <p aria-live="polite">The queue is empty.</p>
      )}

      <ul>
        {tracks.map((track) => {
          const isCurrent = track.id === currentTrackId;

          return (
            <li key={track.id}>
              <button
                onClick={() => playTrack(track.id)}
                aria-pressed={isCurrent}
              >
                {isCurrent ? "▶ " : ""}{track.title} — {track.artist}
              </button>
              <button onClick={() => removeTrack(track.id)}>
                Remove {track.title}
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
