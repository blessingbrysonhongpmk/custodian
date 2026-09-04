import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TreeStatus } from '../types/custodia';
import { RotateCw, Sparkles, Sun, ShieldAlert, CheckCircle2, TreePine } from 'lucide-react';

interface Tree3DViewerProps {
  growthStage?: 1 | 2 | 3 | 4 | 5;
  status?: TreeStatus;
  heightCm?: number;
  speciesName?: string;
  tamilName?: string;
  onStageChange?: (stage: 1 | 2 | 3 | 4 | 5) => void;
  interactive?: boolean;
}

export const Tree3DViewer: React.FC<Tree3DViewerProps> = ({
  growthStage = 3,
  status = 'healthy',
  heightCm = 118,
  speciesName = 'Neem (Azadirachta indica)',
  tamilName = 'வேம்பு',
  onStageChange,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(growthStage);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  useEffect(() => {
    setActiveStage(growthStage);
  }, [growthStage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 360;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.2, 5.8);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    sunLight.position.set(5, 10, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.65);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // 5. Main Root Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Stage scaling factor
    const stageScales = [0.45, 0.7, 0.95, 1.25, 1.55];
    const currentScale = stageScales[activeStage - 1];

    let animatedFoliage: THREE.Object3D | null = null;

    // ══════════════════════════════════════════════════════
    // 🌳 BOTANICAL TREE TWIN
    // ══════════════════════════════════════════════════════
    const soilGeo = new THREE.CylinderGeometry(1.6, 1.9, 0.35, 32);
    const soilMat = new THREE.MeshStandardMaterial({
      color: status === 'failed' ? 0x8b7355 : 0x4a3728,
      roughness: 0.9,
    });
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.position.y = -0.17;
    soilMesh.receiveShadow = true;
    modelGroup.add(soilMesh);

    const trunkHeight = 1.6 * currentScale;
    const trunkGeo = new THREE.CylinderGeometry(0.06 * currentScale, 0.16 * currentScale, trunkHeight, 16);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: status === 'failed' ? 0x57534e : 0x5c4033,
      roughness: 0.85,
    });
    const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
    trunkMesh.position.y = trunkHeight / 2;
    modelGroup.add(trunkMesh);

    const foliageGroup = new THREE.Group();
    foliageGroup.position.y = trunkHeight * 0.85;

    const clusterCount = activeStage === 1 ? 4 : activeStage === 2 ? 8 : activeStage === 3 ? 14 : activeStage === 4 ? 22 : 32;
    const foliageGeo = new THREE.DodecahedronGeometry(0.35 * currentScale, 1);
    const leafColor = status === 'at-risk' ? 0xf59e0b : status === 'failed' ? 0x78716c : 0x10b981;
    const foliageMat = new THREE.MeshStandardMaterial({ color: leafColor, roughness: 0.7, flatShading: true });

    for (let i = 0; i < clusterCount; i++) {
      const cluster = new THREE.Mesh(foliageGeo, foliageMat);
      const angle = Math.random() * Math.PI * 2;
      const spread = (Math.random() * 0.7 + 0.2) * currentScale;
      cluster.position.set(Math.cos(angle) * spread, (Math.random() * 0.9 - 0.2) * currentScale, Math.sin(angle) * spread);
      foliageGroup.add(cluster);
    }
    modelGroup.add(foliageGroup);
    animatedFoliage = foliageGroup;

    // Floating Bioluminescent Spores Particle Cloud
    const particleCount = 25;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount * 3; p += 3) {
      particlePositions[p] = (Math.random() - 0.5) * 3.5 * currentScale;
      particlePositions[p + 1] = Math.random() * 3 * currentScale + 0.2;
      particlePositions[p + 2] = (Math.random() - 0.5) * 3.5 * currentScale;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    modelGroup.add(particles);

    // Interaction controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      modelGroup.rotation.y += deltaX * 0.008;
      modelGroup.rotation.x = Math.max(-0.2, Math.min(0.3, modelGroup.rotation.x + deltaY * 0.005));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(3.5, Math.min(9, camera.position.z + e.deltaY * 0.003));
    };

    if (interactive) {
      container.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      container.addEventListener('wheel', onWheel, { passive: false });
    }

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Swaying animation
      if (animatedFoliage) {
        animatedFoliage.rotation.z = Math.sin(elapsedTime * 2) * 0.03;
      }


      // Auto rotation
      if (isAutoRotate && !isDragging) {
        modelGroup.rotation.y += 0.004;
      }

      // Particles drift upward
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += 0.004;
        if (positions[i] > 3.2 * currentScale) {
          positions[i] = 0.2;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        container.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        container.removeEventListener('wheel', onWheel);
      }
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [activeStage, status, isAutoRotate, interactive]);

  const stages: { stage: 1 | 2 | 3 | 4 | 5; label: string; age: string; height: string }[] = [
    { stage: 1, label: 'Seedling', age: 'Planted (Day 0)', height: '45 cm' },
    { stage: 2, label: 'Young Sprout', age: '30 Days', height: '62 cm' },
    { stage: 3, label: 'Sapling', age: '180 Days', height: '96 cm' },
    { stage: 4, label: 'Juvenile', age: '365 Days', height: '145 cm' },
    { stage: 5, label: 'Mature Tree', age: '3 Years Canopy', height: '280 cm' },
  ];

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-emerald-950/20 via-white to-emerald-50/40 border border-emerald-200/60 shadow-lg overflow-hidden flex flex-col">
      {/* Top Meta Bar */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/40 bg-emerald-50/50 backdrop-blur-md z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              🌳 3D DIGITAL TWIN
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              Live Digital Replica
            </span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <span>{speciesName}</span>
            <span className="text-xs font-tamil text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {tamilName}
            </span>
          </h3>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            title={isAutoRotate ? 'Pause 360 Rotation' : 'Start 360 Rotation'}
            className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
              isAutoRotate
                ? 'bg-emerald-100/70 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin-slow' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div 
        ref={containerRef} 
        className="w-full h-80 sm:h-96 relative cursor-grab active:cursor-grabbing select-none"
      >
        {/* Hotspots Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-auto">
          <button
            onClick={() => setSelectedHotspot(selectedHotspot === 'vitality' ? null : 'vitality')}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 backdrop-blur-md border border-amber-300/80 text-amber-900 shadow-xs hover:border-amber-400 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Tree Vitality: 96%
          </button>
          <button
            onClick={() => setSelectedHotspot(selectedHotspot === 'canopy' ? null : 'canopy')}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 backdrop-blur-md border border-emerald-200 text-emerald-900 shadow-xs hover:border-emerald-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Sun className="w-3.5 h-3.5 text-emerald-600" />
            Canopy Chlorophyll: 94%
          </button>
        </div>

        {/* Hotspot details card */}
        {selectedHotspot && (
          <div className="absolute bottom-4 left-4 right-4 z-20 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-300 shadow-lg text-xs text-slate-700 flex items-start justify-between">
            <div>
              <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <span>{selectedHotspot === 'vitality' ? '🌿 Tree Life Force & Moisture' : '🍃 Canopy Density Index'}</span>
              </p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                {selectedHotspot === 'vitality'
                  ? 'Root moisture and nutrient circulation are at peak vitality. No custody risk detected.'
                  : 'AI visual analysis confirmed high chlorophyll retention with zero pest degradation.'}
              </p>
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="text-slate-400 hover:text-slate-700 font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Drag Hint */}
        <div className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-500 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/80 pointer-events-none shadow-2xs">
          Drag to Rotate 360° • Scroll to Zoom
        </div>
      </div>

      {/* Growth Stage Timeline Selector */}
      <div className="p-3.5 bg-white border-t border-emerald-200/40 z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1">
            <span>🌱 GROWTH STAGES</span>
          </span>
          <span className="text-xs font-bold text-emerald-700">
            Est. Height: {stages[activeStage - 1].height}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {stages.map((st) => {
            const isSelected = activeStage === st.stage;
            return (
              <button
                key={st.stage}
                onClick={() => {
                  setActiveStage(st.stage);
                  if (onStageChange) onStageChange(st.stage);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500 text-white shadow-md font-extrabold ring-2 ring-emerald-300'
                    : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-emerald-50/60 hover:border-emerald-200'
                }`}
              >
                <span className="text-[11px] leading-tight">
                  {st.label}
                </span>
                <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                  {st.age}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
