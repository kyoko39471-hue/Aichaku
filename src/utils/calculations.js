
export function calculateCPU(price, uses) {
  if (typeof price !== 'number' || typeof uses !== 'number') {
    return 0;
  }

  if (uses <= 0) {
    return price;
  }

  return price / uses;
}

export function calculateAverageCPU(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return 0;
  }

  let totalCPU = 0;

  for (const item of items) {
    totalCPU += calculateCPU(item.price, item.uses);
  }

  return totalCPU / items.length;
}

export function compareByCPU(a, b, direction = 'desc') {
  const cpuA = calculateCPU(a.price, a.uses);
  const cpuB = calculateCPU(b.price, b.uses);

  if (cpuA < cpuB) return direction === 'asc' ? -1 : 1;
  if (cpuA > cpuB) return direction === 'asc' ? 1 : -1;
  return 0;
}