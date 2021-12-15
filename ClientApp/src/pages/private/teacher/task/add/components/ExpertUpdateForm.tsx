import { Box, Button, TextField, Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import { FC, SetStateAction, useCallback, useEffect } from "react";
import { useController, useForm } from "react-hook-form";
import { InputLabel } from "../../../../../../components/inputLabel";
import { Popup } from "../../../../../../components/popup";
import { FormValidateMode, FormReValidateMode } from "../../../../../../const/common";

interface IProps {
  popupStatus: boolean,
  onSubmit: (email: string) => void
  expert?: string
  onRemove: () => void
  onCloseHandler(value: SetStateAction<boolean>): void
}

interface IExpertForm {
  email: string
}

export const ExpertUpdateForm: FC<IProps> = ({
  popupStatus,
  expert,
  onSubmit,
  onRemove,
  onCloseHandler
}) => {

  const { control, formState, handleSubmit, reset } = useForm<IExpertForm>({
    mode: FormValidateMode,
    reValidateMode: FormReValidateMode,
    defaultValues: {
      email: expert ?? ""
    }
  })

  useEffect(() => {
    reset({ email: expert })
  }, [popupStatus, expert])

  const { field: emailProps } = useController({
    control,
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
    }
  })

  const handleSubmitRequest = useCallback((expertItem: IExpertForm) => {
    const expertEmail = expertItem.email
    if (expertEmail) onSubmit(expertEmail)
  }, [])

  console.log(expert ? 'Назначение эксперта' : 'Редактирование')

  return (
    <Popup
      title={expert ? 'Редактирование' : 'Назначение эксперта'}
      open={popupStatus}
      onCloseHandler={onCloseHandler}
    >
      <Box
        component={"form"}
        sx={styles.formContainer}
        onSubmit={handleSubmit(handleSubmitRequest)}
      >
        <InputLabel
          title={'Email'}
          required
        />

        <TextField
          variant='outlined'
          required
          inputProps={emailProps}
          fullWidth
          {...(formState.errors.email && { error: true, helperText: formState.errors.email.message })}
        />
        <Box>
          {expert && (
            <Button
              type={"button"}
              variant={"text"}
              size={"small"}
              color={"error"}
              onClick={() => onRemove()}
            >
              {"Удалить"}
            </Button>
          )}

          <Button
            type={"submit"}
            variant={"contained"}
            color={"primary"}
            size={"small"}
          >
            {expert ? "Изменить" : "Добавить"}
          </Button>
        </Box>
      </Box>
    </Popup>
  )
}

const styles = {
  formContainer: {
    maxWidth: "250px",
  } as SxProps<Theme>
}