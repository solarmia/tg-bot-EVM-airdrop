module.exports = {
  apps: [
    {
      name: 'shopping-bot',
      script: './dist/index.js',
      watch: true,
      ignore_watch: ['node_modules', 'public', '*.ts'],
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};