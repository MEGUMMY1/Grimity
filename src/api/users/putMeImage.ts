import axiosInstance from "@/constants/baseurl";

export async function putProfileImage(imageName: string): Promise<Response> {
  const response = await axiosInstance.put("/users/me/image", {
    imageName,
  });
  return response.data;
}

export async function putBackgroundImage(imageName: string): Promise<Response> {
  const response = await axiosInstance.put("/users/me/background", {
    imageName,
  });
  return response.data;
}
