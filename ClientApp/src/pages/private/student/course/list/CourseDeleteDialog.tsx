import React, { FC, SetStateAction, useCallback } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Theme } from "@mui/material";
import { SxProps } from "@mui/system";

import { deleteStudentCourse } from "../../../../../store/JoinCourse/thunks/deleteStudentCourse";

import { useAppDispatch } from "../../../../../app/hooks";

import { ICourses } from "../../../../../store/types";

interface IProps {
    dialogOpen: boolean,
    course?: ICourses,
    onCloseHandler(value: SetStateAction<boolean>): void
}

export const CourseDeleteDialog: FC<IProps> = ({
    dialogOpen,
    course,
    onCloseHandler
}) => {
    const dispatch = useAppDispatch()

    const handleClose = useCallback(() => {
        onCloseHandler(false);
    }, []);

    const onDelete = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()
        if (course) {
            dispatch(deleteStudentCourse(course.id))
        }
    }, [course])

    return (
        <>
            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'Действительно хотите удалить данный курс?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {'После удаления Вы сможете присоединиться к курсу заново'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={styles.dialogActions}>
                    <Button
                        variant='contained'
                        onClick={handleClose}
                    >
                        {'Отмена'}
                    </Button>
                    <Button
                        onClick={onDelete}
                        autoFocus
                    >
                        {'Удалить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

const styles = {
    dialogActions: {
        display: 'flex',
        justifyContent: 'space-between'
    } as SxProps<Theme>
}
