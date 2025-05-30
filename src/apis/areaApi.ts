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

// 건물 별 구역 조회
export const fetchZoneList = async (buildingId: string, page: number, keyword: string = "") => {
  try {
    const res = await axiosWithAuthorization.get(`/hospitals/${buildingId}/areas/paged`, {
       params: {
        page,
        ...(keyword ? { keyword } : {}),
      },
    });
    console.log("건물 별 구역 조회:", res.data);
    return res.data.data;
  } catch (error) {
    console.log("건물 별 구역 조회 오류:", error);
    throw error;
  }
};