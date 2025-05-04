import { TracingBeam } from '@/components/common/tracing-beam'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { TracingBeamDemo } from '@/components/sections/About/TracingBeam'
import React from 'react'

export default function AboutPage() {
  return (
    <div>
        <Header/>
        <TracingBeamDemo/>
        <Footer/>
    </div>
  )
}
