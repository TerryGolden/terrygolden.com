import { ArtOfRaveStation } from '@/data/artOfRaveStations';

interface Props {
  station: ArtOfRaveStation;
  x: number;
  y: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

const RadioStationMarker = ({ station, x, y, isHovered, onHover }: Props) => (
  <g
    onMouseEnter={() => onHover(station.id)}
    onMouseLeave={() => onHover(null)}
    style={{ cursor: 'pointer' }}
  >
    {/* Glow effect when hovered */}
    {isHovered && (
      <>
        <circle cx={x} cy={y} r="20" fill="#a855f7" opacity="0.3">
          <animate attributeName="r" from="15" to="25" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.4" to="0.1" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx={x} cy={y} r="12" fill="none" stroke="#c084fc" strokeWidth="1.5" opacity="0.6" />
      </>
    )}
    {/* Main marker dot */}
    <circle
      cx={x}
      cy={y}
      r={isHovered ? 7 : 4}
      fill={isHovered ? '#c084fc' : '#a855f7'}
      stroke="#ffffff"
      strokeWidth={isHovered ? 2 : 1}
    >
      {isHovered && (
        <animate attributeName="r" values="6;8;6" dur="0.5s" repeatCount="indefinite" />
      )}
    </circle>
    {/* Pulsing ring animation */}
    {isHovered && (
      <circle cx={x} cy={y} r="10" fill="none" stroke="#a855f7" strokeWidth="1.5">
        <animate attributeName="r" from="7" to="18" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.8" to="0" dur="1.2s" repeatCount="indefinite" />
      </circle>
    )}
  </g>
);

export default RadioStationMarker;
