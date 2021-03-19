module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Embedded Tweet',
  addFields: [
    {
      label: 'Tweet Embed Code',
      htmlHelp: `<p>Code obtained when <a href="https://help.twitter.com/en/using-twitter/how-to-embed-a-tweet">embedding a tweet.</a>.<p>
        <p>⚠️ Extremely important: <u>Do not</u> enter any other embedding code here!`,
      name: 'tweetCode',
      type: 'string',
      textarea: true,
      required: true,
    },
  ],
};
