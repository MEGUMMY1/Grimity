import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";
import { MyLikeFeedsResponse } from "@grimity/dto";

export interface MySaveListRequest {
  size?: number;
  cursor?: string;
}

export async function getMySaveList({
  size,
  cursor,
}: MySaveListRequest): Promise<MyLikeFeedsResponse> {
  try {
    const response = await axiosInstance.get("/users/me/save-feeds", { params: { size, cursor } });

    return response.data;
  } catch (error) {
    console.error("Error fetching MySaveList:", error);
    throw new Error("Failed to fetch MySaveList");
  }
}

export function useMySaveList({ size }: MySaveListRequest) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useInfiniteQuery<MyLikeFeedsResponse>(
    "MySaveList",
    ({ pageParam = null }) => getMySaveList({ cursor: pageParam }),
    {
      enabled: Boolean(accessToken),
      getNextPageParam: (lastPage) => lastPage.nextCursor || null,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
