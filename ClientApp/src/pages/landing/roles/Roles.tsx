import { FC } from "react";
import { Box, Grid, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { ExpertsIcon } from "../../../components/icons/ExpertsIcon";
import { StudentsIcon } from "../../../components/icons/StudentsIcon";
import { TeacherIcon } from "../../../components/icons/TeacherIcon";

import { palette } from "../../../theme/colors";

export const Roles: FC = () => {
    return (
        <Box sx={styles.wrapper}>
            <Typography
                sx={styles.sectionTitle}
                height={"100%"}
                variant={"h2"}
                fontWeight={600}
            // color={"secondary.main"}
            >
                {"Удобная ролевая система"}
            </Typography>

            <Typography
                variant={"h5"}
                color={palette.fill.grey}
                textAlign={"center"}
                lineHeight={"34px"}
            >
                {"Мы позаботились, чтобы все участники данного сервиса чувствовали себя комфортно."}
            </Typography>
            <Typography
                variant={"h5"}
                color={palette.fill.grey}
                textAlign={"center"}
                mb={"25px"}
                lineHeight={"34px"}>
                {"Здесь вы узнаете чем будет полезен сервис именно для вас:"}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Box sx={styles.rolesCard}>
                        <Box sx={styles.rolesImg}>
                            <TeacherIcon />
                        </Box>
                        <Typography sx={styles.rolesCardTitle}
                            variant={"h5"}
                            fontWeight={700}
                            color={"primary.main"}>
                            {'Преподаватель'}
                        </Typography>
                        <Typography sx={styles.rolesCardText}
                            variant={"body1"}
                            color={palette.fill.grey}
                            textAlign={"justify"}
                        >
                            {'Проверка домашних работ станет намного эффективней, используя встроенную систему анализа успеваемости Вы сможете легко и своевременно определить успеваемость на Вашем курсе.'}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={styles.rolesCard}>
                        <Box sx={styles.rolesImg}>
                            <StudentsIcon />
                        </Box>
                        <Typography sx={styles.rolesCardTitle}
                            variant={"h5"}
                            fontWeight={500}
                            color={"primary.main"}>
                            {'Студент'}
                        </Typography>
                        <Typography sx={styles.rolesCardText}
                            variant={"body1"}
                            textAlign={"justify"}
                            color={palette.fill.grey}>
                            {'Простота интерфейса и четкость визуализации поможет Вам не упустить важные момента и успешно сдать все задания. А с помощью умной системы взаимопроверки сможете получить достоверную оценку Ваших знаний.'}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={styles.rolesCard}>
                        <Box sx={styles.rolesImg}>
                            <ExpertsIcon />
                        </Box>
                        <Typography sx={styles.rolesCardTitle}
                            variant={"h5"}
                            fontWeight={500}
                            color={"primary.main"}>
                            {'Эксперт'}
                        </Typography>
                        <Typography sx={styles.rolesCardText}
                            variant={"body1"}
                            textAlign={"justify"}
                            color={palette.fill.grey}>
                            {'Сервис предоставит возможность проявить себя в роли эксперта в научной области. Вы сможете наравне с учителем оценивать работы своих однокурсников.'}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

const styles = {
    sectionTitle: {
        textAlign: "center",
        mb: "20px",
        '@media (max-width: 768px)': {
            lineHeight: '30px',
            fontSize: "30px",
        }
    } as SxProps<Theme>,
    rolesTitle: {
        mb: '20px',
    } as SxProps<Theme>,
    rolesImg: {
        display: 'flex',
        justifyContent: 'center',
        mb: '15px',
        width: '150px'
    } as SxProps<Theme>,
    rolesCardTitle: {
        textAlign: 'center',
        mb: '15px'
    } as SxProps<Theme>,
    rolesCardText: {
        padding: '0 10px'
    } as SxProps<Theme>,
    rolesCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
    } as SxProps<Theme>,
    wrapper: {
        my: "50px",
        '@media (max-width: 768px)': {
            my: "25px",
        }
    } as SxProps<Theme>,
}