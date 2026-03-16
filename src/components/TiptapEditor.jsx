import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { ParameterNode } from '../extensions/ParameterNode';
import { SlashCommands } from '../extensions/SlashCommands';
import { ParamSlashCommand } from '../extensions/ParamSlashCommand';
import { DynamicTablePlugin } from '../extensions/DynamicTablePlugin';

const TiptapEditor = ({ seatData }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      ParameterNode,
      SlashCommands,
      ParamSlashCommand,
      DynamicTablePlugin.configure({
        seatData: seatData,
      }),
    ],
    content: `
      <p>Type <strong>/</strong> to insert a table, then type <strong>@</strong> in header cells to add parameters.</p>
      <p>After insert a params like <code>@seat_code</code>, it should auto-generate ${seatData.length} rows based on data.</p>
      <br />
    `,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-wrapper">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
