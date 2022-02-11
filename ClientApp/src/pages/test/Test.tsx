import { Box, Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import { FC, useState } from "react";
import { Popup } from "../../components/popup";
import { IPeerForm, IPeerResponses, IQuestionTypes, IStudentWork, IWorkStatistics, Reviewers, WorkGraphTypes, WorkStatisticsTypes } from "../../store/types";
import { WorkLineGraph } from "../private/teacher/dashboard/works/components/WorkLineGraph";
import { WorkStatistics } from "../private/teacher/dashboard/works/WorkStatistics";

import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';
import { scrollStyles } from "../../const/styles";
import { FileUploadEditable } from "../../components/rubrics/fileUpload";
import { EditableForm } from "../../components/editableForm";
import path from "path";
import { createReview } from "../../store/checkings";
import { FileUploadPreview } from "../../components/rubrics/fileUpload/FileUploadPreview";
import { FileUploadVisible } from "../../components/rubrics/fileUpload/FileUploadVisible";
import { VisibleForm } from "../../components/visibleForm";




export const TestPage: FC = () => {

    const [responses, setResponses] = useState<IPeerForm>(initResponse)

    const handleOnFormEdit = React.useCallback((value: string | number | File | undefined, questionId: string) => {
        setResponses(prev => {
            if (prev.rubrics.length > 0) {
                return {
                    rubrics: prev.rubrics.map(item => {
                        if (item.questionId !== questionId) return item

                        switch (item.type) {
                            case IQuestionTypes.SELECT_RATE:
                            case IQuestionTypes.MULTIPLE:
                                return JSON.parse(JSON.stringify({
                                    ...item,
                                    ...(typeof value !== 'string' && typeof value !== 'object' && { value: value })
                                }))

                            case IQuestionTypes.SHORT_TEXT:
                            case IQuestionTypes.TEXT:
                                return JSON.parse(JSON.stringify({
                                    ...item,
                                    ...(typeof value !== 'number' && typeof value !== 'object' && { response: value?.trim() })
                                }))

                            case IQuestionTypes.FILE:
                                return {
                                    ...item,
                                    ...(typeof value !== "number" && typeof value !== "string" && { file: value })
                                }
                        }
                    })
                }
            }
            return initResponse
        })
    }, [responses])

    const onRequest = React.useCallback((formResponses: IPeerResponses) => {
        console.log(formResponses)
    }, [path])

    return (
        <Box width={"70%"}>
            {/* <EditableForm
                form={responses}
                onSubmit={onRequest}
                onEdit={handleOnFormEdit}
            /> */}

            <VisibleForm
                form={dddd}
                answerBoxColor={'#000'}
            />
        </Box>


    )
}

const dddd: IStudentWork = {
    responses: [
        {
            questionId: "1",
            title: "Short text",
            required: false,
            type: IQuestionTypes.SHORT_TEXT,
            order: 0
        },
        {
            questionId: "2",
            title: "Text",
            required: false,
            type: IQuestionTypes.TEXT,
            order: 1
        },
        {
            questionId: "3",
            title: "Multiple",
            required: false,
            type: IQuestionTypes.MULTIPLE,
            order: 1,
            responses: [
                {
                    id: 1,
                    response: "1"
                },
                {
                    id: 2,
                    response: "2"
                },
                {
                    id: 3,
                    response: "3"
                },
                {
                    id: 4,
                    response: "4"
                }
            ]
        },
        {
            questionId: "4",
            title: "File",
            required: true,
            type: IQuestionTypes.FILE,
            order: 1,
            fileId: "hgh"
        },
    ]
}

const initResponse: IPeerForm = {
    rubrics: [
        {
            questionId: "1",
            title: "Short text",
            required: false,
            type: IQuestionTypes.SHORT_TEXT,
            order: 0
        },
        {
            questionId: "2",
            title: "Text",
            required: false,
            type: IQuestionTypes.TEXT,
            order: 1
        },
        {
            questionId: "3",
            title: "Multiple",
            required: false,
            type: IQuestionTypes.MULTIPLE,
            order: 1,
            responses: [
                {
                    id: 1,
                    response: "1"
                },
                {
                    id: 2,
                    response: "2"
                },
                {
                    id: 3,
                    response: "3"
                },
                {
                    id: 4,
                    response: "4"
                }
            ]
        },
        {
            questionId: "4",
            title: "File",
            required: true,
            type: IQuestionTypes.FILE,
            order: 1
        },
    ]
}

const styles = {
    wrapper: {
        maxWidth: "1800px",
        display: "grid",
        gridGap: "10px",
        margin: "0px auto",
        gridTemplateColumns: "repeat(auto-fill, minmax(890px, 1fr) )",
        '@media (max-width: 910px)': {
            gridTemplateColumns: "repeat(auto-fill, minmax(100%, 100%) )",
        }
    } as SxProps<Theme>
}