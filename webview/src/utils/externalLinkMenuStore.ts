/** Where the link menu is open: the address under the pointer and the pointer's position. */
export interface ExternalLinkMenuState {
  url: string;
  x: number;
  y: number;
}

let state: ExternalLinkMenuState | null = null;
const listeners = new Set<() => void>();

function set(next: ExternalLinkMenuState | null): void {
  state = next;
  listeners.forEach((listener) => listener());
}

/**
 * The one link menu the page can show. A right click on a link lives in the
 * document-level listener, outside React, and the menu itself is a component:
 * this is the small shared state between the two.
 */
export const externalLinkMenuStore = {
  get: (): ExternalLinkMenuState | null => state,
  open: (next: ExternalLinkMenuState): void => set(next),
  close: (): void => set(null),
  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
