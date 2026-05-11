export interface DropShadowEffect {
  type: 'dropShadow';
  enabled: boolean;
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
  opacity: number;
}

export interface InnerShadowEffect {
  type: 'innerShadow';
  enabled: boolean;
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
  opacity: number;
}

export interface OuterGlowEffect {
  type: 'outerGlow';
  enabled: boolean;
  blur: number;
  color: string;
  opacity: number;
  spread: number;
}

export interface InnerGlowEffect {
  type: 'innerGlow';
  enabled: boolean;
  blur: number;
  color: string;
  opacity: number;
  spread: number;
}

export interface BevelEffect {
  type: 'bevel';
  enabled: boolean;
  depth: number;
  size: number;
  soften: number;
  angle: number;
  altitude: number;
  highlightColor: string;
  shadowColor: string;
  highlightOpacity: number;
  shadowOpacity: number;
}

export interface GradientOverlayEffect {
  type: 'gradientOverlay';
  enabled: boolean;
  angle: number;
  colors: string[];
  opacity: number;
  blendMode: string;
}

export type LayerEffect = 
  | DropShadowEffect 
  | InnerShadowEffect 
  | OuterGlowEffect 
  | InnerGlowEffect 
  | BevelEffect 
  | GradientOverlayEffect;
