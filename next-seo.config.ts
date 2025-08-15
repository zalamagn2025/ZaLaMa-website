// next-seo.config.js
const SEO = {
  title: "Zalama – La Fintech des Avances sur Salaire",
  description:
    "ZaLaMa est une solution fintech innovante qui permet aux salariés d’accéder facilement à une avance sur salaire, sans stress, en toute sécurité.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://zalamagn.com", // Remplacez par votre URL
    site_name: "Zalama",
    images: [
      {
        url: "/images/zalamaOGimg.png", // Assurez-vous que cette image existe dans /public
        width: 1200,
        height: 630,
        alt: "Zalama – Avance sur salaire",
      },
    ],
  },
  twitter: {
    handle: "@zalama",
    site: "@zalama",
    cardType: "summary_large_image",
  },
};

export default SEO;
