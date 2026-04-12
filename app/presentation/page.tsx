'use client'

import dynamic from 'next/dynamic'

const PresentationSlides = dynamic(() => import('./presentation'), { ssr: false })

export default function PresentationPage() {
  return <PresentationSlides />
}
