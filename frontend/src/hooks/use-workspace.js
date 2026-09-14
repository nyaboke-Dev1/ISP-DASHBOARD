import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchWorkspace, workspaceQueryKey } from "@/lib/isp";
import { useAuth } from "@/hooks/use-auth";

export function useWorkspace() {
  return useQuery({
    queryKey: workspaceQueryKey,
    queryFn: fetchWorkspace,
  });
}

export function useActorName() {
  const { user } = useAuth();

  return (
    user?.fullName ||
    user?.full_name ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Staff"
  );
}

export function useWorkspaceAction(action, successMessage) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: action,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspaceQueryKey,
      });

      toast.success(successMessage);
    },

    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}
