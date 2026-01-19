import { useState } from 'react'

const SENTENCES = [
  '以代碼書寫未來',
  '將想法化為現實',
  '創造改變世界的工具',
  '在數據中尋找真理',
  '用邏輯構建橋樑',
  '讓機器理解人類',
  '追求優雅的解決方案',
  '持續學習永不止步',
  '探索無限可能',
  '連結人與科技',
]

interface ChainProps {
  text: string
  style: React.CSSProperties
  accent?: boolean
}

function Chain({ text, style, accent = false }: ChainProps) {
  const [flippedChars, setFlippedChars] = useState<Set<number>>(new Set())

  const handleMouseEnter = (idx: number) => {
    setFlippedChars((prev) => new Set(prev).add(idx))
  }

  const handleMouseLeave = (idx: number) => {
    setFlippedChars((prev) => {
      const next = new Set(prev)
      next.delete(idx)
      return next
    })
  }

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        ...style,
        fontFamily: 'var(--font-serif-tc)',
        color: accent ? 'var(--color-sage)' : '#a1a1aa',
        perspective: '500px',
      }}
    >
      {text.split('').map((char, idx) => (
        <span
          key={idx}
          className="cursor-pointer transition-transform duration-500 ease-out hover:text-ink"
          style={{
            display: 'block',
            marginBottom: '0.15em',
            transform: flippedChars.has(idx) ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
          }}
          onMouseEnter={() => handleMouseEnter(idx)}
          onMouseLeave={() => handleMouseLeave(idx)}
        >
          {char}
        </span>
      ))}
    </div>
  )
}

export default function ChineseRain() {
  // 不同位置、大小、透明度來模擬遠近深度
  const chains: (ChainProps['style'] & { accent?: boolean })[] = [
    // 左側（近）
    { top: '5%', left: '2%', fontSize: '2.5rem', opacity: 0.35 },
    { top: '10%', left: '9%', fontSize: '1.8rem', opacity: 0.22, accent: true },
    { top: '8%', left: '16%', fontSize: '1.4rem', opacity: 0.15 },

    // 右側（近）
    { top: '3%', right: '2%', fontSize: '2.2rem', opacity: 0.32, accent: true },
    { top: '12%', right: '9%', fontSize: '1.6rem', opacity: 0.18 },
    { top: '6%', right: '17%', fontSize: '1.2rem', opacity: 0.12 },

    // 中間偏左（較遠）
    { top: '15%', left: '24%', fontSize: '1rem', opacity: 0.08 },

    // 中間偏右（較遠）
    { top: '18%', right: '24%', fontSize: '1.1rem', opacity: 0.08, accent: true },

    // 底部補充
    { bottom: '10%', left: '4%', fontSize: '1.8rem', opacity: 0.2 },
    { bottom: '15%', right: '5%', fontSize: '2rem', opacity: 0.25, accent: true },
  ]

  return (
    <div
      className="absolute inset-0 z-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      {chains.map((chainStyle, idx) => {
        const { accent, ...style } = chainStyle
        return (
          <Chain
            key={idx}
            text={SENTENCES[idx % SENTENCES.length]}
            accent={accent}
            style={{
              ...style,
              letterSpacing: '0.1em',
            }}
          />
        )
      })}
    </div>
  )
}
