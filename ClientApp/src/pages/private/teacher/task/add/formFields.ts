import { UseControllerProps } from "react-hook-form";
import { InputRules } from "../../../../../const/inputRules";
import { INewTaskMainInfo } from "../../../../../store/types";

export const titleProps: UseControllerProps<INewTaskMainInfo, "title"> = ({
  name: "title",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    },
    maxLength: {
      value: InputRules.MaxLength.title,
      message: `Количество символов не должно превышать ${InputRules.MaxLength.title}.`
    }
  },
})

export const descriptionProps: UseControllerProps<INewTaskMainInfo, 'description'> = ({
  name: "description",
  rules: {
    maxLength: {
      value: InputRules.MaxLength.Description3000,
      message: `Количество символов не должно превышать ${InputRules.MaxLength.Description3000}.`
    }
  },
})