import { RegisterOptions, UseControllerProps } from "react-hook-form";
import { InputRules } from "../../../../../const/inputRules";
import { ICourses, IParentQuestionRubric, ITextQuestion, IShortTextQuestion, IMultipleQuiestion, ISelectRatingQuestion, INewTaskSettings } from "../../../../../store/types";

interface ICourseItem extends Omit<ICourses, 'id' | 'adminName' | 'adminImageUrl'> { }

export const nameProps: UseControllerProps<ICourseItem, "name"> = ({
  name: "name",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    },
    maxLength: {
      value: 150,
      message: `Количество символов не должно превышать ${150}.`
    }
  },
})

export const subjectProps: UseControllerProps<ICourseItem, "subject"> = ({
  name: "subject",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    },
    maxLength: {
      value: 80,
      message: `Количество символов не должно превышать ${80}.`
    }
  },
})

export const descriptionProps: UseControllerProps<ICourseItem, "description"> = ({
  name: "description",
  rules: {
    maxLength: {
      value: 3000,
      message: `Количество символов не должно превышать ${3000}.`
    }
  },
})

export const enableProps: UseControllerProps<ICourseItem, "settings.enableCode"> = ({
  name: "settings.enableCode",
})