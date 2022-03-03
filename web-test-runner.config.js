import vite from 'vite-web-test-runner-plugin'

process.env.NODE_ENV = 'test'
export default {
  plugins: [vite()]
}
