import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { motion as Motion } from "motion/react";
import { AnimatePresence } from "framer-motion";
import { Heart, User, MessageCircle, Send, Loader2, Calendar, Trophy, Zap, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/app/config/api";

interface Donor {
  id: string;
  name: string;
  message: string;
  amount: string;
  network: string;
  date: string;
  timestamp: number;
}

export const DonorWall: React.FC = () => {
  const { lang, dir } = useLanguage();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    amount: "",
    network: "solana",
    txHash: ""
  });

  const texts = {
    en: {
      title: "Donor Wall",
      subtitle: "Our wall of fame for those who keep this project alive.",
      recentDonors: "Recent Supporters",
      becomeDonor: "Add Your Name",
      formTitle: "Submit Donation Record",
      formSubtitle: "Enter your details after donating to be featured on the wall.",
      nameLabel: "Your Name (or Nickname)",
      namePlaceholder: "e.g. Satoshi",
      messageLabel: "Message (Optional)",
      messagePlaceholder: "A short thank you or note...",
      amountLabel: "Amount Donated",
      amountPlaceholder: "e.g. 0.05",
      networkLabel: "Network",
      txLabel: "Transaction Hash (Optional)",
      txPlaceholder: "For verification...",
      submitBtn: "Submit Record",
      noDonors: "Be the first to support us!",
      thankYou: "Record submitted! Thank you for your support.",
      error: "Something went wrong. Please try again.",
      close: "Close"
    },
    fa: {
      title: "دیوار حامیان",
      subtitle: "لیست افتخاری کسانی که این پروژه را زنده نگه می‌دارند.",
      recentDonors: "آخرین حامیان",
      becomeDonor: "نام خود را اضافه کنید",
      formTitle: "ثبت رکورد حمایت مالی",
      formSubtitle: "اطلاعات خود را پس از اهدای وجه وارد کنید تا در لیست نمایش داده شود.",
      nameLabel: "نام شما (یا نام مستعار)",
      namePlaceholder: "مثلاً: ساتوشی",
      messageLabel: "پیام (اختیاری)",
      messagePlaceholder: "یک تشکر یا پیام کوتاه...",
      amountLabel: "مبلغ اهدایی",
      amountPlaceholder: "مثلاً: 0.05",
      networkLabel: "شبکه",
      txLabel: "کد پیگیری تراکنش (اختیاری)",
      txPlaceholder: "جهت تایید تراکنش...",
      submitBtn: "ثبت اطلاعات",
      noDonors: "اولین حامی ما باشید!",
      thankYou: "اطلاعات با موفقیت ثبت شد! از حمایت شما سپاسگزاریم.",
      error: "خطایی رخ داد. دوباره تلاش کنید.",
      close: "بستن"
    }
  };

  const t = (texts as any)[lang] || texts.en;

  const fetchDonors = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getDonors();
      if (data.success) {
        setDonors(data.donors || []);
      }
    } catch (err) {
      console.error("Failed to fetch donors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
      toast.error(lang === 'en' ? "Please fill in name and amount" : "لطفاً نام و مبلغ را وارد کنید");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiService.submitDonationRecord(formData);

      if (result.success) {
        toast.success(t.thankYou);
        setFormData({ name: "", message: "", amount: "", network: "solana", txHash: "" });
        setShowForm(false);
        fetchDonors();
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      toast.error(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8" dir={dir}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            {t.title}
          </h2>
          <p className="text-gray-400 mt-2">{t.subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
        >
          {showForm ? t.close : (
            <>
              <Heart className="w-5 h-5" />
              {t.becomeDonor}
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <Motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">{t.formTitle}</h3>
                <p className="text-sm text-gray-400">{t.formSubtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">{t.nameLabel} *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t.namePlaceholder}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">{t.amountLabel} *</label>
                    <input
                      type="text"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder={t.amountPlaceholder}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">{t.networkLabel}</label>
                    <select
                      value={formData.network}
                      onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/50"
                    >
                      <option value="solana">Solana</option>
                      <option value="ethereum">Ethereum</option>
                      <option value="base">Base</option>
                      <option value="tron">Tron</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">{t.messageLabel}</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.messagePlaceholder}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/50 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">{t.txLabel}</label>
                    <input
                      type="text"
                      value={formData.txHash}
                      onChange={(e) => setFormData({ ...formData, txHash: e.target.value })}
                      placeholder={t.txPlaceholder}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 mt-2 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {t.submitBtn}
                  </button>
                </div>
              </form>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-full" />
                <div className="h-4 w-24 bg-white/10 rounded" />
              </div>
              <div className="h-3 w-full bg-white/10 rounded mb-2" />
              <div className="h-3 w-2/3 bg-white/10 rounded" />
            </div>
          ))
        ) : donors.length > 0 ? (
          donors.map((donor, idx) => (
            <Motion.div
              key={donor.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 rounded-2xl p-6 transition-all"
            >
              <div className="absolute top-4 right-4 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {donor.network.toUpperCase()}
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-black">
                  {donor.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {donor.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(donor.date).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}
                  </p>
                </div>
              </div>

              {donor.message && (
                <div className="relative">
                  <MessageCircle className="absolute -top-1 -left-1 w-3 h-3 text-gray-600 opacity-50" />
                  <p className="text-sm text-gray-400 italic pl-4 border-l border-white/10">
                    "{donor.message}"
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                   <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
                   <span className="text-[10px] text-gray-500">Verified Donor</span>
                </div>
                <div className="text-sm font-black text-white bg-white/5 px-3 py-1 rounded-lg">
                  {donor.amount}
                </div>
              </div>
            </Motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-20" />
            <p className="text-gray-500">{t.noDonors}</p>
          </div>
        )}
      </div>
    </div>
  );
};