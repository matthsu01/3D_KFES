import * as THREE from "three";

const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * A single-storey facade tile. A warm stone base, deep teal glazing and
 * cream mullions keep every building legible while sharing one visual language.
 */
export function getFacadeTexture(wall: string, glass: string, count: number) {
  const windows = Math.max(2, Math.round(count));
  const key = `${wall}-${glass}-${windows}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = Math.min(2048, Math.max(320, windows * 92));
  canvas.height = 160;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // softly lit upper band and grounded lower band
  const wash = ctx.createLinearGradient(0, 0, 0, canvas.height);
  wash.addColorStop(0, "rgba(255,255,255,0.22)");
  wash.addColorStop(0.35, "rgba(255,255,255,0.02)");
  wash.addColorStop(1, "rgba(72,52,37,0.10)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gap = canvas.width / windows;
  const margin = Math.max(11, gap * 0.17);
  const winWidth = gap - margin * 2;
  const top = 30;
  const winHeight = 94;

  for (let i = 0; i < windows; i += 1) {
    const x = i * gap + margin;

    // recessed frame
    ctx.fillStyle = "rgba(74,60,45,0.14)";
    ctx.fillRect(x - 4, top - 4, winWidth + 8, winHeight + 8);

    // glass
    const glassGradient = ctx.createLinearGradient(x, top, x + winWidth, top + winHeight);
    glassGradient.addColorStop(0, glass);
    glassGradient.addColorStop(0.52, "#537778");
    glassGradient.addColorStop(1, "#2e4e53");
    ctx.fillStyle = glassGradient;
    ctx.fillRect(x, top, winWidth, winHeight);

    // glazing reflection
    ctx.fillStyle = "rgba(227,241,232,0.20)";
    ctx.beginPath();
    ctx.moveTo(x + winWidth * 0.12, top + winHeight);
    ctx.lineTo(x + winWidth * 0.52, top);
    ctx.lineTo(x + winWidth * 0.72, top);
    ctx.lineTo(x + winWidth * 0.32, top + winHeight);
    ctx.closePath();
    ctx.fill();

    // mullions
    ctx.fillStyle = "rgba(243,237,223,0.88)";
    ctx.fillRect(x + winWidth * 0.5 - 1.5, top, 3, winHeight);
    ctx.fillRect(x, top + winHeight * 0.56, winWidth, 3);

    // sill
    ctx.fillStyle = "rgba(255,255,255,0.58)";
    ctx.fillRect(x - 5, top + winHeight + 4, winWidth + 10, 5);
    ctx.fillStyle = "rgba(87,65,48,0.13)";
    ctx.fillRect(x - 5, top + winHeight + 9, winWidth + 10, 2);
  }

  // subtle vertical pilasters
  for (let i = 0; i <= windows; i += 1) {
    ctx.fillStyle = "rgba(255,255,255,0.20)";
    ctx.fillRect(i * gap - 1, 0, 2, canvas.height);
  }

  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.fillRect(0, 4, canvas.width, 3);
  ctx.fillStyle = "rgba(72,53,39,0.12)";
  ctx.fillRect(0, canvas.height - 6, canvas.width, 6);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  textureCache.set(key, texture);
  return texture;
}

export function makeCircularTexture(wall: string, glass: string) {
  const texture = getFacadeTexture(wall, glass, 16).clone();
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(2.3, 1);
  texture.needsUpdate = true;
  return texture;
}

export const LEAF_GEOMETRY = new THREE.IcosahedronGeometry(1, 1);
export const TRUNK_GEOMETRY = new THREE.CylinderGeometry(0.17, 0.28, 1.9, 6);
