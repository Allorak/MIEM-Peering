import { FC } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { SxProps, Theme, TypographyProps } from "@mui/system";
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

import { palette } from "../../theme/colors";

interface IProps extends TypographyProps {
    title: string
    required?: boolean
    fontSize?: string,
    description?: string
}

export const InputLabel: FC<IProps> = ({
    title,
    required,
    fontSize,
    description
}) => {

    return (
        <>
            <Typography
                variant={fontSize === 'medium' ? 'h6' : 'body1'}
                sx={required ? { ...styles.root, ...styles.required } : styles.root}
            >
                {title}

            </Typography>
            {description && (
                <Tooltip
                    title={<span style={{ whiteSpace: 'pre-line' }}>{description}</span>}
                    placeholder={"top"}
                    arrow
                >
                    <Box sx={styles.tooltipWrapper}>
                        <ErrorOutlineRoundedIcon color={"warning"} fontSize={"small"} />
                    </Box>
                </Tooltip>
            )}
        </>
    )
}

const styles = {
    root: {
        fontWeight: '600',
        lineHeight: '17px',
        color: theme => theme.palette.common.black,
        textAlign: 'left',
        marginBottom: '12px',

    } as SxProps<Theme>,
    required: {
        padding: '0px 10px 0px 0px',
        position: 'relative',
        display: 'inline-block',
        ":after": {
            content: "'*'",
            position: 'absolute',
            right: '0',
            top: '2px',
            lineHeight: '1',
            color: palette.fill.grey
        }
    } as SxProps<Theme>,
    tooltipWrapper: {
        display: "inline-block",
        margin: "0px 0px 0px 10px",
        verticalAlign: "middle",
        ":hover": {
            cursor: "help"
        }
    } as SxProps<Theme>,
}