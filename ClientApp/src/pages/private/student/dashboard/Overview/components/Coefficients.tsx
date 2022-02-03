import { FC, useMemo, useState } from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { Typography } from "@mui/material";

import { CoefficientIcon } from "../../../../../../components/icons/CoefficientIcon";
import { ArrowRight } from "../../../../../../components/icons/ArrowRight";
import { Arrow } from "../../../../../../components/icons/Arrow";


interface IProps {
  before?: number
  after?: number
}

export const Coefficients: FC<IProps> = ({
  before,
  after
}) => {

  const cardData = useMemo(() => {
    if (typeof after === 'number' && typeof before === 'number') {
      return {
        proportion: parseFloat(((after - before)).toFixed(2)),
        flag: after > before
      }
    }
  }, [before, after])

  return (
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
              {cardData ? (
                <>
                  <Typography variant={'h5'} sx={{ textDecoration: 'line-through', opacity: '0.4' }}>
                    {typeof before === 'number' && (
                      before.toFixed(2)
                    )}
                  </Typography>

                  <Box sx={styles.arrowRightBlock}>
                    <ArrowRight />
                  </Box>

                  <Typography variant={'h5'}>
                    {typeof after === 'number' && (
                      after.toFixed(2)
                    )}
                  </Typography>
                </>
              ) : (
                <>
                  {typeof before === 'number' && (
                    <Typography variant={'h5'}>
                      {`${before.toFixed(2)} - текущий`}
                    </Typography>
                  )}

                  {typeof after === 'number' && (
                    <Typography variant={'h5'}>
                      {`${after.toFixed(2)} - итоговый`}
                    </Typography>
                  )}
                </>
              )}
            </Box>

            <Typography variant={'body1'}>
              {"Коэффициент доверия"}
            </Typography>

            {cardData && (
              <Box sx={styles.proportionBlock}>
                <Box sx={cardData.flag ? styles.arrowBlock : { ...styles.arrowBlock, ...styles.rotate180 }}>
                  <Arrow svgColor={cardData.flag ? '#42BDA1' : '#F04461'} />
                </Box>

                <Box sx={styles.proportionTextBlock}>
                  <Typography variant={'body1'} sx={cardData.flag ? { color: '#42BDA1' } : { color: '#F04461' }}>
                    {cardData.proportion}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const styles = {
  wrapper: {
    backgroundColor: 'common.white',
    borderRadius: '8px',
    padding: '20px 15px',
    height: '100%',
    boxSizing: 'border-box',
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
  } as SxProps<Theme>,
}