import { Box, Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import { FC, useState } from "react";
import { Popup } from "../../components/popup";
import { IQuestionTypes, IWorkStatistics, Reviewers, WorkGraphTypes, WorkStatisticsTypes } from "../../store/types";
import { WorkLineGraph } from "../private/teacher/dashboard/works/components/WorkLineGraph";
import { WorkStatistics } from "../private/teacher/dashboard/works/WorkStatistics";

import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';
import { scrollStyles } from "../../const/styles";




export const TestPage: FC = () => {


    const fakeData: IWorkStatistics = [
        {
            statisticType: WorkStatisticsTypes.GRAPH,
            graphType: WorkGraphTypes.FINAL,
            coordinates: [
                {
                    reviewer: Reviewers.TEACHER,
                    name: "Иван Иванов",
                    value: 7
                },
                {
                    reviewer: Reviewers.EXPERT,
                    name: "Мухаммад Юсупов",
                    value: 6
                },
                {
                    reviewer: Reviewers.PEER,
                    name: "Вася",
                    value: 1
                },
                {
                    reviewer: Reviewers.PEER,
                    name: "Петя",
                    value: 9
                },
                {
                    reviewer: Reviewers.PEER,
                    name: "Федя",
                    value: 3
                },
            ],
            minGrade: 0,
            maxGrade: 9
        },
        {
            statisticType: WorkStatisticsTypes.GRAPH,
            graphType: WorkGraphTypes.FINAL,
            coordinates: [
                {
                    reviewer: Reviewers.TEACHER,
                    name: "Иван Иванов",
                    value: 7
                },
                {
                    reviewer: Reviewers.EXPERT,
                    name: "Мухаммад Юсупов",
                    value: 6
                },
                {
                    reviewer: Reviewers.PEER,
                    name: "Вася",
                    value: 1
                },
                {
                    reviewer: Reviewers.PEER,
                    name: "Петя",
                    value: 9
                },
                {
                    reviewer: Reviewers.PEER,
                    name: "Федя",
                    value: 3
                },
            ],
            minGrade: 0,
            maxGrade: 9
        },
        {
            statisticType: WorkStatisticsTypes.GRAPH,
            graphType: WorkGraphTypes.FINAL,
            coordinates: [
                {
                    reviewer: Reviewers.TEACHER,
                    name: "Иван Иванов",
                    value: 7
                },
                {
                    reviewer: Reviewers.EXPERT,
                    name: "Мухаммад Юсупов",
                    value: 6
                },
                {
                    reviewer: Reviewers.PEER,
                    name: "Вася",
                    value: 1
                },
                {
                    reviewer: Reviewers.PEER,
                    name: "Петя",
                    value: 9
                },
                {
                    reviewer: Reviewers.PEER,
                    name: "Федя",
                    value: 3
                },
            ],
            minGrade: 0,
            maxGrade: 9
        },
        {
            statisticType: WorkStatisticsTypes.RESPONSE,
            name: "Юсупов М А",
            reviewer: Reviewers.TEACHER,
            responses: [
                {
                    questionId: "123",
                    description: "Описание 1",
                    order: 0,
                    title: "Title 1",
                    type: IQuestionTypes.TEXT,
                    response: "Мухаммад Юсупов ответ 1",
                    required: false
                },
                {
                    questionId: "234",
                    order: 1,
                    title: "Title 2",
                    type: IQuestionTypes.TEXT,
                    response: "Мухаммад Юсупов ответ 2",
                    required: true
                },
            ]
        },
        {
            statisticType: WorkStatisticsTypes.RESPONSE,
            name: "Петров ",
            reviewer: Reviewers.TEACHER,
            responses: [

                {
                    questionId: "123",
                    order: 0,
                    title: "Title 1",
                    type: IQuestionTypes.TEXT,
                    required: false
                },
                {
                    questionId: "234",
                    order: 1,
                    title: "Title 2",
                    type: IQuestionTypes.TEXT,
                    response: "Иван Иванов ответ 2",
                    required: true
                },
                {
                    questionId: "345",
                    order: 3,
                    title: "Title 3",
                    type: IQuestionTypes.MULTIPLE,
                    responses: [
                        {
                            id: 1,
                            response: "Иван Иванов",
                        },
                        {
                            id: 2,
                            response: "Вариант 2",
                        },
                        {
                            id: 3,
                            response: "Вариант 3",
                        },
                        {
                            id: 4,
                            response: "Вариант 4",
                        }
                    ],
                    response: "Иван Иванов",
                    required: false
                },
                {
                    questionId: "456",
                    order: 4,
                    title: "Title 4",
                    type: IQuestionTypes.SELECT_RATE,
                    response: 2,
                    required: true,
                    minValue: 0,
                    maxValue: 5
                },
            ]
        }
    ]

    const [popustatus, steasas] = useState(true)

    return (
        <Popup
            title={"TTTT"}
            open={true}
            loading={false}
            onCloseHandler={steasas}
            fullScreen
            fullWidth
            PaperProps={{ sx: { flex: '0 1 100%' } }}
            dialogContentSx={{ padding: "0px 10px", ...scrollStyles }}
        >

            <WorkStatistics workStatistics={fakeData} />
        </Popup >


    )
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