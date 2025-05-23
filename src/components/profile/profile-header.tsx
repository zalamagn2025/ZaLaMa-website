"use client";

import { IconBell, IconEdit, IconMail, IconPhone, IconBuilding, IconUser, IconCalendar, IconCrown, IconSettings, IconX, IconEye, IconTrash } from "@tabler/icons-react";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileSettings } from "./profile-settings";
import { AdCarousel } from "./AdCarousel";

interface UserData {
  name: string;
  phone: string;
  email: string;
  role: string;
  entreprise: string;
  department: string;
  joinDate: string;
  avatar: string;
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

export function ProfileHeader() {
  const { currentUser, userData } = useAuth();
  const [user, setUser] = useState<UserData>({
    name: "Mamadouba Youla",
    phone: "+224 612 34 75 79",
    email: "mamadoubayoula240@gmail.com",
    role: "Account Manager",
    entreprise: "ZALAMA",
    department: "Direction financière",
    joinDate: "12 Mars 2023",
    avatar: "",
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "Nouveau message de l'équipe financière", timestamp: "2025-05-18 09:30" },
    { id: 2, message: "Mise à jour du profil validée", timestamp: "2025-05-17 14:15" },
    { id: 3, message: "Rappel : réunion à 15h", timestamp: "2025-05-16 08:45" },
    { id: 4, message: "Document approuvé par le manager", timestamp: "2025-05-15 11:20" },
    { id: 5, message: "Nouveau projet assigné", timestamp: "2025-05-14 16:50" },
  ]);
  const [showDetails, setShowDetails] = useState<Notification | null>(null);

  // Sync user data with AuthContext
  useEffect(() => {
    if (currentUser && userData) {
      setUser({
        name: userData.name || currentUser.displayName || "Mamadouba Youla",
        phone: userData.phone || "+224 612 34 75 79",
        email: userData.email || currentUser.email || "mamadoubayoula240@gmail.com",
        role: userData.role || "Account Manager",
        entreprise: userData.entreprise || "ZALAMA",
        department: userData.department || "Direction financière",
        joinDate: userData.joinDate || "12 Mars 2023",
        avatar: userData.avatar || currentUser.photoURL || "",
      });
    }
  }, [currentUser, userData]);

  // Notification Details Component
  function NotificationDetails({ notification, onClose }: { notification: Notification; onClose: () => void }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-0 flex items-center justify-center z-60 p-4"
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-[#010D3E]/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-sm shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-[#FF671E] to-[#FF8E53] bg-clip-text text-transparent">
              Détails de la Notification
            </h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-300 hover:text-[#FFFFFF]"
              aria-label="Fermer les détails"
            >
              <IconX size={20} />
            </motion.button>
          </div>
          <div className="space-y-2 text-gray-200">
            <p>
              <strong>Message:</strong> {notification.message}
            </p>
            <p>
              <strong>Date:</strong> {notification.timestamp}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Notifications View Component
  function NotificationsView({ onClose }: { onClose: () => void }) {
    const handleViewDetails = (notification: Notification) => {
      setShowDetails(notification);
    };

    const handleDelete = (id: number) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="relative bg-[#010D3E]/90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#FF671E] to-[#FF8E53] bg-clip-text text-transparent">Notifications</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-300 hover:text-[#FFFFFF]"
                aria-label="Fermer les notifications"
              >
                <IconX size={24} />
              </motion.button>
            </div>
            <div className="space-y-4 h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-[#010D3E] scrollbar-thumb-[#FF671E]">
              {notifications.length === 0 ? (
                <p className="text-gray-300 text-center py-4">Aucune notification</p>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 bg-white/5 border border-[#FF671E]/20 rounded-lg text-gray-200 hover:bg-white/10 transition-all shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewDetails(notification)}
                          className="text-[#FF671E] hover:text-[#FF8E53]"
                          aria-label={`Voir les détails de ${notification.message}`}
                        >
                          <IconEye size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(notification.id)}
                          className="text-red-400 hover:text-red-300"
                          aria-label={`Supprimer ${notification.message}`}
                        >
                          <IconTrash size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {showDetails && <NotificationDetails notification={showDetails} onClose={() => setShowDetails(null)} />}
        </AnimatePresence>
      </>
    );
  }

  // Edit Profile Form Component
  function EditProfileForm({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = useState<UserData>({ ...user });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>(user.avatar || "");
    const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({});

    // Cleanup avatarPreview URL when component unmounts or new image is uploaded
    useEffect(() => {
      return () => {
        if (avatarPreview && avatarFile) {
          URL.revokeObjectURL(avatarPreview);
        }
      };
    }, [avatarPreview, avatarFile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!["image/png", "image/jpeg"].includes(file.type)) {
          setErrors((prev) => ({ ...prev, avatar: "Seuls PNG et JPG sont acceptés" }));
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          setErrors((prev) => ({ ...prev, avatar: "L'image doit être < 2MB" }));
          return;
        }
        // Revoke previous URL if exists
        if (avatarPreview && avatarFile) {
          URL.revokeObjectURL(avatarPreview);
        }
        setAvatarFile(file);
        const url = URL.createObjectURL(file);
        setAvatarPreview(url);
        setErrors((prev) => ({ ...prev, avatar: undefined }));
      }
    };

    const validateForm = () => {
      const newErrors: Partial<Record<keyof UserData, string>> = {};
      if (!formData.name.trim()) newErrors.name = "Le nom est requis";
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Email invalide";
      if (!formData.phone.match(/^\+?\d{1,3}(?:\s?\d{1,4}){2,4}$/))
        newErrors.phone = "Numéro invalide (ex: +224 612 34 75 79 ou +224612347579)";
      if (!formData.role.trim()) newErrors.role = "Le rôle est requis";
      if (!formData.entreprise.trim()) newErrors.entreprise = "L'entreprise est requise";
      if (!formData.department.trim()) newErrors.department = "Le département est requis";
      if (!formData.joinDate.match(/^\d{2} \w+ \d{4}$/)) newErrors.joinDate = "Date invalide (ex: 12 Mars 2023)";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        setUser({
          ...formData,
          avatar: avatarFile ? avatarPreview : formData.avatar,
        });
        onClose();
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-[#010D3E]/90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#FF671E] to-[#FF8E53] bg-clip-text text-transparent">
              Modifier le Profil
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-300 hover:text-[#FFFFFF]"
              aria-label="Fermer le formulaire"
            >
              <IconX size={24} />
            </motion.button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Avatar</label>
              <div className="flex items-center gap-4">
                <motion.div initial={{ scale: 1 }} animate={{ scale: avatarPreview ? 1 : 1 }} className="relative">
                  {avatarPreview ? (
                    <Image
                      key={avatarPreview}
                      width={64}
                      height={64}
                      src={avatarPreview}
                      alt="Aperçu de l'avatar"
                      className="h-16 w-16 rounded-full object-cover border-2 border-[#FF671E]/30"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#FF671E] to-[#FF8E53] flex items-center justify-center text-xl font-bold text-[#FFFFFF] border-2 border-[#FF671E]/30">
                      {formData.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}
                </motion.div>
                <motion.label
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-gray-200 hover:bg-white/20 cursor-pointer"
                >
                  Choisir une image
                  <input type="file" accept="image/png,image/jpeg" onChange={handleAvatarChange} className="hidden" />
                </motion.label>
              </div>
              {errors.avatar && <p className="text-red-400 text-xs mt-2 bg-red-500/10 p-2 rounded">{errors.avatar}</p>}
            </div>
            {[
              { name: "name", label: "Nom", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "phone", label: "Téléphone", type: "tel" },
              { name: "role", label: "Rôle", type: "text" },
              { name: "entreprise", label: "Entreprise", type: "text" },
              { name: "department", label: "Département", type: "text" },
              { name: "joinDate", label: "Date d'adhésion", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-200 mb-2">{field.label}</label>
                <motion.input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof UserData]}
                  onChange={handleInputChange}
                  whileFocus={{ scale: 1.02 }}
                  className="w-full px-4 py-2 bg-white/5 border border-[#FF671E]/30 rounded-lg text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#FF671E] transition-all"
                />
                {errors[field.name as keyof UserData] && (
                  <p className="text-red-400 text-xs mt-2 bg-red-500/10 p-2 rounded">{errors[field.name as keyof UserData]}</p>
                )}
              </div>
            ))}
            <div className="flex gap-4 justify-end pt-4">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 rounded-lg bg-white/10 border border-white/20 text-[#FFFFFF] hover:bg-white/20 transition-all"
              >
                Annuler
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-[#FFFFFF] shadow-lg hover:shadow-[#FF671E]/40 transition-all"
              >
                Enregistrer
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
      {/* Nouveau header ultra-transparent avec espace pour publicité */}
      <div className="h-[28rem] md:h-[32rem] relative bg-transparent overflow-hidden">
        {/* Carrousel d'images publicitaires */}
        <AdCarousel />

        {/* Contenu superposé */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Entête avec logo blanc et titre */}
          <div className="flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <Image src="/images/zalama-logo.svg" width={100} height={0} alt="Logo de ZaLaMa" className="h-auto w-24" priority />
              </div>
              <h2 className="text-[#FFFFFF] font-medium text-lg hidden sm:block">Profil Utilisateur</h2>
            </div>

            {/* Bouton Paramètres amélioré */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              aria-label="Ouvrir les paramètres"
            >
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                <IconSettings className="w-5 h-5 text-[#FFFFFF]" />
              </div>
            </motion.button>
          </div>

          {/* Texte publicitaire centré */}
          <div className="flex-1 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFFF]/90 mb-2"></h2>
              <p className="text-[#FFFFFF]/80 text-lg md:text-xl max-w-lg mx-auto"></p>
            </motion.div>
          </div>
        </div>

        {/* Effet de vague animé */}
        <motion.div
          className="absolute bottom-0 w-full h-12"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      {/* Carte de profil avec fond bleu foncé */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#010D3E]/80 dark:bg-gray-800/90 backdrop-blur-sm px-6 pb-6 -mt-12"
      >
        <div className="flex flex-col md:flex-row justify-between gap-6 pt-6">
          {/* Section gauche - Avatar + Infos */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <motion.div className="relative group mt-4" whileHover={{ scale: 1.03 }}>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>

              {user.avatar ? (
                <Image
                  key={user.avatar}
                  width={96}
                  height={96}
                  src={user.avatar}
                  alt={`Avatar de ${user.name}`}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover relative z-10 shadow-lg"
                  priority
                  onError={() => setUser((prev) => ({ ...prev, avatar: "" }))}
                />
              ) : (
                <div
                  key={user.name}
                  className="h-24 w-24 rounded-full border-4 border-white bg-gradient-to-br from-[#FF671E] to-[#FF8E53] flex items-center justify-center text-3xl font-bold text-[#FFFFFF] relative z-10 shadow-lg"
                >
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
            </motion.div>

            {/* Informations utilisateur */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 key={user.name} className="text-2xl font-bold text-[#FFFFFF]">
                  {user.name}
                </h1>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Actif
                  </motion.div>
                  <motion.div
                    key={user.role}
                    className="z-20 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-[#FFFFFF] text-xs font-bold px-3 py-0.5 rounded-full shadow-md flex items-center gap-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    <IconCrown size={12} />
                    <span>{user.role}</span>
                  </motion.div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center text-gray-300">
                  <IconBuilding size={16} className="mr-2 text-[#FF671E]" />
                  <span key={user.entreprise}>{user.entreprise}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <IconUser size={16} className="mr-2 text-[#FF671E]" />
                  <span key={user.department}>{user.department}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <IconCalendar size={16} className="mr-2 text-[#FF671E]" />
                  <span key={user.joinDate}>Depuis {user.joinDate}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <motion.a
                  key={user.phone}
                  href={`tel:${user.phone}`}
                  whileHover={{ y: -2 }}
                  className="flex items-center px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
                >
                  <IconPhone size={16} className="mr-1.5 text-[#FF671E]" />
                  <span>{user.phone}</span>
                </motion.a>
                <motion.a
                  key={user.email}
                  href={`mailto:${user.email}`}
                  whileHover={{ y: -2 }}
                  className="flex items-center px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
                >
                  <IconMail size={16} className="mr-1.5 text-[#FF671E]" />
                  <span>{user.email}</span>
                </motion.a>
              </div>
            </div>
          </div>

          {/* Section droite - Boutons */}
          <motion.div
            className="flex gap-2 self-start md:self-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNotifications(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 border border-white/20 shadow-sm hover:bg-white/20 transition-all text-sm"
            >
              <IconBell size={20} className="text-[#FFFFFF]" />
              <span className="sr-only md:not-sr-only text-[#FFFFFF]">Notifications</span>
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 14px rgba(255, 103, 30, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowEditForm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-[#FFFFFF] shadow-lg hover:shadow-[#FF671E]/30 transition-all text-sm"
            >
              <IconEdit size={20} />
              <span className="sr-only md:not-sr-only">Modifier</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Panneau des paramètres */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <ProfileSettings onClose={() => setShowSettings(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panneau des notifications */}
      <AnimatePresence>
        {showNotifications && <NotificationsView onClose={() => setShowNotifications(false)} />}
      </AnimatePresence>

      {/* Panneau de modification */}
      <AnimatePresence>
        {showEditForm && <EditProfileForm onClose={() => setShowEditForm(false)} />}
      </AnimatePresence>
    </div>
  );
}