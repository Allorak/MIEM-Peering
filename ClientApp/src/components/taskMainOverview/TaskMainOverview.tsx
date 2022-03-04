import { FC } from "react"
import { Box, Typography, Divider } from "@mui/material"
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';


interface IProps {
  title: string,
  description?: string
  ltiConsumerKey?: string
  ltiSharedSecret?: string
}

export const TaskMainOverview: FC<IProps> = ({
  title,
  description,
  ltiConsumerKey,
  ltiSharedSecret
}) => {
  return (
    <Box
      padding={"15px"}
      display={'flex'}
      gap={"10px"}
      flexDirection={'column'}
      bgcolor={"common.white"}
      borderRadius={"5px"}
      boxShadow={"0px 2px 6px 0px rgba(34, 60, 80, 0.2)"}
    >
      <Typography
        variant={"h5"}
        padding={"0"}
        margin={"0"}
        lineHeight={1}
      >
        {title}
      </Typography>

      {description && description.trim() && (
        <>
          <Divider />

          <Typography
            variant={"body1"}
            whiteSpace={"pre-line"}
          >
            {description}
          </Typography>
        </>
      )}

      {ltiConsumerKey && ltiSharedSecret && (
        <>
          <Divider />

          <Typography
            variant="h6"
          >
            {"Подключения к LMS и МООС системам"}
          </Typography>

          <Typography
            variant="body1"
          >
            {"LTI провайдер позволяет сделать интеграцию с Вашей системой управления обучением. По мере получения оценок, они возвращаются в LMS/MOOC платформу в соответствующий раздел курса по протоколу LTI."}
          </Typography>

          <Typography
            variant="body1"
            overflow={"auto"}
            fontWeight={700}
            color={"#0F1B41"}
          >
            {"Tool URL: "}
            
            <Typography
              variant="body1"
              component={"span"}
            >
              {"https://constructor.auditory.ru/bridge/lti/1p0/launch"}
            </Typography>
          </Typography>

          <Typography
            variant="body1"
            overflow={"auto"}
            color={"#0F1B41"}
            fontWeight={700}
          >
            {"Consumer key: "}

            <Typography
              variant="body1"
              component={"span"}
            >
              {ltiConsumerKey}
            </Typography>
          </Typography>

          <Typography
            variant="body1"
            overflow={"auto"}
            color={"#0F1B41"}
            fontWeight={700}
          >
            {"Shared secret: "}
            
            <Typography
              variant="body1"
              component={"span"}
            >
              {ltiSharedSecret}
            </Typography>
          </Typography>

          <Box
            display={"flex"}
            gap={"5px"}
            alignItems={"center"}
          >
            <LocalLibraryIcon
              sx={{
                fontSize: "18px",
                color: "primary.main"
              }}
            />

            <Typography
              fontSize={"12px"}
              component={'a'}
              color={"primary.main"}
              target={"_blank"}
              href={"https://wiki.miem.hse.ru/"}
            >
              {"Инструкция по подключению"}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  )
}