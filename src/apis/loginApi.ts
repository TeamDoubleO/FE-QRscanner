import axios, { AxiosError } from "axios";
import axiosWithAuthorization from "../contexts/axiosWithAuthorization";

// 관리자 로그인
interface LoginRequest {
    username: string;
    password: string;
}

const axiosWithoutAuth = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_KEYWE_SERVER_URI,
    withCredentials: true,
});

export const adminLogin = async (payload: LoginRequest) => {
    try {
        const res = await axiosWithoutAuth.post('/auth/login', payload);

        const token = res.data.data?.accessToken;
    if (!token) {
        throw new Error('로그인 응답에 accessToken이 포함되어 있지 않습니다.');
    }

    localStorage.setItem('accessToken', token);

      return res.data.data;
  } catch (error) {
      const err = error as AxiosError<{ data?: { message?: string } }>;
      const message = err.response?.data?.data?.message ?? "관리자 로그인에 실패했습니다.";
      throw new Error(message);
  }
};

// 관리자 로그아웃
export const adminLogout = async () => {
    try {
      const res = await axiosWithAuthorization.post(`/auth/logout`);
      localStorage.removeItem('accessToken');
      return res.data.data;
    } catch (error) {
      const err = error as AxiosError<{ data?: { message?: string } }>;
      const message = err.response?.data?.data?.message ?? "관리자 로그아웃에 실패했습니다.";
      throw new Error(message);
    }
}
