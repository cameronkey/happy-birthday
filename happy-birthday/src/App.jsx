import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './App.css';
import { Html } from '@react-three/drei';

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

function Raccoon({ pose }) {
  // pose: 'sleeping', 'waking', 'awake'
  const group = useRef();
  const armRef = useRef();
  const [blink, setBlink] = useState(false);
  const [anim, setAnim] = useState({
    bodyRot: pose === 'sleeping' ? Math.PI / 2 : 0,
    bodyY: pose === 'sleeping' ? -0.13 : -0.08,
    headRot: pose === 'sleeping' ? Math.PI / 2.5 : 0,
    headY: pose === 'sleeping' ? -0.03 : 0.09,
    headZ: pose === 'sleeping' ? -0.13 : 0.09,
    startled: pose === 'awake',
    rub: false
  });

  // Animate pose transitions
  useFrame(() => {
    // Animate body rotation and position
    setAnim((prev) => {
      let targetBodyRot = pose === 'sleeping' ? Math.PI / 2 : 0;
      let targetBodyY = pose === 'sleeping' ? -0.13 : -0.08;
      let targetHeadRot = pose === 'sleeping' ? Math.PI / 2.5 : 0;
      let targetHeadY = pose === 'sleeping' ? -0.03 : 0.09;
      let targetHeadZ = pose === 'sleeping' ? -0.13 : 0.09;
      let startled = pose === 'awake';
      let rub = pose === 'waking';
      // Smoothly interpolate
      return {
        bodyRot: prev.bodyRot + (targetBodyRot - prev.bodyRot) * 0.15,
        bodyY: prev.bodyY + (targetBodyY - prev.bodyY) * 0.15,
        headRot: prev.headRot + (targetHeadRot - prev.headRot) * 0.15,
        headY: prev.headY + (targetHeadY - prev.headY) * 0.15,
        headZ: prev.headZ + (targetHeadZ - prev.headZ) * 0.15,
        startled,
        rub
      };
    });
  });

  // Blinking and rubbing eyes
  useEffect(() => {
    if (anim.rub) {
      setBlink(true);
      const t = setTimeout(() => setBlink(false), 400);
      return () => clearTimeout(t);
    }
  }, [anim.rub]);

  // Raccoon position: center of spotlight
  return (
    <group ref={group} position={[0, -1.1, 0]}>
      {/* Striped Tail */}
      <group position={[-0.22, -0.26, -0.13]} rotation={[0, 0, Math.PI / 2.7]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.08, 0.36, 16]} />
          <meshStandardMaterial color="#6e5c3e" />
        </mesh>
        <mesh position={[0, 0.10, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0, -0.10, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>
      {/* Body, fat and laying down or sitting */}
      <mesh position={[0, anim.bodyY, 0]} rotation={[0, 0, anim.bodyRot]}>
        <sphereGeometry args={[0.19, 32, 32]} />
        <meshStandardMaterial color="#bfbfbf" />
      </mesh>
      {/* Head, tilted for sleeping or upright for awake */}
      <mesh position={[0, anim.headY, anim.headZ]} rotation={[0, 0, anim.headRot]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color="#bfbfbf" />
      </mesh>
      {/* Mask/stripe on face */}
      <mesh position={[0, anim.headY, anim.headZ + 0.07]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.11, 16, 16, 0, Math.PI]} />
        <meshStandardMaterial color="#222" transparent opacity={0.7} />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.08, anim.headY + 0.1, anim.headZ]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#6e5c3e" />
      </mesh>
      <mesh position={[0.08, anim.headY + 0.1, anim.headZ]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#6e5c3e" />
      </mesh>
      {/* Eyes (blink by scaling Y) */}
      <mesh position={[-0.037, anim.headY + 0.04, anim.headZ + 0.09]} scale={[1, blink ? 0.1 : 1, 1]}>
        <sphereGeometry args={[0.013, 8, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0.037, anim.headY + 0.04, anim.headZ + 0.09]} scale={[1, blink ? 0.1 : 1, 1]}>
        <sphereGeometry args={[0.013, 8, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Eye pupils */}
      <mesh position={[-0.037, anim.headY + 0.04, anim.headZ + 0.102]} scale={[1, blink ? 0.1 : 1, 1]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.037, anim.headY + 0.04, anim.headZ + 0.102]} scale={[1, blink ? 0.1 : 1, 1]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Nose */}
      <mesh position={[0, anim.headY + 0.02, anim.headZ + 0.13]}>
        <sphereGeometry args={[0.013, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Arm (resting on belly, chubby, rubs eyes if waking) */}
      <group ref={armRef} position={[0.11, anim.bodyY - 0.04, 0.08]} rotation={[0, 0, anim.rub ? Math.PI / 1.5 : Math.PI / 4]}>
        <mesh>
          <cylinderGeometry args={[0.018, 0.02, 0.11, 8]} />
          <meshStandardMaterial color="#bfbfbf" />
        </mesh>
      </group>
      {/* Other arm, resting, chubby */}
      <mesh position={[-0.11, anim.bodyY - 0.04, 0.08]} rotation={[0, 0, anim.rub ? -Math.PI / 1.5 : -Math.PI / 4]}>
        <cylinderGeometry args={[0.018, 0.02, 0.11, 8]} />
        <meshStandardMaterial color="#bfbfbf" />
      </mesh>
      {/* Legs, splayed out */}
      <mesh position={[-0.09, anim.bodyY - 0.1, 0.04]} rotation={[0, 0, Math.PI / 7]}>
        <cylinderGeometry args={[0.022, 0.025, 0.13, 8]} />
        <meshStandardMaterial color="#bfbfbf" />
      </mesh>
      <mesh position={[0.09, anim.bodyY - 0.1, 0.04]} rotation={[0, 0, -Math.PI / 7]}>
        <cylinderGeometry args={[0.022, 0.025, 0.13, 8]} />
        <meshStandardMaterial color="#bfbfbf" />
      </mesh>
      {/* Food wrappers and half-eaten chocolates around the perimeter of the spotlight */}
      {/* Wrapper 1 */}
      <mesh position={[0.55, -0.16, 0]} rotation={[0, 0, Math.PI / 8]}>
        <boxGeometry args={[0.13, 0.02, 0.04]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>
      {/* Wrapper 2 */}
      <mesh position={[-0.55, -0.16, 0.13]} rotation={[0, 0, -Math.PI / 10]}>
        <boxGeometry args={[0.11, 0.02, 0.04]} />
        <meshStandardMaterial color="#f59e42" />
      </mesh>
      {/* Wrapper 3 */}
      <mesh position={[0.38, -0.16, -0.38]} rotation={[0, 0, Math.PI / 5]}>
        <boxGeometry args={[0.09, 0.02, 0.04]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      {/* Half-eaten chocolate 1 */}
      <mesh position={[-0.42, -0.16, -0.32]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.07, 0.025, 0.03]} />
        <meshStandardMaterial color="#6e3c1a" />
      </mesh>
      {/* Half-eaten chocolate 2 */}
      <mesh position={[0.32, -0.16, 0.42]} rotation={[0, 0, -Math.PI / 7]}>
        <boxGeometry args={[0.06, 0.02, 0.03]} />
        <meshStandardMaterial color="#7c3f00" />
      </mesh>
      {/* Wrapper 4 */}
      <mesh position={[0, -0.16, 0.55]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.12, 0.02, 0.04]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>
      {/* Wrapper 5 */}
      <mesh position={[0, -0.16, -0.55]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.1, 0.02, 0.04]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

function FocusedRoom({ lampOn, setLampHover, pulled, onPull, scene2Started, raccoonPose }) {
  return (
    <>
      {/* Hanging lamp with pull string */}
      <HangingLamp lampOn={lampOn} onPull={onPull} setHover={setLampHover} pulled={pulled} />
      {/* Raccoon appears in scene 2 */}
      {scene2Started && <Raccoon pose={raccoonPose} />}
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
  const [scene2Started, setScene2Started] = useState(false);
  const [raccoonPose, setRaccoonPose] = useState('sleeping');

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

  // Start scene 2 after lamp is on
  useEffect(() => {
    if (lampOn && !scene2Started) {
      const t = setTimeout(() => setScene2Started(true), 1200);
      return () => clearTimeout(t);
    }
  }, [lampOn, scene2Started]);

  // Raccoon pose animation sequence
  useEffect(() => {
    if (!scene2Started) {
      setRaccoonPose('sleeping');
      return;
    }
    if (lampOn) {
      setRaccoonPose('waking');
      const t1 = setTimeout(() => setRaccoonPose('awake'), 1200);
      return () => clearTimeout(t1);
    } else {
      setRaccoonPose('sleeping');
    }
  }, [lampOn, scene2Started]);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.2, 4.2], fov: 30 }}
      style={{ height: '100vh', width: '100vw', background: lampOn ? '#3a2712' : '#18120e' }}
    >
      <FocusedRoom lampOn={lampOn} setLampHover={setLampHover} pulled={pulled} onPull={handlePull} scene2Started={scene2Started} raccoonPose={raccoonPose} />
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
