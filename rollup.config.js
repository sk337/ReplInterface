import dts from 'rollup-plugin-dts'
import copy from 'rollup-plugin-copy'

import { writeFile, mkdir } from 'fs/promises'

function createCommonJsPackage() {
  const pkg = { type: 'commonjs' }
  return {
    name: 'cjs-package',
    buildEnd: async () => {
      await mkdir('./dist/cjs', { recursive: true })
      await writeFile('./dist/cjs/package.json', JSON.stringify(pkg, null, 2))
    }
  }
}

export default [
  {
    input: './src/index.js',
    plugins: [
      copy({
        targets: [
          { src: './package.json', dest: 'dist' }
        ]
      }),
      createCommonJsPackage()
    ],
    output: [
      { format: 'es', file: './dist/esm/index.js' },
      { format: 'cjs', file: './dist/cjs/index.js' }
    ]
  },
  {
    input: './src/index.js',
    plugins: [ dts() ],
    output: {
      format: 'es',
      file: './dist/index.d.ts'
    }
  }
]
