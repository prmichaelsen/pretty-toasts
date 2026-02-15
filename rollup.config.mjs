import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const createConfig = (input, outputName) => ({
  input,
  output: [
    {
      file: `dist/${outputName}.js`,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: `dist/${outputName}.esm.js`,
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
});

export default [
  // Main entry (includes everything for backward compatibility)
  createConfig('src/index.ts', 'index'),
  
  // Standalone entry (no Redux dependencies)
  createConfig('src/standalone.ts', 'standalone'),
  
  // Redux entry (includes Redux dependencies)
  createConfig('src/redux.ts', 'redux'),
];
