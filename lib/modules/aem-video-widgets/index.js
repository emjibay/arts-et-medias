module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Video',
  addFields: [
    {
      label: 'Type',
      name: 'videoType',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'Vimeo',
          value: 'vimeo',
        },
        {
          label: 'YouTube',
          value: 'youtube',
        },
        {
          label: 'TF1',
          value: 'tf1',
        },
      ],
    },
    {
      label: 'Video ID',
      help: '',
      name: 'videoId',
      type: 'string',
      required: true,
    },
    {
      label: 'Caption',
      name: 'caption',
      type: 'string',
      required: true,
    },
  ],
};
