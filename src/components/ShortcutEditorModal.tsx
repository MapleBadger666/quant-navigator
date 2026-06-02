import { useEffect, useState } from 'react';
import {
  accessLabels,
  accessTags,
  categories,
  categoryLabels,
  marketLabels,
  markets,
  priorityLabels,
  type AccessTag,
  type Category,
  type Language,
  type Market,
  type Priority,
} from '../data/markets';
import type { CustomShortcut } from '../data/sites';
import type { ShortcutDraft } from '../hooks/useCustomShortcuts';

type ShortcutEditorModalProps = {
  isOpen: boolean;
  language: Language;
  shortcut: CustomShortcut | null;
  onClose: () => void;
  onSave: (shortcutId: string | null, draft: ShortcutDraft) => void;
};

const defaultMarket: Market = '通用工具';
const defaultCategory: Category = 'Tools / Visualization / 工具可视化';
const defaultPriority: Priority = 'useful';

const textInputClass =
  'w-full rounded-xl border border-white/10 bg-terminal-900/85 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-terminal-accent/55 focus:ring-2 focus:ring-terminal-accent/15';

const fieldLabelClass = 'text-xs font-semibold uppercase tracking-[0.16em] text-slate-500';

const parseList = (value: string) =>
  [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))];

const formatList = (value: string[] | undefined) => value?.join(', ') ?? '';

const isValidHttpUrl = (url: string) => /^https?:\/\//i.test(url.trim());

export function ShortcutEditorModal({
  isOpen,
  language,
  shortcut,
  onClose,
  onSave,
}: ShortcutEditorModalProps) {
  const [name, setName] = useState('');
  const [nameZh, setNameZh] = useState('');
  const [url, setUrl] = useState('');
  const [descriptionZh, setDescriptionZh] = useState('');
  const [noteZh, setNoteZh] = useState('');
  const [tags, setTags] = useState('');
  const [aliases, setAliases] = useState('');
  const [market, setMarket] = useState<Market>(defaultMarket);
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [priority, setPriority] = useState<Priority>(defaultPriority);
  const [access, setAccess] = useState<Set<AccessTag>>(() => new Set());
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(shortcut?.name ?? '');
    setNameZh(shortcut?.nameZh ?? '');
    setUrl(shortcut?.url ?? '');
    setDescriptionZh(shortcut?.descriptionZh ?? '');
    setNoteZh(shortcut?.noteZh ?? '');
    setTags(formatList(shortcut?.tags));
    setAliases(formatList(shortcut?.aliases));
    setMarket(shortcut?.market ?? defaultMarket);
    setCategory(shortcut?.category ?? defaultCategory);
    setPriority(shortcut?.priority ?? defaultPriority);
    setAccess(new Set(shortcut?.access ?? []));
    setError(null);
    setStatus(null);
  }, [isOpen, shortcut]);

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

  const toggleAccess = (accessTag: AccessTag) => {
    setAccess((currentAccess) => {
      const nextAccess = new Set(currentAccess);

      if (nextAccess.has(accessTag)) {
        nextAccess.delete(accessTag);
      } else {
        nextAccess.add(accessTag);
      }

      return nextAccess;
    });
  };

  const saveShortcut = () => {
    const trimmedName = name.trim();
    const trimmedNameZh = nameZh.trim();
    const trimmedUrl = url.trim();

    setError(null);
    setStatus(null);

    if (!trimmedName && !trimmedNameZh) {
      setError(language === 'zh' ? '请至少填写中文名或英文名。' : 'Add at least a Chinese or English name.');
      return;
    }

    if (!trimmedUrl) {
      setError(language === 'zh' ? '请填写 URL。' : 'Add a URL.');
      return;
    }

    if (!isValidHttpUrl(trimmedUrl)) {
      setError(
        language === 'zh'
          ? 'URL 必须以 http:// 或 https:// 开头。'
          : 'URL must start with http:// or https://.',
      );
      return;
    }

    onSave(shortcut?.id ?? null, {
      name: trimmedName,
      ...(trimmedNameZh ? { nameZh: trimmedNameZh } : {}),
      url: trimmedUrl,
      ...(descriptionZh.trim() ? { descriptionZh: descriptionZh.trim() } : {}),
      market,
      category,
      tags: parseList(tags),
      ...(parseList(aliases).length > 0 ? { aliases: parseList(aliases) } : {}),
      priority,
      ...(access.size > 0 ? { access: [...access] } : {}),
      ...(noteZh.trim() ? { noteZh: noteZh.trim() } : {}),
    });
    setStatus(language === 'zh' ? '已保存快捷入口。' : 'Shortcut saved.');
    window.setTimeout(onClose, 450);
  };

  const marketOptions = markets.filter((option): option is Market => option !== '全部');

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-terminal-950/75 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={language === 'zh' ? '自定义快捷入口' : 'Custom shortcut'}
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-terminal-accent/20 bg-terminal-950/95 shadow-glow"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-terminal-accent">
              Custom Shortcuts
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {shortcut
                ? language === 'zh'
                  ? '编辑快捷入口'
                  : 'Edit Shortcut'
                : language === 'zh'
                  ? '添加快捷入口'
                  : 'Add Shortcut'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {language === 'zh'
                ? '添加你自己的网页入口；这里只保存 URL，不打开本地文件夹，也不执行命令。'
                : 'Add your own web shortcut. This stores URLs only; it does not open local folders or run commands.'}
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

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={fieldLabelClass}>{language === 'zh' ? '中文名' : 'Chinese Name'}</span>
              <input
                value={nameZh}
                onChange={(event) => setNameZh(event.target.value)}
                placeholder={language === 'zh' ? '例如：我的数据看板' : 'e.g. 我的数据看板'}
                className={`mt-2 ${textInputClass}`}
              />
            </label>
            <label>
              <span className={fieldLabelClass}>{language === 'zh' ? '英文名' : 'English Name'}</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. My Data Dashboard"
                className={`mt-2 ${textInputClass}`}
              />
            </label>
            <label className="sm:col-span-2">
              <span className={fieldLabelClass}>URL</span>
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com"
                className={`mt-2 ${textInputClass}`}
              />
            </label>
            <label>
              <span className={fieldLabelClass}>Market</span>
              <select
                value={market}
                onChange={(event) => setMarket(event.target.value as Market)}
                className={`mt-2 ${textInputClass}`}
              >
                {marketOptions.map((option) => (
                  <option key={option} value={option}>
                    {marketLabels[option][language]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={fieldLabelClass}>Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as Category)}
                className={`mt-2 ${textInputClass}`}
              >
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {categoryLabels[option][language]}
                  </option>
                ))}
              </select>
            </label>
            <label className="sm:col-span-2">
              <span className={fieldLabelClass}>
                {language === 'zh' ? '中文描述' : 'Chinese Description'}
              </span>
              <textarea
                value={descriptionZh}
                onChange={(event) => setDescriptionZh(event.target.value)}
                rows={3}
                placeholder={language === 'zh' ? '这个入口用于什么研究流程？' : 'What research flow is this for?'}
                className={`mt-2 ${textInputClass}`}
              />
            </label>
            <label className="sm:col-span-2">
              <span className={fieldLabelClass}>{language === 'zh' ? '中文备注' : 'Chinese Note'}</span>
              <textarea
                value={noteZh}
                onChange={(event) => setNoteZh(event.target.value)}
                rows={2}
                placeholder={language === 'zh' ? '登录、权限、使用提醒等' : 'Login, access, or usage notes'}
                className={`mt-2 ${textInputClass}`}
              />
            </label>
            <label>
              <span className={fieldLabelClass}>Tags</span>
              <input
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder={language === 'zh' ? '看板, 数据, 因子' : 'dashboard, data, factors'}
                className={`mt-2 ${textInputClass}`}
              />
            </label>
            <label>
              <span className={fieldLabelClass}>Aliases</span>
              <input
                value={aliases}
                onChange={(event) => setAliases(event.target.value)}
                placeholder={language === 'zh' ? 'mydash, datahub' : 'mydash, datahub'}
                className={`mt-2 ${textInputClass}`}
              />
            </label>
            <label>
              <span className={fieldLabelClass}>Priority</span>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as Priority)}
                className={`mt-2 ${textInputClass}`}
              >
                {(['core', 'useful', 'optional'] satisfies Priority[]).map((option) => (
                  <option key={option} value={option}>
                    {priorityLabels[option][language]}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <p className={fieldLabelClass}>Access</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {accessTags.map((accessTag) => {
                  const isSelected = access.has(accessTag);

                  return (
                    <button
                      key={accessTag}
                      type="button"
                      onClick={() => toggleAccess(accessTag)}
                      className={[
                        'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                        isSelected
                          ? 'border-terminal-gold/60 bg-terminal-gold/15 text-terminal-gold'
                          : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-terminal-gold/40 hover:text-terminal-gold',
                      ].join(' ')}
                    >
                      {accessLabels[accessTag][language]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}
          {status ? (
            <p className="mt-4 rounded-xl border border-terminal-accent/25 bg-terminal-accent/10 px-3 py-2 text-sm text-terminal-accent">
              {status}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-terminal-accent/40 hover:text-terminal-accent"
            >
              {language === 'zh' ? '取消' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={saveShortcut}
              className="rounded-xl border border-terminal-accent/40 bg-terminal-accent/10 px-4 py-3 text-sm font-semibold text-terminal-accent transition hover:bg-terminal-accent hover:text-terminal-950"
            >
              {language === 'zh' ? '保存快捷入口' : 'Save Shortcut'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
