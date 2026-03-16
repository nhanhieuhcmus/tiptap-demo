import { Node, mergeAttributes } from "@tiptap/core";

export const ParameterNode = Node.create({
  name: "dataParam",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      paramName: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-param-name"),
        renderHTML: (attributes) => {
          return {
            "data-param-name": attributes.paramName,
          };
        },
      },
      label: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-param-label"),
        renderHTML: (attributes) => {
          return {
            "data-param-label": attributes.label,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-param-name]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { class: "data-param" }),
      `{{${HTMLAttributes["data-param-name"]}}}`,
    ];
  },

  addCommands() {
    return {
      insertParameter:
        (paramName, label) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { paramName, label },
          });
        },
    };
  },
});
