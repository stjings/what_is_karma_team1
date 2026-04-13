import { useEffect, useState } from 'react'
import Link from 'next/link'

const TOTAL = 9

// ── Slide wrapper ──────────────────────────────────────────────
function Slide({
  index, bg, children, className = '',
}: {
  index: number; bg: string; children: React.ReactNode; className?: string
}) {
  return (
    <section
      data-slide
      data-slide-index={String(index)}
      className={`relative w-full flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={{ height: '100dvh', scrollSnapAlign: 'start', background: bg }}
    >
      {children}
    </section>
  )
}

// ── Speedometer SVG ────────────────────────────────────────────
function Speedometer({ active }: { active: boolean }) {
  // Center: (200,190), Radius: 155. Arc from 180° to 0° through top.
  // Points: Left(45,190) Top(200,35) Right(355,190)
  // Dividers at 120° → (122.5, 57.5) and 60° → (277.5, 57.5)
  const needleAngle = active ? 52 : -78
  return (
    <svg viewBox="0 0 400 220" className="w-full max-w-sm">
      {/* Red zone: 180°→120° */}
      <path d="M 45,190 A 155,155 0 0,1 122.5,57.5"
        fill="none" stroke="#ef4444" strokeWidth="22" strokeLinecap="butt" opacity="0.55" />
      {/* Yellow zone: 120°→60° */}
      <path d="M 122.5,57.5 A 155,155 0 0,1 277.5,57.5"
        fill="none" stroke="#f59e0b" strokeWidth="22" strokeLinecap="butt" opacity="0.55" />
      {/* Green zone: 60°→0° */}
      <path d="M 277.5,57.5 A 155,155 0 0,1 355,190"
        fill="none" stroke="#22c55e" strokeWidth="22" strokeLinecap="butt" opacity="0.55" />
      {/* Track */}
      <path d="M 45,190 A 155,155 0 0,1 355,190"
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="22" />

      {/* Zone labels */}
      <text x="38" y="215" fill="#ef4444" fontSize="11" textAnchor="middle" fontFamily="Pretendard" opacity="0.8">저속</text>
      <text x="200" y="28" fill="#f59e0b" fontSize="11" textAnchor="middle" fontFamily="Pretendard" opacity="0.8">중간</text>
      <text x="362" y="215" fill="#22c55e" fontSize="11" textAnchor="middle" fontFamily="Pretendard" opacity="0.8">고속</text>

      {/* Needle */}
      <g style={{ transformOrigin: '200px 190px', transform: `rotate(${needleAngle}deg)`, transition: active ? 'transform 1.6s cubic-bezier(0.16,1,0.3,1) 0.4s' : 'none' }}>
        <line x1="200" y1="190" x2="200" y2="48" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="200" cy="48" r="5" fill="white" opacity="0.6" />
      </g>
      <circle cx="200" cy="190" r="10" fill="white" />
      <circle cx="200" cy="190" r="5" fill="#0c0c18" />
    </svg>
  )
}

// ── Main presentation component ────────────────────────────────
export default function PresentationSlides() {
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const slides = document.querySelectorAll('[data-slide]')
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio >= 0.5) {
          const idx = parseInt((e.target as HTMLElement).dataset.slideIndex ?? '0')
          setActive(idx)
          e.target.classList.add('active')
        } else {
          e.target.classList.remove('active')
        }
      }),
      { threshold: 0.5 }
    )
    slides.forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [])

  const goTo = (i: number) =>
    document.querySelector(`[data-slide-index="${i}"]`)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      {/* ── 상단 가운데 토글 (스크롤 컨테이너 밖) ── */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-2" style={{ maxWidth: '100vw' }}>
        <div
          className="relative flex items-center rounded-full p-1 flex-nowrap"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* 슬라이딩 배경 — 발표자료 위치에 고정 */}
          <span
            className="absolute right-1 top-1 bottom-1 rounded-full"
            style={{
              width: 'calc(50% - 4px)',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          />
          {/* 보고자료 */}
          <Link
            href="/"
            className="relative z-10 px-3 py-1.5 text-xs sm:text-sm sm:px-5 font-semibold rounded-full text-zinc-400 hover:text-zinc-200 transition-colors duration-200 whitespace-nowrap"
            style={{ textAlign: 'center' }}
          >
            보고자료
          </Link>
          {/* 발표자료 */}
          <button
            className="relative z-10 px-3 py-1.5 text-xs sm:text-sm sm:px-5 font-semibold rounded-full text-white transition-colors duration-200 whitespace-nowrap"
          >
            발표자료
          </button>
        </div>
      </div>

      {/* ── 페이지 도트 (스크롤 컨테이너 밖) ──────── */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: active === i ? '#f59e0b' : 'rgba(255,255,255,0.3)',
              transform: active === i ? 'scale(1.8)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      <div
        className="fixed inset-0 overflow-y-scroll"
        style={{ scrollSnapType: 'y mandatory', overscrollBehaviorY: 'none' }}
      >

      {/* ══════════════════════════════════════════
          SLIDE 1 — 우리는 무엇을 파는 회사인가
      ══════════════════════════════════════════ */}
      <Slide index={0} bg="#07070a">
        {/* Floating keywords */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {[
            { text: '강의', x: '12%', y: '20%', size: '5rem', delay: '0s', dur: '11s', anim: 'kw1' },
            { text: '프리패스', x: '68%', y: '15%', size: '4rem', delay: '1.5s', dur: '13s', anim: 'kw2' },
            { text: '합격', x: '80%', y: '55%', size: '6rem', delay: '0.8s', dur: '10s', anim: 'kw3' },
            { text: '플랫폼', x: '8%', y: '65%', size: '4.5rem', delay: '2s', dur: '14s', anim: 'kw4' },
            { text: '앱', x: '45%', y: '78%', size: '5.5rem', delay: '0.4s', dur: '12s', anim: 'kw5' },
          ].map((kw, i) => (
            <span
              key={i}
              className="absolute font-extrabold text-white"
              style={{
                left: kw.x, top: kw.y,
                fontSize: kw.size,
                opacity: 0.04,
                filter: 'blur(1px)',
                animation: `${kw.anim} ${kw.dur} ${kw.delay} ease-in-out infinite`,
                fontFamily: 'Pretendard',
              }}
            >
              {kw.text}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-8 max-w-4xl">
          <p className="pr text-amber-400/70 text-base tracking-[0.3em] uppercase font-semibold mb-8"
            style={{ fontFamily: 'Pretendard' }}>
            업의 본질 정의 — 1조
          </p>
          <h1
            className="pr-d1 font-extrabold text-white break-keep leading-tight"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontFamily: 'Pretendard', wordBreak: 'keep-all' }}
          >
            우리는 무엇을
            <br />
            <span className="text-amber-400">파는 회사인가</span>
          </h1>
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pr-fade-d2 flex flex-col items-center gap-2">
          <span className="text-white/30 text-xs tracking-widest" style={{ fontFamily: 'Pretendard' }}>SCROLL</span>
          <div className="w-px h-8 bg-white/20 animate-pulse" />
        </div>
      </Slide>

      {/* ══════════════════════════════════════════
          SLIDE 2 — 기업들은 경험과 가치를 정의한다
      ══════════════════════════════════════════ */}
      <Slide index={1} bg="#09090f">
        <div className="relative z-10 text-center px-8 max-w-5xl w-full">
          <h2
            className="pr font-extrabold text-white break-keep leading-tight mb-14"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontFamily: 'Pretendard', wordBreak: 'keep-all' }}
          >
            기업들은 제품이 아니라
            <br />
            <span className="text-amber-400">경험과 가치</span>를 정의한다
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { brand: 'Amazon', value: '고객 경험', icon: '📦', delay: 'pr-d1', color: '#f59e0b' },
              { brand: 'Starbucks', value: '공간', icon: '☕', delay: 'pr-d2', color: '#22c55e' },
              { brand: 'Nike', value: '스포츠 정신', icon: '⚡', delay: 'pr-d3', color: '#60a5fa' },
              { brand: 'Uber', value: '이동의 효율', icon: '🚗', delay: 'pr-d4', color: '#a78bfa' },
            ].map((item) => (
              <div
                key={item.brand}
                className={`${item.delay} p-6 rounded-2xl border text-center`}
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <div
                  className="text-xl font-extrabold mb-2"
                  style={{ color: item.color, fontFamily: 'Pretendard' }}
                >
                  {item.brand}
                </div>
                <div className="text-white/60 text-sm" style={{ fontFamily: 'Pretendard' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════════
          SLIDE 3 — 우리 회사의 역할
      ══════════════════════════════════════════ */}
      <Slide index={2} bg="#0a0a12">
        <div className="relative z-10 text-center px-8 max-w-5xl w-full">
          <h2
            className="pr font-extrabold text-white break-keep leading-tight mb-16"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontFamily: 'Pretendard', wordBreak: 'keep-all' }}
          >
            우리 회사는 고객의 삶에서
            <br />
            <span className="text-amber-400">어떤 역할</span>을 하는가
          </h2>

          <div className="flex items-stretch gap-0">
            {/* Left: 제품 */}
            <div
              className="pr-l flex-1 p-8 rounded-l-2xl text-left"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-white/40 text-xs tracking-widest uppercase mb-6" style={{ fontFamily: 'Pretendard' }}>
                현재 관점
              </p>
              {['강의', '상품', '수험 정보', '프리패스'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
                  <span className="text-white/50 text-xl font-semibold" style={{ fontFamily: 'Pretendard' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="pr-d1 flex flex-col items-center justify-center px-6">
              <div className="h-full w-px bg-amber-400/30" />
              <span className="text-amber-400/70 text-xs font-bold my-3 tracking-widest" style={{ fontFamily: 'Pretendard' }}>→</span>
              <div className="h-full w-px bg-amber-400/30" />
            </div>

            {/* Right: 가치 */}
            <div
              className="pr-r flex-1 p-8 rounded-r-2xl text-left"
              style={{ background: 'rgba(232,162,23,0.06)', border: '1px solid rgba(232,162,23,0.2)' }}
            >
              <p className="text-amber-400/60 text-xs tracking-widest uppercase mb-6" style={{ fontFamily: 'Pretendard' }}>
                본질 관점
              </p>
              {['목표 달성', '시간 단축', '다음 삶', '선순환'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 shrink-0" />
                  <span className="text-amber-100 text-xl font-semibold" style={{ fontFamily: 'Pretendard' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════════
          SLIDE 4 — 다양한 관점 (Venn circles)
      ══════════════════════════════════════════ */}
      <Slide index={3} bg="#0c0c14">
        <div className="relative z-10 text-center px-8 max-w-4xl w-full">
          <h2
            className="pr font-extrabold text-white break-keep leading-tight mb-14"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: 'Pretendard' }}
          >
            다양한 <span className="text-amber-400">관점</span>
          </h2>

          {/* Venn diagram */}
          <div className="relative flex items-center justify-center" style={{ height: '260px' }}>
            {/* Circle 1 — 단기 브랜드 (left) */}
            <div
              className="pr-l absolute flex flex-col items-center justify-center rounded-full border text-center"
              style={{
                width: '200px', height: '200px',
                background: 'rgba(239,68,68,0.12)',
                border: '2px solid rgba(239,68,68,0.4)',
                left: 'calc(50% - 180px)',
                top: '50%', transform: 'translateY(-50%)',
              }}
            >
              <span className="text-red-400 font-extrabold text-base leading-tight break-keep" style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all' }}>단기 브랜드<br />관점</span>
            </div>

            {/* Circle 2 — 평생 교육 (right) */}
            <div
              className="pr-r absolute flex flex-col items-center justify-center rounded-full border text-center"
              style={{
                width: '200px', height: '200px',
                background: 'rgba(96,165,250,0.12)',
                border: '2px solid rgba(96,165,250,0.4)',
                right: 'calc(50% - 180px)',
                top: '50%', transform: 'translateY(-50%)',
              }}
            >
              <span className="text-blue-400 font-extrabold text-base leading-tight break-keep" style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all' }}>평생 교육<br />관점</span>
            </div>

            {/* Circle 3 — 고객 경험 (center bottom) */}
            <div
              className="pr-d2 absolute flex flex-col items-center justify-center rounded-full border text-center z-10"
              style={{
                width: '200px', height: '200px',
                background: 'rgba(251,191,36,0.14)',
                border: '2px solid rgba(251,191,36,0.5)',
                left: '50%', top: '50%',
                transform: 'translate(-50%, -35%)',
              }}
            >
              <span className="text-amber-300 font-extrabold text-base leading-tight break-keep" style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all' }}>고객 감정<br />경험 관점</span>
            </div>
          </div>

          <p
            className="pr-d3 text-white/50 text-base mt-6 break-keep"
            style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all' }}
          >
            세 관점은 서로 다르지만, 공통된 방향을 향합니다
          </p>
        </div>
      </Slide>

      {/* ══════════════════════════════════════════
          SLIDE 5 — 시간 단축 (핵심 전환)
      ══════════════════════════════════════════ */}
      <Slide index={4} bg="#0e0e16">
        <div className="relative z-10 text-center px-8 max-w-4xl w-full">
          <h2
            className="pr font-extrabold text-white break-keep leading-tight mb-16"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontFamily: 'Pretendard', wordBreak: 'keep-all' }}
          >
            고객이 목표를 달성하기까지 걸리는 시간을
            <br />
            <span className="text-amber-400">얼마나 줄여주는가</span>
          </h2>

          <div className="space-y-8 text-left">
            {/* Before */}
            <div className="pr-d1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40 text-sm tracking-widest uppercase" style={{ fontFamily: 'Pretendard' }}>Before</span>
                <span className="text-white/40 font-bold text-lg" style={{ fontFamily: 'Pretendard' }}>18개월</span>
              </div>
              <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div
                  className="bar-full absolute left-0 top-0 h-full rounded-full"
                  style={{ background: 'rgba(255,255,255,0.25)' }}
                />
              </div>
            </div>

            {/* After */}
            <div className="pr-d2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-400/80 text-sm tracking-widest uppercase" style={{ fontFamily: 'Pretendard' }}>After</span>
                <span className="text-amber-400 font-bold text-lg" style={{ fontFamily: 'Pretendard' }}>12개월 ↓</span>
              </div>
              <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div
                  className="bar-short absolute left-0 top-0 h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #f59e0b, #e8a217)' }}
                />
              </div>
            </div>
          </div>

          <p
            className="pr-d3 text-white/40 text-base mt-12 break-keep"
            style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all' }}
          >
            고객의 시간 = 브랜드의 핵심 가치 지표
          </p>
        </div>
      </Slide>

      {/* ══════════════════════════════════════════
          SLIDE 6 — 업의 본질 정의 (핵심)
      ══════════════════════════════════════════ */}
      <Slide index={5} bg="#080810">
        {/* Ambient center glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,162,23,0.06) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 text-center px-8 max-w-4xl w-full">
          <p
            className="pr text-amber-400/60 text-xs tracking-[0.3em] uppercase font-semibold mb-10"
            style={{ fontFamily: 'Pretendard' }}
          >
            1조의 정의
          </p>
          <blockquote
            className="pr-d1 font-extrabold text-white break-keep leading-snug mb-14"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontFamily: 'Pretendard', wordBreak: 'keep-all' }}
          >
            &ldquo;우리는 고객이 원하는 목표를
            <br />
            <span className="text-amber-400">가장 빠르게 현실로 만들고,</span>
            <br />
            그들을 다음 삶으로 보내는 회사다.&rdquo;
          </blockquote>

          {/* Circular flow */}
          <div className="pr-d2 flex items-center justify-center gap-0">
            {[
              { label: '합격', delay: 0 },
              { label: '→', arrow: true },
              { label: '새로운 목표', delay: 1 },
              { label: '→', arrow: true },
              { label: '재방문', delay: 2 },
              { label: '→', arrow: true },
            ].map((item, i) =>
              item.arrow ? (
                <span
                  key={i}
                  className="text-amber-400/40 text-2xl mx-2 font-light"
                  style={{ fontFamily: 'Pretendard' }}
                >
                  {item.label}
                </span>
              ) : (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full text-sm font-bold"
                  style={{
                    background: 'rgba(232,162,23,0.12)',
                    border: '1px solid rgba(232,162,23,0.3)',
                    color: '#fbbf24',
                    fontFamily: 'Pretendard',
                    animation: `node-pulse 3s ${item.delay! * 1}s ease-in-out infinite`,
                  }}
                >
                  {item.label}
                </span>
              )
            )}
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════════
          SLIDE 7 — 체류시간 vs 속도
      ══════════════════════════════════════════ */}
      <Slide index={6} bg="#111118">
        <div className="relative z-10 text-center px-8 max-w-4xl w-full">
          <h2
            className="pr font-extrabold text-white break-keep leading-tight mb-14"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontFamily: 'Pretendard', wordBreak: 'keep-all' }}
          >
            고객의 <span className="text-red-400 line-through opacity-70">체류시간</span>이 아니라
            <br />
            <span className="text-amber-400">목표 달성 속도</span>가 핵심 성과
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Bad: 체류시간 */}
            <div
              className="pr-l p-8 rounded-2xl text-center"
              style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <div className="text-5xl font-extrabold text-red-400 mb-3" style={{ fontFamily: 'Pretendard' }}>↓</div>
              <div className="text-red-300 text-xl font-bold mb-3" style={{ fontFamily: 'Pretendard' }}>체류 시간</div>
              <p className="text-white/40 text-sm leading-relaxed break-keep" style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all' }}>
                재수강률, 이용 기간이 길어지는 것은 고객이 목표에 도달하지 못하고 있다는 신호
              </p>
            </div>

            {/* Good: 달성 속도 */}
            <div
              className="pr-r p-8 rounded-2xl text-center"
              style={{ background: 'rgba(232,162,23,0.07)', border: '1px solid rgba(232,162,23,0.25)' }}
            >
              <div className="text-5xl font-extrabold text-amber-400 mb-3" style={{ fontFamily: 'Pretendard' }}>↑</div>
              <div className="text-amber-300 text-xl font-bold mb-3" style={{ fontFamily: 'Pretendard' }}>달성 속도</div>
              <p className="text-white/40 text-sm leading-relaxed break-keep" style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all' }}>
                빠른 합격 → 새로운 삶 → 새로운 도전. 고객의 남은 시간이 우리의 미래 산업이 된다
              </p>
            </div>
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════════
          SLIDE 8 — 브랜드 자산 (Speedometer)
      ══════════════════════════════════════════ */}
      <Slide index={7} bg="#141420">
        <div className="relative z-10 text-center px-8 max-w-3xl w-full">
          <h2
            className="pr font-extrabold text-white break-keep leading-tight mb-10"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontFamily: 'Pretendard', wordBreak: 'keep-all' }}
          >
            브랜드의 가장 중요한
            <br />
            <span className="text-amber-400">자산을 지키는 것</span>
          </h2>

          <div className="pr-d1 mx-auto" style={{ maxWidth: '380px' }}>
            <Speedometer active={active === 7} />
          </div>

          <div className="pr-d2 grid grid-cols-2 gap-4 mt-8 text-sm">
            <div
              className="p-4 rounded-xl text-left"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <div className="text-red-400 font-bold mb-1" style={{ fontFamily: 'Pretendard' }}>저속 — 위험</div>
              <p className="text-white/40 break-keep text-xs" style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all' }}>
                합격이 늦어지고 고객을 오래 묶어두는 브랜드로 인식
              </p>
            </div>
            <div
              className="p-4 rounded-xl text-left"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <div className="text-green-400 font-bold mb-1" style={{ fontFamily: 'Pretendard' }}>고속 — 신뢰</div>
              <p className="text-white/40 break-keep text-xs" style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all' }}>
                합격을 앞당겨서 빠른 출구 브랜드로 인식 → 평생 파트너
              </p>
            </div>
          </div>
        </div>
      </Slide>

      {/* ══════════════════════════════════════════
          SLIDE 9 — 엔딩 (밝은 슬라이드)
      ══════════════════════════════════════════ */}
      <Slide index={8} bg="#f5f3ef">
        {/* Light burst effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,255,255,0.9) 0%, rgba(245,243,239,0.4) 60%, transparent 100%)',
            animation: active === 8 ? 'light-burst 1.2s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
            opacity: active === 8 ? 1 : 0,
          }}
        />
        {/* Subtle amber glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 80%, rgba(232,162,23,0.12) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 text-center px-8 max-w-4xl">
          <p
            className="pr text-amber-600/70 text-sm tracking-[0.25em] uppercase font-semibold mb-8"
            style={{ fontFamily: 'Pretendard' }}
          >
            우리의 방향
          </p>
          <h2
            className="pr-d1 font-extrabold break-keep leading-snug mb-8"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontFamily: 'Pretendard',
              wordBreak: 'keep-all',
              color: '#1a1a1a',
            }}
          >
            고객이 가장 빨리 목표를 이루고
            <br />
            <span style={{ color: '#d97706' }}>우리를 떠나게 하라.</span>
          </h2>
          <p
            className="pr-d2 break-keep leading-relaxed"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              fontFamily: 'Pretendard',
              wordBreak: 'keep-all',
              color: '#4a4a4a',
              maxWidth: '600px',
              margin: '0 auto 3rem',
            }}
          >
            그것이 ST Unitas가 세대를 넘어
            평생의 브랜드로 기억되는 유일한 방법입니다.
          </p>

          <div
            className="pr-d3 inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{ background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.3)' }}
          >
            <span style={{ color: '#d97706', fontFamily: 'Pretendard', fontWeight: 700, fontSize: '1rem' }}>
              1조 · 업의 본질 정의
            </span>
          </div>
        </div>
      </Slide>
    </div>
    </>
  )
}
