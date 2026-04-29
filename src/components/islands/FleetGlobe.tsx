import { useEffect, useRef, useState, useCallback } from 'preact/hooks';

interface Props {
  locale?: 'de' | 'en';
  endpoint?: string;
}

interface Position {
  lat: number;
  lng: number;
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

export default function FleetGlobe({ locale = 'de', endpoint = '/api/fleet-positions' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<{ update: (state: Record<string, unknown>) => void; destroy: () => void } | null>(null);
  const rafRef = useRef<number>(0);
  const phiRef = useRef(4.54);
  const thetaRef = useRef(0.87);
  const scaleRef = useRef(1.1);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startPhi: 0, startTheta: 0 });
  const velocityRef = useRef({ phi: 0, theta: 0 });
  const pinchRef = useRef({ active: false, startDist: 0, startScale: 1 });
  const positionsRef = useRef<Position[]>([]);
  const [hasWebGL, setHasWebGL] = useState(true);

  const fetchPositions = useCallback(async () => {
    if (!endpoint) return;
    try {
      const res = await fetch(endpoint);
      if (!res.ok) return;
      const data = await res.json() as { positions: Position[]; count: number };
      positionsRef.current = data.positions;
    } catch {
      // Globe keeps spinning, just no markers
    }
  }, [endpoint]);

  useEffect(() => {
    if (!supportsWebGL()) {
      setHasWebGL(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let destroyed = false;
    let pollInterval: ReturnType<typeof setInterval> | undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 640;
    const size = isMobile ? 350 : 700;

    canvas.width = size * Math.min(window.devicePixelRatio, 2);
    canvas.height = size * Math.min(window.devicePixelRatio, 2);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    // Pointer drag handlers
    const sensitivity = 0.005;
    let lastMoveX = 0;
    let lastMoveY = 0;

    function onPointerDown(e: PointerEvent) {
      canvas!.setPointerCapture(e.pointerId);
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        startPhi: phiRef.current,
        startTheta: thetaRef.current,
      };
      velocityRef.current = { phi: 0, theta: 0 };
      lastMoveX = e.clientX;
      lastMoveY = e.clientY;
      canvas!.style.cursor = 'grabbing';
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      phiRef.current = dragRef.current.startPhi - dx * sensitivity;
      thetaRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2,
        dragRef.current.startTheta + dy * sensitivity
      ));
      velocityRef.current = {
        phi: (lastMoveX - e.clientX) * sensitivity,
        theta: (e.clientY - lastMoveY) * sensitivity,
      };
      lastMoveX = e.clientX;
      lastMoveY = e.clientY;
    }

    function onPointerUp(e: PointerEvent) {
      dragRef.current.active = false;
      canvas!.releasePointerCapture(e.pointerId);
      canvas!.style.cursor = 'grab';
    }

    // Scroll wheel zoom
    const MIN_SCALE = 0.9;
    const MAX_SCALE = 1.15;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.02 : 0.02;
      scaleRef.current = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scaleRef.current + delta));
    }

    // Pinch-to-zoom tracking
    const activePointers = new Map<number, PointerEvent>();
    function getPointerDist(): number {
      const pts = [...activePointers.values()];
      if (pts.length < 2) return 0;
      const dx = pts[0].clientX - pts[1].clientX;
      const dy = pts[0].clientY - pts[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    const origPointerDown = onPointerDown;
    onPointerDown = (e: PointerEvent) => {
      activePointers.set(e.pointerId, e);
      if (activePointers.size === 2) {
        pinchRef.current = { active: true, startDist: getPointerDist(), startScale: scaleRef.current };
        dragRef.current.active = false;
      } else if (activePointers.size === 1) {
        origPointerDown(e);
      }
    };

    const origPointerMove = onPointerMove;
    onPointerMove = (e: PointerEvent) => {
      activePointers.set(e.pointerId, e);
      if (pinchRef.current.active && activePointers.size === 2) {
        const dist = getPointerDist();
        const ratio = dist / pinchRef.current.startDist;
        scaleRef.current = Math.max(MIN_SCALE, Math.min(MAX_SCALE, pinchRef.current.startScale * ratio));
      } else if (!pinchRef.current.active) {
        origPointerMove(e);
      }
    };

    const origPointerUp = onPointerUp;
    onPointerUp = (e: PointerEvent) => {
      activePointers.delete(e.pointerId);
      if (activePointers.size < 2) pinchRef.current.active = false;
      origPointerUp(e);
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.style.cursor = 'grab';
    canvas.style.touchAction = 'none';

    async function init() {
      const createGlobe = (await import('cobe')).default;
      if (destroyed) return;

      await fetchPositions();

      const globe = createGlobe(canvas!, {
        devicePixelRatio: Math.min(window.devicePixelRatio, 2),
        width: size * Math.min(window.devicePixelRatio, 2),
        height: size * Math.min(window.devicePixelRatio, 2),
        phi: phiRef.current,
        theta: thetaRef.current,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.3, 0.3, 0.4],
        markerColor: [1.0, 0.6, 0.2],
        glowColor: [0.15, 0.15, 0.25],
        markers: positionsRef.current.map((p) => ({
          location: [p.lat, p.lng] as [number, number],
          size: 0.035,
        })),
      });

      globeRef.current = globe;

      function animate() {
        if (destroyed) return;
        if (!dragRef.current.active) {
          // Apply momentum decay after drag release
          if (Math.abs(velocityRef.current.phi) > 0.0001) {
            phiRef.current += velocityRef.current.phi;
            velocityRef.current.phi *= 0.95;
          } else if (!prefersReducedMotion) {
            phiRef.current += 0.001;
          }
          if (Math.abs(velocityRef.current.theta) > 0.0001) {
            thetaRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2,
              thetaRef.current + velocityRef.current.theta
            ));
            velocityRef.current.theta *= 0.95;
          }
        }
        globe.update({
          phi: phiRef.current,
          theta: thetaRef.current,
          scale: scaleRef.current,
          markers: positionsRef.current.map((p) => ({
            location: [p.lat, p.lng] as [number, number],
            size: 0.035,
          })),
        });
        rafRef.current = requestAnimationFrame(animate);
      }
      rafRef.current = requestAnimationFrame(animate);

      pollInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchPositions();
        }
      }, 60_000);
    }

    init();

    const cleanup = () => {
      destroyed = true;
      cancelAnimationFrame(rafRef.current);
      if (pollInterval) clearInterval(pollInterval);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
    };

    document.addEventListener('astro:before-swap', cleanup, { once: true });

    return () => {
      cleanup();
      document.removeEventListener('astro:before-swap', cleanup);
    };
  }, [fetchPositions]);

  if (!hasWebGL) {
    return (
      <div class="flex flex-col items-center justify-center" style={{ width: '300px', height: '300px' }}>
        <div class="rounded-full bg-gray-800 flex items-center justify-center" style={{ width: '200px', height: '200px' }}>
          <span class="text-2xl text-blue-400 font-bold">🌐</span>
        </div>
      </div>
    );
  }

  return (
    <div class="relative flex flex-col items-center" style={{ minHeight: '300px' }}>
      <canvas
        ref={canvasRef}
        class="max-w-full"
        width={700}
        height={700}
        style={{ width: '700px', height: '700px', maxWidth: '100%', aspectRatio: '1' }}
      />
    </div>
  );
}
