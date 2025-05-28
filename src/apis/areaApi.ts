import axiosWithAuthorization from "../contexts/axiosWithAuthorization";

// 병원 별 건물 조회
export const fetchBuildingList = async (page: number, keyword: string = "") => {
  try {
    const res = await axiosWithAuthorization.get(`/hospitals/buildings/paged`, {
       params: {
        page,
        ...(keyword ? { keyword } : {}),
      },
    });
    console.log("병원 별 건물 조회:", res.data);
    return res.data.data;
  } catch (error) {
    console.log("병원 별 건물 조회 오류:", error);
    throw error;
  }
};