import React, { useEffect, useRef } from "react";
import * as THREE from "three"

const WebGL: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    class Stage {
      private scene: THREE.Scene;
      private camera: THREE.OrthographicCamera;
      private renderer: THREE.WebGLRenderer;

      constructor() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(
          -1,
          1,
          1,
          -1,
          0,
          -1
        );

        this.renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current!,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x666666);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.updateCamera();
        window.addEventListener("resize", this.updateCamera);
      }

      updateCamera = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      };

      render = () => {
        this.renderer.render(this.scene, this.camera);
      };

      getScene = () => this.scene;
    }

    class Mesh {
      private stage: Stage;
      private mesh: THREE.Mesh;
      private uniforms: Record<string, any>;

      constructor(stage: Stage) {
        this.stage = stage;

        const canvasWidth = window.innerWidth;
        const canvasHeight = window.innerHeight;

        this.uniforms = {
          resolution: { value: [canvasWidth, canvasHeight] },
          time: { value: 0.0 },
          xScale: { value: 1.0 },
          yScale: { value: 0.5 },
          distortion: { value: 0.05 },
        };

        const positions = new THREE.BufferAttribute(
          new Float32Array([
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
          ]),
          3
        );

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", positions);

        const vertexShader = `
          attribute vec3 position;
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `;

        const fragmentShader = `
          precision highp float;
          uniform vec2 resolution;
          uniform float time;
          uniform float xScale;
          uniform float yScale;
          uniform float distortion;

          void main() {
            vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

            float d = length(p) * distortion;

            float rx = p.x * (1.0 + d);
            float gx = p.x;
            float bx = p.x * (1.0 - d);

            float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
            float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
            float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

            gl_FragColor = vec4(r, g, b, 1.0);
          }
        `;

        const material = new THREE.RawShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: this.uniforms,
          side: THREE.DoubleSide,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.stage.getScene().add(this.mesh);
      }

      animate = () => {
        this.uniforms.time.value += 0.01;
      };
    }

    const stage = new Stage();
    const mesh = new Mesh(stage);

    const animate = () => {
      stage.render();
      mesh.animate();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", stage.updateCamera);
    };
  }, []);

  return <canvas id="webgl-canvas" ref={canvasRef} />;
};

export default WebGL;
