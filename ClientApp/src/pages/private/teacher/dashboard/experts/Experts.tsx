import { TableBody, TableHead } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { FC } from "react";
import { Table, TableBodyCell, TableBodyCellUser, TableBodyRow, TableHeadCell, TableHeadRow } from "../../../../../components/table";

export const Experts: FC = () => {
  return (
    <Table sx={styles.tableContainer}>
      <TableHead>
        <TableHeadRow>
          <TableHeadCell>{heads.email}</TableHeadCell>
          <TableHeadCell>{heads.name}</TableHeadCell>
          <TableHeadCell isCentered>{heads.progress}</TableHeadCell>
          <TableHeadCell>{heads.action}</TableHeadCell>
        </TableHeadRow>
      </TableHead>
      <TableBody>
        {fakeData.map(expert => (
          <TableBodyRow>
            <TableBodyCell>{expert.email}</TableBodyCell>
            <TableBodyCellUser name={expert.name}></TableBodyCellUser>
            <TableBodyCell isCentered></TableBodyCell>
            <TableBodyCell>{expert.action}</TableBodyCell>
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
    progress: 5,
    action: "",
  },
  {
    email: "iivanov@miem.hse.ru",
    name: "Иван Иванов",
    progress: 2,
    action: "haskdhjas"
  },
  {
    email: "vpupkin@miem.hse.ru",
    name: "Вася Пупкин",
    progress: 4,
    action: "haskdhjas"
  },
]