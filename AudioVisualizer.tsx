import { useEffect, useRef, useState } from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

interface VisualizerTheme {
  id: string;
  name: string;
  colors: string[];
  style: 'bars' | 'wave' | 'circular' | 'pulse';
}

export const themes: VisualizerTheme[] = [
  { id: 'golden', name: 'Golden', colors: ['#D4AF37', '#FFD700', '#C5A028'], style: 'bars' },
  { id: 'neon', name: 'Neon', colors: ['#FF00FF', '#00FFFF', '#FF0080'], style: 'bars' },
  { id: 'fire', name: 'Fire', colors: ['#FF4500', '#FF6347', '#FFD700'], style: 'wave' },
  { id: 'ocean', name: 'Ocean', colors: ['#00CED1', '#1E90FF', '#4169E1'], style: 'wave' },
  { id: 'matrix', name: 'Matrix', colors: ['#00FF00', '#39FF14', '#00DD00'], style: 'bars' },
  { id: 'sunset', name: 'Sunset', colors: ['#FF6B6B', '#FFA500', '#FF1493'], style: 'circular' },
  { id: 'pulse', name: 'Pulse', colors: ['#8B00FF', '#FF00FF', '#FF1493'], style: 'pulse' },
];

interface Props {
  theme: VisualizerTheme;
  height?: number;
}

export const AudioVisualizer = ({ theme, height = 80 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioRef, isPlaying } = useMusicPlayer();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationRef = useRef<number>();
  const [beatPulse, setBeatPulse] = useState(0);

  useEffect(() => {
    if (!audioRef.current || analyserRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);
      
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 256;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
    } catch (error) {
      console.error('Error initializing audio visualizer:', error);
    }
  }, [audioRef]);

  useEffect(() => {
    if (!isPlaying || !canvasRef.current || !analyserRef.current || !dataArrayRef.current) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Beat detection
      const bass = Array.from(dataArray.slice(0, 10)).reduce((a, b) => a + b, 0) / 10;
      if (bass > 200) setBeatPulse(1);
      else setBeatPulse(prev => Math.max(0, prev - 0.05));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (theme.style === 'bars') drawBars(ctx, dataArray, canvas, theme.colors, beatPulse);
      else if (theme.style === 'wave') drawWave(ctx, dataArray, canvas, theme.colors, beatPulse);
      else if (theme.style === 'circular') drawCircular(ctx, dataArray, canvas, theme.colors, beatPulse);
      else if (theme.style === 'pulse') drawPulse(ctx, dataArray, canvas, theme.colors, beatPulse);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isPlaying, theme, beatPulse]);

  return <canvas ref={canvasRef} width={800} height={height} className="w-full h-full" />;
};

const drawBars = (ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, colors: string[], pulse: number) => {
  const barWidth = canvas.width / data.length * 2.5;
  data.forEach((value, i) => {
    const barHeight = (value / 255) * canvas.height * (1 + pulse * 0.2);
    const x = i * barWidth;
    const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    ctx.fillStyle = gradient;
    ctx.shadowBlur = pulse * 20;
    ctx.shadowColor = colors[1];
    ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
  });
  ctx.shadowBlur = 0;
};

const drawWave = (ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, colors: string[], pulse: number) => {
  ctx.lineWidth = 3 + pulse * 2;
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  colors.forEach((color, i) => gradient.addColorStop(i / (colors.length - 1), color));
  ctx.strokeStyle = gradient;
  ctx.shadowBlur = pulse * 15;
  ctx.shadowColor = colors[1];
  ctx.beginPath();
  data.forEach((value, i) => {
    const x = (i / data.length) * canvas.width;
    const y = canvas.height / 2 + ((value - 128) / 128) * (canvas.height / 2) * (1 + pulse * 0.3);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;
};

const drawCircular = (ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, colors: string[], pulse: number) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;
  data.forEach((value, i) => {
    const angle = (i / data.length) * Math.PI * 2;
    const barHeight = (value / 255) * radius * 0.6 * (1 + pulse * 0.3);
    const x1 = centerX + Math.cos(angle) * radius;
    const y1 = centerY + Math.sin(angle) * radius;
    const x2 = centerX + Math.cos(angle) * (radius + barHeight);
    const y2 = centerY + Math.sin(angle) * (radius + barHeight);
    ctx.strokeStyle = colors[i % colors.length];
    ctx.lineWidth = 2 + pulse;
    ctx.shadowBlur = pulse * 10;
    ctx.shadowColor = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
  ctx.shadowBlur = 0;
};

const drawPulse = (ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement, colors: string[], pulse: number) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const avg = data.reduce((a, b) => a + b, 0) / data.length;
  const radius = (avg / 255) * Math.min(centerX, centerY) * (1 + pulse * 0.5);
  
  for (let i = 0; i < 3; i++) {
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * (1 - i * 0.3));
    gradient.addColorStop(0, colors[i] + '80');
    gradient.addColorStop(1, colors[i] + '00');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * (1 - i * 0.3), 0, Math.PI * 2);
    ctx.fill();
  }
};
