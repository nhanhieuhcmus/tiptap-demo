import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import { PluginKey } from 'prosemirror-state';
import tippy from 'tippy.js';
import ParamCommandsList from '../components/ParamCommandsList';

export const ParamSlashCommand = Extension.create({
  name: 'paramSlashCommand',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        pluginKey: new PluginKey('paramSlashCommand'),
        char: '@',

        allow: ({ editor, range }) => {
          const $from = editor.state.selection.$from;
          const isInTableCell = $from.node(-1).type.spec.tableRole === 'cell' || 
                               $from.node(-1).type.spec.tableRole === 'header_cell';
          
          // Check if we're in the first row (header row)
          if (isInTableCell) {
            const table = $from.node(-3);
            const row = $from.node(-2);
            if (table && row) {
              const firstRow = table.child(0);
              return row === firstRow;
            }
          }
          
          return false;
        },

        items: ({ query }) => {
          const params = [
            {
              paramName: 'seat_code',
              label: 'Mã ghế',
              description: 'Seat code (A01, A02, ...)',
            },
            {
              paramName: 'passenger_name',
              label: 'Tên hành khách',
              description: 'Passenger name',
            },
            {
              paramName: 'status',
              label: 'Trạng thái',
              description: 'Booking status',
            },
          ];

          return params.filter(
            item =>
              item.paramName.toLowerCase().includes(query.toLowerCase()) ||
              item.label.toLowerCase().includes(query.toLowerCase())
          );
        },

        render: () => {
          let component;
          let popup;
          return {
            onStart: props => {
              component = new ReactRenderer(ParamCommandsList, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) {
                return;
              }

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              });
            },

            onUpdate(props) {
              component.updateProps(props);

              if (!props.clientRect) {
                return;
              }

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
            },

            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                popup[0].hide();
                return true;
              }
              return component.ref?.onKeyDown(props);
            },
            onExit() {
              popup[0].destroy();
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});
