"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function SonarBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 4.5, 0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Brand green color
    const brandGreen = new THREE.Color(0x2d7a5f);
    const dimGreen = new THREE.Color(0x2d7a5f);

    // Concentric rings
    const rings = [1.2, 2.0, 2.8, 3.6];
    rings.forEach((radius) => {
      const geometry = new THREE.RingGeometry(radius - 0.005, radius + 0.005, 128);
      const material = new THREE.MeshBasicMaterial({
        color: dimGreen,
        transparent: true,
        opacity: 0.04,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = -Math.PI / 2;
      scene.add(ring);
    });

    // Center dot
    const dotGeom = new THREE.CircleGeometry(0.06, 32);
    const dotMat = new THREE.MeshBasicMaterial({
      color: brandGreen,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    const dot = new THREE.Mesh(dotGeom, dotMat);
    dot.rotation.x = -Math.PI / 2;
    scene.add(dot);

    // Sweep line (thin triangle sector)
    const sweepGeom = new THREE.CircleGeometry(3.8, 1, 0, 0.04);
    const sweepMat = new THREE.MeshBasicMaterial({
      color: brandGreen,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    });
    const sweep = new THREE.Mesh(sweepGeom, sweepMat);
    sweep.rotation.x = -Math.PI / 2;
    scene.add(sweep);

    // Sweep trail (wider, faded)
    const trailGeom = new THREE.CircleGeometry(3.8, 32, 0, 0.5);
    const trailMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        uColor: { value: brandGreen },
        uOpacity: { value: 0.05 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          float alpha = vUv.x * uOpacity;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
    const trail = new THREE.Mesh(trailGeom, trailMat);
    trail.rotation.x = -Math.PI / 2;
    scene.add(trail);

    // Blip dots (threats detected on the radar)
    const blips: { mesh: THREE.Mesh; angle: number; dist: number; fadeStart: number }[] = [];
    const blipAngles = [0.8, 2.1, 3.5, 4.8, 5.6];
    const blipDists = [1.4, 2.3, 1.8, 3.1, 2.6];
    blipAngles.forEach((angle, i) => {
      const g = new THREE.CircleGeometry(0.04, 16);
      const m = new THREE.MeshBasicMaterial({
        color: brandGreen,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.rotation.x = -Math.PI / 2;
      const dist = blipDists[i];
      mesh.position.set(Math.cos(angle) * dist, 0.001, Math.sin(angle) * dist);
      scene.add(mesh);
      blips.push({ mesh, angle, dist, fadeStart: -1 });
    });

    let animId: number;
    const clock = new THREE.Clock();

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const sweepAngle = t * 0.5; // slow rotation

      sweep.rotation.z = sweepAngle;
      trail.rotation.z = sweepAngle;

      // Pulse blips when sweep passes over them
      const currentAngle = (sweepAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      blips.forEach((blip) => {
        const diff = ((currentAngle - blip.angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (diff < 0.15 && diff > 0) {
          blip.fadeStart = t;
        }
        if (blip.fadeStart > 0) {
          const elapsed = t - blip.fadeStart;
          const mat = blip.mesh.material as THREE.MeshBasicMaterial;
          mat.opacity = Math.max(0, 0.25 - elapsed * 0.1);
        }
      });

      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none opacity-15 dark:opacity-25"
      aria-hidden="true"
    />
  );
}
