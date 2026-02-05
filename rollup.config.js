import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

const pkg = {
  name: 'bpmn-js-spiffworkflow',
};

// Peer dependencies that should be externalized
const external = [
  'bpmn-js',
  'bpmn-js-properties-panel',
  'diagram-js',
  '@bpmn-io/properties-panel',
  '@bpmn-io/properties-panel/preact',
  '@bpmn-io/properties-panel/preact/hooks',
  '@bpmn-io/properties-panel/preact/jsx-runtime',
  'min-dash',
  'min-dom',
  'moddle',
  'tiny-svg',
  'react',
  'react-dom',
];

// Mark any import starting with these patterns as external
const externalPredicate = (id) => {
  return (
    external.includes(id) ||
    id.startsWith('bpmn-js/') ||
    id.startsWith('diagram-js/') ||
    id.startsWith('bpmn-js-properties-panel/') ||
    id.startsWith('@bpmn-io/')
  );
};

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/bpmn-js-spiffworkflow.esm.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/bpmn-js-spiffworkflow.umd.js',
      format: 'umd',
      name: 'BpmnJsSpiffworkflow',
      sourcemap: true,
      globals: {
        'bpmn-js': 'BpmnJS',
        'bpmn-js-properties-panel': 'BpmnJsPropertiesPanel',
        'diagram-js': 'DiagramJS',
        '@bpmn-io/properties-panel': 'BpmnIoPropertiesPanel',
        '@bpmn-io/properties-panel/preact': 'preact',
        '@bpmn-io/properties-panel/preact/hooks': 'preactHooks',
        'min-dash': 'minDash',
        'min-dom': 'minDom',
        moddle: 'Moddle',
        'tiny-svg': 'tinySvg',
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
  ],
  external: externalPredicate,
  plugins: [
    json(),
    resolve({
      extensions: ['.js', '.jsx', '.json'],
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx'],
      plugins: [
        [
          '@babel/plugin-transform-react-jsx',
          {
            importSource: '@bpmn-io/properties-panel/preact',
            runtime: 'automatic',
          },
        ],
      ],
    }),
  ],
};
