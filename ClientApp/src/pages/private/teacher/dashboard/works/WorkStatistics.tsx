import { Box, Tab, Theme, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import { SxProps } from "@mui/system";
import { FC, useCallback, useState } from "react";
import { IWorkGraph, IWorkReviewerForm, IWorkStatistics, WorkStatisticsTypes } from "../../../../../store/types";
import { WorkForms } from "./components/WorkForms";
import { WorkLineGraph } from "./components/WorkLineGraph";

interface IProps {
  workStatistics: IWorkStatistics
}

export const WorkStatistics: FC<IProps> = ({ workStatistics }) => {

  const [currentTab, setCurrentTab] = useState<number>(0)

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  }, [workStatistics]);

  const a11yProps = useCallback((index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }, [workStatistics])

  const graphs: IWorkGraph[] = []
  const formResponse: IWorkReviewerForm[] = []

  workStatistics.map(item => {
    item.statisticType === WorkStatisticsTypes.GRAPH ? graphs.push(JSON.parse(JSON.stringify(item))) : formResponse.push(JSON.parse(JSON.stringify(item)))
  })

  return (
    <Box >
      <Box sx={styles.tabsContainer}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="basic tabs example" sx={{display: "flex"}}>
          <Tab label="Графики" {...a11yProps(0)} sx={styles.tabItem}/>
          <Tab label="Проверки" {...a11yProps(1)} sx={styles.tabItem}/>
        </Tabs>
      </Box>
      <Box sx={styles.wrapper}>
        {graphs.length > 0 && (
          <TabPanel value={currentTab} index={0}>
            <Box sx={styles.graphWrapper}>
              {graphs.map(graphProps => (
                <WorkLineGraph graphProps={graphProps} />
              ))}
            </Box>
          </TabPanel>
        )}

        {formResponse.length > 0 && (
          <TabPanel value={currentTab} index={1}>
            <WorkForms workResponseForm={formResponse} />
          </TabPanel>
        )}
      </Box>

    </Box >
  )
}

interface TabPanelProps {
  index: number;
  value: number;
}

const TabPanel: FC<TabPanelProps> = ({ index, value, children }) => {

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ padding: "10px 0px" }}>
          {children}
        </Box>
      )}
    </div>
  );
}


const styles = {
  wrapper: {
    maxWidth: "1800px",
    margin: "0px auto",
  } as SxProps<Theme>,
  graphWrapper: {
    display: "grid",
    gridGap: "10px",
    gridTemplateColumns: "repeat(auto-fill, minmax(890px, 1fr) )",
    '@media (max-width: 910px)': {
      gridTemplateColumns: "repeat(auto-fill, minmax(100%, 100%) )",
    }
  } as SxProps<Theme>,
  tabItem: {
    flex: "0 0 50%",
    maxWidth: "100%",
    fontWeight: 700,
    fontSize: "16px"
  } as SxProps<Theme>,

  tabsContainer: {
    borderBottom: 1,
    borderColor: 'divider'
  } as SxProps<Theme>,
}