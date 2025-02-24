"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame, extend, useLoader } from "@react-three/fiber";
import { Stars, Sphere, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import useThemeStore from "@/store/themeStore";

function Sun() {
  const sunRef = useRef<THREE.Group>(null);

  useFrame((state: any) => {
    if (sunRef.current) {
      sunRef.current.position.y = 8 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group position={[8, 8, -10]} ref={sunRef}>
      {/* 发光效果 - 最外层 */}
      <mesh>
        <circleGeometry args={[3, 32]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* 发光效果 - 中层 */}
      <mesh>
        <circleGeometry args={[2.5, 32]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* 主体 */}
      <mesh>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial color="#FDB813" />
      </mesh>

      {/* 内发光 */}
      <pointLight
        color="#FFD700"
        intensity={1}
        distance={10}
      />

      {/* 脸部特征组 */}
      <group position={[0, 0, 0.1]}>
        {/* 眼睛 */}
        <mesh position={[-0.5, 0.2, 0]}>
          <circleGeometry args={[0.15, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[0.5, 0.2, 0]}>
          <circleGeometry args={[0.15, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* 腮红 */}
        <mesh position={[-0.8, -0.1, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="#FF9999" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.8, -0.1, 0]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="#FF9999" transparent opacity={0.5} />
        </mesh>

        {/* 嘴巴 */}
        <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI]}>
          <circleGeometry args={[0.4, 32, 0, Math.PI]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* 外发光效果 */}
      <group>
        {Array.from({ length: 360 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 360;
          const radius = 2.2 + Math.random() * 0.3;
          const size = 0.05 + Math.random() * 0.05;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                -0.1
              ]}
            >
              <circleGeometry args={[size, 8]} />
              <meshBasicMaterial
                color="#FFD700"
                transparent
                opacity={0.2 + Math.random() * 0.3}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function BackgroundStars() {
  return (
    <group>
      {/* 非常稀疏的星星 */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = -30;
        const size = 0.01 + Math.random() * 0.015;
        return (
          <mesh key={i} position={[x, y, z]}>
            <circleGeometry args={[size, 32]} />
            <meshBasicMaterial
              color="#B5E3FF"
              transparent
              opacity={0.4 + Math.random() * 0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function createNormalMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = 'rgb(200, 200, 255)';
  ctx.fillRect(0, 0, 1024, 1024);

  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const radius = Math.random() * 60 + 20;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgb(180, 180, 255)');
    gradient.addColorStop(0.8, 'rgb(200, 200, 255)');
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

function Moon() {
  const moonRef = useRef<THREE.Group>(null);
  const normalMap = useMemo(() => createNormalMap(), []);

  useFrame((state: any) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.001;
      moonRef.current.position.y = 8 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  const moonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      metalness: 0.3,
      roughness: 0.4,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      emissive: new THREE.Color('#333333'),
    });
  }, [normalMap]);

  return (
    <group ref={moonRef} position={[8, 8, -10]}>
      <pointLight color="#FFFFFF" intensity={0.5} distance={20} />
      
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[2, 128, 128]} />
        <primitive object={moonMaterial} attach="material" />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.02, 128, 128]} />
        <meshStandardMaterial
          color="#FFFFFF"
          metalness={0.2}
          roughness={0.6}
          transparent
          opacity={0.3}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.3, 0.3)}
          emissive={new THREE.Color('#222222')}
        />
      </mesh>

      <group position={[0, 0, 1.9]}>
        <mesh position={[-0.5, 0.2, 0.3]} rotation={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            color="#1A1A1A"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        
        <mesh position={[0.5, 0.2, 0.3]} rotation={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            color="#1A1A1A"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0, -0.2, 0.3]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.4, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            color="#1A1A1A"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function MilkyWay() {
  return (
    <group position={[0, 0, -20]} rotation={[0, 0, Math.PI / 6]}>
      {Array.from({ length: 1000 }).map((_, i) => {
        const t = i / 1000;
        const angle = t * Math.PI * 8;
        const radius = 15 + (t * 10);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const size = 0.02 + Math.random() * 0.03;
        
        return (
          <mesh
            key={i}
            position={[x, y, 0]}
          >
            <circleGeometry args={[size, 32]} />
            <meshBasicMaterial
              color="#2F2F2F"
              transparent
              opacity={0.3 - t * 0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function QCloud({ position, scale }: { position: number[], scale: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state: any) => {
    if (groupRef.current) {
      groupRef.current.position.y += Math.sin(state.clock.getElapsedTime() * 0.5 + position[0]) * 0.003;
      groupRef.current.position.x -= 0.008;
      if (groupRef.current.position.x < -20) {
        groupRef.current.position.x = 20;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-1.1, 0, 0]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[1.1, 0, 0]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.55, 0.4, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.55, 0.4, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

function MovingClouds() {
  const clouds = useMemo(
    () =>
      new Array(12).fill(null).map((_, i) => ({
        position: [
          (Math.random() * 40 - 20),
          Math.random() * 8 - 3,
          Math.random() * 4 - 8,
        ],
        scale: Math.random() * 0.9 + 1,
      })),
    []
  );

  return (
    <>
      {clouds.map((cloud, i) => (
        <QCloud
          key={i}
          position={cloud.position}
          scale={cloud.scale}
        />
      ))}
    </>
  );
}

function MovingStars() {
  return (
    <Stars
      radius={50}
      depth={50}
      count={3000}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  );
}

function AuroraLayer({ position, rotation, scale, delay = 0 }: { position: number[], rotation: number[], scale: number[], delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#00ff88") },
      uColorB: { value: new THREE.Color("#4facfe") },
      uIntensity: { value: 0.6 },
      uDelay: { value: delay },
    }),
    [delay]
  );

  useFrame(({ clock }: any) => {
    if (meshRef.current) {
      uniforms.uTime.value = clock.getElapsedTime() * 0.05;
    }
  });

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uIntensity;
    uniform float uDelay;
    
    varying vec2 vUv;
    varying float vElevation;

    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);
      float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
      return res*res;
    }
    
    void main() {
      vec2 uv = vUv;
      float time = uTime + uDelay;
      
      float wave1 = sin(uv.x * 3.0 + time) * 0.5 + 0.5;
      float wave2 = sin(uv.x * 5.0 - time * 0.5) * 0.5 + 0.5;
      float wave3 = sin(uv.y * 4.0 + time * 0.7) * 0.5 + 0.5;
      
      float n = noise(vec2(uv.x * 5.0 + time * 0.2, uv.y * 3.0 - time * 0.1));
      float finalWave = (wave1 * wave2 * wave3 + n * 0.5) * 0.7;
      
      vec3 color = mix(uColorA, uColorB, finalWave + vElevation * 0.2);
      float alpha = finalWave * uIntensity;
      alpha *= smoothstep(1.0, 0.2, abs(uv.y - 0.5) * 2.0);
      alpha *= smoothstep(0.9, 0.0, abs(uv.x - 0.5) * 1.5);
      alpha *= 0.4;
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const vertexShader = `
    uniform float uTime;
    uniform float uDelay;
    
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      vUv = uv;
      float time = uTime + uDelay;
      
      vec3 pos = position;
      float elevation = sin(pos.x * 0.2 + time * 0.5) * 2.0 +
                       sin(pos.y * 0.3 - time * 0.3) * 2.0;
      pos.z += elevation;
      vElevation = elevation;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <planeGeometry args={[120, 70, 50, 30]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function AuroraBorealis() {
  return (
    <group position={[0, 5, -40]}>
      <AuroraLayer 
        position={[0, 0, 0]}
        rotation={[0, 0, Math.PI * 0.05]}
        scale={[1, 1, 1]}
        delay={0}
      />
      <AuroraLayer 
        position={[10, 5, 5]}
        rotation={[0.1, 0, Math.PI * 0.02]}
        scale={[0.8, 0.8, 1]}
        delay={0.5}
      />
      <AuroraLayer 
        position={[-5, -3, 10]}
        rotation={[-0.1, 0, -Math.PI * 0.03]}
        scale={[0.9, 0.9, 1]}
        delay={1.0}
      />
    </group>
  );
}

export default function DayNightScene() {
  const { activeTheme } = useThemeStore();
  const isLight = activeTheme === "light";

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 45 }}
        style={{ background: isLight ? "transparent" : "#061621" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          castShadow
          color="#FFFFFF"
        />
        <pointLight 
          position={[-10, -10, -5]} 
          intensity={0.8} 
          color="#FFFFFF" 
        />
        <pointLight 
          position={[15, 15, 10]} 
          intensity={0.6} 
          color="#FFFFFF" 
        />

        {isLight ? (
          <>
            <MovingClouds />
            <Sun />
            <fog attach="fog" args={["#87CEEB", 1, 80]} />
          </>
        ) : (
          <>
            <Stars
              radius={100}
              depth={50}
              count={1000}
              factor={6}
              saturation={0}
              fade
              speed={1}
            />
            <AuroraBorealis />
            <Moon />
          </>
        )}
      </Canvas>
    </div>
  );
}
