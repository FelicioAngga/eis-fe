import { useMutation } from '@tanstack/react-query';
import { ResponseModel } from '../method';
import { AuthModel, RegisterModel } from "./models/AuthModel";
import { BASE_URL } from '../../utils/base-url';
import { UserModel } from '../../hooks/useAuth';

export const useLoginUser = () => {
  return useMutation({
    mutationFn: async (data: AuthModel): Promise<ResponseModel<UserModel | null>> => {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const responseJson = await response.json();
      if (response.status !== 200) {
        return {
          status: response.status,
          message: responseJson.error,
          result: null
        };
      }
      
      return {
        status: response.status,
        result: {...responseJson.data},
        message: "Berhasil",
      };
    },
  });
};

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: async (data: RegisterModel) => {
      const response = await fetch(`${BASE_URL}/accounts/registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  });
}
