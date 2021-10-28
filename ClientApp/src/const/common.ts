import { Mode } from "react-hook-form";

export const FormValidateMode: Mode = "onSubmit" && "onBlur"
export const FormReValidateMode: Exclude<Mode, 'onTouched' | 'all'> = "onSubmit" && "onBlur"
