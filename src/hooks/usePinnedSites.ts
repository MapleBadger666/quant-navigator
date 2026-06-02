import { useEffect, useMemo, useState } from 'react';
import { getPinnedSiteIds, savePinnedSiteIds } from '../utils/storage';

const toPinnedSet = (ids: string[]) => new Set(ids.filter(Boolean));

export function usePinnedSites() {
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(() => toPinnedSet(getPinnedSiteIds()));

  useEffect(() => {
    savePinnedSiteIds(pinnedIds);
  }, [pinnedIds]);

  return useMemo(
    () => ({
      pinnedIds,
      pinnedCount: pinnedIds.size,
      togglePinned: (siteId: string) => {
        setPinnedIds((currentIds) => {
          const nextIds = new Set(currentIds);

          if (nextIds.has(siteId)) {
            nextIds.delete(siteId);
          } else {
            nextIds.add(siteId);
          }

          return nextIds;
        });
      },
      removePinned: (siteId: string) => {
        setPinnedIds((currentIds) => {
          const nextIds = new Set(currentIds);
          nextIds.delete(siteId);
          return nextIds;
        });
      },
      replacePinned: (siteIds: Iterable<string>) => {
        setPinnedIds(toPinnedSet([...siteIds]));
      },
      clearPinned: () => setPinnedIds(new Set()),
    }),
    [pinnedIds],
  );
}
