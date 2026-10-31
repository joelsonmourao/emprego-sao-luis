import { getEditorialPortalMode, type PortalModeState } from "./portal-modes";

export async function jobBoardPublicGate(): Promise<{ paused: boolean; mode: PortalModeState }> {
  const mode = await getEditorialPortalMode();
  return { paused: mode.enabled, mode };
}
