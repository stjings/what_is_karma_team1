import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '업의 본질 정의 — 조별 토론 결과 보고서',
  description: '○○조 조별 토론 논의 과정 및 결과 정리 보고서',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="font-sans">{children}</body>
    </html>
  )
}
