export interface FieldState {
  label: string;
  helperText?: string | undefined;
  error?: string | undefined;
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}
