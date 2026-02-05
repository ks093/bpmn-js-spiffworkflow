# Development Guide: ES Module Fork

This fork converts `bpmn-js-spiffworkflow` to native ES Modules for use with modern bundlers like Vite and Webpack 5+.

## What Changed

| Change              | Details                                     |
| ------------------- | ------------------------------------------- |
| **Module Format**   | Added ESM output alongside UMD              |
| **Build Tool**      | Webpack → Rollup for library builds         |
| **Source Location** | `app/spiffworkflow/` → `src/spiffworkflow/` |
| **Entry Point**     | New `src/index.js` with named exports       |
| **Package Type**    | Added `"type": "module"` to package.json    |

## Build

```bash
npm install
npm run build
```

**Output:**

- `dist/bpmn-js-spiffworkflow.esm.js` - ES Module
- `dist/bpmn-js-spiffworkflow.umd.js` - UMD (CommonJS/AMD)

## Usage in Vue.js (Vite)

### 1. Link the Fork

```bash
# Build and link
cd /path/to/bpmn-js-spiffworkflow
npm run build
npm link

# In your Vue app
cd /path/to/your-vue-app
npm link bpmn-js-spiffworkflow
```

### 2. Install Peer Dependencies

```bash
npm install bpmn-js bpmn-js-properties-panel diagram-js @bpmn-io/properties-panel
```

### 3. Import in Component

```vue
<script setup>
import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import spiffworkflow, { spiffModdleExtension } from 'bpmn-js-spiffworkflow';

// CSS
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';

const modeler = new BpmnModeler({
  container: '#canvas',
  propertiesPanel: { parent: '#properties' },
  additionalModules: [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    spiffworkflow,
  ],
  moddleExtensions: {
    spiffworkflow: spiffModdleExtension,
  },
});
</script>
```

## Available Exports

```javascript
// Default: Complete bpmn-js module
import spiffworkflow from 'bpmn-js-spiffworkflow';

// Named exports
import {
  spiffworkflow, // Same as default
  spiffModdleExtension, // Moddle schema
  // Individual providers for tree-shaking:
  DataObjectPropertiesProvider,
  MessagesPropertiesProvider,
  ExtensionsPropertiesProvider,
  // ... etc
} from 'bpmn-js-spiffworkflow';
```

## Tests

```bash
npm test  # Requires Chrome/Chromium
```

## File Structure

```
src/
├── index.js                    # Library entry point
└── spiffworkflow/
    ├── index.js                # Main module
    ├── moddle/spiffworkflow.json
    ├── DataObject/
    ├── messages/
    ├── extensions/
    └── ...
dist/
├── bpmn-js-spiffworkflow.esm.js
└── bpmn-js-spiffworkflow.umd.js
```
