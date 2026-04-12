'use client'

import dynamic from 'next/dynamic'

const ReportPage = dynamic(() => import('./report'), { ssr: false })

export default function Page() {
  return <ReportPage />
}
