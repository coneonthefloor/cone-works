export const getContextMock = () =>
  ({
    save() {},
    restore() {},
    rect() {},
    stroke() {},
    fill() {},
    beginPath() {},
    closePath() {},
    translate() {},
  } as any)
