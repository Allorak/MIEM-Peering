
import { FC } from "react";
import { TableBody, TableHead } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

import { Progress } from "../../../../../components/progress";
import { Table, TableBodyCell, TableBodyCellUser, TableBodyRow, TableHeadCell, TableHeadRow } from "../../../../../components/table";
import { IExtpertItem } from "../../../../../store/types";


export const Experts: FC = () => {
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
        {fakeData.map(expert => (
          <TableBodyRow>
            <TableBodyCell>{expert.email}</TableBodyCell>
            <TableBodyCellUser name={expert.name}></TableBodyCellUser>
            <TableBodyCell isCentered >
              <Progress progress={expert.taskComplete / expert.assignedTasks * 100} />
            </TableBodyCell>
            <TableBodyCell isCentered>{"1"}</TableBodyCell>
          </TableBodyRow>
        ))}
      </TableBody>
    </Table>
  )
}

const styles = {
  tableContainer: {
    margin: "0px auto",
    maxWidth: "900px",
    width: "100%"
  } as SxProps<Theme>
}

const heads = {
  email: "Эл. почта",
  name: "ФИО",
  progress: "Прогресс",
  action: "Действие"
}

const fakeData = [
  {
    email: "mayusupov@miem.hse.ru",
    name: "Мухаммад Юсупов",
    taskComplete: 5,
    assignedTasks: 10
  },
  {
    email: "iivanov@miem.hse.ru",
    name: "Иван Иванов",
    taskComplete: 5,
    assignedTasks: 10
  },
  {
    email: "vpupkin@miem.hse.ru",
    name: "Вася Пупкин",
    taskComplete: 10,
    assignedTasks: 10
  },
] as Array<IExtpertItem>