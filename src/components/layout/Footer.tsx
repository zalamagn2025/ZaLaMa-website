import Image from 'next/image'
import React from 'react'

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="container px-6 py-12 mx-auto">
        <div>
          <h1 className="text-lg font-bold text-center text-gray-800 dark:text-white lg:text-2xl">
            Rejoignez la communauté Zalama<br />
            et recevez les dernières actus fintech & innovations africaines.
          </h1>

          <div className="flex flex-col justify-center mx-auto mt-6 space-y-3 md:space-y-0 md:flex-row">
            <input
              id="email"
              type="email"
              className="px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
              placeholder="Votre adresse e-mail"
            />

            <button className="btn btn-primary w-full px-6 py-2.5 text-sm font-medium tracking-wider text-white rounded-lg transition duration-300 md:w-auto md:mx-4 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
              S’inscrire
            </button>
          </div>
        </div>

        <hr className="my-6 border-gray-200 md:my-10 dark:border-gray-700" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Zalama</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:underline">Accueil</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:underline">À propos</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:underline">Notre mission</a>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Solutions</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:underline">Paiement mobile</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:underline">Transfert d’argent</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:underline">Portefeuille numérique</a>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Ressources</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:underline">FAQ</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:underline">Support client</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:underline">Politique de confidentialité</a>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Contact</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:underline">contact@zalama.africa</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:underline">+224 622 000 000</a>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 md:my-10 dark:border-gray-700" />

        <div className="flex flex-col items-center justify-between sm:flex-row">
          <a href="#">
            <Image
              src="/images/zalama-logo.svg"
              alt="Zalama logo"
              width={40}
              height={40}
              className="w-auto h-8"
            />
          </a>

          <p className="mt-4 text-sm text-gray-500 sm:mt-0 dark:text-gray-300">
            © {new Date().getFullYear()} Zalama. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
