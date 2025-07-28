document.addEventListener('DOMContentLoaded', function() {
  const eyes = document.querySelectorAll('.eye');
  // Store translation and blink state for each eye
  const eyeStates = Array.from(eyes).map(() => ({ x: 0, y: 0, blinking: false }));

  function updateEyeTransforms() {
    eyes.forEach((eye, i) => {
      const state = eyeStates[i];
      const scale = state.blinking ? 0.2 : 1;
      eye.style.transform = `translate(${state.x}px, ${state.y}px) scaleY(${scale})`;
    });
  }

  function blink(scheduleNext = true) {
    // blink duration: .05-.3 seconds, fast blinks are less likely
    const blinkduration = 50 + Math.pow(Math.random(), 2) * 250;
    eyeStates.forEach(state => state.blinking = true);
    updateEyeTransforms();
    setTimeout(() => {
      eyeStates.forEach(state => state.blinking = false);
      updateEyeTransforms();
      if (scheduleNext) scheduleNextBlink();
    }, blinkduration);
  }

  function scheduleNextBlink() {
    // wait for next blink: .2-2.5 seconds
    const nextBlink = 200 + Math.random() * 2300;
    setTimeout(blink, nextBlink);
  }

  let resetTimeout;

  function resetEyes() {
    eyeStates.forEach(state => {
      state.x = 0;
      state.y = 0;
    });
    updateEyeTransforms();
    blink(false);
  }

  document.addEventListener("mousemove", (e) => {
    eyes.forEach((eye, i) => {
      const rect = eye.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const radius = 5;
      eyeStates[i].x = Math.cos(angle) * radius;
      eyeStates[i].y = Math.sin(angle) * radius * 0.75;
    });
    updateEyeTransforms();
    clearTimeout(resetTimeout);
    const resetDelay = 1000 + Math.random() * 2000; // 1-3 seconds
    resetTimeout = setTimeout(resetEyes, resetDelay);
  });

  scheduleNextBlink();
});
