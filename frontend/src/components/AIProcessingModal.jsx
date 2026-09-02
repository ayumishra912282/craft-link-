import React from 'react';
import { CheckCircle2, Loader2, Circle, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AIProcessingModal({ currentStep = 1, isOpen = false }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const steps = [
    { id: 1, label: t('stage1') },
    { id: 2, label: t('stage2') },
    { id: 3, label: t('stage3') },
    { id: 4, label: t('stage4') },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Animated Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-terracotta mx-auto flex items-center justify-center text-white shadow-lg shadow-amber-600/30 mb-4 animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-serif text-stone-900 mb-1">
            {t('analyzingCraft')}
          </h3>
          <p className="text-xs text-stone-500">
            AI Multimodal Vision & Catalogue Copilot at work
          </p>
        </div>

        {/* 4-Stage Progress Tracker */}
        <div className="space-y-4">
          {steps.map((step) => {
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={'flex items-center gap-3.5 p-3 rounded-xl border transition-all ' + (
                  isDone
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : isCurrent
                    ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
                    : 'bg-stone-50 border-stone-200 text-stone-400'
                )}
              >
                <div>
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300" />
                  )}
                </div>
                <span className={'text-xs font-semibold ' + (isCurrent ? 'font-bold' : '')}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <span className="text-[11px] text-stone-400 italic">
            Preserving Indian craftsmanship without manual typing
          </span>
        </div>
      </div>
    </div>
  );
}
