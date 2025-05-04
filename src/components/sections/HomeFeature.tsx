import { ShieldCheck, ThumbsUp, Sparkles, Award } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export const HomeFeature = () => {
  return (
<section className="dark:bg-gray-900">
    <div className="container px-6 py-16 mx-auto lg:px-28">
        <div className='section-heading flex flex-col items-center'>
            <h2 className="section-title">
                La qualité Zalama, une promesse tenue
            </h2>
            <div className="mt-2">
                <span className="inline-block w-40 h-1 bg-[#10059F] rounded-full"></span>
                <span className="inline-block w-3 h-1 ml-1 bg-[#10059F] rounded-full"></span>
                <span className="inline-block w-1 h-1 ml-1 bg-[#10059F] rounded-full"></span>
            </div>
        </div>
        <div className="mt-8 xl:mt-12 lg:flex lg:items-center">
            <div className="grid w-full grid-cols-1 gap-8 lg:w-1/2 xl:gap-16 md:grid-cols-2">
                
                <div className="space-y-3 my-4">
                    <span className="inline-block p-3 text-[#FF671E] bg-[#FF671E]/10 rounded-xl dark:text-white dark:bg-blue-500">
                        <ShieldCheck />
                    </span>
                    <h1 className="text-xl font-bold text-gray-700 capitalize dark:text-white">
                        Sécurité et fiabilité
                    </h1>
                    <p className="text-gray-500 dark:text-gray-300">
                        Nos solutions sont conçues pour garantir la sécurité de vos données et la fiabilité de chaque fonctionnalité.
                    </p>
                </div>

                <div className="space-y-3 my-4">
                    <span className="inline-block p-3 text-[#FF671E] bg-[#FF671E]/10 rounded-xl dark:text-white dark:bg-blue-500">
                        <ThumbsUp />
                    </span>
                    <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">
                        Satisfaction garantie
                    </h1>
                    <p className="text-gray-500 dark:text-gray-300">
                        Chaque détail est pensé pour vous offrir une expérience fluide, intuitive et agréable.
                    </p>
                </div>

                <div className="space-y-3 my-4">
                    <span className="inline-block p-3 text-[#FF671E] bg-[#FF671E]/10 rounded-xl dark:text-white dark:bg-blue-500">
                        <Sparkles />
                    </span>
                    <h1 className="text-xl font-bold text-gray-700 capitalize dark:text-white">
                        Qualité irréprochable
                    </h1>
                    <p className="text-gray-500 dark:text-gray-300">
                        Nous respectons les standards les plus exigeants pour vous garantir des résultats professionnels et durables.
                    </p>
                </div>

                <div className="space-y-3">
                    <span className="inline-block p-3 text-[#FF671E] bg-[#FF671E]/10 rounded-xl dark:text-white dark:bg-blue-500">
                        <Award />
                    </span>
                    <h1 className="text-xl font-bold text-gray-700 capitalize dark:text-white">
                        Expertise reconnue
                    </h1>
                    <p className="text-gray-500 dark:text-gray-300">
                        Zalama s&apos;appuie sur une équipe passionnée et expérimentée pour vous offrir des solutions à la hauteur de vos attentes.
                    </p>
                </div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 lg:justify-center">
                <Image
                    src={"/images/HomeFeature.jpg.png"}
                    alt="Aperçu des solutions Zalama"
                    width={500}
                    height={500}
                />
            </div>
        </div>
    </div>
</section>
  )
}
