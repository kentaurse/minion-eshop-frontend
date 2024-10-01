import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
// import style from './ckeditor-styles.css';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function EditorComponent({ editorValue, onEditorChange, status, mode }) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (editorValue) {
      setEditorValue(editorValue);
    }
  }, [status]);

  useEffect(() => {
    if (mode == "add") {
      setDefaultEditorValue();
    }
  }, [status, mode]);

  const setDefaultEditorValue = () => {
    setEditorState(EditorState.createEmpty());
  };

  // Function to handle editor value change
  const handleEditorChange = (state) => {
    setEditorState(state);
    onEditorChange(draftToHtml(convertToRaw(state.getCurrentContent())));
  };

  // Function to set editor value
  const setEditorValue = (value) => {
    const contentBlock = htmlToDraft(value);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
      onEditorChange(value);
    }
  };

  return (
    <div className="border border-gray-300 rounded p-4 break-all mb-4">
      <Editor
        toolbar={{
          options: ["inline", "list", "textAlign"],
          inline: {
            options: [
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "monospace",
            ],
          },
          colorPicker: { inDropdown: true },
        }}
        toolbarClassName={{ "z-index": 9999 }}
        editorState={editorState}
        editorStyle={{ height: "180px" }}
        onEditorStateChange={handleEditorChange}
      />
    </div>
  );
}

export default EditorComponent;
