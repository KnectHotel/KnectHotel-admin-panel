
let audio: HTMLAudioElement | null = null;
let unlocked = false;
let locking = false;

function addUnlockListeners() {
  window.addEventListener("pointerdown", unlockOnce, { passive: true });
  window.addEventListener("keydown", unlockOnce, { passive: true });
  window.addEventListener("touchstart", unlockOnce, { passive: true });
}
function removeUnlockListeners() {
  window.removeEventListener("pointerdown", unlockOnce);
  window.removeEventListener("keydown", unlockOnce);
  window.removeEventListener("touchstart", unlockOnce);
}

async function unlockOnce() {
  try {
    if (!audio) {
      audio = new Audio("/public/mixkit-confirmation-tone-2867"); // file in /public/sounds/
      audio.preload = "auto";
    }
    await audio.play(); // play-pause primes autoplay
    audio.pause();
    audio.currentTime = 0;
    unlocked = true;
    removeUnlockListeners();
  } catch {
    // still locked – keep listeners
  } finally {
    locking = false;
  }
}

export function ensureSoundUnlocked() {
  if (typeof window === "undefined" || unlocked || locking) return;
  locking = true;
  addUnlockListeners();
}

export async function playNotify() {
  try {
    if (!audio) {
      audio = new Audio("/public/mixkit-confirmation-tone-2867");
      audio.preload = "auto";
    }
    if (!unlocked) {
      // best-effort prime
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      unlocked = true;
    }
    audio.currentTime = 0;
    await audio.play();
  } catch {
    // silently skip if still blocked
  }
}
