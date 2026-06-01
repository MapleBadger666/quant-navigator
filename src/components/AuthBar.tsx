import { useState } from 'react';
import type { Language } from '../data/markets';

type AuthBarProps = {
  language: Language;
  userEmail?: string;
  authLoading: boolean;
  favoritesLoading: boolean;
  authError: string | null;
  favoritesError: string | null;
  favoritesMessage: string | null;
  isSupabaseConfigured: boolean;
  isRemoteFavorites: boolean;
  onSendMagicLink: (email: string) => Promise<boolean>;
  onSignOut: () => Promise<void>;
  onImportGuestFavorites: () => Promise<{ importedCount: number; success: boolean }>;
};

export function AuthBar({
  language,
  userEmail,
  authLoading,
  favoritesLoading,
  authError,
  favoritesError,
  favoritesMessage,
  isSupabaseConfigured,
  isRemoteFavorites,
  onSendMagicLink,
  onSignOut,
  onImportGuestFavorites,
}: AuthBarProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);

  const copy = {
    signIn: language === 'zh' ? '登录' : 'Sign in',
    signOut: language === 'zh' ? '退出登录' : 'Sign out',
    sendMagicLink: language === 'zh' ? '发送登录链接' : 'Send magic link',
    usingLocal: language === 'zh' ? '当前使用本地收藏' : 'Using local favorites',
    importLocal: language === 'zh' ? '导入本机收藏到账号' : 'Import local favorites',
    synced: language === 'zh' ? '收藏已同步' : 'Favorites synced',
    noLocalFavorites:
      language === 'zh' ? '没有可导入的本机收藏。' : 'No local favorites to import.',
    localModeTitle:
      language === 'zh' ? '当前使用本地收藏模式' : 'Using local favorites mode',
    localModeBody:
      language === 'zh'
        ? 'Supabase 未配置，收藏仅保存在当前浏览器。'
        : 'Supabase is not configured. Favorites are saved only in this browser.',
    localModeSetup:
      language === 'zh'
        ? '如需多用户收藏，请配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY。'
        : 'To enable multi-user favorites, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    supabaseMissing:
      language === 'zh'
        ? 'Supabase 未配置，当前使用本地收藏模式'
        : 'Supabase is not configured. Using local favorites.',
    linkSent:
      language === 'zh'
        ? '登录链接已发送，请检查邮箱。'
        : 'Magic link sent. Check your email.',
  };

  const handleSendMagicLink = async () => {
    setStatus(null);
    setIsSendingMagicLink(true);

    try {
      const sent = await onSendMagicLink(email.trim());

      if (sent) {
        setStatus(copy.linkSent);
        setEmail('');
      }
    } finally {
      setIsSendingMagicLink(false);
    }
  };

  const handleImport = async () => {
    setStatus(null);
    const result = await onImportGuestFavorites();

    if (result.success) {
      setStatus(copy.synced);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="w-full rounded-xl border border-terminal-gold/25 bg-terminal-gold/10 p-3 lg:w-auto lg:max-w-[34rem]">
        <p className="text-sm font-semibold text-terminal-gold">{copy.localModeTitle}</p>
        <p className="mt-1 text-xs leading-5 text-slate-300">{copy.localModeBody}</p>
        <p className="mt-1 font-mono text-[11px] leading-5 text-slate-500">{copy.localModeSetup}</p>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="flex w-full flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 lg:w-auto lg:min-w-[30rem]">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-end">
          <div className="min-w-[7rem]">
            <p className="text-xs font-medium text-terminal-accent">{copy.signIn}</p>
            <p className="text-[11px] text-slate-500">{copy.usingLocal}</p>
          </div>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@example.com"
            type="email"
            disabled={authLoading || isSendingMagicLink}
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-terminal-950/70 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-terminal-accent/60 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSendMagicLink}
            disabled={!email.trim() || authLoading || isSendingMagicLink}
            className="rounded-lg border border-terminal-accent/35 bg-terminal-accent/10 px-3 py-2 text-xs font-semibold text-terminal-accent transition hover:bg-terminal-accent hover:text-terminal-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSendingMagicLink
              ? language === 'zh'
                ? '发送中…'
                : 'Sending...'
              : copy.sendMagicLink}
          </button>
        </div>

        {status || authError ? (
          <p className="text-xs leading-5 text-slate-400">{authError ?? status}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 lg:w-auto lg:min-w-[30rem]">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-end">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-terminal-accent">
            {isRemoteFavorites ? copy.synced : copy.usingLocal}
          </p>
          <p className="truncate text-sm text-white">{userEmail}</p>
        </div>
        <button
          type="button"
          onClick={handleImport}
          disabled={favoritesLoading}
          className="rounded-lg border border-terminal-accent/35 bg-terminal-accent/10 px-3 py-2 text-xs font-semibold text-terminal-accent transition hover:bg-terminal-accent hover:text-terminal-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copy.importLocal}
        </button>
        <button
          type="button"
          onClick={() => void onSignOut()}
          disabled={authLoading}
          className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copy.signOut}
        </button>
      </div>

      {status || favoritesMessage || authError || favoritesError ? (
        <p className="text-xs leading-5 text-slate-400">
          {authError ??
            favoritesError ??
            status ??
            (favoritesMessage === 'favorites_synced'
              ? copy.synced
              : favoritesMessage === 'no_local_favorites'
                ? copy.noLocalFavorites
                : null)}
        </p>
      ) : null}
    </div>
  );
}
