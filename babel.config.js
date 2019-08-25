module.exports = {
  presets: [
    [
      require('@babel/preset-env').default,
      {
        loose: true,
        modules: 'cjs',
        targets: {
          node: 'current'
        }
      }
    ]
  ],
  plugins: [
    [
      require('@babel/plugin-proposal-class-properties').default,
      {
        loose: true
      }
    ],
    [
      require('@babel/plugin-transform-runtime').default,
      {helper: true}
    ],
    require('@babel/plugin-proposal-export-default-from').default,
  ]
};