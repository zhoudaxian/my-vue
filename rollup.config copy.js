import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const isDev = process.env.NODE_ENV === 'development'

const devPlugin = [
  serve({
    open: true,
    openPage: '/public/index.html',
    port: 3000,
    contentBase: ''
  }),
  livereload()
]

const config = {
  input: './src/index.js',
  output: {
    file: 'dist/umd/vue.js',
    name: 'Vue',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    })
  ]
}

isDev && config.plugins.concat(devPlugin)

export default config
