import { createRef, FC, useCallback, useEffect, useState } from "react";

import { SxProps, } from "@mui/system";
import { Box, IconButton, Theme, Typography } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { Avatar as AvatarIcon } from "../../../components/icons/Avatar"

import { palette } from "../../../theme/colors";

interface IProps {
    value?: File,
    onChange: (value?: File) => void
}

export const FileInput: FC<IProps> = ({
    value,
    onChange,
}) => {
    const fileInputRef = createRef<HTMLInputElement>()
    const [previewImg, setPreviewImg] = useState<string>()

    useEffect(() => {
        if (value) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImg(reader.result as string)
            }

            reader.readAsDataURL(value);
        } else {
            setPreviewImg(undefined)
        }
    }, [value])

    const handleOnImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const filesList = event.target.files

        if (filesList && filesList.length > 0) {
            const firstFile = filesList.item(0)

            if (firstFile && firstFile.type.substring(0, 5) === "image" && firstFile.size <= 5e+6) {
                onChange(firstFile)
                return
            }
        }

        onChange()
    }, [onChange])

    const handleOnImageClick = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()

        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }, [fileInputRef])

    const handleDeleteCurrentImg = useCallback(() => {
        if (value) {
            onChange()
        }
    }, [value])

    return (
        <Box
            display={"flex"}
            justifyContent={"center"}
        >
            <Box
                sx={value ? styles.imgWrapper : { ...styles.imgWrapper, ...styles.imgWrapperHover }}
                {...(!value && { onClick: handleOnImageClick })}
            >
                <>
                    {previewImg ? (
                        <Box
                            sx={{
                                background: `url('${previewImg}') 0 0/cover no-repeat`,
                                height: "150px",
                                width: "150px"
                            }}
                        />
                    ) : (
                        <>
                            <Box sx={{
                                height: "150px",
                                width: "150px"
                            }}>
                                <AvatarIcon
                                    width="150"
                                    height="150"
                                />
                            </Box>

                            <Typography
                                position={"absolute"}
                                bottom={0}
                                bgcolor={"common.black"}
                                color={"common.white"}
                                sx={{ opacity: 0.8 }}
                                left={0}
                                textAlign={"center"}
                                padding={"0px 0px 5px 0px"}
                                width={"100%"}
                            >
                                {"Изменить"}
                            </Typography>
                        </>
                    )}
                </>
            </Box>

            <input
                type="file"
                style={{ display: "none" }}
                ref={fileInputRef}
                accept="image/*"
                onChange={handleOnImageChange}
            />

            {
                previewImg && (
                    <Box
                        position={"relative"}
                        width={"0px"}
                        height={"0px"}
                    >
                        <IconButton
                            sx={styles.deleteBt}
                            onClick={handleDeleteCurrentImg}
                        >
                            <CloseRoundedIcon />
                        </IconButton>
                    </Box>
                )
            }
        </Box >

    )
}

const styles = {
    imgWrapper: {
        position: "relative",
        borderRadius: "50%",
        border: "3px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: "border-color ease 0.3s",
    } as SxProps<Theme>,
    imgWrapperHover: {
        ":hover": {
            borderColor: "primary.main",
            cursor: "pointer",
        }
    } as SxProps<Theme>,
    deleteBt: {
        height: "fit-content",
        position: "absolute",
        top: "10px",
        right: "10px",
        bgcolor: "error.main",
        p: "3px",
        color: "common.white",
        ":hover": {
            bgcolor: palette.hover.danger
        }
    } as SxProps<Theme>,
}