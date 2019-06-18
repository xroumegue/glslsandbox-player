/*
 * Original shader from: https://www.shadertoy.com/view/Ml2BRm
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// --------[ Original ShaderToy begins here ]---------- //
const vec3 V  = vec3(0,.001,100);
const vec3 BG = vec3(0.0);
const vec3 Amb= vec3(0.01);
const vec3 PI = vec3(1.5707963,3.1415927,6.2831853);
const float BPM = 120.;
vec2 uv;
float tick = 0.0;

float rnd(vec3 s){s=fract(s*443.8975);s+=dot(s,s.yzx+19.19);return fract(s.x*s.y*s.z);}
vec4  gamna(vec3 c){return vec4(pow(c,vec3(1./2.2)),1);}
vec3  hsv(float h,float s,float v){return((clamp(abs(fract(h+vec3(0,2,1)/3.)*6.-3.)-1.,0.,1.)-1.)*s+1.)*v;}
mat3  camera(vec3 p, vec3 t, vec3 h){vec3 w=normalize(p-t),u=normalize(cross(w,h));return mat3(u,normalize(cross(u,w)),w);}
mat3  euler(float h, float p, float r){float a=sin(h),b=sin(p),c=sin(r),d=cos(h),e=cos(p),f=cos(r);return mat3(f*e,c*e,-b,f*b*a-c*d,f*d+c*b*a,e*a,c*a+f*b*d,c*b*d-f*a,e*d);}
float dfPln(vec3 p, vec3 n, float d){return dot(p,n)+d;}
float dfBox(vec3 p, vec3 b, float r){return length(max(abs(p)-b,0.))-r;}
float dfDdc(vec3 p, float r) {vec4 v=vec4(-.8507,.8507,.5257,0);return max(max(abs(dot(p,v.wyz)),max(abs(dot(p,v.wxz)),abs(dot(p,v.zwy)))),max(abs(dot(p,v.zwx)),max(abs(dot(p,v.yzw)),abs(dot(p,v.xzw)))))-r;}

const vec3 r = vec3(4.8,0.1,0.3), t = vec3(4,-4,0);

vec3 trans(vec3 p) {
    return (p - vec3(0,10,0)) * euler(tick/21.*PI.z,tick/16.*PI.z,0.0);
}

float trick(vec3 p) {
    float d = V.z;
    p = trans(p);
    d = min(d, dfBox(p-t.yzy, r.yxy, r.z));
    return d;
}

float map(vec3 p, bool trick) {
    mat3 rot = euler(-tick/3.*PI.z,tick/5.*PI.z,0.0);
    float d = dfPln(p, vec3(0,1,0), 0.);
    p = trans(p);
    d = min(d, dfDdc((p+vec3(sin(tick/8.*PI.z)*10.,0.,cos(tick/16.*PI.z)*8.))*rot, 1.5));
    d = min(d, dfDdc((p+vec3(cos(tick/16.*PI.z+PI.x)*8.,sin(tick/8.*PI.z+PI.y)*8.,0.))*rot, 1.));
    d = min(d, dfBox(p-t.zxy, r.xyy, r.z));
    d = min(d, dfBox(p-t.zyy, r.xyy, r.z));
    d = min(d, dfBox(p-t.xzx, r.yxy, r.z));
    d = min(d, dfBox(p-t.yzx, r.yxy, r.z));
    d = min(d, dfBox(p-t.xzy, r.yxy, r.z));
    d = min(d, dfBox(p-t.yzy, r.yxy, r.z));
    d = min(d, dfBox(p-t.yxz, r.yyx, r.z));
    d = min(d, dfBox(p-t.yyz, r.yyx, r.z));
    if (trick) {
        d = min(d, dfBox(p-t.zxx, r.xyy, r.z));
        d = min(d, dfBox(p-t.zyx, r.xyy, r.z));
        d = min(d, dfBox(p-t.xxz, r.yyx, r.z));
        d = min(d, dfBox(p-t.xyz, r.yyx, r.z));
    }
    return d;
}

vec3 background(vec3 pos, vec3 dir, inout float bld) {
    bld = 0.;
    return BG;
}

vec3 diff(vec3 nml, vec3 lit, vec3 col){return max(dot(nml,lit)*col,0.);}
float shad(vec3 pos, vec3 lit){float s=V.z,t=.05,d;for(int i=20;i!=0;--i){t+=max(d=map(pos+lit*t, true),.05);s=min(s,d/t);if(t>20.)break;}return clamp(s*.2,0.,1.);}
float occl(vec3 pos, vec3 nml){float s=0.;for(float t=.01;t<.5;t+=.05){s+=t-map(pos+nml*t, true);}return clamp(1.-s*.1,0.,1.);}

bool tricktrace(vec3 pos, vec3 dir) {
    float t = 0., d;
    for (int i=80; i!=0; --i) {
        t += (d = trick(pos + dir * t));
        if (d < V.y) break;
        if (t > V.z) return true;
    }
    return false;
}

vec3 trace(inout vec3 pos, inout vec3 dir, inout float bld) {
    float t = 0., d;
    bool trick = tricktrace(pos, dir);
    for (int i=80; i!=0; --i) {
        t += (d = map(pos + dir * t, trick));
        if (d < V.y) break;
        if (t > V.z) return bld * background(pos, dir, bld);
    }
    vec3 p = pos + dir * t;
    vec3 n = normalize(vec3(map(p+V.yxx, true),map(p+V.xyx, true),map(p+V.xxy, true))-map(p, true));
    vec3 c = vec3(1);
    vec3 ldir = normalize(vec3(sin(tick/24.*PI.z)*20.,20.,cos(tick/24.*PI.z)*20.) - p);
    vec3 lcol = diff(n, ldir, hsv(tick/16.,0.5,1.0)*10.) * shad(p, ldir) * occl(p, n) + Amb;
    vec3 ldir2 = normalize(vec3(0.,25,0.) - p);
    vec3 lcol2 = diff(n, ldir2, hsv(tick/16.+0.33,0.5,1.0)*10.) * shad(p, ldir2) * occl(p, n) + Amb;
    vec3 col = c * (lcol + lcol2);
    float b=bld*.4;
    pos = p + n*V.y;
    dir = reflect(dir, n);
    bld *= .6;
    return mix(col, BG, clamp(length(p.xz)/24.,0.,1.))*b;
}

vec3 render(in vec3 pos, in vec3 dir) {
    float b = 1.;
    vec3 col = trace(pos, dir, b);
    if (b > V.y) col += trace(pos, dir, b);
    if (b > V.y) col += trace(pos, dir, b);
    return col;
}

vec4 entryPoint(vec2 fragCoord) {
    uv = (fragCoord * 2.-resolution) / resolution.y;
    tick = time * BPM / 60.;

    float scan = 1., dist = 0.;
    vec3 pos = vec3(25.,18.,0.);
        vec2 r = mouse/resolution*2.-1.;
        pos = vec3(cos(r.x*PI.y)*25.,r.y*12.+18.,sin(r.x*PI.y)*25.);
    vec3 dir = camera(pos, vec3(0,7.5,0), vec3(0,1,0)) * normalize(vec3(uv+vec2(dist,0),-2));
    return gamna(render(pos, dir)) * scan;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    gl_FragColor = entryPoint(gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}
