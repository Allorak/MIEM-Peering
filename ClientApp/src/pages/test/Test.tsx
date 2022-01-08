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

    return (
        <></>


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