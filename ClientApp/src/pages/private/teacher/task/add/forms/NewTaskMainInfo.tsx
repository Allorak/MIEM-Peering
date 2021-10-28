import { FC } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useForm, useController } from "react-hook-form";

import { FormReValidateMode, FormValidateMode } from "../../../../../../const/common";
import { INewTaskMainInfo } from "../../../../../../store/types";
import * as globalStyles from "../../../../../../const/styles";

import * as fields from "../formFields"
import { InputLabel } from "../../../../../../components/inputLabel";
import { SxProps, Theme } from "@mui/system";


interface IProps {
  onSubmit(mainInfo: INewTaskMainInfo): void,
}

export const NewTaskMainInfo: FC<IProps> = ({
  onSubmit
}) => {

  const { control, handleSubmit, formState } = useForm<INewTaskMainInfo>({
    mode: FormValidateMode,
    reValidateMode: FormReValidateMode,
    defaultValues: {
      title: "",
      description: ""
    }
  })

  const { field: titleProps } = useController({ control, ...fields.titleProps })
  const { field: descriptionProps } = useController({ control, ...fields.descriptionProps })

  return (
    <Box
      component={'form'}
      onSubmit={handleSubmit(onSubmit)}
      sx={styles.root}
    >
      <Box sx={globalStyles.formItemContainer}>
        <InputLabel
          title={'Название'}
          required
        />
        <TextField
          type={'text'}
          name={'title'}
          InputProps={titleProps}
          required
          autoComplete={'off'}
          {...(formState.errors.title !== undefined && { error: true, helperText: formState.errors.title.message })}
        />
      </Box>

      <Box sx={globalStyles.formItemContainer}>
        <InputLabel
          title={'Описание'}
        />
        <TextField
          type={'text'}
          name={'description'}
          InputProps={descriptionProps}
          rows={3}
          multiline
          autoComplete={'off'}
          {...(formState.errors.description !== undefined && { error: true, helperText: formState.errors.description.message })}
        />
      </Box>

      <Box sx={globalStyles.submitBtContainer}>
        <Button
          type='submit'
          variant='contained'
        >
          {"Далее"}
        </Button>
      </Box>
    </Box>
  )
}

const styles = {
  root: {
    backgroundColor: "common.white",
    padding: "10px",
    borderRadius: '4px',
    boxShadow: '0px 0px 3px 0px rgba(34, 60, 80, 0.2)'
  } as SxProps<Theme>
}
