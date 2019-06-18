
//Ark's Magic Circle ported to GLSL Sandbox


#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define iResolution resolution.xyxy
#define iMouse mouse*resolution
#define iGlobalTime time
#define PI 3.14159265359

vec2 rotate(vec2 p, float rad) {
    mat2 m = mat2(cos(rad), sin(rad), -sin(rad), cos(rad));
    return m * p;
}

vec2 translate(vec2 p, vec2 diff) {
    return p - diff;
}

vec2 scale(vec2 p, float r) {
    return p*r;
}

float circle(float pre, vec2 p, float r1, float r2, float power) {
    float leng = length(p);
    if (r1<leng && leng<r2) pre = 0.0;
    float d = min(abs(leng-r1), abs(leng-r2));
    float res = power / d;
    return clamp(pre + res, 0.0, 1.0);
}

float rectangle(float pre, vec2 p, vec2 half1, vec2 half2, float power) {
    p = abs(p);
    if ((half1.x<p.x || half1.y<p.y) && (p.x<half2.x && p.y<half2.y)) {
        pre = max(0.01, pre);
    }
    float dx1 = (p.y < half1.y) ? abs(half1.x-p.x) : length(p-half1);
    float dx2 = (p.y < half2.y) ? abs(half2.x-p.x) : length(p-half2);
    float dy1 = (p.x < half1.x) ? abs(half1.y-p.y) : length(p-half1);
    float dy2 = (p.x < half2.x) ? abs(half2.y-p.y) : length(p-half2);
    float d = min(min(dx1, dx2), min(dy1, dy2));
    float res = power / d;
	
    return clamp(pre + res, 0.0, 1.0);
}

float radiation(float pre, vec2 p, float r1, float r2, int num, float power) {
    float angle = 2.0*PI/float(num);
    float d = 1e10;
    for(int i=0; i<360; i++) {
        if (i>=num) break;
        float _d = (r1<p.y && p.y<r2) ? 
            abs(p.x) : 
        	min(length(p-vec2(0.0, r1)), length(p-vec2(0.0, r2)));
        d = min(d, _d);
        p = rotate(p, angle);
    }
    float res = power / d;
    return clamp(pre + res, 0.0, 1.0);
}

vec3 calc(vec2 p) {
    float dest = 0.0;
    p = scale(p, sin(PI*iGlobalTime/1.0)*0.02+1.1);
    {
        vec2 q = p;
        q = rotate(q, iGlobalTime * PI / 6.0);
        dest = circle(dest, q, 0.85, 0.9, 0.006);
        dest = radiation(dest, q, 0.87, 0.88, 36, 0.0008);
    }
    {
        vec2 q = p;
        q = rotate(q, iGlobalTime * PI / 6.0);
        float n = 12.0 * abs(sin(time*.1));
        float angle = PI / float(n);
        q = rotate(q, floor(atan(q.x, q.y)/angle + 0.5) * angle);
        for(int i=0; i>-1; i++) {
            dest = rectangle(dest, q, vec2(0.85/sqrt(2.0)), vec2(0.85/sqrt(2.0)), 0.0015);
            q = rotate(q, angle);
	    if(i == int(n)){break;};		
        }
    }
    {
        vec2 q = p;
        q = rotate(q, iGlobalTime * PI / 6.0);
        float n = 4.0 * abs(sin(time*.1));
        q = rotate(q, 2.0*PI/float(n)/2.0);
        float angle = 2.0*PI / float(n);
        for(int i=0; i>-1; i++) {
            dest = circle(dest, q-vec2(0.0, 0.875), 0.001, 0.05, 0.004);
            dest = circle(dest, q-vec2(0.0, 0.875), 0.001, 0.001, 0.008);
            q = rotate(q, angle);
	    if(i == int(n)){break;};
        }
    }
    {
        vec2 q = p;
        dest = circle(dest, q, 0.5, 0.55, 0.002);
    }
    {
        vec2 q = p;
        q = rotate(q, -iGlobalTime * PI / 6.0);
        const int n = 3;
        float angle = PI / float(n);
        q = rotate(q, floor(atan(q.x, q.y)/angle + 0.5) * angle);
        for(int i=0; i<n; i++) {
            dest = rectangle(dest, q, vec2(0.36, 0.36), vec2(0.36, 0.36), 0.0015);
            q = rotate(q, angle);
        }
    }
    {
        vec2 q = p;
        q = rotate(q, -iGlobalTime * PI / 6.0);
        const int n = 12;
        q = rotate(q, 2.0*PI/float(n)/2.0);
        float angle = 2.0*PI / float(n);
        for(int i=0; i<n; i++) {
            dest = circle(dest, q-vec2(0.0, 0.53), 0.001, 0.035, 0.004);
            dest = circle(dest, q-vec2(0.0, 0.53), 0.001, 0.001, 0.001);
            q = rotate(q, angle);
        }
    }
    {
        vec2 q = p;
        q = rotate(q, iGlobalTime * PI / 6.0);
        dest = radiation(dest, q, 0.25, 0.3, 12, 0.005);
    }
    {
        vec2 q = p;
    	q = scale(q, sin(PI*iGlobalTime/1.0)*0.04+1.1);
        q = rotate(q, -iGlobalTime * PI / 6.0);
        for(float i=0.0; i<6.0; i++) {
            float r = 0.13-i*0.01;
            q = translate(q, vec2(0.1, 0.0));
        	dest = circle(dest, q, r, r, 0.002);
        	q = translate(q, -vec2(0.1, 0.0));
        	q = rotate(q, -iGlobalTime * PI / 12.0);
        }
        dest = circle(dest, q, 0.04, 0.04, 0.004);
    }
    return pow(dest, 2.5) * vec3(1.0, 0.95, 0.8);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 uv = (iResolution.xy - fragCoord.xy*2.0) / min(iResolution.x, iResolution.y);
	fragColor = vec4(calc(uv),1.0);
}
void main( void ) {

	mainImage( gl_FragColor, gl_FragCoord.xy );

}

