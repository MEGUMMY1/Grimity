export interface TextFieldProps {
  placeholder: string;
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  maxLength?: number;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  color?: "GRAY" | "GREEN";
  required?: boolean;
  isUpload?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
