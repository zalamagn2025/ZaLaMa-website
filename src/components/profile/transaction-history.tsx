"use client";

import { useState, useRef, useEffect } from "react";
import { 
  IconSearch, 
  IconFilter, 
  IconEye, 
  IconDownload, 
  IconShare, 
  IconX,
  IconClock,
  IconCheck,
  IconCircle,
  IconFileText,
  IconPhone,
  IconCalendar,
  IconCurrency,
  IconBrandWhatsapp,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTelegram,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import Color from "color";
import { TransactionPDF } from "./TransactionPDF";

// Interface pour les demandes d'avance
interface SalaryAdvanceRequest {
  id: string;
  employe_id: string;
  partenaire_id: string;
  montant_demande: number;
  type_motif: string;
  motif: string;
  numero_reception?: string;
  frais_service: number;
  montant_total: number;
  salaire_disponible?: number;
  avance_disponible?: number;
  statut: "En attente" | "Validé" | "Rejeté" | "Annulé";
  date_creation: string;
  date_validation?: string;
  date_rejet?: string;
  motif_rejet?: string;
  created_at: string;
  updated_at: string;
  employe?: {
    id: string;
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
  };
  partenaire?: {
    id: string;
    nom: string;
    adresse: string;
  };
}

// Hook pour récupérer les demandes d'avance
function useSalaryAdvanceRequests() {
  const [requests, setRequests] = useState<SalaryAdvanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/salary-advance/request");
      
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des demandes");
      }
      
      const data = await response.json();
      setRequests(data.data || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des demandes:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests
  };
}

// Précharger le logo SVG pour éviter les erreurs de préchargement
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous";
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Échec du chargement de l'image ${src}`));
  });
}

// Fonction pour convertir les données API en format d'affichage
const convertApiRequestToDisplay = (apiRequest: SalaryAdvanceRequest) => {
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).replace(/\//g, ' ');
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "GNF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMotifType = (type: string): string => {
    switch (type) {
      case "TRANSPORT": return "Transport";
      case "SANTE": return "Santé";
      case "EDUCATION": return "Éducation";
      case "LOGEMENT": return "Logement";
      case "ALIMENTATION": return "Alimentation";
      case "URGENCE_FAMILIALE": return "Urgence familiale";
      case "FRAIS_MEDICAUX": return "Frais médicaux";
      case "FRAIS_SCOLAIRES": return "Frais scolaires";
      case "REPARATION_VEHICULE": return "Réparation véhicule";
      case "FRAIS_DEUIL": return "Frais deuil";
      case "AUTRE": return "Autre";
      default: return type || "Non précisé";
    }
  };

  return {
    id: apiRequest.id,
    date: formatFullDate(apiRequest.date_creation),
    type: formatMotifType(apiRequest.type_motif),
    amount: formatAmount(apiRequest.montant_demande),
    totalAmount: formatAmount(apiRequest.montant_total),
    status: apiRequest.statut,
    motif: apiRequest.motif,
    numeroReception: apiRequest.numero_reception,
    fraisService: formatAmount(apiRequest.frais_service),
    salaireDisponible: apiRequest.salaire_disponible ? formatAmount(apiRequest.salaire_disponible) : "Non précisé",
    avanceDisponible: apiRequest.avance_disponible ? formatAmount(apiRequest.avance_disponible) : "Non précisé",
    dateValidation: apiRequest.date_validation ? formatFullDate(apiRequest.date_validation) : null,
    dateRejet: apiRequest.date_rejet ? formatFullDate(apiRequest.date_rejet) : null,
    motifRejet: apiRequest.motif_rejet || "Non précisé",
    telephone: apiRequest.employe?.telephone || "Non précisé",
    nomEmploye: apiRequest.employe ? `${apiRequest.employe.prenom} ${apiRequest.employe.nom}` : "Non précisé",
    nomPartenaire: apiRequest.partenaire?.nom || "Non précisé",
  };
};

// Icône du service d'avance sur salaire
const SalaryAdvanceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgb(255, 255, 255)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-10 w-10"
    style={{ color: 'rgb(256, 256, 256)' }}
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="7" y1="15" x2="9" y2="15" />
    <line x1="11" y1="15" x2="13" y2="15" />
  </svg>
);

// Animations
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }),
  hover: {
    scale: 1.02,
    y: -2,
    transition: { duration: 0.2 }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: { duration: 0.2 }
  }
};

const shareModalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 20 }
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 }
}
};

// Cache pour le SVG rasterisé
let cachedSvgImage: string | null = null;

// Service pour générer l'image de la card
const generateCardImage = async (element: HTMLElement | null): Promise<string | null> => {
  if (!element) {
    console.error("Erreur : l'élément à capturer est null");
    alert("Impossible de générer l'image : élément non trouvé.");
    return null;
  }

  try {
    // Map des classes Tailwind vers leurs valeurs RGB pour l'image partagée
    const tailwindColorMap: { [key: string]: string } = {
      'text-orange-400': 'rgb(251, 146, 60)', // Conservé pour amount/total
      'text-red-400': 'rgb(248, 113, 113)', // Conservé pour fees
      'text-blue-300': 'rgb(147, 197, 253)', // Conservé pour status
      'text-white': 'rgb(0, 0, 0)', // Noir pour titre, ref, date
      'text-white/70': 'rgb(0, 0, 0)', // Noir pour labels
      'text-white/50': 'rgb(0, 0, 0)', // Noir pour texte général
      'text-gray-400': 'rgb(0, 0, 0)', // Noir pour texte général
      'text-white/80': 'rgb(0, 0, 0)', // Noir pour texte général
      'text-white/60': 'rgb(0, 0, 0)', // Noir pour texte général
      'text-white/40': 'rgb(0, 0, 0)', // Noir pour texte général
      'text-yellow-300': 'rgb(252, 211, 77)',
      'text-green-300': 'rgb(134, 239, 172)',
      'bg-[#010D3E]': 'rgb(255, 255, 255)', // Fond blanc
      'bg-[#010D3E]/80': 'rgb(255, 255, 255)', // Fond blanc
      'bg-[#010D3E]/50': 'rgb(255, 255, 255)', // Fond blanc
      'bg-[#010D3E]/30': 'rgb(255, 255, 255)', // Fond blanc
      'bg-white/10': 'rgb(255, 255, 255)', // Fond blanc
      'bg-white/20': 'rgb(255, 255, 255)', // Fond blanc
      'bg-yellow-500/20': 'rgb(255, 255, 255)', // Fond blanc
      'bg-green-500/20': 'rgb(255, 255, 255)', // Fond blanc
      'bg-red-500/20': 'rgb(255, 255, 255)', // Fond blanc
      'bg-gray-500/20': 'rgb(255, 255, 255)', // Fond blanc
      'border-white/10': 'rgb(200, 200, 200)', // Bordure grise légère
      'border-yellow-500/30': 'rgb(200, 200, 200)', // Bordure grise légère
      'border-green-500/30': 'rgb(200, 200, 200)', // Bordure grise légère
      'border-red-500/30': 'rgb(200, 200, 200)', // Bordure grise légère
      'border-gray-500/30': 'rgb(200, 200, 200)', // Bordure grise légère
      'divide-white/10': 'rgb(200, 200, 200)', // Bordure grise légère
      'bg-gradient-to-r from-[#FF671E] to-[#FF8E53]': 'rgb(255, 255, 255)', // Fond blanc
      'bg-gradient-to-br from-blue-500 to-blue-700': 'rgb(255, 255, 255)', // Fond blanc
      'bg-gradient-to-br from-emerald-500 to-emerald-700': 'rgb(255, 255, 255)', // Fond blanc
      'from-blue-500': 'rgb(255, 255, 255)', // Fond blanc
      'to-blue-700': 'rgb(255, 255, 255)', // Fond blanc
      'from-emerald-500': 'rgb(255, 255, 255)', // Fond blanc
      'to-emerald-700': 'rgb(255, 255, 255)', // Fond blanc
    };

    // Fonction récursive pour nettoyer les styles de tous les éléments
    const applyStylesAndColors = async (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement | SVGElement;
        const computedStyle = window.getComputedStyle(el);
        const className = typeof el.className === 'string' ? el.className : el.className?.baseVal || '';

        // Appliquer les styles Tailwind comme inline
        Object.keys(tailwindColorMap).forEach((twClass) => {
          if (className.includes(twClass)) {
            const [prop, value] = twClass.includes('text-') 
              ? ['color', tailwindColorMap[twClass]]
              : twClass.includes('bg-') 
                ? ['background-color', tailwindColorMap[twClass]]
                : twClass.includes('border-') 
                  ? ['border-color', tailwindColorMap[twClass]]
                  : twClass.includes('divide-') 
                    ? ['border-color', tailwindColorMap[twClass]]
                    : ['', ''];
            if (prop && value) {
              el.style.setProperty(prop, value, 'important');
            }
          }
        });

        // Forcer la date à être visible pour le statut "Validé"
        if (el.tagName.toLowerCase() === 'span' && el.textContent?.includes('Date')) {
          el.style.setProperty('display', 'block', 'important');
          el.style.setProperty('visibility', 'visible', 'important');
          el.style.setProperty('opacity', '1', 'important');
          el.style.setProperty('color', 'rgb(0, 0, 0)', 'important');
          el.style.setProperty('font-size', '22px', 'important');
          el.style.setProperty('font-weight', '700', 'important');
        }

        // Appliquer font-bold et noir aux labels et titre, mais préserver les couleurs des valeurs
        if (el.tagName.toLowerCase() === 'span' || el.tagName.toLowerCase() === 'h3') {
          // Vérifier si c'est un label (côté gauche) ou le titre
          if (className.includes('font-medium')) {
            el.style.setProperty('font-weight', '700', 'important');
            el.style.setProperty('color', 'rgb(0, 0, 0)', 'important');
            el.style.setProperty('font-size', '22px', 'important');
          } else if (el.tagName.toLowerCase() === 'h3') {
            el.style.setProperty('font-weight', '700', 'important');
            el.style.setProperty('color', 'rgb(0, 0, 0)', 'important');
            el.style.setProperty('font-size', '36px', 'important');
          }
          // Préserver les couleurs des valeurs (côté droit)
          if (className.includes('font-bold')) {
            el.style.setProperty('font-size', '22px', 'important');
            if (className.includes('text-orange-400')) {
              el.style.setProperty('color', 'rgb(251, 146, 60)', 'important');
            } else if (className.includes('text-red-400')) {
              el.style.setProperty('color', 'rgb(248, 113, 113)', 'important');
            } else if (className.includes('text-blue-300')) {
              el.style.setProperty('color', 'rgb(147, 197, 253)', 'important');
            } else {
              el.style.setProperty('color', 'rgb(0, 0, 0)', 'important');
            }
            // Forcer la date à être visible
            if (el.textContent?.includes('Date')) {
              el.style.setProperty('display', 'block', 'important');
              el.style.setProperty('visibility', 'visible', 'important');
              el.style.setProperty('opacity', '1', 'important');
              el.style.setProperty('color', 'rgb(0, 0, 0)', 'important');
              el.style.setProperty('font-size', '22px', 'important');
            }
          }
        }

        // S'assurer que le conteneur du titre et de l'icône est aligné
        if (className.includes('flex items-center gap-3 mb-2')) {
          el.style.setProperty('display', 'flex', 'important');
          el.style.setProperty('align-items', 'center', 'important');
          el.style.setProperty('margin-bottom', '8px', 'important');
        }

        // Inspecter toutes les propriétés CSS pour détecter oklab/oklch
        const properties = Array.from(computedStyle);
        properties.forEach((prop) => {
          const value = computedStyle.getPropertyValue(prop);
          if (value && (value.toLowerCase().includes('oklab') || value.toLowerCase().includes('oklch'))) {
            console.log(`Couleur problématique détectée dans ${prop} pour`, el, `:`, value);
            try {
              const color = Color(value);
              el.style.setProperty(prop, color.rgb().string(), 'important');
            } catch (err) {
              console.warn(`Impossible de convertir la couleur ${value} pour ${prop}:`, err);
              el.style.setProperty(prop, 'rgb(255, 255, 255)', 'important');
            }
          }
        });

        // Nettoyer les styles inline contenant oklab/oklch
        if (el.hasAttribute('style')) {
          let style = el.getAttribute('style') || '';
          if (style.toLowerCase().includes('oklab') || style.toLowerCase().includes('oklch')) {
            style = style.replace(/(color|background-color|border-color|fill|stroke|background|border|outline|box-shadow|text-decoration-color|stop-color|flood-color|lighting-color)\s*:\s*oklab\([^)]+\)/gi, '$1: rgb(255, 255, 255)')
                         .replace(/(color|background-color|border-color|fill|stroke|background|border|outline|box-shadow|text-decoration-color|stop-color|flood-color|lighting-color)\s*:\s*oklch\([^)]+\)/gi, '$1: rgb(255, 255, 255)');
            el.setAttribute('style', style);
          }
        }

        // Gérer les attributs SVG
        ['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color'].forEach((attr) => {
          if (el.hasAttribute(attr)) {
            const value = el.getAttribute(attr);
            if (value?.toLowerCase().includes('oklab') || value?.toLowerCase().includes('oklch')) {
              console.log(`Couleur problématique détectée dans l'attribut ${attr} pour`, el, `:`, value);
              el.setAttribute(attr, 'rgb(255, 255, 255)');
            }
          }
        });

        // S'assurer que les images sont chargées
        if (el.tagName.toLowerCase() === 'img') {
          const img = el as HTMLImageElement;
          if (!img.complete || img.naturalWidth === 0) {
            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = () => {
                console.warn(`Échec du chargement de l'image ${img.src}`);
                img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                resolve();
              };
              img.src = img.src;
            });
          }
          // Ajuster la taille du logo pour un aspect plus compact
          if (img.src.includes('zalama-logo.svg')) {
            img.style.width = '100px';
            img.style.height = '25px';
            img.style.opacity = '1';
            img.style.objectFit = 'contain';
            img.style.objectPosition = 'center';
          }
        }

        // Supprimer le footer avec les boutons et ajouter "Reçu"
        if (el.tagName.toLowerCase() === 'div' && className.includes('flex items-center justify-center gap-8 pt-8 pb-2 sticky bottom-0')) {
          el.innerHTML = '';
          const receiptText = document.createElement('div');
          receiptText.style.textAlign = 'center';
          receiptText.style.padding = '16px';
          receiptText.style.fontWeight = '700';
          receiptText.style.color = 'rgb(0, 0, 0)';
          receiptText.style.backgroundColor = 'rgb(255, 255, 255)';
          receiptText.style.fontSize = '24px';
          receiptText.textContent = 'Reçu';
          el.appendChild(receiptText);
          el.style.setProperty('background-color', 'rgb(255, 255, 255)', 'important');
        }

        // Parcourir les enfants récursivement
        el.childNodes.forEach((child) => applyStylesAndColors(child));
      }
    };

    // Cloner l'élément
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Précharger et rasteriser l'image SVG
    const images = clonedElement.getElementsByTagName('img');
    for (const img of Array.from(images)) {
      if (img.src.includes('zalama-logo.svg')) {
        if (cachedSvgImage) {
          img.src = cachedSvgImage;
          img.crossOrigin = 'anonymous';
        } else {
          try {
            await preloadImage(img.src);
            const response = await fetch(img.src, { mode: 'cors' });
            if (!response.ok) throw new Error(`Échec du chargement du SVG ${img.src}`);
            let svgText = await response.text();
            
            // Nettoyer les couleurs oklab/oklch dans le SVG
            svgText = svgText.replace(/(fill|stroke|stop-color|flood-color|lighting-color)\s*=\s*["']oklab\([^)]+\)["']/gi, '$1="rgb(255, 255, 255)"')
                             .replace(/(fill|stroke|stop-color|flood-color|lighting-color)\s*=\s*["']oklch\([^)]+\)["']/gi, '$1="rgb(255, 255, 255)"')
                             .replace(/style\s*=\s*["'][^"']*oklab\([^)]+\)[^"']*["']/gi, 'style="fill: rgb(255, 255, 255); stroke: rgb(255, 255, 255)"')
                             .replace(/style\s*=\s*["'][^"']*oklch\([^)]+\)[^"']*["']/gi, 'style="fill: rgb(255, 255, 255); stroke: rgb(255, 255, 255)"');

            const canvas = document.createElement('canvas');
            canvas.width = 200; // Ajusté pour un logo plus compact
            canvas.height = 50; // Ajusté pour un logo plus compact
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
              const url = URL.createObjectURL(svgBlob);
              const svgImage = new Image();
              svgImage.crossOrigin = 'anonymous';
              await new Promise((resolve, reject) => {
                svgImage.onload = resolve;
                svgImage.onerror = () => {
                  console.warn(`Échec du chargement du SVG ${img.src}`);
                  img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                  resolve();
                };
                svgImage.src = url;
              });
              ctx.drawImage(svgImage, 0, 0, canvas.width, canvas.height);
              URL.revokeObjectURL(url);
              cachedSvgImage = canvas.toDataURL('image/png');
              img.src = cachedSvgImage;
              img.crossOrigin = 'anonymous';
            }
          } catch (err) {
            console.warn(`Impossible de rasteriser l'image SVG ${img.src}:`, err);
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
          }
        }
      }
    }

    // Appliquer les styles à tous les éléments
    await applyStylesAndColors(clonedElement);

    // S'assurer que l'élément cloné est dans le DOM pour le rendu
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = `${element.scrollWidth}px`;
    container.style.height = `${element.scrollHeight}px`;
    container.style.backgroundColor = '#FFFFFF';
    container.appendChild(clonedElement);
    document.body.appendChild(container);

    // Forcer la mise à jour des styles
    clonedElement.offsetHeight;

    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FFFFFF',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      skipAutoScale: true,
      ignoreElements: (el) => el.tagName.toLowerCase() === 'iframe',
      logging: true,
    });

    // Nettoyer le DOM
    document.body.removeChild(container);

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Erreur lors de la génération de l\'image :', error);
    alert('Une erreur est survenue lors de la génération de l\'image.');
    return null;
  }
};

// Fonction pour générer et télécharger le PDF
const generateAndDownloadPDF = async (request: ReturnType<typeof convertApiRequestToDisplay>) => {
  try {
    const blob = await pdf(
      <TransactionPDF
        montant={request.amount}
        statut={request.status as "En attente" | "Validé" | "Rejeté" | "Annulé"}
        date={request.date}
        typeMotif={request.type}
        fraisService={request.fraisService}
        dateValidation={request.dateValidation}
        motifRejet={request.motifRejet}
      />
    ).toBlob();
    saveAs(blob, `Demande_Avance_Salaire_${request.id}.pdf`);
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
    alert("Une erreur est survenue lors de la génération du PDF.");
  }
};

// Fonction pour partager l'image
const shareImage = async (imageDataUrl: string, platform: string, requestId: string) => {
  const shareData = {
    files: [
      new File(
        [await (await fetch(imageDataUrl)).blob()],
        `Demande_Avance_Salaire_${requestId}.png`,
        { type: "image/png" }
      )
    ],
    title: "Demande d'Avance sur Salaire - ZaLaMa",
    text: "Détails de ma demande d'avance sur salaire via ZaLaMa"
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      console.error("Erreur lors du partage via Web Share API :", error);
      fallbackShare(imageDataUrl, platform, requestId);
    }
  } else {
    fallbackShare(imageDataUrl, platform, requestId);
  }
};

// Fallback pour le partage
const fallbackShare = (imageDataUrl: string, platform: string, requestId: string) => {
  const encodedText = encodeURIComponent("Détails de ma demande d'avance sur salaire via ZaLaMa");
  const encodedImage = encodeURIComponent(imageDataUrl);
  switch (platform) {
    case "whatsapp":
      window.open(`https://api.whatsapp.com/send?text=${encodedText}%20${encodedImage}`);
      break;
    case "facebook":
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedImage}&t=${encodedText}`);
      break;
    case "linkedin":
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedImage}&title=${encodeURIComponent("Demande d'Avance sur Salaire - ZaLaMa")}`);
      break;
    case "telegram":
      window.open(`https://t.me/share/url?url=${encodedImage}&text=${encodedText}`);
      break;
    default:
      saveAs(imageDataUrl, `Demande_Avance_Salaire_${requestId}.png`);
  }
};

export function TransactionHistory() {
  const { requests: apiRequests, loading, error } = useSalaryAdvanceRequests();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    period: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const requestsPerPage = 10;

  // Précharger le logo SVG au montage du composant
  useEffect(() => {
    preloadImage("/images/zalama-logo.svg").catch((err) => {
      console.warn("Erreur lors du préchargement du logo SVG :", err);
    });
  }, []);

  const allRequests = apiRequests.map(convertApiRequestToDisplay);

  const filteredRequests = allRequests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.numeroReception && request.numeroReception.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      filters.type === "" ||
      request.type.toLowerCase().includes(filters.type.toLowerCase());

    const matchesStatus =
      filters.status === "" ||
      request.status.toLowerCase() === filters.status.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    switch (status.toLowerCase()) {
      case "en attente":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "validé":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "rejeté":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "annulé":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    if (!status) return <IconClock className="w-3 h-3" />;
    switch (status.toLowerCase()) {
      case "en attente":
        return <IconClock className="w-3 h-3" />;
      case "validé":
        return <IconCheck className="w-3 h-3" />;
      case "rejeté":
        return <IconX className="w-3 h-3" />;
      case "annulé":
        return <IconCircle className="w-3 h-3" />;
      default:
        return <IconClock className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: string | undefined) => {
    if (!status) return "Inconnu";
    switch (status.toLowerCase()) {
      case "en attente":
        return "En attente";
      case "validé":
        return "Validé";
      case "rejeté":
        return "Rejeté";
      case "annulé":
        return "Annulé";
      default:
        return status;
    }
  };

  const handleShare = async (platform: string) => {
    if (modalRef.current && selectedRequest) {
      const imageDataUrl = await generateCardImage(modalRef.current);
      if (imageDataUrl) {
        const request = allRequests.find((r) => r.id === selectedRequest)!;
        await shareImage(imageDataUrl, platform, request.id);
        setShareModalOpen(false);
      }
    }
  };

  if (loading) {
    return (
      <motion.div
        className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-6 border border-[#1A3A8F] shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF671E] mr-3"></div>
          <span style={{ color: 'rgb(255, 255, 255)' }}>Chargement des demandes...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-6 border border-[#1A3A8F] shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconCircle className="w-6 h-6" style={{ color: 'rgb(248, 113, 113)' }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: 'rgb(255, 255, 255)' }}>Erreur de chargement</h3>
          <p style={{ color: 'rgb(156, 163, 175)' }} className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: 'rgb(255, 103, 30)', color: 'rgb(255, 255, 255)' }}
          >
            Réessayer
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#010D3E]/30 backdrop-blur-md rounded-xl p-6 border border-[#1A3A8F] shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <SalaryAdvanceIcon />
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'rgb(255, 255, 255)' }}>Demandes d'avance sur salaire</h2>
              <p style={{ color: 'rgb(156, 163, 175)' }} className="text-sm">
                {filteredRequests.length} demande{filteredRequests.length !== 1 ? "s" : ""} trouvée{filteredRequests.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'rgb(156, 163, 175)' }} />
            <input
              type="text"
              placeholder="Rechercher une demande..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
              style={{ 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgb(255, 255, 255)',
                '--tw-ring-color': 'rgb(255, 142, 83)',
                '--tw-placeholder-color': 'rgb(156, 163, 175)'
              } as any}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-4 py-3 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border text-white hover:bg-[#010D3E]/70 transition-all duration-300 flex items-center gap-2"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: 'rgb(255, 255, 255)' }}
          >
            <IconFilter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
          </motion.button>
        </div>

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t"
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Type de motif",
                    name: "type",
                    options: [
                      { value: "", label: "Tous" },
                      { value: "transport", label: "Transport" },
                      { value: "sante", label: "Santé" },
                      { value: "education", label: "Éducation" },
                      { value: "logement", label: "Logement" },
                      { value: "alimentation", label: "Alimentation" },
                      { value: "urgence", label: "Urgence" },
                    ],
                  },
                  {
                    label: "Statut",
                    name: "status",
                    options: [
                      { value: "", label: "Tous" },
                      { value: "en attente", label: "En attente" },
                      { value: "validé", label: "Validée" },
                      { value: "rejeté", label: "Rejetée" },
                      { value: "annulé", label: "Annulée" },
                    ],
                  },
                  {
                    label: "Période",
                    name: "period",
                    options: [
                      { value: "", label: "Toutes les dates" },
                      { value: "month", label: "Ce mois" },
                      { value: "quarter", label: "Ce trimestre" },
                      { value: "year", label: "Cette année" },
                    ],
                  },
                ].map((filter, index) => (
                  <motion.div
                    key={filter.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {filter.label}
                    </label>
                    <select
                      className="block w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border text-white focus:outline-none focus:ring-2 shadow-sm transition-all duration-300"
                      style={{ 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgb(255, 255, 255)',
                        '--tw-ring-color': 'rgb(255, 142, 83)'
                      } as any}
                      value={filters[filter.name as keyof typeof filters]}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          [filter.name]: e.target.value,
                        });
                        setCurrentPage(1);
                      }}
                    >
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {currentRequests.length > 0 ? (
          currentRequests.map((request, index) => (
            <motion.div
              key={`${request.id}-${index}`}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-[#010D3E]/50 backdrop-blur-md rounded-xl border overflow-hidden shadow-lg"
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to right, rgb(255, 103, 30), rgb(255, 142, 83))' }}>
                      <SalaryAdvanceIcon />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg" style={{ color: 'rgb(255, 255, 255)' }}>
                          Avance sur salaire
                        </h3>
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'rgb(156, 163, 175)' }}>
                          <IconPhone className="w-3 h-3" />
                          <span>{request.telephone}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full border ${getStatusColor(request.status)}`}
                      >
                        {getStatusIcon(request.status)}
                        {getStatusText(request.status)}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <IconCurrency className="w-4 h-4" style={{ color: 'rgb(156, 163, 175)' }} />
                        <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Montant demandé :</span>
                        <span className="font-semibold" style={{ color: 'rgb(255, 255, 255)' }}>{request.amount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconCalendar className="w-4 h-4" style={{ color: 'rgb(156, 163, 175)' }} />
                        <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Le {request.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRequest(request.id)}
                        className="px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'rgb(255, 255, 255)' }}
                      >
                        <IconEye className="w-4 h-4" />
                        Voir détail
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12 bg-[#010D3E]/30 backdrop-blur-md rounded-xl border"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <IconFileText className="w-8 h-8" style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
            </div>
            <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Aucune demande d'avance trouvée</p>
            <p className="text-sm mt-2" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Vous n'avez pas encore soumis de demande d'avance</p>
          </motion.div>
        )}
      </motion.div>

      {filteredRequests.length > requestsPerPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-sm text-center sm:text-left" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Affichage de <span className="font-medium" style={{ color: 'rgb(255, 255, 255)' }}>{indexOfFirstRequest + 1}</span> à{" "}
            <span className="font-medium" style={{ color: 'rgb(255, 255, 255)' }}>{Math.min(indexOfLastRequest, filteredRequests.length)}</span>{" "}
            sur <span className="font-medium" style={{ color: 'rgb(255, 255, 255)' }}>{filteredRequests.length}</span> demandes
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border text-white hover:bg-[#010D3E]/70 transition-all duration-300 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: 'rgb(255, 255, 255)' }}
            >
              Précédent
            </motion.button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (page > totalPages) return null;
                
                return (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => paginate(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentPage === page
                        ? "text-white"
                        : "bg-[#010D3E]/50 border text-white/60 hover:bg-[#010D3E]/70 hover:text-white"
                    }`}
                    style={currentPage === page 
                      ? { background: 'linear-gradient(to right, rgb(255, 103, 30), rgb(255, 142, 83))' }
                      : { borderColor: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    {page}
                  </motion.button>
                );
              })}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl bg-[#010D3E]/50 backdrop-blur-md border text-white hover:bg-[#010D3E]/70 transition-all duration-300 ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: 'rgb(255, 255, 255)' }}
            >
              Suivant
            </motion.button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#010D3E]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative mx-auto w-full max-w-lg max-h-[90vh] bg-[#010D3E] rounded-2xl shadow-2xl border overflow-hidden"
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedRequest(null)}
                className="absolute top-6 right-6 p-2 rounded-lg transition-colors"
                style={{ color: 'rgba(255, 255, 255, 0.5)', hover: { color: 'rgb(255, 255, 255)', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                <IconX className="w-7 h-7" />
              </motion.button>
              <div ref={modalRef}>
                <div className="flex flex-col w-full items-center mb-4">
                  <div className="w-32 h-32 mb-2 flex items-center justify-center">
                    <img src="/images/zalama-logo.svg" alt="ZaLaMa Logo" className="w-full h-full object-contain" crossOrigin="anonymous" />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <IconFileText className="w-8 h-8" style={{ color: 'rgb(251, 146, 60)' }} />
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'rgb(255, 255, 255)' }}>Détails de la demande</h3>
                  </div>
                </div>

                {selectedRequest && (() => {
                  const request = allRequests.find((r) => r.id === selectedRequest)!;
                  let fieldsToShow: Array<{ label: string; value: string; type?: string }> = [];
                  if (request.status === "Rejeté") {
                    fieldsToShow = [
                      { label: "Statut", value: request.status, type: "status" },
                      { label: "Type de motif", value: request.type },
                      { label: "Montant demandé", value: request.amount, type: "amount" },
                      { label: "Motif de rejet", value: request.motifRejet },
                      { label: "Expéditeur", value: "LengoPay" },
                      { label: "Bénéficiaire", value: request.numeroReception || `REF-${request.id.slice(-8)}` },
                      { label: "Date", value: request.date, type: "date" },
                    ];
                  } else if (request.status === "En attente" || request.status === "Annulé") {
                    fieldsToShow = [
                      { label: "Statut", value: request.status, type: "status" },
                      { label: "Type de motif", value: request.type },
                      { label: "Montant demandé", value: request.amount, type: "amount" },
                      { label: "Expéditeur", value: "LengoPay" },
                      { label: "Bénéficiaire", value: request.numeroReception || `REF-${request.id.slice(-8)}` },
                      { label: "Date", value: request.date, type: "date" },
                    ];
                  } else {
                    fieldsToShow = [
                      { label: "Statut", value: request.status, type: "status" },
                      { label: "Type de motif", value: request.type },
                      { label: "Montant demandé", value: request.amount, type: "amount" },
                      { label: "Frais de service", value: `-${request.fraisService}`, type: "fees" },
                      { label: "Montant reçu", value: `${(parseInt((request.amount || "0").replace(/[^0-9]/g, ""), 10) - parseInt((request.fraisService || "0").replace(/[^0-9]/g, ""), 10)).toLocaleString("fr-FR")} GNF`, type: "total" },
                      { label: "Expéditeur", value: "LengoPay" },
                      { label: "Bénéficiaire", value: request.numeroReception || `REF-${request.id.slice(-8)}` },
                      { label: "Date", value: request.dateValidation || request.date, type: "date" },
                      { label: "Référence", value: request.numeroReception || `REF-${request.id.slice(-8)}`, type: "ref" },
                    ];
                  }
                  return (
                    <div className="w-full max-w-2xl mx-auto rounded-2xl p-0 md:p-0 flex flex-col" style={{ minHeight: "320px" }}>
                      <div className={`${request.status === "Validé" ? "overflow-y-auto max-h-[60vh]" : ""} flex-1 flex flex-col divide-y`} style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                        {fieldsToShow.map((item, subIndex) => (
                          <div key={subIndex} className="flex items-center justify-between py-4 px-2 md:px-4">
                            <span className="text-base md:text-lg font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {item.label}
                            </span>
                            <span className={`text-right text-base md:text-lg font-bold ${
                              item.type === "amount" || item.type === "total"
                                ? "text-orange-400"
                                : item.type === "fees"
                                  ? "text-red-400"
                                  : item.type === "ref" || item.type === "date"
                                    ? "text-white"
                                    : item.type === "status"
                                      ? "text-blue-300"
                                      : "text-white"
                            }`} style={{
                              color: item.type === "amount" || item.type === "total"
                                ? 'rgb(251, 146, 60)'
                                : item.type === "fees"
                                  ? 'rgb(248, 113, 113)'
                                  : item.type === "ref" || item.type === "date"
                                    ? 'rgb(255, 255, 255)'
                                    : item.type === "status"
                                      ? 'rgb(147, 197, 253)'
                                      : 'rgb(255, 255, 255)'
                            }}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-8 pt-8 pb-2 sticky bottom-0" style={{ backgroundColor: 'rgb(1, 13, 62)' }}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => generateAndDownloadPDF(request)}
                          className="w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-all duration-300"
                          style={{ background: 'linear-gradient(to bottom right, rgb(59, 130, 246), rgb(29, 78, 216))' }}
                        >
                          <IconDownload className="w-7 h-7" style={{ color: 'rgb(255, 255, 255)' }} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShareModalOpen(true)}
                          className="w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-all duration-300"
                          style={{ background: 'linear-gradient(to bottom right, rgb(16, 185, 129), rgb(4, 120, 87))' }}
                        >
                          <IconShare className="w-7 h-7" style={{ color: 'rgb(255, 255, 255)' }} />
                        </motion.button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shareModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#010D3E]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShareModalOpen(false)}
          >
            <motion.div
              variants={shareModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative mx-auto w-full max-w-md rounded-2xl shadow-2xl border p-6"
              style={{ backgroundColor: 'rgb(1, 13, 62)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold" style={{ color: 'rgb(255, 255, 255)' }}>Partager cette fiche</h3>
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShareModalOpen(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'rgba(255, 255, 255, 0.5)', hover: { color: 'rgb(255, 255, 255)', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                >
                  <IconX className="w-6 h-6" />
                </motion.button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { platform: "whatsapp", icon: <IconBrandWhatsapp className="w-8 h-8" style={{ color: 'rgb(34, 197, 94)' }} />, label: "WhatsApp" },
                  { platform: "facebook", icon: <IconBrandFacebook className="w-8 h-8" style={{ color: 'rgb(59, 130, 246)' }} />, label: "Facebook" },
                  { platform: "linkedin", icon: <IconBrandLinkedin className="w-8 h-8" style={{ color: 'rgb(29, 78, 216)' }} />, label: "LinkedIn" },
                  { platform: "telegram", icon: <IconBrandTelegram className="w-8 h-8" style={{ color: 'rgb(56, 189, 248)' }} />, label: "Telegram" },
                ].map(({ platform, icon, label }) => (
                  <motion.button
                    key={platform}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare(platform)}
                    className="flex flex-col items-center p-4 rounded-lg transition-colors"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    {icon}
                    <span className="mt-2 text-sm font-medium" style={{ color: 'rgb(255, 255, 255)' }}>{label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}