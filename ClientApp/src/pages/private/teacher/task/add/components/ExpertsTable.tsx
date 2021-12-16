import { Button, IconButton, TableBody, TableHead } from "@mui/material";
import { FC } from "react";
import { Table } from "reactstrap";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { TableBodyCell, TableBodyRow, TableHeadCell, TableHeadRow } from "../../../../../../components/table";

interface IProps {
  experts: Array<string>
  onAdd: () => void,
  onEdit: (expert: string) => void
}

export const ExpertTable: FC<IProps> = ({ experts, onAdd, onEdit }) => {
  return (
    <Table>
      <TableHead>
        <TableHeadRow>
          <TableHeadCell>{heads.email}</TableHeadCell>
          <TableHeadCell isCentered isButton>{
            <Button
              type={"button"}
              variant={"text"}
              color={"success"}
              onClick={() => onAdd()}
              size={"small"}
              startIcon={<AddIcon sx={{ color: "common.white" }} fontSize={"small"} />}
            >
              {"Добавить"}
            </Button>
          }</TableHeadCell>
        </TableHeadRow>
      </TableHead>
      <TableBody>
        {experts.map((expert, index) => (
          <ExpertRow
            key={`${expert}${index}`}
            expert={expert}
            onEdit={() => onEdit(expert)}
          />
        ))}
      </TableBody>
    </Table>
  )
}

interface IPropsRow {
  expert: string
  onEdit: (email: string) => void
}

const ExpertRow: FC<IPropsRow> = ({ expert, onEdit }) => {
  return (
    <TableBodyRow>
      <TableBodyCell>{expert}</TableBodyCell>
      <TableBodyCell isCentered>
        <IconButton
          color={"primary"}
          size={"small"}
          onClick={() => onEdit(expert)}
        >
          <EditIcon fontSize={"small"} />
        </IconButton>
      </TableBodyCell>
    </TableBodyRow>
  )
}

const heads = {
  email: "Эл. почта",
}