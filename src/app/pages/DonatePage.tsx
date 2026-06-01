import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { motion as Motion } from "motion/react";
import { AnimatePresence } from "framer-motion";
import { Wallet, Heart, Copy, ExternalLink, Loader2, Check, Zap, Shield } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { DonorWall } from "../components/DonorWall";

// Crypto wallet addresses
const WALLET_ADDRESSES = {
  ethereum: "0x3320B8376321FC3993270CFc984a419b3D283A7C",
  solana: "H6Syv5EBEeedLcXjEYgrzwB2BhS2aXpSTWbhRzLeHRiv",
  base: "0x3320B8376321FC3993270CFc984a419b3D283A7C",
  tron: "TY5Pup4NnRLnFM4vHYrWKs95ZdMFAowX1r"
};

type NetworkType = keyof typeof WALLET_ADDRESSES;

export const DonatePage: React.FC = () => {
  const { lang, t, dir } = useLanguage();
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>("solana");
  const [copiedNetwork, setCopiedNetwork] = useState<NetworkType | null>(null);
  const [showMetaMask, setShowMetaMask] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [amount, setAmount] = useState("0.01");
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [ethersInstance, setEthersInstance] = useState<any>(null);

  const texts = {
    en: {
      title: "Support Our Project",
      subtitle: "Your support helps us maintain the servers and provide high-quality content for free.",
      preferredMethod: "Preferred Method",
      chooseNetwork: "Choose Your Network",
      copyAddress: "Copy Address",
      copied: "Copied!",
      scanQR: "Or Scan QR Code",
      alternativeMethod: "Alternative: MetaMask",
      useMetaMask: "Use MetaMask Wallet",
      hideMetaMask: "Hide MetaMask",
      walletConnected: "Wallet Connected",
      connectWallet: "Connect MetaMask",
      donateBtn: "Send Donation",
      amountLabel: "Amount (ETH)",
      customAmount: "Custom Amount",
      txSuccess: "Thank you for your donation!",
      txPending: "Transaction is being processed...",
      txError: "Transaction failed. Please try again.",
      whyDonate: "Why donate?",
      reason1: "High-speed servers for streaming and downloads",
      reason2: "Regular updates and new movie/series additions",
      reason3: "Ad-free experience development",
      lowFee: "Low Fee",
      recommended: "Recommended",
      secure: "Secure",
      networkInfo: {
        ethereum: "Most popular blockchain network",
        solana: "Ultra-fast transactions with minimal fees",
        base: "Ethereum L2 with low gas fees",
        tron: "High TPS blockchain network"
      }
    },
    fa: {
      title: "حمایت از پروژه ما",
      subtitle: "حمایت شما به ما کمک می‌کند تا سرورها را نگهداری کرده و محتوای باکیفیت را به رایگان ارائه دهیم.",
      preferredMethod: "روش پیشنهادی",
      chooseNetwork: "شبکه خود را انتخاب کنید",
      copyAddress: "کپی آدرس",
      copied: "کپی شد!",
      scanQR: "یا QR کد را اسکن کنید",
      alternativeMethod: "روش جایگزین: متامسک",
      useMetaMask: "استفاده از کیف پول متامسک",
      hideMetaMask: "پنهان کردن متامسک",
      walletConnected: "کیف پول متصل شد",
      connectWallet: "اتصال به متامسک",
      donateBtn: "ارسال حمایت مالی",
      amountLabel: "مبلغ (ETH)",
      customAmount: "مبلغ دلخواه",
      txSuccess: "از حمایت شما صمیمانه سپاسگزاریم!",
      txPending: "تراکنش در حال پردازش است...",
      txError: "تراکنش با خطا مواجه شد. دوباره تلاش کنید.",
      whyDonate: "چرا حمایت مالی کنیم؟",
      reason1: "نگهداری سرورهای پرسرعت برای پخش و دانلود",
      reason2: "به‌روزرسانی منظم و افزودن فیلم و سریال‌های جدید",
      reason3: "توسعه قابلیت‌های جدید و حذف تبلیغات",
      lowFee: "کارمزد کم",
      recommended: "پیشنهادی",
      secure: "امن",
      networkInfo: {
        ethereum: "محبوب‌ترین شبکه بلاکچین",
        solana: "تراکنش فوق سریع با کارمزد بسیار کم",
        base: "لایه دوم اتریوم با کارمزد کم",
        tron: "شبکه بلاکچین با TPS بالا"
      }
    }
  };

  const content = (texts as any)[lang] || texts.en;

  const networks = [
    { 
      id: "solana" as NetworkType, 
      name: "Solana", 
      icon: "◎", 
      color: "from-purple-600 to-blue-600",
      badge: content.lowFee,
      badgeColor: "bg-purple-500"
    },
    { 
      id: "base" as NetworkType, 
      name: "Base", 
      icon: "🔵", 
      color: "from-blue-600 to-cyan-600",
      badge: content.lowFee,
      badgeColor: "bg-blue-500"
    },
    { 
      id: "ethereum" as NetworkType, 
      name: "Ethereum", 
      icon: "Ξ", 
      color: "from-slate-600 to-slate-700",
      badge: content.secure,
      badgeColor: "bg-slate-500"
    },
    { 
      id: "tron" as NetworkType, 
      name: "Tron", 
      icon: "🔴", 
      color: "from-red-600 to-orange-600",
      badge: "",
      badgeColor: ""
    }
  ];

  // Load ethers dynamically to prevent module load errors
  useEffect(() => {
    const loadEthers = async () => {
      try {
        const ethersModule = await import("ethers");
        setEthersInstance(ethersModule.ethers || ethersModule);
      } catch (err) {
        console.error("Failed to load ethers", err);
      }
    };
    loadEthers();
  }, []);

  const checkConnection = async () => {
    const eth = (window as any).ethereum;
    if (eth) {
      try {
        const accounts = await eth.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    checkConnection();
    const eth = (window as any).ethereum;
    if (eth) {
      const handleAccounts = (accounts: string[]) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      };
      eth.on('accountsChanged', handleAccounts);
      return () => {
        if (eth.removeListener) {
          eth.removeListener('accountsChanged', handleAccounts);
        }
      };
    }
  }, []);

  const connectWallet = async () => {
    const eth = (window as any).ethereum;
    if (!eth) {
      toast.error(lang === 'en' ? "MetaMask is not installed!" : "متامسک نصب نشده است!");
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      toast.success(lang === 'en' ? "Wallet connected!" : "کیف پول متصل شد!");
    } catch (err) {
      console.error(err);
      toast.error(lang === 'en' ? "Connection failed" : "اتصال ناموفق بود");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDonate = async () => {
    if (!account) return;
    if (!amount || parseFloat(amount) <= 0) {
      toast.error(lang === 'en' ? "Please enter a valid amount" : "لطفاً مبلغ معتبری وارد کنید");
      return;
    }

    if (!ethersInstance) {
      toast.error(lang === 'en' ? "Encryption library still loading..." : "کتابخانه امنیتی در حال بارگذاری است...");
      return;
    }

    setIsPending(true);
    setTxHash(null);

    try {
      const eth = (window as any).ethereum;
      if (!eth) throw new Error("No ethereum provider");
      
      const provider = new ethersInstance.BrowserProvider(eth);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: WALLET_ADDRESSES.ethereum,
        value: ethersInstance.parseEther(amount)
      });

      setTxHash(tx.hash);
      toast.loading(content.txPending);

      const receipt = await tx.wait();
      if (receipt?.status === 1) {
        toast.success(content.txSuccess);
      } else {
        toast.error(content.txError);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        toast.error(lang === 'en' ? "Transaction rejected" : "تراکنش لغو شد");
      } else {
        toast.error(content.txError);
      }
    } finally {
      setIsPending(false);
    }
  };

  const copyToClipboard = (network: NetworkType) => {
    navigator.clipboard.writeText(WALLET_ADDRESSES[network]);
    setCopiedNetwork(network);
    toast.success(content.copied);
    setTimeout(() => setCopiedNetwork(null), 2000);
  };

  const presetAmounts = ["0.005", "0.01", "0.05", "0.1"];

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen" dir={dir}>
      <div className="max-w-6xl mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 bg-emerald-600/20 rounded-full mb-6 text-emerald-500">
            <Heart className="w-8 h-8 fill-current animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {content.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </Motion.div>

        {/* Main Wallet Addresses Section */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Shield className="w-6 h-6 text-emerald-500" />
              {content.preferredMethod}
            </h2>
            <div className="px-4 py-2 bg-emerald-600/20 border border-emerald-600/30 rounded-full">
              <span className="text-xs font-bold text-emerald-400">{content.recommended}</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-6">{content.chooseNetwork}</p>

          {/* Network Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {networks.map((network) => (
              <button
                key={network.id}
                onClick={() => setSelectedNetwork(network.id)}
                className={`relative p-4 rounded-2xl border-2 transition-all ${
                  selectedNetwork === network.id
                    ? 'bg-white/10 border-emerald-600 shadow-lg shadow-emerald-600/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {network.badge && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className={`${network.badgeColor} px-2 py-1 rounded-full`}>
                      <span className="text-[9px] font-black text-white">{network.badge}</span>
                    </div>
                  </div>
                )}
                <div className={`text-3xl mb-2 bg-gradient-to-br ${network.color} bg-clip-text text-transparent font-black`}>
                  {network.icon}
                </div>
                <div className="text-sm font-bold text-white mb-1">{network.name}</div>
                <div className="text-[10px] text-gray-500 line-clamp-2">
                  {content.networkInfo[network.id]}
                </div>
                {selectedNetwork === network.id && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Wallet Address */}
            <div className="space-y-4">
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {networks.find(n => n.id === selectedNetwork)?.name} Address
                  </span>
                  {(selectedNetwork === "solana" || selectedNetwork === "base") && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-600/20 rounded-full">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      <span className="text-[9px] font-black text-emerald-400">{content.lowFee}</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-slate-950 rounded-xl p-4 mb-4 border border-white/5">
                  <code className={`text-xs text-emerald-500/90 font-mono break-all leading-relaxed ${
                    selectedNetwork === "solana" ? "text-[10px]" : ""
                  }`}>
                    {WALLET_ADDRESSES[selectedNetwork]}
                  </code>
                </div>

                <button
                  onClick={() => copyToClipboard(selectedNetwork)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  {copiedNetwork === selectedNetwork ? (
                    <>
                      <Check className="w-5 h-5" />
                      {content.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      {content.copyAddress}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="space-y-4">
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  {content.scanQR}
                </span>
                <div className="bg-white p-4 rounded-2xl">
                  <QRCodeSVG 
                    value={WALLET_ADDRESSES[selectedNetwork]} 
                    size={200}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    {content.networkInfo[selectedNetwork]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Motion.div>

        {/* Why Donate Section */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8"
        >
          <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-500" />
            {content.whyDonate}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[content.reason1, content.reason2, content.reason3].map((reason, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-500 font-black text-sm">{idx + 1}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>
        </Motion.div>

        {/* MetaMask Alternative Section */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-900/50 to-transparent border border-white/5 rounded-3xl p-6"
        >
          <button
            onClick={() => setShowMetaMask(!showMetaMask)}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{content.alternativeMethod}</h3>
                <p className="text-xs text-gray-500">{lang === 'en' ? "For MetaMask users (Ethereum only)" : "برای کاربران متامسک (فقط اتریوم)"}</p>
              </div>
            </div>
            <div className={`text-gray-400 transition-transform ${showMetaMask ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </button>

          <AnimatePresence>
            {showMetaMask && (
              <Motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-white/5"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${account ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-600 animate-pulse'}`} />
                      <span className="text-sm font-bold text-gray-300">
                        {account ? content.walletConnected : (lang === 'en' ? "Wallet Disconnected" : "کیف پول متصل نیست")}
                      </span>
                    </div>
                    {account && (
                      <div className="px-3 py-1 bg-emerald-600/10 border border-emerald-600/20 rounded-full">
                        <span className="text-[10px] font-mono text-emerald-500">
                          {account.slice(0, 6)}...{account.slice(-4)}
                        </span>
                      </div>
                    )}
                  </div>

                  {!account ? (
                    <div className="text-center py-8">
                      <button
                        onClick={connectWallet}
                        disabled={isConnecting}
                        className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-600/20 disabled:opacity-50"
                      >
                        <span className="flex items-center gap-3">
                          {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
                          {content.connectWallet}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-3">{content.amountLabel}</label>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          {presetAmounts.map((amt) => (
                            <button
                              key={amt}
                              onClick={() => setAmount(amt)}
                              className={`py-2 px-3 rounded-xl border-2 transition-all font-bold text-sm ${
                                amount === amt 
                                  ? 'bg-orange-600/20 border-orange-600 text-orange-400' 
                                  : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10 hover:text-gray-300'
                              }`}
                            >
                              {amt} <span className="text-[9px] opacity-60">ETH</span>
                            </button>
                          ))}
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.001"
                            placeholder={content.customAmount}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 ${dir === 'rtl' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'} text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-600/50 transition-all`}
                          />
                          <div className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500 font-bold`}>
                            Ξ
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleDonate}
                        disabled={isPending || !amount || parseFloat(amount) <= 0}
                        className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 disabled:opacity-50 disabled:grayscale"
                      >
                        <span className="flex items-center justify-center gap-3">
                          {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Heart className="w-6 h-6" />}
                          {content.donateBtn}
                        </span>
                      </button>

                      <AnimatePresence>
                        {txHash && (
                          <Motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 bg-emerald-600/10 border border-emerald-600/20 rounded-xl"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">Transaction ID:</span>
                              <a 
                                href={`https://etherscan.io/tx/${txHash}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] text-emerald-500 hover:underline flex items-center gap-1 font-mono"
                              >
                                {txHash.slice(0, 10)}...{txHash.slice(-8)}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </Motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </Motion.div>

        {/* Donor Wall Section */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-12 border-t border-white/10"
        >
          <DonorWall />
        </Motion.div>
      </div>
    </div>
  );
};