export type FilterType = 
  | 'gaussianBlur'
  | 'motionBlur'
  | 'noise'
  | 'sharpen'
  | 'colorCorrection';

export interface BaseFilter {
  id: string;
  type: FilterType;
  enabled: boolean;
}

export interface GaussianBlurFilter extends BaseFilter {
  type: 'gaussianBlur';
  radius: number; // 0-50
}

export interface MotionBlurFilter extends BaseFilter {
  type: 'motionBlur';
  distance: number; // 0-100
  angle: number; // 0-360
}

export interface NoiseFilter extends BaseFilter {
  type: 'noise';
  amount: number; // 0-100
  monochrome: boolean;
}

export interface SharpenFilter extends BaseFilter {
  type: 'sharpen';
  amount: number; // 0-100
}

export interface ColorCorrectionFilter extends BaseFilter {
  type: 'colorCorrection';
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  hue: number; // -180 to 180
}

export type LayerFilter = 
  | GaussianBlurFilter
  | MotionBlurFilter
  | NoiseFilter
  | SharpenFilter
  | ColorCorrectionFilter;
