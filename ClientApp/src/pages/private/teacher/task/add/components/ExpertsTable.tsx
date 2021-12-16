import { FC } from "react";
import { Box, Button, IconButton, TableBody, TableHead, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system"
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { TableBodyCell, TableBodyRow, TableHeadCell, TableHeadRow, Table } from "../../../../../../components/table";


interface IProps {
  experts: Array<string>
  onAdd: () => void,
  onEdit: (expert: string) => void
}

export const ExpertTable: FC<IProps> = ({ experts, onAdd, onEdit }) => {
  return (
    <>
      <Table>
        <TableHead>
          <TableHeadRow>
            <TableHeadCell>{heads.email}</TableHeadCell>
            <TableHeadCell isCentered isButton>{
              <Button
                sx={styles.addBt}
                type={"button"}
                variant={"text"}
                onClick={() => onAdd()}
                size={"small"}
                startIcon={
                  <AddIcon
                    sx={{ color: "primary.main" }}
                    fontSize={"small"}
                  />}
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

      {experts.length === 0 && (
        <Box sx={styles.emptyContainer}>
          <Typography variant={"body1"} sx={styles.emptyText}>
            {"Добавьте эксперта"}
          </Typography>
        </Box>
      )}
    </>
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

const styles = {
  addBt: {
    fontWeight: 700,
    color: "primary.main",
    fontSize: "14px",
    padding: "2px 4px",
    borderRadius: "7px",
    ":hover": {
      color: "primary.main",
    }
  } as SxProps<Theme>,
  emptyText: {
    padding: "10px 0px"
  } as SxProps<Theme>,
  emptyContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    margin: "5px 0px 0px 0px",
    backgroundColor: "common.white",
    borderRadius: "5px"
  } as SxProps<Theme>,
}