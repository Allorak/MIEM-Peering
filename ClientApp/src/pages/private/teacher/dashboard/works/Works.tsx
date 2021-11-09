import { FC } from "react";
import { Box } from "@mui/system";

import { IWorkItem } from "../../../../../store/types";


export const Works: FC = () => {
  return (
    <Box>
      {/* левая панель */}
      <Box>
        
      </Box>
      
      {/* правая панель */}
      <Box>

      </Box>
    </Box>
  )
}

const data:IWorkItem[] = [{
  id: "lakskasklas",
  responses: [],
  author: {
    name: "Ларианна Казмерчук (тупая пизда)",
    id: "69 (.) (.)"
  } 
}]