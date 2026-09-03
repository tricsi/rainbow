#version 300 es
precision highp float;

in vec2 vUv;
in vec4 vTint;
uniform vec2 uRes;
uniform sampler2D uImage;
out vec4 fColor;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
    // Chromatic aberration
    float a = 0.0012;

    vec4 c = texture(uImage, vUv);
    c.r = texture(uImage, vUv + vec2(a, 0.0)).r;
    c.b = texture(uImage, vUv - vec2(a, 0.0)).b;

    // Scanlines
    c.rgb *= 1.0 - 0.10 * (0.5 + 0.5 * sin(vUv.y * uRes.y * 3.14159265));
    
    // Stripes
    c.rgb *= 0.96 + 0.04 * sin(vUv.x * uRes.x * 31.4159265);
    
    // Noise
    c.rgb += (hash(gl_FragCoord.xy) - 0.5) * 0.025;

    c *= vTint;
    c.rgb *= c.a;
    fColor = c;
}
