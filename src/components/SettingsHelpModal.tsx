import { useEffect, useRef } from 'react';
import type { Language } from '../data/markets';
import {
  CUSTOM_SHORTCUTS_KEY,
  GUEST_FAVORITES_KEY,
  LANGUAGE_PREFERENCE_KEY,
  ONBOARDING_SEEN_KEY,
  PINNED_SITES_KEY,
  WORKFLOW_FAVORITES_KEY,
} from '../utils/storage';

type SettingsHelpModalProps = {
  isOpen: boolean;
  language: Language;
  isRemoteFavorites: boolean;
  onClose: () => void;
  onClearFavorites: () => void;
  onClearPinned: () => void;
  onClearWorkflowFavorites: () => void;
  onResetLocalSettings: () => void;
  onExportCustomShortcuts: () => void;
  onImportCustomShortcuts: (file: File) => void | Promise<void>;
  onExportAllSettings: () => void;
  onImportAllSettings: (file: File) => void | Promise<void>;
  onReplayOnboarding: () => void;
  customShortcutMessage: string | null;
  customShortcutError: string | null;
};

export function SettingsHelpModal({
  isOpen,
  language,
  isRemoteFavorites,
  onClose,
  onClearFavorites,
  onClearPinned,
  onClearWorkflowFavorites,
  onResetLocalSettings,
  onExportCustomShortcuts,
  onImportCustomShortcuts,
  onExportAllSettings,
  onImportAllSettings,
  onReplayOnboarding,
  customShortcutMessage,
  customShortcutError,
}: SettingsHelpModalProps) {
  const importInputRef = useRef<HTMLInputElement>(null);
  const importAllInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const confirmReset = () => {
    const confirmed = window.confirm(
      language === 'zh'
        ? '确定要重置全部本地设置吗？这会清空本地收藏、置顶和工作流收藏。'
        : 'Reset all local settings? This clears local favorites, pins, and workflow favorites.',
    );

    if (confirmed) {
      onResetLocalSettings();
    }
  };

  const openImportFilePicker = () => {
    if (importInputRef.current) {
      importInputRef.current.value = '';
      importInputRef.current.click();
    }
  };

  const openImportAllFilePicker = () => {
    if (importAllInputRef.current) {
      importAllInputRef.current.value = '';
      importAllInputRef.current.click();
    }
  };

  const importFile = (file: File | undefined) => {
    if (!file) {
      return;
    }

    void onImportCustomShortcuts(file);
  };

  const importAllFile = (file: File | undefined) => {
    if (!file) {
      return;
    }

    void onImportAllSettings(file);
  };

  const helpItems =
    language === 'zh'
      ? [
          ['Quant Navigator 是什么', '一个量化投研网站快速启动器，帮助你查找、筛选、置顶和打开常用网页资源。'],
          ['如何搜索网站', '使用首页搜索框，输入中文名、英文名、网址、标签、aliases 或访问条件。'],
          ['自定义快捷入口', '添加自己的网页入口后，会和内置网站一起参与搜索、筛选、收藏、置顶和命令栏。'],
          ['备份与迁移', '导出全部设置为 JSON，可在新浏览器、新电脑或 Windows 离线版导入恢复。'],
          ['Market / Category / Access 筛选', '市场、功能分类和访问条件可以叠加，和搜索、工作流筛选同时生效。'],
          ['Quick Workflows', '按投研场景组织网站集合，可以查看包含网站、筛选这些网站，或明确点击打开全部。'],
          ['Pin Board', '把最高频的网站置顶到首页顶部，作为最快速的启动区。'],
          ['Favorite 与 Pin 的区别', '收藏是长期关注资源；置顶是首页快速启动入口，两者互不影响。'],
          ['Command Palette', '按 Cmd+K / Ctrl+K 打开命令栏，搜索网站和工作流。'],
          ['Windows 离线版', 'Electron 桌面版会打包网页 UI，普通用户打开 exe 即可使用，不需要命令行。'],
          ['localStorage 本地保存', '本地收藏、置顶和工作流收藏保存在当前浏览器或 Electron 的 localStorage。'],
        ]
      : [
          ['What Quant Navigator Is', 'A quick-launch assistant for quant research websites: search, filter, pin, favorite, and open web resources.'],
          ['Search Sites', 'Use the home search field with English names, Chinese names, URLs, tags, aliases, or access labels.'],
          ['Custom Shortcuts', 'Add your own web shortcuts; they join built-in sites in search, filters, favorites, pins, and the Command Palette.'],
          ['Backup & Migration', 'Export all settings as JSON, then import them in a new browser, computer, or Windows offline build.'],
          ['Market / Category / Access Filters', 'Market, category, and access filters stack with search and workflow filters.'],
          ['Quick Workflows', 'Workflow cards group websites by research scenario. View sites, filter them, or explicitly open all.'],
          ['Pin Board', 'Pin your most-used sites to the home page for fast launch.'],
          ['Favorite vs Pin', 'Favorites are long-term tracked resources. Pins are home quick-launch entries. They are independent.'],
          ['Command Palette', 'Press Cmd+K / Ctrl+K to search sites and workflows.'],
          ['Windows Offline Build', 'The Electron desktop build bundles the web UI into an exe; normal users do not need command-line setup.'],
          ['localStorage', 'Local favorites, pins, and workflow favorites are stored in browser or Electron localStorage.'],
        ];

  const shortcuts =
    language === 'zh'
      ? [
          ['Cmd+K / Ctrl+K', '打开命令栏'],
          ['Esc', '关闭弹窗或命令栏'],
          ['Enter', '打开选中网站 / 筛选工作流'],
        ]
      : [
          ['Cmd+K / Ctrl+K', 'Open Command Palette'],
          ['Esc', 'Close modal or palette'],
          ['Enter', 'Open selected site / filter workflow'],
        ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-terminal-950/75 px-4 py-12 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={language === 'zh' ? '设置与帮助' : 'Settings and help'}
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-5xl overflow-hidden rounded-2xl border border-terminal-accent/20 bg-terminal-950/95 shadow-glow"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-terminal-accent">
              Settings / Help
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {language === 'zh' ? '设置与帮助' : 'Settings and Help'}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {language === 'zh'
                ? '管理本地设置，并快速了解 Quant Navigator 的使用方式。'
                : 'Manage local settings and learn how to use Quant Navigator.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-fit rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-terminal-accent/40 hover:text-terminal-accent"
          >
            {language === 'zh' ? '关闭' : 'Close'}
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1.35fr_0.85fr]">
          <section>
            <h3 className="text-sm font-semibold text-white">
              {language === 'zh' ? '帮助' : 'Help'}
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {helpItems.map(([title, body]) => (
                <article key={title} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <h4 className="text-sm font-semibold text-terminal-accent">{title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
                </article>
              ))}
            </div>

            <h3 className="mt-5 text-sm font-semibold text-white">
              {language === 'zh' ? '快捷键' : 'Shortcuts'}
            </h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {shortcuts.map(([keys, body]) => (
                <div key={keys} className="rounded-xl border border-white/10 bg-terminal-900/70 p-3">
                  <kbd className="font-mono text-xs text-terminal-gold">{keys}</kbd>
                  <p className="mt-2 text-xs text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-white">
              {language === 'zh' ? '本地设置' : 'Local Settings'}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {language === 'zh'
                ? '这些操作只影响当前浏览器或当前 Electron 桌面版的 localStorage。'
                : 'These actions affect only localStorage in this browser or Electron desktop app.'}
            </p>
            {isRemoteFavorites ? (
              <p className="mt-2 rounded-xl border border-terminal-gold/25 bg-terminal-gold/10 px-3 py-2 text-xs text-terminal-gold">
                {language === 'zh'
                  ? '当前登录账号收藏由远程同步管理；这里的“清空收藏”只清空本地访客收藏。'
                  : 'Signed-in favorites are remotely synced; Clear favorites here only clears local guest favorites.'}
              </p>
            ) : null}

            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={onClearFavorites}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-terminal-gold/40 hover:text-terminal-gold"
              >
                {language === 'zh' ? '清空收藏' : 'Clear favorites'}
              </button>
              <button
                type="button"
                onClick={onClearPinned}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-terminal-gold/40 hover:text-terminal-gold"
              >
                {language === 'zh' ? '清空置顶' : 'Clear pins'}
              </button>
              <button
                type="button"
                onClick={onClearWorkflowFavorites}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-terminal-gold/40 hover:text-terminal-gold"
              >
                {language === 'zh' ? '清空工作流收藏' : 'Clear workflow favorites'}
              </button>
              <button
                type="button"
                onClick={onReplayOnboarding}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-terminal-accent/40 hover:text-terminal-accent"
              >
                {language === 'zh' ? '重新查看新手引导' : 'Replay Onboarding'}
              </button>
              <button
                type="button"
                onClick={onExportAllSettings}
                className="w-full rounded-xl border border-terminal-accent/25 bg-terminal-accent/10 px-4 py-3 text-left text-sm font-semibold text-terminal-accent transition hover:border-terminal-accent/60 hover:bg-terminal-accent hover:text-terminal-950"
              >
                {language === 'zh' ? '导出全部设置' : 'Export All Settings'}
              </button>
              <button
                type="button"
                onClick={openImportAllFilePicker}
                className="w-full rounded-xl border border-terminal-accent/25 bg-terminal-accent/10 px-4 py-3 text-left text-sm font-semibold text-terminal-accent transition hover:border-terminal-accent/60 hover:bg-terminal-accent hover:text-terminal-950"
              >
                {language === 'zh' ? '导入全部设置' : 'Import All Settings'}
              </button>
              <input
                ref={importAllInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(event) => importAllFile(event.target.files?.[0])}
              />
              <button
                type="button"
                onClick={onExportCustomShortcuts}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-terminal-accent/40 hover:text-terminal-accent"
              >
                {language === 'zh' ? '导出自定义快捷入口' : 'Export Custom Shortcuts'}
              </button>
              <button
                type="button"
                onClick={openImportFilePicker}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-terminal-accent/40 hover:text-terminal-accent"
              >
                {language === 'zh' ? '导入自定义快捷入口' : 'Import Custom Shortcuts'}
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(event) => importFile(event.target.files?.[0])}
              />
              {customShortcutMessage ? (
                <p className="rounded-xl border border-terminal-accent/25 bg-terminal-accent/10 px-3 py-2 text-xs text-terminal-accent">
                  {customShortcutMessage}
                </p>
              ) : null}
              {customShortcutError ? (
                <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {customShortcutError}
                </p>
              ) : null}
              <button
                type="button"
                onClick={confirmReset}
                className="w-full rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-left text-sm font-semibold text-red-200 transition hover:border-red-300/60 hover:bg-red-500/15"
              >
                {language === 'zh' ? '重置全部本地设置' : 'Reset all local settings'}
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-terminal-900/70 p-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-terminal-accent">
                localStorage
              </h4>
              <div className="mt-3 space-y-2 text-xs text-slate-500">
                <p>{GUEST_FAVORITES_KEY}</p>
                <p>{PINNED_SITES_KEY}</p>
                <p>{WORKFLOW_FAVORITES_KEY}</p>
                <p>{CUSTOM_SHORTCUTS_KEY}</p>
                <p>{LANGUAGE_PREFERENCE_KEY}</p>
                <p>{ONBOARDING_SEEN_KEY}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
