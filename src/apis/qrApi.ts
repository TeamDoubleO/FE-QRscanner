import axiosWithAuthorization from "../contexts/axiosWithAuthorization";

// 출입 검증
export const verifyQR = async (allowedAreas: string[], deviceAreaCode: string) => {
  try {
    const payload = {
      deviceAreaCode,
      allowedAreas,
    };

    console.log("전송할 payload:", payload);
    const res = await axiosWithAuthorization.post(`/entrances/verify`, payload);
    console.log("출입 검증:", res.data);
    return res.data.data;
  } catch (error) {
    console.error("출입 검증 오류:", error);
    throw error;
  }
};