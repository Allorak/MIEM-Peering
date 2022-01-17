import { FC } from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { Typography } from "@mui/material";

import { IDonutChart } from "../../store/types";
import { RadialChart } from "react-vis";
import { palette } from "../../theme/colors";


interface IProps extends IDonutChart {
    color: string
    bgColor: string
}

export const DonutChart: FC<IProps> = ({
    total,
    proportion,
    color,
    bgColor
}) => {

    const dataSubmission = [
        { angle: proportion, color: color },
        { angle: total - proportion, color: bgColor },
    ]

    return (
        <Box sx={styles.progressContainer}>
            <Typography
                variant={"h6"}
                sx={styles.progressText}
            >
                {`${proportion} из ${total}`}
            </Typography>
            <RadialChart
                colorType="literal"
                innerRadius={45}
                radius={55}
                data={dataSubmission}
                width={120}
                height={120}
                animation={"gentle"}
                showLabels={true}
            />
        </Box>
    )
}

const styles = {
    progressContainer: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
    } as SxProps<Theme>,
    progressText: {
        position: "absolute",
        lineHeight: "30px",
        textAlign: "center",
        left: "0",
        top: "45px",
        width: "100%",
        zIndex: "2"
    } as SxProps<Theme>,
}