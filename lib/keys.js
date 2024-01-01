const keys = {};
window.addEventListener("keyup", (e) => (keys[e.key] = false));
window.addEventListener("keydown", (e) => (keys[e.key] = true));
export const isKeyDown = (key) => keys[key];
