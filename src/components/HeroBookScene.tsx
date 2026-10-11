import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import type { Product } from '../data/site';
import NotebookArt from './NotebookArt';
import { Factory, Sparkle } from './Icons';

interface Props {
  books: Product[];
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function HeroBookScene({ books }: Props) {
  const host = useRef<HTMLDivElement>(null);
  // Decide up front whether WebGL exists, so the flat fallback renders on the first pass.
  const [failed, setFailed] = useState(() => !supportsWebGL());

  useEffect(() => {
    const container = host.current;
    if (!container || failed) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      // WebGL reported support but the context still failed — switch to the fallback after this effect.
      queueMicrotask(() => setFailed(true));
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.insertBefore(renderer.domElement, container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
    camera.position.set(0, 0, 9.5);
    scene.add(new THREE.HemisphereLight(0xfff8ec, 0x55517d, 2.2));
    const key = new THREE.DirectionalLight(0xffefd0, 3.3);
    key.position.set(-4, 5, 7);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xb5b2ff, 1.4);
    fill.position.set(4, -1, 5);
    scene.add(fill);

    const layouts = [
      { x: -1.48, y: -0.08, z: -0.5, scale: 0.85, rz: -0.055, ry: 0.09 },
      { x: 1.5, y: -0.02, z: -0.75, scale: 0.83, rz: 0.055, ry: -0.1 },
      { x: 0.02, y: 0.02, z: 0.25, scale: 1, rz: -0.015, ry: 0.025 },
    ];
    const groups: THREE.Group[] = [];
    const textures: THREE.Texture[] = [];
    const motion = gsap.matchMedia();
    let disposed = false;
    let frame = 0;

    const textureLoader = new THREE.TextureLoader();
    Promise.all(books.map((product) => new Promise<THREE.Texture>((resolve) => {
      const fallback = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = 680;
        const context = canvas.getContext('2d')!;
        context.fillStyle = product.art.cover;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = product.art.band;
        context.fillRect(0, 0, 34, canvas.height);
        context.fillStyle = product.art.accent;
        context.fillRect(62, 100, 340, 16);
        context.fillStyle = '#fff';
        context.textAlign = 'center';
        context.font = '700 30px system-ui, sans-serif';
        context.fillText('JAKHARIA BOOKS', 265, 265);
        context.font = '700 35px system-ui, sans-serif';
        product.name.split(' ').slice(0, 3).forEach((word, index) => context.fillText(word, 265, 325 + index * 46));
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        resolve(texture);
      };
      if (!product.photo) return fallback();
      textureLoader.load(product.photo, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        resolve(texture);
      }, undefined, fallback);
    }))).then((loadedTextures) => {
      textures.push(...loadedTextures);
      if (disposed) {
        loadedTextures.forEach((texture) => texture.dispose());
        return;
      }
      books.forEach((product, index) => {
        const group = new THREE.Group();
        const layout = layouts[index] ?? layouts[2];
        group.position.set(layout.x, layout.y - 0.55, layout.z);
        group.scale.setScalar(layout.scale * 0.92);
        group.rotation.set(-0.04, layout.ry, layout.rz);

        const pageBlock = new THREE.Mesh(
          new THREE.BoxGeometry(2.18, 3.12, 0.2),
          new THREE.MeshStandardMaterial({ color: 0xfffcf5, roughness: 0.92 }),
        );
        group.add(pageBlock);
        const cover = new THREE.Mesh(
          new THREE.BoxGeometry(2.22, 3.16, 0.07),
          [
            new THREE.MeshStandardMaterial({ color: product.art.band, roughness: 0.75 }),
            new THREE.MeshStandardMaterial({ color: product.art.band, roughness: 0.75 }),
            new THREE.MeshStandardMaterial({ color: product.art.band, roughness: 0.75 }),
            new THREE.MeshStandardMaterial({ color: product.art.band, roughness: 0.75 }),
            new THREE.MeshStandardMaterial({ map: loadedTextures[index], roughness: 0.64 }),
            new THREE.MeshStandardMaterial({ color: product.art.cover, roughness: 0.75 }),
          ],
        );
        cover.position.z = 0.125;
        group.add(cover);
        scene.add(group);
        groups.push(group);
      });

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        motion.add('(prefers-reduced-motion: no-preference)', () => {
          gsap.fromTo(groups.map((group) => group.position),
            { y: -0.48, z: -1.2 },
            { y: (index) => layouts[index]?.y ?? 0, z: (index) => layouts[index]?.z ?? 0, duration: 1.5, stagger: 0.12, ease: 'power3.out', delay: 0.1 },
          );
          groups.forEach((group, index) => {
            gsap.to(group.position, {
              y: (layouts[index]?.y ?? 0) + 0.045,
              duration: 3.2 + index * 0.35,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
              delay: 1.5 + index * 0.2,
            });
            gsap.to(group.rotation, {
              y: (layouts[index]?.ry ?? 0) + 0.025,
              duration: 4.3 + index * 0.5,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
            });
          });
        });
      }
    });

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 500 ? 10.5 : 9.5;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const onPointerMove = (event: PointerEvent) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      groups.forEach((group, index) => {
        const layout = layouts[index] ?? layouts[2];
        gsap.to(group.rotation, {
          x: -0.04 - y * 0.035,
          y: layout.ry + x * 0.065,
          duration: 0.85,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      });
    };
    const onPointerLeave = () => {
      groups.forEach((group, index) => {
        const layout = layouts[index] ?? layouts[2];
        gsap.to(group.rotation, { x: -0.04, y: layout.ry, duration: 1.2, ease: 'power3.out', overwrite: 'auto' });
      });
    };
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    const render = () => {
      frame = requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      motion.revert();
      groups.forEach((group) => gsap.killTweensOf([group.position, group.rotation]));
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [books, failed]);

  return (
    <div className={`hero-art ${failed ? 'is-fallback' : ''}`} ref={host} role="img" aria-label="Three Jakharia notebook covers rendered in 3D">
      {failed && books.map((product, index) => (
        <div key={product.slug} className={`hero-book hero-book--${index === 2 ? 'front' : index === 0 ? 'mid' : 'back'}`}>
          <NotebookArt product={product} height="clamp(190px, 27vw, 390px)" eager />
        </div>
      ))}
      <div className="hero-visual-chip hero-chip--a"><Sparkle size={18} /> 58–70 GSM paper</div>
      <div className="hero-visual-chip hero-chip--b"><Factory size={18} /> Own manufacturing unit</div>
    </div>
  );
}
