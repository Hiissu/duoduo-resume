/* eslint-disable no-unused-vars */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { memo, useRef, useState } from "react";
import "./Editor.css";

import { LexicalComposer } from "@lexical/react/LexicalComposer";

import { useSettings } from "./context/SettingsContext";
import { SharedAutocompleteContext } from "./context/SharedAutocompleteContext";
import { SharedHistoryContext } from "./context/SharedHistoryContext";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import { TableContext } from "./plugins/TablePlugin";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";

import { createWebsocketProvider } from "./collaboration";
import { useSharedHistoryContext } from "./context/SharedHistoryContext";
import TableCellNodes from "./nodes/TableCellNodes";
import AutoEmbedPlugin from "./plugins/AutoEmbedPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import ClickableLinkPlugin from "./plugins/ClickableLinkPlugin";
import CodeActionMenuPlugin from "./plugins/CodeActionMenuPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import CollapsiblePlugin from "./plugins/CollapsiblePlugin";
import CommentPlugin from "./plugins/CommentPlugin";
import ComponentPickerPlugin from "./plugins/ComponentPickerPlugin";
import DragDropPaste from "./plugins/DragDropPastePlugin";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import EmojiPickerPlugin from "./plugins/EmojiPickerPlugin";
import EmojisPlugin from "./plugins/EmojisPlugin";
import EquationsPlugin from "./plugins/EquationsPlugin";
import ExcalidrawPlugin from "./plugins/ExcalidrawPlugin";
import FigmaPlugin from "./plugins/FigmaPlugin";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import HorizontalRulePlugin from "./plugins/HorizontalRulePlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import KeywordsPlugin from "./plugins/KeywordsPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import MarkdownShortcutPlugin from "./plugins/MarkdownShortcutPlugin";
import MentionsPlugin from "./plugins/MentionsPlugin";
import PollPlugin from "./plugins/PollPlugin";
import SpeechToTextPlugin from "./plugins/SpeechToTextPlugin";
import TabFocusPlugin from "./plugins/TabFocusPlugin";
import TableCellActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import TableCellResizer from "./plugins/TableCellResizer";
import { TablePlugin as NewTablePlugin } from "./plugins/TablePlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TwitterPlugin from "./plugins/TwitterPlugin";
import YouTubePlugin from "./plugins/YouTubePlugin";
import ContentEditable from "./ui/ContentEditable";
import Placeholder from "./ui/Placeholder";

// import { TableContext } from "./plugins/TablePlugin";

import { CustomOnChangePlugin } from "./";

const CustomPlaceholder = () => {
  // const [editor] = useLexicalComposerContext();
  // useEffect(() => {
  //   const initialEditorState = editor.parseEditorState(JSON.parse(data));
  //   editor.setEditorState(initialEditorState);
  // }, []);
  return <Placeholder>Enter your content...</Placeholder>;
};

const CustomAutoFocusPlugin = () => {
  // const [editor] = useLexicalComposerContext();
  // useEffect(() => {
  //   // Focus the editor when the effect fires!
  //   editor.focus();
  // }, [editor]);
  // return null;
};

const Editor = ({ isReadOnly, content, tooggleReset, onChangeContent }) => {
  const initialConfig = {
    // editorState: prepopulatedRichText,
    readOnly: isReadOnly,
    namespace: "Playground",
    onError: (error) => {
      throw error;
    },
    nodes: [...PlaygroundNodes],
    theme: PlaygroundEditorTheme,
  };

  const scrollRef = useRef(null);
  const { historyState } = useSharedHistoryContext();
  const {
    settings: {
      isCollab,
      isAutocomplete,
      isMaxLength,
      isCharLimit,
      isCharLimitUtf8,
      isRichText,
      showTreeView,
    },
  } = useSettings();

  const [floatingAnchorElem, setFloatingAnchorElem] = useState(null);

  const onRef = (_floatingAnchorElem) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const cellEditorConfig = {
    namespace: "Playground",
    nodes: [...TableCellNodes],
    onError: (error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <TableContext>
          <SharedAutocompleteContext>
            <div className="editor-shell">
              <div className="editor-container" ref={scrollRef}>
                {!isReadOnly && <ToolbarPlugin />}
                <RichTextPlugin
                  contentEditable={
                    <div className="editor" ref={onRef}>
                      <ContentEditable className="editor-input" />
                    </div>
                  }
                  placeholder={<CustomPlaceholder />}
                />
                <CustomOnChangePlugin
                  content={content}
                  tooggleReset={tooggleReset}
                  onChangeContent={onChangeContent}
                />
                {/* <HistoryPlugin externalHistoryState={historyState} /> */}
                {/* {isMaxLength && <MaxLengthPlugin maxLength={30} />} */}
                {/* {isAutocomplete~true && <AutocompletePlugin />} */}

                <DragDropPaste />
                <AutoFocusPlugin />
                <ClearEditorPlugin />
                <ComponentPickerPlugin />
                <EmojiPickerPlugin />
                <AutoEmbedPlugin />
                <MentionsPlugin />
                <EmojisPlugin />
                <HashtagPlugin />
                <KeywordsPlugin />
                <SpeechToTextPlugin />
                <AutoLinkPlugin />
                <CommentPlugin
                  providerFactory={
                    isCollab ? createWebsocketProvider : undefined
                  }
                />
                <MarkdownShortcutPlugin />
                <CodeHighlightPlugin />
                <ListPlugin />
                <CheckListPlugin />
                {/* <ListMaxIndentLevelPlugin maxDepth={7} /> */}
                <TablePlugin />
                <TableCellResizer />
                <NewTablePlugin cellEditorConfig={cellEditorConfig}>
                  <AutoFocusPlugin />
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable className="TableNode__contentEditable" />
                    }
                    placeholder={null}
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <MentionsPlugin />
                  <HistoryPlugin />
                  <ImagesPlugin captionsEnabled={false} />
                  <LinkPlugin />
                  <ClickableLinkPlugin />
                  <FloatingTextFormatToolbarPlugin />
                </NewTablePlugin>
                <ImagesPlugin />
                <LinkPlugin />
                <PollPlugin />
                <TwitterPlugin />
                <YouTubePlugin />
                <FigmaPlugin />
                <ClickableLinkPlugin />
                <HorizontalRulePlugin />
                <EquationsPlugin />
                <ExcalidrawPlugin />
                <TabFocusPlugin />
                <CollapsiblePlugin />
                {floatingAnchorElem && (
                  <>
                    <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                    <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                    <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
                    <TableCellActionMenuPlugin
                      anchorElem={floatingAnchorElem}
                    />
                    <FloatingTextFormatToolbarPlugin
                      anchorElem={floatingAnchorElem}
                    />
                  </>
                )}
                {/* <ActionsPlugin isRichText={true} />  at bottom */}
              </div>
              {/* {showTreeView && <TreeViewPlugin />} */}
            </div>
          </SharedAutocompleteContext>
        </TableContext>
      </SharedHistoryContext>
    </LexicalComposer>
  );
};

export default memo(Editor);
