'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// ─── Theme ──────────────────────────────────────────────────────────
const DARK = {
  bg: '#0c0c10',
  text: '#f4f4f5',
  textSub: '#a1a1aa',
  textMuted: '#71717a',
  headline: '#ffffff',
  card: 'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(255,255,255,0.07)',
  divider: 'rgba(255,255,255,0.07)',
  innerCard: 'rgba(255,255,255,0.03)',
  innerBorder: 'rgba(255,255,255,0.05)',
  numColor: '#fbbf24',
  amberText: '#fcd34d',
  amberBg: 'rgba(217,119,6,0.04)',
  amberBorder: 'rgba(217,119,6,0.15)',
  amberBgStrong: 'rgba(217,119,6,0.09)',
  amberBorderStrong: 'rgba(217,119,6,0.32)',
  amberGlow: '0 0 80px rgba(217,119,6,0.08)',
  emeraldBg: 'rgba(16,185,129,0.06)',
  emeraldBorder: 'rgba(16,185,129,0.22)',
  emeraldText: '#34d399',
  roseBg: 'rgba(244,63,94,0.06)',
  roseBorder: 'rgba(244,63,94,0.22)',
  roseText: '#fb7185',
  calloutBg: 'rgba(217,119,6,0.07)',
  calloutBorder: 'rgba(217,119,6,0.2)',
  calloutText: 'rgba(253,230,138,0.9)',
  vsLabel: '#71717a',
  toggleBg: 'rgba(255,255,255,0.06)',
  toggleBorder: 'rgba(255,255,255,0.12)',
  toggleActiveBg: 'rgba(251,191,36,0.18)',
  toggleActiveBorder: 'rgba(251,191,36,0.35)',
  toggleActiveText: '#fcd34d',
  toggleInactiveText: '#71717a',
  modeBtnBg: 'rgba(255,255,255,0.08)',
  modeBtnBorder: 'rgba(255,255,255,0.15)',
  modeBtnText: '#fbbf24',
  photoPlaceholderBg: 'rgba(255,255,255,0.02)',
  dotActive: '#ffffff',
  dotInactive: 'rgba(255,255,255,0.18)',
  arrowBg: 'rgba(0,0,0,0.55)',
  toastBg: '#ffffff',
  toastText: '#18181b',
  toastShadow: '0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
  orbColor: 'rgba(217,119,6,0.07)',
  orb2Color: 'rgba(59,130,246,0.04)',
  footerText: '#a1a1aa',
  footerMuted: '#a1a1aa',
  footerDivider: 'rgba(255,255,255,0.07)',
}

const LIGHT = {
  bg: '#f8f7f2',
  text: '#27272a',
  textSub: '#52525b',
  textMuted: '#a1a1aa',
  headline: '#18181b',
  card: 'rgba(0,0,0,0.04)',
  cardBorder: 'rgba(0,0,0,0.09)',
  divider: 'rgba(0,0,0,0.08)',
  innerCard: 'rgba(0,0,0,0.025)',
  innerBorder: 'rgba(0,0,0,0.06)',
  numColor: '#d97706',
  amberText: '#b45309',
  amberBg: 'rgba(217,119,6,0.05)',
  amberBorder: 'rgba(217,119,6,0.2)',
  amberBgStrong: 'rgba(217,119,6,0.08)',
  amberBorderStrong: 'rgba(217,119,6,0.35)',
  amberGlow: '0 0 40px rgba(217,119,6,0.05)',
  emeraldBg: 'rgba(16,185,129,0.07)',
  emeraldBorder: 'rgba(5,150,105,0.3)',
  emeraldText: '#059669',
  roseBg: 'rgba(244,63,94,0.07)',
  roseBorder: 'rgba(225,29,72,0.25)',
  roseText: '#e11d48',
  calloutBg: 'rgba(217,119,6,0.08)',
  calloutBorder: 'rgba(217,119,6,0.28)',
  calloutText: '#92400e',
  vsLabel: '#a1a1aa',
  toggleBg: 'rgba(0,0,0,0.05)',
  toggleBorder: 'rgba(0,0,0,0.1)',
  toggleActiveBg: 'rgba(217,119,6,0.12)',
  toggleActiveBorder: 'rgba(217,119,6,0.3)',
  toggleActiveText: '#b45309',
  toggleInactiveText: '#a1a1aa',
  modeBtnBg: 'rgba(0,0,0,0.06)',
  modeBtnBorder: 'rgba(0,0,0,0.12)',
  modeBtnText: '#b45309',
  photoPlaceholderBg: 'rgba(0,0,0,0.03)',
  dotActive: '#18181b',
  dotInactive: 'rgba(0,0,0,0.18)',
  arrowBg: 'rgba(0,0,0,0.45)',
  toastBg: '#18181b',
  toastText: '#ffffff',
  toastShadow: '0 20px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.15)',
  orbColor: 'rgba(217,119,6,0.04)',
  orb2Color: 'rgba(59,130,246,0.03)',
  footerText: '#52525b',
  footerMuted: '#52525b',
  footerDivider: 'rgba(0,0,0,0.08)',
}

type TH = typeof DARK

// ─── Section Header ─────────────────────────────────────────────────
function SectionHeader({ number, title, th }: { number?: string; title: string; th: TH }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {number && (
        <span className="shrink-0 text-3xl font-extrabold leading-none" style={{ color: th.numColor }}>
          {number}.
        </span>
      )}
      <h2 className="text-2xl font-bold break-keep" style={{ color: th.headline }}>{title}</h2>
      <span className="flex-1 h-px" style={{ background: th.divider }} />
    </div>
  )
}

// ─── Top Bar (토글 + 다크모드 버튼) ────────────────────────────────
function TopBar({
  onPresentationClick,
  isDark,
  onToggleDark,
  th,
}: {
  onPresentationClick: (e: React.MouseEvent) => void
  isDark: boolean
  onToggleDark: () => void
  th: TH
}) {
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-2" style={{ maxWidth: '100vw' }}>
      {/* 보고 자료 / 발표 자료 토글 */}
      <div
        className="relative flex items-center rounded-full p-1 flex-nowrap"
        style={{ background: th.toggleBg, border: `1px solid ${th.toggleBorder}`, backdropFilter: 'blur(12px)' }}
      >
        <span
          className="absolute left-1 top-1 bottom-1 rounded-full transition-all duration-300"
          style={{ width: 'calc(50% - 4px)', background: th.toggleActiveBg, border: `1px solid ${th.toggleActiveBorder}` }}
        />
        <button
          className="relative z-10 px-3 py-1.5 text-xs sm:text-sm sm:px-5 font-semibold rounded-full transition-colors duration-200 whitespace-nowrap"
          style={{ color: th.toggleActiveText }}
        >
          보고 자료
        </button>
        <button
          onClick={onPresentationClick}
          className="relative z-10 px-3 py-1.5 text-xs sm:text-sm sm:px-5 font-semibold rounded-full transition-colors duration-200 whitespace-nowrap"
          style={{ color: th.toggleInactiveText }}
        >
          발표 자료
        </button>
      </div>

      {/* 다크/라이트 모드 버튼 — 토글 바로 오른쪽 */}
      <button
        onClick={onToggleDark}
        className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-200"
        style={{ background: th.modeBtnBg, border: `1px solid ${th.modeBtnBorder}`, backdropFilter: 'blur(12px)' }}
        title={isDark ? '라이트 모드' : '다크 모드'}
      >
        <span style={{ fontSize: '0.9rem' }}>{isDark ? '☀️' : '🌙'}</span>
      </button>
    </div>
  )
}

// ─── Toast (상단) ────────────────────────────────────────────────────
function Toast({ show, th }: { show: boolean; th: TH }) {
  return (
    <div
      className="fixed top-20 left-1/2 z-[100] pointer-events-none"
      style={{
        transition: 'opacity 0.3s cubic-bezier(0.16,1,0.3,1), transform 0.3s cubic-bezier(0.16,1,0.3,1)',
        opacity: show ? 1 : 0,
        transform: show ? 'translate(-50%, 0)' : 'translate(-50%, -14px)',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        className="px-8 py-4 rounded-2xl font-bold flex items-center gap-3"
        style={{
          background: th.toastBg,
          color: th.toastText,
          boxShadow: th.toastShadow,
          fontSize: '1.08rem',
          letterSpacing: '0.01em',
        }}
      >
        <span style={{ fontSize: '1.3rem' }}>🚧</span>
        발표 자료 준비중입니다.
      </div>
    </div>
  )
}

// ─── Photo Slider ────────────────────────────────────────────────────
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const CHAT_IMAGES = [
  { src: '/photos/KakaoTalk_20260412_004029254.jpg', alt: '회의 기록 0' },
  { src: '/photos/chat1.png', alt: '회의 기록 1' },
  { src: '/photos/chat2.png', alt: '회의 기록 2' },
  { src: '/photos/chat3.png', alt: '회의 기록 3' },
  { src: '/photos/chat4.png', alt: '회의 기록 4' },
  { src: '/photos/chat5.png', alt: '회의 기록 5' },
]

function Lightbox({
  images, startIdx, isDark, onNavigate, onClose,
}: {
  images: typeof CHAT_IMAGES
  startIdx: number
  isDark: boolean
  onNavigate: (i: number) => void
  onClose: () => void
}) {
  const [idx, setIdx] = useState(startIdx)
  const total = images.length
  const touchStartX = useRef<number | null>(null)

  const go = (i: number) => { setIdx(i); onNavigate(i) }
  const prev = () => go(Math.max(0, idx - 1))
  const next = () => go(Math.min(total - 1, idx + 1))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [idx])

  // 다크/라이트 버튼 스타일
  const btnBase: React.CSSProperties = {
    width: 48, height: 48,
    borderRadius: '50%',
    fontSize: '1.2rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    flexShrink: 0,
    backdropFilter: 'blur(8px)',
    ...(isDark
      ? { background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.22)', color: '#ffffff' }
      : { background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(0,0,0,0.14)', color: '#18181b' }
    ),
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9999, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
      onClick={onClose}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchStartX.current === null) return
        const dx = e.changedTouches[0].clientX - touchStartX.current
        if (dx < -50) next()
        else if (dx > 50) prev()
        touchStartX.current = null
      }}
    >
      <div className="flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>

        {/* 닫기 버튼 — 이미지 위 중앙 */}
        <button onClick={onClose} style={btnBase} aria-label="닫기">✕</button>

        {/* 좌화살표 | 이미지 | 우화살표 */}
        <div className="flex items-center gap-4">
          <button
            onClick={prev}
            style={{ ...btnBase, opacity: idx > 0 ? 1 : 0, pointerEvents: idx > 0 ? 'auto' : 'none' }}
          >←</button>

          {/* 이미지: 브라우저 높이 80% */}
          <Image
            key={idx}
            src={`${BASE_PATH}${images[idx].src}`}
            alt={images[idx].alt}
            width={0}
            height={0}
            sizes="90vw"
            priority
            style={{ height: '80vh', width: 'auto', maxWidth: '82vw', objectFit: 'contain', display: 'block' }}
          />

          <button
            onClick={next}
            style={{ ...btnBase, opacity: idx < total - 1 ? 1 : 0, pointerEvents: idx < total - 1 ? 'auto' : 'none' }}
          >→</button>
        </div>

        {/* 도트 */}
        <div className="flex items-center gap-2.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-300"
              style={{ width: i === idx ? 22 : 8, height: 8, cursor: 'pointer',
                background: i === idx ? (isDark ? '#fff' : '#18181b') : 'rgba(255,255,255,0.38)' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// 첫 번째 이미지(KakaoTalk) 기준 가로세로 비율 = 1400:1050 = 4:3
const SLIDER_ASPECT = '1400 / 1050'

function PhotoSlider({ th, isDark }: { th: TH; isDark: boolean }) {
  const [idx, setIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const total = CHAT_IMAGES.length
  const touchStartX = useRef<number | null>(null)

  const prev = () => setIdx(i => Math.max(0, i - 1))
  const next = () => setIdx(i => Math.min(total - 1, i + 1))

  return (
    <>
      <div>
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${th.cardBorder}` }}
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={e => {
            if (touchStartX.current === null) return
            const dx = e.changedTouches[0].clientX - touchStartX.current
            if (dx < -50) next()
            else if (dx > 50) prev()
            touchStartX.current = null
          }}
        >
          {/* Slide track */}
          <div
            className="flex"
            style={{ transform: `translateX(-${idx * 100}%)`, transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)' }}
          >
            {CHAT_IMAGES.map((img, i) => (
              <div
                key={i}
                className="relative shrink-0 w-full overflow-hidden"
                style={{ aspectRatio: SLIDER_ASPECT, background: th.photoPlaceholderBg, cursor: 'pointer' }}
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  src={`${BASE_PATH}${img.src}`}
                  alt={img.alt}
                  fill
                  className="object-contain transition-transform duration-500 ease-out hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 896px"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>

          {/* 좌우 화살표 */}
          {idx > 0 && (
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white text-lg"
              style={{ background: th.arrowBg, backdropFilter: 'blur(4px)' }}
            >←</button>
          )}
          {idx < total - 1 && (
            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white text-lg"
              style={{ background: th.arrowBg, backdropFilter: 'blur(4px)' }}
            >→</button>
          )}
        </div>

        {/* 하단 네비게이터 도트 */}
        <div className="flex justify-center items-center gap-2.5 mt-4">
          {CHAT_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="rounded-full transition-all duration-300"
              style={{ width: i === idx ? 22 : 8, height: 8, background: i === idx ? th.dotActive : th.dotInactive }}
            />
          ))}
        </div>
      </div>

      {/* 라이트박스 */}
      {lightboxOpen && (
        <Lightbox
          images={CHAT_IMAGES}
          startIdx={idx}
          isDark={isDark}
          onNavigate={setIdx}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function ReportPage() {
  const router = useRouter()
  const [isDark, setIsDark] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const th = isDark ? DARK : LIGHT

  // localStorage 다크모드 복원
  useEffect(() => {
    const stored = localStorage.getItem('report-theme')
    if (stored === 'light') setIsDark(false)
  }, [])

  // body 스크롤 잠금 (모바일 fixed 토글 고정용)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // 스크롤 애니메이션 옵저버
  useEffect(() => {
    const scrollEl = document.getElementById('report-scroll')
    const els = document.querySelectorAll<HTMLElement>('.anim, .anim-left, .anim-right, .anim-fade')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px', root: scrollEl ?? null }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  function toggleDark() {
    setIsDark((d) => {
      const next = !d
      localStorage.setItem('report-theme', next ? 'dark' : 'light')
      return next
    })
  }

  function handlePresentationClick(e: React.MouseEvent) {
    if (e.ctrlKey || e.metaKey) {
      router.push('/presentation')
      return
    }
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setShowToast(true)
    toastTimer.current = setTimeout(() => setShowToast(false), 2800)
  }

  return (
    <div
      className="fixed inset-0 font-sans antialiased transition-colors duration-300"
      style={{ background: th.bg, color: th.text }}
    >
      {/* ── Ambient 배경 ──────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="glow-orb absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
          style={{ background: `radial-gradient(ellipse, ${th.orbColor} 0%, transparent 70%)` }}
        />
        <div
          className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(circle, ${th.orb2Color} 0%, transparent 70%)` }}
        />
      </div>

      {/* ── 상단 바 (토글 + 다크모드) — 스크롤 컨테이너 밖 ── */}
      <TopBar
        onPresentationClick={handlePresentationClick}
        isDark={isDark}
        onToggleDark={toggleDark}
        th={th}
      />

      {/* ── 토스트 (상단) ─────────────────────────────────────── */}
      <Toast show={showToast} th={th} />

      {/* ── 스크롤 가능한 본문 영역 ───────────────────────────── */}
      <div id="report-scroll" className="absolute inset-0 overflow-y-auto" style={{ zIndex: 5 }}>
      <div className="relative max-w-4xl mx-auto px-6 sm:px-12 py-16 pb-28" style={{ zIndex: 10 }}>

        {/* ════════════════════════════════════════════════════
            COVER
        ════════════════════════════════════════════════════ */}
        <header className="anim mb-16">
          <div className="flex items-center gap-3 my-8">
            <span className="h-px flex-1" style={{ background: th.divider }} />
            <span className="text-sm tracking-[0.15em] uppercase font-semibold" style={{ color: th.textMuted }}>
              조별 토론 결과 보고서
            </span>
            <span style={{ color: th.textMuted }}>·</span>
            <span className="text-sm" style={{ color: th.textMuted }}>2026.04.15</span>
            <span className="h-px flex-1" style={{ background: th.divider }} />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight break-keep mb-5" style={{ color: th.headline }}>
            업의 본질 <span style={{ color: th.numColor }}>정의</span>
          </h1>

          <p className="text-xl leading-relaxed break-keep" style={{ color: th.textSub }}>
            안녕하세요, 1조 조장을 맡은 진광식입니다. 이번{' '}
            <span className="font-medium" style={{ color: th.text }}>"업의 본질 정의"</span>{' '}
            조별 토론과 관련하여 현재까지의 논의 과정과 정리 내용을 공유드립니다.
          </p>
        </header>

        {/* ════════════════════════════════════════════════════
            1. 접근 방식
        ════════════════════════════════════════════════════ */}
        <section className="anim mb-16" style={{ '--d': '50ms' } as React.CSSProperties}>
          <SectionHeader number="1" title="접근 방식" th={th} />
          <p className="text-xl leading-relaxed break-keep mb-4" style={{ color: th.textSub }}>
            저희 조는 이번 과제를 단순히 하나의 정답을 도출하는 것이 아니라, 각자의 관점과 경험을
            바탕으로 다양한 해석을 충분히 나누고, 그 안에서 공통된 방향을 찾아가는 과정으로
            진행하였습니다.
          </p>
          <p className="text-xl leading-relaxed break-keep" style={{ color: th.textSub }}>
            총 4차례의 회의와 간단한 미팅을 통해 의견을 보완하고 정리하였습니다.
          </p>
        </section>

        {/* ════════════════════════════════════════════════════
            2. 주요 관점
        ════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <div className="anim">
            <SectionHeader number="2" title="주요 관점" th={th} />
            <p className="text-xl leading-relaxed break-keep mb-6" style={{ color: th.textSub }}>
              논의 과정에서는 다음과 같이 다양한 시각과 해석이 동시에 제시되었습니다.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                num: '①',
                title: "'단기' 브랜드 중심 관점",
                desc: "ST Unitas의 핵심은 결국 '단기 합격'이라는 약속에 있음. 고객이 빠르게 목표를 달성하고 떠날 수 있도록 돕는 것이 본질이라는 의견",
                delay: '0ms',
              },
              {
                num: '②',
                title: '평생 교육/확장 관점',
                desc: '공무원 시험을 넘어 고객의 인생 전반에 걸친 교육 파트너로 확장해야 한다는 의견. 유비쿼터스처럼 삶에 자연스럽게 녹아드는 서비스 지향',
                delay: '80ms',
              },
              {
                num: '③',
                title: '고객 감정 및 경험 관점',
                desc: "고객은 불안한 상태에서 시작하며, 이를 '믿음'으로 전환시키는 것이 핵심 가치. 심리적 확신과 지속 동기 부여가 중요하다는 시각",
                delay: '160ms',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="anim flex items-start gap-5 p-5 rounded-2xl"
                style={{
                  '--d': item.delay,
                  background: th.card,
                  border: `1px solid ${th.cardBorder}`,
                } as React.CSSProperties}
              >
                <span className="shrink-0 font-bold text-2xl mt-0.5" style={{ color: th.numColor }}>{item.num}</span>
                <div>
                  <h3 className="font-semibold text-xl mb-1.5 break-keep" style={{ color: th.text }}>{item.title}</h3>
                  <p className="text-lg leading-relaxed break-keep" style={{ color: th.textSub }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            3. 핵심 포인트 — VS 좌우 충돌 애니메이션
        ════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <div className="anim">
            <SectionHeader number="3" title="핵심 포인트" th={th} />
            <p className="text-xl leading-relaxed break-keep mb-6" style={{ color: th.textSub }}>
              정리를 해보니 우리 회사 안에는 다양한 관점이 존재하지만, 모든 것을 동시에 취하기는
              어렵다는 점이 딜레마로 드러났습니다.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {[
              ["'빠른 합격(단기)'", "'현재 상품 구조(평생 프리패스 등)'"],
              ["'속도 중심'", "'경험/감정 중심'"],
              ["'강사 중심'", "'플랫폼 기술 중심'"],
            ].map(([a, b], i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-lg"
              >
                {/* 좌 패널 — 왼쪽에서 등장 */}
                <div
                  className="anim-left flex-1 text-center font-medium break-keep py-3 px-5 rounded-xl"
                  style={{
                    '--d': `${i * 90}ms`,
                    background: th.card,
                    border: `1px solid ${th.cardBorder}`,
                    color: th.text,
                  } as React.CSSProperties}
                >
                  {a}
                </div>
                {/* VS 라벨 — 페이드 */}
                <span
                  className="anim-fade shrink-0 text-sm font-bold w-10 text-center tracking-widest"
                  style={{ '--d': `${i * 90 + 50}ms`, color: th.vsLabel } as React.CSSProperties}
                >
                  VS
                </span>
                {/* 우 패널 — 오른쪽에서 등장 */}
                <div
                  className="anim-right flex-1 text-center font-medium break-keep py-3 px-5 rounded-xl"
                  style={{
                    '--d': `${i * 90}ms`,
                    background: th.card,
                    border: `1px solid ${th.cardBorder}`,
                    color: th.text,
                  } as React.CSSProperties}
                >
                  {b}
                </div>
              </div>
            ))}
          </div>

          <div
            className="anim p-5 rounded-xl"
            style={{ background: th.calloutBg, border: `1px solid ${th.calloutBorder}` }}
          >
            <p className="text-lg leading-relaxed break-keep" style={{ color: th.calloutText }}>
              특히 &apos;단기&apos;라는 브랜드를 사용하면서도 실제 서비스 구조는 장기 이용을
              전제로 한다는 점에서{' '}
              <strong style={{ color: isDark ? '#fcd34d' : '#92400e' }}>브랜드와 고객 경험 사이의 간극</strong>
              이 존재한다는 문제의식이 공통적으로 제기되었습니다.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            4. 최종 방향 — 덜 눈에 띄게
        ════════════════════════════════════════════════════ */}
        <section className="mb-16 anim">
          <SectionHeader number="4" title="최종 방향" th={th} />
          <div
            className="relative p-6 rounded-2xl overflow-hidden"
            style={{ background: th.amberBg, border: `1px solid ${th.amberBorder}` }}
          >
            <blockquote
              className="text-2xl sm:text-3xl font-bold leading-snug break-keep mb-4"
              style={{ color: th.amberText }}
            >
              &ldquo;고객이 목표를 달성하기까지 걸리는
              <br />
              시간을 얼마나 줄여주는가&rdquo;
            </blockquote>
            <p className="text-base leading-relaxed break-keep" style={{ color: th.textSub }}>
              이 기준이{' '}
              <span style={{ color: th.text }}>&apos;단기&apos;라는 브랜드의 본질</span>과 가장
              일관되고, 다양한 사업 영역에도 적용 가능하며, 실제 고객 가치와도 직접적으로
              연결된다고 판단했습니다.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            5. 업의 본질 정의 — 더 눈에 띄게 + 이유 병합
        ════════════════════════════════════════════════════ */}
        <section className="mb-16 anim">
          <SectionHeader number="5" title="업의 본질 정의" th={th} />

          <div
            className="py-12 px-8 sm:px-14 rounded-2xl"
            style={{
              background: th.amberBgStrong,
              border: `1px solid ${th.amberBorderStrong}`,
              boxShadow: th.amberGlow,
            }}
          >
            {/* 메인 인용구 */}
            <blockquote
              className="text-3xl sm:text-4xl font-bold leading-snug break-keep text-center mb-6"
              style={{ color: th.headline }}
            >
              &ldquo;우리는 고객이 원하는 목표를
              <br />
              <span style={{ color: th.numColor }}>가장 빠르게 현실로 만들고,</span>
              <br />
              그들을 다음 삶으로 보내는 회사다.&rdquo;
            </blockquote>

            <div className="w-10 h-px mx-auto mb-6" style={{ background: 'rgba(217,119,6,0.4)' }} />

            {/* 정의 이유 */}
            <p className="text-lg leading-relaxed break-keep text-center mb-8" style={{ color: th.textSub }}>
              단순히 강의를 제공하는 것이 아니라, 고객의{' '}
              <span style={{ color: th.text }}>&apos;결과&apos;와 &apos;시간&apos;</span>을 중심으로
              우리가 추구해야 할 가치를 정의한 것입니다.
            </p>

            {/* 구분선 */}
            <div className="w-full h-px mb-8" style={{ background: th.divider }} />

            {/* 선순환 설명 — 같은 블록 안으로 통합 */}
            <p className="text-lg leading-relaxed break-keep" style={{ color: th.textSub }}>
              고객이 목표를 달성하는 경험 자체가 브랜드에 대한 신뢰와 만족으로 이어지고, 이후{' '}
              <strong style={{ color: th.headline, fontWeight: 700 }}>
                새로운 목표가 생겼을 때 다시 우리 회사를 찾게 만드는 선순환을 형성
              </strong>
              할 수 있다고 보았습니다. 이는 단순한 재방문을 넘어{' '}
              <strong style={{ color: th.headline, fontWeight: 700 }}>
                고객의 삶 전반에 걸쳐 함께하는 브랜드로 확장될 수 있는 가능성
              </strong>
              을 의미하며, 장기적으로 미래 사업의 성공 확률을 높이는 핵심 지표라는
              점에서도 의미가 있습니다.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            6. 앞으로 집중해야 할 일
        ════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <div className="anim">
            <SectionHeader number="6" title="앞으로 집중해야 할 일" th={th} />
          </div>
          <div className="flex flex-col gap-3">
            {[
              '고객이 목표를 달성하기까지 걸리는 시간을 실질적으로 단축시키는 데 집중해야 한다.',
              '고객의 체류시간이 아니라, 목표 달성까지의 속도를 핵심 성과 지표로 삼아야 한다.',
              '고객이 빠르게 성취하고 다음 단계로 나아갈 수 있도록 돕는 구조와 경험을 설계해야 한다.',
            ].map((item, i) => (
              <div
                key={i}
                className="anim flex items-start gap-5 p-5 rounded-xl"
                style={{
                  '--d': `${i * 70}ms`,
                  background: th.card,
                  border: `1px solid ${th.cardBorder}`,
                } as React.CSSProperties}
              >
                <span className="shrink-0 font-extrabold text-2xl mt-0.5" style={{ color: th.numColor }}>
                  {i + 1}
                </span>
                <p className="text-lg leading-relaxed break-keep" style={{ color: th.textSub }}>{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            7. 판단 기준
        ════════════════════════════════════════════════════ */}
        <section className="mb-16 anim">
          <SectionHeader number="7" title="업의 본질 관점에서의 판단 기준" th={th} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="anim p-5 rounded-2xl"
              style={{
                '--d': '0ms',
                background: th.emeraldBg,
                border: `1px solid ${th.emeraldBorder}`,
              } as React.CSSProperties}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: th.emeraldText }} />
                <span className="text-base font-bold" style={{ color: th.emeraldText }}>잘 가고 있다는 기준</span>
              </div>
              <p className="text-lg leading-relaxed break-keep mb-3 font-medium" style={{ color: th.text }}>
                고객이 목표를 달성하기까지 걸리는 시간이 실제로 단축되고 있는가
              </p>
              <div className="p-4 rounded-lg" style={{ background: th.innerCard, border: `1px solid ${th.innerBorder}` }}>
                <p className="text-base leading-relaxed break-keep" style={{ color: th.textSub }}>
                  예: 기존 평균 합격 18개월 → 커리큘럼 개선·프리미엄 서비스 도입 후 12개월로
                  단축됐다면 명확한 긍정 신호
                </p>
              </div>
            </div>

            <div
              className="anim p-5 rounded-2xl"
              style={{
                '--d': '80ms',
                background: th.roseBg,
                border: `1px solid ${th.roseBorder}`,
              } as React.CSSProperties}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: th.roseText }} />
                <span className="text-base font-bold" style={{ color: th.roseText }}>어긋나고 있다는 신호</span>
              </div>
              <p className="text-lg leading-relaxed break-keep mb-3 font-medium" style={{ color: th.text }}>
                고객의 체류 기간이 길어지는 것이 성과로 인식되고 있는가
              </p>
              <div className="p-4 rounded-lg" style={{ background: th.innerCard, border: `1px solid ${th.innerBorder}` }}>
                <p className="text-base leading-relaxed break-keep" style={{ color: th.textSub }}>
                  예: &apos;프리패스 이용 기간이 길어졌다&apos;, &apos;재수강률이 높아졌다&apos;를 긍정 지표로만 해석 → 고객이 빠르게 목표를
                  달성하지 못하고 있을 가능성
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            8. 인사이트
        ════════════════════════════════════════════════════ */}
        <section className="mb-16 anim">
          <SectionHeader number="8" title="인사이트" th={th} />
          <div className="flex flex-col gap-4">
            {[
              '이번 과제는 단순한 결과 도출을 넘어, 조직 내 다양한 시각을 공유하고 이를 하나의 방향으로 정리하는 과정 자체에 더 큰 의미가 있다고 이해했습니다.',
              "저희 조 역시 여러 차례 논의를 거치며 각자의 관점을 충분히 나누었고, 그 과정에서 단순히 '정답'을 찾기보다 우리가 어떤 기준으로 생각하고 일해야 하는지를 고민하는 데 집중했습니다.",
              '결과적으로 이번 과제를 통해, 우리가 하는 일이 단순한 업무 수행을 넘어 고객의 삶에 어떤 가치를 만들어내고 있는지 다시 바라볼 수 있었고, 앞으로 더 의미 있는 방향으로 일을 만들어갈 수 있는 기준을 고민해볼 수 있는 값진 경험이었다고 생각합니다.',
            ].map((text, i) => (
              <p
                key={i}
                className="anim text-lg leading-relaxed break-keep"
                style={{
                  '--d': `${i * 80}ms`,
                  color: th.textSub,
                } as React.CSSProperties}
              >
                {text}
              </p>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            회의 기록 — 슬라이드 + 호버 확대
        ════════════════════════════════════════════════════ */}
        <section className="mb-16 anim">
          <SectionHeader title="회의 기록" th={th} />
          <PhotoSlider th={th} isDark={isDark} />
        </section>

        {/* ════════════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════════════ */}
        <footer className="anim pt-7" style={{ borderTop: `1px solid ${th.footerDivider}` }}>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-lg font-semibold" style={{ color: th.text }}>1조 조장 진광식 드림</div>
              <div className="text-base mt-1" style={{ color: th.footerMuted }}>2026년 4월 15일</div>
            </div>
            <div className="text-base tracking-[0.1em]" style={{ color: th.footerMuted }}>감사합니다</div>
          </div>
        </footer>

      </div>
      </div>{/* /report-scroll */}
    </div>
  )
}
