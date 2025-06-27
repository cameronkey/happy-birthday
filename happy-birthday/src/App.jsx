import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './App.css';

function PullString({ onPull, isLampOn, setHover, pulled }) {
  // Animate the string stretching and the ball moving down when pulled
  const stringRef = useRef();
  const ballRef = useRef();
  useFrame(() => {
    if (stringRef.current && ballRef.current) {
      // Always use the shorter string (on) length
      const baseLength = 0.7 * 0.7;
      const basePosY = -0.35 * 0.7;
      const stretch = pulled ? 1.35 : 1;
      stringRef.current.scale.y = stretch;
      stringRef.current.geometry.parameters.height = baseLength;
      stringRef.current.position.y = basePosY;
      // Move the ball to the end of the stretched string
      ballRef.current.position.y = basePosY * stretch - 0.35 * 0.7;
    }
  });
  return (
    <group>
      {/* String: always attached to lamp shade */}
      <mesh
        ref={stringRef}
        position={[0, -0.245, 0]}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={onPull}
        castShadow
      >
        <cylinderGeometry args={[0.012, 0.012, 0.49, 16]} />
        <meshStandardMaterial color={isLampOn ? '#ffe9a7' : '#bfbfbf'} />
      </mesh>
      {/* Pull ball */}
      <mesh
        ref={ballRef}
        position={[0, -0.49, 0]}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={onPull}
        castShadow
      >
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color={isLampOn ? '#ffe9a7' : '#bfbfbf'} />
      </mesh>
    </group>
  );
}

function HangingLamp({ lampOn, onPull, setHover, pulled }) {
  const spotRef = useRef();
  const targetRef = useRef();
  useFrame(() => {
    if (spotRef.current && targetRef.current) {
      spotRef.current.intensity = lampOn ? 4.5 : 0.01;
      spotRef.current.angle = 0.55;
      spotRef.current.penumbra = 0.7;
      spotRef.current.distance = 7;
      spotRef.current.target.position.set(0, -2.5, 0);
      spotRef.current.target.updateMatrixWorld();
    }
  });
  return (
    <group position={[0, 0.9, 0]}>
      {/* Cord to ceiling */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.7, 16]} />
        <meshStandardMaterial color="#bfbfbf" />
      </mesh>
      {/* Lamp body */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 0.25, 32]} />
        <meshStandardMaterial color="#6e5c3e" />
      </mesh>
      {/* Lamp shade */}
      <mesh position={[0, -0.18, 0]} castShadow>
        <coneGeometry args={[0.28, 0.35, 32]} />
        <meshStandardMaterial color={lampOn ? '#ffe9a7' : '#3a2c23'} emissive={lampOn ? '#ffe9a7' : '#000000'} emissiveIntensity={lampOn ? 0.7 : 0} />
      </mesh>
      {/* Emissive bulb inside lamp shade */}
      <mesh position={[0, -0.32, 0]}>
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshStandardMaterial emissive={lampOn ? '#fff7d6' : '#000'} emissiveIntensity={lampOn ? 2.5 : 0} color={'#fffbe6'} />
      </mesh>
      {/* Point light for soft fill */}
      <pointLight
        position={[0, -0.32, 0]}
        intensity={lampOn ? 0.7 : 0}
        distance={2.2}
        color={'#fff7d6'}
        castShadow={false}
      />
      {/* Pull string, now attached to bottom of lamp shade */}
      <group position={[0, -0.4, 0]}>
        <PullString onPull={onPull} isLampOn={lampOn} setHover={setHover} pulled={pulled} />
      </group>
      {/* Spotlight - positioned just inside the lamp shade */}
      <spotLight
        ref={spotRef}
        position={[0, -0.32, 0]}
        angle={0.65}
        penumbra={0.8}
        distance={7}
        intensity={lampOn ? 5.5 : 0.01}
        color={'#fff7d6'}
        castShadow
      />
      {/* Spotlight target (invisible, for aiming the cone) */}
      <object3D ref={targetRef} position={[0, -2.5, 0]} />
      {/* Shadow catcher below lamp for visible light effect */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial color="#222" transparent opacity={lampOn ? 0.25 : 0.05} />
      </mesh>
    </group>
  );
}

function FocusedRoom({ lampOn, setLampHover, pulled, onPull }) {
  return (
    <>
      {/* Hanging lamp with pull string */}
      <HangingLamp lampOn={lampOn} onPull={onPull} setHover={setLampHover} pulled={pulled} />
      {/* Dim ambient light */}
      <ambientLight intensity={lampOn ? 0.11 : 0.04} color="#ffe9a7" />
      {/* Extra ambient hemisphere light when lamp is on */}
      {lampOn && (
        <hemisphereLight
          skyColor={'#ffe9a7'}
          groundColor={'#3a2712'}
          intensity={0.1}
        />
      )}
    </>
  );
}

function Scene1() {
  const [lampOn, setLampOn] = useState(false);
  const [lampHover, setLampHover] = useState(false);
  const [pulled, setPulled] = useState(false);

  // Change cursor on lamp hover
  React.useEffect(() => {
    document.body.style.cursor = lampHover ? 'pointer' : 'default';
    return () => { document.body.style.cursor = 'default'; };
  }, [lampHover]);

  // Handle pull animation and lamp toggle
  const handlePull = () => {
    setPulled(true);
    setTimeout(() => {
      setPulled(false);
      setLampOn((v) => !v);
    }, 180); // Quick pull animation
  };

  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.2, 4.2], fov: 30 }}
      style={{ height: '100vh', width: '100vw', background: lampOn ? '#3a2712' : '#18120e' }}
    >
      <FocusedRoom lampOn={lampOn} setLampHover={setLampHover} pulled={pulled} onPull={handlePull} />
    </Canvas>
  );
}

function App() {
  return (
    <div className="relative min-h-screen w-full bg-[#18120e] flex items-center justify-center">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <div style={{ maxWidth: 800, maxHeight: 800, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Scene1 />
        </div>
      </Suspense>
      {/* Ambient sound placeholder */}
      {/* <audio src="/ambient.mp3" autoPlay loop /> */}
    </div>
  );
}

export default App;
