/** Wait for both the visual hold and speech; cancellation invalidates late events. */
export function startLessonPlayback({
  delay,
  speak,
  onComplete,
  onError,
}: {
  delay: number;
  speak?: (done: () => void, fail: () => void) => () => void;
  onComplete: () => void;
  onError: () => void;
}) {
  let active = true;
  let animationDone = false;
  let speechDone = !speak;
  let cancelSpeech: (() => void) | undefined;
  let watchdog: ReturnType<typeof setTimeout> | undefined;
  const finish = () => {
    if (active && animationDone && speechDone) {
      active = false;
      clearTimeout(watchdog);
      onComplete();
    }
  };
  const timer = setTimeout(() => {
    animationDone = true;
    finish();
  }, delay);
  const fail = () => {
    if (!active) return;
    active = false;
    clearTimeout(timer);
    clearTimeout(watchdog);
    cancelSpeech?.();
    onError();
  };
  if (speak) {
    watchdog = setTimeout(fail, 120000);
    try {
      cancelSpeech = speak(() => {
        speechDone = true;
        clearTimeout(watchdog);
        finish();
      }, fail);
    } catch {
      fail();
    }
  }
  return () => {
    active = false;
    clearTimeout(timer);
    clearTimeout(watchdog);
    cancelSpeech?.();
  };
}

/** Use real silent gaps: punctuation alone is interpreted differently by each voice. */
export function narrateInSequence(
  parts: { text: string; pauseAfter: number }[],
  speak: (text: string, done: () => void, fail: () => void) => () => void,
  onComplete: () => void,
  onError: () => void,
) {
  let active = true;
  let index = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let cancelSpeech: (() => void) | undefined;
  const fail = () => {
    if (!active) return;
    active = false;
    clearTimeout(timer);
    cancelSpeech?.();
    onError();
  };
  const next = () => {
    if (!active) return;
    if (index === parts.length) {
      active = false;
      onComplete();
      return;
    }
    const part = parts[index++];
    let ended = false;
    try {
      cancelSpeech = speak(
        part.text,
        () => {
          if (!active || ended) return;
          ended = true;
          timer = setTimeout(next, part.pauseAfter);
        },
        fail,
      );
    } catch {
      fail();
    }
  };
  next();
  return () => {
    active = false;
    clearTimeout(timer);
    cancelSpeech?.();
  };
}
