import { FC, useCallback, useMemo, useState } from "react";
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from "draftjs-to-html";
import { Box, Typography } from "@mui/material";
import { EditorState, convertFromHTML, ContentState, convertToRaw } from "draft-js";

import "./style.css"


interface IProps {
  value?: string
  onEdit: (value: string | undefined, id: string) => void,
  required: boolean,
  id: string
}

export const TextEditable: FC<IProps> = ({ value, onEdit, required, id }) => {

  const contentDataState = useMemo(() => {
    if (value) {
      const htmlFromString = convertFromHTML(value)
      return ContentState.createFromBlockArray(htmlFromString.contentBlocks, htmlFromString.entityMap)
    }
  }, [value])

  const [editorState, setEditorState] = useState(contentDataState ?
    EditorState.createWithContent(contentDataState) :
    EditorState.createEmpty()
  )

  const hasText = useMemo(() => {
    if (required) {
      return editorState.getCurrentContent().hasText()
    }
    return true
  }, [required, editorState])

  const handleEditorStateChange = useCallback((e: EditorState) => {
    const htmlFromEdtidorState = draftToHtml(convertToRaw(e.getCurrentContent()))

    setEditorState(e)

    const newEditorHasText = e.getCurrentContent().hasText()

    if (value !== htmlFromEdtidorState) {
      onEdit(htmlFromEdtidorState && newEditorHasText ? htmlFromEdtidorState : undefined, id)
    }
  }, [id, onEdit, value, hasText])

  return (
    <Box
      sx={{
        backgroundColor: 'common.white',
        border: '1px solid',
        borderColor: 'divider',
        padding: '5px',
        boxSizing: 'border-box',
        borderRadius: '5px'
      }}
    >

      <Editor
        editorState={editorState}
        wrapperClassName={"demo-wrapper"}
        toolbarClassName={"text-editor-toolbar-editable-fill"}
        editorClassName={hasText ? 'text-editor-editable-fill' : 'text-editor-editable-error'}
        onEditorStateChange={handleEditorStateChange}
        localization={{
          locale: 'ru'
        }}
      />

      {!hasText && (
        <Typography
          variant={'body2'}
          color={'error.main'}
          ml={'15px'}
        >
          {"Это обязательное поле"}
        </Typography>
      )}
    </Box>

  )
}