import { Button, TextField, Typography } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";
import { FC, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { InputLabel } from "../../../../../components/inputLabel";
import { addCourse } from "../../../../../store/addCourse/thunks/addCourse";
import * as globalStyles from "../../../../../const/styles";

interface ICourseItem {
    name: string
    subject: string
    description?: string
}

// interface IErrors extends Omit<ICourseItem, 'description'> { }
interface IErrors {
    name: string
    subject: string
}

export const JoinCourseForm: FC = () => {
    const [course, setCourseCode] = useState<ICourseItem>(initialCourse)
    const [errors, setErrors] = useState<IErrors>(initialErrors)
    const dispatch = useAppDispatch()

    const onChangeCourseCode = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (typeof event.target !== 'undefined' && typeof event.target.name !== 'undefined' && typeof event.target.value !== 'undefined') {
            const { name, value } = event.target
            if (Object.keys(initialCourse).indexOf(name) > -1) {
                setCourseCode(prev => (
                    { ...prev, [name]: value }
                ))
                if (name === 'name' || name === 'subject') {
                    const error = validate(name, value)
                    if (errors[name] && error === "") {
                        setErrors(prev => (
                            { ...prev, [name]: error }
                        ))
                    }
                }
            }
        }
    }

    const onFieldBlur = (name: string, value: string) => {
        if (Object.keys(errors).indexOf(name) > -1) {
            const error = validate(name, value)
            if (error) {
                setErrors(prev => (
                    { ...prev, [name]: error }
                ))
            }
        }
    }

    const submitForm = useCallback((event: React.FormEvent<HTMLElement>) => {
        event.preventDefault()
        dispatch(addCourse(course))
    }, [dispatch])

    const validate = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'name':
            case 'subject':
                return value ? "" : "Обязательное поле"
        }
    }

    return (
        <Box
            sx={styles.root}
            component={'form'}
            onSubmit={submitForm}
        >
            <Box sx={styles.formItemContainer}>
                <InputLabel
                    title={'Код курса'}
                    required
                />
                <TextField
                    name={'name'}
                    variant='outlined'
                    required
                    onChange={onChangeCourseCode}
                    value={course.name ? course.name : ''}
                    onBlur={e => onFieldBlur(e.target.name, e.target.value)}
                    {...(errors.name.length > 0 && { error: true, helperText: errors.name })}
                />
            </Box>
            
            <Box sx={globalStyles.submitBtContainer}>
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
}

const initialCourse: ICourseItem = {
    name: '',
    subject: '',
    description: ''
}

const initialErrors: IErrors = {
    name: '',
    subject: ''
}



