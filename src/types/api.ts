export interface ApiError {
  field?: string;
  message: string;
}

export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
  errors: ApiError[] | null;
}
