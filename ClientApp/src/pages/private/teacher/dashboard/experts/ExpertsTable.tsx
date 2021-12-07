
import { FC } from "react";
import { TableBody, TableHead } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

import { Progress } from "../../../../../components/progress";
import { Table, TableBodyCell, TableBodyCellUser, TableBodyRow, TableHeadCell, TableHeadRow } from "../../../../../components/table";
import { IExtpertItem } from "../../../../../store/types";
import { RemoveButton } from "../../../../../components/actionButtons";


interface IProps {
  experts: IExtpertItem[]
  onRemove: (email: string) => void
}

export const ExpertsTable: FC<IProps> = ({ experts, onRemove }) => {
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
          <ExpertRow expertItem={expert} onRemove={onRemove} />
        ))}
      </TableBody>
    </Table>
  )
}

interface IPropsRow {
  expertItem: IExtpertItem
  onRemove: (email: string) => void
}

const ExpertRow: FC<IPropsRow> = ({ expertItem, onRemove }) => {
  return (
    <TableBodyRow>
      <TableBodyCell>{expertItem.email}</TableBodyCell>
      <TableBodyCellUser name={expertItem.name} img={expertItem.imgUrl}></TableBodyCellUser>
      <TableBodyCell isCentered >
        <Progress progress={expertItem.taskComplete / expertItem.assignedTasks * 100} />
      </TableBodyCell>
      <TableBodyCell isCentered>
        <RemoveButton onClick={() => onRemove(expertItem.email)} />
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