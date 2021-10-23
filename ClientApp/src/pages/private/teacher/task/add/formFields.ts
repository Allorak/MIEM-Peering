import { UseControllerProps } from "react-hook-form";
import { InputRules } from "../../../../../const/inputRules";
import { INewTaskMainInfo, IParentQuestionRubric, ITextQuestion, IShortTextQuestion, IMultipleQuiestion, ISelectRatingQuestion } from "../../../../../store/types";

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

export const titleAuthorProps: UseControllerProps<ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion, "title"> = ({
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

export const requiredProps: UseControllerProps<ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion, "required"> = ({
  name: "required",
})

export const typeProps: UseControllerProps<ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion, "type"> = ({
  name: "type",
})

export const responsesProps: UseControllerProps<ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion, "responses"> = ({
  name: "responses",
})

export const minAuthorProps: UseControllerProps<ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion, "minValue"> = ({
  name: "minValue",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    }
  },
})

export const maxAuthorProps: UseControllerProps<ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion, "maxValue"> = ({
  name: "maxValue",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    }
  },
})