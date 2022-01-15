import { FC, useState } from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { Typography } from "@mui/material";

import { CoefficientIcon } from "../icons/CoefficientIcon";
import { ArrowRight } from "../icons/ArrowRight";
import { Arrow } from "../icons/Arrow";


interface IProps {
  until?: number | undefined
  after?: number | undefined
}

export const CoefficientsCard: FC<IProps> = ({
  until,
  after
}) => {
  const [flag, setFlag] = useState<boolean>()
  const [proportion, setProportion] = useState<number>()

  if (after && until && !flag && !proportion) {
    if (after > until) {
      setFlag(true)
      setProportion(parseFloat(((after - until) / until * 100).toFixed(2)))
    } else if (after < until) {
      setFlag(false)
      setProportion(parseFloat(((after - until) / until * 100).toFixed(2)))
    }
  }

  console.log(proportion)

  return (
    <Box>
      <Box sx={styles.wrapper}>
        <Box>
          <Box sx={styles.cardContent}>
            <Box sx={styles.cardHeader}>
              <Box sx={styles.typeIcon}>
                <CoefficientIcon />
              </Box>
            </Box>
            <Box sx={styles.cardBody}>
              <Box sx={styles.coefficientBlock}>
                {proportion ? (
                  <>
                    <Typography variant={'h5'} sx={{ textDecoration: 'line-through', opacity: '0.4' }}>
                      {until}
                    </Typography>
                    <Box sx={styles.arrowRightBlock}>
                      <ArrowRight />
                    </Box>
                    <Typography variant={'h5'}>
                      {after}
                    </Typography>
                  </>
                ) : (
                  <Typography variant={'h5'}>
                    {until}
                  </Typography>
                )
                }
              </Box>
              <Typography variant={'body1'}>
                {"Коэффициент доверия"}
              </Typography>
              {proportion && (
                <Box sx={styles.proportionBlock}>
                  <Box sx={flag === true ? styles.arrowBlock : {...styles.arrowBlock, ...styles.rotate180}}>
                    <Arrow svgColor={flag === true ? '#42BDA1' : '#F04461'} />
                  </Box>
                  <Box sx={styles.proportionTextBlock}>
                    <Typography variant={'body1'} sx={flag === true ? { color: '#42BDA1' } : { color: '#F04461' }}>
                      {`${proportion}` + ' %'}
                    </Typography>
                  </Box>
                </Box>)}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box >
  )
}

const styles = {
  wrapper: {
    backgroundColor: 'common.white',
    borderRadius: '8px',
    padding: '20px 15px',
    height: '100px',
    display: 'flex',
    alignItems: "center",
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
    gap: "10px"
  } as SxProps<Theme>,
  cardHeader: {
    display: 'flex',
    justifyContent: 'center',
    mr: '24px'
  } as SxProps<Theme>,
  cardBody: {
  } as SxProps<Theme>,
  typeIcon: {
    display: 'flex',
    width: '60px',
    flexShrink: 0
  } as SxProps<Theme>,
  cardContent: {
    display: "flex",
    alignItems: "center"
  } as SxProps<Theme>,
  coefficientBlock: {
    display: "flex",
  } as SxProps<Theme>,
  arrowRightBlock: {
    display: "flex",
    alignItems: "center",
    margin: "0 8px"
  } as SxProps<Theme>,
  proportionBlock: {
    display: "flex",
    alignItem: "center"
  } as SxProps<Theme>,
  proportionTextBlock: {
    ml: "12px"
  } as SxProps<Theme>,
  arrowBlock: {
    display: "flex",
    alignItems: "center",
  } as SxProps<Theme>,
  rotate180: {
    transform: 'rotate(180deg)'
  }as SxProps<Theme>,
}