
import { useAuth } from "./useAuth";

interface InputOptions {
  page?: number;
  limit?: number;
  sortColumn?: string;
  sortOrder?: string;
  [key: string]: string | number | boolean | undefined;
}

interface ApiCallConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  inputOptions?: InputOptions;
  isPublic?: boolean;
}

export const useApiCall = <T>(defaultConfig: ApiCallConfig) => {
  const { getUser } = useAuth();
  return async (config?: Partial<ApiCallConfig>): Promise<T> => {
    const finalConfig = { ...defaultConfig, ...config };
    const { inputOptions, url } = finalConfig;
    if (inputOptions) {
      const {
        page = 0,
        limit = 10,
        sortOrder = "asc",
        sortColumn = "id",
      } = inputOptions;

      const queryParamsObject = Object.entries({
        page,
        limit,
        sortOrder,
        sortColumn,
        ...inputOptions,
      }).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as Record<string, string>);

      const queryParams = new URLSearchParams(queryParamsObject).toString();
      finalConfig.url = `${url}?${queryParams}`;
    }

    const makeApiCall = async (token: string): Promise<Response> => {
      const headers = {
        "content-type": "application/json",
        ...(defaultConfig.isPublic ? {} : { 
          Authorization: `Bearer ${token}`,
        }),
        ...finalConfig.headers,
      };

      return fetch(finalConfig.url, {
        method: finalConfig.method,
        headers,
        body: finalConfig.body ? JSON.stringify(finalConfig.body) : undefined,
      });
    };

    let token = (getUser() as any)?.token || "";
    let response = await makeApiCall(token);

    const data = await response.json();
    return data as T;
  };
};
