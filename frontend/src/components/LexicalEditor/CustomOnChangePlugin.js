import React, { useEffect, useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

const CustomOnChangePlugin = ({ content, tooggleReset, onChangeContent }) => {
  const [editor] = useLexicalComposerContext();
  // const [serializedEditorState, setSerializedEditorState] = useState(null);

  useEffect(() => {
    if (content) {
      const initialEditorState = editor.parseEditorState(JSON.parse(content));
      editor.setEditorState(initialEditorState);
    }
    editor.focus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tooggleReset]);

  const onChange = useCallback(
    (editorState) => {
      const newEditorState = JSON.stringify(editorState.toJSON());
      // setSerializedEditorState(newEditorState);
      onChangeContent(newEditorState);
    },
    [onChangeContent]
  );
  return <OnChangePlugin onChange={onChange} />;
};

export default CustomOnChangePlugin;
