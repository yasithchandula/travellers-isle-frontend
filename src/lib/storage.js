export const loadState = (key) => {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch {
    return undefined;
  }
};

export const saveState = (key, state) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(key, serialized);
  } catch {}
};

export const removeState = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {}
};