import { FC, useMemo } from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { CircularProgress, Typography } from "@mui/material";


interface IProps {
    submissions?: number
    totalSubmissions?: number
    reviews?: number
    totalReviews?: number
}

export const DonutChart: FC<IProps> = ({
    submissions,
    totalSubmissions,
    reviews,
    totalReviews
}) => {

    const cardData = useMemo(() => {
        return {
            reviewValue: typeof reviews === 'number' && totalReviews ? (reviews / totalReviews) * 100 : undefined,
            submissionValue: typeof submissions === 'number' && totalSubmissions ? (submissions / totalSubmissions) * 100 : undefined
        }
    }, [submissions, totalSubmissions, reviews, totalReviews])

    return (
        <Box sx={styles.wrapper}>
            <Typography
                variant={'h6'}
            >
                {"Статистика"}
            </Typography>

            <Box sx={styles.progressContainer}>
                {typeof cardData.reviewValue === 'number' && (
                    <>
                        <Box sx={styles.progressBlock}>
                            <CircularProgress
                                variant={"determinate"}
                                value={100}
                                size={"180px"}
                                thickness={3}
                                sx={{ color: "#f4f5f8" }}
                            />
                        </Box>

                        <Box sx={styles.progressBlock}>
                            <CircularProgress
                                variant={"determinate"}
                                value={cardData.reviewValue}
                                size={"180px"}
                                thickness={3}
                                color={"primary"}
                            />
                        </Box>
                    </>
                )}

                {typeof cardData.submissionValue === 'number' && (
                    <>
                        <Box sx={styles.progressBlock}>
                            <CircularProgress
                                variant={"determinate"}
                                value={100}
                                size={"220px"}
                                thickness={3}
                                sx={{ color: "#f4f5f8" }}
                            />
                        </Box>

                        <Box sx={styles.progressBlock}>
                            <CircularProgress
                                variant={"determinate"}
                                value={cardData.submissionValue}
                                size={"220px"}
                                thickness={3}
                                color={"secondary"}
                            />
                        </Box>
                    </>
                )}
            </Box>

            {typeof cardData.submissionValue === 'number' && (
                <Typography
                    variant={"body1"}
                    textAlign={"center"}
                >
                    <Box
                        sx={{
                            borderRadius: "50%",
                            width: "14px",
                            height: "14px",
                            display: "inline-block",
                            backgroundColor: "secondary.main",
                            lineHeight: "24px",
                            margin: "0px 5px 0px 0px"
                        }}
                    />
                    {`Сдали работу: ${submissions} из ${totalSubmissions}`}
                </Typography>
            )}

            {typeof cardData.reviewValue === 'number' && (
                <Typography
                    variant={"body1"}
                    textAlign={"center"}
                >
                    <Box
                        sx={{
                            borderRadius: "50%",
                            width: "14px",
                            height: "14px",
                            display: "inline-block",
                            backgroundColor: "primary.main",
                            lineHeight: "24px",
                            margin: "0px 5px 0px 0px"
                        }}
                    />
                    {`Проверили работу: ${reviews} из ${totalReviews}`}
                </Typography>
            )}
        </Box>
    )
}

const styles = {
    wrapper: {
        backgroundColor: 'common.white',
        borderRadius: '4px',
        padding: '15px',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
        gap: "10px",
    } as SxProps<Theme>,
    progressContainer: {
        position: "relative",

        minHeight: "250px"
    } as SxProps<Theme>,
    progressBlock: {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)"
    } as SxProps<Theme>,
}