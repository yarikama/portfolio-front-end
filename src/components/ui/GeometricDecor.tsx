import { useEffect, useState } from 'react'

export default function GeometricDecor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 左上：尺寸標註線 */}
      <svg
        className="absolute top-[10%] left-[4%] w-40 h-24"
        style={{
          transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
          transition: 'transform 0.3s ease-out',
        }}
        viewBox="0 0 120 70"
        fill="none"
      >
        {/* 水平標註線 */}
        <line x1="0" y1="20" x2="100" y2="20" stroke="#d4d4d8" strokeWidth="0.5" opacity="0.5" />
        {/* 左端點 */}
        <line x1="0" y1="15" x2="0" y2="25" stroke="#d4d4d8" strokeWidth="0.5" opacity="0.5" />
        {/* 右端點 */}
        <line x1="100" y1="15" x2="100" y2="25" stroke="#d4d4d8" strokeWidth="0.5" opacity="0.5" />
        {/* 刻度 */}
        <line x1="25" y1="18" x2="25" y2="22" stroke="#d4d4d8" strokeWidth="0.4" opacity="0.35" />
        <line x1="50" y1="17" x2="50" y2="23" stroke="var(--color-sage)" strokeWidth="0.5" opacity="0.4" />
        <line x1="75" y1="18" x2="75" y2="22" stroke="#d4d4d8" strokeWidth="0.4" opacity="0.35" />
        {/* 標註文字位置線 */}
        <line x1="50" y1="23" x2="50" y2="35" stroke="#d4d4d8" strokeWidth="0.3" opacity="0.25" strokeDasharray="2 2" />
      </svg>

      {/* 右上：直角標記 + 延伸線 */}
      <svg
        className="absolute top-[8%] right-[6%] w-32 h-32"
        style={{
          transform: `translate(${mousePos.x * -0.35}px, ${mousePos.y * 0.35}px)`,
          transition: 'transform 0.3s ease-out',
        }}
        viewBox="0 0 80 80"
        fill="none"
      >
        {/* 主線 */}
        <line x1="10" y1="70" x2="10" y2="10" stroke="#d4d4d8" strokeWidth="0.5" opacity="0.45" />
        <line x1="10" y1="70" x2="70" y2="70" stroke="#d4d4d8" strokeWidth="0.5" opacity="0.45" />
        {/* 直角標記 */}
        <path d="M 10 60 L 20 60 L 20 70" stroke="var(--color-sage)" strokeWidth="0.5" fill="none" opacity="0.4" />
        {/* 延伸虛線 */}
        <line x1="10" y1="10" x2="10" y2="0" stroke="#d4d4d8" strokeWidth="0.3" opacity="0.25" strokeDasharray="3 2" />
        <line x1="70" y1="70" x2="80" y2="70" stroke="#d4d4d8" strokeWidth="0.3" opacity="0.25" strokeDasharray="3 2" />
      </svg>

      {/* 左側：垂直刻度尺 */}
      <svg
        className="absolute top-[35%] left-[2%] w-12 h-48"
        style={{
          transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.3}px)`,
          transition: 'transform 0.3s ease-out',
        }}
        viewBox="0 0 30 120"
        fill="none"
      >
        {/* 主軸線 */}
        <line x1="15" y1="0" x2="15" y2="120" stroke="#d4d4d8" strokeWidth="0.5" opacity="0.4" />
        {/* 刻度 */}
        {[0, 20, 40, 60, 80, 100, 120].map((y, i) => (
          <line
            key={y}
            x1={i % 2 === 0 ? 10 : 12}
            y1={y}
            x2="20"
            y2={y}
            stroke={i === 3 ? 'var(--color-sage)' : '#d4d4d8'}
            strokeWidth="0.4"
            opacity={i === 3 ? 0.45 : 0.3}
          />
        ))}
      </svg>

      {/* 右側：傾斜標註 */}
      <svg
        className="absolute top-[45%] right-[3%] w-28 h-36"
        style={{
          transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * 0.25}px)`,
          transition: 'transform 0.3s ease-out',
        }}
        viewBox="0 0 70 90"
        fill="none"
      >
        {/* 斜線 */}
        <line x1="10" y1="80" x2="60" y2="10" stroke="#d4d4d8" strokeWidth="0.5" opacity="0.4" />
        {/* 垂直投影虛線 */}
        <line x1="60" y1="10" x2="60" y2="80" stroke="#d4d4d8" strokeWidth="0.3" opacity="0.25" strokeDasharray="2 2" />
        {/* 水平投影虛線 */}
        <line x1="10" y1="80" x2="60" y2="80" stroke="#d4d4d8" strokeWidth="0.3" opacity="0.25" strokeDasharray="2 2" />
        {/* 角度標記弧 */}
        <path d="M 20 80 A 10 10 0 0 1 17 73" stroke="var(--color-sage)" strokeWidth="0.4" fill="none" opacity="0.4" />
      </svg>

      {/* 左下：座標基準點 */}
      <svg
        className="absolute bottom-[12%] left-[6%] w-24 h-24"
        style={{
          transform: `translate(${mousePos.x * 0.35}px, ${mousePos.y * -0.35}px)`,
          transition: 'transform 0.3s ease-out',
        }}
        viewBox="0 0 60 60"
        fill="none"
      >
        {/* 十字基準 */}
        <line x1="30" y1="20" x2="30" y2="40" stroke="var(--color-sage)" strokeWidth="0.5" opacity="0.4" />
        <line x1="20" y1="30" x2="40" y2="30" stroke="var(--color-sage)" strokeWidth="0.5" opacity="0.4" />
        {/* 延伸線 */}
        <line x1="30" y1="0" x2="30" y2="20" stroke="#d4d4d8" strokeWidth="0.3" opacity="0.25" strokeDasharray="2 2" />
        <line x1="30" y1="40" x2="30" y2="60" stroke="#d4d4d8" strokeWidth="0.3" opacity="0.25" strokeDasharray="2 2" />
        <line x1="0" y1="30" x2="20" y2="30" stroke="#d4d4d8" strokeWidth="0.3" opacity="0.25" strokeDasharray="2 2" />
        <line x1="40" y1="30" x2="60" y2="30" stroke="#d4d4d8" strokeWidth="0.3" opacity="0.25" strokeDasharray="2 2" />
      </svg>

      {/* 右下：尺寸箭頭標註 */}
      <svg
        className="absolute bottom-[18%] right-[10%] w-36 h-16"
        style={{
          transform: `translate(${mousePos.x * -0.25}px, ${mousePos.y * -0.25}px)`,
          transition: 'transform 0.3s ease-out',
        }}
        viewBox="0 0 100 40"
        fill="none"
      >
        {/* 主標註線 */}
        <line x1="10" y1="20" x2="90" y2="20" stroke="#d4d4d8" strokeWidth="0.5" opacity="0.45" />
        {/* 左箭頭 */}
        <path d="M 10 20 L 16 17 M 10 20 L 16 23" stroke="#d4d4d8" strokeWidth="0.4" opacity="0.45" />
        {/* 右箭頭 */}
        <path d="M 90 20 L 84 17 M 90 20 L 84 23" stroke="#d4d4d8" strokeWidth="0.4" opacity="0.45" />
        {/* 端點延伸 */}
        <line x1="10" y1="10" x2="10" y2="30" stroke="#d4d4d8" strokeWidth="0.3" opacity="0.3" />
        <line x1="90" y1="10" x2="90" y2="30" stroke="#d4d4d8" strokeWidth="0.3" opacity="0.3" />
      </svg>

      {/* 底部：水平基準線 */}
      <div
        className="absolute bottom-[8%] left-[20%] w-[25%] h-px bg-gradient-to-r from-zinc-300 via-sage to-zinc-300 opacity-20"
        style={{
          transform: `translateY(${mousePos.y * -0.15}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />
    </div>
  )
}
