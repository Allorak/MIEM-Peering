import { FC, useCallback, useMemo, useState } from "react"

import { Theme } from "@emotion/react"
import { Box, Typography, Button, TextField, Tooltip, IconButton, InputAdornment, ToggleButtonGroup, ToggleButton, useMediaQuery } from "@mui/material"
import { SxProps } from "@mui/system"

import { FormValidateMode, FormReValidateMode } from "../../../const/common"
import { Controller, RegisterOptions, useForm } from "react-hook-form"

import { IUserRegistration, IRole, IError } from "../../../store/types"

import { emailProps, surnameProps, firstnameProps, passwordProps } from "./formFields"

import { VisibilityOff, Visibility } from "@mui/icons-material"

import { FileInput } from "./FileInput"
import { InputLabel } from "../../../components/inputLabel"
import { TeacherRoleIcon } from "../../../components/icons/TeacherRoleIcon"
import { StudentRoleIcon } from "../../../components/icons/StudentRoleIcon"

import * as globalStyles from "../../../const/styles";

interface IProps {
  onRequest: (formResponses: IUserRegistration) => void
  error: IError | undefined
}

export const RegistrationForm: FC<IProps> = ({ onRequest, error }) => {
  const [isShowPass, setShowPass] = useState(false)
  const { control, formState, handleSubmit, watch, setValue } = useForm<IUserRegistration>({
    mode: FormValidateMode,
    reValidateMode: FormReValidateMode,
    defaultValues: {
      email: "",
      firstname: "",
      surname: "",
      password: "",
      confirmPassword: "",
      role: IRole.teacher
    }
  })

  const imgFile = watch("img")
  const currentPass = watch("password")
  const currentRole = watch("role")

  const handleImageChange = useCallback((img?: File) => {
    setValue("img", img)
  }, [])

  const handleRoleChange = useCallback((event: React.MouseEvent<HTMLElement>,
    role: IRole.teacher | IRole.student,) => {
    if (role !== null) {
      setValue("role", role)
    }
  }, [])

  const handleClickShowPassword = useCallback(() => {
    setShowPass(prev => !prev)
  }, [])

  const handleMouseDownPassword = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }, [])

  const confirmPassRules = useMemo((): RegisterOptions => ({
    required: {
      value: true,
      message: "Это обязательное поле"
    },

    validate: (value) => value && currentPass && currentPass === value

  }), [currentPass])

  const isMobile = useMediaQuery('(max-width:767px)')

  return (
    <Box sx={styles.container}>
      <Box
        component={'form'}
        width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        gap={"15px"}
        textAlign={"start"}
        onSubmit={handleSubmit(onRequest)}
      >
        <Box>
          <FileInput
            value={imgFile}
            onChange={handleImageChange}
          />
        </Box>

        <Box>
          <InputLabel title="Имя" required />

          <Controller
            name={"firstname"}
            control={control}
            rules={firstnameProps.rules}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                {...rest}
                variant='outlined'
                placeholder={'Иван'}
                required
                {...(formState.errors.firstname !== undefined && { error: true, helperText: formState.errors.firstname.message })}
              />
            )}
          />
        </Box>

        <Box>
          <InputLabel title="Фамилия" required />

          <Controller
            name={"surname"}
            control={control}
            rules={surnameProps.rules}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                {...rest}
                variant='outlined'
                placeholder={'Иванов'}
                required
                {...(formState.errors.surname !== undefined && { error: true, helperText: formState.errors.surname.message })}
              />
            )}
          />
        </Box>

        <Box>
          <Box>
            <InputLabel title="Выберите свою роль" required />
          </Box>

          <Controller
            name={"role"}
            control={control}
            render={({ field: { ref, ...rest } }) => (
              <ToggleButtonGroup
                {...rest}
                orientation={isMobile ? 'vertical' : 'horizontal'}
                color="primary"
                fullWidth={true}
                value={currentRole}
                exclusive
                onChange={handleRoleChange}
              >
                <ToggleButton
                  sx={styles.roleInput}
                  color="primary"
                  value={IRole.teacher}
                >
                  <Tooltip
                    title="Вы сможете создавать курсы, а также пиринговые задания к ним"
                    arrow
                  >
                    <Box sx={styles.roleWrapper}>
                      <Box sx={styles.roleIcon}>
                        <TeacherRoleIcon />
                      </Box>
                      <Typography
                        variant={'body1'}
                        color="inherit">
                        {'Преподаватель'}
                      </Typography>
                    </Box>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton
                  sx={styles.roleInput}
                  value={IRole.student}
                >
                  <Tooltip
                    title="Вы сможете присоединиться к курсу и выполнять пиринговые задания"
                    arrow
                  >
                    <Box sx={styles.roleWrapper}>
                      <Box sx={styles.roleIcon}>
                        <StudentRoleIcon />
                      </Box>
                      <Typography
                        variant={'body1'}
                        color="inherit"
                      >
                        {'Студент'}
                      </Typography>
                    </Box>
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Box>

        <Box>
          <InputLabel title="Электронная почта" required />

          <Controller
            name={"email"}
            control={control}
            rules={emailProps.rules}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                {...rest}
                type={"email"}
                required
                autoComplete={'off'}
                placeholder={'example@example.ru'}
                {...(formState.errors.email !== undefined && { error: true, helperText: formState.errors.email.message })}
              />
            )}
          />
        </Box>

        <Box>
          <InputLabel title="Пароль" required />

          <Controller
            name={"password"}
            control={control}
            rules={passwordProps.rules}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                {...rest}
                variant='outlined'
                placeholder={"Придумайте пароль"}
                type={isShowPass ? "text" : "password"}
                required
                autoComplete={'new-password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Показать пароль"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {isShowPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...(formState.errors.password !== undefined && { error: true, helperText: formState.errors.password.message })}
              />
            )}
          />
        </Box>

        <Box>
          <InputLabel title="Повторите пароль" required />

          <Controller
            name={"confirmPassword"}
            control={control}
            rules={confirmPassRules}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                {...rest}
                variant='outlined'
                placeholder={"Подтвердите пароль"}
                type={"password"}
                required
                autoComplete={'new-password'}
                {...(formState.errors.confirmPassword !== undefined && { error: true, helperText: formState.errors.confirmPassword.message ? formState.errors.confirmPassword.message : "Необходимо ввести пароль еще раз" })}
              />
            )}
          />
        </Box>

        <Box sx={{ ...globalStyles.submitBtContainer, mt: '20px' }}>
          {error && (
            <Typography
              flex={'1 1 100%'}
              color={'error.main'}
            >
              {error.message}
            </Typography>
          )}

          <Button
            type='submit'
            variant='contained'
          >
            {"Зарегистрироваться"}
          </Button>
        </Box>
      </Box >
    </Box >
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    textAlign: 'center',
  } as SxProps<Theme>,
  roleIcon: {
    flexShrink: '0',
    color: 'palette.fill.grey',
    display: 'inline-block',
    width: '30px',
    height: '30px',
    mr: '10px'
  } as SxProps<Theme>,
  roleInput: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: '0',
    '@media (min-width: 768px)': {
      width: '50%',
    }
  } as SxProps<Theme>,
  roleWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px',
    width: '100%',
  } as SxProps<Theme>,
}