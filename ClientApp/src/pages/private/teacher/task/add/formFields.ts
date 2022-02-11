import { RegisterOptions, UseControllerProps } from "react-hook-form";
import { InputRules } from "../../../../../const/inputRules";
import { INewTaskMainInfo, INewTextQuestion, INewShortTextQuestion, INewMultipleQuiestion, INewSelectRatingQuestion, INewTaskSettings, INewUploadFileQuestion } from "../../../../../store/types";

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

export const titleAuthorProps: UseControllerProps<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion | INewUploadFileQuestion, "title"> = ({
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

export const requiredProps: UseControllerProps<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion | INewUploadFileQuestion, "required"> = ({
  name: "required",
})

export const typeProps: UseControllerProps<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion | INewUploadFileQuestion, "type"> = ({
  name: "type",
})

export const responsesProps: UseControllerProps<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion | INewUploadFileQuestion, "responses"> = ({
  name: "responses",
})

export const descriptionRubricsProps: UseControllerProps<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion | INewUploadFileQuestion, "description"> = ({
  name: "description",
})

export const minAuthorProps: UseControllerProps<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion | INewUploadFileQuestion, "minValue"> = ({
  name: "minValue",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    }
  },
})

export const maxAuthorProps: UseControllerProps<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion | INewUploadFileQuestion, "maxValue"> = ({
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

export const submissionWeightProps: UseControllerProps<INewTaskSettings, "submissionWeight"> = ({
  name: "submissionWeight",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    },
    min: {
      value: 0,
      message: "Минимальное значение 0"
    },
    max: {
      value: 100,
      message: "Максимальное значение 100"
    }
  },
})

export const reviewWeightProps: UseControllerProps<INewTaskSettings, "reviewWeight"> = ({
  name: "reviewWeight",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    },
    min: {
      value: 0,
      message: "Минимальное значение 0"
    },
    max: {
      value: 100,
      message: "Максимальное значение 100"
    }
  },
})

export const goodCoefficientBonusProps: UseControllerProps<INewTaskSettings, "goodConfidenceBonus"> = ({
  name: "goodConfidenceBonus",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    },
    min: {
      value: 0,
      message: "Минимальное значение 0"
    },
    max: {
      value: 2,
      message: "Максимальное значение 2"
    }
  },
})

export const badCoefficientPenaltyProps: UseControllerProps<INewTaskSettings, "badConfidencePenalty"> = ({
  name: "badConfidencePenalty",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    },
    max: {
      value: 0,
      message: "Максимальное значение 0"
    },
    min: {
      value: -2,
      message: "Минимальное значение -2"
    }
  },
})

export const taskTypeProps: UseControllerProps<INewTaskSettings, "reviewType"> = ({
  name: "reviewType",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    }
  },
})