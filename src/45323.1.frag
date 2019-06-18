/*
 * Original shader from: https://www.shadertoy.com/view/4ljSRR
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
float iTime = 0.0;
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
/* Gabor^2, by mattz.
   License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

   Goal: render the face of Zsa Zsa Gabor using the basis function proposed by Dennis Gabor.

   Original image: http://www.instyle.com/celebrity/gallery-vintage-photos-zsa-zsa-gabor
   Gabor filter: https://en.wikipedia.org/wiki/Gabor_filter
   More about Dennis: https://en.wikipedia.org/wiki/Dennis_Gabor
   More about Zsa Zsa: https://en.wikipedia.org/wiki/Zsa_Zsa_Gabor

   Fitting these 128 basis functions took several days (!) on my Macbook Pro (CPU only, no GPU).

   See https://mzucker.github.io/2016/08/01/gabor-2.html for more details.

   There was probably a faster way of doing it.

*/

const vec4 scl = vec4(0.00391389432485, 0.0122958616579, 0.00782778864971, 0.00391389432485);

float cnt = 0.0;

float gabor(vec2 p, vec4 q) {

    // Here we decode the vec4 q into 8 individual parameters:
    //
    //   q0 = (x, a, l, s)
    //   q1 = (y, p, t, h)
    //
    // with parameters given by
    //
    //   x: function center x coordinate
    //   y: function center y coordinate
    //   a: Gabor function spatial angle/orientation
    //   p: Gabor function phase offset
    //   l: Spatial wavelength
    //   s: Filter width perpendicular to sinusoidal component
    //   t: Filter width parallel to sinusoidal component
    //   h: Amplitude
    //
    vec4 q0 = floor(q*0.001953125)*scl;
    vec4 q1 = mod(q, 512.0)*scl;

    float cr = cos(q0.y);
    float sr = sin(q0.y);

    vec2 st = vec2(q0.w, q1.z);

    // Rotate and translate point
    p = mat2(cr, -sr, sr, cr) * (p - vec2(q0.x, q1.x));

    // Handle appearing at the start of filter
    q1.w *= smoothstep(cnt, cnt+0.5, iTime*32.0);
    ++cnt;

    // amplitude * gaussian * sinusoid
    return q1.w * exp(dot(vec2(-0.5), p*p/(st*st))) * cos(p.x*6.2831853/q0.z+q1.y);

}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

	vec2 p = (fragCoord.xy - 0.5*iResolution.xy) * 1.2 / iResolution.y;
    p.y = -p.y;
    p += 1.0;

    float k = 0.0;

    k += gabor(p, vec4(138752.,150667.,261821.,93447.));
    k += gabor(p, vec4(226145.,131739.,77399.,33587.));
    k += gabor(p, vec4(63748.,240999.,76311.,23447.));
    k += gabor(p, vec4(150173.,43128.,50197.,22225.));
    k += gabor(p, vec4(116939.,73605.,57898.,7679.));
    k += gabor(p, vec4(51.,227699.,261732.,68280.));
    k += gabor(p, vec4(50687.,129029.,38508.,17512.));
    k += gabor(p, vec4(117913.,117281.,32319.,32324.));
    k += gabor(p, vec4(96910.,174542.,26669.,26719.));
    k += gabor(p, vec4(117600.,70656.,17940.,16010.));
    k += gabor(p, vec4(108871.,58049.,51302.,47654.));
    k += gabor(p, vec4(167609.,91829.,28204.,28213.));
    k += gabor(p, vec4(90467.,245116.,36375.,7167.));
    k += gabor(p, vec4(82369.,164365.,30329.,30267.));
    k += gabor(p, vec4(225089.,129997.,6684.,4095.));
    k += gabor(p, vec4(205005.,127709.,12815.,12982.));
    k += gabor(p, vec4(175993.,130600.,23563.,11978.));
    k += gabor(p, vec4(30069.,10115.,23055.,2559.));
    k += gabor(p, vec4(137435.,215947.,14350.,14446.));
    k += gabor(p, vec4(226165.,115949.,47659.,18501.));
    k += gabor(p, vec4(71368.,123529.,23052.,12515.));
    k += gabor(p, vec4(102042.,215281.,7176.,2857.));
    k += gabor(p, vec4(68218.,214988.,25632.,25694.));
    k += gabor(p, vec4(115954.,5782.,40979.,2930.));
    k += gabor(p, vec4(123338.,133796.,77334.,23039.));
    k += gabor(p, vec4(203913.,117.,38944.,33329.));
    k += gabor(p, vec4(227964.,132231.,189988.,12174.));
    k += gabor(p, vec4(63649.,26205.,10763.,10940.));
    k += gabor(p, vec4(97912.,45398.,12810.,1739.));
    k += gabor(p, vec4(106690.,166508.,16387.,2559.));
    k += gabor(p, vec4(54873.,146884.,58426.,58402.));
    k += gabor(p, vec4(178346.,81559.,14341.,2559.));
    k += gabor(p, vec4(185649.,144747.,16391.,1535.));
    k += gabor(p, vec4(120084.,199932.,10249.,4361.));
    k += gabor(p, vec4(100115.,63452.,18981.,18968.));
    k += gabor(p, vec4(180941.,96255.,18962.,18500.));
    k += gabor(p, vec4(63718.,126911.,34827.,11485.));
    k += gabor(p, vec4(61203.,92616.,23582.,18498.));
    k += gabor(p, vec4(172754.,196259.,16390.,6559.));
    k += gabor(p, vec4(177015.,230484.,25173.,24616.));
    k += gabor(p, vec4(157875.,57828.,4618.,4837.));
    k += gabor(p, vec4(105263.,51711.,17997.,17939.));
    k += gabor(p, vec4(167049.,203925.,24612.,15906.));
    k += gabor(p, vec4(144087.,67302.,14874.,14931.));
    k += gabor(p, vec4(150391.,43665.,53778.,4032.));
    k += gabor(p, vec4(207569.,22528.,15906.,8795.));
    k += gabor(p, vec4(137039.,173193.,27653.,2559.));
    k += gabor(p, vec4(206047.,207878.,18958.,7797.));
    k += gabor(p, vec4(228200.,131090.,5678.,5799.));
    k += gabor(p, vec4(113976.,64789.,7689.,6396.));
    k += gabor(p, vec4(83114.,62975.,15903.,13894.));
    k += gabor(p, vec4(117517.,132261.,12814.,11335.));
    k += gabor(p, vec4(149162.,180114.,75786.,4971.));
    k += gabor(p, vec4(219290.,259568.,7701.,3469.));
    k += gabor(p, vec4(9233.,249362.,21102.,14898.));
    k += gabor(p, vec4(12348.,105446.,15436.,10340.));
    k += gabor(p, vec4(147344.,213862.,14917.,14877.));
    k += gabor(p, vec4(205125.,182142.,82962.,5368.));
    k += gabor(p, vec4(161978.,187391.,5644.,5760.));
    k += gabor(p, vec4(88210.,61601.,16388.,2047.));
    k += gabor(p, vec4(78650.,114304.,15885.,2047.));
    k += gabor(p, vec4(115065.,71687.,15886.,7819.));
    k += gabor(p, vec4(93059.,235007.,12814.,10350.));
    k += gabor(p, vec4(196884.,27136.,12303.,5338.));
    k += gabor(p, vec4(171860.,258580.,24079.,15418.));
    k += gabor(p, vec4(183655.,243097.,21510.,2559.));
    k += gabor(p, vec4(191277.,128656.,12293.,3583.));
    k += gabor(p, vec4(157553.,43644.,22026.,2014.));
    k += gabor(p, vec4(76369.,27135.,14370.,10903.));
    k += gabor(p, vec4(194876.,76800.,7683.,3357.));
    k += gabor(p, vec4(150218.,45734.,3076.,2201.));
    k += gabor(p, vec4(230711.,259797.,3613.,3813.));
    k += gabor(p, vec4(143536.,47519.,32771.,2435.));
    k += gabor(p, vec4(73356.,64451.,16409.,6741.));
    k += gabor(p, vec4(228480.,129023.,2581.,2683.));
    k += gabor(p, vec4(193434.,117680.,17930.,4095.));
    k += gabor(p, vec4(71419.,126168.,4112.,2190.));
    k += gabor(p, vec4(94887.,188293.,41993.,4095.));
    k += gabor(p, vec4(221843.,258986.,4634.,4788.));
    k += gabor(p, vec4(254463.,215580.,25241.,24612.));
    k += gabor(p, vec4(36217.,144383.,23056.,9348.));
    k += gabor(p, vec4(110799.,84416.,10835.,10767.));
    k += gabor(p, vec4(92864.,216574.,22019.,2047.));
    k += gabor(p, vec4(21781.,110203.,209421.,13785.));
    k += gabor(p, vec4(42162.,246368.,12299.,11902.));
    k += gabor(p, vec4(178010.,28532.,27661.,2559.));
    k += gabor(p, vec4(75445.,144528.,29199.,3583.));
    k += gabor(p, vec4(66694.,194418.,24581.,5119.));
    k += gabor(p, vec4(230325.,1590.,13360.,7865.));
    k += gabor(p, vec4(92351.,97505.,5635.,2956.));
    k += gabor(p, vec4(75010.,124415.,12335.,7234.));
    k += gabor(p, vec4(97906.,169101.,54817.,5119.));
    k += gabor(p, vec4(106161.,83324.,3589.,2713.));
    k += gabor(p, vec4(113835.,235844.,9225.,3708.));
    k += gabor(p, vec4(208627.,241050.,10768.,10482.));
    k += gabor(p, vec4(168661.,177062.,8706.,2559.));
    k += gabor(p, vec4(181467.,127455.,17938.,7786.));
    k += gabor(p, vec4(197869.,146292.,28173.,2559.));
    k += gabor(p, vec4(117558.,187903.,9736.,3285.));
    k += gabor(p, vec4(222982.,25466.,20483.,3071.));
    k += gabor(p, vec4(235759.,128791.,8256.,8275.));
    k += gabor(p, vec4(29057.,162597.,13888.,8215.));
    k += gabor(p, vec4(190357.,256223.,13345.,4260.));
    k += gabor(p, vec4(119069.,231138.,8715.,6737.));
    k += gabor(p, vec4(170876.,121183.,16906.,10329.));
    k += gabor(p, vec4(154320.,242687.,6147.,3239.));
    k += gabor(p, vec4(115981.,136703.,12808.,6807.));
    k += gabor(p, vec4(120081.,193574.,9734.,2257.));
    k += gabor(p, vec4(134533.,188242.,26635.,1665.));
    k += gabor(p, vec4(138043.,77525.,7686.,2271.));
    k += gabor(p, vec4(130835.,198313.,5122.,1988.));
    k += gabor(p, vec4(102193.,56831.,6148.,1687.));
    k += gabor(p, vec4(111902.,152880.,20531.,7206.));
    k += gabor(p, vec4(174288.,78489.,3075.,3151.));
    k += gabor(p, vec4(96671.,127941.,6669.,4272.));
    k += gabor(p, vec4(210122.,17650.,13840.,13455.));
    k += gabor(p, vec4(203063.,194037.,33825.,33307.));
    k += gabor(p, vec4(149725.,95402.,11796.,11817.));
    k += gabor(p, vec4(66297.,11373.,17922.,2559.));
    k += gabor(p, vec4(179440.,110836.,5633.,1319.));
    k += gabor(p, vec4(43681.,262028.,25090.,3071.));
    k += gabor(p, vec4(101192.,233983.,8200.,8304.));
    k += gabor(p, vec4(202536.,155036.,12293.,2559.));
    k += gabor(p, vec4(197017.,107008.,8719.,2338.));
    k += gabor(p, vec4(163006.,200413.,3076.,2203.));
    k += gabor(p, vec4(122700.,196047.,6149.,5280.));
    k += gabor(p, vec4(138048.,193231.,17925.,1322.));
    k += gabor(p, vec4(205566.,243712.,10761.,9529.));

    // Don't add speckles in preview!
    if (iResolution.y >= 200.0) {
        // borrowed Dave Hoskins' hash from https://www.shadertoy.com/view/4djSRW
        p = fract(p * vec2(443.8975,397.2973));
        p += dot(p.xy, p.yx+19.19);
        k += 0.12 * (fract(p.x * p.y)*2.0 - 1.0);
    }

    fragColor.xyz = vec3(0.5*k + 0.5);
    fragColor.w = 1.;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
  iTime = mod(time,6.0);
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
