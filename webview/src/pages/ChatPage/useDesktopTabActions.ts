import { useEffect } from 'react';
import { DESKTOP_TAB_ACTION, DESKTOP_TAB_RESULT, type DesktopTabAction } from '@/shared/desktop-tab';
import { DockItemId } from '@/types/settings';
import { useDockItemActions } from './SessionHeader/dock/useDockItemActions';

const items: Record<DesktopTabAction, DockItemId> = {
  'scheduled-messages': DockItemId.SCHEDULED_MESSAGES,
  'background-tasks': DockItemId.BACKGROUND_TASKS,
  tunnel: DockItemId.TUNNEL,
  assets: DockItemId.ASSETS,
};

/** Kept on the chat page so host commands work with the visual header hidden. */
export function useDesktopTabActions() {
  const actions = useDockItemActions();
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (window.parent === window || event.source !== window.parent || event.origin !== window.location.origin) return;
      const message = event.data;
      if (message?.type !== DESKTOP_TAB_ACTION || typeof message.id !== 'string' || typeof message.action !== 'string' || !Object.prototype.hasOwnProperty.call(items, message.action)) return;
      const activate = actions[items[message.action as DesktopTabAction]];
      try {
        if (!activate) throw new Error('Unavailable tab action');
        activate();
        window.parent.postMessage({ type: DESKTOP_TAB_RESULT, id: message.id, ok: true }, event.origin);
      } catch {
        window.parent.postMessage({ type: DESKTOP_TAB_RESULT, id: message.id, ok: false }, event.origin);
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [actions]);
}
