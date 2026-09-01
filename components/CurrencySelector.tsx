import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CURRENCY_CONFIGS, SupportedCurrency } from '../context/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { activeCurrency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentConfig = CURRENCY_CONFIGS[activeCurrency] || CURRENCY_CONFIGS.USD;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all cursor-pointer shadow-sm"
        title="Select Currency"
      >
        <span>{currentConfig.flag}</span>
        <span>{currentConfig.code} ({currentConfig.symbol})</span>
        <svg
          className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden py-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-800/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Select Preferred Currency
          </div>
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {(Object.keys(CURRENCY_CONFIGS) as SupportedCurrency[]).map((code) => {
              const config = CURRENCY_CONFIGS[code];
              const isSelected = activeCurrency === code;

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setCurrency(code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-red-600/20 text-red-400 font-bold border-l-2 border-red-500'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{config.flag}</span>
                    <span>{config.code}</span>
                    <span className="text-slate-500 font-normal text-[11px]">- {config.name}</span>
                  </span>
                  <span className="font-mono font-bold text-slate-400">{config.symbol}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
