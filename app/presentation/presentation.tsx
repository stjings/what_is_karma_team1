import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

const TOTAL = 10

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
  const needleAngle = active ? 52 : -78
  return (
    <svg viewBox="0 0 400 240" className="w-full max-w-sm">
      <path d="M 45,190 A 155,155 0 0,1 122.5,57.5"
        fill="none" stroke="#ef4444" strokeWidth="26" strokeLinecap="butt" opacity="0.6" />
      <path d="M 122.5,57.5 A 155,155 0 0,1 277.5,57.5"
        fill="none" stroke="#f59e0b" strokeWidth="26" strokeLinecap="butt" opacity="0.6" />
      <path d="M 277.5,57.5 A 155,155 0 0,1 355,190"
        fill="none" stroke="#22c55e" strokeWidth="26" strokeLinecap="butt" opacity="0.6" />
      <path d="M 45,190 A 155,155 0 0,1 355,190"
        fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="26" />
      <text x="38"  y="225" fill="#ef4444" fontSize="20" textAnchor="middle" fontFamily="Pretendard" fontWeight="700">저속</text>
      <text x="200" y="28"  fill="#f59e0b" fontSize="20" textAnchor="middle" fontFamily="Pretendard" fontWeight="700">중간</text>
      <text x="362" y="225" fill="#22c55e" fontSize="20" textAnchor="middle" fontFamily="Pretendard" fontWeight="700">고속</text>
      <g style={{
        transformOrigin: '200px 190px',
        transform: `rotate(${needleAngle}deg)`,
        transition: active ? 'transform 1.8s cubic-bezier(0.16,1,0.3,1) 0.5s' : 'none',
      }}>
        <line x1="200" y1="190" x2="200" y2="48" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <circle cx="200" cy="48" r="7" fill="white" opacity="0.7" />
      </g>
      <circle cx="200" cy="190" r="14" fill="white" />
      <circle cx="200" cy="190" r="7"  fill="#0c0c18" />
    </svg>
  )
}

// ── Main ───────────────────────────────────────────────────────
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

  const goTo = useCallback((i: number) =>
    document.querySelector(`[data-slide-index="${i}"]`)?.scrollIntoView({ behavior: 'smooth' }), [])

  // 키보드 네비게이션
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(Math.min(TOTAL - 1, active + 1))
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  goTo(Math.max(0, active - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, goTo])

  const isLight = false

  return (
    <>
      {/* ── 상단 토글 ── */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-2" style={{ maxWidth: '100vw' }}>
        <div className="relative flex items-center rounded-full p-1 flex-nowrap"
          style={{
            background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)'}`,
            backdropFilter: 'blur(12px)',
          }}>
          <span className="absolute right-1 top-1 bottom-1 rounded-full"
            style={{ width: 'calc(50% - 4px)', background: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)'}` }} />
          <Link href="/"
            className="relative z-10 px-4 py-2 text-sm sm:text-base sm:px-6 font-semibold rounded-full transition-colors duration-200 whitespace-nowrap"
            style={{ color: isLight ? '#71717a' : 'rgba(161,161,170,0.8)' }}>
            보고자료
          </Link>
          <button className="relative z-10 px-4 py-2 text-sm sm:text-base sm:px-6 font-semibold rounded-full whitespace-nowrap"
            style={{ color: isLight ? '#18181b' : 'white' }}>
            발표자료
          </button>
        </div>
      </div>

      {/* ── 우측 도트 네비 ── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: active === i ? 8 : 6,
              height: active === i ? 8 : 6,
              background: active === i
                ? (isLight ? '#d97706' : '#f59e0b')
                : (isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)'),
              transform: active === i ? 'scale(1.9)' : 'scale(1)',
            }} />
        ))}
      </div>

      {/* ── 슬라이드 번호 ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <span className="text-base font-mono tabular-nums"
          style={{ color: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.18)', fontFamily: 'Pretendard' }}>
          {active >= 0 ? `${String(active + 1).padStart(2, '0')} / ${TOTAL}` : ''}
        </span>
      </div>

      <div className="fixed inset-0 overflow-y-scroll"
        style={{ scrollSnapType: 'y mandatory', overscrollBehaviorY: 'none' }}>

        {/* ══════════════════════════════════════════
            SLIDE 1 — 표지
        ══════════════════════════════════════════ */}
        <Slide index={0} bg="#050508">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="glow-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(217,119,6,0.08) 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />
          </div>

          <div className="relative z-10 text-center px-8 max-w-5xl w-full">
            {/* 상단 레이블 */}
            <p className="pr text-amber-400/80 text-2xl tracking-[0.3em] uppercase font-semibold mb-14"
              style={{ fontFamily: 'Pretendard' }}>
              ST Unitas &nbsp;·&nbsp; 조별 토론 결과 발표
            </p>

            {/* 메인 타이틀 */}
            <h1 className="pr-d1 font-extrabold text-white break-keep leading-[1.05]"
              style={{
                fontSize: 'clamp(5rem, 13vw, 10rem)',
                fontFamily: 'Pretendard',
                letterSpacing: '-0.04em',
                marginBottom: '2.5rem',
              }}>
              업의&nbsp;
              <span style={{
                color: '#f59e0b',
                textShadow: '0 0 80px rgba(245,158,11,0.35)',
              }}>본질</span>
              &nbsp;정의
            </h1>

            {/* 구분선 + 조 */}
            <div className="pr-d2 flex items-center justify-center gap-5 mb-8">
              <div className="h-px w-24" style={{ background: 'rgba(255,255,255,0.12)' }} />
              <span className="text-white/70 text-3xl font-semibold tracking-[0.3em]"
                style={{ fontFamily: 'Pretendard' }}>1&nbsp;조</span>
              <div className="h-px w-24" style={{ background: 'rgba(255,255,255,0.12)' }} />
            </div>

            <p className="pr-d3 text-white/55 text-2xl tracking-widest" style={{ fontFamily: 'Pretendard' }}>
              2026 . 04 . 20
            </p>
          </div>

          {/* SCROLL hint */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pr-fade-d4 flex flex-col items-center gap-2">
            <span className="text-white/20 text-sm tracking-[0.35em] uppercase" style={{ fontFamily: 'Pretendard' }}>scroll</span>
            <div className="w-px h-8 bg-white/15 animate-pulse" />
          </div>
        </Slide>

        {/* ══════════════════════════════════════════
            SLIDE 2 — 우리가 던진 첫 번째 질문
        ══════════════════════════════════════════ */}
        <Slide index={1} bg="#07070a">
          {/* Floating keywords */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            {[
              { text: '강의',    x: 'calc(50% - 680px)', y: 'calc(50% - 300px)', size: '6rem',   delay: '0s',   dur: '6s',   anim: 'kw1' },
              { text: '프리패스', x: 'calc(50% + 420px)', y: 'calc(50% - 360px)', size: '5rem',   delay: '1.5s', dur: '7s',   anim: 'kw2' },
              { text: '합격',    x: 'calc(50% + 500px)', y: 'calc(50% + 100px)', size: '7.5rem', delay: '0.8s', dur: '5.5s', anim: 'kw3' },
              { text: '플랫폼',  x: 'calc(50% - 720px)', y: 'calc(50% + 200px)', size: '5.5rem', delay: '2s',   dur: '7.5s', anim: 'kw4' },
              { text: '앱',      x: 'calc(50% - 60px)',  y: 'calc(50% + 300px)', size: '6rem',   delay: '0.4s', dur: '6.5s', anim: 'kw5' },
            ].map((kw, i) => (
              <span key={i} className="absolute font-extrabold text-white"
                style={{
                  left: kw.x, top: kw.y,
                  fontSize: kw.size,
                  opacity: 0.18,
                  filter: 'blur(0px)',
                  animation: `${kw.anim} ${kw.dur} ${kw.delay} ease-in-out infinite`,
                  fontFamily: 'Pretendard',
                }}>
                {kw.text}
              </span>
            ))}
          </div>

          <div className="relative z-10 text-center px-8 max-w-4xl">
            <p className="pr text-amber-400/75 text-2xl tracking-[0.2em] uppercase font-semibold mb-8"
              style={{ fontFamily: 'Pretendard' }}>
              우리가 던진 첫 번째 질문
            </p>
            <h1 className="pr-d1 font-extrabold text-white break-keep leading-tight mb-10"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', fontFamily: 'Pretendard', wordBreak: 'keep-all' }}>
              우리는 무엇을
              <br />
              <span style={{ color: '#f59e0b' }}>하는 회사인가</span>
            </h1>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pr-fade-d3 flex flex-col items-center gap-2">
            <div className="w-px h-8 bg-white/15 animate-pulse" />
          </div>
        </Slide>

        {/* ══════════════════════════════════════════
            SLIDE 3 — 준비 과정
        ══════════════════════════════════════════ */}
        <Slide index={2} bg="#090910">
          {/* Background image */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/photos/KakaoTalk_20260412_004029254.jpg`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.45, zIndex: 0 }}
          />
          <div className="relative z-20 text-center px-6 max-w-5xl w-full">
            <p className="pr text-amber-400 text-2xl tracking-[0.2em] uppercase font-semibold mb-4"
              style={{ fontFamily: 'Pretendard', textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,1)' }}>
              1조가 걸어온 과정
            </p>
            <h2 className="pr-d1 font-extrabold text-white leading-tight mb-12 whitespace-nowrap"
              style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontFamily: 'Pretendard', textShadow: '0 2px 16px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,1)' }}>
              '정답 찾기'가 아닌&nbsp;<span style={{ color: '#f59e0b' }}>'방향 찾기'</span>
            </h2>

            {/* 4-step timeline */}
            <div className="relative mb-10">


              <div className="flex justify-between">
                {[
                  { num: '1', round: '1차', label: '브레인스토밍', desc: '각자의 관점 자유롭게 제시', cls: 'pr-d1' },
                  { num: '2', round: '2차', label: '구조화',      desc: '4가지 핵심 관점으로 정리',    cls: 'pr-d2' },
                  { num: '3', round: '3차', label: '벤치마킹',    desc: '타 브랜드 핵심 가치 분석',    cls: 'pr-d3' },
                  { num: '4', round: '4차', label: '방향 합의',   desc: '공통 기준 도출 및 정의',       cls: 'pr-d4' },
                ].map((step, i) => (
                  <div key={step.num} className={`${step.cls} flex flex-col items-center w-1/4`}>
                    {/* 원형 번호 */}
                    <div
                      key={active === 2 ? `active-${step.num}` : step.num}
                      className="relative w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-lg mb-5 z-10"
                      style={{
                        background: 'rgba(217,119,6,0.15)',
                        border: '2px solid rgba(217,119,6,0.55)',
                        color: '#fbbf24',
                        fontFamily: 'Pretendard',
                        boxShadow: '0 0 20px rgba(217,119,6,0.15)',
                        ...(active === 2 ? {
                          animationName: 'circle-highlight',
                          animationDuration: '1.2s',
                          animationDelay: `${i * 1.5}s`,
                          animationTimingFunction: 'ease-in-out',
                          animationIterationCount: 1,
                          animationFillMode: 'forwards',
                        } : {}),
                      }}>
                      {step.round}
                    </div>
                    <div className="text-white font-bold text-3xl mb-2 break-keep"
                      style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all', textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}>{step.label}</div>
                    <div className="text-white text-xl leading-relaxed whitespace-nowrap"
                      style={{ fontFamily: 'Pretendard', textShadow: '0 2px 8px rgba(0,0,0,0.95)', opacity: 0.7 }}>{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 접근 철학 callout */}
            <div className="pr-d5 px-8 py-6 rounded-2xl text-center"
              style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <p className="text-white text-2xl leading-relaxed whitespace-nowrap"
                style={{ fontFamily: 'Pretendard', opacity: 0.85 }}>
                <span className="text-white font-semibold">하나의 정답</span>이 아닌, 각자의 관점을 충분히 나누고&nbsp;<span className="text-amber-400 font-semibold">공통된 방향</span>을 찾는 과정으로 접근
              </p>
            </div>
          </div>
        </Slide>

        {/* ══════════════════════════════════════════
            SLIDE 4 — 4가지 관점
        ══════════════════════════════════════════ */}
        <Slide index={3} bg="#0c0c14">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/photos/opinion.jpg`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.5, zIndex: 0 }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'rgba(4,4,12,0.55)' }} />
          <div className="relative z-10 text-center px-6 w-full" style={{ maxWidth: '80rem' }}>
            <p className="pr text-amber-400 text-2xl tracking-[0.2em] uppercase font-semibold mb-4"
              style={{ fontFamily: 'Pretendard', textShadow: '0 2px 12px rgba(0,0,0,1)' }}>
              논의에서 나온 주요 시각
            </p>
            <h2 className="pr-d1 font-extrabold text-white break-keep leading-tight mb-8"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: 'Pretendard', textShadow: '0 2px 20px rgba(0,0,0,1)' }}>
              4가지&nbsp;<span style={{ color: '#f59e0b', textShadow: '0 0 40px rgba(245,158,11,0.5), 0 2px 16px rgba(0,0,0,1)' }}>관점</span>
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                {
                  num: '①', title: '단기 브랜드 관점',
                  keyword: '"빠른 합격"',
                  desc: '고객이 빠르게 목표를 달성하고 떠날 수 있도록 돕는 것이 본질',
                  color: '#f59e0b', bg: 'rgba(0,0,0,0.6)', border: 'rgba(245,158,11,0.35)', cls: 'pr-tl',
                },
                {
                  num: '②', title: '고객 경험 관점',
                  keyword: '"불안 → 믿음"',
                  desc: '불안한 상태로 찾아오는 고객을 확신으로 전환시키는 것이 핵심 가치',
                  color: '#34d399', bg: 'rgba(0,0,0,0.6)', border: 'rgba(52,211,153,0.35)', cls: 'pr-tr',
                },
                {
                  num: '③', title: '플랫폼화 관점',
                  keyword: '"강사 의존도 축소"',
                  desc: '특정 강사가 아닌 플랫폼·기술 중심으로 이동해야 지속 가능한 성장이 가능',
                  color: '#c084fc', bg: 'rgba(0,0,0,0.6)', border: 'rgba(192,132,252,0.35)', cls: 'pr-bl',
                },
                {
                  num: '④', title: '평생 교육 관점',
                  keyword: '"인생 전반 파트너"',
                  desc: '공무원이나 특정 시험을 넘어 끊임없는 소통을 통해 고객의 삶 전반에 걸친 교육 브랜드로 확장',
                  color: '#60a5fa', bg: 'rgba(0,0,0,0.6)', border: 'rgba(96,165,250,0.35)', cls: 'pr-br',
                },
              ].map((item) => (
                <div key={item.num}
                  className={`${item.cls} p-6 rounded-2xl text-left flex flex-col`}
                  style={{ background: item.bg, border: `1px solid ${item.border}`, backdropFilter: 'blur(8px)' }}>
                  <div className="font-extrabold text-3xl mb-3 whitespace-nowrap"
                    style={{ color: item.color, fontFamily: 'Pretendard', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
                    {item.num}&nbsp;{item.title}
                  </div>
                  <div className="text-2xl font-bold mb-3 px-3 py-1.5 rounded-md inline-block self-start whitespace-nowrap"
                    style={{ background: 'rgba(255,255,255,0.07)', color: item.color, fontFamily: 'Pretendard' }}>
                    {item.keyword}
                  </div>
                  <p className="text-white/80 text-xl leading-relaxed break-keep flex-1"
                    style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pr-d4 px-7 py-4 rounded-2xl text-center"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(245,158,11,0.3)', backdropFilter: 'blur(8px)' }}>
              <p className="text-white/90 text-2xl break-keep"
                style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
                하지만, 모든 것을 동시에 취할 수 없다는 <span className="text-amber-400 font-bold">딜레마!</span>
              </p>
            </div>
          </div>
        </Slide>

        {/* ══════════════════════════════════════════
            SLIDE 5 — 위대한 브랜드는 가치를 판다
        ══════════════════════════════════════════ */}
        <Slide index={4} bg="#0c0c14">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/photos/brand_value_bg.png`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.62, zIndex: 0 }}
          />
          {/* 배경 어둠 오버레이 — 텍스트 가독성 보호 */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'rgba(8,8,16,0.38)' }} />

          <div className="relative z-10 text-center px-6 w-full" style={{ maxWidth: '82rem' }}>
            <p className="pr text-amber-400 text-2xl tracking-[0.2em] uppercase font-semibold mb-4"
              style={{ fontFamily: 'Pretendard', textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>
              고객이 느끼는 핵심 가치란 무엇인가
            </p>
            <h2 className="pr-d1 font-extrabold text-white break-keep leading-tight mb-10"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontFamily: 'Pretendard', wordBreak: 'keep-all', textShadow: '0 2px 16px rgba(0,0,0,0.95)' }}>
              위대한 브랜드는 <span style={{ color: '#fbbf24' }}>'기능'</span>이 아닌{' '}
              <span style={{ color: '#fbbf24' }}>'가치'</span>를 팝니다.
            </h2>

            {/* 표 */}
            <div className="pr-d2 w-full overflow-hidden rounded-2xl"
              style={{ border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.45)' }}>
              {/* 헤더 */}
              <div className="grid grid-cols-3 text-center items-center"
                style={{ background: 'rgba(245,158,11,0.22)', borderBottom: '1px solid rgba(245,158,11,0.35)' }}>
                {['브랜드', '회사가 파는 것\n(제품, 기능, 강의)', '고객이 사는 것\n(변화, 가치, 자부심)'].map((h) => (
                  <div key={h} className="py-4 px-6 font-bold text-amber-300 text-xl tracking-wide whitespace-pre-line leading-snug"
                    style={{ fontFamily: 'Pretendard', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>{h}</div>
                ))}
              </div>
              {/* 행 */}
              {[
                { brand: '나이키',      func: '운동화',      value: '노력으로 극복해나가는 스포츠 정신' },
                { brand: '코카콜라',    func: '탄산음료',    value: '행복과 나눔' },
                { brand: '샤넬',        func: '패션 브랜드', value: '우아함과 자유' },
                { brand: 'ST UNITAS',   func: '온라인 강의', value: '?', highlight: true },
              ].map((row, i) => (
                <div key={row.brand}
                  className="grid grid-cols-3 text-center items-center"
                  style={{
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
                    borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  }}>
                  <div className="py-5 px-6 font-bold text-xl"
                    style={{ color: row.highlight ? '#fbbf24' : 'rgba(255,255,255,0.95)', fontFamily: 'Pretendard', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
                    {row.brand}
                  </div>
                  <div className="py-5 px-6 text-xl line-through"
                    style={{ color: row.highlight ? '#fbbf24' : 'rgba(255,255,255,0.65)', textDecorationColor: row.highlight ? 'rgba(251,191,36,0.6)' : 'rgba(255,255,255,0.5)', fontFamily: 'Pretendard', textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>
                    {row.func}
                  </div>
                  <div className="py-5 px-6 text-xl break-keep"
                    style={{ color: row.highlight ? '#ffffff' : 'rgba(255,255,255,0.85)', fontFamily: 'Pretendard', wordBreak: 'keep-all', fontWeight: row.highlight ? 600 : 400, textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
                    {row.highlight
                      ? <span className="qmark-pulse text-amber-300" style={{ fontSize: '1.6rem' }}>{row.value}</span>
                      : row.value}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </Slide>

        {/* ══════════════════════════════════════════
            SLIDE 6 — 핵심 질문 (전환점)
        ══════════════════════════════════════════ */}
        <Slide index={5} bg="#0a0a12">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/photos/time.jpg`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.55, zIndex: 0 }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'rgba(4,4,12,0.5)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 60%, rgba(217,119,6,0.07) 0%, transparent 70%)', zIndex: 2 }} />

          <div className="relative z-10 text-center px-8 max-w-6xl w-full">
            <p className="pr text-amber-400 text-2xl tracking-[0.2em] uppercase font-semibold mb-8"
              style={{ fontFamily: 'Pretendard', textShadow: '0 2px 12px rgba(0,0,0,0.95)' }}>
              핵심 질문으로의 전환
            </p>

            <div className="pr-d1 mb-10">
              <h2 className="font-extrabold text-white break-keep leading-snug"
                style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)', fontFamily: 'Pretendard', wordBreak: 'keep-all', textShadow: '0 2px 20px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,1)' }}>
                단순히 강의를 제공하는 것이 아니라,
                <br />
                <span style={{ color: '#fbbf24', textShadow: '0 0 40px rgba(245,158,11,0.5), 0 2px 16px rgba(0,0,0,1)' }}>
                  '결과'와 '시간'을 중심으로 업을 정의
                </span>
              </h2>
            </div>

            {/* 3가지 이유 */}
            <div className="pr-d2 grid grid-cols-3 gap-4 mb-8">
              {[
                {
                  num: '01',
                  text: '브랜드 본질과 일관',
                  sub: "'단기'라는 브랜드 정체성과 가장 직접적으로 연결되는 기준",
                  color: '#f59e0b', bg: 'rgba(0,0,0,0.55)', border: 'rgba(245,158,11,0.35)',
                },
                {
                  num: '02',
                  text: '고객 가치와 직결',
                  sub: '빠른 합격은 고객이 실제로 원하는 것 신뢰와 만족으로 직결',
                  color: '#60a5fa', bg: 'rgba(0,0,0,0.55)', border: 'rgba(96,165,250,0.35)',
                },
                {
                  num: '03',
                  text: '모든 사업에 적용 가능',
                  sub: '공무원·어학·자격증 등 다양한 영역에서 동일하게 작동하는 기준',
                  color: '#34d399', bg: 'rgba(0,0,0,0.55)', border: 'rgba(52,211,153,0.35)',
                },
              ].map((item) => (
                <div key={item.num} className="p-5 rounded-2xl text-left"
                  style={{ background: item.bg, border: `1px solid ${item.border}`, backdropFilter: 'blur(6px)' }}>
                  <div className="font-extrabold text-lg mb-2" style={{ color: item.color, fontFamily: 'Pretendard', opacity: 0.7 }}>{item.num}</div>
                  <div className="font-bold text-xl text-white mb-2 break-keep" style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>{item.text}</div>
                  <p className="text-white/75 text-lg break-keep leading-relaxed" style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all', textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>{item.sub}</p>
                </div>
              ))}
            </div>

            <p className="pr-d3 text-white text-2xl font-semibold break-keep mt-2"
              style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all', textShadow: '0 2px 12px rgba(0,0,0,0.95)' }}>
              <span className="text-amber-400 font-bold">'빠른 합격'</span>이라는 하나의 기준을 잡으면<br />나머지 기준은 자연스럽게 따라온다
            </p>
          </div>
        </Slide>

        {/* ══════════════════════════════════════════
            SLIDE 7 — 업의 본질 정의 ★ 핵심 슬라이드
        ══════════════════════════════════════════ */}
        <Slide index={6} bg="#060609">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/photos/shortcut.png`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.72, zIndex: 0 }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'rgba(4,4,12,0.32)' }} />
          {/* 상단 가운데 흰빛 반짝임 */}
          <div className="absolute pointer-events-none" style={{ top: '-4%', left: '50%', transform: 'translateX(-50%)', zIndex: 3, width: '180px', height: '180px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)' }} />
            <div style={{ position: 'absolute', inset: '30%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 50%, transparent 80%)', boxShadow: '0 0 12px 3px rgba(255,255,255,0.08)' }} />
          </div>
          {/* Strong amber glow center */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 48%, rgba(217,119,6,0.1) 0%, transparent 70%)', zIndex: 2 }} />

          <div className="relative z-10 text-left px-16 w-full" style={{ maxWidth: '72rem', alignSelf: 'flex-start', marginTop: '-24vh', marginLeft: '4vw' }}>
            <p className="pr text-amber-400/90 text-2xl tracking-[0.25em] uppercase font-semibold mb-10"
              style={{ fontFamily: 'Pretendard', textShadow: '0 2px 12px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1)' }}>
              1조의 정의
            </p>

            {/* 메인 인용구 */}
            <blockquote className="pr-d1 font-extrabold text-white break-keep leading-snug mb-6"
              style={{
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontFamily: 'Pretendard',
                wordBreak: 'keep-all',
                textShadow: '0 2px 24px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,1)',
              }}>
              고객이 원하는 목표를
              <br />
              <span style={{
                color: '#f59e0b',
                textShadow: '0 0 60px rgba(245,158,11,0.6), 0 2px 20px rgba(0,0,0,1)',
              }}>
                가장 빠르게 현실로 만들고,
              </span>
              <br />
              그들을 다음 삶으로 보내는 것
            </blockquote>

          </div>
        </Slide>

        {/* ══════════════════════════════════════════
            SLIDE 8 — 앞으로 집중해야 할 것
        ══════════════════════════════════════════ */}
        <Slide index={7} bg="#0c0c16">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/photos/infinity.jpg`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.45, zIndex: 0 }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'rgba(4,4,12,0.55)' }} />
          <div className="relative z-10 text-center px-6 w-full" style={{ maxWidth: '88rem' }}>
            <p className="pr text-amber-400/75 text-2xl tracking-[0.2em] uppercase font-semibold mb-4"
              style={{ fontFamily: 'Pretendard', textShadow: '0 2px 12px rgba(0,0,0,1)' }}>
              업의 본질의 관점에서 앞으로 집중해야할 것
            </p>
            <h2 className="pr-d1 font-extrabold text-white break-keep leading-tight mb-12"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontFamily: 'Pretendard', wordBreak: 'keep-all', textShadow: '0 2px 20px rgba(0,0,0,1)' }}>
              빠른 합격이 만들어내는&nbsp;<span style={{ color: '#f59e0b', textShadow: '0 0 40px rgba(245,158,11,0.5), 0 2px 16px rgba(0,0,0,1)' }}>선순환 구조</span>
            </h2>

            {/* 4단계 플로우 카드 — 순차 등장 */}
            <div className="grid grid-cols-4 gap-4 items-start mb-4">
              {[
                { label: '빠른 합격',      color: '#f59e0b', border: 'rgba(245,158,11,0.4)',   desc: '커리큘럼과 서비스를 속도 중심으로 설계해 고객이 목표를 가장 빠르게 달성하도록 돕는다' },
                { label: '신뢰·만족',      color: '#34d399', border: 'rgba(52,211,153,0.4)',   desc: '빠른 성취 경험이 우리 브랜드에 대한 깊은 신뢰와 만족으로 자연스럽게 이어진다' },
                { label: '재방문',         color: '#60a5fa', border: 'rgba(96,165,250,0.4)',   desc: '신뢰를 쌓은 고객이 다음 목표를 위해 다시 우리를 찾는 선순환 구조가 만들어진다' },
                { label: '평생 교육 브랜드', color: '#c084fc', border: 'rgba(192,132,252,0.4)', desc: '한 번의 합격을 넘어 고객 삶 전반의 교육 파트너로 기억되는 영속하는 브랜드가 된다' },
              ].map((item, idx) => (
                <div key={item.label} className="relative"
                  style={{ opacity: 0, animation: active === 7 ? `pr-left 1.1s ${idx * 0.45}s cubic-bezier(0.16,1,0.3,1) forwards` : 'none' }}>
                  {idx < 3 && (
                    <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-10 text-amber-400/70 text-4xl font-bold"
                      style={{ fontFamily: 'Pretendard' }}>→</div>
                  )}
                  <div className="p-6 rounded-2xl text-left h-full flex flex-col"
                    style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${item.border}`, backdropFilter: 'blur(8px)' }}>
                    <div className="font-extrabold text-2xl mb-4 break-keep"
                      style={{ color: item.color, fontFamily: 'Pretendard', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
                      {item.label}
                    </div>
                    <p className="text-white/70 text-lg leading-relaxed break-keep flex-1"
                      style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 준비해야 할 일 카드 — 위 카드 완료 후 아래로 등장 */}
            <div className="grid grid-cols-4 gap-4 items-start">
              {[
                { color: '#f59e0b', border: 'rgba(245,158,11,0.25)', items: ['핵심 중심 커리큘럼 설계', '데이터 기반 개인화 프리미엄 서비스', '합격 기간, 합격률 KPI 측정 시스템'] },
                { color: '#34d399', border: 'rgba(52,211,153,0.25)', items: ['합격 후기를 브랜드 커뮤니케이션에 활용', '합격생 성공 스토리 수집', '고객 만족도(NPS) 정기 측정'] },
                { color: '#60a5fa', border: 'rgba(96,165,250,0.25)', items: ['합격 후 다음 목표 콘텐츠 라인업 확보', '합격생 전용 멤버십, 혜택 구조', '개인화된 다음 목표 추천 시스템'] },
                { color: '#c084fc', border: 'rgba(192,132,252,0.25)', items: ['생애 주기별 콘텐츠 확장 로드맵', 'e-포트폴리오 기반 마이 데이터 체계', 'AI, 미래 직군 콘텐츠 선제 준비'] },
              ].map((item, idx) => {
                const cardStart = 2.6 + idx * 0.25
                const borderStart = cardStart + 0.9
                const seg = 0.35
                return (
                  <div key={idx} className="relative p-5 rounded-2xl text-left overflow-hidden"
                    style={{
                      opacity: 0,
                      animation: active === 7 ? `pr-down 0.9s ${cardStart}s cubic-bezier(0.16,1,0.3,1) forwards` : 'none',
                      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                    {/* 시계방향 테두리 드로우 */}
                    {active === 7 && <>
                      <span className="absolute top-0 left-0 h-[2px]" style={{ background: item.color, width: 0, animation: `bd-top ${seg}s ${borderStart}s ease forwards` }} />
                      <span className="absolute top-0 right-0 w-[2px]" style={{ background: item.color, height: 0, animation: `bd-right ${seg}s ${borderStart + seg}s ease forwards` }} />
                      <span className="absolute bottom-0 right-0 h-[2px]" style={{ background: item.color, width: 0, animation: `bd-bottom ${seg}s ${borderStart + seg * 2}s ease forwards` }} />
                      <span className="absolute bottom-0 left-0 w-[2px]" style={{ background: item.color, height: 0, animation: `bd-left ${seg}s ${borderStart + seg * 3}s ease forwards` }} />
                    </>}
                    <ul className="flex flex-col gap-2">
                      {item.items.map((text, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/65 text-base break-keep leading-snug"
                          style={{ fontFamily: 'Pretendard', wordBreak: 'keep-all' }}>
                          <span style={{ color: item.color, opacity: 0.7 }} className="shrink-0">·</span>
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </Slide>

        {/* ══════════════════════════════════════════
            SLIDE 9 — 판단 기준 (Speedometer)
        ══════════════════════════════════════════ */}
        <Slide index={8} bg="#141420">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/photos/vs.jpg`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.75, zIndex: 0 }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'rgba(4,4,12,0.45)' }} />
          <div className="relative z-10 text-center px-6 max-w-5xl w-full">
            <p className="pr text-amber-400/75 text-2xl tracking-[0.2em] uppercase font-semibold mb-4"
              style={{ fontFamily: 'Pretendard', textShadow: '0 2px 12px rgba(0,0,0,1)' }}>
              업의 본질 관점에서의 기준
            </p>
            <h2 className="pr-d1 font-extrabold text-white break-keep leading-tight mb-6"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', fontFamily: 'Pretendard', wordBreak: 'keep-all', textShadow: '0 2px 20px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,1)' }}>
              '시간'과 '결과'가
              <br />
              <span style={{ color: '#f59e0b', textShadow: '0 0 40px rgba(245,158,11,0.5), 0 2px 16px rgba(0,0,0,1)' }}>브랜드의 건강을 말한다</span>
            </h2>

            {/* 비교 표 */}
            <div className="pr-d2 w-full overflow-hidden rounded-2xl"
              style={{ border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.01)' }}>
              {/* 헤더 */}
              <div className="grid text-center"
                style={{ gridTemplateColumns: '0.85fr 2fr 2fr', borderBottom: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)' }}>
                <div className="py-4 px-5 font-bold text-2xl text-white/90" style={{ fontFamily: 'Pretendard' }}>기준</div>
                <div className="py-4 px-5 font-bold text-xl border-l" style={{ fontFamily: 'Pretendard', color: '#f87171', borderColor: 'rgba(255,255,255,0.15)' }}>🔴 위험 신호</div>
                <div className="py-4 px-5 font-bold text-xl border-l" style={{ fontFamily: 'Pretendard', color: '#4ade80', borderColor: 'rgba(255,255,255,0.15)' }}>🟢 긍정 신호</div>
              </div>
              {/* 행 */}
              {[
                {
                  tag: '시간',
                  danger: '수강 기간, 재수강률은 늘었는데 합격까지 걸리는 시간은 단축되지 않는다',
                  good: '합격까지 평균 기간이 단축되고 있다',
                },
                {
                  tag: '결과',
                  danger: '콘텐츠 소비량은 많지만 합격률, 목표 달성률은 정체되어 있다',
                  good: '합격률, 학습 완주율, 목표 달성률이 함께 올라가고 있다',
                },
                {
                  tag: '시간 + 결과',
                  danger: '목표를 달성한 고객이 다음 목표로 연결되지 않고 그냥 이탈한다',
                  good: '목표를 이룬 고객이 다음 목표를 위해 재방문하는 비율이 늘고 있다',
                },
              ].map((row, i) => (
                <div key={i} className="grid text-center items-center"
                  style={{ gridTemplateColumns: '0.85fr 2fr 2fr', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent' }}>
                  <div className="py-5 px-5 font-bold text-2xl" style={{ color: '#fbbf24', fontFamily: 'Pretendard' }}>{row.tag}</div>
                  <div className="py-5 px-5 text-lg break-keep border-l text-left" style={{ color: '#fca5a5', fontFamily: 'Pretendard', wordBreak: 'keep-all', borderColor: 'rgba(255,255,255,0.1)', textShadow: '0 0 12px rgba(239,68,68,0.6), 0 2px 6px rgba(0,0,0,0.5)' }}>{row.danger}</div>
                  <div className="py-5 px-5 text-lg break-keep border-l text-left" style={{ color: '#86efac', fontFamily: 'Pretendard', wordBreak: 'keep-all', borderColor: 'rgba(255,255,255,0.1)', textShadow: '0 0 12px rgba(34,197,94,0.6), 0 2px 6px rgba(0,0,0,0.5)' }}>{row.good}</div>
                </div>
              ))}
            </div>
          </div>
        </Slide>

        {/* ══════════════════════════════════════════
            SLIDE 10 — 마무리 (밝은 슬라이드)
        ══════════════════════════════════════════ */}
        <Slide index={9} bg="#0a0a10">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/photos/target_img.png`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.85, zIndex: 0 }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'rgba(4,4,12,0.35)' }} />

          {/* 우측 상단 빛나는 효과 */}
          {active === 9 && (
            <div className="absolute pointer-events-none" style={{
              top: '-43vh', right: '-2vw', zIndex: 2, width: '55vw', height: '55vw',
            }}>
              {/* 외곽 글로우 */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,220,100,0.18) 0%, rgba(245,158,11,0.08) 40%, transparent 70%)',
                animation: 'star-pulse 5s 1s ease-in-out infinite', animationFillMode: 'both',
              }} />
              {/* 회전하는 레이 */}
              <div style={{
                position: 'absolute', inset: '15%', borderRadius: '50%',
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,200,80,0.08) 10%, transparent 20%, rgba(255,200,80,0.06) 30%, transparent 40%, rgba(255,200,80,0.09) 50%, transparent 60%, rgba(255,200,80,0.07) 70%, transparent 80%, rgba(255,200,80,0.08) 90%, transparent 100%)',
                animation: 'ray-spin 16s 1s linear infinite', opacity: 0.25,
              }} />
              {/* 중심 강한 글로우 */}
              <div style={{
                position: 'absolute', inset: '30%', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,240,160,0.55) 0%, rgba(245,158,11,0.3) 35%, transparent 70%)',
                animation: 'star-pulse 4s 1s ease-in-out infinite', animationFillMode: 'both',
              }} />
              {/* 핵심 빛점 */}
              <div style={{
                position: 'absolute', inset: '42%', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,220,0.95) 0%, rgba(255,220,80,0.6) 50%, transparent 80%)',
                animation: 'star-pulse 3.5s 1s ease-in-out infinite', animationFillMode: 'both',
                boxShadow: '0 0 40px 10px rgba(255,220,80,0.3)',
              }} />
            </div>
          )}

          <div className="relative z-10 text-left px-16 w-full" style={{ maxWidth: '72rem', position: 'absolute', top: '22vh', left: '4vw' }}>
            <h2 className="pr font-extrabold break-keep leading-snug mb-9"
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.8rem)',
                fontFamily: 'Pretendard',
                wordBreak: 'keep-all',
                color: '#ffffff',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
                textShadow: '0 2px 24px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,1)',
              }}>
              고객이 가장 빨리 목표를 이루고
              <br />
              <span style={{ color: '#f59e0b', textShadow: '0 0 60px rgba(245,158,11,0.6), 0 2px 20px rgba(0,0,0,1)' }}>우리를 떠나게 하라!</span>
            </h2>

            <p className="pr-d2 break-keep leading-relaxed mb-12"
              style={{
                fontSize: 'clamp(1.3rem, 2.4vw, 2rem)',
                fontFamily: 'Pretendard',
                wordBreak: 'keep-all',
                color: 'rgba(255,255,255,0.75)',
                margin: '0 0 3rem',
                textShadow: '0 2px 20px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,1)',
              }}>
              그것이 ST Unitas가 존재하는 이유이자 영원한 브랜드의 시작입니다.
            </p>

            <div className="pr-d4 inline-flex items-center gap-3 px-8 py-4 rounded-full"
              style={{
                background: 'rgba(217,119,6,0.15)',
                border: '1px solid rgba(217,119,6,0.4)',
                animation: active === 9 ? 'badge-glow 3s 1.5s ease-in-out infinite' : 'none',
              }}>
              <span style={{ color: '#fbbf24', fontFamily: 'Pretendard', fontWeight: 700, fontSize: '1.5rem' }}>
                1조&nbsp;·&nbsp;업의 본질 정의&nbsp;·&nbsp;2026.04.15
              </span>
            </div>
          </div>
        </Slide>

      </div>{/* /scroll container */}
    </>
  )
}
