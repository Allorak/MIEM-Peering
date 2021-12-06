import { FormControl, MenuItem, Select, SelectProps } from "@mui/material";
import { FC } from "react";
import { ICatalog } from "../../store/types";

interface IProps extends SelectProps {
  items: ICatalog[]
}

export const TextSelect: FC<IProps> = ({
  items,
  ...props
}) => {
  return (
    <FormControl fullWidth>
      <Select
        value={props.value}
        {...props}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            value={item.id}
          >
            {item.name}
          </MenuItem>
        ))}

      </Select>
    </FormControl>
  )
}