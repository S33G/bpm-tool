'use client';

import { Canvas, ThreeElements } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

interface RoomVisualizationProps {
  length: number;
  width: number;
  height: number;
  monitorWidth: number;
  showModes: {
    axial: boolean;
    tangential: boolean;
    oblique: boolean;
  };
  showReflections: boolean;
}

function Room({ length, width, height, monitorWidth, showModes, showReflections }: RoomVisualizationProps) {
  const scale = Math.max(length, width, height);
  const normalizedL = length / scale;
  const normalizedW = width / scale;
  const normalizedH = height / scale;
  const normalizedMonitorGap = Math.max(0.2, Math.min(monitorWidth, 1.2)) / scale;

  const wireframeGeometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(normalizedL, normalizedH, normalizedW);
    return new THREE.EdgesGeometry(geo);
  }, [normalizedL, normalizedW, normalizedH]);

  const cornerPositions = useMemo(() => {
    const halfL = normalizedL / 2;
    const halfW = normalizedW / 2;
    const halfH = normalizedH / 2;
    return [
      [-halfL, -halfH, -halfW],
      [-halfL, -halfH, halfW],
      [-halfL, halfH, -halfW],
      [-halfL, halfH, halfW],
      [halfL, -halfH, -halfW],
      [halfL, -halfH, halfW],
      [halfL, halfH, -halfW],
      [halfL, halfH, halfW],
    ] as [number, number, number][];
  }, [normalizedL, normalizedW, normalizedH]);

  const floorMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ 
      color: '#14b8a6', 
      transparent: true, 
      opacity: 0.1, 
      side: THREE.DoubleSide 
    });
  }, []);

  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({ color: '#14b8a6' });
  }, []);

  const cornerMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: '#ef4444', transparent: true, opacity: 0.8 });
  }, []);

  const deskMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: '#1f2937' });
  }, []);

  const monitorMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: '#0f172a' });
  }, []);

  const deskDimensions = useMemo(() => {
    const depth = normalizedL * 0.22;
    const deskWidth = normalizedW * 0.55;
    const deskHeight = normalizedH * 0.12;
    return { depth, deskWidth, deskHeight };
  }, [normalizedL, normalizedW, normalizedH]);

  const deskPosition = useMemo(() => {
    return [
      normalizedL / 2 - deskDimensions.depth / 2 - 0.02,
      -normalizedH / 2 + deskDimensions.deskHeight / 2,
      0,
    ] as [number, number, number];
  }, [normalizedL, normalizedH, deskDimensions]);

  const monitorDimensions = useMemo(() => {
    const widthValue = normalizedW * 0.08;
    const heightValue = widthValue * 1.4;
    const depthValue = widthValue * 0.8;
    return { widthValue, heightValue, depthValue };
  }, [normalizedW]);

  const monitorOffsetZ = Math.min(
    deskDimensions.deskWidth / 2 - monitorDimensions.widthValue,
    normalizedMonitorGap / 2
  );
  const monitorPosX = deskPosition[0] - deskDimensions.depth * 0.1;
  const monitorPosY = deskPosition[1] + deskDimensions.deskHeight / 2 + monitorDimensions.heightValue / 2;

  const reflectionMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.8 });
  }, []);

  const axialMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: '#ef4444', transparent: true, opacity: 0.15, side: THREE.DoubleSide });
  }, []);

  const tangentialMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({ color: '#facc15' });
  }, []);

  const obliqueMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: '#22c55e', transparent: true, opacity: 0.7 });
  }, []);

  const reflectionPoints = useMemo(() => {
    const listenerPos: [number, number, number] = [
      deskPosition[0] - deskDimensions.depth * 0.15,
      monitorPosY - monitorDimensions.heightValue * 0.25,
      0,
    ];

    const leftMonitor: [number, number, number] = [
      monitorPosX,
      monitorPosY,
      -monitorOffsetZ,
    ];
    const rightMonitor: [number, number, number] = [
      monitorPosX,
      monitorPosY,
      monitorOffsetZ,
    ];

    const rightWallZ = normalizedW / 2;
    const leftWallZ = -normalizedW / 2;
    const ceilingY = normalizedH / 2;

    const mirrorAcrossZ = (point: [number, number, number], wallZ: number) => [
      point[0],
      point[1],
      wallZ + (wallZ - point[2]),
    ] as [number, number, number];

    const mirrorAcrossY = (point: [number, number, number], wallY: number) => [
      point[0],
      wallY + (wallY - point[1]),
      point[2],
    ] as [number, number, number];

    const intersectionWithZWall = (
      source: [number, number, number],
      target: [number, number, number],
      wallZ: number
    ) => {
      const t = (wallZ - source[2]) / (target[2] - source[2]);
      return [
        source[0] + t * (target[0] - source[0]),
        source[1] + t * (target[1] - source[1]),
        wallZ,
      ] as [number, number, number];
    };

    const intersectionWithCeiling = (
      source: [number, number, number],
      target: [number, number, number],
      wallY: number
    ) => {
      const t = (wallY - source[1]) / (target[1] - source[1]);
      return [
        source[0] + t * (target[0] - source[0]),
        wallY,
        source[2] + t * (target[2] - source[2]),
      ] as [number, number, number];
    };

    const leftWallPoints = [leftMonitor, rightMonitor].map((monitor) => {
      const mirrored = mirrorAcrossZ(monitor, leftWallZ);
      return intersectionWithZWall(listenerPos, mirrored, leftWallZ);
    });

    const rightWallPoints = [leftMonitor, rightMonitor].map((monitor) => {
      const mirrored = mirrorAcrossZ(monitor, rightWallZ);
      return intersectionWithZWall(listenerPos, mirrored, rightWallZ);
    });

    const ceilingPoints = [leftMonitor, rightMonitor].map((monitor) => {
      const mirrored = mirrorAcrossY(monitor, ceilingY);
      return intersectionWithCeiling(listenerPos, mirrored, ceilingY);
    });

    return {
      listenerPos,
      leftWallPoints,
      rightWallPoints,
      ceilingPoints,
    };
  }, [deskPosition, deskDimensions, monitorPosX, monitorPosY, monitorOffsetZ, monitorDimensions, normalizedW, normalizedH]);

  const tangentialGeometry = useMemo(() => {
    const halfL = normalizedL / 2;
    const halfW = normalizedW / 2;
    const halfH = normalizedH / 2;
    const points = [
      new THREE.Vector3(-halfL, -halfH, -halfW),
      new THREE.Vector3(halfL, halfH, -halfW),
      new THREE.Vector3(-halfL, halfH, -halfW),
      new THREE.Vector3(halfL, -halfH, -halfW),
      new THREE.Vector3(-halfL, -halfH, halfW),
      new THREE.Vector3(halfL, halfH, halfW),
      new THREE.Vector3(-halfL, halfH, halfW),
      new THREE.Vector3(halfL, -halfH, halfW),
      new THREE.Vector3(-halfL, -halfH, -halfW),
      new THREE.Vector3(-halfL, halfH, halfW),
      new THREE.Vector3(-halfL, halfH, -halfW),
      new THREE.Vector3(-halfL, -halfH, halfW),
      new THREE.Vector3(halfL, -halfH, -halfW),
      new THREE.Vector3(halfL, halfH, halfW),
      new THREE.Vector3(halfL, halfH, -halfW),
      new THREE.Vector3(halfL, -halfH, halfW),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [normalizedL, normalizedW, normalizedH]);

  const obliquePoints = useMemo(() => {
    const halfL = normalizedL / 2;
    const halfW = normalizedW / 2;
    const halfH = normalizedH / 2;
    const fractions = [0.25, 0.5, 0.75];
    return fractions.map((t) => [
      -halfL + (halfL * 2 * t),
      -halfH + (halfH * 2 * t),
      -halfW + (halfW * 2 * t),
    ] as [number, number, number]);
  }, [normalizedL, normalizedW, normalizedH]);

  return (
    <>
      <lineSegments geometry={wireframeGeometry} material={lineMaterial} />

      {cornerPositions.map((pos, i) => (
        <mesh key={i} position={pos} material={cornerMaterial}>
          <sphereGeometry args={[0.03, 16, 16]} />
        </mesh>
      ))}

      <mesh position={[0, -normalizedH / 2, 0]} rotation={[-Math.PI / 2, 0, 0]} material={floorMaterial}>
        <planeGeometry args={[normalizedL, normalizedW]} />
      </mesh>

      <mesh
        position={deskPosition}
        material={deskMaterial}
      >
        <boxGeometry args={[deskDimensions.depth, deskDimensions.deskHeight, deskDimensions.deskWidth]} />
      </mesh>

      <mesh
        position={[monitorPosX, monitorPosY, -monitorOffsetZ]}
        rotation={[0, Math.PI / 12, 0]}
        material={monitorMaterial}
      >
        <boxGeometry args={[monitorDimensions.depthValue, monitorDimensions.heightValue, monitorDimensions.widthValue]} />
      </mesh>

      <mesh
        position={[monitorPosX, monitorPosY, monitorOffsetZ]}
        rotation={[0, -Math.PI / 12, 0]}
        material={monitorMaterial}
      >
        <boxGeometry args={[monitorDimensions.depthValue, monitorDimensions.heightValue, monitorDimensions.widthValue]} />
      </mesh>

      {showReflections && (
        [...reflectionPoints.leftWallPoints, ...reflectionPoints.rightWallPoints, ...reflectionPoints.ceilingPoints].map(
          (point, index) => (
            <mesh key={index} position={point} material={reflectionMaterial}>
              <sphereGeometry args={[0.025, 16, 16]} />
            </mesh>
          )
        )
      )}

      {showModes.axial && (
        <>
          <mesh rotation={[0, Math.PI / 2, 0]} material={axialMaterial}>
            <planeGeometry args={[normalizedW, normalizedH]} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} material={axialMaterial}>
            <planeGeometry args={[normalizedL, normalizedW]} />
          </mesh>
          <mesh material={axialMaterial}>
            <planeGeometry args={[normalizedL, normalizedH]} />
          </mesh>
        </>
      )}

      {showModes.tangential && (
        <lineSegments geometry={tangentialGeometry} material={tangentialMaterial} />
      )}

      {showModes.oblique && (
        <>
          {obliquePoints.map((point, index) => (
            <mesh key={`oblique-${index}`} position={point} material={obliqueMaterial}>
              <sphereGeometry args={[0.02, 16, 16]} />
            </mesh>
          ))}
        </>
      )}

      <axesHelper args={[0.3]} />
    </>
  );
}

export default function RoomVisualization({ length, width, height, monitorWidth, showModes, showReflections }: RoomVisualizationProps) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[1.5, 1, 1.5]} fov={50} />
      <OrbitControls
        enablePan={false}
        minDistance={1}
        maxDistance={5}
        autoRotate
        autoRotateSpeed={0.5}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <Room length={length} width={width} height={height} monitorWidth={monitorWidth} showModes={showModes} showReflections={showReflections} />
    </Canvas>
  );
}
