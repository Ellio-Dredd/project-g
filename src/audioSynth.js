/* ==========================================================================
   GIMHANI'S PROPOSAL WEB APP - LOUD 8-BIT RETRO SYNTHESIZER
   ========================================================================== */

let audioCtx = null;
let ambientSynthGain = null;
let ambientLoopTimeout = null;

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// 8-bit Retro Click Sound (Quick clean square wave bip)
export function playClickSound() {
  try {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'square'; // Authentic 8-bit flavor
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Note A5
    osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.28, audioCtx.currentTime); // Boosted volume
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    console.log("Audio click failed to play", e);
  }
}

// 8-bit Retro Escape sound (Pitch-sliding triangle boing)
export function playWhooshSound() {
  try {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.25);
    
    gain.gain.setValueAtTime(0.35, audioCtx.currentTime); // Boosted volume
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
  } catch (e) {}
}

// 8-bit Spooky Suspense Theme (Thriller choice)
export function playThrillerSweep() {
  try {
    initAudioContext();
    const notes = [110.00, 130.81, 146.83, 164.81]; // A minor tension arpeggio
    const now = audioCtx.currentTime;
    
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.15 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.5);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.55);
    });
  } catch (e) {}
}

// 8-bit Retro Chime Sweep (Romance choice)
export function playRomanceSweep() {
  try {
    initAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C major rapid ascend arpeggio
    const now = audioCtx.currentTime;
    
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.20, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  } catch (e) {}
}

// 8-bit Level-Up retro sequence (Rom-com choice)
export function playRomcomSweep() {
  try {
    initAudioContext();
    const notes = [261.63, 329.63, 392.00, 523.25, 783.99, 1046.50]; // Sweet level up chord
    const now = audioCtx.currentTime;
    
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.4);
    });
  } catch (e) {}
}

// 8-bit Ambient background beat loops
export function playAmbientLoop(isPlaying) {
  if (!isPlaying) {
    stopAmbientLoop();
    return;
  }
  try {
    initAudioContext();
    if (!ambientSynthGain) {
      ambientSynthGain = audioCtx.createGain();
      ambientSynthGain.gain.setValueAtTime(0.08, audioCtx.currentTime); // Boosted ambient volume
      ambientSynthGain.connect(audioCtx.destination);
    }
    
    const now = audioCtx.currentTime;
    
    // Retro chord notes
    const chords = [
      [261.63, 329.63, 392.00], // C Major
      [293.66, 349.23, 440.00], // D minor
      [349.23, 440.00, 523.25], // F Major
      [392.00, 493.88, 587.33]  // G Major
    ];
    
    const currentChord = chords[Math.floor(Math.random() * chords.length)];
    
    currentChord.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      
      osc.type = 'triangle'; // Soft retro triangle wave
      osc.frequency.setValueAtTime(freq, now);
      
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.04, now + 1.0);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 3.4);
      
      osc.connect(oscGain);
      oscGain.connect(ambientSynthGain);
      
      osc.start(now);
      osc.stop(now + 3.6);
    });
    
    // Play a tiny retro 8-bit arpeggio pulse on top
    const arpeggioNotes = [523.25, 587.33, 659.25, 783.99];
    const arpFreq = arpeggioNotes[Math.floor(Math.random() * arpeggioNotes.length)];
    
    const arpOsc = audioCtx.createOscillator();
    const arpGain = audioCtx.createGain();
    
    arpOsc.type = 'square';
    arpOsc.frequency.setValueAtTime(arpFreq, now + 1.2);
    
    arpGain.gain.setValueAtTime(0, now + 1.2);
    arpGain.gain.linearRampToValueAtTime(0.02, now + 1.22);
    arpGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
    
    arpOsc.connect(arpGain);
    arpGain.connect(ambientSynthGain);
    
    arpOsc.start(now + 1.2);
    arpOsc.stop(now + 1.65);
    
    ambientLoopTimeout = setTimeout(() => playAmbientLoop(true), 3800);
  } catch (e) {}
}

export function stopAmbientLoop() {
  if (ambientLoopTimeout) {
    clearTimeout(ambientLoopTimeout);
    ambientLoopTimeout = null;
  }
}
