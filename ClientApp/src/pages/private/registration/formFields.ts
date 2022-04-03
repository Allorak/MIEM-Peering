import { UseControllerProps } from "react-hook-form";
import { IUserRegistration } from "../../../store/types";

export const emailProps: UseControllerProps<IUserRegistration, "email"> = ({
  name: "email",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    },
    pattern: {
      value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: "Неверный формат"
    }
  },
})

export const passwordProps: UseControllerProps<IUserRegistration, "password"> = ({
  name: "password",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      message: "Должен содержать цифру, строчную и прописную латинскую букву"
    },
    minLength: {
      value: 8,
      message: 'Пароль не должен содержать меньше 8 символов'
    }
  }
})

export const firstnameProps: UseControllerProps<IUserRegistration, "firstname"> = ({
  name: "firstname",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    }
  },
})

export const surnameProps: UseControllerProps<IUserRegistration, "surname"> = ({
  name: "surname",
  rules: {
    required: {
      value: true,
      message: "Это обязательное поле"
    }
  },
})