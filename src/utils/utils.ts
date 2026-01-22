export const getPosition = (
  start: number,
  end: number,
  scrollPosition: number
) => {
  const direction = start > end ? -1 : 1;
  const comp = start > end ? Math.max : Math.min;

  const diff = Math.abs(end - start);
  const offset = diff * scrollPosition * direction;

  return comp(start + offset, end);
};
