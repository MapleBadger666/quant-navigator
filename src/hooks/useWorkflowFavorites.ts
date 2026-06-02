import { useEffect, useMemo, useState } from 'react';
import { getWorkflowFavoriteIds, saveWorkflowFavoriteIds } from '../utils/storage';

const toWorkflowFavoriteSet = (ids: string[]) => new Set(ids.filter(Boolean));

export function useWorkflowFavorites() {
  const [workflowFavoriteIds, setWorkflowFavoriteIds] = useState<Set<string>>(() =>
    toWorkflowFavoriteSet(getWorkflowFavoriteIds()),
  );

  useEffect(() => {
    saveWorkflowFavoriteIds(workflowFavoriteIds);
  }, [workflowFavoriteIds]);

  return useMemo(
    () => ({
      workflowFavoriteIds,
      workflowFavoriteCount: workflowFavoriteIds.size,
      toggleWorkflowFavorite: (workflowId: string) => {
        setWorkflowFavoriteIds((currentIds) => {
          const nextIds = new Set(currentIds);

          if (nextIds.has(workflowId)) {
            nextIds.delete(workflowId);
          } else {
            nextIds.add(workflowId);
          }

          return nextIds;
        });
      },
      replaceWorkflowFavorites: (workflowIds: Iterable<string>) => {
        setWorkflowFavoriteIds(toWorkflowFavoriteSet([...workflowIds]));
      },
      clearWorkflowFavorites: () => setWorkflowFavoriteIds(new Set()),
    }),
    [workflowFavoriteIds],
  );
}
