import { FC, useCallback } from "react";
import { useController, useForm } from "react-hook-form";
import { Button, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";

import { InputLabel } from "../../../../../components/inputLabel";

import { FormReValidateMode, FormValidateMode } from "../../../../../const/common";

import { ICourses } from "../../../../../store/types";

import * as fields from "./formFields"
import * as globalStyles from "../../../../../const/styles";

interface IProps {
    editCourse?: ICourses,
    onRequest: (course: ICourses) => void
}
interface ICourseItem extends Omit<ICourses, 'id' | 'adminName' | 'adminImageUrl'> { }
interface IErrors {
    name: string
    subject: string
}

export const AddCourseForm: FC<IProps> = ({ editCourse, onRequest }) => {
    const defaultValues: ICourseItem = editCourse ? {
        name: editCourse.name,
        subject: editCourse.subject,
        description: editCourse.description,
        settings: editCourse.settings
    } : {
        name: '',
        subject: '',
        description: ''
    }

    const { control, formState, setValue, getValues, handleSubmit } = useForm<ICourseItem>({
        mode: FormValidateMode,
        reValidateMode: FormReValidateMode,
        defaultValues: {
            ...defaultValues
        }
    })

    const { field: nameProps } = useController({ control, ...fields.nameProps })
    const { field: descriptionProps } = useController({ control, ...fields.descriptionProps })
    const { field: subjectProps } = useController({ control, ...fields.subjectProps })
    const { field: enableProps } = useController({ control, ...fields.enableProps })
    const codeSettingsProps = getValues('settings')
    const codeProps = getValues('settings.code')

    const handleCourseCodeStatusChange = useCallback((value: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = value.target.checked

        if (editCourse && editCourse.settings && isChecked !== enableProps.value) {
            setValue('settings',
                {
                    enableCode: isChecked,
                    ...(isChecked === true && editCourse.settings.enableCode && { code: editCourse.settings.code })
                }
            )

        }
    }, [editCourse, enableProps])

    return (
        <Box
            sx={styles.root}
            component={'form'}
            onSubmit={handleSubmit(onRequest)}
        >
            <Box sx={styles.formItemContainer}>
                <InputLabel
                    title={'Название'}
                    required
                />
                <TextField
                    variant='outlined'
                    required
                    inputProps={nameProps}
                    autoComplete={'off'}
                    {...(formState.errors.name && { error: true, helperText: formState.errors.name.message })}
                />
            </Box>

            <Box sx={styles.formItemContainer}>
                <InputLabel
                    title={'Дисциплина'}
                    required
                />
                <TextField
                    variant='outlined'
                    required
                    inputProps={subjectProps}
                    autoComplete={'off'}
                    {...(formState.errors.subject && { error: true, helperText: formState.errors.subject.message })}

                />
            </Box>

            <Box sx={styles.formItemContainer}>
                <InputLabel
                    title={'Описание'}
                />
                <TextField
                    inputProps={descriptionProps}
                    variant='outlined'
                    type={'text'}
                    rows={3}
                    multiline
                    {...(formState.errors.description && { error: true, helperText: formState.errors.description.message })}
                />
            </Box>

            {codeSettingsProps && editCourse && (
                <Box sx={styles.formItemContainer}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={enableProps.value}
                                onChange={handleCourseCodeStatusChange}
                                color={"secondary"}
                            />
                        }
                        label={"Доступ по коду"}
                    />
                </Box>
            )}

            {codeSettingsProps && editCourse && enableProps.value !== undefined && (
                <>
                    {
                        enableProps.value === true && codeProps && (
                            <Box sx={styles.formItemContainer}>
                                <Typography
                                    variant={"h2"}
                                    textAlign={"center"}
                                >
                                    {codeProps}
                                </Typography>
                            </Box>
                        )
                    }

                    {
                        enableProps.value === true && !codeProps && (
                            <Box sx={styles.formItemContainer}>
                                <Typography variant={"body2"}>
                                    {"Код курса появится после сохранения"}
                                </Typography>
                            </Box>
                        )
                    }
                </>
            )}

            <Box sx={globalStyles.submitBtContainer}>
                <Button
                    type='submit'
                    variant='contained'
                >
                    {editCourse ? "Изменить" : "Создать курс"}
                </Button>
            </Box>
        </Box >
    )
}

const styles = {
    root: {
        maxWidth: '548px'
    } as SxProps<Theme>,
    formItemContainer: {
        margin: '0px 0px 10px 0px',
    } as SxProps<Theme>,

    actionButtonInvisible: {
        display: "none",
        height: "0px",
        width: "0px",
        opacity: 0
    } as SxProps<Theme>,
}

const initialErrors: IErrors = {
    name: '',
    subject: ''
}



