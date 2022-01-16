
import { FC } from "react";
import { Box, TableBody, TableHead, Tooltip } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

import { Progress } from "../../../../../components/progress";
import { Table, TableBodyCell, TableBodyCellUser, TableBodyRow, TableHeadCell, TableHeadRow } from "../../../../../components/table";
import { IExpertItem } from "../../../../../store/types";


interface IProps {
  experts: IExpertItem[]
}

export const ExpertsTable: FC<IProps> = ({ experts }) => {
  return (
    <Table sx={styles.tableContainer}>
      <TableHead>
        <TableHeadRow>
          <TableHeadCell>{heads.email}</TableHeadCell>
          <TableHeadCell>{heads.name}</TableHeadCell>
          <TableHeadCell isCentered>{heads.progress}</TableHeadCell>
          <TableHeadCell isButton />
        </TableHeadRow>
      </TableHead>
      <TableBody>
        {experts.map(expert => (
          <ExpertRow expertItem={expert} />
        ))}
      </TableBody>
    </Table>
  )
}

interface IPropsRow {
  expertItem: IExpertItem
}

const ExpertRow: FC<IPropsRow> = ({ expertItem }) => {
  return (
    <TableBodyRow>
      <TableBodyCell>{expertItem.email}</TableBodyCell>
      <TableBodyCellUser name={expertItem.name ?? "No Name"} img={expertItem.imageUrl} />
      <TableBodyCell isCentered >
        {expertItem.tasksAssigned !== undefined && expertItem.tasksCompleted !== undefined ? (
          <Tooltip
            title={`Назначено: ${expertItem.tasksCompleted}; Проверено: ${expertItem.tasksAssigned}`}
            placement={"top"}
          >
            <Box>
              <Progress progress={expertItem.tasksAssigned / expertItem.tasksCompleted * 100} />
            </Box>
          </Tooltip>
        ) : (
          <>{"?"}</>
        )}
      </TableBodyCell>
    </TableBodyRow>
  )
}

const styles = {
  tableContainer: {
    margin: "0px auto",
    maxWidth: "700px",
    width: "100%"
  } as SxProps<Theme>
}

const heads = {
  email: "Эл. почта",
  name: "ФИО",
  progress: "Прогресс",
  action: "Действие"
}