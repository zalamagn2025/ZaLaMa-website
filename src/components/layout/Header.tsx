import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Header = () => {
  return (
    <header className='py-5 px-5 sticky top-0 backdrop-blur-sm z-20'>
            <div className='flex items-center justify-between'>
                <Image src={"/images/zalama-logo.svg"} width={130} height={0} alt={'Logo de ZaLaMa'}/>
                <MenuIcon className='lg:hidden' size={32}/>
                <nav className='hidden lg:flex gap-6 text-black/60 items-center'>
                    <a href="">Acceuil</a>
                    <a href="">A propos</a>
                    <a href="">Nos Services</a>
                    <a href="">Partenariat</a>
                    <a href="">Contact</a>
                    <Link href="/login">
                        <button className='btn btn-primary'>Se connecter</button>
                    </Link>
                </nav>
            </div>
    </header>
  )
}
