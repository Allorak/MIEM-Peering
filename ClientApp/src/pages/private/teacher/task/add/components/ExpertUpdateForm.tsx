import { FC, SetStateAction, useCallback, useEffect } from "react";
import { Box, Button, IconButton, TextField, Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import { useController, useForm } from "react-hook-form";
import DeleteIcon from '@mui/icons-material/Delete';

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
  }, [expert, onSubmit])

  return (
    <Popup
      PaperProps={{ sx: styles.dialogWrapper }}
      title={expert ? 'Редактирование' : 'Назначение эксперта'}
      open={popupStatus}
      onCloseHandler={onCloseHandler}
    >
      <Box
        component={"form"}
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

        <Box
          sx={{
            ...styles.actionBtContainer,
            justifyContent: expert ? "space-between" : "flex-end"
          }}
        >
          {expert && (
            <IconButton
              onClick={() => onRemove()}
              sx={styles.deleteBt}
            >
              <DeleteIcon sx={{ color: "error.main" }} />
            </IconButton>
          )}

          <Button
            type={"submit"}
            variant={"contained"}
            color={"primary"}
            size={"small"}
            sx={styles.submitBt}
          >
            {expert ? "Изменить" : "Добавить"}
          </Button>
        </Box>
      </Box>
    </Popup>
  )
}

const styles = {
  submitBt: {
    padding: "5px 8px"
  } as SxProps<Theme>,
  dialogWrapper: {
    flex: '0 1 400px'
  } as SxProps<Theme>,
  actionBtContainer: {
    margin: "15px 0px 0px 0px",
    display: "flex",
    width: "100%",
  } as SxProps<Theme>,
  deleteBt: {
    borderRadius: "3px",
    height: "36px",
    width: "36px",
  } as SxProps<Theme>,
}