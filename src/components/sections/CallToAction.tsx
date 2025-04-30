import { ArrowRight, ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export const CallToAction = () => {
  return (
    <section className='bg-gradient-to-b form-white to-[#D2DCFF] py-24 overflow-x-clip'>
        <div className='container px-6 py-10 mx-auto lg:px-20'>
            <div className='section-heading relative'>
                <div className='flex flex-col items-center'>
                    <h2 className='section-title'>Rejoignez l'expérience Zalama</h2>
                    <div className="mt-2">
                        <span className="inline-block w-40 h-1 bg-[#10059F] rounded-full"></span>
                        <span className="inline-block w-3 h-1 ml-1 bg-[#10059F] rounded-full"></span>
                        <span className="inline-block w-1 h-1 ml-1 bg-[#10059F] rounded-full"></span>
                    </div>
                </div>
                <p className='section-description mt-5'>
                    Chez <strong>ZaLaMa</strong>, nous fusionnons héritage africain et innovation technologique pour créer des outils qui vous ressemblent.  
                </p>
                <Image
                    src= "/images/CTA.png"
                    alt=''
                    width={360}
                    height={360}
                    className='absolute -left-[315px] -top-[140px] rotate-[25deg]'
                />
                <Image
                    src= "/images/zalamaHeroImg1.png"
                    alt=''
                    width={360}
                    height={360}
                    className='absolute -right-[340px] -top-[5px]'
                />
            </div>
            <div className='flex gap-2 mt-10 justify-center'>
                <button className='btn btn-primary'>Commencez maintenant !</button>
                <button className='btn btn-text gap-1'>
                    <span>En savoir plus</span>
                    <ArrowRight size={20}/>
                </button>
            </div>
        </div>
        
    </section>
  )
}
