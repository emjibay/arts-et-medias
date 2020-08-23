module.exports = (self) => {
  self.pushAssets = () => {
    self.pushAsset('script', 'always', { when: 'always', });
    self.apos.push.browserCall('always', 'apos.searchSuggestions = ?', self.options.suggestions);
  };
};
