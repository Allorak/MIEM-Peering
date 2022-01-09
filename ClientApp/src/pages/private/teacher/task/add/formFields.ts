import { RegisterOptions, UseControllerProps } from "react-hook-form";
import { InputRules } from "../../../../../const/inputRules";
import { INewTaskMainInfo, INewTextQuestion, INewShortTextQuestion, INewMultipleQuiestion, INewSelectRatingQuestion, INewTaskSettings } from "../../../../../store/types";

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

export const titleAuthorProps: UseControllerProps<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion, "title"> = ({
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

export const requiredProps: UseControllerProps<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion, "required"> = ({
  name: "required",
})

export const typeProps: UseControllerProps<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion, "type"> = ({
  name: "type",
})

export const responsesProps: UseControllerProps<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion, "responses"> = ({
  name: "responses",
})

export const descriptionRubricsProps: UseControllerProps<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion, "description"> = ({
  name: "description",
})

export const minAuthorProps: UseControllerProps<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion, "minValue"> = ({
  name: "minValue",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    }
  },
})

export const maxAuthorProps: UseControllerProps<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion, "maxValue"> = ({
  name: "maxValue",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    }
  },
})

export const dateRules: RegisterOptions = {
  required: {
    value: true,
    message: "Это обязательное поле"
  }
}

export const maxSubmissionProps: UseControllerProps<INewTaskSettings, "submissionsToCheck"> = ({
  name: "submissionsToCheck",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    },
    min: {
      value: 2,
      message: "Минимальное значение 2"
    }
  },
})

export const taskTypeProps: UseControllerProps<INewTaskSettings, "type"> = ({
  name: "type",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    }
  },
})