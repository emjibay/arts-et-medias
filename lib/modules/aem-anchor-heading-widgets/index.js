module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Anchor Heading',
  addFields: [
    {
      label: 'Heading',
      name: 'heading',
      type: 'string',
      required: true,
    },
    {
      label: 'Heading Level',
      name: 'level',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'Heading 2',
          value: 'level-2',
        },
        {
          label: 'Heading 3',
          value: 'level-3',
        },
        {
          label: 'Heading 4',
          value: 'level-4',
        },
      ],
    },
    {
      label: 'Anchor ID',
      htmlHelp: '<p>This variable <u>must</u> be unique per page, otherwise the anchor link will not work.<p>'
        + '<p>⚠️ Ensure to use <a href="https://en.wikipedia.org/wiki/Letter_case#Special_case_styles">Kebab Case</a> to create this value.</p>',
      name: 'anchor',
      type: 'string',
      required: true,
    },
  ],
};
