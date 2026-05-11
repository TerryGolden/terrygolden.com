import { useMemo } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  startDelay?: number;
  isGolden?: boolean;
}

const AnimatedText = ({ text, className = '', style = {}, startDelay = 0, isGolden = false }: AnimatedTextProps) => {
  const letters = useMemo(() => text.split(''), [text]);
  
  return (
    <span className={`${className} ${isGolden ? 'golden-word' : ''}`} style={style}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className="hero-letter"
          style={{
            animationDelay: `${startDelay + index * 0.05}s`
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </span>
  );
};

export default AnimatedText;
