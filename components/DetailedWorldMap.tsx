import React from 'react';

// Detailed world map paths for equirectangular projection
// viewBox: 0,0,1000,500
// Longitude -180 to +180 maps to x: 0 to 1000
// Latitude +90 to -90 maps to y: 0 to 500

interface DetailedWorldMapProps {
  className?: string;
  showCountryBorders?: boolean;
}

const DetailedWorldMap: React.FC<DetailedWorldMapProps> = ({ className, showCountryBorders = true }) => {
  return (
    <g className={className}>
      {/* ============================================ */}
      {/* NORTH AMERICA */}
      {/* ============================================ */}
      
      {/* Canada */}
      <path 
        d="M55,85 L75,78 L100,72 L130,68 L160,65 L190,63 L220,62 L250,64 L275,68 L295,75 L310,85 L320,98 L325,112 L322,128 L315,142 L302,155 L285,165 L265,172 L242,176 L218,178 L195,176 L175,172 L158,165 L145,155 L138,142 L135,128 L137,112 L142,98 L150,88 L135,82 L115,80 L95,82 L78,88 L65,95 L55,105 L50,95 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Alaska */}
      <path 
        d="M50,95 L65,88 L85,85 L105,88 L120,95 L130,105 L125,118 L112,125 L95,128 L78,125 L62,118 L52,108 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Greenland */}
      <path 
        d="M355,48 L380,42 L410,45 L438,55 L455,72 L458,92 L448,110 L428,122 L402,125 L378,118 L360,102 L352,82 L350,62 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* United States */}
      <path 
        d="M138,142 L158,138 L180,140 L205,145 L228,152 L248,162 L262,175 L268,190 L265,205 L255,218 L240,228 L222,235 L200,238 L178,235 L160,228 L148,218 L142,205 L140,190 L142,175 L145,160 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Mexico */}
      <path 
        d="M148,218 L168,215 L188,220 L205,232 L215,248 L218,268 L212,288 L198,302 L178,308 L160,302 L148,288 L145,268 L148,248 L150,232 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Central America */}
      <path 
        d="M198,302 L218,305 L235,318 L245,335 L242,352 L228,365 L210,368 L198,358 L195,342 L198,325 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Caribbean Islands */}
      <path d="M268,232 L282,228 L295,238 L298,252 L288,262 L275,258 L265,248 Z" fill="url(#landGradient)" stroke={showCountryBorders ? "#4a90c2" : "none"} strokeWidth="0.5" />
      <path d="M302,245 L318,242 L328,255 L322,268 L308,272 L298,262 Z" fill="url(#landGradient)" stroke={showCountryBorders ? "#4a90c2" : "none"} strokeWidth="0.5" />
      
      {/* ============================================ */}
      {/* SOUTH AMERICA */}
      {/* ============================================ */}
      
      {/* Colombia */}
      <path 
        d="M245,335 L268,332 L288,345 L298,365 L292,385 L275,398 L255,395 L242,378 L242,358 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Brazil */}
      <path 
        d="M275,398 L305,392 L335,402 L358,425 L372,458 L375,495 L362,528 L338,555 L305,572 L268,575 L238,562 L218,538 L208,505 L212,468 L228,432 L252,408 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Argentina */}
      <path 
        d="M268,575 L295,568 L318,582 L332,608 L335,642 L322,678 L298,705 L268,718 L242,708 L225,682 L222,648 L232,612 L248,588 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* ============================================ */}
      {/* EUROPE */}
      {/* ============================================ */}
      
      {/* Iceland */}
      <path 
        d="M432,68 L448,62 L465,68 L472,82 L465,95 L448,100 L432,92 L428,78 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* United Kingdom */}
      <path 
        d="M458,102 L472,95 L485,100 L492,115 L488,132 L475,142 L460,138 L452,125 L455,112 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Ireland */}
      <path 
        d="M442,112 L455,108 L462,118 L458,132 L448,138 L438,130 L440,118 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Norway/Sweden/Finland (Scandinavia) */}
      <path 
        d="M505,52 L528,45 L555,52 L578,68 L592,92 L588,118 L572,138 L548,148 L522,145 L502,132 L492,112 L495,88 L498,68 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Denmark */}
      <path 
        d="M502,112 L515,108 L525,118 L522,132 L510,138 L500,130 L502,118 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* France */}
      <path 
        d="M468,138 L488,132 L508,138 L522,152 L525,172 L515,192 L495,202 L472,198 L458,185 L455,165 L460,148 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Spain */}
      <path 
        d="M448,185 L468,178 L488,185 L498,202 L492,222 L472,235 L448,238 L432,225 L428,205 L435,192 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Portugal */}
      <path 
        d="M428,195 L442,192 L448,208 L445,225 L432,232 L422,222 L422,205 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Germany */}
      <path 
        d="M508,128 L528,122 L548,128 L558,145 L555,165 L542,178 L522,182 L505,175 L498,158 L502,142 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Netherlands/Belgium */}
      <path 
        d="M488,128 L502,125 L512,135 L508,148 L495,152 L485,145 L488,135 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Switzerland */}
      <path 
        d="M502,165 L518,162 L528,172 L522,185 L508,188 L498,178 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Austria */}
      <path 
        d="M528,162 L548,158 L562,168 L558,182 L542,188 L528,182 L525,172 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Italy */}
      <path 
        d="M512,178 L528,172 L542,185 L548,205 L542,228 L525,245 L508,242 L498,222 L502,198 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Poland */}
      <path 
        d="M548,128 L572,122 L592,132 L598,152 L588,172 L568,178 L548,172 L542,152 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Czech Republic */}
      <path 
        d="M538,152 L555,148 L568,158 L565,172 L552,178 L538,172 L535,162 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Romania */}
      <path 
        d="M568,172 L592,168 L612,182 L615,202 L602,218 L578,222 L562,212 L558,192 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Ukraine */}
      <path 
        d="M592,145 L622,138 L652,148 L672,168 L675,192 L658,212 L628,218 L598,208 L585,188 L588,165 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Greece */}
      <path 
        d="M558,198 L578,192 L595,205 L598,225 L585,242 L565,245 L552,232 L552,215 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Malta */}
      <path 
        d="M522,242 L532,238 L538,248 L532,258 L522,255 L518,248 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* ============================================ */}
      {/* RUSSIA */}
      {/* ============================================ */}
      <path 
        d="M588,52 L648,42 L718,48 L798,62 L868,85 L922,118 L955,162 L962,212 L942,255 L898,288 L838,308 L772,318 L708,312 L652,295 L608,268 L578,235 L565,198 L568,158 L575,118 L582,82 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* ============================================ */}
      {/* MIDDLE EAST */}
      {/* ============================================ */}
      
      {/* Turkey */}
      <path 
        d="M575,195 L608,188 L642,198 L665,218 L668,242 L652,262 L622,272 L592,268 L572,252 L568,228 L572,208 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Israel */}
      <path 
        d="M598,248 L612,245 L618,262 L615,282 L602,288 L592,278 L595,262 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Azerbaijan */}
      <path 
        d="M632,218 L652,212 L668,225 L672,245 L658,262 L638,265 L625,252 L628,235 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Saudi Arabia / Arabian Peninsula */}
      <path 
        d="M605,262 L638,255 L672,268 L698,295 L708,332 L692,368 L658,388 L618,385 L588,362 L578,325 L585,288 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* ============================================ */}
      {/* AFRICA */}
      {/* ============================================ */}
      
      {/* Morocco/Algeria/Tunisia */}
      <path 
        d="M448,238 L488,232 L528,242 L555,262 L568,292 L558,325 L532,348 L498,358 L462,352 L438,332 L432,302 L438,268 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Egypt/Libya */}
      <path 
        d="M555,262 L592,255 L622,272 L638,302 L632,338 L608,368 L572,378 L542,368 L528,338 L538,302 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* West Africa */}
      <path 
        d="M438,332 L478,325 L518,338 L542,368 L538,408 L512,442 L472,458 L432,452 L408,425 L412,388 L425,355 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Central/East Africa */}
      <path 
        d="M542,368 L582,358 L618,378 L642,418 L648,468 L632,515 L592,548 L545,562 L502,555 L472,528 L465,488 L478,445 L505,408 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* South Africa */}
      <path 
        d="M545,562 L582,555 L615,575 L632,608 L628,648 L602,682 L562,698 L522,692 L492,668 L485,632 L498,598 L522,572 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Madagascar */}
      <path 
        d="M648,495 L668,485 L682,508 L685,548 L672,585 L652,598 L635,578 L638,535 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* ============================================ */}
      {/* SOUTH ASIA */}
      {/* ============================================ */}
      
      {/* India */}
      <path 
        d="M698,248 L738,238 L775,258 L798,295 L808,342 L792,392 L758,428 L712,445 L672,435 L648,402 L655,358 L672,312 L685,275 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Sri Lanka */}
      <path 
        d="M738,418 L755,412 L765,432 L758,455 L742,462 L728,448 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* ============================================ */}
      {/* SOUTHEAST ASIA */}
      {/* ============================================ */}
      
      {/* Thailand/Vietnam/Myanmar */}
      <path 
        d="M778,295 L815,285 L848,305 L868,342 L875,388 L858,428 L822,455 L782,462 L752,445 L742,405 L752,362 L765,325 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Malaysia/Indonesia */}
      <path 
        d="M808,445 L852,432 L898,452 L938,488 L952,535 L932,578 L882,602 L828,598 L785,572 L768,528 L778,482 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Philippines */}
      <path 
        d="M878,318 L905,308 L925,332 L932,368 L918,402 L892,415 L868,398 L865,362 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* ============================================ */}
      {/* EAST ASIA */}
      {/* ============================================ */}
      
      {/* China */}
      <path 
        d="M758,172 L812,158 L868,178 L915,212 L948,262 L955,318 L935,368 L892,405 L838,422 L782,415 L735,388 L708,345 L702,295 L718,248 L738,205 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Hong Kong (small marker) */}
      <path 
        d="M865,288 L875,285 L880,295 L875,305 L865,302 L862,295 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Japan */}
      <path 
        d="M918,168 L942,158 L962,178 L968,212 L958,252 L935,278 L912,282 L898,262 L902,225 L910,192 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* South Korea */}
      <path 
        d="M888,195 L908,185 L922,202 L918,232 L902,248 L882,242 L878,218 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Taiwan */}
      <path 
        d="M888,282 L905,275 L915,295 L908,318 L892,325 L882,308 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* ============================================ */}
      {/* AUSTRALIA & OCEANIA */}
      {/* ============================================ */}
      
      {/* Australia */}
      <path 
        d="M838,408 L895,392 L952,412 L998,455 L1020,512 L1002,568 L958,608 L898,628 L838,622 L785,595 L752,548 L748,495 L768,445 L802,418 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Tasmania */}
      <path 
        d="M895,628 L918,622 L932,645 L925,672 L905,682 L885,668 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* New Zealand */}
      <path 
        d="M985,545 L1012,532 L1028,568 L1022,618 L998,652 L968,658 L958,622 L968,578 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
      
      {/* Papua New Guinea */}
      <path 
        d="M918,378 L958,362 L995,385 L1012,425 L998,462 L962,478 L922,468 L908,432 Z"
        fill="url(#landGradient)"
        stroke={showCountryBorders ? "#4a90c2" : "none"}
        strokeWidth="0.5"
      />
    </g>
  );
};

export default DetailedWorldMap;
