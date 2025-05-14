import { FooterSection } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { TracingBeamDemo } from '@/components/sections/About/TracingBeam'
import TeamSection from '@/components/sections/Team/TeamSection'
import React from 'react'

export default function AboutPage() {
  return (
    <div>
        <Header/>
        <TracingBeamDemo/>
        <TeamSection/>
        <FooterSection />
    </div>
  )
}
