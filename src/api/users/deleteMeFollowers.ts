import BASE_URL from "@/constants/baseurl";

export async function deleteMyFollowers(id: string): Promise<Response> {
  const response = await BASE_URL.delete(`/users/me/followers/${id}`);
  return response.data;
}
