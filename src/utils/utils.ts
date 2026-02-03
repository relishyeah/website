function normalize(value: number, min: number, max: number) {
  return Math.min(Math.max((value - min) / (max - min), 0), 1);
}

export const getPosition = (
  start: number,
  end: number,
  scrollPosition: number,
) => {
  const direction = start > end ? -1 : 1;
  const comp = start > end ? Math.max : Math.min;

  const diff = Math.abs(end - start);

  const viewportHeightPx = window.innerHeight;
  const startPx = (100 * viewportHeightPx) / 100;
  const endPx = (9.5 * viewportHeightPx) / 100;

  const offset = diff * normalize(scrollPosition, startPx, endPx) * direction;

  return comp(start + offset, end);
};
