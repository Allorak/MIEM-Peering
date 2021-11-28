import { FC, useCallback, useState } from "react";
import { InputLabel } from "../../../../../components/inputLabel";
import * as globalStyles from "../../../../../const/styles";

import { Button, TextField } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";

interface IProps {
    onSubmit(courseCode: string): void
}

export const JoinCourseForm: FC<IProps> = ({onSubmit}) => {
    const [courseCode, setCourseCode] = useState<string>('')
    const [errors, setErrors] = useState<boolean>(false)

    const onChangeCourseCode = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCourseCode(event.target.value)
    }

    const onFieldBlur = (value: string) => {
        const error = !value || value === ''
        setErrors(error)
    }

    const submitForm = useCallback((event: React.FormEvent<HTMLElement>) => {
        event.preventDefault()
        onSubmit(courseCode)
    }, [courseCode])

    return (
        <Box
            sx={styles.root}
            component={'form'}
            onSubmit={submitForm}
        >
            <Box sx={styles.formItemContainer}>
                <InputLabel
                    title={'Код курса'}
                    fontSize='medium'
                    required
                />
                <TextField
                    variant='outlined'
                    required
                    onChange={onChangeCourseCode}
                    value={courseCode}
                    onBlur={e => onFieldBlur(e.target.value)}
                    {...(errors && { error: true, helperText: "Обязательное поле" })}
                />
            </Box>

            <Box sx={globalStyles.submitBtContainerCenter}>
                <Button
                    type='submit'
                    variant='contained'
                >
                    Присоединиться
                </Button>
            </Box>
        </Box>
    )
}

const styles = {
    root: {
        maxWidth: '548px'
    } as SxProps<Theme>,
    formItemContainer: {
        margin: '0px 0px 10px 0px',
    } as SxProps<Theme>,
    formInputLabel: {
        fontSize: '18px'
    } as SxProps<Theme>,
}