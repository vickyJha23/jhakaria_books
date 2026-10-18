import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import NotebookArt from './NotebookArt';
import { bySlug } from '../data/site';

export interface StoryPage {
  no: string;
  title: string;
  note: string;
}

interface Props {
  /** One page per story chapter; the first is visible once the cover opens. */
  pages: StoryPage[];
  /** The scrolling section that drives the book (0 → 1 as it is read). */
  trackRef: React.RefObject<HTMLElement | null>;
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ---------- Canvas textures ---------- */

const W = 3;      // book width (world units)
const H = 4;      // book height
const TEX_W = 768;
const TEX_H = 1024;

function ruledPage(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#fffdf7';
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  ctx.strokeStyle = 'rgba(64, 88, 160, .22)';
  ctx.lineWidth = 2;
  for (let y = 150; y < TEX_H - 40; y += 46) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(TEX_W, y); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(224, 98, 92, .6)';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(108, 0); ctx.lineTo(108, TEX_H); ctx.stroke();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, lh: number) {
  const words = text.split(' ');
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > max && line) { ctx.fillText(line, x, y); line = w; y += lh; } else line = test;
  }
  if (line) ctx.fillText(line, x, y);
}

function pageTexture(page: StoryPage | null): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = TEX_W; canvas.height = TEX_H;
  const ctx = canvas.getContext('2d')!;
  ruledPage(ctx);
  if (page) {
    ctx.fillStyle = 'rgba(242, 159, 0, .9)';
    ctx.font = '700 120px Fraunces, Georgia, serif';
    ctx.fillText(page.no, 140, 132);
    ctx.fillStyle = '#28256a';
    ctx.font = 'italic 600 58px Fraunces, Georgia, serif';
    wrap(ctx, page.title, 140, 236, TEX_W - 190, 92);
    ctx.fillStyle = '#3b3a5c';
    ctx.font = 'italic 400 34px Fraunces, Georgia, serif';
    wrap(ctx, page.note, 140, 420, TEX_W - 190, 46);
    // A small hand-drawn tick, like a teacher's mark
    ctx.strokeStyle = 'rgba(193, 39, 45, .8)';
    ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(560, 880); ctx.lineTo(600, 920); ctx.lineTo(680, 820); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function insideCoverTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = TEX_W; canvas.height = TEX_H;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, TEX_W, TEX_H);
  g.addColorStop(0, '#2c2970'); g.addColorStop(1, '#1d1a50');
  ctx.fillStyle = g; ctx.fillRect(0, 0, TEX_W, TEX_H);
  ctx.strokeStyle = 'rgba(242, 159, 0, .5)'; ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, TEX_W - 96, TEX_H - 96);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f29f00';
  ctx.font = '700 64px Fraunces, Georgia, serif';
  ctx.fillText('Jakharia Books', TEX_W / 2, 430);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 400 42px Fraunces, Georgia, serif';
  ctx.fillText('Quality Speaks Itself', TEX_W / 2, 510);
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.font = '600 26px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('VAPI · GUJARAT', TEX_W / 2, 600);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ---------- Component ---------- */

/**
 * A hardcover notebook in Three.js that opens and turns its pages as the
 * "Our story" section is scrolled — one page per chapter. Falls back to a
 * flat cover where WebGL is unavailable.
 */
export default function AboutNotebook3D({ pages, trackRef }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(() => !supportsWebGL());
  const coverProduct = bySlug('a4-exercise-book');

  useEffect(() => {
    const container = host.current;
    if (!container || failed) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      queueMicrotask(() => setFailed(true));
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, -1.2, 11);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xfff8ec, 0x4a4775, 1.9));
    const key = new THREE.DirectionalLight(0xfff0d8, 2.6);
    key.position.set(-3, 5, 9);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -7; key.shadow.camera.right = 7;
    key.shadow.camera.top = 6; key.shadow.camera.bottom = -6;
    scene.add(key);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

    // Soft shadow catcher under the book
    const ground = new THREE.Mesh(track(new THREE.PlaneGeometry(30, 30)), track(new THREE.ShadowMaterial({ opacity: 0.18 })));
    ground.position.z = -0.25;
    ground.receiveShadow = true;
    scene.add(ground);

    const book = new THREE.Group();
    book.rotation.set(-0.42, 0.18, 0.06);
    scene.add(book);

    const paperEdge = track(new THREE.MeshStandardMaterial({ color: 0xf6f1e4, roughness: 0.95 }));
    const boardMat = track(new THREE.MeshStandardMaterial({ color: 0x1d1a50, roughness: 0.6 }));

    // Back board + page block
    const back = new THREE.Mesh(track(new THREE.BoxGeometry(W, H, 0.06)), boardMat);
    back.position.set(0, 0, -0.03);
    back.castShadow = true;
    book.add(back);
    const blockTex = track(pageTexture(null));
    const block = new THREE.Mesh(track(new THREE.BoxGeometry(W - 0.06, H - 0.08, 0.22)), [
      paperEdge, paperEdge, paperEdge, paperEdge,
      track(new THREE.MeshStandardMaterial({ map: blockTex, roughness: 0.9 })), paperEdge,
    ]);
    block.position.set(0.02, 0, 0.11);
    block.castShadow = true;
    book.add(block);

    // Turnable sheets, hinged at the spine (x = -W/2). Sheet k shows chapter k on its front.
    const sheets: THREE.Group[] = [];
    pages.forEach((page, k) => {
      const pivot = new THREE.Group();
      pivot.position.set(-W / 2 + 0.03, 0, 0.225 + (pages.length - k) * 0.004);
      const geo = track(new THREE.PlaneGeometry(W - 0.08, H - 0.1));
      geo.translate((W - 0.08) / 2, 0, 0);
      const front = new THREE.Mesh(geo, track(new THREE.MeshStandardMaterial({ map: track(pageTexture(page)), roughness: 0.92, side: THREE.FrontSide })));
      const backFace = new THREE.Mesh(geo, track(new THREE.MeshStandardMaterial({ map: blockTex, roughness: 0.92, side: THREE.BackSide })));
      front.castShadow = true;
      pivot.add(front, backFace);
      book.add(pivot);
      sheets.push(pivot);
    });

    // Front cover, hinged at the spine, photo outside and brand plate inside
    const coverPivot = new THREE.Group();
    coverPivot.position.set(-W / 2, 0, 0.26);
    const coverGeo = track(new THREE.BoxGeometry(W, H, 0.06));
    coverGeo.translate(W / 2, 0, 0);
    const insideMat = track(new THREE.MeshStandardMaterial({ map: track(insideCoverTexture()), roughness: 0.55 }));
    const outsideMat = track(new THREE.MeshStandardMaterial({ color: 0x24224f, roughness: 0.5 }));
    const cover = new THREE.Mesh(coverGeo, [boardMat, boardMat, boardMat, boardMat, outsideMat, insideMat]);
    cover.castShadow = true;
    coverPivot.add(cover);
    book.add(coverPivot);
    if (coverProduct.photo) {
      new THREE.TextureLoader().load(coverProduct.photo, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        track(tex);
        outsideMat.map = tex; outsideMat.color.set(0xffffff); outsideMat.needsUpdate = true;
      });
    }
    // Stitch line down the spine
    const stitches = new THREE.Mesh(track(new THREE.BoxGeometry(0.05, H - 0.2, 0.02)), track(new THREE.MeshStandardMaterial({ color: 0xf29f00 })));
    stitches.position.set(0.12, 0, 0.035);
    coverPivot.add(stitches);

    // Redraw text once the web fonts have loaded, so the canvas uses Fraunces
    document.fonts?.ready.then(() => {
      sheets.forEach((pivot, k) => {
        const mesh = pivot.children[0] as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
        const fresh = track(pageTexture(pages[k]));
        mesh.material.map = fresh; mesh.material.needsUpdate = true;
      });
      insideMat.map = track(insideCoverTexture()); insideMat.needsUpdate = true;
    });

    /* ----- Sizing ----- */
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Keep the open spread (2 × W) inside the frame on narrow stages
      camera.position.z = width / height < 1.15 ? 12.5 / (width / height) : 11.5;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    /* ----- Input ----- */
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width - 0.5;
      pointer.y = (e.clientY - r.top) / r.height - 0.5;
    };
    if (!reduced) container.addEventListener('pointermove', onPointer);

    const progress = () => {
      const el = trackRef.current;
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      return Math.min(1, Math.max(0, (vh * 0.55 - r.top) / Math.max(1, r.height - vh * 0.5)));
    };

    /* ----- Loop (paused while off screen) ----- */
    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(container);

    const state = { cover: 0, turns: sheets.map(() => 0) };
    let frame = 0;
    const turnSpan = 0.75 / Math.max(1, pages.length - 1);
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      const p = progress();
      const ease = reduced ? 1 : 0.08;
      state.cover += (smooth(0.02, 0.18, p) - state.cover) * ease;
      sheets.forEach((_, k) => {
        // The last sheet stays down: it is the page for the final chapter.
        const target = k < sheets.length - 1 ? smooth(0.22 + k * turnSpan, 0.22 + (k + 0.7) * turnSpan, p) : 0;
        state.turns[k] += (target - state.turns[k]) * ease;
      });

      coverPivot.rotation.y = -Math.PI * 0.97 * state.cover;
      sheets.forEach((pivot, k) => {
        const t = state.turns[k];
        pivot.rotation.y = -Math.PI * (0.94 - k * 0.012) * t;
        pivot.position.z = 0.225 + (pages.length - k) * 0.004 + Math.sin(t * Math.PI) * 0.35;
      });
      // Slide the book right as it opens so the spread stays centred
      book.position.x = (W / 2) * state.cover;
      book.rotation.y = 0.18 - 0.14 * state.cover + pointer.x * 0.25;
      book.rotation.x = -0.42 + pointer.y * 0.18;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      container.removeEventListener('pointermove', onPointer);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [failed, pages, trackRef, coverProduct.photo]);

  return (
    <div className={`nb3d ${failed ? 'is-fallback' : ''}`} ref={host} role="img" aria-label="A Jakharia notebook opening page by page as the story is read">
      {failed && <NotebookArt product={coverProduct} height="min(360px, 60vw)" />}
    </div>
  );
}
