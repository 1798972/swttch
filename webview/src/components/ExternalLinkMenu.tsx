import { useEffect, useSyncExternalStore } from 'react';
import toast from 'react-hot-toast';
import { getAdapter } from '@/adapters';
import { useTranslation } from '@/i18n';
import { externalLinkMenuStore } from '@/utils/externalLinkMenuStore';
import { Portal } from './Portal';

const MENU_WIDTH = 192;
const MENU_HEIGHT = 80;
const EDGE_GAP = 8;

const ITEM_CLASS =
  'block w-full px-3 py-2 text-start text-xs text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary';

/**
 * The menu a right click on an external link opens: the browser's own offers no
 * way to copy the link's address, which is the one thing a reply with a link in
 * it most often needs (the link text of `[text](url)` is not the address).
 * Mounted once; the document-level link listener decides when it opens.
 */
export function ExternalLinkMenu() {
  const { t } = useTranslation('chat');
  const open = useSyncExternalStore(externalLinkMenuStore.subscribe, externalLinkMenuStore.get);

  // Same ways out as every other menu in the app: a press elsewhere, Escape,
  // and anything that moves the page out from under the pointer (resize, wheel).
  useEffect(() => {
    if (!open) return;
    const close = () => externalLinkMenuStore.close();
    const onMouseDown = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('[data-external-link-menu]')) return;
      close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', close);
    window.addEventListener('wheel', close, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', close);
      window.removeEventListener('wheel', close);
    };
  }, [open]);

  if (!open) return null;

  const { url, x, y } = open;
  const left = Math.max(EDGE_GAP, Math.min(x, window.innerWidth - MENU_WIDTH - EDGE_GAP));
  const top = Math.max(EDGE_GAP, Math.min(y, window.innerHeight - MENU_HEIGHT - EDGE_GAP));

  const openInBrowser = () => {
    externalLinkMenuStore.close();
    getAdapter()
      .openUrl(url)
      .catch((err) => console.error('[ExternalLinkMenu] Failed to open external link:', err));
  };

  const copyAddress = () => {
    externalLinkMenuStore.close();
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success(t('externalLink.copyDone')))
      .catch(() => toast.error(t('externalLink.copyFailed')));
  };

  return (
    <Portal>
      <div
        role="menu"
        data-external-link-menu
        style={{ position: 'fixed', left, top, width: MENU_WIDTH }}
        className="z-[1000] overflow-hidden rounded-lg border border-border-default bg-surface-overlay py-1 shadow-lg"
      >
        <button type="button" role="menuitem" onClick={openInBrowser} className={ITEM_CLASS}>
          {t('externalLink.openInBrowser')}
        </button>
        <button type="button" role="menuitem" onClick={copyAddress} className={ITEM_CLASS}>
          {t('externalLink.copyAddress')}
        </button>
      </div>
    </Portal>
  );
}
