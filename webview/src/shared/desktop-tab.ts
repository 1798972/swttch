/** Commands delegated to the embedded application by its owning Desktop tab. */
export const DESKTOP_TAB_ACTION = 'swttch:tab-action';
export const DESKTOP_TAB_RESULT = 'swttch:tab-action-result';
export type DesktopTabAction = 'scheduled-messages' | 'background-tasks' | 'tunnel' | 'assets';
