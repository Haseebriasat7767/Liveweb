'use client';

import { cn } from '@/lib/utils';
import type { PlanLevel, PlanRoom } from '@/data';

const KIND_FILL: Record<PlanRoom['kind'], string> = {
  principal: '#EFEBE4',
  private: '#E7E2DA',
  service: '#DCD6CC',
  exterior: '#F3F0EA',
  circulation: '#E2DCD3',
};

const LEGEND: Array<{ kind: PlanRoom['kind']; label: string }> = [
  { kind: 'principal', label: 'Principal rooms' },
  { kind: 'private', label: 'Private rooms' },
  { kind: 'service', label: 'Service' },
  { kind: 'circulation', label: 'Circulation' },
  { kind: 'exterior', label: 'Outdoor' },
];

type PlanDrawingProps = {
  level: PlanLevel;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (room: PlanRoom) => void;
  onHover: (id: string | null) => void;
};

/**
 * The plan itself. Interactive rooms are real buttons: focusable, hoverable,
 * announced to screen readers, and styled entirely from the design tokens.
 */
export function PlanDrawing({
  level,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: PlanDrawingProps) {
  const isSite = level.id === 'site';

  return (
    <div className="relative">
      <div className="no-scrollbar overflow-x-auto">
        <svg
          viewBox="0 0 1200 720"
          role="group"
          aria-label={`${level.name} plan — ${level.rooms.length} rooms`}
          className="h-auto w-full min-w-[620px] select-none"
        >
          <defs>
            <pattern id="hatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#0C0C0D" strokeWidth="1" opacity="0.05" />
            </pattern>
            <pattern id="water" width="14" height="14" patternTransform="rotate(-45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="14" stroke="#5B6B73" strokeWidth="1.4" opacity="0.35" />
            </pattern>
          </defs>

          {/* Stage */}
          <rect x="0" y="0" width="1200" height="720" fill="#FBF9F6" />

          {/* Water band on the site plan */}
          {isSite && <rect x="0" y="640" width="1200" height="80" fill="url(#water)" opacity="0.6" />}

          {/* Overall footprint outline */}
          <rect
            x="52"
            y="52"
            width="1036"
            height="616"
            fill="none"
            stroke="#0C0C0D"
            strokeOpacity="0.14"
            strokeWidth="1.5"
            strokeDasharray="2 6"
          />

          {/* Rooms */}
          {level.rooms.map((room) => {
            const isSelected = room.id === selectedId;
            const isHovered = room.id === hoveredId && !isSelected;
            const showLabel =
              (room.w ?? 0) * (room.h ?? 0) > 12000 || (room.w ?? 0) > 150 || (room.points ? true : false);

            return (
              <g
                key={`${level.id}-${room.id}`}
                role="button"
                tabIndex={room.minor ? -1 : 0}
                aria-label={`${room.name}, ${room.area}, ${room.dimensions}`}
                aria-pressed={isSelected}
                className="cursor-pointer outline-none"
                onClick={() => onSelect(room)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelect(room);
                  }
                }}
                onMouseEnter={() => onHover(room.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(room.id)}
                onBlur={() => onHover(null)}
              >
                {room.points ? (
                  <polygon
                    points={room.points}
                    fill={isSelected ? '#17181A' : isHovered ? '#D3CCC1' : KIND_FILL[room.kind]}
                    stroke={isSelected ? '#17181A' : '#0C0C0D'}
                    strokeOpacity={isSelected ? 1 : 0.22}
                    strokeWidth="1.25"
                    className="transition-[fill,stroke] duration-500 ease-luxury"
                  />
                ) : (
                  <rect
                    x={room.x}
                    y={room.y}
                    width={room.w}
                    height={room.h}
                    {...(room.kind === 'exterior' ? { fill: 'url(#hatch)' } : {})}
                    fill={isSelected ? '#17181A' : isHovered ? '#D3CCC1' : KIND_FILL[room.kind]}
                    stroke={isSelected ? '#17181A' : '#0C0C0D'}
                    strokeOpacity={isSelected ? 1 : 0.22}
                    strokeWidth="1.25"
                    className="transition-[fill,stroke] duration-500 ease-luxury"
                  />
                )}

                {showLabel && room.w !== 0 && (
                  <text
                    x={(room.x ?? 0) + (room.w ?? 0) / 2}
                    y={(room.y ?? 0) + (room.h ?? 0) / 2 + 4}
                    textAnchor="middle"
                    className="pointer-events-none uppercase"
                    style={{
                      fontFamily: 'var(--font-sans), sans-serif',
                      fontSize: 12,
                      letterSpacing: '0.16em',
                      fontWeight: 500,
                      fill: isSelected ? '#F4F1EC' : '#2A2B2E',
                      opacity: isSelected ? 1 : 0.62,
                    }}
                  >
                    {room.short}
                  </text>
                )}
              </g>
            );
          })}

          {/* Pool water fill (ground + site) */}
          {level.rooms
            .filter((room) => room.id === 'pool')
            .map((room) => (
              <rect
                key="pool-water"
                x={(room.x ?? 0) + 6}
                y={(room.y ?? 0) + 6}
                width={(room.w ?? 0) - 12}
                height={(room.h ?? 0) - 12}
                fill="url(#water)"
                opacity="0.5"
                pointerEvents="none"
              />
            ))}

          {/* North arrow + level marker */}
          <g pointerEvents="none" transform="translate(1130 96)">
            <path d="M0 34 0 0M-7 12 0 0l7 12" fill="none" stroke="#0C0C0D" strokeOpacity="0.4" strokeWidth="1.4" />
            <text
              y="-8"
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-sans), sans-serif',
                fontSize: 11,
                letterSpacing: '0.24em',
                fill: '#2A2B2E',
                opacity: 0.5,
              }}
            >
              N
            </text>
          </g>

          <text
            x="52"
            y="706"
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 11,
              letterSpacing: '0.26em',
              fill: '#2A2B2E',
              opacity: 0.45,
            }}
          >
            {level.name.toUpperCase()} · {level.elevation.toUpperCase()} · INDICATIVE — NOT TO SCALE
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-charcoal/12 pt-5">
        {LEGEND.map((entry) => (
          <span key={entry.kind} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={cn('block h-2.5 w-2.5 border border-charcoal/25')}
              style={{ background: KIND_FILL[entry.kind] }}
            />
            <span className="label text-[8.5px] text-graphite/50">{entry.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
