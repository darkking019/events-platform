import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useMemo } from "react";

export const useApi = () => {
  const { token, logout } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    instance.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) logout();
        return Promise.reject(error);
      }
    );

    return instance;
  }, [token, logout]);

  return api;
};
