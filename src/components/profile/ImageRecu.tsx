"use client";

import { useState, useEffect } from "react";
import { 
  IconX,
  IconShare,
  IconBrandWhatsapp,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTelegram,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Color from "color";
import html2canvas from "html2canvas";

// Interface pour les données de la demande formatées
interface DisplayRequest {
  id: string;
  date: string;
  type: string;
  amount: string;
  totalAmount: string;
  status: string;
  motif: string;
  numeroReception?: string;
  fraisService: string;
  salaireDisponible: string;
  avanceDisponible: string;
  dateValidation?: string | null;
  dateRejet?: string | null;
  motifRejet: string;
  telephone: string;
  nomEmploye: string;
  nomPartenaire: string;
}

// Animation variants pour la modal de partage
const shareModalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, type: "spring" as const, stiffness: 300, damping: 20 }
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
};

// Cache pour le SVG rasterisé
let cachedSvgImage: string | null = null;

// Précharger le logo SVG
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous";
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Échec du chargement de l'image ${src}`));
  });
}

// Service pour générer l'image de la card
const generateCardImage = async (element: HTMLElement | null, requestData?: DisplayRequest): Promise<string | null> => {
  if (!element) {
    console.error("Erreur : l'élément à capturer est null");
    alert("Impossible de générer l'image : élément non trouvé.");
    return null;
  }

  try {
    // Map des classes Tailwind vers leurs valeurs RGB pour l'image partagée
    const tailwindColorMap: { [key: string]: string } = {
      'text-orange-400': 'rgb(251, 146, 60)',
      'text-red-400': 'rgb(248, 113, 113)',
      'text-blue-300': 'rgb(147, 197, 253)',
      'text-white': 'rgb(0, 0, 0)',
      'text-white/70': 'rgb(0, 0, 0)',
      'text-white/50': 'rgb(0, 0, 0)',
      'text-gray-400': 'rgb(0, 0, 0)',
      'text-white/80': 'rgb(0, 0, 0)',
      'text-white/60': 'rgb(0, 0, 0)',
      'text-white/40': 'rgb(0, 0, 0)',
      'text-yellow-300': 'rgb(252, 211, 77)',
      'text-green-300': 'rgb(134, 239, 172)',
      'bg-[#010D3E]': 'rgb(255, 255, 255)',
      'bg-[#010D3E]/80': 'rgb(255, 255, 255)',
      'bg-[#010D3E]/50': 'rgb(255, 255, 255)',
      'bg-[#010D3E]/30': 'rgb(255, 255, 255)',
      'bg-white/10': 'rgb(255, 255, 255)',
      'bg-white/20': 'rgb(255, 255, 255)',
      'bg-yellow-500/20': 'rgb(255, 255, 255)',
      'bg-green-500/20': 'rgb(255, 255, 255)',
      'bg-red-500/20': 'rgb(255, 255, 255)',
      'bg-gray-500/20': 'rgb(255, 255, 255)',
      'border-white/10': 'rgb(200, 200, 200)',
      'border-yellow-500/30': 'rgb(200, 200, 200)',
      'border-green-500/30': 'rgb(200, 200, 200)',
      'border-red-500/30': 'rgb(200, 200, 200)',
      'border-gray-500/30': 'rgb(200, 200, 200)',
      'divide-white/10': 'rgb(200, 200, 200)',
      'bg-gradient-to-r from-[#FF671E] to-[#FF8E53]': 'rgb(255, 255, 255)',
      'bg-gradient-to-br from-blue-500 to-blue-700': 'rgb(255, 255, 255)',
      'bg-gradient-to-br from-emerald-500 to-emerald-700': 'rgb(255, 255, 255)',
      'from-blue-500': 'rgb(255, 255, 255)',
      'to-blue-700': 'rgb(255, 255, 255)',
      'from-emerald-500': 'rgb(255, 255, 255)',
      'to-emerald-700': 'rgb(255, 255, 255)',
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
          el.style.setProperty('font-size', '14px', 'important');
          el.style.setProperty('font-weight', '700', 'important');
          el.style.setProperty('margin-top', '4px', 'important');
          el.style.setProperty('margin-bottom', '4px', 'important');
        }

        // Appliquer font-bold et noir aux labels et titre
        if (el.tagName.toLowerCase() === 'span' || el.tagName.toLowerCase() === 'h3') {
          if (className.includes('font-medium')) {
            el.style.setProperty('font-weight', '700', 'important');
            el.style.setProperty('color', 'rgb(0, 0, 0)', 'important');
            el.style.setProperty('font-size', '22px', 'important');
          } else if (el.tagName.toLowerCase() === 'h3') {
            el.style.setProperty('font-weight', '700', 'important');
            el.style.setProperty('color', 'rgb(0, 0, 0)', 'important');
            el.style.setProperty('font-size', '36px', 'important');
          }
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
            if (el.textContent?.includes('Date')) {
              el.style.setProperty('display', 'block', 'important');
              el.style.setProperty('visibility', 'visible', 'important');
              el.style.setProperty('opacity', '1', 'important');
              el.style.setProperty('color', 'rgb(0, 0, 0)', 'important');
              el.style.setProperty('font-size', '22px', 'important');
            }
          }
        }

        // FORCER L'AFFICHAGE DE TOUS LES ÉLÉMENTS CACHÉS
        if (el.style.display === 'none' || el.style.visibility === 'hidden' || el.style.opacity === '0') {
          el.style.setProperty('display', 'block', 'important');
          el.style.setProperty('visibility', 'visible', 'important');
          el.style.setProperty('opacity', '1', 'important');
        }

        // FORCER L'AFFICHAGE DE LA DATE DE VALIDATION
        if (el.textContent && (el.textContent.includes('Date') || el.textContent.includes('date') || el.textContent.includes('validation'))) {
          el.style.setProperty('display', 'block', 'important');
          el.style.setProperty('visibility', 'visible', 'important');
          el.style.setProperty('opacity', '1', 'important');
          el.style.setProperty('color', 'rgb(0, 0, 0)', 'important');
          el.style.setProperty('font-size', '12px', 'important');
          el.style.setProperty('font-weight', '600', 'important');
        }

        if (className.includes('flex items-center gap-3 mb-2')) {
          el.style.setProperty('display', 'flex', 'important');
          el.style.setProperty('align-items', 'center', 'important');
          el.style.setProperty('margin-bottom', '8px', 'important');
        }

        const properties = Array.from(computedStyle);
        properties.forEach((prop) => {
          const value = computedStyle.getPropertyValue(prop);
          if (value && (value.toLowerCase().includes('oklab') || value.toLowerCase().includes('oklch'))) {
            try {
              const color = Color(value);
              el.style.setProperty(prop, color.rgb().string(), 'important');
            } catch (err) {
              console.warn(`Impossible de convertir la couleur ${value} pour ${prop}:`, err);
              el.style.setProperty(prop, 'rgb(255, 255, 255)', 'important');
            }
          }
        });

        if (el.hasAttribute('style')) {
          let style = el.getAttribute('style') || '';
          if (style.toLowerCase().includes('oklab') || style.toLowerCase().includes('oklch')) {
            style = style.replace(/(color|background-color|border-color|fill|stroke|background|border|outline|box-shadow|text-decoration-color|stop-color|flood-color|lighting-color)\s*:\s*oklab\([^)]+\)/gi, '$1: rgb(255, 255, 255)')
                         .replace(/(color|background-color|border-color|fill|stroke|background|border|outline|box-shadow|text-decoration-color|stop-color|flood-color|lighting-color)\s*:\s*oklch\([^)]+\)/gi, '$1: rgb(255, 255, 255)');
            el.setAttribute('style', style);
          }
        }

        ['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color'].forEach((attr) => {
          if (el.hasAttribute(attr)) {
            const value = el.getAttribute(attr);
            if (value?.toLowerCase().includes('oklab') || value?.toLowerCase().includes('oklch')) {
              el.setAttribute(attr, 'rgb(255, 255, 255)');
            }
          }
        });

        if (el.tagName.toLowerCase() === 'img') {
          const img = el as HTMLImageElement;
          if (!img.complete || img.naturalWidth === 0) {
            await new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => {
                console.warn(`Échec du chargement de l'image ${img.src}`);
                img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                resolve();
              };
              img.src = img.src;
            });
          }
          if (img.src.includes('zalama-logo.svg')) {
            img.style.width = '35px';
            img.style.height = '12px';
            img.style.opacity = '1';
            img.style.objectFit = 'contain';
            img.style.objectPosition = 'center';
            img.style.maxWidth = '35px';
            img.style.maxHeight = '12px';
            img.style.marginBottom = '2px';
            img.style.transform = 'none';
            img.style.transformOrigin = 'center';
            img.style.borderRadius = '2px';
          }
        }

        if (el.tagName.toLowerCase() === 'div' && className.includes('flex items-center justify-center gap-8 pt-8 pb-2 sticky bottom-0')) {
          el.innerHTML = '';
          const receiptText = document.createElement('div');
          receiptText.style.textAlign = 'center';
          receiptText.style.padding = '8px';
          receiptText.style.fontWeight = '700';
          receiptText.style.color = 'rgb(0, 0, 0)';
          receiptText.style.backgroundColor = 'rgb(255, 255, 255)';
          receiptText.style.fontSize = '18px';
          receiptText.textContent = 'Reçu';
          el.appendChild(receiptText);
          el.style.setProperty('background-color', 'rgb(255, 255, 255)', 'important');
        }

        // Ajouter tous les champs des cards de détails sur l'image de reçu
        if (el.tagName.toLowerCase() === 'div' && className.includes('section')) {
          // Chercher si les champs supplémentaires existent déjà
          const hasAdditionalFields = el.querySelector('[data-additional-fields]');
          
          if (!hasAdditionalFields) {
            const additionalFieldsDiv = document.createElement('div');
            additionalFieldsDiv.setAttribute('data-additional-fields', 'true');
            additionalFieldsDiv.style.marginTop = '10px';
            additionalFieldsDiv.style.paddingTop = '8px';
            additionalFieldsDiv.style.borderTop = '1px solid rgb(229, 231, 235)';
            
            // Ajouter les champs selon le statut
            const fieldsToAdd = [];
            
            if (requestData) {
              // Champs communs
              fieldsToAdd.push({
                label: 'ID Demande',
                value: requestData.id,
                color: 'rgb(17, 24, 39)'
              });
              
              fieldsToAdd.push({
                label: 'Employé',
                value: requestData.nomEmploye,
                color: 'rgb(17, 24, 39)'
              });
              
              fieldsToAdd.push({
                label: 'Partenaire',
                value: requestData.nomPartenaire,
                color: 'rgb(17, 24, 39)'
              });
              
              fieldsToAdd.push({
                label: 'Téléphone',
                value: requestData.telephone,
                color: 'rgb(17, 24, 39)'
              });
              
              fieldsToAdd.push({
                label: 'Salaire Disponible',
                value: requestData.salaireDisponible,
                color: 'rgb(17, 24, 39)'
              });
              
              fieldsToAdd.push({
                label: 'Avance Disponible',
                value: requestData.avanceDisponible,
                color: 'rgb(17, 24, 39)'
              });
              
              // FORCER L'AFFICHAGE DE LA DATE DE VALIDATION POUR TOUS LES STATUTS VALIDÉ
              if (requestData.status === 'Validé') {
                // Toujours ajouter la date de validation même si elle n'existe pas
                const validationDate = requestData.dateValidation || new Date().toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                
                fieldsToAdd.push({
                  label: 'Date de Validation',
                  value: validationDate,
                  color: 'rgb(0, 128, 0)'
                });
              }

              // AJOUTER LA DATE DE CRÉATION POUR TOUS LES STATUTS
              if (requestData.date) {
                fieldsToAdd.push({
                  label: 'Date de Création',
                  value: requestData.date,
                  color: 'rgb(17, 24, 39)'
                });
              }
              
              if (requestData.status === 'Rejeté') {
                if (requestData.dateRejet) {
                  fieldsToAdd.push({
                    label: 'Date de Rejet',
                    value: requestData.dateRejet,
                    color: 'rgb(255, 0, 0)'
                  });
                }
                if (requestData.motifRejet) {
                  fieldsToAdd.push({
                    label: 'Motif de Rejet',
                    value: requestData.motifRejet,
                    color: 'rgb(255, 0, 0)'
                  });
                }
              }
              
              if (requestData.numeroReception) {
                fieldsToAdd.push({
                  label: 'Numéro de Réception',
                  value: requestData.numeroReception,
                  color: 'rgb(17, 24, 39)'
                });
              }
            }
            
            // Créer les éléments pour chaque champ
            fieldsToAdd.forEach(field => {
              const fieldDiv = document.createElement('div');
              fieldDiv.style.display = 'flex';
              fieldDiv.style.justifyContent = 'space-between';
              fieldDiv.style.marginBottom = '4px';
              fieldDiv.style.paddingLeft = '5px';
              fieldDiv.style.paddingRight = '5px';
              
              const label = document.createElement('span');
              label.style.fontSize = '11px';
              label.style.color = 'rgb(107, 114, 128)';
              label.style.width = '40%';
              label.style.fontWeight = 'medium';
              label.textContent = field.label + ' :';
              
              const value = document.createElement('span');
              value.style.fontSize = '11px';
              value.style.color = field.color;
              value.style.width = '60%';
              value.style.fontWeight = 'bold';
              value.textContent = field.value;
              
              fieldDiv.appendChild(label);
              fieldDiv.appendChild(value);
              additionalFieldsDiv.appendChild(fieldDiv);
            });
            
            el.appendChild(additionalFieldsDiv);
          }
        }

        el.childNodes.forEach((child) => applyStylesAndColors(child));
      }
    };

    const clonedElement = element.cloneNode(true) as HTMLElement;

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
                
                svgText = svgText.replace(/(fill|stroke|stop-color|flood-color|lighting-color)\s*=\s*["']oklab\([^)]+\)["']/gi, '$1="rgb(255, 255, 255)"')
                                 .replace(/(fill|stroke|stop-color|flood-color|lighting-color)\s*=\s*["']oklch\([^)]+\)["']/gi, '$1="rgb(255, 255, 255)"')
                                 .replace(/style\s*=\s*["'][^"']*oklab\([^)]+\)[^"']*["']/gi, 'style="fill: rgb(255, 255, 255); stroke: rgb(255, 255, 255)"')
                                 .replace(/style\s*=\s*["'][^"']*oklch\([^)]+\)[^"']*["']/gi, 'style="fill: rgb(255, 255, 255); stroke: rgb(255, 255, 255)"');

                const canvas = document.createElement('canvas');
                canvas.width = 70;
                canvas.height = 24;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
                  const url = URL.createObjectURL(svgBlob);
                  const svgImage = new Image();
                  svgImage.crossOrigin = 'anonymous';
                  await new Promise<void>((resolve) => {
                    svgImage.onload = () => resolve();
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

    await applyStylesAndColors(clonedElement);

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = `${element.scrollWidth}px`;
    container.style.height = `${element.scrollHeight}px`;
    container.style.backgroundColor = '#FFFFFF';
    container.appendChild(clonedElement);
    document.body.appendChild(container);

    clonedElement.offsetHeight;

    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FFFFFF',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      ignoreElements: (el) => el.tagName.toLowerCase() === 'iframe',
      logging: true,
    });

    document.body.removeChild(container);

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Erreur lors de la génération de l\'image :', error);
    alert('Une erreur est survenue lors de la génération de l\'image.');
    return null;
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
      // Fallback pour le téléchargement
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = `Demande_Avance_Salaire_${requestId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
};

interface ImageRecuProps {
  request: DisplayRequest;
  modalRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

export function ImageRecu({ request, modalRef, onClose }: ImageRecuProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    preloadImage("/images/zalama-logo.svg").catch((err) => {
      console.warn("Erreur lors du préchargement du logo SVG :", err);
    });
  }, []);

  const handleShare = async (platform: string) => {
    if (modalRef.current) {
      const imageDataUrl = await generateCardImage(modalRef.current, request);
      if (imageDataUrl) {
        await shareImage(imageDataUrl, platform, request.id);
        setShareModalOpen(false);
      }
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShareModalOpen(true)}
        className="w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-all duration-300"
        style={{ background: 'linear-gradient(to bottom right, rgb(16, 185, 129), rgb(4, 120, 87))' }}
      >
        <IconShare className="w-7 h-7" style={{ color: 'rgb(255, 255, 255)' }} />
      </motion.button>

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
                  className="p-2 rounded-lg transition-colors hover:bg-white/10"
                  style={{ color: 'rgba(255, 255, 255, 0.5)' }}
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
    </>
  );
}