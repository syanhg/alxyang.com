import React, { useRef, useEffect, useMemo } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import { Canvas, useFrame, useThree } from "https://esm.sh/@react-three/fiber@8.15.0";
import { useTexture } from "https://esm.sh/@react-three/drei@9.88.0";
import * as THREE from "https://esm.sh/three@0.158.0";

let currentImageUrl = "photo1.png";

const images = [
  "photo1.png",
  "photo2.png",
  "photo3.png"
];

const LiquidGlass = ({ imageUrl }) => {
  const texture = useTexture(imageUrl);
  const { size } = useThree();
  const { lerp } = THREE.MathUtils;

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uMouse: { value: { x: 0, y: 0 } },
        uRes: { value: { x: size.width, y: size.height } },
        uTexRes: {
          value: { x: texture.source.data.width, y: texture.source.data.height }
        },
        uTexture: { value: texture }
      },
      vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4( position, 1.0 );
      }
    `,
      fragmentShader: /* glsl */ `
      varying vec2 vUv;
      uniform vec2 uRes;
      uniform vec2 uTexRes;
      uniform vec2 uMouse;
      uniform sampler2D uTexture;
      
      #define PI    3.14159265
      #define S     smoothstep
      #define R     uRes
      #define PX(a) a/R.y
      
      vec2 CoverUV(vec2 u, vec2 s, vec2 i) {
          float rs = s.x / s.y;
          float ri = i.x / i.y;
          vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
          vec2 o = (rs < ri ? vec2((st.x - s.x) / 2.0, 0.0) : vec2(0.0, (st.y - s.y) / 2.0)) / st;
          return u * s / st + o;
      }

      float Box (vec2 p, vec2 b) {
          vec2 d = abs(p) - b;
          return length(max(d,0.)) + min(max(d.x,d.y),0.);
      }
      
      float IconPhoto (vec2 uv) {
          float c = 0.;
          for (float i = 0.; i < 1.; i+=1./8.) {
              vec2 u = uv;
              u *= mat2(cos(i * 2. * PI), sin(-(i * 2. * PI)), sin(i * 2. * PI), cos(i * 2. * PI));
              u += vec2(0., PX(40.));
              float b = Box(u, vec2(PX(0.), PX(13.)));
              c += S(PX(1.5), 0., b - PX(15.)) * .2;
          }
          return c;
      }

      vec4 LiquidGlass (sampler2D tex, vec2 uv, float direction, float quality, float size) {
          vec2 radius = size/R;
          vec4 color = texture2D(tex, uv);

          for (float d = 0.; d < PI; d += PI/direction) {
            for (float i = 1./quality; i <= 1.; i += 1./quality) {
              color += texture(tex, uv + vec2(cos(d),sin(d)) * radius * i);		
            }
          }

          color /= quality * direction;
          return color;
      }
      
      vec4 Icon (vec2 uv) {
          float box = Box(uv, vec2(PX(50.))),
                boxShape = S(PX(1.5), 0., box - PX(50.)),
                boxDisp = S(PX(35.), 0., box - PX(25.)),
                boxLight = boxShape * S(0., PX(30.), box - PX(40.)),
                icon = IconPhoto(uv);
          return vec4(boxShape, boxDisp, boxLight, icon);
      }

      void main() {
        vec2 uv = CoverUV(vUv, uRes, uTexRes);
        vec2 st = (gl_FragCoord.xy-.5*R)/R.y;
        vec2 M  = uMouse * .5;
        M.x *= uRes.x/uRes.y;
        
        vec3 tex = texture2D(uTexture, uv).rgb;
        
        vec4 icon = Icon(st-M);
    
        vec2 uv2 = uv - M;
        uv2 *= S(-.6, 1., icon.y);
        uv2 += M;

        vec3 col = mix(tex * .8, .1 + LiquidGlass(uTexture, uv2, 10., 10., 20.).rgb * .7, icon.x);
        col += icon.z * .9 + icon.w;

        gl_FragColor = vec4(col, 1.);
      }
  `
    }),
    [size, texture]
  );

  useFrame(({ pointer }) => {
    shaderArgs.uniforms.uMouse.value.x = lerp(
      shaderArgs.uniforms.uMouse.value.x,
      pointer.x,
      0.1
    );
    shaderArgs.uniforms.uMouse.value.y = lerp(
      shaderArgs.uniforms.uMouse.value.y,
      pointer.y,
      0.1
    );
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial args={[shaderArgs]} transparent={true} />
    </mesh>
  );
};

const Scene = ({ imageUrl }) => {
  return (
    <Canvas dpr={[1, 2]}>
      <LiquidGlass imageUrl={imageUrl} />
    </Canvas>
  );
};

let root = null;

// Lightbox functionality
window.openLightbox = function(index) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const container = document.getElementById('liquidGlassContainer');
  
  lightboxImg.src = images[index];
  currentImageUrl = images[index];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Initialize Three.js scene
  if (root) {
    root.unmount();
  }
  root = createRoot(container);
  root.render(<Scene imageUrl={currentImageUrl} />);
};

window.closeLightbox = function() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  
  if (root) {
    root.unmount();
    root = null;
  }
};

// Close on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeLightbox();
  }
});

// Restart carousel animation when it ends
const track = document.querySelector('.carousel-track');
if (track) {
  track.addEventListener('animationiteration', () => {
    track.style.animation = 'none';
    setTimeout(() => {
      track.style.animation = 'scroll 30s linear infinite';
    }, 10);
  });
}
