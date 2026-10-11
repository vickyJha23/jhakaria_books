import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Product } from '../data/site';

interface Props {
  products: Product[];
  selectedSlug: string;
  onSelect: (product: Product) => void;
}

const GAP_X = 1.83;
const GAP_Y = 2.72;
const CARD_W = 1.38;
const CARD_H = 2.42;

function cardShape(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function coverCanvasTexture(product: Product, reversed: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 680;
  const context = canvas.getContext('2d')!;
  const gradient = context.createLinearGradient(0, 0, 480, 680);
  gradient.addColorStop(0, reversed ? product.art.band : product.art.cover);
  gradient.addColorStop(1, product.art.band);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = product.art.accent;
  context.fillRect(35, 55, 410, 10);
  context.fillRect(35, 610, 410, 8);
  context.fillStyle = 'rgba(255,255,255,.94)';
  context.fillRect(55, 185, 370, 170);
  context.fillStyle = product.art.band;
  context.textAlign = 'center';
  context.font = '700 27px system-ui, sans-serif';
  context.fillText('JAKHARIA BOOKS', 240, 225);
  context.font = '700 31px system-ui, sans-serif';
  const words = product.name.split(' ');
  let line = '';
  let y = 275;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > 320) {
      context.fillText(line, 240, y);
      line = word;
      y += 39;
    } else line = next;
  }
  if (line) context.fillText(line, 240, y);
  context.fillStyle = 'rgba(255,255,255,.88)';
  context.font = '500 19px system-ui, sans-serif';
  context.fillText(product.pages.toUpperCase(), 240, 420);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function loadCover(src: string | undefined, product: Product, reversed: boolean) {
  if (!src) return Promise.resolve(coverCanvasTexture(product, reversed));
  return new Promise<THREE.Texture>((resolve) => {
    new THREE.TextureLoader().load(src, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      resolve(texture);
    }, undefined, () => resolve(coverCanvasTexture(product, reversed)));
  });
}

function labelTexture(product: Product) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 144;
  const context = canvas.getContext('2d')!;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#28256a';
  context.font = '700 25px system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const name = product.name;
  if (context.measureText(name).width <= 470) context.fillText(name, 256, 64);
  else {
    const words = name.split(' ');
    let first = '';
    let second = '';
    for (const word of words) {
      const next = first ? `${first} ${word}` : word;
      if (context.measureText(next).width > 470) second += `${second ? ' ' : ''}${word}`;
      else if (second) second += ` ${word}`;
      else first = next;
    }
    context.fillText(first, 256, 49);
    context.fillText(second, 256, 83);
  }
  context.fillStyle = '#875900';
  context.font = '600 18px system-ui, sans-serif';
  context.fillText(product.brand ?? product.category.toUpperCase(), 256, 119);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function ThreeProductCatalog({ products, selectedSlug, onSelect }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(selectedSlug);
  const selectRef = useRef(onSelect);
  const hoveredRef = useRef('');
  const [failed, setFailed] = useState(false);
  const [columns, setColumns] = useState(6);
  const [hovered, setHovered] = useState('');

  useEffect(() => { selectedRef.current = selectedSlug; }, [selectedSlug]);
  useEffect(() => { selectRef.current = onSelect; }, [onSelect]);

  useEffect(() => {
    const container = host.current;
    if (!container || !products.length) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      const width = container.getBoundingClientRect().width;
      setColumns(width >= 1050 ? 6 : width >= 700 ? 4 : 2);
      setFailed(true);
      return;
    }
    setFailed(false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0xffffff, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-7, 7, 4, -4, 0.1, 100);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xaaa7b8, 2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(-5, 8, 12);
    scene.add(keyLight);

    const entries: { product: Product; group: THREE.Group; backing: THREE.Mesh; book: THREE.Mesh }[] = [];
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const interactive: THREE.Object3D[] = [];
    const ownedTextures: THREE.Texture[] = [];
    let disposed = false;
    let activeColumns = 6;
    let rows = Math.ceil(products.length / activeColumns);
    const photoLoads = products.flatMap((product) => [
      loadCover(product.photo, product, false),
      loadCover(product.photoBack, product, true),
    ]);

    Promise.all(photoLoads).then((textures) => {
      ownedTextures.push(...textures);
      if (disposed) {
        textures.forEach((texture) => texture.dispose());
        return;
      }

      products.forEach((product, index) => {
        const group = new THREE.Group();
        group.position.set(
          ((index % activeColumns) - (activeColumns - 1) / 2) * GAP_X,
          ((rows - 1) / 2 - Math.floor(index / activeColumns)) * GAP_Y,
          0,
        );
        const selected = product.slug === selectedRef.current;
        const backing = new THREE.Mesh(
          new THREE.ExtrudeGeometry(cardShape(CARD_W, CARD_H, 0.19), {
            depth: 0.035,
            bevelEnabled: true,
            bevelSegments: 3,
            steps: 1,
            bevelSize: 0.012,
            bevelThickness: 0.012,
          }),
          new THREE.MeshStandardMaterial({
            color: selected ? 0xfff6e6 : 0xffffff,
            roughness: 0.78,
          }),
        );
        backing.position.z = -0.06;
        group.add(backing);

        const front = textures[index * 2];
        const back = textures[index * 2 + 1];
        const image = front.image as { width?: number; height?: number } | undefined;
        const coverRatio = image?.width && image.height ? image.width / image.height : 0.68;
        const bookWidth = coverRatio >= 0.8 ? 1.08 : 1.35 * coverRatio;
        const bookHeight = bookWidth / coverRatio;
        const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0xf0ede7, roughness: 0.9 });
        const frontMaterial = new THREE.MeshBasicMaterial({ map: front, side: THREE.FrontSide });
        const backMaterial = new THREE.MeshBasicMaterial({ map: back, side: THREE.FrontSide });
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(bookWidth, bookHeight, 0.09),
          [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, frontMaterial, backMaterial],
        );
        book.position.set(0, 0.22, 0.075);
        book.userData.slug = product.slug;
        group.add(book);
        interactive.push(book);

        const label = new THREE.Mesh(
          new THREE.PlaneGeometry(1.2, 0.34),
          new THREE.MeshBasicMaterial({ map: labelTexture(product), transparent: true, depthWrite: false }),
        );
        ownedTextures.push((label.material as THREE.MeshBasicMaterial).map!);
        label.position.set(0, -0.86, 0.08);
        group.add(label);
        group.userData.slug = product.slug;
        group.userData.targetY = selected ? -0.12 : 0;
        group.rotation.y = selected ? -0.12 : 0;
        scene.add(group);
        entries.push({ product, group, backing, book });
      });
    });

    const resize = () => {
      const { width } = container.getBoundingClientRect();
      if (!width) return;
      activeColumns = width >= 1050 ? 6 : width >= 700 ? 4 : 2;
      rows = Math.ceil(products.length / activeColumns);
      setColumns(activeColumns);
      const height = Math.max(300, rows * 300 + 8);
      container.style.height = `${height}px`;
      renderer.setSize(width, height, false);
      const aspect = width / height;
      const gridWidth = (activeColumns - 1) * GAP_X + CARD_W + 0.34;
      const gridHeight = (rows - 1) * GAP_Y + CARD_H + 0.34;
      const viewHeight = Math.max(gridHeight, gridWidth / aspect);
      camera.left = -(viewHeight * aspect) / 2;
      camera.right = (viewHeight * aspect) / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();
      if (entries.length) {
        entries.forEach(({ product, group }, index) => {
          group.position.x = ((index % activeColumns) - (activeColumns - 1) / 2) * GAP_X;
          group.position.y = ((rows - 1) / 2 - Math.floor(index / activeColumns)) * GAP_Y;
          group.userData.slug = product.slug;
        });
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const setPointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(interactive, false)[0]?.object;
      const slug = typeof hit?.userData.slug === 'string' ? hit.userData.slug : '';
      hoveredRef.current = slug;
      setHovered((current) => current === slug ? current : slug);
      renderer.domElement.style.cursor = slug ? 'pointer' : 'default';
      return slug;
    };
    const pointerMove = (event: PointerEvent) => { setPointer(event); };
    const pointerLeave = () => {
      hoveredRef.current = '';
      setHovered('');
      renderer.domElement.style.cursor = 'default';
    };
    const pointerClick = (event: PointerEvent) => {
      const slug = setPointer(event);
      const product = products.find((item) => item.slug === slug);
      if (product) selectRef.current(product);
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const index = products.findIndex((product) => product.slug === selectedRef.current);
      const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + products.length) % products.length;
      selectRef.current(products[next]);
    };
    renderer.domElement.addEventListener('pointermove', pointerMove);
    renderer.domElement.addEventListener('pointerleave', pointerLeave);
    renderer.domElement.addEventListener('click', pointerClick);
    renderer.domElement.addEventListener('keydown', keyDown);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const time = performance.now() * 0.0008;
      entries.forEach(({ product, group, backing, book }, index) => {
        const isHovered = hoveredRef.current === product.slug;
        const isSelected = selectedRef.current === product.slug;
        const target = isHovered ? -0.25 : isSelected ? -0.12 : 0;
        group.rotation.y += (target - group.rotation.y) * 0.09;
        group.position.z = (isHovered ? 0.16 : isSelected ? 0.08 : 0) + Math.sin(time + index) * 0.012;
        const material = backing.material as THREE.MeshStandardMaterial;
        material.color.lerp(new THREE.Color(isSelected ? 0xfff4df : 0xffffff), 0.09);
        book.scale.setScalar(isHovered ? 1.055 : 1);
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener('pointermove', pointerMove);
      renderer.domElement.removeEventListener('pointerleave', pointerLeave);
      renderer.domElement.removeEventListener('click', pointerClick);
      renderer.domElement.removeEventListener('keydown', keyDown);
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      ownedTextures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [products]);

  useEffect(() => {
    const container = host.current;
    const canvas = container?.querySelector('canvas');
    if (!canvas || failed) return;
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'application');
    canvas.setAttribute('aria-label', `3D catalogue with ${products.length} products. Use left and right arrow keys to select a product.`);
  }, [columns, failed, products.length]);

  const selected = products.find((product) => product.slug === selectedSlug);
  const shownName = hovered ? products.find((product) => product.slug === hovered)?.name : selected?.name;

  return (
    <div className="three-catalogue-wrap">
      <div className={`three-catalogue ${failed ? 'is-fallback' : ''}`} ref={host} style={{ minHeight: `${Math.max(1, Math.ceil(products.length / columns)) * 300 + 8}px` }}>
        {failed && (
          <div className="three-catalogue-fallback" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {products.map((product) => (
              <button type="button" key={product.slug} className={`three-fallback-card ${selectedSlug === product.slug ? 'is-selected' : ''}`} onClick={() => onSelect(product)}>
                <div className="three-fallback-cover">
                  {product.photo ? <img src={product.photo} alt="" /> : <span>{product.name}</span>}
                </div>
                <strong>{product.name}</strong>
                <small>{product.brand ?? product.category}</small>
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="three-catalogue-status" aria-live="polite">{hovered ? 'Previewing' : 'Selected'}: <strong>{shownName}</strong> <span>· Hover to preview, click to select, or use the arrow keys</span></p>
    </div>
  );
}
