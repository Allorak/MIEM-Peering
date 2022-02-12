import { FC } from "react";
import { Box, Tooltip } from "@mui/material";
import { Editor } from 'react-draft-wysiwyg';


export const TextPreview: FC = () => {
  return (
    <Tooltip
      title={"Это всего лишь предварительный просмотр"}
      placement={"top"}
    >
      <Box
        sx={{
          backgroundColor: 'common.white',
          border: '1px solid',
          borderColor: 'divider',
          padding: '5px',
          boxSizing: 'border-box',
          borderRadius: '5px',
          position: 'relative'
        }}
      >

        <Editor
          wrapperClassName={"demo-wrapper"}
          toolbarClassName={"text-editor-toolbar-editable-fill"}
          editorStyle={{
            backgroundColor: 'common.white',
            border: '1px solid #E0E7FF',
            minHeight: '150px',
            borderRadius: '5px',
            boxSizing: 'border-box',
          }}
          localization={{
            locale: 'ru'
          }}
          readOnly
        />

        <Box
          position={'absolute'}
          zIndex={1}
          sx={{
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'unset',
            ":hover": {
              cursor: 'not-allowed'
            }
          }}
        />
      </Box>
    </Tooltip>
  )
}