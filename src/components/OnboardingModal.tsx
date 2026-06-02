import { useEffect, useState } from 'react';
import type { Language } from '../data/markets';

type OnboardingModalProps = {
  isOpen: boolean;
  language: Language;
  onDismiss: () => void;
};

type OnboardingStep = {
  eyebrow: string;
  title: string;
  body: string;
};

const onboardingSteps: Record<Language, OnboardingStep[]> = {
  zh: [
    {
      eyebrow: 'Step 1',
      title: '选择市场',
      body: '从 A股、美股、港股、加密或通用工具开始，先缩小你想看的投研入口范围。',
    },
    {
      eyebrow: 'Step 2',
      title: '使用 Quick Workflows',
      body: 'Quick Workflows 会把常用投研路径打包成流程卡片，可以查看包含网站、筛选这些网站，或明确点击打开全部。',
    },
    {
      eyebrow: 'Step 3',
      title: '固定最常用入口',
      body: '在网站卡片上点击“置顶”，把高频入口放进 Pin Board，之后打开首页就能快速启动。',
    },
    {
      eyebrow: 'Step 4',
      title: '打开 Command Palette',
      body: '按 Cmd/Ctrl + K 可随时搜索网站和工作流，适合用简称、标签或访问条件快速跳转。',
    },
    {
      eyebrow: 'Step 5',
      title: '备份和恢复设置',
      body: '在 Settings / Help 里导出全部设置 JSON，也可以在新浏览器、新电脑或 Windows 离线版中导入恢复。',
    },
  ],
  en: [
    {
      eyebrow: 'Step 1',
      title: 'Choose a Market',
      body: 'Start with A-Shares, US Stocks, Hong Kong, Crypto, or Tools to narrow the research resources you see.',
    },
    {
      eyebrow: 'Step 2',
      title: 'Use Quick Workflows',
      body: 'Quick Workflows bundle common research paths into cards. View included sites, filter to them, or explicitly open all.',
    },
    {
      eyebrow: 'Step 3',
      title: 'Pin Frequent Sites',
      body: 'Click Pin on a site card to place your highest-frequency entries in the Pin Board for fast launch.',
    },
    {
      eyebrow: 'Step 4',
      title: 'Open Command Palette',
      body: 'Press Cmd/Ctrl + K to search sites and workflows from anywhere using names, aliases, tags, or access hints.',
    },
    {
      eyebrow: 'Step 5',
      title: 'Back Up and Restore',
      body: 'Use Settings / Help to export all settings as JSON, then import them in a new browser, computer, or Windows offline build.',
    },
  ],
};

export function OnboardingModal({ isOpen, language, onDismiss }: OnboardingModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = onboardingSteps[language];
  const step = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;

  useEffect(() => {
    if (isOpen) {
      setStepIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onDismiss]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-terminal-950/80 px-4 py-10 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={language === 'zh' ? '首次使用引导' : 'First run onboarding'}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-terminal-accent/25 bg-terminal-950/95 shadow-glow">
        <div className="border-b border-white/10 p-5">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-terminal-accent">
            First Run Onboarding
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            {language === 'zh' ? '快速上手 Quant Navigator' : 'Get Started with Quant Navigator'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {language === 'zh'
              ? '这是一个网页资源快速启动器；它不会打开本地文件夹，也不会执行本地命令。'
              : 'This is a web resource quick launcher. It does not open local folders or run local commands.'}
          </p>
        </div>

        <div className="p-5">
          <div className="mb-5 flex gap-2">
            {steps.map((item, index) => (
              <span
                key={item.title}
                className={[
                  'h-1.5 flex-1 rounded-full transition',
                  index <= stepIndex ? 'bg-terminal-accent' : 'bg-white/10',
                ].join(' ')}
              />
            ))}
          </div>

          <article className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-terminal-gold">
              {step.eyebrow} / {stepIndex + 1} of {steps.length}
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{step.body}</p>
          </article>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-terminal-gold/40 hover:text-terminal-gold"
            >
              {language === 'zh' ? '跳过' : 'Skip'}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isFirstStep}
                onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
                className={[
                  'rounded-xl border px-4 py-3 text-sm font-semibold transition',
                  isFirstStep
                    ? 'cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-700'
                    : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-terminal-accent/40 hover:text-terminal-accent',
                ].join(' ')}
              >
                {language === 'zh' ? '上一步' : 'Back'}
              </button>
              {isLastStep ? (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="rounded-xl border border-terminal-accent/40 bg-terminal-accent/10 px-4 py-3 text-sm font-semibold text-terminal-accent transition hover:bg-terminal-accent hover:text-terminal-950"
                >
                  {language === 'zh' ? '开始使用' : 'Get Started'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStepIndex((current) => Math.min(current + 1, steps.length - 1))}
                  className="rounded-xl border border-terminal-accent/40 bg-terminal-accent/10 px-4 py-3 text-sm font-semibold text-terminal-accent transition hover:bg-terminal-accent hover:text-terminal-950"
                >
                  {language === 'zh' ? '下一步' : 'Next'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
