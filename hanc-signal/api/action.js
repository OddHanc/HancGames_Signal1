let state = {
  start: Date.now(),
  duration: 60000, // 1 minute window
  correctAction: randomAction(),
  globalCount: 0,
  threshold: 20,
  phase: 1
};

function randomAction() {
  return Math.random() > 0.5 ? "TAP" : "HOLD";
}

// rotate time window
function rotateWindow() {
  const now = Date.now();

  if (now - state.start > state.duration) {
    state.start = now;
    state.correctAction = randomAction();
    state.globalCount = 0;
  }
}

export default function handler(req, res) {
  rotateWindow();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type } = req.body;

  let correct = false;
  let globalShift = false;

  // check if correct action
  if (type === state.correctAction) {
    correct = true;
    state.globalCount++;
  }

  // trigger global shift
  if (state.globalCount >= state.threshold) {
    state.phase++;
    state.threshold += 10; // harder each time
    state.globalCount = 0;
    globalShift = true;

    console.log("GLOBAL SHIFT → Phase:", state.phase);
  }

  res.status(200).json({
    correct,
    phase: state.phase,
    globalShift
  });
}
