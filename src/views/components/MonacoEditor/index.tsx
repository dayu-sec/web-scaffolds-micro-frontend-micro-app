import './monaco-workers';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { EditorProps } from '@monaco-editor/react';
import Editor, { loader } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor';
import styles from './Editor.module.css';

// 配置 Monaco Editor 使用本地资源而非 CDN
loader.config({ monaco });

export interface MonacoEditorRef {
  /**
   * 读取当前编辑器内容。
   */
  getValue: () => string;
  /**
   * 覆盖当前编辑器内容。
   */
  setValue: (value: string) => void;
}

/**
 * 包装 Monaco Editor，并通过 ref 暴露最小编辑器读写能力。
 */
const MonacoEditor = forwardRef<MonacoEditorRef, EditorProps>((props, ref) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return editorRef.current?.getValue() ?? '';
    },
    setValue: (value: string) => {
      editorRef.current?.setValue(value);
    },
  }));

  /**
   * 编辑器挂载后保存实例，供 ref 方法访问。
   */
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      className={styles.Editor}
      {...props}
      onMount={handleEditorDidMount}
      options={{
        ...props.options,
        folding: true,
        showFoldingControls: 'always',
        foldingHighlight: true,
        foldingStrategy: 'indentation',
      }}
    />
  );
});

export default MonacoEditor;
