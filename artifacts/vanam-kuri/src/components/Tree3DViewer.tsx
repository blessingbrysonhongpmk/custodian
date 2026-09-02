import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TreeStatus } from '../types/custodia';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Sun, ShieldAlert, CheckCircle2 } from 'lucide-react';

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
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 6);

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

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.6);
    sunLight.position.set(5, 10, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const softFillLight = new THREE.DirectionalLight(0xa7f3d0, 0.6);
    softFillLight.position.set(-5, 4, -4);
    scene.add(softFillLight);

    // 5. Tree Root Group
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    // Soil Base / Planter Mound
    const soilGeo = new THREE.CylinderGeometry(1.6, 1.9, 0.35, 32);
    const soilMat = new THREE.MeshStandardMaterial({
      color: status === 'failed' ? 0x8b7355 : 0x4a3728,
      roughness: 0.9,
      metalness: 0.1,
    });
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.position.y = -0.17;
    soilMesh.receiveShadow = true;
    treeGroup.add(soilMesh);

    // Stone Border Ring around Base
    const ringGeo = new THREE.TorusGeometry(1.7, 0.08, 16, 40);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, roughness: 0.8 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -0.05;
    treeGroup.add(ringMesh);

    // Grass Sprigs on Soil
    const grassCount = 18;
    const grassGeo = new THREE.ConeGeometry(0.04, 0.18, 4);
    const grassMat = new THREE.MeshStandardMaterial({
      color: status === 'failed' ? 0xb45309 : 0x10b981,
      roughness: 0.6,
    });
    for (let i = 0; i < grassCount; i++) {
      const angle = (i / grassCount) * Math.PI * 2;
      const r = 0.6 + Math.random() * 0.7;
      const grass = new THREE.Mesh(grassGeo, grassMat);
      grass.position.set(Math.cos(angle) * r, 0.05, Math.sin(angle) * r);
      grass.rotation.z = (Math.random() - 0.5) * 0.4;
      treeGroup.add(grass);
    }

    // Dynamic Tree Growth Geometry based on activeStage
    const stageScales = [0.35, 0.6, 0.9, 1.25, 1.6];
    const currentScale = stageScales[activeStage - 1];

    const trunkHeight = 1.6 * currentScale;
    const trunkRadiusTop = 0.06 * currentScale;
    const trunkRadiusBottom = 0.16 * currentScale;

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(trunkRadiusTop, trunkRadiusBottom, trunkHeight, 16);
    const trunkColor = status === 'failed' ? 0x57534e : 0x5c4033;
    const trunkMat = new THREE.MeshStandardMaterial({
      color: trunkColor,
      roughness: 0.85,
    });
    const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
    trunkMesh.position.y = trunkHeight / 2;
    trunkMesh.castShadow = true;
    trunkMesh.receiveShadow = true;
    treeGroup.add(trunkMesh);

    // Bamboo Tree Guard if young (stage 1-3)
    if (activeStage <= 3 && status !== 'failed') {
      const guardRingGeo = new THREE.TorusGeometry(0.32, 0.02, 8, 24);
      const guardMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
      for (let h = 0.2; h <= trunkHeight * 0.7; h += 0.3) {
        const gRing = new THREE.Mesh(guardRingGeo, guardMat);
        gRing.rotation.x = Math.PI / 2;
        gRing.position.y = h;
        treeGroup.add(gRing);
      }
      for (let s = 0; s < 4; s++) {
        const angle = (s / 4) * Math.PI * 2;
        const stakeGeo = new THREE.CylinderGeometry(0.015, 0.015, trunkHeight * 0.8, 8);
        const stake = new THREE.Mesh(stakeGeo, guardMat);
        stake.position.set(Math.cos(angle) * 0.32, (trunkHeight * 0.8) / 2, Math.sin(angle) * 0.32);
        treeGroup.add(stake);
      }
    }

    // Foliage Colors according to Status
    let leafColor1 = 0x10b981; // Vibrant Emerald
    let leafColor2 = 0x059669; // Deep Leaf Green
    let leafColor3 = 0x34d399; // Light Fresh Green

    if (status === 'at-risk') {
      leafColor1 = 0xf59e0b; // Amber warning
      leafColor2 = 0xd97706;
      leafColor3 = 0xfcd34d;
    } else if (status === 'failed') {
      leafColor1 = 0x78716c; // Withered stone/grey
      leafColor2 = 0x57534e;
      leafColor3 = 0xa8a29e;
    } else if (status === 'orphaned') {
      leafColor1 = 0x10b981;
      leafColor2 = 0xf59e0b;
    }

    // Create Organic Canopy Clusters
    const foliageGroup = new THREE.Group();
    foliageGroup.position.y = trunkHeight * 0.85;

    const clusterCount = activeStage === 1 ? 3 : activeStage === 2 ? 6 : activeStage === 3 ? 12 : activeStage === 4 ? 20 : 32;
    const baseRadius = 0.35 * currentScale;

    const foliageGeo = new THREE.DodecahedronGeometry(baseRadius, 1);
    const foliageMat1 = new THREE.MeshStandardMaterial({
      color: leafColor1,
      roughness: 0.7,
      flatShading: true,
    });
    const foliageMat2 = new THREE.MeshStandardMaterial({
      color: leafColor2,
      roughness: 0.7,
      flatShading: true,
    });
    const foliageMat3 = new THREE.MeshStandardMaterial({
      color: leafColor3,
      roughness: 0.7,
      flatShading: true,
    });

    const mats = [foliageMat1, foliageMat2, foliageMat3];

    for (let i = 0; i < clusterCount; i++) {
      const clusterMesh = new THREE.Mesh(foliageGeo, mats[i % mats.length]);
      const angle = Math.random() * Math.PI * 2;
      const spread = (Math.random() * 0.7 + 0.2) * currentScale;
      const yOffset = (Math.random() * 0.9 - 0.2) * currentScale;
      
      clusterMesh.position.set(Math.cos(angle) * spread, yOffset, Math.sin(angle) * spread);
      const scaleRand = (Math.random() * 0.4 + 0.7) * (status === 'failed' ? 0.6 : 1);
      clusterMesh.scale.set(scaleRand, scaleRand * 1.1, scaleRand);
      clusterMesh.castShadow = true;
      foliageGroup.add(clusterMesh);
    }
    treeGroup.add(foliageGroup);

    // Floating Spores / Sunlight Particles
    const particleCount = status === 'healthy' ? 30 : 10;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount * 3; p += 3) {
      particlePositions[p] = (Math.random() - 0.5) * 3 * currentScale;
      particlePositions[p + 1] = Math.random() * 2.5 * currentScale + 0.3;
      particlePositions[p + 2] = (Math.random() - 0.5) * 3 * currentScale;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: status === 'at-risk' ? 0xf59e0b : 0x6ee7b7,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    treeGroup.add(particles);

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

      treeGroup.rotation.y += deltaX * 0.008;
      treeGroup.rotation.x = Math.max(-0.2, Math.min(0.3, treeGroup.rotation.x + deltaY * 0.005));

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

    // Animation loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle leaf swaying in wind
      if (status !== 'failed') {
        foliageGroup.rotation.z = Math.sin(elapsedTime * 1.5) * 0.02;
        foliageGroup.rotation.x = Math.cos(elapsedTime * 1.2) * 0.015;
      }

      // Auto rotation
      if (isAutoRotate && !isDragging) {
        treeGroup.rotation.y += 0.004;
      }

      // Particle floating
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += 0.003;
        if (positions[i] > 3 * currentScale) {
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

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        container.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        container.removeEventListener('wheel', onWheel);
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [activeStage, status, isAutoRotate, interactive]);

  const stages: { stage: 1 | 2 | 3 | 4 | 5; label: string; age: string; height: string }[] = [
    { stage: 1, label: 'Planted', age: 'Day 0', height: '45 cm' },
    { stage: 2, label: '1 Month', age: '30 Days', height: '62 cm' },
    { stage: 3, label: '6 Months', age: '180 Days', height: '96 cm' },
    { stage: 4, label: '1 Year', age: '365 Days', height: '145 cm' },
    { stage: 5, label: '3 Years', age: 'Canopy', height: '280 cm' },
  ];

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-emerald-50/50 via-white to-slate-50/80 border border-emerald-100 shadow-sm overflow-hidden flex flex-col">
      {/* Top Meta Bar */}
      <div className="p-4 flex items-center justify-between border-b border-emerald-100/60 bg-white/60 backdrop-blur-md z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              3D Living Digital Twin
            </span>
            <span className="text-xs font-mono text-slate-500">Live Simulation</span>
          </div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-1">
            {speciesName} <span className="text-emerald-600 text-xs font-medium font-serif">({tamilName})</span>
          </h3>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          {status === 'healthy' && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Healthy & Thriving
            </div>
          )}
          {status === 'at-risk' && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              At Risk (Intervention Needed)
            </div>
          )}
          {status === 'failed' && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Failed (Autopsy Logged)
            </div>
          )}
          {status === 'orphaned' && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Orphaned Tree
            </div>
          )}

          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            title={isAutoRotate ? 'Pause 360 Rotation' : 'Start 360 Rotation'}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isAutoRotate ? 'bg-emerald-100/70 border-emerald-300 text-emerald-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin-slow' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3D Canvas Canvas Viewport */}
      <div 
        ref={containerRef} 
        className="w-full h-80 sm:h-96 relative cursor-grab active:cursor-grabbing select-none"
      >
        {/* Hotspots Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-auto">
          <button
            onClick={() => setSelectedHotspot(selectedHotspot === 'canopy' ? null : 'canopy')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 shadow-xs hover:border-emerald-300 flex items-center gap-1.5"
          >
            <Sun className="w-3.5 h-3.5 text-emerald-600" />
            Canopy Density: 92%
          </button>
          <button
            onClick={() => setSelectedHotspot(selectedHotspot === 'soil' ? null : 'soil')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 shadow-xs hover:border-emerald-300 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Soil Moisture: 64% (Optimal)
          </button>
        </div>

        {/* Hotspot details card */}
        {selectedHotspot && (
          <div className="absolute bottom-4 left-4 right-4 z-20 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-emerald-200 shadow-md text-xs text-slate-700 flex items-start justify-between">
            <div>
              <p className="font-bold text-slate-900">
                {selectedHotspot === 'canopy' ? '🍃 Crown Foliage Index' : '💧 Root Zone Hydration'}
              </p>
              <p className="text-slate-600 mt-0.5">
                {selectedHotspot === 'canopy'
                  ? 'Consistent chlorophyll density verified via peer camera consistency check.'
                  : 'Root moisture levels maintained through weekly drip schedule in Playground North.'}
              </p>
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="text-slate-400 hover:text-slate-700 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Drag Hint */}
        <div className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-400 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200/60 pointer-events-none">
          Click & Drag to Rotate 360°
        </div>
      </div>

      {/* Growth Stage Timeline Selector */}
      <div className="p-3.5 bg-white border-t border-emerald-100 z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
            Survival & Growth Stage Simulation
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
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm ring-2 ring-emerald-200'
                    : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-emerald-50/60 hover:border-emerald-200'
                }`}
              >
                <span className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                  {st.label}
                </span>
                <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
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
