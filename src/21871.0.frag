//TODO: Add hgPhase funtion
//Add sunlight, skylight, and indirect light colors
//Modifiy noise
//Modify "occlusion"

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// hash

float hash( float n )
{
    return fract(sin(n)*43758.5453);
}

// noise

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);

    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
}

// map


vec4 map( in vec3 p )
{
	//altitude
	float d = -0.005 - p.y +sin(time);

	//wind
	vec3 q = p - vec3(-1.0,0.0,0.9) * time;
	float f;
    f  = 0.5000*noise( q ); q = q*2.02;
    f += 0.2500*noise( q ); q = q*2.03;
    f += 0.1250*noise( q ); q = q*2.01;
    f += 0.0625*noise( q );

	//density
	d += 3.0 * f;

	d = clamp( d, 0.0, 1.0 );
	
	vec4 res = vec4( d );

	// diffuse is here actually
	res.xyz = mix( 1.15*vec3(1.0,0.95,0.8), vec3(0.7,0.7,0.7), res.x );
	
	return res;
}

// sundir

vec3 sundir = vec3(-1.0,-1.0,0.0);

// raymarch

vec4 raymarch( in vec3 ro, in vec3 rd )
{
	vec4 sum = vec4(0, 0, 0, 0);

	float t = 0.0;
	for(int i=0; i<64; i++)
	{
		if( sum.a > 0.99 ) continue;

		vec3 pos = ro + t*rd;
		vec4 col = map( pos );
		
		#if 1
		float dif =  clamp((col.w - map(pos+0.3*sundir).w)/0.6, 0.0, 1.0 );
		float constrast = 0.5;
		//fake for now, but will change soon
		vec3 skylighting = vec3(0.4,0.48,0.9)*0.2 + 0.15 ;
		vec3 sunlighting = vec3(1.0,1.0,1.0)*0.2 + 0.5;
        	vec3 lin = sunlighting + skylighting;
		col.xyz *= lin;
		col.xyz *= pow(col.xyz, vec3(constrast));
		#endif
		
		col.a *= 0.25;
		col.rgb *= col.a;

		sum = sum + col*(1.0 - sum.a);	

        #if 0
		t += 0.1;
		#else
		t += max(0.1,0.02*t);
		#endif
	}

	sum.xyz /= (0.001+sum.w);

	return clamp( sum, 0.0, 1.0 );
}


void main( void ) {
	
	vec2 q = gl_FragCoord.xy / resolution.xy;
	vec2 p = -1.0 + 2.0*q;
	p.x *= resolution.x/ resolution.y;
	vec2 mo = -1.0 + 2.0 / resolution.xy;
	
	    // camera
    	vec3 ro = 4.0*normalize(vec3(cos(2.75-3.0*mo.x), 0.7+(mo.y+1.0), sin(2.75-3.0*mo.x)));
	vec3 ta = vec3(0.0, 1.0, 0.0);
    	vec3 ww = normalize( ta - ro);
    	vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww ));
    	vec3 vv = normalize(cross(ww,uu));
    	vec3 rd = normalize( p.x*uu*1.0 + p.y*vv*1.0 + 1.0*ww );
	
	vec4 res = raymarch( ro, rd );

	float sun = clamp( dot(sundir,rd), 0.0, 1.0 );
	vec3 col = vec3(0.6,0.63,0.7) - rd.y*0.2*vec3(0.5,0.5,1.0) + 0.1 * 0.8;
	col += vec3(1.3,1.22,0.65)*sun * 0.2;
	col *= 0.95;
	
	col = mix( col, res.xyz, res.w );
	col += 0.2*vec3(0.645,0.4,0.2)*pow( sun, 0.0 );
	col *= col;
	col = col;
	
	gl_FragColor = vec4( col, 1.0 );
}
