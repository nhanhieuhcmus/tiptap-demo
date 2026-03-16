import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import { PluginKey } from 'prosemirror-state';
import tippy from 'tippy.js';
import SlashCommandsList from '../components/SlashCommandsList';
export const SlashCommands = Extension.create({
  name: 'slashCommands',
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        pluginKey: new PluginKey('slashCommands'),
        char: '/',
        allow: ({ editor, range }) => {
          const $from = editor.state.selection.$from;
          const isInTable = $from.node(-1).type.spec.tableRole === 'row';
          return !isInTable;
        },

        items: ({ query }) => {
          return [
            {
              title: 'Table',
              description: 'Insert a table',
              command: ({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .run();
              },
            },
          ].filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
          );
        },

        render: () => {
          let component;
          let popup;

          return {
            onStart: props => {
              component = new ReactRenderer(SlashCommandsList, {
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
