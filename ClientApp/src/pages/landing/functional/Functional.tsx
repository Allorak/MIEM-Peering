import { FC } from "react";

import { Box, Grid, List, ListItem, ListItemIcon, ListItemText, Theme, Typography } from '@mui/material';
import { SxProps } from "@mui/system";

import { FunctionsImg } from "../../../components/icons/Functions";
import { CheckIcon } from "../../../components/icons/Check";

import { palette } from "../../../theme/colors";


export const Functional: FC = () => {
    const text = [
        'Широкий выбор типов заданий, а также возможность гибкой настройки весовых критериев;',
        'Наличие "коэффициента доверия", позволяющего объективно оценить знания учащихся;',
        'Возможность интеграции с другими сервисами через LTI;',
        'Удобный инструмент для анализа успеваемости.'
    ]

    const listItem = text.map((text, index) => {
        return (
            <ListItem key={index}>
                <ListItemIcon>
                    <CheckIcon />
                </ListItemIcon>
                <ListItemText
                    primary={text}
                />
            </ListItem>)
    })

    return (
        <Box sx={styles.wrapper}>
            <Typography
                sx={styles.sectionTitle}
                height={"100%"}
                variant={"h2"}
                fontWeight={600}
                pl={"5px"}>
                {"Расширенный функционал"}
            </Typography>
            <Grid container spacing={6}>
                <Grid item xs={12} md={5}>
                    <FunctionsImg />
                </Grid>
                <Grid item xs={12} md={7}>
                    <Typography
                        sx={styles.functionalTitle}
                        variant={"h5"}
                        fontWeight={600}
                        color={"primary.main"}>
                        {"В чем особенность нашего сервиса?"}
                    </Typography>
                    <Typography
                        variant={"body1"}
                        color={palette.fill.grey}
                        textAlign={"justify"}
                        >
                        {"Мы проанализировали доступные сервисы для проведения работ с пиринговой системой оценивания и выявили в них ряд недостатков. Именно поэтому в нашем сервисе содержится полный функционал подобных систем с улучшенной системой пиринговой проверки:"}
                    </Typography>
                    <List>
                        {listItem}
                    </List>
                </Grid>
            </Grid>
        </Box>
    )
}

const styles = {
    functionalTitle: {
        mb: '20px'
    } as SxProps<Theme>,
    sectionTitle: {
        textAlign: "center",
        mb: "20px",
        '@media (max-width: 768px)': {
            lineHeight: '30px',
            fontSize: "30px",
            mb: "10px",
        }
    } as SxProps<Theme>,
    wrapper: {
        my: "50px",
        '@media (max-width: 768px)': {
            my: "25px",
        }
    } as SxProps<Theme>,
}