import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    // Automatically externalize peer dependencies
    peerDepsExternal(),
    
    // Resolve node_modules
    resolve(),
    
    // Convert CommonJS modules to ES6
    commonjs(),
    
    // Compile TypeScript
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
      exclude: ['**/*.stories.tsx', '**/*.test.ts', '**/*.spec.ts', 'src/stories/**/*'],
    }),
  ],
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@reduxjs/toolkit',
    'react-redux',
  ],
};
