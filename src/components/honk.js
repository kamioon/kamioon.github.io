// A synthesised truck air horn (Web Audio), so there is no audio file to download.
// Only touches `window` when honk() is called (from a click), so it is safe to import during prerendering.

// Three "trumpets" tuned to a deep major chord (Bb3, D4, F4), like the horns on a heavy truck.
const NOTES = [233.08, 293.66, 349.23];
const PEAK = 0.35; // the initial blast
const SUSTAIN = 0.25;

// Soft clipping adds the brassy odd harmonics of a real horn.
const SATURATION = (() => {
    const curve = new Float32Array(512);
    for (let i = 0; i < curve.length; i++) curve[i] = Math.tanh(3 * ((i / (curve.length - 1)) * 2 - 1));
    return curve;
})();

let context = null;
let current = null; // the horn that is sounding right now, if any
let silence = null; // iOS fallback, see keepAudible()
let silenceTimer = 0;

function audioContext() {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return null;
    if (!context) {
        context = new Context();
        // Older iOS only unlocks audio once something has been started inside the tap.
        const unlock = context.createBufferSource();
        unlock.buffer = context.createBuffer(1, 1, context.sampleRate);
        unlock.connect(context.destination);
        unlock.start(0);
    }
    return context;
}

// A tiny silent clip, so no audio file is needed. Looping, it keeps an iOS audio session open.
function silentClip() {
    const rate = 8000;
    const samples = 800;
    const view = new DataView(new ArrayBuffer(44 + samples));
    const text = (offset, value) => [...value].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
    text(0, 'RIFF');
    view.setUint32(4, 36 + samples, true);
    text(8, 'WAVEfmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, rate, true);
    view.setUint32(28, rate, true);
    view.setUint16(32, 1, true);
    view.setUint16(34, 8, true); // 8-bit
    text(36, 'data');
    view.setUint32(40, samples, true);
    for (let i = 0; i < samples; i++) view.setUint8(44 + i, 128); // 128 is silence in 8-bit PCM
    const audio = new Audio(URL.createObjectURL(new Blob([view], {type: 'audio/wav'})));
    audio.loop = true;
    return audio;
}

// iPhones keep Web Audio on a session that the ringer (silent) switch mutes, which is why a horn that
// works on desktop can be silent there. Moving the page to the "playback" session makes it audible.
function keepAudible(seconds) {
    try {
        if (navigator.audioSession) {
            navigator.audioSession.type = 'playback';
            return;
        }
        const ios = /iP(hone|ad|od)/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        if (!ios) return;
        // Older iOS: a media element that is playing puts the page on the same session.
        if (!silence) silence = silentClip();
        silence.play().catch(() => {});
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => silence.pause(), (seconds + 1) * 1000);
    } catch (error) {
        // Not worth breaking the honk over.
    }
}

function noiseBuffer(ctx, seconds) {
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
}

// Call from a click or tap: browsers only start audio from a user gesture.
export function honk(seconds = 0.9) {
    const ctx = audioContext();
    if (!ctx) return;
    keepAudible(seconds);
    if (ctx.state === 'running') {
        sound(ctx, seconds);
    } else {
        // Scheduling on a suspended context (the first tap, or after an iOS interruption) can play nothing,
        // so start the horn once it is actually running.
        ctx.resume().then(() => sound(ctx, seconds), () => {});
    }
}

function sound(ctx, seconds) {
    if (current) current.cut(); // pressing again restarts the horn

    const start = ctx.currentTime + 0.02;
    const end = start + seconds;

    // Trumpets -> saturation -> brassy low-pass -> horn "bell" resonance -> envelope -> speakers.
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.linearRampToValueAtTime(PEAK, start + 0.035); // the blast
    envelope.gain.setTargetAtTime(SUSTAIN, start + 0.045, 0.08); // settles
    envelope.gain.setTargetAtTime(0.0001, end, 0.045); // release
    envelope.connect(ctx.destination);

    const bell = ctx.createBiquadFilter();
    bell.type = 'peaking';
    bell.frequency.value = 850;
    bell.Q.value = 1.2;
    bell.gain.value = 5;
    bell.connect(envelope);

    const brass = ctx.createBiquadFilter();
    brass.type = 'lowpass';
    brass.Q.value = 0.9;
    brass.frequency.setValueAtTime(500, start);
    brass.frequency.exponentialRampToValueAtTime(2800, start + 0.09); // opens up as the air hits
    brass.connect(bell);

    const shaper = ctx.createWaveShaper();
    shaper.curve = SATURATION;
    shaper.oversample = '2x';
    shaper.connect(brass);

    const mix = ctx.createGain();
    mix.gain.value = 0.14;
    mix.connect(shaper);

    const sources = [];
    NOTES.forEach(note => {
        // Two slightly detuned reeds per trumpet: the beating between them is what makes it sound real.
        [-7, 7].forEach(cents => {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.detune.value = cents;
            osc.frequency.setValueAtTime(note * 0.94, start); // the diaphragm snaps up to pitch
            osc.frequency.exponentialRampToValueAtTime(note, start + 0.07);
            osc.frequency.setTargetAtTime(note * 0.97, end, 0.06); // sags as the air runs out
            osc.connect(mix);
            osc.start(start);
            osc.stop(end + 0.5);
            sources.push(osc);
        });
    });

    // A short chuff of air as the horn opens.
    const chuff = ctx.createBufferSource();
    chuff.buffer = noiseBuffer(ctx, 0.15);
    const chuffFilter = ctx.createBiquadFilter();
    chuffFilter.type = 'bandpass';
    chuffFilter.frequency.value = 1800;
    chuffFilter.Q.value = 0.6;
    const chuffGain = ctx.createGain();
    chuffGain.gain.setValueAtTime(0.35, start);
    chuffGain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
    chuff.connect(chuffFilter);
    chuffFilter.connect(chuffGain);
    chuffGain.connect(envelope);
    chuff.start(start);

    const horn = {
        cut() {
            const now = ctx.currentTime;
            envelope.gain.cancelScheduledValues(now);
            envelope.gain.setValueAtTime(envelope.gain.value, now);
            envelope.gain.setTargetAtTime(0.0001, now, 0.015);
            sources.forEach(source => {
                try {
                    source.stop(now + 0.12);
                } catch (error) {
                    // already stopped
                }
            });
        },
    };
    current = horn;
    sources[0].onended = () => {
        envelope.disconnect();
        if (current === horn) current = null;
    };
}
