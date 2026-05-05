/**
 * bpmn-js-spiffworkflow - ES Module Entry Point
 *
 * SpiffWorkflow extensions for bpmn-js providing custom properties panels,
 * interceptors, and renderers for BPMN elements.
 */

// Main bpmn-js module (default export for BpmnModeler.additionalModules)
export { default } from './spiffworkflow/index.js';

// Named export for explicit imports
export { default as spiffworkflow } from './spiffworkflow/index.js';

// Moddle extension schema for moddleExtensions config
export { default as spiffModdleExtension } from './spiffworkflow/moddle/spiffworkflow.json';

// Re-export individual providers for tree-shaking if consumers want specific ones
export { default as DataObjectPropertiesProvider } from './spiffworkflow/DataObject/propertiesPanel/DataObjectPropertiesProvider.js';
export { default as DataStorePropertiesProvider } from './spiffworkflow/DataStoreReference/propertiesPanel/DataStorePropertiesProvider.js';
export { default as ConditionsPropertiesProvider } from './spiffworkflow/conditions/propertiesPanel/ConditionsPropertiesProvider.js';
export { default as ExtensionsPropertiesProvider } from './spiffworkflow/extensions/propertiesPanel/ExtensionsPropertiesProvider.jsx';
export { default as MessagesPropertiesProvider } from './spiffworkflow/messages/propertiesPanel/MessagesPropertiesProvider.js';
export { default as SignalPropertiesProvider } from './spiffworkflow/signals/propertiesPanel/SignalPropertiesProvider.js';
export { default as ErrorPropertiesProvider } from './spiffworkflow/errors/propertiesPanel/ErrorPropertiesProvider.js';
export { default as EscalationPropertiesProvider } from './spiffworkflow/escalations/propertiesPanel/EscalationPropertiesProvider.js';
export { default as CallActivityPropertiesProvider } from './spiffworkflow/callActivity/propertiesPanel/CallActivityPropertiesProvider.js';
export { default as IoPropertiesProvider } from './spiffworkflow/InputOutput/propertiesProvider/IoPropertiesProvider.js';
export { default as StandardLoopPropertiesProvider } from './spiffworkflow/loops/StandardLoopPropertiesProvider.js';
export { default as MultiInstancePropertiesProvider } from './spiffworkflow/loops/MultiInstancePropertiesProvider.js';
