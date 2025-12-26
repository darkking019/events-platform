import { useAuth } from "../context/AuthContext";
import axios from "axios";

export const useApi = () => {
  const { token } = useAuth();

  const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  return api;
};
