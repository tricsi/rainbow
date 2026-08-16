#version 300 es
precision highp float;

in vec2 vUv;
in vec4 vTint;
uniform sampler2D uImage;
out vec4 fColor;

void main() {
	fColor = texture(uImage, vUv) * vTint;
    fColor.rgb *= fColor.a;
}
