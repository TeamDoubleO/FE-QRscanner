import axios from 'axios';
import {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig, 
} from 'axios';

const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

const axiosWithAuthorization: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_KEYWE_SERVER_URI,
  withCredentials: true,
});

const axiosWithoutAuth: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_KEYWE_SERVER_URI,
  withCredentials: true,
});

// 요청 인터셉터
axiosWithAuthorization.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
axiosWithAuthorization.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    console.log(`응답 에러 발생 [${error.response?.status}] 요청 경로: ${originalRequest.url}`);

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/auth/reissue") {
      originalRequest._retry = true;
      console.warn("401 에러 발생하여 엑세스 토큰 재발급 시도");

      try {
        const accessToken = getAccessToken(); 

        const res = await axiosWithoutAuth.post(
          "/auth/reissue",
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`, 
            },
          }
        );

        const newAccessToken = res.headers["authorization"]?.replace("Bearer ", "");

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          console.info("엑세스 토큰 재발급 성공 및 재요청 수행");
        
          return axiosWithAuthorization.request(originalRequest);
        }
        // 엑세스 토큰을 받지 못했을 경우
        return Promise.reject(new Error("새로운 accessToken을 받지 못했습니다."));
      } catch (refreshError) {
        console.error("엑세스 토큰 재발급 실패:", refreshError);
        localStorage.clear(); 
        sessionStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosWithAuthorization;