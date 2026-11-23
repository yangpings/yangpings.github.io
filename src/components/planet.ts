// World.exe's little planet. The levels stand at spots across a sphere, joined by a dashed route.
// Turning to a level rotates the whole planet so that spot comes up to the top, facing the visitor.
// The maths here (orientation and projection) is shared by the WebGL planet and the HTML pictures
// that stand on it, so both always agree on where each spot is on screen.

export type V3 = [number, number, number];
export type Quat = [number, number, number, number]; // x, y, z, w

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const scale = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const sphere = (latDeg: number, lonDeg: number): V3 => {
  const la = latDeg * Math.PI / 180, lo = lonDeg * Math.PI / 180;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
};

export function rotate(q: Quat, v: V3): V3 {
  const [x, y, z, w] = q;
  const ix = w * v[0] + y * v[2] - z * v[1], iy = w * v[1] + z * v[0] - x * v[2], iz = w * v[2] + x * v[1] - y * v[0], iw = -x * v[0] - y * v[1] - z * v[2];
  return [ix * w + iw * -x + iy * -z - iz * -y, iy * w + iw * -y + iz * -x - ix * -z, iz * w + iw * -z + ix * -y - iy * -x];
}
// Spherical interpolation; t may run a little past 0 or 1 (the give at either end of the route).
function slerp(a: Quat, b: Quat, t: number): Quat {
  let c = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const s = c < 0 ? -1 : 1; c *= s;
  if (c > .9995) { const q = a.map((v, i) => v + (b[i] * s - v) * t) as Quat; const l = Math.hypot(...q); return q.map(v => v / l) as Quat; }
  const th = Math.acos(c), sn = Math.sin(th), wa = Math.sin((1 - t) * th) / sn, wb = Math.sin(t * th) / sn * s;
  return a.map((v, i) => v * wa + b[i] * wb) as Quat;
}

// Where each level stands: a winding route round the planet, about 44° between neighbours, so the
// next level is just over the horizon. Travel ends up near Home again: the world is round.
export function levelSpots(count: number): V3[] {
  return Array.from({ length: count }, (_, i) => sphere(16 * Math.sin(i * 1.9) + 4, i * 44));
}

// The camera looks down at the planet from above and in front; the level being visited is rotated to FRONT.
const PITCH = 28 * Math.PI / 180, DIST = 4.2;
const EYE: V3 = [0, Math.sin(PITCH) * DIST, Math.cos(PITCH) * DIST];
const FWD: V3 = norm(scale(EYE, -1)), RIGHT: V3 = [1, 0, 0], UP: V3 = cross(RIGHT, FWD);
export const FRONT: V3 = norm([0, Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)]);
const ALPHA = Math.asin(1 / DIST); // the planet's angular radius as seen from the camera

// Quaternion helpers for a smooth path through every level's orientation.
const qmul = (a: Quat, b: Quat): Quat => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
const qconj = (q: Quat): Quat => [-q[0], -q[1], -q[2], q[3]];
const qlog = (q: Quat): V3 => { const s = Math.hypot(q[0], q[1], q[2]); if (s < 1e-9) return [0, 0, 0]; const k = Math.atan2(s, q[3]) / s; return [q[0] * k, q[1] * k, q[2] * k]; };
const qexp = (v: V3): Quat => { const t = Math.hypot(...v); if (t < 1e-9) return [0, 0, 0, 1]; const k = Math.sin(t) / t; return [v[0] * k, v[1] * k, v[2] * k, Math.cos(t)]; };
// A rotation matrix (as rows) to a quaternion.
function fromMatrix(m: number[][]): Quat {
  const tr = m[0][0] + m[1][1] + m[2][2];
  if (tr > 0) { const s = .5 / Math.sqrt(tr + 1); return [(m[2][1] - m[1][2]) * s, (m[0][2] - m[2][0]) * s, (m[1][0] - m[0][1]) * s, .25 / s]; }
  if (m[0][0] > m[1][1] && m[0][0] > m[2][2]) { const s = 2 * Math.sqrt(1 + m[0][0] - m[1][1] - m[2][2]); return [.25 * s, (m[0][1] + m[1][0]) / s, (m[0][2] + m[2][0]) / s, (m[2][1] - m[1][2]) / s]; }
  if (m[1][1] > m[2][2]) { const s = 2 * Math.sqrt(1 + m[1][1] - m[0][0] - m[2][2]); return [(m[0][1] + m[1][0]) / s, .25 * s, (m[1][2] + m[2][1]) / s, (m[0][2] - m[2][0]) / s]; }
  const s = 2 * Math.sqrt(1 + m[2][2] - m[0][0] - m[1][1]); return [(m[0][2] + m[2][0]) / s, (m[1][2] + m[2][1]) / s, .25 * s, (m[1][0] - m[0][1]) / s];
}
// At every level the route runs the same way across the screen: on to the right and a little back.
// So the planet always rolls the same way as you go, the next level waits on the right and the last
// one rolls away on the left, instead of the globe twisting differently at every stop.
const AHEAD: V3 = norm([.9, .35 * .5, .35 * -.866]); // tangent to the planet at FRONT
export function orientations(spots: V3[]): Quat[] {
  const qs = spots.map((p, i) => {
    const prev = spots[Math.max(0, i - 1)], next = spots[Math.min(spots.length - 1, i + 1)];
    const d = next.map((c, k) => c - prev[k]) as V3;
    const t = norm(d.map((c, k) => c - p[k] * dot(d, p)) as V3); // the route's direction here, along the ground
    const A = [p, t, cross(p, t)], B = [FRONT, AHEAD, cross(FRONT, AHEAD)];
    const m = [0, 1, 2].map(r => [0, 1, 2].map(c => B[0][r] * A[0][c] + B[1][r] * A[1][c] + B[2][r] * A[2][c]));
    return fromMatrix(m);
  });
  for (let i = 1; i < qs.length; i++) if (qs[i].reduce((s, v, k) => s + v * qs[i - 1][k], 0) < 0) qs[i] = qs[i].map(v => -v) as Quat;
  return qs;
}
// Control points so the path curves smoothly through each level instead of turning a corner there (squad).
function controls(qs: Quat[]): Quat[] {
  return qs.map((q, i) => {
    if (i === 0 || i === qs.length - 1) return q;
    const inv = qconj(q), a = qlog(qmul(inv, qs[i + 1])), b = qlog(qmul(inv, qs[i - 1]));
    return qmul(q, qexp([-(a[0] + b[0]) / 4, -(a[1] + b[1]) / 4, -(a[2] + b[2]) / 4]));
  });
}
const controlCache = new WeakMap<Quat[], Quat[]>();
export function orientationAt(qs: Quat[], pos: number): Quat {
  const i = Math.max(0, Math.min(qs.length - 2, Math.floor(pos))), t = pos - i;
  if (t < 0 || t > 1) return slerp(qs[i], qs[i + 1], t); // the give past either end
  let cs = controlCache.get(qs);
  if (!cs) { cs = controls(qs); controlCache.set(qs, cs); }
  return slerp(slerp(qs[i], qs[i + 1], t), slerp(cs[i], cs[i + 1], t), 2 * t * (1 - t));
}

export type Layout = { w: number; vw: number; h: number; cx: number; cy: number; R: number; base: number; tanH: number };
// Where the planet sits in the section: low on the right, with only its top showing. `R` is its radius
// on screen; the level at the front stands with its feet at `feet`.
// `aside` (0 to 1) moves it over to the right and shrinks it a little while a level is open beside it.
export function planetLayout(w: number, h: number, aside = 0, bleed = 0): Layout {
  const phone = w < 640, a = w >= 1024 ? aside : 0;
  const R = (phone ? w * .5 : Math.min(h * .56, w * .26)) * (1 - .3 * a);
  const cx = w * (phone ? .62 : .72 + .14 * a), feet = h * (phone ? .6 : .66 + .04 * a);
  const base = Math.min(w * (phone ? .46 : .24), h * (phone ? .4 : .44), 320) * (1 - .12 * a);
  const tanH = Math.tan(ALPHA) * (h / 2) / R;
  // Put the centre where it brings FRONT to `feet`.
  const v = FRONT.map((c, k) => c - EYE[k]) as V3;
  const lift = dot(v, UP) / (dot(v, FWD) * tanH) * (h / 2);
  return { w, vw: w + bleed, h, cx, cy: feet + lift, R, base, tanH };
}

// Screen position of a point on (or near) the planet, and how much nearer or farther it is than FRONT.
// Pixels per unit are set by the height alone, so the canvas's width doesn't change where things land.
export function project(L: Layout, p: V3) {
  const v = p.map((c, k) => c - EYE[k]) as V3;
  const z = dot(v, FWD);
  return { x: L.cx + dot(v, RIGHT) / (z * L.tanH) * L.h / 2, y: L.cy - dot(v, UP) / (z * L.tanH) * L.h / 2, z };
}
export const FRONT_DEPTH = dot(FRONT.map((c, k) => c - EYE[k]) as V3, FWD);
// How far a surface point faces the camera: below 0 it is over the horizon.
export const facing = (p: V3) => dot(p, norm(EYE.map((c, k) => c - p[k]) as V3));

// ---- The WebGL planet (three.js is loaded lazily and passed in) ----
const INK = 0x280d15, CORAL = 0xff7868, GOLD = 0xffd078;
const SUN: V3 = norm([-2, 4, 5]);

function seeded(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }

// 3D simplex noise (Ashima Arts / Stefan Gustavson, MIT licence).
const NOISE = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

// The ground, drawn like an illustrated map: paper land with an ink coastline, rose seas with contour
// lines offshore and a faint globe grid, an island under every level, a soft light, and a coral rim.
const surfaceVertex = /* glsl */`
varying vec3 vObj; varying vec3 vN; varying vec3 vV;
void main(){
  vObj = position;
  vec4 wp = modelMatrix * vec4(position, 1.);
  vN = normalize(mat3(modelMatrix) * normal);
  vV = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;
const surfaceFragment = /* glsl */`
uniform vec3 uSpots[8]; uniform vec3 uSun;
varying vec3 vObj; varying vec3 vN; varying vec3 vV;
${NOISE}
float lineAt(float d, float w){ float aa = fwidth(d); return 1. - smoothstep(w * aa, (w + 1.2) * aa, abs(d)); }
void main(){
  vec3 p = normalize(vObj);
  float h = .55 * snoise(p * 1.5 + 3.1) + .25 * snoise(p * 3.4 + 7.7) + .1 * snoise(p * 7.9);
  float isle = 0.;
  for (int i = 0; i < 8; i++) isle = max(isle, smoothstep(.93, .992, dot(p, uSpots[i])));
  h = max(h + .9 * isle, h) - .12;
  vec3 paper = vec3(.984, .953, .91), hill = vec3(.957, .902, .83);
  vec3 deep = vec3(.94, .79, .76), shallow = vec3(.975, .88, .855), ink = vec3(.157, .051, .082);
  vec3 col;
  if (h > 0.) {
    col = mix(paper, hill, smoothstep(.22, .4, h));
    col = mix(col, ink, .2 * lineAt(h - .3, .25)); // a contour on the high ground
  } else {
    col = mix(shallow, deep, smoothstep(0., -.3, h));
    col = mix(col, ink, .16 * (lineAt(h + .07, .3) + lineAt(h + .16, .3))); // ripples offshore
    float lat = asin(clamp(p.y, -1., 1.)) / .2618, lon = atan(p.x, p.z) / .2618;
    float grid = max(lineAt(fract(lat + .5) - .5, .2), lineAt(fract(lon + .5) - .5, .2));
    col = mix(col, ink, .09 * grid);
  }
  col = mix(col, ink, .9 * lineAt(h, .35)); // the coastline
  vec3 n = normalize(vN);
  col *= .82 + .26 * max(dot(n, uSun), 0.);
  float rim = pow(1. - max(dot(n, normalize(vV)), 0.), 3.);
  col = mix(col, vec3(1., .47, .41), .35 * rim);
  gl_FragColor = vec4(col, 1.);
}`;
// A coral haze just outside the rim.
const haloVertex = /* glsl */`
varying vec3 vN; varying vec3 vV;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }`;
const haloFragment = /* glsl */`
varying vec3 vN; varying vec3 vV;
void main(){ float f = pow(clamp(.62 + dot(normalize(vN), normalize(vV)), 0., 1.), 2.6); gl_FragColor = vec4(1., .47, .41, f * .55); }`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createPlanet(canvas: HTMLCanvasElement, THREE: any, spots: V3[]) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 50);
  camera.position.set(...EYE);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.AmbientLight(0xffffff, .72));
  const sun = new THREE.DirectionalLight(0xffffff, .4);
  sun.position.set(...scale(SUN, 6));
  scene.add(sun);

  const world = new THREE.Group();
  scene.add(world);
  const disposables: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

  // The ground.
  const ballGeo = keep(new THREE.SphereGeometry(1, 96, 64));
  const surface = keep(new THREE.ShaderMaterial({
    vertexShader: surfaceVertex, fragmentShader: surfaceFragment, extensions: { derivatives: true },
    uniforms: { uSpots: { value: spots.map(p => new THREE.Vector3(...p)) }, uSun: { value: new THREE.Vector3(...SUN) } },
  }));
  world.add(new THREE.Mesh(ballGeo, surface));
  // An ink outline round the edge, and a coral haze beyond it. Neither turns: they look the same whichever way the planet faces.
  const outline = new THREE.Mesh(ballGeo, keep(new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide })));
  outline.scale.setScalar(1.008);
  scene.add(outline);
  const halo = new THREE.Mesh(ballGeo, keep(new THREE.ShaderMaterial({ vertexShader: haloVertex, fragmentShader: haloFragment, side: THREE.BackSide, transparent: true, depthWrite: false })));
  halo.scale.setScalar(1.16);
  halo.renderOrder = -1;
  scene.add(halo);

  // The route between levels: a dashed line along the surface, across land and sea.
  const route: V3[] = [];
  spots.forEach((p, i) => {
    const q = spots[i + 1]; if (!q) return;
    const ang = Math.acos(Math.max(-1, Math.min(1, dot(p, q))));
    for (let k = 0; k < 24; k++) { const t = k / 24, a = Math.sin((1 - t) * ang) / Math.sin(ang), b = Math.sin(t * ang) / Math.sin(ang); route.push(norm([p[0] * a + q[0] * b, p[1] * a + q[1] * b, p[2] * a + q[2] * b])); }
  });
  route.push(spots[spots.length - 1]);
  const routeLine = new THREE.Line(keep(new THREE.BufferGeometry().setFromPoints(route.map(p => new THREE.Vector3(...scale(p, 1.004))))),
    keep(new THREE.LineDashedMaterial({ color: INK, dashSize: .035, gapSize: .03 })));
  routeLine.computeLineDistances();
  world.add(routeLine);

  // A marker at each level: an ink ring, filled coral once visited.
  const up = new THREE.Vector3(0, 0, 1), yAxis = new THREE.Vector3(0, 1, 0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const place = (obj: any, p: V3, lift: number, axis = up) => {
    obj.position.set(...scale(p, 1 + lift));
    obj.quaternion.setFromUnitVectors(axis, new THREE.Vector3(...p));
  };
  const ringGeo = keep(new THREE.RingGeometry(.05, .07, 28)), dotGeo = keep(new THREE.CircleGeometry(.05, 28));
  const inkFlat = keep(new THREE.MeshBasicMaterial({ color: INK, side: THREE.DoubleSide }));
  const coralFlat = keep(new THREE.MeshBasicMaterial({ color: CORAL, side: THREE.DoubleSide }));
  const fills = spots.map(p => {
    const r = new THREE.Mesh(ringGeo, inkFlat); place(r, p, .006); world.add(r);
    const f = new THREE.Mesh(dotGeo, coralFlat); place(f, p, .007); f.visible = false; world.add(f);
    return f;
  });

  // Little round trees on each level's island, around (not on) the spot itself.
  const rand = seeded(7);
  const crownGeo = keep(new THREE.IcosahedronGeometry(.024, 1)), trunkGeo = keep(new THREE.CylinderGeometry(.004, .005, .036, 5));
  const inkSolid = keep(new THREE.MeshLambertMaterial({ color: INK }));
  spots.forEach(s => {
    // Two directions across the surface at this spot.
    const e1 = norm(cross(s, Math.abs(s[1]) < .9 ? [0, 1, 0] : [1, 0, 0])), e2 = cross(s, e1);
    for (let n = 0; n < 6; n++) {
      const a = rand() * Math.PI * 2, r = (5 + rand() * 6) * Math.PI / 180;
      const p = norm(s.map((c, k) => c * Math.cos(r) + (e1[k] * Math.cos(a) + e2[k] * Math.sin(a)) * Math.sin(r)) as V3);
      if (route.some(q => dot(q, p) > Math.cos(2.5 * Math.PI / 180))) continue; // keep the path clear
      const tree = new THREE.Group();
      const crown = new THREE.Mesh(crownGeo, inkSolid); crown.position.y = .05; tree.add(crown);
      const trunk = new THREE.Mesh(trunkGeo, inkSolid); trunk.position.y = .018; tree.add(trunk);
      tree.scale.setScalar(.55 + rand() * .5);
      place(tree, p, 0, yAxis); world.add(tree);
    }
  });

  // A small gold moon on a tilted, dashed orbit. It keeps going round on its own.
  const sky = new THREE.Group();
  sky.rotation.set(.32, 0, -.28);
  scene.add(sky);
  const orbitPts = Array.from({ length: 160 }, (_, k) => { const a = k / 160 * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * 1.42, 0, Math.sin(a) * 1.42); });
  const orbit = new THREE.LineLoop(keep(new THREE.BufferGeometry().setFromPoints(orbitPts)), keep(new THREE.LineDashedMaterial({ color: INK, dashSize: .025, gapSize: .045, transparent: true, opacity: .45 })));
  orbit.computeLineDistances();
  sky.add(orbit);
  const moon = new THREE.Mesh(keep(new THREE.IcosahedronGeometry(.085, 2)), keep(new THREE.MeshLambertMaterial({ color: GOLD, flatShading: true })));
  const moonRim = new THREE.Mesh(moon.geometry, keep(new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide })));
  moonRim.scale.setScalar(1.12);
  moon.add(moonRim);
  sky.add(moon);

  let last: { L: Layout; q: Quat; aside: number } | null = null, size = '', frame = 0, running = false, visible = true, stale = false;
  const setMoon = (time: number) => { const a = time / 9000 * Math.PI * 2; moon.position.set(Math.cos(a) * 1.42, 0, Math.sin(a) * 1.42); moon.rotation.y = a * 2; };
  setMoon(2600);
  const paint = () => {
    if (!last) return;
    if (!visible) { stale = true; return; } // off screen: draw when it comes back
    stale = false;
    const { L, q, aside } = last;
    const key = `${L.vw}x${L.h}`;
    if (key !== size) { size = key; renderer.setSize(L.vw, L.h, false); }
    camera.aspect = L.vw / L.h;
    camera.fov = 2 * Math.atan(L.tanH) * 180 / Math.PI;
    camera.updateProjectionMatrix();
    // Shift the picture so the planet's centre lands at (cx, cy), as `project` does.
    camera.projectionMatrix.elements[8] = -(2 * L.cx / L.vw - 1);
    camera.projectionMatrix.elements[9] = -(1 - 2 * L.cy / L.h);
    world.quaternion.set(...q);
    sky.visible = aside < .5; // the orbit would run under the text of an open level
    renderer.render(scene, camera);
  };
  const loop = (time: number) => { setMoon(time); paint(); frame = requestAnimationFrame(loop); };
  return {
    render(L: Layout, q: Quat, aside = 0) { last = { L, q, aside }; if (!running) paint(); },
    // The moon only moves while the section is on screen (and motion is allowed).
    play(on: boolean) {
      if (on === running) return;
      running = on;
      if (on) frame = requestAnimationFrame(loop); else cancelAnimationFrame(frame);
    },
    setVisible(on: boolean) { visible = on; if (on && stale) paint(); },
    setVisited(visited: boolean[]) { fills.forEach((f, i) => { f.visible = visited[i]; }); if (!running) paint(); },
    dispose() { cancelAnimationFrame(frame); disposables.forEach(d => d.dispose()); renderer.dispose(); },
  };
}
