export type Sample = { x: number; y: number; label: number };
export type Dataset = 'Diagonal' | 'Four corners' | 'Island';
export type Features = 'both' | 'horizontal' | 'curved';
export type Model = { weights: number[]; steps: number; losses: number[] };
export const freshModel = (): Model => ({ weights: Array(6).fill(0), steps: 0, losses: [] });
export function dataset(name: Dataset) {
  return Array.from({ length: 64 }, (_, i) => {
    const x = (i % 8) / 7 * 1.8 - .9; const y = Math.floor(i / 8) / 7 * 1.8 - .9;
    const label = name === 'Diagonal' ? Number(x + y > .1) : name === 'Four corners' ? Number(x * y > 0) : Number(x * x + y * y < .55);
    return { x, y, label };
  });
}
function inputs(p: Sample, mode: Features) { return [p.x, mode === 'horizontal' ? 0 : p.y, mode === 'curved' ? p.x * p.y : 0, mode === 'curved' ? p.x * p.x : 0, mode === 'curved' ? p.y * p.y : 0, 1]; }
export function predict(p: Sample, weights: number[], mode: Features) {
  const z = inputs(p, mode).reduce((sum, feature, i) => sum + weights[i] * feature, 0);
  return 1 / (1 + Math.exp(-z));
}
export function loss(data: Sample[], weights: number[], mode: Features) {
  return data.reduce((sum, p) => { const probability = Math.max(1e-9, Math.min(1 - 1e-9, predict(p, weights, mode))); return sum - p.label * Math.log(probability) - (1 - p.label) * Math.log(1 - probability); }, 0) / data.length;
}
export function accuracy(data: Sample[], weights: number[], mode: Features) { return data.filter(p => Number(predict(p, weights, mode) >= .5) === p.label).length; }
export function train(model: Model, data: Sample[], mode: Features, count: number): Model {
  let weights = [...model.weights];
  for (let step = 0; step < count; step++) {
    const gradient = Array(6).fill(0);
    data.forEach(p => { const error = predict(p, weights, mode) - p.label; inputs(p, mode).forEach((feature, i) => { gradient[i] += error * feature; }); });
    weights = weights.map((w, i) => w - .8 * (gradient[i] / data.length + (i === 5 ? 0 : .001 * w)));
  }
  return { weights, steps: model.steps + count, losses: [...model.losses.slice(-79), loss(data, weights, mode)] };
}
