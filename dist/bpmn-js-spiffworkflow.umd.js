(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('diagram-js/lib/features/rules'), require('min-dash'), require('diagram-js/lib/i18n/translate/translate'), require('diagram-js/lib/features/rules/RuleProvider'), require('diagram-js/lib/command/CommandInterceptor'), require('diagram-js/lib/util/Collections'), require('diagram-js/lib/util/IdGenerator'), require('bpmn-js/lib/util/ModelUtil'), require('diagram-js/lib/draw/BaseRenderer'), require('tiny-svg'), require('bpmn-js/lib/features/modeling/util/ModelingUtil'), require('@bpmn-io/properties-panel'), require('react'), require('bpmn-js-properties-panel'), require('@bpmn-io/properties-panel/preact/jsx-runtime'), require('@bpmn-io/properties-panel/preact/hooks'), require('bpmn-js/lib/util/DiUtil')) :
  typeof define === 'function' && define.amd ? define(['exports', 'diagram-js/lib/features/rules', 'min-dash', 'diagram-js/lib/i18n/translate/translate', 'diagram-js/lib/features/rules/RuleProvider', 'diagram-js/lib/command/CommandInterceptor', 'diagram-js/lib/util/Collections', 'diagram-js/lib/util/IdGenerator', 'bpmn-js/lib/util/ModelUtil', 'diagram-js/lib/draw/BaseRenderer', 'tiny-svg', 'bpmn-js/lib/features/modeling/util/ModelingUtil', '@bpmn-io/properties-panel', 'react', 'bpmn-js-properties-panel', '@bpmn-io/properties-panel/preact/jsx-runtime', '@bpmn-io/properties-panel/preact/hooks', 'bpmn-js/lib/util/DiUtil'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.BpmnJsSpiffworkflow = {}, global.RulesModule, global.minDash, global.translate, global.RuleProvider, global.CommandInterceptor, global.Collections, global.IdGenerator, global.ModelUtil, global.BaseRenderer, global.tinySvg, global.ModelingUtil, global.BpmnIoPropertiesPanel, global.React, global.BpmnJsPropertiesPanel, global.jsxRuntime, global.preactHooks, global.DiUtil));
})(this, (function (exports, RulesModule, minDash, translate, RuleProvider, CommandInterceptor, Collections, IdGenerator, ModelUtil, BaseRenderer, tinySvg, ModelingUtil, propertiesPanel, react, bpmnJsPropertiesPanel, jsxRuntime, hooks, DiUtil) { 'use strict';

  /**
   * Add data inputs and data outputs to the panel.
   */
  function IoPalette(palette, create, elementFactory) {
    this._create = create;
    this._elementFactory = elementFactory;
    palette.registerProvider(this);
  }
  IoPalette.$inject = ['palette', 'create', 'elementFactory'];
  IoPalette.prototype.getPaletteEntries = function () {
    let input_type = 'bpmn:DataInput';
    let output_type = 'bpmn:DataOutput';
    let elementFactory = this._elementFactory,
      create = this._create;
    function createListener(event, type) {
      let shape = elementFactory.createShape(minDash.assign({
        type: type
      }, {}));
      shape.width = 36; // Fix up the shape dimensions from the defaults.
      shape.height = 50;
      create.start(event, shape);
    }
    function createInputListener(event) {
      createListener(event, input_type);
    }
    function createOutputListener(event) {
      createListener(event, output_type);
    }
    return {
      'create.data-input': {
        group: 'data-object',
        className: 'bpmn-icon-data-input',
        title: translate('Create DataInput'),
        action: {
          dragstart: createInputListener,
          click: createInputListener
        }
      },
      'create.data-output': {
        group: 'data-object',
        className: 'bpmn-icon-data-output',
        title: translate('Create DataOutput'),
        action: {
          dragstart: createOutputListener,
          click: createOutputListener
        }
      }
    };
  };

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var inherits$1 = {exports: {}};

  var inherits_browser = {exports: {}};

  var hasRequiredInherits_browser;

  function requireInherits_browser () {
  	if (hasRequiredInherits_browser) return inherits_browser.exports;
  	hasRequiredInherits_browser = 1;
  	if (typeof Object.create === 'function') {
  	  // implementation from standard node.js 'util' module
  	  inherits_browser.exports = function inherits(ctor, superCtor) {
  	    if (superCtor) {
  	      ctor.super_ = superCtor;
  	      ctor.prototype = Object.create(superCtor.prototype, {
  	        constructor: {
  	          value: ctor,
  	          enumerable: false,
  	          writable: true,
  	          configurable: true
  	        }
  	      });
  	    }
  	  };
  	} else {
  	  // old school shim for old browsers
  	  inherits_browser.exports = function inherits(ctor, superCtor) {
  	    if (superCtor) {
  	      ctor.super_ = superCtor;
  	      var TempCtor = function () {};
  	      TempCtor.prototype = superCtor.prototype;
  	      ctor.prototype = new TempCtor();
  	      ctor.prototype.constructor = ctor;
  	    }
  	  };
  	}
  	return inherits_browser.exports;
  }

  var hasRequiredInherits;

  function requireInherits () {
  	if (hasRequiredInherits) return inherits$1.exports;
  	hasRequiredInherits = 1;
  	try {
  	  var util = require('util');
  	  /* istanbul ignore next */
  	  if (typeof util.inherits !== 'function') throw '';
  	  inherits$1.exports = util.inherits;
  	} catch (e) {
  	  /* istanbul ignore next */
  	  inherits$1.exports = requireInherits_browser();
  	}
  	return inherits$1.exports;
  }

  var inheritsExports = requireInherits();
  var inherits = /*@__PURE__*/getDefaultExportFromCjs(inheritsExports);

  const HIGH_PRIORITY$6 = 1500;

  /**
   * A custom rule provider that will permit Data Inputs and Data
   * Outputs to be placed within a process element (something BPMN.io currently denies)
   *
   * See {@link BpmnRules} for the default implementation
   * of BPMN 2.0 modeling rules provided by bpmn-js.
   *
   * @param {EventBus} eventBus
   */
  function IoRules(eventBus) {
    RuleProvider.call(this, eventBus);
  }
  inherits(IoRules, RuleProvider);
  IoRules.$inject = ['eventBus'];
  IoRules.prototype.init = function () {
    this.addRule('shape.create', HIGH_PRIORITY$6, function (context) {
      let element = context.shape;
      let target = context.target;
      context.position;
      return canCreate(element, target);
    });
  };

  /**
   * Allow folks to drop a dataInput or DataOutput only on the top level process.
   */
  function canCreate(element, target, position) {
    if (['bpmn:DataInput', 'bpmn:DataOutput'].includes(element.type)) {
      if (target.type == 'bpmn:Process') {
        return true;
      }
    }
  }
  IoRules.prototype.canCreate = canCreate;

  var HIGH_PRIORITY$5 = 1500;

  /**
   * This Command Interceptor functions like the BpmnUpdator in BPMN.js - It hooks into events
   * from Diagram.js and updates the underlying BPMN model accordingly.
   *
   * This handles the case where a new DataInput or DataOutput is added to
   * the diagram, it assures that a place exists for the new Data object to go, and it places it there.
   * There were a number of paces where I had to patch things in to get it to work correctly:
   *   * Create a InputOutputSpecification on the BPMN Moddle if it doesn't exist.
   *   * Correctly connect a new DI (display element in BPMN xml) for the input/output element.
   *   * Create a new DataInput/DataOutput Object (maybe incorrectly)
   * Also handles delete, where it removes the objects from the BPMN Moddle (both the actual input/output and the DI)
   * fixme:  Assure that we need to create a new DataInput object here, already in IoPalette's call to ElementFactory
   * fixme:  If all inputs and outputs are deleted, remove the InputOutputSpecification completely.
   */
  class IoInterceptor extends CommandInterceptor {
    constructor(eventBus, bpmnFactory, bpmnUpdater) {
      super(eventBus);
      this.execute(['shape.create'], HIGH_PRIORITY$5, function (event) {
        let context = event.context;
        if (['bpmn:DataInput', 'bpmn:DataOutput'].includes(context.shape.type)) {
          let type = context.shape.type;
          let type_name = type.split(':')[1];
          let process = context.parent.businessObject;
          let ioSpec = assureIOSpecificationExists(process, bpmnFactory);
          let di = context.shape.di;
          let generator = new IdGenerator(type_name);
          let dataIO = bpmnFactory.create(type, {
            id: generator.next()
          });
          context.shape.businessObject = dataIO;
          dataIO.$parent = ioSpec;
          di.businessObject = dataIO;
          di.bpmnElement = dataIO;
          di.id = dataIO.id + 'DI';
          bpmnUpdater.updateBounds(context.shape);
          if (type == 'bpmn:DataInput') {
            Collections.add(ioSpec.inputSets[0].get('dataInputRefs'), dataIO);
            Collections.add(ioSpec.get('dataInputs'), dataIO);
          } else {
            Collections.add(ioSpec.outputSets[0].get('dataOutputRefs'), dataIO);
            Collections.add(ioSpec.get('dataOutputs'), dataIO);
          }
        }
      });
      this.execute(['shape.delete'], HIGH_PRIORITY$5, function (event) {
        let context = event.context;
        if (['bpmn:DataInput', 'bpmn:DataOutput'].includes(context.shape.type)) {
          let type = context.shape.type;
          let process = context.shape.parent.businessObject;
          let ioSpec = assureIOSpecificationExists(process, bpmnFactory);
          if (type == 'bpmn:DataInput') {
            Collections.remove(ioSpec.inputSets[0].get('dataInputRefs'), context.shape.businessObject);
            Collections.remove(ioSpec.get('dataInputs'), context.shape.businessObject);
          } else {
            Collections.remove(ioSpec.outputSets[0].get('dataOutputRefs'), context.shape.businessObject);
            Collections.remove(ioSpec.get('dataOutputs'), context.shape.businessObject);
          }
          if (context.shape.di.$parent) {
            Collections.remove(context.shape.di.$parent.planeElement, context.shape.di);
          }
          if (ioSpec.dataInputs.length === 0 && ioSpec.dataOutputs.length === 0) {
            process.ioSpecification = null;
          }
        }
      });

      // Stop propagation on executed, to avoid the BpmnUpdator.js from causing errors.
      this.executed(['shape.delete', 'shape.create'], HIGH_PRIORITY$5, function (event) {
        if (['bpmn:DataInput', 'bpmn:DataOutput'].includes(event.context.shape.type)) {
          event.stopPropagation(); // Don't let the main code execute, it will fail.
        }
      });
    }
  }

  /**
   *       <bpmndi:BPMNShape id="dataInput_1" bpmnElement="ID_3">
   *         <dc:Bounds x="152" y="195" width="36" height="50" />
   *         <bpmndi:BPMNLabel>
   *           <dc:Bounds x="142" y="245" width="56" height="14" />
   *         </bpmndi:BPMNLabel>
   *       </bpmndi:BPMNShape>
   * @param process
   * @param bpmnFactory
   * @returns {bpmn:InputOutputSpecification}
   */

  function assureIOSpecificationExists(process, bpmnFactory) {
    let ioSpecification = process.get('ioSpecification');
    if (!ioSpecification) {
      let inputSet = bpmnFactory.create('bpmn:InputSet');
      let outputSet = bpmnFactory.create('bpmn:OutputSet');

      // Create the BPMN
      ioSpecification = bpmnFactory.create('bpmn:InputOutputSpecification', {
        dataInputs: [],
        inputSets: [inputSet],
        dataOutputs: [],
        outputSets: [outputSet]
      });
      ioSpecification.$parent = process;
      process.ioSpecification = ioSpecification;
    }
    return ioSpecification;
  }
  IoInterceptor.$inject = ['eventBus', 'bpmnFactory', 'bpmnUpdater'];

  /**
   * Returns the moddelElement if it is a process, otherwise, returns the
   *
   * @param container
   */

  function findDataObjects(parent, dataObjects) {
    if (typeof dataObjects === 'undefined') dataObjects = [];
    let process;
    if (!parent) {
      return [];
    }
    if (parent.processRef) {
      process = parent.processRef;
    } else {
      process = parent;
      if (process.$type === 'bpmn:SubProcess') findDataObjects(process.$parent, dataObjects);
    }
    if (typeof process.flowElements !== 'undefined') {
      for (const element of process.flowElements) {
        if (element.$type === 'bpmn:DataObject') dataObjects.push(element);
      }
    }
    return dataObjects;
  }
  function findDataObject(process, id) {
    for (const dataObj of findDataObjects(process)) {
      if (dataObj.id === id) {
        return dataObj;
      }
    }
  }
  function findDataObjectReferences(children, dataObjectId) {
    if (children == null) {
      return [];
    }
    return children.flatMap(child => {
      if (child.$type == 'bpmn:DataObjectReference' && child.dataObjectRef.id == dataObjectId) return [child];else if (child.$type == 'bpmn:SubProcess') return findDataObjectReferences(child.get('flowElements'), dataObjectId);else return [];
    });
  }
  function findDataObjectReferenceShapes(children, dataObjectId) {
    return children.flatMap(child => {
      if (child.type == 'bpmn:DataObjectReference' && child.businessObject.dataObjectRef.id == dataObjectId) return [child];else if (child.type == 'bpmn:SubProcess') return findDataObjectReferenceShapes(child.children, dataObjectId);else return [];
    });
  }
  function idToHumanReadableName(id) {
    const words = id.match(/[A-Za-z][a-z]*|[0-9]+/g) || [id];
    return words.map(capitalize).join(' ');
    function capitalize(word) {
      return word.charAt(0).toUpperCase() + word.substring(1);
    }
  }
  function updateDataObjectReferencesName(parent, nameValue, dataObjectId, commandStack) {
    const references = findDataObjectReferenceShapes(parent.children, dataObjectId);
    for (const ref of references) {
      const stateName = ref.businessObject.dataState && ref.businessObject.dataState.name ? ref.businessObject.dataState.name : '';
      const newName = stateName ? `${nameValue} [${stateName}]` : nameValue;
      commandStack.execute('element.updateProperties', {
        element: ref,
        moddleElement: ref.businessObject,
        properties: {
          name: newName
        },
        changed: [ref]
      });
    }
  }

  const HIGH_PRIORITY$4 = 1500;

  /**
   * This Command Interceptor functions like the BpmnUpdator in BPMN.js - It hooks into events
   * from Diagram.js and updates the underlying BPMN model accordingly.
   *
   * This handles some special cases we want to handle for DataObjects and DataObjectReferences,
   * for instance:
   * 1) Use existing data objects if possible when creating a new reference (don't create new objects each time)
   * 2) Don't automatically delete a data object when you delete the reference - unless all references are removed.
   * 3) Update the name of the DataObjectReference to match the id of the DataObject.
   * 4) Don't allow someone to move a DataObjectReference from one process to another process.
   */
  class DataObjectInterceptor extends CommandInterceptor {
    constructor(eventBus, bpmnFactory, commandStack, bpmnUpdater) {
      super(eventBus);

      /* The default behavior is to move the data object into whatever object the reference is being created in.
       * If a data object already has a parent, don't change it.
       */
      bpmnUpdater.updateSemanticParent = (businessObject, parentBusinessObject) => {
        // Special case for participant - which is a valid place to drop a data object, but it needs to be added
        // to the particpant's Process (which isn't directly accessible in BPMN.io
        let realParent = parentBusinessObject;
        if (ModelUtil.is(realParent, 'bpmn:Participant')) {
          realParent = realParent.processRef;
        }
        if (ModelUtil.is(businessObject, 'bpmn:DataObjectReference')) {
          // For data object references, always update the flowElements when a parent is provided
          // The parent could be null if it's being deleted, and I could probably handle that here instead of
          // when the shape is deleted, but not interested in refactoring at the moment.
          if (realParent != null) {
            const flowElements = realParent.get('flowElements');
            const existingElement = flowElements.find(i => i.id === 1);
            if (!existingElement) {
              flowElements.push(businessObject);
            }
          }
        } else if (ModelUtil.is(businessObject, 'bpmn:DataObject')) {
          // For data objects, only update the flowElements for new data objects, and set the parent so it doesn't get moved.
          if (typeof businessObject.$parent === 'undefined') {
            const flowElements = realParent.get('flowElements');
            flowElements.push(businessObject);
            businessObject.$parent = realParent;
          }
        } else {
          bpmnUpdater.__proto__.updateSemanticParent.call(bpmnUpdater, businessObject, parentBusinessObject);
        }
      };

      /**
       * For DataObjectReferences only ...
       * Prevent this from calling the CreateDataObjectBehavior in BPMN-js, as it will
       * attempt to crete a dataObject immediately.  We can't create the dataObject until
       * we know where it is placed - as we want to reuse data objects of the parent when
       * possible */
      this.preExecute(['shape.create'], HIGH_PRIORITY$4, function (event) {
        const {
          context
        } = event;
        const {
          shape
        } = context;
        if (ModelUtil.is(shape, 'bpmn:DataObjectReference') && shape.type !== 'label') {
          event.stopPropagation();
        }
      });

      /**
       * Don't just create a new data object, use the first existing one if it already exists
       */
      this.executed(['shape.create'], HIGH_PRIORITY$4, function (event) {
        const {
          context
        } = event;
        const {
          shape
        } = context;
        if (ModelUtil.is(shape, 'bpmn:DataObjectReference') && shape.type !== 'label') {
          const process = shape.parent.businessObject;
          const existingDataObjects = findDataObjects(process);
          let dataObject;
          if (existingDataObjects.length > 0) {
            dataObject = existingDataObjects[0];
          } else {
            dataObject = bpmnFactory.create('bpmn:DataObject');
            dataObject.name = idToHumanReadableName(dataObject.id);
          }
          // set the reference to the DataObject
          shape.businessObject.dataObjectRef = dataObject;
          shape.businessObject.$parent = process;
        }
      });

      /**
       * In order for the label to display correctly, we need to update it in POST step.
       */
      this.postExecuted(['shape.create'], HIGH_PRIORITY$4, function (event) {
        const {
          context
        } = event;
        const {
          shape
        } = context;
        // set the reference to the DataObject
        // Update the name of the reference to match the data object's id.
        if (ModelUtil.is(shape, 'bpmn:DataObjectReference') && shape.type !== 'label') {
          commandStack.execute('element.updateProperties', {
            element: shape,
            moddleElement: shape.businessObject,
            properties: {
              name: shape.businessObject.dataObjectRef.name
            }
          });
        }
      });

      /**
       * Don't remove the associated DataObject, unless all references to that data object
       * Difficult to do given placement of this logic in the BPMN Updater, so we have
       * to manually handle the removal.
       */
      this.executed(['shape.delete'], HIGH_PRIORITY$4, function (event) {
        const {
          context
        } = event;
        const {
          shape
        } = context;
        if (ModelUtil.is(shape, 'bpmn:DataObjectReference') && shape.type !== 'label') {
          const dataObject = shape.businessObject.dataObjectRef;
          let parent = shape.businessObject.$parent;
          if (parent.processRef) {
            // Our immediate parent may be a pool, so we need to get the process
            parent = parent.processRef;
          }
          const flowElements = parent.get('flowElements');
          Collections.remove(flowElements, shape.businessObject);
          const references = findDataObjectReferences(flowElements, dataObject.id);
          if (references.length === 0) {
            const dataFlowElements = dataObject.$parent.get('flowElements');
            Collections.remove(dataFlowElements, dataObject);
          }
        }
      });
    }
  }
  DataObjectInterceptor.$inject = ['eventBus', 'bpmnFactory', 'commandStack', 'bpmnUpdater'];

  function e(e,t){t&&(e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:false,writable:true,configurable:true}}));}

  /**
   * Custom Rules for the DataObject - Rules allow you to prevent an
   * action from happening in the diagram, such as dropping an element
   * where it doesn't belong.
   *
   * Here we don't allow people to move a data object Reference
   * from one parent to another, as we can't move the data objects
   * from one parent to another.
   *
   */
  function DataObjectRules(eventBus) {
    RuleProvider.call(this, eventBus);
  }
  e(DataObjectRules, RuleProvider);
  const HIGH_PRIORITY$3 = 1500;
  DataObjectRules.prototype.init = function () {
    this.addRule('elements.move', HIGH_PRIORITY$3, function (context) {
      let elements = context.shapes;
      let target = context.target;
      return canDrop(elements, target);
    });
  };
  function canDrop(elements, target) {
    for (let element of elements) {
      if (ModelUtil.is(element, 'bpmn:DataObjectReference') && element.parent && target) {
        return target === element.parent;
      }
      // Intentionally returning null here to allow other rules to fire.
    }
  }

  DataObjectRules.prototype.canDrop = canDrop;
  DataObjectRules.$inject = ['eventBus'];

  const HIGH_PRIORITY$2 = 1500;

  /**
   * Work in progress -- render data object references in red if they are
   * not valid.
   */
  class DataObjectRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer) {
      super(eventBus, HIGH_PRIORITY$2);
      this.bpmnRenderer = bpmnRenderer;
    }
    canRender(element) {
      return ModelingUtil.isAny(element, ['bpmn:DataObjectReference']) && !element.labelTarget;
    }
    drawShape(parentNode, element) {
      const shape = this.bpmnRenderer.drawShape(parentNode, element);
      if (ModelUtil.is(element, 'bpmn:DataObjectReference')) {
        let businessObject = ModelUtil.getBusinessObject(element);
        let dataObject = businessObject.dataObjectRef;
        if (dataObject && dataObject.id) {
          let parentObject = businessObject.$parent;
          dataObject = findDataObject(parentObject, dataObject.id);
        }
        if (!dataObject) {
          tinySvg.attr(shape, 'stroke', 'red');
        }
        return shape;
      }
    }
  }
  DataObjectRenderer.$inject = ['eventBus', 'bpmnRenderer'];

  function DataObjectSelect(props) {
    const element = props.element;
    const commandStack = props.commandStack;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const getValue = () => {
      return element.businessObject.dataObjectRef.id;
    };
    const setValue = value => {
      const businessObject = element.businessObject;
      const dataObjects = findDataObjects(businessObject.$parent);
      for (const dataObject of dataObjects) {
        if (dataObject.$type === 'bpmn:DataObject' && dataObject.id === value) {
          commandStack.execute('element.updateModdleProperties', {
            element: element,
            moddleElement: businessObject,
            properties: {
              dataObjectRef: dataObject
            }
          });

          // Construct the new name by : the dataObject name and the current state
          const stateName = businessObject.dataState && businessObject.dataState.name ? businessObject.dataState.name : '';
          const newName = stateName ? `${dataObject.name} [${stateName}]` : dataObject.name;
          // Update the name property of the DataObjectReference
          commandStack.execute('element.updateProperties', {
            element: element,
            properties: {
              name: newName
            }
          });
        }
      }
    };
    const getOptions = value => {
      const businessObject = element.businessObject;
      const parent = businessObject.$parent;
      let dataObjects = findDataObjects(parent);
      let options = [];
      dataObjects.forEach(dataObj => {
        options.push({
          label: dataObj.id,
          value: dataObj.id
        });
      });
      return options;
    };
    return jsxRuntime.jsx(propertiesPanel.SelectEntry, {
      id: 'selectDataObject',
      element: element,
      description: 'Select the Data Object this represents.',
      label: 'Which Data Object does this reference?',
      getValue: getValue,
      setValue: setValue,
      getOptions: getOptions,
      debounce: debounce
    });
  }

  const SPIFF_PARENT_PROP = 'spiffworkflow:Properties';
  const SPIFF_PROP = 'spiffworkflow:Property';
  const PREFIX = 'spiffworkflow:';

  /**
   *
   * Spiff Extensions can show up in two distinct ways. The useProperties toggles between them
   *
   * 1. They might be a top level extension, such as a buisness rule, for example:
   *
   *    <bpmn:extensionElements>
   *      <spiffworkflow:calledDecisionId>my_id</spiffworkflow:calledDecisionId>
   *    </bpmn:extensionElements>
   *
   * 2. Or the extension value may exist in a name/value pair inside a Spiffworkflow Properties extension. You would
   * do this if you wanted to hide the values from the SpiffWorkflow enginge completely, and pass these values
   * through unaltered to your actual application.  For Example:
   *
   *    <bpmn:extensionElements>
   *        <spiffworkflow:properties>
   *            <spiffworkflow:property name="formJsonSchemaFilename" value="json_schema.json" />
   *        </spiffworkflow:properties>
   *    </bpmn:extensionElements>
   *
   *
   */

  /**
   * Returns the string value of the spiff extension with the given name on the provided element. ""
   * @param useProperties if set to true, will look inside extensions/spiffworkflow:properties  otherwise, just
   * looks for a spiffworkflow:[name] and returns that value inside of it.
   * @param element
   * @param name
   */
  function getExtensionValue(businessObject, name) {
    const useProperties = !name.startsWith(PREFIX);
    let extension;
    if (useProperties) {
      extension = getExtensionProperty(businessObject, name);
    } else {
      extension = getExtension(businessObject, name);
    }
    if (extension) {
      return extension.value;
    }
    return '';
  }
  function setExtensionValue(element, name, value, moddle, commandStack, businessObject) {
    const useProperties = !name.startsWith(PREFIX);
    let businessObjectToUse = businessObject;
    if (!businessObjectToUse) {
      businessObjectToUse = element.businessObject;
    }

    // Assure we have extensions
    let extensions = businessObjectToUse.extensionElements;
    if (!extensions) {
      extensions = moddle.create('bpmn:ExtensionElements');
    }
    if (useProperties) {
      let properties = getExtension(businessObjectToUse, SPIFF_PARENT_PROP);
      let property = getExtensionProperty(businessObjectToUse, name);
      if (!properties) {
        properties = moddle.create(SPIFF_PARENT_PROP);
        extensions.get('values').push(properties);
      }
      if (!property) {
        property = moddle.create(SPIFF_PROP);
        properties.get('properties').push(property);
      }
      property.value = value;
      property.name = name;
    } else {
      let extension = getExtension(businessObjectToUse, name);
      if (!extension) {
        extension = moddle.create(name);
        extensions.get('values').push(extension);
      }
      extension.value = value;
    }
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: businessObjectToUse,
      properties: {
        extensionElements: extensions
      }
    });
  }
  function getExtension(businessObject, name) {
    if (!businessObject || !businessObject.extensionElements) {
      return null;
    }
    const extensionElements = businessObject.extensionElements.get('values');
    return extensionElements.filter(function (extensionElement) {
      if (extensionElement.$instanceOf(name)) {
        return true;
      }
    })[0];
  }
  function getExtensionProperty(businessObject, name) {
    const parentElement = getExtension(businessObject, SPIFF_PARENT_PROP);
    if (parentElement) {
      return parentElement.get('properties').filter(function (propertyElement) {
        return propertyElement.$instanceOf(SPIFF_PROP) && propertyElement.name === name;
      })[0];
    }
    return null;
  }

  function SpiffExtensionTextInput(props) {
    const {
      element,
      commandStack,
      moddle,
      name,
      label,
      description
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const {
      businessObject
    } = element;
    const getValue = () => {
      const value = getExtensionValue(businessObject, name);
      return value;
    };
    const setValue = value => {
      setExtensionValue(element, name, value, moddle, commandStack, businessObject);
    };
    return jsxRuntime.jsx(propertiesPanel.TextFieldEntry, {
      id: 'extension_' + name,
      element: element,
      description: description,
      label: label,
      getValue: getValue,
      setValue: setValue,
      debounce: debounce
    });
  }

  // https://stackoverflow.com/a/5767357/6090676
  function removeFirstInstanceOfItemFromArrayInPlace(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
  function removeExtensionElementsIfEmpty(moddleElement) {
    if (moddleElement.extensionElements.values.length < 1) {
      moddleElement.extensionElements = null;
    }
  }

  /**
   * loops up until it can find the root.
   * @param element
   */
  function getRoot$1(businessObject, moddle) {
    // HACK: get the root element. need a more formal way to do this
    {
      // todo: Do we want businessObject to be a shape or moddle object?
      if (businessObject.$type === 'bpmn:Definitions') {
        return businessObject;
      }
      if (typeof businessObject.$parent !== 'undefined') {
        return getRoot$1(businessObject.$parent);
      }
    }
    return businessObject;
  }
  function processId(id) {
    let trimmedId = id.trim();
    let processedId = trimmedId.replace(/\s+/g, '');
    if (id !== processedId) {
      alert('ID should not contain spaces. It has been adjusted.');
    }
    return processedId;
  }
  function checkIfServiceTaskHasParameters(extensionElements) {
    let hasParameters = false;
    extensionElements.values.forEach(item => {
      if ('parameterList' in item && 'parameters' in item.parameterList && typeof item.parameterList.parameters !== 'undefined') {
        hasParameters = true;
      }
    });
    return hasParameters;
  }

  /**
   * Provides a list of data objects, and allows you to add / remove data objects, and change their ids.
   * @param props
   * @constructor
   */
  function DataObjectArray(props) {
    const {
      moddle
    } = props;
    const {
      element
    } = props;
    const {
      commandStack
    } = props;
    let process;

    // This element might be a process, or something that will reference a process.
    if (ModelUtil.is(element.businessObject, 'bpmn:Process') || ModelUtil.is(element.businessObject, 'bpmn:SubProcess')) {
      process = element.businessObject;
    } else if (element.businessObject.processRef) {
      process = element.businessObject.processRef;
    }
    const dataObjects = findDataObjects(process);
    const items = dataObjects.map((dataObject, index) => {
      const id = `${process.id}-dataObj-${index}`;
      return {
        id,
        label: dataObject.id,
        entries: DataObjectGroup({
          idPrefix: id,
          dataObject,
          commandStack,
          moddle
        }),
        autoFocusEntry: `${id}-dataObject`,
        remove: removeFactory$3({
          element,
          dataObject,
          process,
          commandStack})
      };
    });
    function add(event) {
      event.stopPropagation();
      const newDataObject = moddle.create('bpmn:DataObject');
      const newElements = process.get('flowElements');
      newDataObject.id = moddle.ids.nextPrefixed('DataObject_');
      newDataObject.name = idToHumanReadableName(newDataObject.id);
      newDataObject.$parent = process;
      newElements.push(newDataObject);
      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: process,
        properties: {
          flowElements: newElements
        }
      });
    }
    return {
      items,
      add
    };
  }
  function removeFactory$3(props) {
    const {
      element,
      dataObject,
      process,
      commandStack
    } = props;
    return function (event) {
      event.stopPropagation();
      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: process,
        properties: {
          flowElements: minDash.without(process.get('flowElements'), dataObject)
        }
      });
      // When a data object is removed, remove all references as well.
      const references = findDataObjectReferenceShapes(element.children, dataObject.id);
      for (const ref of references) {
        commandStack.execute('shape.delete', {
          shape: ref
        });
      }
    };
  }
  function DataObjectGroup(props) {
    const {
      idPrefix,
      dataObject,
      moddle,
      commandStack
    } = props;
    return [{
      id: `${idPrefix}-dataObject`,
      component: DataObjectTextField,
      isEdited: propertiesPanel.isTextFieldEntryEdited,
      idPrefix,
      dataObject
    }, {
      id: `${idPrefix}-dataObjectName`,
      component: DataObjectNameTextField,
      isEdited: propertiesPanel.isTextFieldEntryEdited,
      idPrefix,
      dataObject
    }, {
      businessObject: dataObject,
      commandStack: commandStack,
      moddle: moddle,
      component: SpiffExtensionTextInput,
      name: 'spiffworkflow:Category',
      label: 'Data Object Category',
      description: 'Useful for setting permissions on groups of data objects.'
    }];
  }
  function DataObjectTextField(props) {
    const {
      idPrefix,
      element,
      parameter,
      dataObject
    } = props;
    const commandStack = bpmnJsPropertiesPanel.useService('commandStack');
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const setValue = value => {
      try {
        // Check if new dataObject Id is not unique
        if (findDataObject(element.businessObject, value) !== undefined) {
          alert('Data Object ID Should be unique');
          return;
        }

        // let doName = idToHumanReadableName(value);
        commandStack.execute('element.updateModdleProperties', {
          element,
          moddleElement: dataObject,
          properties: {
            id: processId(value)
            // name: doName
          }
        });
        // Update references name
        // updateDataObjectReferencesName(element, doName, value, commandStack);
      } catch (error) {
        console.log('Set Value Error : ', error);
      }
    };
    const getValue = () => {
      return dataObject.id;
    };
    return propertiesPanel.TextFieldEntry({
      element: parameter,
      id: `${idPrefix}-id`,
      label: 'Data Object Id',
      getValue,
      setValue,
      debounce
    });
  }
  function DataObjectNameTextField(props) {
    const {
      idPrefix,
      element,
      parameter,
      dataObject
    } = props;
    const commandStack = bpmnJsPropertiesPanel.useService('commandStack');
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const setValue = value => {
      // Update references name
      updateDataObjectReferencesName(element, value, dataObject.id, commandStack);

      // Update dataObject name
      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: dataObject,
        properties: {
          name: value
        }
      });
    };
    const getValue = () => {
      return dataObject.name;
    };
    return propertiesPanel.TextFieldEntry({
      element: parameter,
      id: `${idPrefix}-name`,
      label: 'Data Object Name',
      getValue,
      setValue,
      debounce
    });
  }

  const LOW_PRIORITY$c = 500;
  function DataObjectPropertiesProvider(propertiesPanel, translate, moddle, commandStack, elementRegistry, modeling, bpmnFactory) {
    this.getGroups = function (element) {
      return function (groups) {
        if (ModelUtil.is(element, 'bpmn:DataObjectReference')) {
          const generalGroup = groups.find(group => group.id === 'general');
          if (generalGroup) {
            generalGroup.entries = generalGroup.entries.filter(entry => entry.id !== 'name');
          }
          groups.push(createDataObjectSelector(element, translate, moddle, commandStack, modeling, bpmnFactory));
        }
        if (ModelUtil.isAny(element, ['bpmn:Process', 'bpmn:Participant']) || ModelUtil.is(element, 'bpmn:SubProcess') && !element.collapsed) {
          groups.push(createDataObjectEditor(element, translate, moddle, commandStack));
        }
        return groups;
      };
    };
    propertiesPanel.registerProvider(LOW_PRIORITY$c, this);
  }
  DataObjectPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'moddle', 'commandStack', 'elementRegistry', 'modeling', 'bpmnFactory'];

  /**
   * Create a group on the main panel with a select box (for choosing the Data Object to connect)
   * @param element
   * @param translate
   * @param moddle
   * @returns entries
   */
  function createDataObjectSelector(element, translate, moddle, commandStack, modeling, bpmnFactory) {
    return {
      id: 'data_object_properties',
      label: translate('Data Object Properties'),
      entries: [{
        id: 'selectDataObject',
        element,
        component: DataObjectSelect,
        isEdited: propertiesPanel.isTextFieldEntryEdited,
        moddle,
        commandStack
      }, {
        id: 'selectDataState',
        element,
        component: createDataStateTextField,
        moddle,
        commandStack,
        modeling,
        bpmnFactory
      }]
    };
  }

  /**
   * Create a group on the main panel with a select box (for choosing the Data Object to connect) AND a
   * full Data Object Array for modifying all the data objects.
   * @param element
   * @param translate
   * @param moddle
   * @returns entries
   */
  function createDataObjectEditor(element, translate, moddle, commandStack, elementRegistry) {
    const dataObjectArray = {
      id: 'editDataObjects',
      element,
      label: 'Data Objects',
      component: propertiesPanel.ListGroup,
      ...DataObjectArray({
        element,
        moddle,
        commandStack})
    };
    if (dataObjectArray.items) {
      return dataObjectArray;
    }
  }
  function createDataStateTextField(props) {
    const {
      id,
      element,
      commandStack,
      modeling,
      bpmnFactory
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const setValue = value => {
      const businessObject = element.businessObject;

      // Check if the element is a DataObjectReference
      if (!ModelUtil.is(businessObject, 'bpmn:DataObjectReference')) {
        console.error('The element is not a DataObjectReference.');
        return;
      }

      // Create a new DataState or update the existing one
      let dataState = businessObject.dataState;
      if (!dataState) {
        dataState = bpmnFactory.create('bpmn:DataState', {
          id: 'DataState_' + businessObject.id,
          name: value
        });
      } else {
        dataState.name = value;
      }

      // Update the DataObjectReference with new or updated DataState
      modeling.updateProperties(element, {
        dataState: dataState
      });

      // Extract the original name
      const originalName = businessObject.name.split(' [')[0];

      // Update the label of the DataObjectReference
      const newName = value ? originalName + ' [' + value + ']' : originalName;
      modeling.updateProperties(element, {
        name: newName
      });
    };
    const getValue = () => {
      const businessObject = element.businessObject;
      return businessObject.dataState ? businessObject.dataState.name : '';
    };
    return propertiesPanel.TextFieldEntry({
      element,
      id: `${id}-textField`,
      name: 'spiffworkflow:DataStateLabel',
      label: 'What is the state of this reference?',
      description: 'Enter the Data State for this reference.',
      getValue,
      setValue,
      debounce
    });
  }

  function DataObjectLabelEditingProvider(eventBus, directEditing, commandStack, modeling) {
    let el;

    // listen to dblclick on non-root elements
    eventBus.on('element.dblclick', function (event) {
      const {
        element
      } = event;
      if (ModelUtil.is(element.businessObject, 'bpmn:DataObjectReference')) {
        let label = element.businessObject.name;
        label = label.replace(/\s*\[.*?\]\s*$/, '');
        modeling.updateLabel(element, label);
        directEditing.activate(element);
        el = element;
      }
    });
    eventBus.on('directEditing.complete', function (event) {
      const element = el;
      if (element && ModelUtil.is(element.businessObject, 'bpmn:DataObjectReference')) {
        setTimeout(() => {
          const process = element.parent.businessObject;
          const dataObject = findDataObject(process, element.businessObject.dataObjectRef.id);
          const dataState = element.businessObject.dataState && element.businessObject.dataState.name;
          let newLabel = element.businessObject.name;
          commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: dataObject,
            properties: {
              name: newLabel
            }
          });

          // Update references name
          updateDataObjectReferencesName(element.parent, newLabel, dataObject.id, commandStack);

          // Append the data state if it exists
          if (dataState) {
            newLabel += ` [${dataState}]`;
          }

          // Update the label with the data state
          modeling.updateLabel(element, newLabel);
          el = undefined;
        }, 100);
      }
    });
  }
  DataObjectLabelEditingProvider.$inject = ['eventBus', 'directEditing', 'commandStack', 'modeling'];

  function isDataStoreReferenced(process, dataStoreId) {
    const status = process.get('flowElements').some(elem => elem.$type === 'bpmn:DataStoreReference' && elem.dataStoreRef && elem.dataStoreRef.id === dataStoreId);
    return status;
  }
  function removeDataStore(definitions, dataStoreId) {
    definitions.set('rootElements', definitions.get('rootElements').filter(elem => !(elem.$type === 'bpmn:DataStore' && elem.id === dataStoreId)));
  }

  const OPTION_TYPE$1 = {
    data_stores: 'data_stores'
  };
  const spiffExtensionOptions$2 = {};
  function DataStoreSelect(props) {
    const {
      id,
      label,
      description,
      optionType
    } = props;
    const {
      element
    } = props;
    const {
      commandStack
    } = props;
    const {
      modeling
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const eventBus = bpmnJsPropertiesPanel.useService('eventBus');
    const bpmnFactory = bpmnJsPropertiesPanel.useService('bpmnFactory');
    const getValue = () => {
      const dtRef = element.businessObject.dataStoreRef;
      return dtRef ? dtRef.id : '';
    };
    const setValue = value => {
      const {
        businessObject
      } = element;
      const process = businessObject.$parent;
      const definitions = getRoot$1(businessObject);
      if (!definitions.get('rootElements')) {
        definitions.set('rootElements', []);
      }
      const valId = value;
      if (!valId || valId == '') {
        const oldDataStoreId = businessObject.dataStoreRef.id;
        modeling.updateProperties(element, {
          name: '',
          dataStoreRef: null,
          type: ''
        });
        // If previous datastore is not used, delete it
        if (!isDataStoreReferenced(process, oldDataStoreId)) {
          const rootElements = definitions.get('rootElements');
          const oldMessageIndex = rootElements.findIndex(element => element.$type === 'bpmn:DataStore' && element.id === oldDataStoreId);
          if (oldMessageIndex !== -1) {
            rootElements.splice(oldMessageIndex, 1);
            definitions.rootElements = rootElements;
          }
        }
        return;
      }
      const valClz = GetDataStoreAttrById('clz', value);
      const valName = GetDataStoreAttrById('name', value);
      const valType = GetDataStoreAttrById('type', value);

      // Persist Current DataStore Ref
      const currentDataStoreRef = element.businessObject.dataStoreRef;

      // Create DataStore
      let dataStore = definitions.get('rootElements').find(element => element.$type === 'bpmn:DataStore' && element.id === valId);

      // If the DataStore doesn't exist, create new one
      if (!dataStore) {
        dataStore = bpmnFactory.create('bpmn:DataStore', {
          id: valId,
          name: valClz
        });
        definitions.get('rootElements').push(dataStore);
      }
      modeling.updateProperties(element, {
        name: valName,
        dataStoreRef: dataStore,
        type: valType
      });

      // Remove the old DataStore if it's no longer referenced
      if (currentDataStoreRef && !isDataStoreReferenced(process, currentDataStoreRef.id)) {
        removeDataStore(definitions, currentDataStoreRef.id);
      }
    };
    const getOptions = () => {
      const optionList = [];
      optionList.push({
        label: '',
        value: ''
      });
      if (optionType in spiffExtensionOptions$2 && spiffExtensionOptions$2[optionType] !== null) {
        spiffExtensionOptions$2[optionType].forEach(opt => {
          optionList.push({
            label: opt.name,
            value: opt.id
          });
        });
      }
      return optionList;
    };
    if (!(optionType in spiffExtensionOptions$2) || spiffExtensionOptions$2[optionType] === null) {
      spiffExtensionOptions$2[optionType] = null;
      requestOptions$2(eventBus, element, commandStack, optionType);
    }
    return propertiesPanel.SelectEntry({
      id,
      element,
      label,
      description,
      getValue,
      setValue,
      getOptions,
      debounce
    });
  }
  function requestOptions$2(eventBus, element, commandStack, optionType) {
    eventBus.on(`spiff.${optionType}.returned`, event => {
      spiffExtensionOptions$2[optionType] = event.options;
    });
    eventBus.fire(`spiff.${optionType}.requested`, {
      eventBus
    });
  }
  function GetDataStoreAttrById(prop, id) {
    const arr = spiffExtensionOptions$2['data_stores'];
    const item = arr.find(obj => obj.id === id);
    return item ? item[prop] : null;
  }

  const LOW_PRIORITY$b = 500;
  function DataStorePropertiesProvider(modeling, propertiesPanel, translate, moddle, commandStack, bpmnFactory) {
    this.getGroups = function (element) {
      return function (groups) {
        if (ModelUtil.is(element, 'bpmn:DataStoreReference')) {
          groups.push(createCustomDataStoreGroup(modeling, element, translate, moddle, commandStack, bpmnFactory));
        }
        return groups;
      };
    };
    propertiesPanel.registerProvider(LOW_PRIORITY$b, this);
  }
  DataStorePropertiesProvider.$inject = ['modeling', 'propertiesPanel', 'translate', 'moddle', 'commandStack', 'bpmnFactory'];
  function createCustomDataStoreGroup(modeling, element, translate, moddle, commandStack, bpmnFactory) {
    const {
      businessObject
    } = element;
    const group = {
      label: translate('Custom Data Store Properties'),
      id: 'custom-datastore-properties',
      entries: []
    };
    let description = translate('Select a datasource from the list');
    if (businessObject.dataStoreRef) {
      businessObject.dataStoreRef.id;
      const type = businessObject.get('type');
      description = `The selected data store is of type: ${type}`;
    }

    // other custom properties as needed
    group.entries.push({
      id: 'selectDataStore',
      element,
      component: DataStoreSelect,
      optionType: OPTION_TYPE$1.data_stores,
      moddle,
      commandStack,
      translate,
      name: 'dataStoreRef',
      label: translate('Select DataSource'),
      description,
      modeling,
      bpmnFactory
    });
    return group;
  }

  const HIGH_PRIORITY$1 = 1500;

  /**
   *
   */
  class DataStoreInterceptor extends CommandInterceptor {
    constructor(eventBus, bpmnFactory, commandStack, bpmnUpdater) {
      super(eventBus);

      /*
       *
       */
      // bpmnUpdater.updateSemanticParent = (businessObject, parentBusinessObject) => {
      //   if (is(businessObject, 'bpmn:DataStoreReference')) {
      //     console.log('updateSemanticParent', businessObject, parentBusinessObject);
      //     bpmnUpdater.__proto__.updateSemanticParent.call(bpmnUpdater, businessObject, parentBusinessObject);
      //   }
      // };

      /**
       *
       */
      // this.preExecute(['shape.create'], HIGH_PRIORITY, function (event) {
      //   const { context } = event;
      //   const { shape } = context;
      //   if (is(shape, 'bpmn:DataStoreReference') && shape.type !== 'label') {
      //     // event.stopPropagation();*
      //     console.log('preExecute shape.create', shape, context);
      //   }
      // });

      /**
       *
       */
      // this.executed(['shape.create'], HIGH_PRIORITY, function (event) {
      //   const { context } = event;
      //   const { shape } = context;
      //   if (is(shape, 'bpmn:DataStoreReference') && shape.type !== 'label') {
      //     console.log('executed shape.create', shape, context);
      //   }
      // });

      /**
       *
       */
      // this.postExecuted(['shape.create'], HIGH_PRIORITY, function (event) {
      //   const { context } = event;
      //   const { shape } = context;
      //   if (is(shape, 'bpmn:DataStoreReference') && shape.type !== 'label') {
      //     console.log('postExecuted shape.create', shape, context);
      //   }
      // });

      /**
       *
       */
      this.postExecuted(['shape.delete'], HIGH_PRIORITY$1, function (event) {
        const {
          context
        } = event;
        const {
          shape
        } = context;
        if (ModelUtil.is(shape, 'bpmn:DataStoreReference') && shape.type !== 'label') {
          const definitions = context.oldParent.businessObject.$parent;
          const dataStore = shape.businessObject.dataStoreRef;
          if (dataStore && !isDataStoreReferenced(context.oldParent.businessObject, dataStore.id)) {
            // Remove datastore if it's not linked with another datastore ref
            removeDataStore(definitions, dataStore.id);
          }
        }
      });
    }
  }
  DataStoreInterceptor.$inject = ['eventBus', 'bpmnFactory', 'commandStack', 'bpmnUpdater'];

  const LOW_PRIORITY$a = 500;
  function ConditionsPropertiesProvider(propertiesPanel, translate, moddle, commandStack, _elementRegistry) {
    this.getGroups = function getGroupsCallback(element) {
      return function pushGroup(groups) {
        if (ModelUtil.is(element, 'bpmn:SequenceFlow')) {
          const {
            source
          } = element;
          if (ModelUtil.is(source, 'bpmn:ExclusiveGateway') || ModelUtil.is(source, 'bpmn:InclusiveGateway')) {
            groups.push(createConditionsGroup(element, translate, moddle, commandStack));
          }
        } else if (ModelUtil.is(element, 'bpmn:Event')) {
          const eventDefinitions = element.businessObject.eventDefinitions;
          if (eventDefinitions.filter(ev => ModelUtil.is(ev, 'bpmn:ConditionalEventDefinition')).length > 0) {
            groups.push(createConditionsGroup(element, translate, moddle, commandStack));
          }
        }
        return groups;
      };
    };
    propertiesPanel.registerProvider(LOW_PRIORITY$a, this);
  }
  ConditionsPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'moddle', 'commandStack', 'elementRegistry'];
  function createConditionsGroup(element, translate, moddle, commandStack) {
    return {
      id: 'conditions',
      label: translate('Conditions'),
      entries: conditionGroup(element, moddle, 'Condition Expression', 'Expression to Execute', commandStack)
    };
  }
  function conditionGroup(element, moddle, label, description, commandStack) {
    return [{
      id: `condition_expression`,
      element,
      component: ConditionExpressionTextField,
      moddle,
      label,
      description,
      commandStack,
      isEdited: propertiesPanel.isTextAreaEntryEdited
    }];
  }
  function ConditionExpressionTextField(props) {
    const {
      element
    } = props;
    const {
      moddle
    } = props;
    const {
      label
    } = props;
    const {
      commandStack
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const getValue = () => {
      let conditionExpression;
      if (ModelUtil.is(element, 'bpmn:SequenceFlow')) {
        conditionExpression = element.businessObject.conditionExpression;
      } else if (ModelUtil.is(element, 'bpmn:Event')) {
        const eventDef = element.businessObject.eventDefinitions.find(ev => ModelUtil.is(ev, 'bpmn:ConditionalEventDefinition'));
        conditionExpression = eventDef.condition;
      }
      if (conditionExpression) {
        return conditionExpression.body;
      }
      return '';
    };
    const setValue = value => {
      let {
        conditionExpressionModdleElement
      } = element.businessObject;
      if (!conditionExpressionModdleElement) {
        conditionExpressionModdleElement = moddle.create('bpmn:Expression');
      }
      conditionExpressionModdleElement.body = value;
      if (ModelUtil.is(element, 'bpmn:SequenceFlow')) {
        element.businessObject.conditionExpression = conditionExpressionModdleElement;
      } else if (ModelUtil.is(element, 'bpmn:Event')) {
        const eventDef = element.businessObject.eventDefinitions.find(ev => ModelUtil.is(ev, 'bpmn:ConditionalEventDefinition'));
        eventDef.condition = conditionExpressionModdleElement;
      }
      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: conditionExpressionModdleElement
      });
    };
    return propertiesPanel.TextAreaEntry({
      element,
      id: 'condition_expression',
      label,
      getValue,
      setValue,
      debounce
    });
  }

  const getScriptUnitTestsModdleElement = shapeElement => {
    const bizObj = shapeElement.businessObject;
    if (!bizObj.extensionElements) {
      return null;
    }
    if (!bizObj.extensionElements.values) {
      return null;
    }
    return bizObj.extensionElements.get('values').filter(function getInstanceOfType(e) {
      return e.$instanceOf('spiffworkflow:UnitTests');
    })[0];
  };
  const getScriptUnitTestModdleElements = shapeElement => {
    const scriptUnitTestsModdleElement = getScriptUnitTestsModdleElement(shapeElement);
    if (scriptUnitTestsModdleElement) {
      return scriptUnitTestsModdleElement.unitTests || [];
    }
    return [];
  };

  /**
   * Provides a list of data objects, and allows you to add / remove data objects, and change their ids.
   * @param props
   * @constructor
   */
  function ScriptUnitTestArray(props) {
    const {
      element,
      moddle,
      commandStack,
      translate
    } = props;
    const scriptUnitTestModdleElements = getScriptUnitTestModdleElements(element);
    const items = scriptUnitTestModdleElements.map((scriptUnitTestModdleElement, index) => {
      const id = `scriptUnitTest-${index}`;
      return {
        id,
        label: scriptUnitTestModdleElement.id,
        entries: scriptUnitTestGroup({
          idPrefix: id,
          element,
          scriptUnitTestModdleElement,
          commandStack,
          translate
        }),
        remove: removeFactory$2({
          element,
          scriptUnitTestModdleElement,
          commandStack}),
        autoFocusEntry: id
      };
    });
    function add(event) {
      event.stopPropagation();
      const scriptTaskModdleElement = element.businessObject;
      if (!scriptTaskModdleElement.extensionElements) {
        scriptTaskModdleElement.extensionElements = scriptTaskModdleElement.$model.create('bpmn:ExtensionElements');
      }
      let scriptUnitTestsModdleElement = getScriptUnitTestsModdleElement(element);
      if (!scriptUnitTestsModdleElement) {
        scriptUnitTestsModdleElement = scriptTaskModdleElement.$model.create('spiffworkflow:UnitTests');
        scriptTaskModdleElement.extensionElements.get('values').push(scriptUnitTestsModdleElement);
      }
      const scriptUnitTestModdleElement = scriptTaskModdleElement.$model.create('spiffworkflow:UnitTest');
      const scriptUnitTestInputModdleElement = scriptTaskModdleElement.$model.create('spiffworkflow:InputJson');
      const scriptUnitTestOutputModdleElement = scriptTaskModdleElement.$model.create('spiffworkflow:ExpectedOutputJson');
      scriptUnitTestModdleElement.id = moddle.ids.nextPrefixed('ScriptUnitTest_');
      scriptUnitTestInputModdleElement.value = '{}';
      scriptUnitTestOutputModdleElement.value = '{}';
      scriptUnitTestModdleElement.inputJson = scriptUnitTestInputModdleElement;
      scriptUnitTestModdleElement.expectedOutputJson = scriptUnitTestOutputModdleElement;
      if (!scriptUnitTestsModdleElement.unitTests) {
        scriptUnitTestsModdleElement.unitTests = [];
      }
      scriptUnitTestsModdleElement.unitTests.push(scriptUnitTestModdleElement);
      commandStack.execute('element.updateProperties', {
        element,
        properties: {}
      });
    }
    return {
      items,
      add
    };
  }
  function removeFactory$2(props) {
    const {
      element,
      scriptUnitTestModdleElement,
      commandStack
    } = props;
    return function (event) {
      event.stopPropagation();
      const scriptUnitTestsModdleElement = getScriptUnitTestsModdleElement(element);
      removeFirstInstanceOfItemFromArrayInPlace(scriptUnitTestsModdleElement.unitTests, scriptUnitTestModdleElement);
      if (scriptUnitTestsModdleElement.unitTests.length < 1) {
        const scriptTaskModdleElement = element.businessObject;
        removeFirstInstanceOfItemFromArrayInPlace(scriptTaskModdleElement.extensionElements.values, scriptUnitTestsModdleElement);
        removeExtensionElementsIfEmpty(scriptTaskModdleElement);
      }
      commandStack.execute('element.updateProperties', {
        element,
        properties: {}
      });
    };
  }

  // <spiffworkflow:unitTests>
  //   <spiffworkflow:unitTest id="test1">
  //     <spiffworkflow:inputJson>{}</spiffworkflow:inputJson>
  //     <spiffworkflow:expectedOutputJson>{}</spiffworkflow:expectedOutputJson>
  //   </spiffworkflow:unitTest>
  // </spiffworkflow:unitTests>
  function scriptUnitTestGroup(props) {
    const {
      idPrefix,
      element,
      scriptUnitTestModdleElement,
      commandStack,
      translate
    } = props;
    return [{
      id: `${idPrefix}-id`,
      label: translate('ID:'),
      element,
      component: ScriptUnitTestIdTextField,
      scriptUnitTestModdleElement,
      commandStack
    }, {
      id: `${idPrefix}-input`,
      label: translate('Input Json:'),
      element,
      component: ScriptUnitTestJsonTextArea,
      scriptUnitTestJsonModdleElement: scriptUnitTestModdleElement.inputJson,
      commandStack
    }, {
      id: `${idPrefix}-expected-output`,
      label: translate('Expected Output Json:'),
      element,
      component: ScriptUnitTestJsonTextArea,
      scriptUnitTestJsonModdleElement: scriptUnitTestModdleElement.expectedOutputJson,
      commandStack
    }];
  }
  function ScriptUnitTestJsonTextArea(props) {
    const {
      id,
      element,
      scriptUnitTestJsonModdleElement,
      label
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const setValue = value => {
      scriptUnitTestJsonModdleElement.value = value;
    };
    const getValue = () => {
      return scriptUnitTestJsonModdleElement.value;
    };
    return propertiesPanel.TextAreaEntry({
      element,
      id: `${id}-textArea`,
      getValue,
      setValue,
      debounce,
      label
    });
  }
  function ScriptUnitTestIdTextField(props) {
    const {
      id,
      element,
      scriptUnitTestModdleElement,
      label
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const commandStack = bpmnJsPropertiesPanel.useService('commandStack');
    const setValue = value => {
      scriptUnitTestModdleElement.id = value;
      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: scriptUnitTestModdleElement,
        properties: {}
      });
    };
    const getValue = () => {
      return scriptUnitTestModdleElement.id;
    };
    return propertiesPanel.TextFieldEntry({
      element,
      id: `${id}-textArea`,
      getValue,
      setValue,
      debounce,
      label
    });
  }

  const SCRIPT_TYPE = {
    bpmn: 'bpmn:script',
    pre: 'spiffworkflow:PreScript',
    post: 'spiffworkflow:PostScript'
  };
  function PythonScript(props) {
    const {
      element,
      id
    } = props;
    const {
      type
    } = props;
    const {
      moddle,
      commandStack
    } = props;
    const {
      label
    } = props;
    const {
      description
    } = props;
    const translate = bpmnJsPropertiesPanel.useService('translate');
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const getValue = () => {
      return getScriptString(element, type);
    };
    const setValue = value => {
      updateScript(commandStack, moddle, element, type, value);
    };
    return propertiesPanel.TextAreaEntry({
      id,
      element,
      description: translate(description),
      label: translate(label),
      getValue,
      setValue,
      debounce
    });
  }
  function LaunchEditorButton$1(props) {
    const {
      element,
      type,
      moddle,
      commandStack
    } = props;
    const eventBus = bpmnJsPropertiesPanel.useService('eventBus');
    return propertiesPanel.HeaderButton({
      className: 'spiffworkflow-properties-panel-button',
      onClick: () => {
        const script = getScriptString(element, type);
        eventBus.fire('spiff.script.edit', {
          element,
          scriptType: type,
          script,
          eventBus
        });
        // Listen for a response, to update the script.
        eventBus.once('spiff.script.update', event => {
          updateScript(commandStack, moddle, element, event.scriptType, event.script);
        });
      },
      children: 'Launch Editor'
    });
  }

  /**
   * Finds the value of the given type within the extensionElements
   * given a type of "spiff:preScript", would find it in this, and return
   * the object.
   *
   *  <bpmn:
   <bpmn:userTask id="123" name="My User Task!">
   <bpmn:extensionElements>
   <spiff:preScript>
   me = "100% awesome"
   </spiff:preScript>
   </bpmn:extensionElements>
   ...
   </bpmn:userTask>
   *
   * @returns {string|null|*}
   */
  function getScriptObject(element, scriptType) {
    const bizObj = element.businessObject;
    if (scriptType === SCRIPT_TYPE.bpmn) {
      return bizObj;
    }
    if (!bizObj.extensionElements) {
      return null;
    }
    return bizObj.extensionElements.get('values').filter(function getInstanceOfType(e) {
      return e.$instanceOf(scriptType);
    })[0];
  }
  function updateScript(commandStack, moddle, element, scriptType, newValue) {
    const {
      businessObject
    } = element;
    let scriptObj = getScriptObject(element, scriptType);
    // If the pre or post script (when not SCRIPT_TYPE.bpmn) value is empty, remove the corresponding extension element rather than leaving an empty node
    if (!newValue && scriptObj && scriptType !== SCRIPT_TYPE.bpmn) {
      let {
        extensionElements
      } = businessObject;
      if (!extensionElements) {
        extensionElements = moddle.create('bpmn:ExtensionElements');
      }
      if (extensionElements && extensionElements.get) {
        const values = extensionElements.get('values').filter(e => e !== scriptObj);
        extensionElements.values = values;
        businessObject.extensionElements = extensionElements;
        commandStack.execute('element.updateModdleProperties', {
          element,
          moddleElement: businessObject,
          properties: {}
        });
        return;
      }
    }
    // Create the script object if needed.
    if (!scriptObj) {
      scriptObj = moddle.create(scriptType);
      if (scriptType !== SCRIPT_TYPE.bpmn) {
        let {
          extensionElements
        } = businessObject;
        if (!extensionElements) {
          extensionElements = moddle.create('bpmn:ExtensionElements');
        }
        scriptObj.value = newValue;
        extensionElements.get('values').push(scriptObj);
        commandStack.execute('element.updateModdleProperties', {
          element,
          moddleElement: businessObject,
          properties: {
            extensionElements
          }
        });
      }
    } else {
      let newProps = {
        value: newValue
      };
      if (scriptType === SCRIPT_TYPE.bpmn) {
        newProps = {
          script: newValue
        };
      }
      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: scriptObj,
        properties: newProps
      });
    }
  }
  function getScriptString(element, scriptType) {
    const scriptObj = getScriptObject(element, scriptType);
    if (scriptObj && scriptObj.value) {
      return scriptObj.value;
    }
    if (scriptObj && scriptObj.script) {
      return scriptObj.script;
    }
    return '';
  }

  /**
   * Generates a text box and button for editing a script.
   * @param element The elemment that should get the script task.
   * @param scriptType The type of script -- can be a preScript, postScript or a BPMN:Script for script tags
   * @param moddle For updating the underlying xml document when needed.
   * @returns {[{component: (function(*)), isEdited: *, id: string, element},{component: (function(*)), isEdited: *, id: string, element}]}
   */
  function getEntries(props) {
    const {
      element,
      moddle,
      scriptType,
      label,
      description,
      translate,
      commandStack
    } = props;
    const entries = [{
      id: `pythonScript_${scriptType}`,
      element,
      type: scriptType,
      component: PythonScript,
      isEdited: propertiesPanel.isTextFieldEntryEdited,
      moddle,
      commandStack,
      label,
      description
    }, {
      id: `launchEditorButton${scriptType}`,
      type: scriptType,
      element,
      component: LaunchEditorButton$1,
      isEdited: propertiesPanel.isTextFieldEntryEdited,
      moddle,
      commandStack
    }];

    // do not support testing pre and post scripts at the moment
    if (scriptType === SCRIPT_TYPE.bpmn) {
      entries.push({
        id: `scriptUnitTests${scriptType}`,
        label: translate('Unit Tests'),
        component: propertiesPanel.ListGroup,
        ...ScriptUnitTestArray({
          element,
          moddle,
          translate,
          commandStack
        })
      });
    }
    return entries;
  }

  const SPIFFWORKFLOW_XML_NAMESPACE = 'spiffworkflow';
  const SPIFF_ADD_MESSAGE_RETURNED_EVENT = 'spiff.add_message.returned';

  let serviceTaskOperators = [];

  // This stores the parameters for a given service task operator
  //  so that we can remember the values when switching between them
  // the values should be the list of moddle elements that we push onto
  //  the parameterList of service task operator and the key should be
  //  the service task operator id
  const previouslyUsedServiceTaskParameterValuesHash = {};
  // I'm not going to change these variable names, but this is actually the name of the modeller
  // type (as defined in moddle/spiffworkflow.json) NOT the element name (which is lowercase)
  const SERVICE_TASK_OPERATOR_ELEMENT_NAME = `${SPIFFWORKFLOW_XML_NAMESPACE}:ServiceTaskOperator`;
  const SERVICE_TASK_PARAMETERS_ELEMENT_NAME = `${SPIFFWORKFLOW_XML_NAMESPACE}:Parameters`;
  const SERVICE_TASK_PARAMETER_ELEMENT_NAME = `${SPIFFWORKFLOW_XML_NAMESPACE}:Parameter`;

  /**
   * A generic properties' editor for text input.
   * Allows you to provide additional SpiffWorkflow extension properties.  Just
   * uses whatever name is provide on the property, and adds or updates it as
   * needed.
   *
   *
      <bpmn:serviceTask id="service_task_one" name="Service Task One">
        <bpmn:extensionElements>
          <spiffworkflow:serviceTaskOperator id="SlackWebhookOperator" resultVariable="result">
            <spiffworkflow:parameters>
              <spiffworkflow:parameter name="webhook_token" type="string" value="token" />
              <spiffworkflow:parameter name="message" type="string" value="ServiceTask testing" />
              <spiffworkflow:parameter name="channel" type="string" value="#" />
            </spiffworkflow:parameters>
          </spiffworkflow:serviceTaskOperator>
        </bpmn:extensionElements>
      </bpmn:serviceTask>
   *
   * @returns {string|null|*}
   */

  function requestServiceTaskOperators(eventBus, element, commandStack) {
    eventBus.fire('spiff.service_tasks.requested', {
      eventBus
    });
    eventBus.on('spiff.service_tasks.returned', event => {
      if (event.serviceTaskOperators.length > 0) {
        serviceTaskOperators = event.serviceTaskOperators;
      }
    });
  }
  function getServiceTaskOperatorModdleElement(shapeElement) {
    const {
      extensionElements
    } = shapeElement.businessObject;
    if (extensionElements) {
      for (const ee of extensionElements.values) {
        if (ee.$type === SERVICE_TASK_OPERATOR_ELEMENT_NAME) {
          return ee;
        }
      }
    }
    return null;
  }
  function getServiceTaskParameterModdleElements(shapeElement) {
    const serviceTaskOperatorModdleElement = getServiceTaskOperatorModdleElement(shapeElement);
    if (serviceTaskOperatorModdleElement) {
      const {
        parameterList
      } = serviceTaskOperatorModdleElement;
      if (parameterList && 'parameters' in parameterList && typeof parameterList.parameters !== 'undefined') {
        return parameterList.parameters;
      }
    }
    return [];
  }
  function ServiceTaskOperatorSelect(props) {
    const {
      element
    } = props;
    const {
      commandStack
    } = props;
    const {
      translate
    } = props;
    const {
      moddle
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const eventBus = bpmnJsPropertiesPanel.useService('eventBus');
    if (serviceTaskOperators.length === 0) {
      requestServiceTaskOperators(eventBus);
    }
    const getValue = () => {
      const serviceTaskOperatorModdleElement = getServiceTaskOperatorModdleElement(element);
      if (serviceTaskOperatorModdleElement) {
        return serviceTaskOperatorModdleElement.id;
      }
      return '';
    };
    const setValue = value => {
      if (!value) {
        return;
      }
      const serviceTaskOperator = serviceTaskOperators.find(sto => sto.id === value);
      if (!serviceTaskOperator) {
        console.error(`Could not find service task operator with id: ${value}`);
        return;
      }
      if (!(element.businessObject.id in previouslyUsedServiceTaskParameterValuesHash)) {
        previouslyUsedServiceTaskParameterValuesHash[element.businessObject.id] = {};
      }
      const previouslyUsedServiceTaskParameterValues = previouslyUsedServiceTaskParameterValuesHash[element.businessObject.id][value];
      const {
        businessObject
      } = element;
      let extensions = businessObject.extensionElements;
      if (!extensions) {
        extensions = moddle.create('bpmn:ExtensionElements');
      }
      const oldServiceTaskOperatorModdleElement = getServiceTaskOperatorModdleElement(element);
      const newServiceTaskOperatorModdleElement = moddle.create(SERVICE_TASK_OPERATOR_ELEMENT_NAME);
      newServiceTaskOperatorModdleElement.id = value;
      let newParameterList;
      if (previouslyUsedServiceTaskParameterValues) {
        newParameterList = previouslyUsedServiceTaskParameterValues;
      } else {
        newParameterList = moddle.create(SERVICE_TASK_PARAMETERS_ELEMENT_NAME);
        newParameterList.parameters = [];
        serviceTaskOperator.parameters.forEach(stoParameter => {
          const newParameterModdleElement = moddle.create(SERVICE_TASK_PARAMETER_ELEMENT_NAME);
          newParameterModdleElement.id = stoParameter.id;
          newParameterModdleElement.type = stoParameter.type;
          newParameterList.parameters.push(newParameterModdleElement);
        });
        previouslyUsedServiceTaskParameterValuesHash[element.businessObject.id][value] = newParameterList;
        if (oldServiceTaskOperatorModdleElement) {
          previouslyUsedServiceTaskParameterValuesHash[element.businessObject.id][oldServiceTaskOperatorModdleElement.id] = oldServiceTaskOperatorModdleElement.parameterList;
        }
      }
      newServiceTaskOperatorModdleElement.parameterList = newParameterList;
      const newExtensionValues = extensions.get('values').filter(extValue => {
        return extValue.$type !== SERVICE_TASK_OPERATOR_ELEMENT_NAME;
      });
      newExtensionValues.push(newServiceTaskOperatorModdleElement);
      extensions.values = newExtensionValues;
      businessObject.extensionElements = extensions;
      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: businessObject,
        properties: {}
      });
    };
    const getOptions = () => {
      const optionList = [];
      if (serviceTaskOperators) {
        serviceTaskOperators.forEach(sto => {
          optionList.push({
            label: sto.id,
            value: sto.id
          });
        });
      }
      return optionList;
    };
    return propertiesPanel.SelectEntry({
      id: 'selectOperatorId',
      element,
      label: translate('Operator ID'),
      getValue,
      setValue,
      getOptions,
      debounce
    });
  }
  function ServiceTaskParameterArray(props) {
    const {
      element,
      commandStack
    } = props;
    const serviceTaskParameterModdleElements = getServiceTaskParameterModdleElements(element);
    const items = serviceTaskParameterModdleElements.map((serviceTaskParameterModdleElement, index) => {
      const id = `serviceTaskParameter-${index}`;
      return {
        id,
        label: serviceTaskParameterModdleElement.id,
        entries: serviceTaskParameterEntries({
          idPrefix: id,
          serviceTaskParameterModdleElement,
          commandStack
        }),
        autoFocusEntry: id
      };
    });
    return {
      items
    };
  }
  function serviceTaskParameterEntries(props) {
    const {
      idPrefix,
      serviceTaskParameterModdleElement,
      commandStack
    } = props;
    return [{
      idPrefix: `${idPrefix}-parameter`,
      component: ServiceTaskParameterTextField,
      serviceTaskParameterModdleElement,
      commandStack
    }];
  }
  function ServiceTaskParameterTextField(props) {
    const {
      idPrefix,
      element,
      serviceTaskParameterModdleElement,
      commandStack
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const setValue = value => {
      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: serviceTaskParameterModdleElement,
        properties: {
          value: value
        }
      });
    };
    const getValue = () => {
      return serviceTaskParameterModdleElement.value;
    };
    return propertiesPanel.TextFieldEntry({
      element,
      id: `${idPrefix}-textField`,
      getValue,
      setValue,
      debounce
    });
  }
  function ServiceTaskResultTextInput(props) {
    const {
      element,
      translate,
      commandStack
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const serviceTaskOperatorModdleElement = getServiceTaskOperatorModdleElement(element);
    const setValue = value => {
      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: serviceTaskOperatorModdleElement,
        properties: {
          resultVariable: value
        }
      });
    };
    const getValue = () => {
      if (serviceTaskOperatorModdleElement) {
        return serviceTaskOperatorModdleElement.resultVariable;
      }
      return '';
    };
    if (serviceTaskOperatorModdleElement) {
      return propertiesPanel.TextFieldEntry({
        element,
        label: translate('Response Variable'),
        description: translate('response will be saved to this variable.  Leave empty to discard the response.'),
        id: `result-textField`,
        getValue,
        setValue,
        debounce
      });
    }
    return null;
  }

  const spiffExtensionOptions$1 = {};
  const OPTION_TYPE = {
    json_schema_files: 'json_schema_files',
    dmn_files: 'dmn_files',
    task_metadata_keys: 'task_metadata_keys'
  };

  /**
   * Allow selecting an option from a list of available options, and setting
   * the name and value of a SpiffWorkflow Property to the one selected in the
   * dropdown list.
   * The list of options must be provided by the containing library - by responding
   * to a request passed to the eventBus.
   * When needed, the event "spiff.${optionType}.requested" will be fired.
   * The response should be sent to "spiff.${optionType}.returned". The response
   * event should include an 'options' attribute that is list of labels and values:
   * [ { label: 'Product Prices DMN', value: 'Process_16xfaqc' } ]
   */
  function SpiffExtensionSelect(props) {
    const {
      element
    } = props;
    const {
      commandStack
    } = props;
    const {
      moddle
    } = props;
    const {
      label,
      description
    } = props;
    const {
      name
    } = props;
    const {
      optionType
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const eventBus = bpmnJsPropertiesPanel.useService('eventBus');
    const getValue = () => {
      return getExtensionValue(element.businessObject, name);
    };
    const setValue = value => {
      setExtensionValue(element, name, value, moddle, commandStack);
    };
    const getOptions = () => {
      const optionList = [];
      optionList.push({
        label: '',
        value: ''
      });
      if (optionType in spiffExtensionOptions$1 && spiffExtensionOptions$1[optionType] !== null) {
        spiffExtensionOptions$1[optionType].forEach(opt => {
          optionList.push({
            label: opt.label,
            value: opt.value
          });
        });
      }
      return optionList;
    };

    // always call this code and let the caller determine how to deal with it.
    // this is to avoid state loading issues with react where it doesn't clear out the variable.
    spiffExtensionOptions$1[optionType] = null;
    requestOptions$1(eventBus, element, commandStack, optionType);
    return propertiesPanel.SelectEntry({
      id: `extension_${name}`,
      element,
      label,
      description,
      getValue,
      setValue,
      getOptions,
      debounce
    });
  }
  function requestOptions$1(eventBus, element, commandStack, optionType) {
    // Little backwards, but you want to assure you are ready to catch, before you throw
    // or you risk a race condition.
    eventBus.on(`spiff.${optionType}.returned`, event => {
      spiffExtensionOptions$1[optionType] = event.options;
    });
    eventBus.fire(`spiff.${optionType}.requested`, {
      eventBus
    });
  }

  /**
   * Sends a notification to the host application saying the user
   * would like to edit something.  Hosting application can then
   * update the value and send it back.
   */
  function SpiffExtensionLaunchButton(props) {
    const {
      element,
      name,
      event,
      listenEvent,
      listenFunction
    } = props;
    const eventBus = bpmnJsPropertiesPanel.useService('eventBus');
    return propertiesPanel.HeaderButton({
      className: 'spiffworkflow-properties-panel-button',
      id: `launch_editor_button_${name}`,
      onClick: () => {
        const value = getExtensionValue(element.businessObject, name);
        eventBus.fire(event, {
          value,
          eventBus,
          listenEvent
        });

        // Listen for a response if the listenEvent is provided, and
        // set the value to the response
        // Optional additional arguments if we should listen for a reponse.
        if (listenEvent) {
          const {
            commandStack,
            moddle
          } = props;
          // Listen for a response, to update the script.
          eventBus.once(listenEvent, response => {
            if (listenFunction) {
              listenFunction(element, name, response.value, moddle, commandStack);
            } else {
              setExtensionValue(element, name, response.value, moddle, commandStack);
            }
          });
        }
      },
      children: 'Launch Editor'
    });
  }

  function SpiffExtensionTextArea(props) {
    const element = props.element;
    const commandStack = props.commandStack,
      moddle = props.moddle;
    const name = props.name,
      label = props.label,
      description = props.description,
      id = props.id;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const getValue = () => {
      return getExtensionValue(element.businessObject, name);
    };
    const setValue = value => {
      setExtensionValue(element, name, value, moddle, commandStack);
    };
    return jsxRuntime.jsx(propertiesPanel.TextAreaEntry, {
      id: id !== undefined ? id : 'extension_' + name,
      element: element,
      description: description,
      label: label,
      getValue: getValue,
      setValue: setValue,
      debounce: debounce
    });
  }

  function SpiffExtensionCheckboxEntry(props) {
    const element = props.element;
    const commandStack = props.commandStack,
      moddle = props.moddle;
    const name = props.name,
      label = props.label,
      description = props.description;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const getValue = () => {
      return getExtensionValue(element.businessObject, name);
    };
    const setValue = value => {
      setExtensionValue(element, name, value, moddle, commandStack);
    };
    return jsxRuntime.jsx(propertiesPanel.CheckboxEntry, {
      id: 'extension_' + name,
      element: element,
      description: description,
      label: label,
      getValue: getValue,
      setValue: setValue,
      debounce: debounce
    });
  }

  function SpiffExtensionTaskMetadata(props) {
    const {
      element,
      commandStack,
      moddle
    } = props;
    const eventBus = bpmnJsPropertiesPanel.useService('eventBus');
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const [metadataKeys, setMetadataKeys] = hooks.useState(null);
    hooks.useEffect(() => {
      const onKeysReturned = event => {
        setMetadataKeys(event.keys || []);
      };
      eventBus.on(`spiff.${OPTION_TYPE.task_metadata_keys}.returned`, onKeysReturned);
      eventBus.fire(`spiff.${OPTION_TYPE.task_metadata_keys}.requested`, {
        eventBus
      });
      return () => {
        eventBus.off(`spiff.${OPTION_TYPE.task_metadata_keys}.returned`, onKeysReturned);
      };
    }, [eventBus]);
    const getMetadataValues = () => {
      const extensionElements = element.businessObject.extensionElements;
      if (!extensionElements) return [];
      const metadataValues = extensionElements.values.find(value => value.$type === 'spiffworkflow:TaskMetadataValues');
      return metadataValues ? metadataValues.values : [];
    };
    const getMetadataValue = key => {
      const values = getMetadataValues();
      const entry = values.find(v => v.name === key);
      return entry ? entry.value : '';
    };
    const setMetadataValue = (key, value) => {
      let extensionElements = element.businessObject.extensionElements;
      if (!extensionElements) {
        extensionElements = moddle.create('bpmn:ExtensionElements');
        extensionElements.values = [];
        commandStack.execute('element.updateModdleProperties', {
          element,
          moddleElement: element.businessObject,
          properties: {
            extensionElements
          }
        });
      }
      let metadataValues = extensionElements.values.find(val => val.$type === 'spiffworkflow:TaskMetadataValues');
      if (!metadataValues) {
        metadataValues = moddle.create('spiffworkflow:TaskMetadataValues');
        metadataValues.values = [];
        extensionElements.values.push(metadataValues);
      }
      let entry = metadataValues.values.find(v => v.name === key);
      if (value === undefined || value === '') {
        if (entry) {
          // Remove the entry
          const index = metadataValues.values.indexOf(entry);
          metadataValues.values.splice(index, 1);
        }
      } else {
        if (!entry) {
          entry = moddle.create('spiffworkflow:TaskMetadataValue');
          entry.name = key;
          metadataValues.values.push(entry);
        }
        entry.value = value;
      }

      // If metadataValues is empty, we could remove it, but let's keep it simple for now.
      // Actually, if we don't remove it, we might end up with empty <spiffworkflow:taskMetadataValues /> tag.
      // Let's check if values is empty and remove the container if so.
      if (metadataValues.values.length === 0) {
        const containerIndex = extensionElements.values.indexOf(metadataValues);
        if (containerIndex > -1) {
          extensionElements.values.splice(containerIndex, 1);
        }
      }
      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: element.businessObject,
        properties: {
          extensionElements
        }
      });
    };
    const translate = bpmnJsPropertiesPanel.useService('translate');
    const existingKeys = getMetadataValues().map(v => v.name);
    const configuredKeys = metadataKeys || [];
    const configuredKeyNames = configuredKeys.map(k => typeof k === 'string' ? k : k.name);

    // Merge configured keys with existing keys from XML
    const allKeys = [...new Set([...configuredKeyNames, ...existingKeys])];
    if (allKeys.length === 0) {
      return jsxRuntime.jsx("style", {
        children: `[data-group-id="group-task_metadata_properties"] { display: none !important; }`
      });
    }
    return jsxRuntime.jsx(jsxRuntime.Fragment, {
      children: allKeys.map(key => {
        const isConfigured = configuredKeyNames.includes(key);
        const keyEntry = configuredKeys.find(k => (typeof k === 'string' ? k : k.name) === key);
        const label = isConfigured ? typeof keyEntry === 'string' ? keyEntry : keyEntry.label || key : key;
        let description = isConfigured ? typeof keyEntry === 'string' ? undefined : keyEntry.description : translate('This key is not defined in the configuration.');
        if (!isConfigured) {
          description = jsxRuntime.jsxs(jsxRuntime.Fragment, {
            children: [description, ' ', jsxRuntime.jsx("a", {
              href: "#",
              onClick: e => {
                e.preventDefault();
                setMetadataValue(key, undefined);
              },
              style: {
                color: 'red'
              },
              children: "Remove"
            })]
          });
        }
        return jsxRuntime.jsx(propertiesPanel.TextFieldEntry, {
          id: `extension_task_metadata_${key}`,
          element: element,
          label: label ? translate(label) : key,
          description: description,
          getValue: () => getMetadataValue(key),
          setValue: value => {
            setMetadataValue(key, value);
          },
          debounce: debounce
        }, key);
      })
    });
  }

  const LOW_PRIORITY$9 = 500;
  function ExtensionsPropertiesProvider(propertiesPanel, translate, moddle, commandStack, elementRegistry) {
    this.getGroups = function (element) {
      return function (groups) {
        if (ModelUtil.is(element, 'bpmn:ScriptTask')) {
          groups.push(createScriptGroup(element, translate, moddle, commandStack));
        } else if (ModelUtil.isAny(element, ['bpmn:Task', 'bpmn:CallActivity', 'bpmn:SubProcess'])) {
          groups.push(preScriptPostScriptGroup(element, translate, moddle, commandStack));
        }
        if (ModelUtil.is(element, 'bpmn:UserTask')) {
          groups.push(createUserGroup(element, translate, moddle, commandStack));
        }
        if (ModelUtil.is(element, 'bpmn:BusinessRuleTask')) {
          groups.push(createBusinessRuleGroup(element, translate, moddle, commandStack));
        }
        if (ModelUtil.isAny(element, ['bpmn:ManualTask', 'bpmn:UserTask', 'bpmn:ServiceTask', 'bpmn:EndEvent', 'bpmn:ScriptTask', 'bpmn:IntermediateCatchEvent', 'bpmn:CallActivity', 'bpmn:SubProcess'])) {
          groups.push(createUserInstructionsGroup(element, translate, moddle, commandStack));
        }
        if (ModelUtil.isAny(element, ['bpmn:ManualTask', 'bpmn:UserTask'])) {
          groups.push(createAllowGuestGroup(element, translate, moddle, commandStack));
        }
        if (ModelUtil.is(element, 'bpmn:BoundaryEvent') && DiUtil.hasEventDefinition(element, 'bpmn:SignalEventDefinition') && ModelUtil.isAny(element.businessObject.attachedToRef, ['bpmn:ManualTask', 'bpmn:UserTask'])) {
          groups.push(createSignalButtonGroup(element, translate, moddle, commandStack));
        }
        if (ModelUtil.is(element, 'bpmn:ServiceTask')) {
          groups.push(createServiceGroup(element, translate, moddle, commandStack));
        }
        if (ModelUtil.isAny(element, ['bpmn:UserTask', 'bpmn:ManualTask'])) {
          groups.push(createTaskMetadataGroup(element, translate, moddle, commandStack));
        }
        return groups;
      };
    };
    propertiesPanel.registerProvider(LOW_PRIORITY$9, this);
  }
  ExtensionsPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'moddle', 'commandStack', 'elementRegistry'];

  /**
   * Adds a group to the properties panel for the script task that allows you
   * to set the script.
   * @param element
   * @param translate
   * @returns The components to add to the properties panel. */
  function createScriptGroup(element, translate, moddle, commandStack) {
    return {
      id: 'spiff_script',
      label: translate('Script'),
      entries: getEntries({
        element,
        moddle,
        scriptType: SCRIPT_TYPE.bpmn,
        label: 'Script',
        description: 'Code to execute.',
        translate,
        commandStack
      })
    };
  }

  /**
   * Adds a section to the properties' panel for NON-Script tasks, so that
   * you can define a pre-script and a post-script for modifying data as it comes and out.
   * @param element
   * @param translate
   * @param moddle  For altering the underlying XML File.
   * @returns The components to add to the properties panel.
   */
  function preScriptPostScriptGroup(element, translate, moddle, commandStack) {
    const entries = [...getEntries({
      element,
      moddle,
      commandStack,
      translate,
      scriptType: SCRIPT_TYPE.pre,
      label: 'Pre-Script',
      description: 'code to execute prior to this task.'
    }), ...getEntries({
      element,
      moddle,
      commandStack,
      translate,
      scriptType: SCRIPT_TYPE.post,
      label: 'Post-Script',
      description: 'code to execute after this task.'
    })];
    const loopCharacteristics = element.businessObject.loopCharacteristics;
    if (typeof loopCharacteristics !== 'undefined') {
      entries.push({
        id: 'scriptValence',
        component: ScriptValenceCheckbox,
        isEdited: propertiesPanel.isCheckboxEntryEdited,
        commandStack
      });
    }
    return {
      id: 'spiff_pre_post_scripts',
      label: translate('Pre/Post Scripts'),
      entries: entries
    };
  }
  function ScriptValenceCheckbox(props) {
    const {
      element,
      commandStack
    } = props;
    const getValue = () => {
      return element.businessObject.loopCharacteristics.scriptsOnInstances;
    };
    const setValue = value => {
      const loopCharacteristics = element.businessObject.loopCharacteristics;
      loopCharacteristics.scriptsOnInstances = value || undefined;
      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: loopCharacteristics
      });
    };
    return propertiesPanel.CheckboxEntry({
      element,
      id: 'selectScriptValence',
      label: 'Run scripts on instances',
      description: 'By default, scripts will attach to the multiinstance task',
      getValue,
      setValue
    });
  }

  /**
   * Create a group on the main panel with a select box (for choosing the Data Object to connect)
   * @param element
   * @param translate
   * @param moddle
   * @returns entries
   */
  function createUserGroup(element, translate, moddle, commandStack) {
    const updateExtensionProperties = (element, name, value, moddle, commandStack) => {
      const uiName = value.replace('schema.json', 'uischema.json');
      setExtensionValue(element, 'formJsonSchemaFilename', value, moddle, commandStack);
      setExtensionValue(element, 'formUiSchemaFilename', uiName, moddle, commandStack);
      const matches = spiffExtensionOptions$1[OPTION_TYPE.json_schema_files].filter(opt => opt.value === value);
      if (matches.length === 0) {
        spiffExtensionOptions$1[OPTION_TYPE.json_schema_files].push({
          label: value,
          value: value
        });
      }
    };
    return {
      id: 'user_task_properties',
      label: translate('Web Form (with Json Schemas)'),
      entries: [{
        element,
        moddle,
        commandStack,
        component: SpiffExtensionSelect,
        optionType: OPTION_TYPE.json_schema_files,
        name: 'formJsonSchemaFilename',
        label: translate('JSON Schema Filename'),
        description: translate('Form Description (RSJF)')
      }, {
        component: SpiffExtensionLaunchButton,
        element,
        moddle,
        commandStack,
        name: 'formJsonSchemaFilename',
        label: translate('Launch Editor'),
        event: 'spiff.file.edit',
        listenEvent: 'spiff.jsonSchema.update',
        listenFunction: updateExtensionProperties,
        description: translate('Edit the form schema')
      }, {
        element,
        moddle,
        commandStack,
        component: SpiffExtensionTextInput,
        name: 'spiffworkflow:VariableName',
        label: 'Variable Name',
        description: 'Store form results in this variable'
      }]
    };
  }

  /**
   * Select and launch for Business Rules
   *
   * @param element
   * @param translate
   * @param moddle
   * @param commandStack
   * @returns {{entries: [{moddle, component: ((function(*): preact.VNode<any>)|*), name: string, description, label, commandStack, element},{component: ((function(*): preact.VNode<any>)|*), name: string, description, label, event: string, element}], id: string, label}}
   */
  function createBusinessRuleGroup(element, translate, moddle, commandStack) {
    return {
      id: 'business_rule_properties',
      label: translate('Business Rule Properties'),
      entries: [{
        element,
        moddle,
        commandStack,
        component: SpiffExtensionSelect,
        optionType: OPTION_TYPE.dmn_files,
        name: 'spiffworkflow:CalledDecisionId',
        label: translate('Select Decision Table'),
        description: translate('Select a decision table from the list')
      }, {
        element,
        component: SpiffExtensionLaunchButton,
        name: 'spiffworkflow:CalledDecisionId',
        label: translate('Launch Editor'),
        event: 'spiff.dmn.edit',
        description: translate('Modify the Decision Table')
      }]
    };
  }

  /**
   * Create a group on the main panel with a text box (for choosing the information to display to the user)
   * @param element
   * @param translate
   * @param moddle
   * @returns entries
   */
  function createUserInstructionsGroup(element, translate, moddle, commandStack) {
    return {
      id: 'instructions',
      label: translate('Instructions'),
      entries: [{
        id: 'extension_spiffworkflow:InstructionsForEndUser',
        element,
        moddle,
        commandStack,
        component: SpiffExtensionTextArea,
        name: 'spiffworkflow:InstructionsForEndUser',
        label: 'Instructions',
        description: 'Displayed above user forms or when this task is executing.',
        isEdited: propertiesPanel.isTextAreaEntryEdited
      }, {
        id: 'extension_spiffworkflow:InstructionsForEndUser',
        element,
        moddle,
        commandStack,
        component: SpiffExtensionLaunchButton,
        name: 'spiffworkflow:InstructionsForEndUser',
        label: translate('Launch Editor'),
        event: 'spiff.markdown.edit',
        listenEvent: 'spiff.markdown.update',
        description: translate('Edit the form schema')
      }]
    };
  }

  /**
   * Create a group on the main panel with a text box (for choosing the information to display to the user)
   * @param element
   * @param translate
   * @param moddle
   * @returns entries
   */
  function createAllowGuestGroup(element, translate, moddle, commandStack) {
    return {
      id: 'allow_guest_user',
      label: translate('Guest options'),
      entries: [{
        element,
        moddle,
        commandStack,
        component: SpiffExtensionCheckboxEntry,
        name: 'spiffworkflow:AllowGuest',
        label: 'Guest can complete this task',
        description: 'Allow a guest user to complete this task without logging in. They will not be allowed to do anything but submit this task. If another task directly follows it that allows guest access, they could also complete that task.'
      }, {
        element,
        moddle,
        commandStack,
        component: SpiffExtensionTextArea,
        name: 'spiffworkflow:GuestConfirmation',
        label: 'Guest confirmation',
        description: 'This is markdown that is displayed to the user after they complete the task. If this is filled out then the user will not be able to complete additional tasks without a new link to the next task.'
      }, {
        element,
        moddle,
        commandStack,
        component: SpiffExtensionLaunchButton,
        name: 'spiffworkflow:GuestConfirmation',
        label: translate('Launch Editor'),
        event: 'spiff.markdown.edit',
        listenEvent: 'spiff.markdown.update'
      }]
    };
  }

  /**
   * Create a group on the main panel with a text box for specifying a
   * a Button Label that is associated with a signal event.)
   * @param element
   * @param translate
   * @param moddle
   * @returns entries
   */
  function createSignalButtonGroup(element, translate, moddle, commandStack) {
    let description = jsxRuntime.jsxs("p", {
      style: {
        maxWidth: '330px'
      },
      children: [' ', "If attached to a user/manual task, setting this value will display a button which a user can click to immediately fire this signal event."]
    });
    return {
      id: 'signal_button',
      label: translate('Button'),
      entries: [{
        element,
        moddle,
        commandStack,
        component: SpiffExtensionTextInput,
        name: 'spiffworkflow:SignalButtonLabel',
        label: 'Button Label',
        description: description
      }]
    };
  }

  /**
   * Create a group on the main panel with a text box (for choosing the dmn to connect)
   * @param element
   * @param translate
   * @param moddle
   * @returns entries
   */
  function createServiceGroup(element, translate, moddle, commandStack) {
    let entries = [{
      element,
      moddle,
      commandStack,
      component: ServiceTaskOperatorSelect,
      translate
    }, {
      element,
      moddle,
      commandStack,
      component: ServiceTaskResultTextInput,
      translate
    }];
    if (typeof element.businessObject.extensionElements !== 'undefined' && checkIfServiceTaskHasParameters(element.businessObject.extensionElements)) {
      entries.push({
        id: 'serviceTaskParameters',
        label: translate('Parameters'),
        component: propertiesPanel.ListGroup,
        shouldSort: false,
        ...ServiceTaskParameterArray({
          element,
          commandStack
        })
      });
    }
    return {
      id: 'service_task_properties',
      label: translate('Spiffworkflow Service Properties'),
      entries: entries
    };
  }

  /**
   * Create a group on the main panel for editing task metadata
   * @param element
   * @param translate
   * @param moddle
   * @param commandStack
   * @returns entries
   */
  function createTaskMetadataGroup(element, translate, moddle, commandStack) {
    return {
      id: 'task_metadata_properties',
      label: translate('Task Metadata'),
      entries: [{
        id: `infos-textField`,
        component: propertiesPanel.DescriptionEntry,
        value: translate('ℹ️ Value is an expression, so if you want a string, surround it in double quotes.'),
        element,
        translate,
        commandStack
      }, {
        element,
        moddle,
        commandStack,
        component: SpiffExtensionTaskMetadata
      }]
    };
  }

  /**
   * loops up until it can find the root.
   * @param element
   */
  function getRoot(businessObject, moddle) {
    // HACK: get the root element. need a more formal way to do this
    if (moddle) {
      for (const elementId in moddle.ids._seed.hats) {
        if (elementId.startsWith('Definitions_')) {
          return moddle.ids._seed.hats[elementId];
        }
      }
    } else {
      // todo: Do we want businessObject to be a shape or moddle object?
      if (businessObject && businessObject.$type === 'bpmn:Definitions') {
        return businessObject;
      }
      if (businessObject && typeof businessObject.$parent !== 'undefined') {
        return getRoot(businessObject.$parent);
      }
    }
    return businessObject;
  }
  function isMessageElement(shapeElement) {
    return ModelUtil.is(shapeElement, 'bpmn:SendTask') || ModelUtil.is(shapeElement, 'bpmn:ReceiveTask') || isMessageEvent(shapeElement);
  }
  function isMessageEvent(shapeElement) {
    try {
      const bo = shapeElement.businessObject ? shapeElement.businessObject : shapeElement;
      const {
        eventDefinitions
      } = bo;
      if (eventDefinitions && eventDefinitions[0]) {
        return eventDefinitions[0].$type === 'bpmn:MessageEventDefinition';
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  function canReceiveMessage(shapeElement) {
    if (ModelUtil.is(shapeElement, 'bpmn:ReceiveTask')) {
      return true;
    }
    if (isMessageEvent(shapeElement)) {
      return ModelUtil.is(shapeElement, 'bpmn:StartEvent') || ModelUtil.is(shapeElement, 'bpmn:CatchEvent');
    }
    return false;
  }
  function getMessageRefElement(shapeElement) {
    if (isMessageEvent(shapeElement)) {
      const messageEventDefinition = shapeElement.businessObject.eventDefinitions[0];
      if (messageEventDefinition && messageEventDefinition.messageRef) {
        return messageEventDefinition.messageRef;
      }
    } else if (isMessageElement(shapeElement) && shapeElement.businessObject.messageRef) {
      return shapeElement.businessObject.messageRef;
    }
    return null;
  }
  function findCorrelationPropertiesAndRetrievalExpressionsForMessage(shapeElement) {
    const formalExpressions = [];
    const messageRefElement = getMessageRefElement(shapeElement);
    if (messageRefElement) {
      const root = getRoot(shapeElement.businessObject);
      if (root.$type === 'bpmn:Definitions') {
        for (const childElement of root.rootElements) {
          if (childElement.$type === 'bpmn:CorrelationProperty') {
            const retrievalExpression = getRetrievalExpressionFromCorrelationProperty(childElement, messageRefElement);
            if (retrievalExpression) {
              const formalExpression = {
                correlationPropertyModdleElement: childElement,
                correlationPropertyRetrievalExpressionModdleElement: retrievalExpression
              };
              formalExpressions.push(formalExpression);
            }
          }
        }
      }
    }
    return formalExpressions;
  }
  function getMessageElementForShapeElement(shapeElement) {
    const {
      businessObject
    } = shapeElement;
    const taskMessage = getMessageRefElement(shapeElement);
    const messages = findMessageModdleElements(businessObject);
    if (taskMessage) {
      for (const message of messages) {
        if (message.id === taskMessage.id) {
          return message;
        }
      }
    }
    return null;
  }
  function getRetrievalExpressionFromCorrelationProperty(correlationProperty, message) {
    if (correlationProperty.correlationPropertyRetrievalExpression) {
      for (const retrievalExpression of correlationProperty.correlationPropertyRetrievalExpression) {
        if (retrievalExpression.$type === 'bpmn:CorrelationPropertyRetrievalExpression' && retrievalExpression.messageRef && retrievalExpression.messageRef.id === message.id) {
          return retrievalExpression;
        }
      }
    }
    return null;
  }
  function findCorrelationProperties(businessObject, moddle) {
    const root = getRoot(businessObject, moddle);
    const correlationProperties = [];
    if (isIterable(root.rootElements)) {
      for (const rootElement of root.rootElements) {
        if (rootElement.$type === 'bpmn:CorrelationProperty') {
          correlationProperties.push(rootElement);
        }
      }
    }
    return correlationProperties;
  }
  function findCorrelationPropertiesByMessage(element) {
    let messageId;
    const {
      businessObject
    } = element;
    const root = getRoot(businessObject);
    if (isMessageEvent(element)) {
      if (!businessObject.eventDefinitions || !businessObject.eventDefinitions[0].messageRef) {
        return [];
      } else {
        messageId = businessObject.eventDefinitions[0].messageRef.id;
      }
    } else if (isMessageElement(element)) {
      if (!businessObject.messageRef) return;
      messageId = businessObject.messageRef.id;
    }
    return findCorrelationPropertiesByMessageId(messageId, root);
  }
  function findCorrelationPropertiesByMessageId(messageId, root) {
    const correlationProperties = [];
    for (const rootElement of root.rootElements) {
      if (rootElement.$type === 'bpmn:CorrelationProperty') {
        rootElement.correlationPropertyRetrievalExpression = rootElement.correlationPropertyRetrievalExpression ? rootElement.correlationPropertyRetrievalExpression : [];
        const existingExpressionIndex = rootElement.correlationPropertyRetrievalExpression.findIndex(retrievalExpr => retrievalExpr.messageRef && retrievalExpr.messageRef.id === messageId);
        existingExpressionIndex !== -1 ? correlationProperties.push(rootElement) : null;
      }
    }
    return correlationProperties;
  }
  function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
  }
  function findMessageModdleElements(businessObject) {
    const messages = [];
    const root = getRoot(businessObject);
    if (root.rootElements) {
      for (const rootElement of root.rootElements) {
        if (rootElement.$type === 'bpmn:Message') {
          messages.push(rootElement);
        }
      }
    }
    return messages;
  }
  function findMessageElement(businessObject, messageId, definitions) {
    let root = getRoot(businessObject);

    // This case is to handle root for deleted elements
    if (!root && definitions) {
      root = definitions;
    }
    if (root.rootElements) {
      for (const rootElement of root.rootElements) {
        if (rootElement.$type === 'bpmn:Message' && rootElement.name == messageId) {
          return rootElement;
        }
      }
    }
    return null;
  }
  function createOrUpdateCorrelationPropertiesV2(bpmnFactory, commandStack, element, propertiesConfig, messageId) {
    let definitions = getRoot(element.businessObject);
    if (propertiesConfig) {
      // Iterate over each property configuration
      for (const propConfig of propertiesConfig) {
        let correlationProperty = findCorrelationPropertyById(definitions, propConfig.identifier);
        const msgElement = findMessageElement(element.businessObject, messageId);
        if (correlationProperty === null) {
          correlationProperty = bpmnFactory.create('bpmn:CorrelationProperty');
          correlationProperty.id = propConfig.identifier;
          correlationProperty.name = propConfig.identifier;
          correlationProperty.correlationPropertyRetrievalExpression = [];
        }
        correlationProperty.correlationPropertyRetrievalExpression = !correlationProperty.correlationPropertyRetrievalExpression ? [] : correlationProperty.correlationPropertyRetrievalExpression;
        const existingExpressionIndex = correlationProperty.correlationPropertyRetrievalExpression.findIndex(retrievalExpr => retrievalExpr.messageRef && retrievalExpr.messageRef.id === messageId);
        if (existingExpressionIndex === -1) {
          const retrievalExpression = bpmnFactory.create('bpmn:CorrelationPropertyRetrievalExpression');
          const formalExpression = bpmnFactory.create('bpmn:FormalExpression');
          formalExpression.body = propConfig.retrieval_expression ? propConfig.retrieval_expression : '';
          retrievalExpression.messagePath = formalExpression;
          retrievalExpression.messageRef = msgElement;
          correlationProperty.correlationPropertyRetrievalExpression.push(retrievalExpression);
        } else {
          const existingRetrievalExpression = correlationProperty.correlationPropertyRetrievalExpression[existingExpressionIndex];
          const existingFormalExpression = existingRetrievalExpression.messagePath;
          existingFormalExpression.body = propConfig.retrieval_expression ? propConfig.retrieval_expression : '';
        }
        const existingIndex = definitions.rootElements.findIndex(element => element.id === correlationProperty.id && element.$type === correlationProperty.$type);
        if (existingIndex !== -1) {
          // Update existing correlationProperty
          definitions.rootElements[existingIndex] = correlationProperty;
        } else {
          // Add new correlationProperty
          definitions.rootElements.push(correlationProperty);
        }
        commandStack.execute('element.updateProperties', {
          element,
          properties: {}
        });
      }
    }
  }
  function findCorrelationPropertyById(definitions, id) {
    let foundCorrelationProperty = null;
    definitions.rootElements.forEach(rootElement => {
      if (rootElement.$type === 'bpmn:CorrelationProperty' && rootElement.id === id) {
        foundCorrelationProperty = rootElement;
      }
    });
    return foundCorrelationProperty;
  }
  function isMessageRefUsed(definitions, messageRef) {
    if (!definitions.rootElements) {
      return true; // Assume used if no root elements to check (conservative default)
    }

    // Helper function to recursively check flow elements
    function checkElement(element) {
      // Check if this element references the messageRef
      if (isMessageEvent(element) && element.eventDefinitions && element.eventDefinitions[0] && element.eventDefinitions[0].messageRef && element.eventDefinitions[0].messageRef.id === messageRef) {
        return true;
      } else if (isMessageElement(element) && element.messageRef && element.messageRef.id === messageRef) {
        return true;
      }

      // If this element is a container (e.g., SubProcess), recurse into its flowElements
      if (element.$type === 'bpmn:SubProcess' && element.flowElements) {
        for (const childElement of element.flowElements) {
          if (checkElement(childElement)) {
            return true;
          }
        }
      }
      return false;
    }

    // Iterate over rootElements
    for (const rootElement of definitions.rootElements) {
      if (rootElement.$type === 'bpmn:Process') {
        const process = rootElement;
        if (process.flowElements) {
          for (const element of process.flowElements) {
            if (checkElement(element)) {
              return true;
            }
          }
        }
      }
    }
    return false; // No references found after full traversal
  }
  function setParentCorrelationKeys(definitions, bpmnFactory, element, moddle) {
    // Retrieve all correlation properties
    let correlationProperties = findCorrelationProperties(element.businessObject, moddle);
    correlationProperties = correlationProperties || [];
    let mainCorrelationKey = findOrCreateMainCorrelationKey(definitions, bpmnFactory, moddle);

    // Clear existing ones
    mainCorrelationKey.get('correlationPropertyRef').length = 0;

    // Sync correlation properties
    for (const cP of correlationProperties) {
      const cPElement = bpmnFactory.create('bpmn:CorrelationProperty', {
        id: cP.id,
        name: cP.name
      });
      mainCorrelationKey.get('correlationPropertyRef').push(cPElement);
    }

    // check if process has collaboration
    let collaboration = definitions.get('rootElements').find(element => element.$type === 'bpmn:Collaboration');
    if (collaboration) {
      // Remove existing correlation keys other than the main correlation key
      collaboration.get('correlationKeys').forEach((key, index) => {
        if (key.name !== 'MainCorrelationKey') {
          collaboration.get('correlationKeys').splice(index, 1);
        }
      });
      const existingKey = collaboration.get('correlationKeys').find(key => key.name === 'MainCorrelationKey');
      if (!existingKey) {
        collaboration.get('correlationKeys').push(mainCorrelationKey);
      } else {
        // Replace the existing key with mainCorrelationKey
        const index = collaboration.get('correlationKeys').indexOf(existingKey);
        if (index !== -1) {
          collaboration.get('correlationKeys').splice(index, 1, mainCorrelationKey);
        }
      }
    } else {
      // Handle case where no collaboration is found
      definitions.get('rootElements').forEach((element, index) => {
        if (element.$type === 'bpmn:CorrelationKey' && element.name !== 'MainCorrelationKey') {
          definitions.get('rootElements').splice(index, 1);
        }
      });
      const existingKey = definitions.get('rootElements').find(key => key.$type === 'bpmn:CorrelationKey' && key.name === 'MainCorrelationKey');
      if (!existingKey) {
        definitions.get('rootElements').push(mainCorrelationKey);
      } else {
        // Replace the existing key with mainCorrelationKey
        const index = definitions.get('rootElements').indexOf(existingKey);
        if (index !== -1) {
          definitions.get('rootElements').splice(index, 1, mainCorrelationKey);
        }
      }
    }
  }
  function findOrCreateMainCorrelationKey(definitions, bpmnFactory, moddle) {
    let mainCorrelationKey = definitions.get('rootElements').find(element => element.$type === 'bpmn:CorrelationKey' && element.name === 'MainCorrelationKey');
    if (!mainCorrelationKey) {
      const newCorrelationKeyId = moddle.ids.nextPrefixed('CorrelationKey_');
      mainCorrelationKey = bpmnFactory.create('bpmn:CorrelationKey', {
        id: newCorrelationKeyId,
        name: 'MainCorrelationKey'
      });
    }
    return mainCorrelationKey;
  }
  function syncCorrelationProperties(element, definitions, moddle, msgObject) {
    const {
      businessObject
    } = element;
    const correlationProps = findCorrelationProperties(businessObject, moddle);
    const expressionsToDelete = [];
    for (let cProperty of correlationProps) {
      let isUsed = false;
      for (const cpExpression of cProperty.correlationPropertyRetrievalExpression) {
        const msgRef = cpExpression.messageRef ? findMessageElement(businessObject, cpExpression.messageRef.id, definitions) : undefined;
        isUsed = msgRef && msgObject && cpExpression.messageRef.id !== msgObject.identifier ? true : isUsed;
        // if unused  false, delete retrival expression
        if (!msgRef) {
          expressionsToDelete.push(cpExpression);
        }
      }

      // Delete the retrieval expressions that are not used
      for (const expression of expressionsToDelete) {
        const index = cProperty.correlationPropertyRetrievalExpression.indexOf(expression);
        if (index > -1) {
          cProperty.correlationPropertyRetrievalExpression.splice(index, 1);
          const cPropertyIndex = definitions.get('rootElements').indexOf(cProperty);
          definitions.rootElements.splice(cPropertyIndex, 1, cProperty);
        }
      }

      // If Unused, delete the correlation property
      const propertyToBeDeleted = isUsed || msgObject && msgObject.correlation_properties && msgObject.correlation_properties.some(obj => obj.identifier === cProperty.id);
      if (!propertyToBeDeleted) {
        const index = definitions.get('rootElements').indexOf(cProperty);
        if (index > -1) {
          definitions.rootElements.splice(index, 1);
        }
      }
    }
  }
  function deleteMessage(definitions, messageId) {
    const rootElements = definitions.rootElements;

    // Delete the message object
    const index = rootElements.findIndex(element => element.$type === 'bpmn:Message' && element.id === messageId);
    if (rootElements && index !== -1) {
      rootElements.splice(index, 1);
      definitions.rootElements = rootElements;
    }

    // Delete retrieval expressions related to message
    const props = findCorrelationPropertiesByMessageId(messageId, definitions);
    for (let prop of props) {
      let propIndex = prop.correlationPropertyRetrievalExpression.findIndex(retrievalExpr => retrievalExpr.messageRef && retrievalExpr.messageRef.id === messageId);
      prop.correlationPropertyRetrievalExpression.splice(propIndex, 1);
    }
  }

  const spiffExtensionOptions = {};
  let ELEMENT_ID;

  /**
   * Allows the selection, or creation, of Message at the Definitions level of a BPMN document.
   */
  function MessageSelect(props) {
    let shapeElement = props.element;
    const {
      commandStack,
      moddle,
      elementRegistry
    } = props;
    let {
      element
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const eventBus = bpmnJsPropertiesPanel.useService('eventBus');
    const bpmnFactory = bpmnJsPropertiesPanel.useService('bpmnFactory');
    const getValue = () => {
      const messageRefElement = getMessageRefElement(shapeElement);
      if (messageRefElement) {
        return messageRefElement.id;
      }
      return '';
    };
    const setValue = async value => {
      const messageId = value;
      const {
        businessObject
      } = element;
      const oldMessageRef = businessObject.eventDefinitions?.[0].messageRef || businessObject.messageRef;
      const definitions = getRoot(businessObject);
      if (ELEMENT_ID) {
        // This condition verify if Setvalue trigger is about the same element triggered from spifarena
        const nwElement = elementRegistry.get(ELEMENT_ID);
        shapeElement = nwElement ? nwElement : shapeElement;
        element = nwElement ? nwElement : element;
      }
      if (!definitions?.rootElements) {
        definitions.rootElements = [];
      }
      let bpmnMessage = findMessageById(definitions, messageId);
      if (!bpmnMessage) {
        bpmnMessage = createMessage(bpmnFactory, messageId);
        definitions.rootElements.push(bpmnMessage);
      }
      updateElementMessageRef(element, bpmnMessage, moddle, commandStack);
      const messageObject = findMessageObject(messageId);
      if (messageObject) {
        createOrUpdateCorrelationPropertiesV2(bpmnFactory, commandStack, element, messageObject.correlation_properties, messageId);
      }
      if (oldMessageRef) {
        syncCorrelationProperties(element, definitions, moddle, messageObject);
      }
      try {
        setParentCorrelationKeys(definitions, bpmnFactory, element, moddle);
      } catch (error) {
        console.error('Error caught while synchronizing Correlation key', error);
      }
    };
    eventBus.on(SPIFF_ADD_MESSAGE_RETURNED_EVENT, async event => {
      // Check if the received element matches the current element
      if (event.elementId !== element.id) {
        ELEMENT_ID = event.elementId;
      }
      const cProperties = Object.entries(event.correlation_properties).map(([identifier, properties]) => ({
        identifier,
        retrieval_expression: Array.isArray(properties.retrieval_expression) ? properties.retrieval_expression[0] : properties.retrieval_expression
      }));
      let newMsg = {
        identifier: event.name,
        correlation_properties: cProperties
      };

      // Delete the original message object if one exists, so we can replace it with the new definition.
      const {
        businessObject
      } = element;
      const definitions = getRoot(businessObject);
      let oldMessage = findMessageById(definitions, newMsg.identifier);
      if (oldMessage) {
        deleteMessage(definitions, oldMessage.id);
      }

      // Update the list of options to display
      spiffExtensionOptions['spiff.messages'] = Array.isArray(spiffExtensionOptions['spiff.messages']) && spiffExtensionOptions['spiff.messages'] ? spiffExtensionOptions['spiff.messages'] : [];
      const messageIndex = spiffExtensionOptions['spiff.messages'].findIndex(msg => msg.identifier === newMsg.identifier);
      if (messageIndex !== -1) {
        spiffExtensionOptions['spiff.messages'][messageIndex] = newMsg;
      } else {
        spiffExtensionOptions['spiff.messages'].push(newMsg);
      }
      setValue(event.name);
    });
    requestOptions(eventBus);
    const getOptions = () => {
      // Load messages from XML
      const options = [];
      const messages = findMessageModdleElements(shapeElement.businessObject);
      for (const message of messages) {
        options.push({
          label: message.name,
          value: message.id
        });
      }

      // Load messages from API
      if (spiffExtensionOptions['spiff.messages'] && spiffExtensionOptions['spiff.messages'] !== null) {
        spiffExtensionOptions['spiff.messages'].forEach(opt => {
          options.push({
            label: opt.identifier,
            value: opt.identifier
          });
        });
      }

      // Remove duplicated options
      const uniqueArray = removeDuplicatesByLabel(options);
      return uniqueArray;
    };
    return jsxRuntime.jsx(propertiesPanel.SelectEntry, {
      id: "selectMessage",
      element: shapeElement,
      description: "Select the Message to associate with this task or event.",
      label: "Which message is this associated with?",
      getValue: getValue,
      setValue: setValue,
      getOptions: getOptions,
      debounce: debounce
    });
  }
  function requestOptions(eventBus, bpmnFactory, element, moddle) {
    eventBus.on(`spiff.messages.returned`, event => {
      spiffExtensionOptions['spiff.messages'] = event.configuration.messages;
    });
    eventBus.fire(`spiff.messages.requested`, {
      eventBus
    });
  }
  function removeDuplicatesByLabel(array) {
    const seen = new Map();
    return array.filter(item => {
      return seen.has(item.label) ? false : seen.set(item.label, true);
    });
  }
  function findMessageById(definitions, messageId) {
    return definitions.rootElements?.find(element => element.$type === 'bpmn:Message' && (element.id === messageId || element.name === messageId));
  }

  /**
   * Sanitize a message name into a valid xsd:ID.
   * xsd:ID must start with a letter or underscore and may only contain
   * letters, digits, hyphens, underscores, and periods.
   * Colons are NOT allowed (they are XML namespace separators).
   */
  function toSafeXmlId(name) {
    const sanitized = name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    // Ensure it starts with a letter or underscore
    if (/^[^a-zA-Z_]/.test(sanitized)) {
      return `Message_${sanitized}`;
    }
    return sanitized;
  }
  function createMessage(bpmnFactory, messageId) {
    return bpmnFactory.create('bpmn:Message', {
      id: toSafeXmlId(messageId),
      name: messageId
    });
  }
  function updateElementMessageRef(element, bpmnMessage, moddle, commandStack) {
    if (isMessageEvent(element) && element.businessObject) {
      const messageEventDefinition = element.businessObject.eventDefinitions[0];
      messageEventDefinition.extensionElements = messageEventDefinition.extensionElements ? messageEventDefinition.extensionElements : moddle.create('bpmn:ExtensionElements');
      messageEventDefinition.messageRef = bpmnMessage;
      commandStack.execute('element.updateModdleProperties', {
        element: element,
        moddleElement: element.businessObject,
        properties: {}
      });
    } else if (isMessageElement(element) && element.businessObject) {
      element.businessObject.extensionElements = element.businessObject.extensionElements ? element.businessObject.extensionElements : moddle.create('bpmn:ExtensionElements');
      element.businessObject.messageRef = bpmnMessage;
      commandStack.execute('element.updateProperties', {
        element: element,
        properties: {}
      });
    }
  }
  function findMessageObject(messageId) {
    const messageObject = spiffExtensionOptions['spiff.messages']?.find(msg => msg.identifier === messageId || msg.identifier === toSafeXmlId(messageId));
    if (messageObject) {
      return {
        identifier: messageObject.identifier,
        correlation_properties: messageObject.correlation_properties.map(prop => ({
          identifier: prop.identifier,
          retrieval_expression: prop.retrieval_expression
        }))
      };
    } else {
      return null;
    }
  }

  function MessagePayload(props) {
    const shapeElement = props.element;
    const {
      moddle,
      element,
      commandStack
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const messageElement = getMessageElementForShapeElement(shapeElement);
    const disabled = !messageElement;
    const getMessagePayloadObject = () => {
      if (element) {
        const {
          extensionElements
        } = isMessageEvent(element) ? element.businessObject.eventDefinitions[0] : element.businessObject;
        if (extensionElements && extensionElements.get('values')) {
          let payloadResp = extensionElements.get('values').filter(function getInstanceOfType(e) {
            return e.$instanceOf('spiffworkflow:MessagePayload');
          })[0];
          return payloadResp;
        }
      }
      return null;
    };
    const getValue = () => {
      const messagePayloadObject = getMessagePayloadObject();
      if (messagePayloadObject) {
        return messagePayloadObject.value;
      } else {
        // Check : for old models where payload exists on message level
        const bo = isMessageEvent(element) ? element.businessObject.eventDefinitions[0] : element.businessObject;
        const {
          messageRef
        } = bo;
        if (messageRef) {
          const {
            extensionElements
          } = messageRef;
          const payloadResp = extensionElements ? extensionElements.get('values').filter(function getInstanceOfType(e) {
            return e.$instanceOf('spiffworkflow:MessagePayload');
          })[0] : undefined;
          if (payloadResp) {
            setValue(payloadResp.value);
            return payloadResp.value;
          }
        }
      }
      return '';
    };
    const setValue = value => {
      var extensions = isMessageEvent(element) ? element.businessObject.eventDefinitions[0].get('extensionElements') || moddle.create('bpmn:ExtensionElements') : element.businessObject.get('extensionElements') || moddle.create('bpmn:ExtensionElements');
      let messagePayloadObject = getMessagePayloadObject();
      if (!messagePayloadObject) {
        messagePayloadObject = moddle.create('spiffworkflow:MessagePayload');
        extensions.get('values').push(messagePayloadObject);
      }
      messagePayloadObject.value = value;
      isMessageEvent(element) ? element.businessObject.eventDefinitions[0].set('extensionElements', extensions) : element.businessObject.set('extensionElements', extensions);
      commandStack.execute('element.updateProperties', {
        element,
        properties: {}
      });
    };
    return jsxRuntime.jsx(propertiesPanel.TextAreaEntry, {
      id: "messagePayload",
      element: shapeElement,
      description: "Enter a JSON object to define the message payload directly or provide the variable name that holds the payload data.",
      label: "Payload",
      disabled: disabled,
      getValue: getValue,
      setValue: setValue,
      debounce: debounce
    });
  }

  function MessageVariable(props) {
    const shapeElement = props.element;
    const {
      moddle,
      element,
      commandStack
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const messageElement = getMessageElementForShapeElement(shapeElement);
    const disabled = !messageElement;
    const getMessageVariableObject = () => {
      if (element) {
        const {
          extensionElements
        } = isMessageEvent(element) ? element.businessObject.eventDefinitions[0] : element.businessObject;
        if (extensionElements && extensionElements.get('values')) {
          let variableResp = extensionElements.get('values').filter(function getInstanceOfType(e) {
            return e.$instanceOf('spiffworkflow:MessageVariable');
          })[0];
          return variableResp;
        }
      }
      return null;
    };
    const getValue = () => {
      const messageVariableObject = getMessageVariableObject();
      if (messageVariableObject) {
        return messageVariableObject.value;
      }

      // Check : for old models where messageVariable exists on message level
      const bo = isMessageEvent(element) ? element.businessObject.eventDefinitions[0] : element.businessObject;
      const {
        messageRef
      } = bo;
      if (messageRef) {
        const {
          extensionElements
        } = messageRef;
        const messageResp = extensionElements ? extensionElements.get('values').filter(function getInstanceOfType(e) {
          return e.$instanceOf('spiffworkflow:MessageVariable');
        })[0] : undefined;
        if (messageResp) {
          setValue(messageResp.value);
          return messageResp.value;
        }
      }
      return '';
    };
    const setValue = value => {
      var extensions = isMessageEvent(element) ? element.businessObject.eventDefinitions[0].get('extensionElements') || moddle.create('bpmn:ExtensionElements') : element.businessObject.get('extensionElements') || moddle.create('bpmn:ExtensionElements');
      let messageVariableObject = getMessageVariableObject();
      if (!messageVariableObject) {
        messageVariableObject = moddle.create('spiffworkflow:MessageVariable');
        extensions.get('values').push(messageVariableObject);
      }
      messageVariableObject.value = value;
      isMessageEvent(element) ? element.businessObject.eventDefinitions[0].set('extensionElements', extensions) : element.businessObject.set('extensionElements', extensions);
      commandStack.execute('element.updateProperties', {
        element,
        properties: {}
      });
    };
    return jsxRuntime.jsx(propertiesPanel.TextFieldEntry, {
      id: "messageVariable",
      element: shapeElement,
      description: "The name of the variable where we should store payload.",
      label: "Variable Name",
      disabled: disabled,
      getValue: getValue,
      setValue: setValue,
      debounce: debounce
    });
  }

  /**
   * Sends a notification to the host application saying the user
   * would like to edit something.  Hosting application can then
   * update the value and send it back.
   */
  function MessageLaunchEditorButton(props) {
    const {
      element,
      moddle
    } = props;
    const sendEvent = 'spiff.message.edit';
    const listenEvent = 'spiff.message.update';
    const eventBus = bpmnJsPropertiesPanel.useService('eventBus');
    const messageRef = getMessageRefElement(element);
    const correlationProperties = findCorrelationPropertiesAndRetrievalExpressionsForMessage(element);
    const parsedCorrelationProperties = correlationProperties.map(item => ({
      id: item.correlationPropertyModdleElement.id,
      retrievalExpression: item.correlationPropertyRetrievalExpressionModdleElement.messagePath.body
    }));
    let messageId = null;
    if (messageRef && messageRef.id) {
      messageId = messageRef.id;
    }
    if (messageRef && messageRef.name && messageRef.name !== messageId) {
      messageId = messageRef.name;
    }
    return propertiesPanel.HeaderButton({
      className: 'spiffworkflow-properties-panel-button',
      id: `message_launch_message_editor_button`,
      onClick: () => {
        // eventBus.fire('spiff.add_message.requested', { eventBus });

        eventBus.fire(sendEvent, {
          value: {
            elementId: element.id,
            messageId,
            correlation_properties: parsedCorrelationProperties
          },
          eventBus,
          listenEvent
        });

        // Listen for a response, to update the script.
        eventBus.once(listenEvent, response => {
          messageRef.id = response.value;
        });
      },
      children: 'Open message editor'
    });
  }

  /**
   * Matching correlation conditions
   */
  function MatchingCorrelationEntries(props) {
    const {
      idPrefix,
      translate,
      element,
      commandStack,
      moddle
    } = props;
    const correlationPropertyArray = findCorrelationPropertiesByMessage(element);
    const entries = correlationPropertyArray && correlationPropertyArray.length !== 0 ? correlationPropertyArray.map((correlationPropertyModdleElement, index) => {
      return {
        id: `${idPrefix}-correlation-property-`,
        component: MatchingConditionTextField,
        correlationPropertyModdleElement,
        element,
        translate,
        commandStack,
        moddle
      };
    }) : [{
      id: `${idPrefix}-name-textField`,
      component: propertiesPanel.DescriptionEntry,
      value: 'ℹ️ No matching conditions can be established since the selected message has no correlation properties',
      element,
      translate,
      commandStack
    }];
    return {
      entries
    };
  }
  function MatchingConditionTextField(props) {
    const {
      id,
      element,
      commandStack,
      translate,
      correlationPropertyModdleElement,
      moddle
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const getVariableCorrelationObject = () => {
      if (element) {
        const {
          extensionElements
        } = isMessageEvent(element) ? element.businessObject.eventDefinitions[0] : element.businessObject;
        if (extensionElements) {
          return extensionElements.get('values').filter(function getInstanceOfType(e) {
            return e.$instanceOf('spiffworkflow:ProcessVariableCorrelation') && e.propertyId === correlationPropertyModdleElement.id;
          })[0];
        }
      }
      return null;
    };
    const setValue = value => {
      const trimmedValue = value ? value.trim() : value;
      var extensions = isMessageEvent(element) ? element.businessObject.eventDefinitions[0].get('extensionElements') || moddle.create('bpmn:ExtensionElements') : element.businessObject.get('extensionElements') || moddle.create('bpmn:ExtensionElements');
      let variableCorrelationObject = getVariableCorrelationObject();
      if (trimmedValue === '' || !trimmedValue) {
        // remove the object if it exists
        if (variableCorrelationObject) {
          const index = extensions.get('values').indexOf(variableCorrelationObject);
          if (index > -1) {
            extensions.get('values').splice(index, 1);
          }
        }
      } else {
        // create or update the object
        if (!variableCorrelationObject) {
          variableCorrelationObject = moddle.create('spiffworkflow:ProcessVariableCorrelation', {
            propertyId: correlationPropertyModdleElement.id,
            expression: trimmedValue
          });
          extensions.get('values').push(variableCorrelationObject);
        } else {
          variableCorrelationObject.expression = trimmedValue;
        }
      }
      isMessageEvent(element) ? element.businessObject.eventDefinitions[0].set('extensionElements', extensions) : element.businessObject.set('extensionElements', extensions);
      commandStack.execute('element.updateProperties', {
        element,
        properties: {}
      });
    };
    const getValue = () => {
      const variableCorrelationObject = getVariableCorrelationObject();
      if (variableCorrelationObject && variableCorrelationObject.propertyId === correlationPropertyModdleElement.id) {
        return variableCorrelationObject.expression;
      }
      return '';
    };
    return propertiesPanel.TextFieldEntry({
      element,
      id: `${id}-name-textField`,
      label: translate(correlationPropertyModdleElement.id),
      getValue,
      setValue,
      debounce
    });
  }

  function MatchingCorrelationCheckboxEntry(props) {
    const {
      element,
      commandStack,
      moddle
    } = props;
    const {
      name,
      label,
      description
    } = props;
    const {
      businessObject
    } = element;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const getValue = () => {
      const isMatchingCorrelation = businessObject.get('spiffworkflow:isMatchingCorrelation');
      const value = isMatchingCorrelation && isMatchingCorrelation !== 'false' ? true : false;
      return value;
    };
    const setValue = value => {
      commandStack.execute('element.updateProperties', {
        element,
        properties: {
          'spiffworkflow:isMatchingCorrelation': value
        }
      });
    };
    return jsxRuntime.jsx(propertiesPanel.CheckboxEntry, {
      id: 'correlation_extension_' + name,
      element: element,
      description: description,
      label: label,
      getValue: getValue,
      setValue: setValue,
      debounce: debounce
    });
  }

  /**
   * Adds a group to the properties panel for editing messages for the SendTask
   * @param element
   * @param translate
   * @returns The components to add to the properties panel. */
  function createMessageGroup(element, translate, moddle, commandStack, elementRegistry) {
    const {
      businessObject
    } = element;
    const entries = [{
      id: 'selectMessage',
      element,
      component: MessageSelect,
      isEdited: propertiesPanel.isTextFieldEntryEdited,
      moddle,
      commandStack,
      elementRegistry
    }, {
      id: 'messageLaunchEditorButton',
      element,
      translate,
      component: MessageLaunchEditorButton,
      moddle
    }];
    if (canReceiveMessage(element)) {
      entries.push({
        id: 'messageVariable',
        element,
        component: MessageVariable,
        isEdited: propertiesPanel.isTextFieldEntryEdited,
        moddle,
        commandStack
      });
    } else {
      entries.push({
        id: 'messagePayload',
        element,
        component: MessagePayload,
        isEdited: propertiesPanel.isTextFieldEntryEdited,
        moddle,
        commandStack
      });
    }
    if (canReceiveMessage(element)) {
      // Given the user the possibility to either enable/disable showing correlations conditions.
      entries.push({
        id: 'spiffworkflow:isMatchingCorrelation',
        element,
        moddle,
        commandStack,
        component: MatchingCorrelationCheckboxEntry,
        name: 'enable.correlation',
        label: translate('Enable Condition Matching'),
        description: 'Determine when this message should be received based on matching data values.'
      });
    }

    // Given the user the possibility to either enable/disable showing correlations.
    // entries.push({
    //   id: 'isCorrelated',
    //   element,
    //   moddle,
    //   commandStack,
    //   component: CorrelationCheckboxEntry,
    //   name: 'enable.correlation',
    //   label: translate('Enable Correlation'),
    //   description: 'You can define specific correlation properties for your message.',
    // });

    var results = [{
      id: 'messages',
      label: translate('Message'),
      isDefault: true,
      entries
    }];

    // Showing Correlation Properties Group if correlation is enabled
    // if (businessObject.get('isCorrelated')) {
    // results.push({
    //   id: 'correlationProperties',
    //   label: translate('Correlation Properties'),
    //   isDefault: true,
    //   component: ListGroup,
    //   ...CorrelationPropertiesList({
    //     element,
    //     moddle,
    //     commandStack,
    //     elementRegistry,
    //     translate,
    //   }),
    // })
    // }

    // Adding JsonSchema Group
    // results.push({
    //   id: 'messageSchema',
    //   label: translate('Json-Schema'),
    //   entries: [
    //     {
    //       component: MessageJsonSchemaSelect,
    //       element,
    //       name: 'msgJsonSchema',
    //       label: translate('Define JSON Schema'),
    //       description: translate('Select a JSON schema for your message'),
    //       moddle,
    //       commandStack
    //     },
    //     {
    //       component: LaunchJsonSchemaEditorButton,
    //       element,
    //       name: 'messageRef',
    //       label: translate('Launch Editor')
    //     }
    //   ]
    // })

    // Adding Correlation Conditions Section
    const isMatchingCorrelation = businessObject.get('spiffworkflow:isMatchingCorrelation');
    const id = businessObject.get('messageRef')?.id ?? 'undefined';
    if (isMatchingCorrelation && isMatchingCorrelation !== 'false' && canReceiveMessage(element)) {
      results.push({
        id: 'correlationConditions',
        label: translate('Matching Conditions'),
        ...MatchingCorrelationEntries({
          idPrefix: id,
          element,
          moddle,
          commandStack,
          translate
        })
      });
    }
    return results;
  }

  const LOW_PRIORITY$8 = 500;
  function MessagesPropertiesProvider(propertiesPanel, translate, moddle, commandStack, elementRegistry) {
    this.getGroups = function getGroupsCallback(element) {
      return function pushGroup(groups) {
        if (isMessageElement(element)) {
          const messageIndex = findEntry(groups, 'message');
          if (messageIndex) {
            groups.splice(messageIndex, 1);
          }
          groups.push(...createMessageGroup(element, translate, moddle, commandStack, elementRegistry));
        }
        return groups;
      };
    };
    function findEntry(entries, entryId) {
      let entryIndex = null;
      entries.forEach(function (value, index) {
        if (value.id === entryId) {
          entryIndex = index;
        }
      });
      return entryIndex;
    }
    propertiesPanel.registerProvider(LOW_PRIORITY$8, this);
  }
  MessagesPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'moddle', 'commandStack', 'elementRegistry'];

  /* This function creates a list of a particular event type at the process level using the item list
   * and add function provided by `getArray`.
   *
   * Usage:
   * const getArray = getArrayForType('bpmn:Signal', 'signalRef', 'Signal');
   * const signalGroup = createGroupForType('signals', 'Signals', getArray);
   */

  function getListGroupForType(groupId, label, getArray) {
    return function (props) {
      const {
        element,
        translate,
        moddle,
        commandStack
      } = props;
      const eventArray = {
        id: groupId,
        element,
        label: label,
        component: propertiesPanel.ListGroup,
        ...getArray({
          element,
          moddle,
          commandStack,
          translate
        })
      };
      if (eventArray.items) {
        return eventArray;
      }
    };
  }
  function getArrayForType(itemType, referenceType, prefix) {
    return function (props) {
      const {
        element,
        moddle,
        commandStack,
        translate
      } = props;
      const root = getRoot$1(element.businessObject);
      const matching = root.rootElements ? root.rootElements.filter(elem => elem.$type === itemType) : [];
      function removeModelReferences(flowElements, match) {
        flowElements.map(elem => {
          if (elem.eventDefinitions) elem.eventDefinitions = elem.eventDefinitions.filter(def => def.get(referenceType) != match);else if (elem.flowElements) removeModelReferences(elem.flowElements, match);
        });
      }
      function removeElementReferences(children, match) {
        children.map(child => {
          if (child.businessObject.eventDefinitions) {
            const bo = child.businessObject;
            bo.eventDefinitions = bo.eventDefinitions.filter(def => def.get(referenceType) != match);
            commandStack.execute('element.updateProperties', {
              element: child,
              moddleElement: bo,
              properties: {}
            });
          }
          if (child.children) removeElementReferences(child.children, match);
        });
      }
      function removeFactory(item) {
        return function (event) {
          event.stopPropagation();
          if (root.rootElements) {
            root.rootElements = root.rootElements.filter(elem => elem != item);
            // This updates visible elements
            removeElementReferences(element.children, item);
            // This handles everything else (eg collapsed subprocesses) but does not update the shapes
            // I can't figure out how to do that
            root.rootElements.filter(elem => elem.$type === 'bpmn:Process').map(process => removeModelReferences(process.flowElements, item));
            commandStack.execute('element.updateProperties', {
              element,
              properties: {}
            });
          }
        };
      }
      const items = matching.map((item, idx) => {
        const itemId = `${prefix}-${idx}`;
        return {
          id: itemId,
          label: item.name,
          entries: getItemEditor({
            itemId,
            item,
            commandStack,
            translate
          }),
          autoFocusEntry: itemId,
          remove: removeFactory(item)
        };
      });
      function add(event) {
        event.stopPropagation();
        const item = moddle.create(itemType);
        item.id = moddle.ids.nextPrefixed(`${prefix}_`);
        item.name = item.id;
        if (root.rootElements) root.rootElements.push(item);
        commandStack.execute('element.updateProperties', {
          element,
          properties: {}
        });
      }
      return {
        items,
        add
      };
    };
  }
  function getItemEditor(props) {
    const {
      itemId,
      item,
      commandStack,
      translate
    } = props;
    return [{
      id: `${itemId}-name`,
      component: ItemTextField,
      item,
      commandStack,
      translate
    }];
  }
  function ItemTextField(props) {
    const {
      itemId,
      element,
      item,
      commandStack,
      translate
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const setValue = value => {
      commandStack.execute('element.updateModdleProperties', {
        element,
        moddleElement: item,
        properties: {
          id: processId(value),
          name: value
        }
      });
    };
    const getValue = () => {
      return item.id;
    };
    return propertiesPanel.TextFieldEntry({
      element,
      id: `${itemId}-id-textField`,
      label: translate('ID'),
      getValue,
      setValue,
      debounce
    });
  }

  function hasEventType(element, eventType) {
    const events = element.businessObject.eventDefinitions;
    return events && events.filter(item => ModelUtil.is(item, eventType)).length > 0;
  }
  function replaceGroup(groupId, groups, group) {
    const idx = groups.map(g => g.id).indexOf(groupId);
    if (idx > -1) groups.splice(idx, 1, group);else groups.push(group);
    group.shouldOpen = true;
  }
  function isCatchingEvent(element) {
    return ModelUtil.isAny(element, ['bpmn:StartEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent']);
  }
  function isThrowingEvent(element) {
    return ModelUtil.isAny(element, ['bpmn:EndEvent', 'bpmn:IntermediateThrowEvent']);
  }
  function getConfigureGroupForType(eventDetails, label, includeCode, getSelect) {
    const {
      eventType,
      eventDefType,
      referenceType,
      idPrefix
    } = eventDetails;
    return function (props) {
      const {
        element,
        translate,
        moddle,
        commandStack
      } = props;
      const variableName = getTextFieldForExtension(eventDetails, 'Variable Name', 'The name of the variable to store the payload in', true);
      const payloadDefinition = getTextFieldForExtension(eventDetails, 'Payload', 'The expression to create the payload with', false);
      const entries = [{
        id: `${idPrefix}-select`,
        element,
        component: getSelect,
        isEdited: propertiesPanel.isTextFieldEntryEdited,
        moddle,
        commandStack
      }];
      const boundaryCondition = ModelUtil.is(element, 'bpmn:BoundaryEvent') && (DiUtil.hasEventDefinition(element, 'bpmn:ErrorEventDefinition') && element.businessObject.eventDefinitions[0].errorRef || DiUtil.hasEventDefinition(element, 'bpmn:EscalationEventDefinition') && element.businessObject.eventDefinitions[0].escalationRef || DiUtil.hasEventDefinition(element, 'bpmn:SignalEventDefinition') && element.businessObject.eventDefinitions[0].signalRef);
      if (includeCode) {
        const codeField = getCodeTextField(eventDetails, `${label} Code`);
        entries.push({
          id: `${idPrefix}-code`,
          element,
          component: codeField,
          isEdited: propertiesPanel.isTextFieldEntryEdited,
          moddle,
          commandStack
        });
      }
      if (isCatchingEvent(element) && boundaryCondition) {
        entries.push({
          id: `${idPrefix}-variable`,
          element,
          component: variableName,
          isEdited: propertiesPanel.isTextFieldEntryEdited,
          moddle,
          commandStack
        });
      } else if (isThrowingEvent(element)) {
        entries.push({
          id: `${idPrefix}-payload`,
          element,
          component: payloadDefinition,
          isEdited: propertiesPanel.isTextFieldEntryEdited,
          moddle,
          commandStack
        });
      }
      return {
        id: `${idPrefix}-group`,
        label,
        entries
      };
    };
  }
  function getSelectorForType(eventDetails) {
    const {
      eventType,
      eventDefType,
      referenceType,
      idPrefix
    } = eventDetails;
    return function (props) {
      const {
        element,
        translate,
        moddle,
        commandStack
      } = props;
      const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
      const root = getRoot$1(element.businessObject);
      const getValue = () => {
        const eventDef = element.businessObject.eventDefinitions.find(v => v.$type == eventDefType);
        return eventDef && eventDef.get(referenceType) ? eventDef.get(referenceType).id : '';
      };
      const setValue = value => {
        const bpmnEvent = root.rootElements.find(e => e.id == value);
        // not sure how to handle multiple event definitions
        const eventDef = element.businessObject.eventDefinitions.find(v => v.$type == eventDefType);
        // really not sure what to do here if one of these can't be found either
        if (bpmnEvent && eventDef) eventDef.set(referenceType, bpmnEvent);
        commandStack.execute('element.updateProperties', {
          element,
          moddleElement: element.businessObject,
          properties: {}
        });
      };
      const getOptions = val => {
        const matching = root.rootElements ? root.rootElements.filter(elem => elem.$type === eventType) : [];
        const options = [];
        matching.map(option => options.push({
          label: option.name,
          value: option.id
        }));
        return options;
      };
      return propertiesPanel.SelectEntry({
        id: `${idPrefix}-select`,
        element,
        description: 'Select item',
        getValue,
        setValue,
        getOptions,
        debounce
      });
    };
  }
  function getTextFieldForExtension(eventDetails, label, description, catching) {
    const {
      eventType,
      eventDefType,
      referenceType,
      idPrefix
    } = eventDetails;
    return function (props) {
      const {
        element,
        moddle,
        commandStack
      } = props;
      const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
      const translate = bpmnJsPropertiesPanel.useService('translate');
      getRoot$1(element.businessObject);
      const extensionName = catching ? 'spiffworkflow:VariableName' : 'spiffworkflow:PayloadExpression';
      const getEvent = () => {
        const eventDef = element.businessObject.eventDefinitions.find(v => v.$type == eventDefType);
        return eventDef.get(referenceType);
      };
      const getValue = () => {
        // I've put the variable name (and payload) on the event for consistency with messages.
        // However, when I think about this, I wonder if it shouldn't be on the event definition.
        // I think that's something we should address in the future.
        // Creating a payload and defining access to it are both process-specific, and that's an argument for leaving
        // it in the event definition
        const bpmnEvent = getEvent();
        if (bpmnEvent && bpmnEvent.extensionElements) {
          const extension = bpmnEvent.extensionElements.get('values').find(ext => ext.$instanceOf(extensionName));
          return extension ? extension.value : null;
        }
      };
      const setValue = value => {
        const bpmnEvent = getEvent();
        if (bpmnEvent) {
          if (!bpmnEvent.extensionElements) bpmnEvent.extensionElements = moddle.create('bpmn:ExtensionElements');
          const extensions = bpmnEvent.extensionElements.get('values');
          const extension = extensions.find(ext => ext.$instanceOf(extensionName));
          if (!extension) {
            const newExt = moddle.create(extensionName);
            newExt.value = value;
            extensions.push(newExt);
          } else extension.value = value;
        } // not sure what to do if the event hasn't been set
      };

      if (catching) {
        return propertiesPanel.TextFieldEntry({
          element,
          id: `${idPrefix}-variable-name`,
          description,
          label: translate(label),
          getValue,
          setValue,
          debounce
        });
      }
      return propertiesPanel.TextAreaEntry({
        element,
        id: `${idPrefix}-payload-expression`,
        description,
        label: translate(label),
        getValue,
        setValue,
        debounce
      });
    };
  }
  function getCodeTextField(eventDetails, label) {
    const {
      eventType,
      eventDefType,
      referenceType,
      idPrefix
    } = eventDetails;
    return function (props) {
      const {
        element,
        moddle,
        commandStack
      } = props;
      const translate = bpmnJsPropertiesPanel.useService('translate');
      const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
      const attrName = `${idPrefix}Code`;
      const getEvent = () => {
        const eventDef = element.businessObject.eventDefinitions.find(v => v.$type == eventDefType);
        return eventDef.get(referenceType);
      };
      const getValue = () => {
        const bpmnEvent = getEvent();
        return bpmnEvent ? bpmnEvent.get(attrName) : null;
      };
      const setValue = value => {
        const bpmnEvent = getEvent();
        if (bpmnEvent) bpmnEvent.set(attrName, value);
      };
      return propertiesPanel.TextFieldEntry({
        element,
        id: `${idPrefix}-code-value`,
        label: translate(label),
        getValue,
        setValue,
        debounce
      });
    };
  }

  const LOW_PRIORITY$7 = 500;
  const eventDetails$2 = {
    eventType: 'bpmn:Signal',
    eventDefType: 'bpmn:SignalEventDefinition',
    referenceType: 'signalRef',
    idPrefix: 'signal'
  };
  function SignalPropertiesProvider(propertiesPanel, translate, moddle, commandStack) {
    this.getGroups = function (element) {
      return function (groups) {
        if (ModelUtil.is(element, 'bpmn:Process') || ModelUtil.is(element, 'bpmn:Collaboration')) {
          const getSignalArray = getArrayForType('bpmn:Signal', 'signalRef', 'Signal');
          const signalGroup = getListGroupForType('signals', 'Signals', getSignalArray);
          groups.push(signalGroup({
            element,
            translate,
            moddle,
            commandStack
          }));
        } else if (hasEventType(element, 'bpmn:SignalEventDefinition')) {
          const getSignalSelector = getSelectorForType(eventDetails$2);
          const signalGroup = getConfigureGroupForType(eventDetails$2, 'Signal', false, getSignalSelector);
          const group = signalGroup({
            element,
            translate,
            moddle,
            commandStack
          });
          replaceGroup('signal', groups, group);
        }
        return groups;
      };
    };
    propertiesPanel.registerProvider(LOW_PRIORITY$7, this);
  }
  SignalPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'moddle', 'commandStack'];

  const LOW_PRIORITY$6 = 500;
  const eventDetails$1 = {
    eventType: 'bpmn:Error',
    eventDefType: 'bpmn:ErrorEventDefinition',
    referenceType: 'errorRef',
    idPrefix: 'error'
  };
  function ErrorPropertiesProvider(propertiesPanel, translate, moddle, commandStack) {
    this.getGroups = function (element) {
      return function (groups) {
        if (ModelUtil.is(element, 'bpmn:Process') || ModelUtil.is(element, 'bpmn:Collaboration')) {
          const getErrorArray = getArrayForType('bpmn:Error', 'errorRef', 'Error');
          const errorGroup = getListGroupForType('errors', 'Errors', getErrorArray);
          groups.push(errorGroup({
            element,
            translate,
            moddle,
            commandStack
          }));
        } else if (hasEventType(element, 'bpmn:ErrorEventDefinition')) {
          const getErrorSelector = getSelectorForType(eventDetails$1);
          const errorGroup = getConfigureGroupForType(eventDetails$1, 'Error', true, getErrorSelector);
          const group = errorGroup({
            element,
            translate,
            moddle,
            commandStack
          });
          replaceGroup('error', groups, group);
        }
        return groups;
      };
    };
    propertiesPanel.registerProvider(LOW_PRIORITY$6, this);
  }
  ErrorPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'moddle', 'commandStack'];

  const LOW_PRIORITY$5 = 500;
  const eventDetails = {
    eventType: 'bpmn:Escalation',
    eventDefType: 'bpmn:EscalationEventDefinition',
    referenceType: 'escalationRef',
    idPrefix: 'escalation'
  };
  function EscalationPropertiesProvider(propertiesPanel, translate, moddle, commandStack) {
    this.getGroups = function (element) {
      return function (groups) {
        if (ModelUtil.is(element, 'bpmn:Process') || ModelUtil.is(element, 'bpmn:Collaboration')) {
          const getEscalationArray = getArrayForType('bpmn:Escalation', 'escalationRef', 'Escalation');
          const escalationGroup = getListGroupForType('escalations', 'Escalations', getEscalationArray);
          groups.push(escalationGroup({
            element,
            translate,
            moddle,
            commandStack
          }));
        } else if (hasEventType(element, 'bpmn:EscalationEventDefinition')) {
          const getEscalationSelector = getSelectorForType(eventDetails);
          const escalationGroup = getConfigureGroupForType(eventDetails, 'Escalation', true, getEscalationSelector);
          const group = escalationGroup({
            element,
            translate,
            moddle,
            commandStack
          });
          replaceGroup('escalation', groups, group);
        }
        return groups;
      };
    };
    propertiesPanel.registerProvider(LOW_PRIORITY$5, this);
  }
  EscalationPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'moddle', 'commandStack'];

  const LOW_PRIORITY$4 = 500;
  function CallActivityPropertiesProvider(propertiesPanel, translate, moddle, commandStack, _elementRegistry) {
    this.getGroups = function getGroupsCallback(element) {
      return function pushGroup(groups) {
        if (ModelUtil.is(element, 'bpmn:CallActivity')) {
          groups.push(createCalledElementGroup(element, translate, moddle, commandStack));
        }
        return groups;
      };
    };
    propertiesPanel.registerProvider(LOW_PRIORITY$4, this);
  }
  CallActivityPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'moddle', 'commandStack', 'elementRegistry'];
  function createCalledElementGroup(element, translate, moddle, commandStack) {
    return {
      id: 'called_element',
      label: translate('Called Element'),
      entries: [{
        id: `called_element_text_field`,
        element,
        component: CalledElementTextField,
        moddle,
        commandStack,
        translate
      }, /* Commented out until such time as we can effectively calculate the list of available processes by process id */
      {
        id: `called_element_launch_button`,
        element,
        component: LaunchEditorButton,
        moddle,
        commandStack,
        translate
      }, {
        id: `called_element_find_button`,
        element,
        component: FindProcessButton,
        moddle,
        commandStack,
        translate
      }]
    };
  }
  function getCalledElementValue$1(element) {
    const {
      calledElement
    } = element.businessObject;
    if (calledElement) {
      return calledElement;
    }
    return '';
  }
  function CalledElementTextField(props) {
    const {
      element
    } = props;
    const {
      translate
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const getValue = () => {
      return getCalledElementValue$1(element);
    };
    const setValue = value => {
      element.businessObject.calledElement = value;
    };
    return propertiesPanel.TextFieldEntry({
      element,
      id: 'process_id',
      label: translate('Process ID'),
      getValue,
      setValue,
      debounce
    });
  }
  function FindProcessButton(props) {
    const {
      element,
      commandStack
    } = props;
    const eventBus = bpmnJsPropertiesPanel.useService('eventBus');
    return propertiesPanel.HeaderButton({
      id: 'spiffworkflow-search-call-activity-button',
      class: 'spiffworkflow-properties-panel-button',
      onClick: () => {
        const processId = getCalledElementValue$1(element);

        // First, set up the listen, then fire the event, just
        // in case we are testing and things are happening superfast.
        eventBus.once('spiff.callactivity.update', response => {
          commandStack.execute('element.updateProperties', {
            element: response.element,
            moddleElement: response.element.businessObject,
            properties: {
              calledElement: response.value
            }
          });
        });
        eventBus.fire('spiff.callactivity.search', {
          processId,
          eventBus,
          element
        });
      },
      children: 'Search'
    });
  }
  function LaunchEditorButton(props) {
    const {
      element
    } = props;
    const eventBus = bpmnJsPropertiesPanel.useService('eventBus');
    return propertiesPanel.HeaderButton({
      id: 'spiffworkflow-open-call-activity-button',
      class: 'spiffworkflow-properties-panel-button',
      onClick: () => {
        const processId = getCalledElementValue$1(element);
        eventBus.fire('spiff.callactivity.edit', {
          element,
          processId
        });
      },
      children: 'Launch Editor'
    });
  }

  function createSpecification(bpmnFactory, businessObject, type, newElement) {
    let ioSpecification = businessObject.ioSpecification;
    if (!ioSpecification) {
      ioSpecification = bpmnFactory.create('bpmn:InputOutputSpecification', {
        dataInputs: [],
        dataOutputs: [],
        inputSets: [],
        outputSets: []
      });
      businessObject.ioSpecification = ioSpecification;
    }
    if (type === 'input') {
      ioSpecification.dataInputs.push(newElement);
      if (!ioSpecification.inputSets.length) {
        ioSpecification.inputSets.push(bpmnFactory.create('bpmn:InputSet', {
          dataInputRefs: [newElement]
        }));
      } else {
        ioSpecification.inputSets[0].dataInputRefs.push(newElement);
      }
    } else if (type === 'output') {
      ioSpecification.dataOutputs.push(newElement);
      if (!ioSpecification.outputSets.length) {
        ioSpecification.outputSets.push(bpmnFactory.create('bpmn:OutputSet', {
          dataOutputRefs: [newElement]
        }));
      } else {
        ioSpecification.outputSets[0].dataOutputRefs.push(newElement);
      }
    }
    return ioSpecification;
  }
  function removeElementFromSpecification(element, entry, type) {
    const ioSpecification = element.businessObject.ioSpecification;
    if (!ioSpecification) {
      console.error('No ioSpecification found for this element.');
      return;
    }
    const collection = type === 'input' ? ioSpecification.dataInputs : ioSpecification.dataOutputs;
    const setCollection = type === 'input' ? ioSpecification.inputSets : ioSpecification.outputSets;
    const index = collection.findIndex(item => item.id === entry.id);
    if (index > -1) {
      const [removedElement] = collection.splice(index, 1);
      setCollection.forEach(set => {
        const refIndex = set[type === 'input' ? 'dataInputRefs' : 'dataOutputRefs'].indexOf(removedElement);
        if (refIndex > -1) {
          set[type === 'input' ? 'dataInputRefs' : 'dataOutputRefs'].splice(refIndex, 1);
        }
      });
    } else {
      console.error(`No ${type === 'input' ? 'DataInput' : 'DataOutput'} found for id ${entry.id}`);
    }
  }
  function updateElementProperties(commandStack, element) {
    commandStack.execute('element.updateProperties', {
      element: element,
      moddleElement: element.businessObject,
      properties: {}
    });
  }

  function InputParametersArray(props) {
    const {
      element,
      moddle,
      translate,
      commandStack,
      bpmnFactory
    } = props;
    const {
      businessObject
    } = element;
    const ioSpecification = businessObject.ioSpecification;
    const inputsEntries = ioSpecification ? ioSpecification.dataInputs : [];
    const items = inputsEntries ? inputsEntries.map((inputEntry, index) => {
      const id = `inputEntry-${index}`;
      return {
        id,
        label: translate(inputEntry.name),
        entries: InputParamGroup({
          element,
          commandStack,
          moddle,
          translate,
          bpmnFactory,
          inputEntry
        }),
        autoFocusEntry: `input-focus-entry`,
        remove: removeFactory$1({
          element,
          commandStack,
          inputEntry
        })
      };
    }) : [];
    function add(event) {
      const {
        businessObject
      } = element;
      const newInputID = moddle.ids.nextPrefixed('DataInput_');

      // Create a new DataInput
      const newInput = bpmnFactory.create('bpmn:DataInput', {
        id: newInputID,
        name: newInputID
      });

      // Check if ioSpecification already exists
      createSpecification(bpmnFactory, businessObject, 'input', newInput);

      // Update the element
      updateElementProperties(commandStack, element);
      event.stopPropagation();
    }
    return {
      items,
      add
    };
  }
  function removeFactory$1(props) {
    const {
      element,
      commandStack,
      inputEntry
    } = props;
    return function (event) {
      event.stopPropagation();
      removeElementFromSpecification(element, inputEntry, 'input');
      updateElementProperties(commandStack, element);
    };
  }
  function InputParamGroup(props) {
    const {
      id,
      inputEntry,
      element,
      moddle,
      commandStack,
      translate,
      bpmnFactory
    } = props;
    return [{
      id,
      inputEntry,
      component: InputParamTextField,
      isEdited: propertiesPanel.isTextFieldEntryEdited,
      element,
      moddle,
      commandStack,
      translate,
      bpmnFactory
    }];
  }
  function InputParamTextField(props) {
    const {
      id,
      element,
      inputEntry,
      moddle,
      commandStack,
      translate,
      bpmnFactory
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const setValue = value => {
      try {
        const ioSpecification = element.businessObject.ioSpecification;
        if (!value || value == '') {
          console.error('No value provided for this input.');
          return;
        }
        if (!ioSpecification) {
          console.error('No ioSpecification found for this element.');
          return;
        }
        let existingInput = ioSpecification.dataInputs.find(input => input.id === inputEntry.name || input.name === inputEntry.name);
        if (existingInput) {
          existingInput.name = value;
          existingInput.id = value;
        } else {
          console.error(`No DataInput found :> ${inputEntry.name}`);
          return;
        }
        updateElementProperties(commandStack, element);
      } catch (error) {
        console.log('Setting Value Error : ', error);
      }
    };
    const getValue = () => {
      return inputEntry.name;
    };
    return propertiesPanel.TextFieldEntry({
      element,
      id: `${id}-input`,
      label: translate('Input Name'),
      getValue,
      setValue,
      debounce
    });
  }

  function OutputParametersArray(props) {
    const {
      element,
      moddle,
      translate,
      commandStack,
      bpmnFactory
    } = props;
    const {
      businessObject
    } = element;
    const ioSpecification = businessObject.ioSpecification;
    const outputsEntries = ioSpecification ? ioSpecification.dataOutputs : [];
    const items = outputsEntries ? outputsEntries.map((outputEntry, index) => {
      const id = `outputEntry-${index}`;
      return {
        id,
        label: translate(outputEntry.name),
        entries: OutputParamGroup({
          element,
          commandStack,
          moddle,
          translate,
          bpmnFactory,
          outputEntry
        }),
        autoFocusEntry: `output-focus-entry`,
        remove: removeFactory({
          element,
          commandStack,
          outputEntry
        })
      };
    }) : [];
    function add(event) {
      const {
        businessObject
      } = element;
      const newOutputID = moddle.ids.nextPrefixed('DataOutput_');

      // Create a new DataOutput
      const newOutput = bpmnFactory.create('bpmn:DataOutput', {
        id: newOutputID,
        name: newOutputID
      });

      // Check if ioSpecification already exists
      createSpecification(bpmnFactory, businessObject, 'output', newOutput);

      // Update the element
      updateElementProperties(commandStack, element);
      event.stopPropagation();
    }
    return {
      items,
      add
    };
  }
  function removeFactory(props) {
    const {
      element,
      commandStack,
      outputEntry
    } = props;
    return function (event) {
      event.stopPropagation();
      removeElementFromSpecification(element, outputEntry, 'output');
      updateElementProperties(commandStack, element);
    };
  }
  function OutputParamGroup(props) {
    const {
      id,
      outputEntry,
      element,
      moddle,
      commandStack,
      translate,
      bpmnFactory
    } = props;
    return [{
      id,
      outputEntry,
      component: OutputParamTextField,
      isEdited: propertiesPanel.isTextFieldEntryEdited,
      element,
      moddle,
      commandStack,
      translate,
      bpmnFactory
    }];
  }
  function OutputParamTextField(props) {
    const {
      id,
      element,
      outputEntry,
      moddle,
      commandStack,
      translate,
      bpmnFactory
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const setValue = value => {
      try {
        const ioSpecification = element.businessObject.ioSpecification;
        if (!value || value == '') {
          console.error('No value provided for this input.');
          return;
        }
        if (!ioSpecification) {
          console.error('No ioSpecification found for this element.');
          return;
        }
        let existingInput = ioSpecification.dataOutputs.find(input => input.id === outputEntry.name || input.name === outputEntry.name);
        if (existingInput) {
          existingInput.name = value;
          existingInput.id = value;
        } else {
          console.error(`No DataOutput found :> ${outputEntry.name}`);
          return;
        }
        updateElementProperties(commandStack, element);
      } catch (error) {
        console.log('Setting Value Error : ', error);
      }
    };
    const getValue = () => {
      return outputEntry.name;
    };
    return propertiesPanel.TextFieldEntry({
      element,
      id: `${id}-output`,
      label: translate('Output Name'),
      getValue,
      setValue,
      debounce
    });
  }

  function createIoGroup(element, translate, moddle, commandStack, bpmnFactory) {
    const group = {
      label: translate('Input/Output Management'),
      id: 'ioProperties',
      entries: []
    };

    // add description input
    group.entries.push({
      id: `infos-textField`,
      component: propertiesPanel.DescriptionEntry,
      value: 'ℹ️ When no specific inputs/outputs are defined, all process variables are accessible.',
      element,
      translate,
      commandStack
    });

    // add input list component
    group.entries.push({
      id: 'inputParameters',
      label: translate('Inputs'),
      component: propertiesPanel.ListGroup,
      ...InputParametersArray({
        element,
        moddle,
        translate,
        commandStack,
        bpmnFactory
      })
    });

    // add output list component
    group.entries.push({
      id: 'outputParameters',
      label: translate('Outputs'),
      component: propertiesPanel.ListGroup,
      ...OutputParametersArray({
        element,
        moddle,
        translate,
        commandStack,
        bpmnFactory
      })
    });
    return group;
  }

  const LOW_PRIORITY$3 = 500;
  function IoPropertiesProvider(propertiesPanel, translate, moddle, commandStack, elementRegistry, bpmnFactory) {
    this.getGroups = function getGroupsCallback(element) {
      return function pushGroup(groups) {
        if (isBpmnTask(element)) {
          groups.push(createIoGroup(element, translate, moddle, commandStack, bpmnFactory));
        }
        return groups;
      };
    };
    propertiesPanel.registerProvider(LOW_PRIORITY$3, this);
  }
  IoPropertiesProvider.$inject = ['propertiesPanel', 'translate', 'moddle', 'commandStack', 'elementRegistry', 'bpmnFactory'];
  function isBpmnTask(element) {
    if (!element) {
      return false;
    }
    return ModelUtil.is(element, 'bpmn:UserTask') || ModelUtil.is(element, 'bpmn:ScriptTask') || ModelUtil.is(element, 'bpmn:ServiceTask') || ModelUtil.is(element, 'bpmn:SendTask') || ModelUtil.is(element, 'bpmn:ReceiveTask') || ModelUtil.is(element, 'bpmn:ManualTask');
  }

  /* eslint-disable prettier/prettier */
  /* eslint-disable no-param-reassign */

  function getLoopProperty(element, propertyName) {
    const {
      loopCharacteristics
    } = element.businessObject;
    const prop = loopCharacteristics.get(propertyName);
    let value = '';
    if (typeof prop !== 'object') {
      value = prop;
    } else if (typeof prop !== 'undefined') {
      if (prop.$type === 'bpmn:FormalExpression') value = prop.get('body');else value = prop.get('id');
    }
    return value;
  }
  function setLoopProperty(element, propertyName, value, commandStack) {
    const {
      loopCharacteristics
    } = element.businessObject;
    if (typeof value === 'object') {
      value.$parent = loopCharacteristics;
    }
    const properties = {
      [propertyName]: value
    };
    if (propertyName === 'loopCardinality') properties.loopDataInputRef = undefined;
    if (propertyName === 'loopDataInputRef') properties.loopCardinality = undefined;
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: loopCharacteristics,
      properties
    });
  }
  function removeLoopProperty(element, propertyName, commandStack) {
    const {
      loopCharacteristics
    } = element.businessObject;
    const properties = {
      [propertyName]: undefined
    };
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: loopCharacteristics,
      properties
    });
  }
  function setIsIOValue(element, value, commandStack) {
    commandStack.execute('element.updateProperties', {
      element,
      properties: {
        'spiffworkflow:isOutputSynced': value
      }
    });
  }

  const LOW_PRIORITY$2 = 500;
  function StandardLoopPropertiesProvider(propertiesPanel$1) {
    this.getGroups = function getGroupsCallback(element) {
      return function pushGroup(groups) {
        if ((ModelUtil.is(element, 'bpmn:Task') || ModelUtil.is(element, 'bpmn:CallActivity') || ModelUtil.is(element, 'bpmn:SubProcess')) && typeof element.businessObject.loopCharacteristics !== 'undefined' && element.businessObject.loopCharacteristics.$type === 'bpmn:StandardLoopCharacteristics') {
          const group = {
            id: 'standardLoopCharacteristics',
            component: propertiesPanel.Group,
            label: 'Standard Loop',
            entries: StandardLoopProps(element),
            shouldOpen: true
          };
          if (groups.length < 3) groups.push(group);else groups.splice(2, 0, group);
        }
        return groups;
      };
    };
    propertiesPanel$1.registerProvider(LOW_PRIORITY$2, this);
  }
  StandardLoopPropertiesProvider.$inject = ['propertiesPanel'];
  function StandardLoopProps(props) {
    const {
      element
    } = props;
    return [{
      id: 'loopMaximum',
      component: LoopMaximum,
      isEdited: propertiesPanel.isTextFieldEntryEdited
    }, {
      id: 'loopCondition',
      component: LoopCondition,
      isEdited: propertiesPanel.isTextFieldEntryEdited
    }, {
      id: 'testBefore',
      component: TestBefore,
      isEdited: propertiesPanel.isCheckboxEntryEdited
    }];
  }
  function LoopMaximum(props) {
    const {
      element
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const translate = bpmnJsPropertiesPanel.useService('translate');
    const commandStack = bpmnJsPropertiesPanel.useService('commandStack');
    bpmnJsPropertiesPanel.useService('bpmnFactory');
    const getValue = () => {
      return getLoopProperty(element, 'loopMaximum');
    };
    const setValue = value => {
      setLoopProperty(element, 'loopMaximum', value, commandStack);
    };
    return propertiesPanel.TextFieldEntry({
      element,
      id: 'loopMaximum',
      label: translate('Loop Maximum'),
      getValue,
      setValue,
      debounce
    });
  }
  function TestBefore(props) {
    const {
      element
    } = props;
    bpmnJsPropertiesPanel.useService('debounceInput');
    const translate = bpmnJsPropertiesPanel.useService('translate');
    const commandStack = bpmnJsPropertiesPanel.useService('commandStack');
    bpmnJsPropertiesPanel.useService('bpmnFactory');
    const getValue = () => {
      return getLoopProperty(element, 'testBefore');
    };
    const setValue = value => {
      setLoopProperty(element, 'testBefore', value, commandStack);
    };
    return propertiesPanel.CheckboxEntry({
      element,
      id: 'testBefore',
      label: translate('Test Before'),
      getValue,
      setValue
    });
  }
  function LoopCondition(props) {
    const {
      element
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const translate = bpmnJsPropertiesPanel.useService('translate');
    const commandStack = bpmnJsPropertiesPanel.useService('commandStack');
    const bpmnFactory = bpmnJsPropertiesPanel.useService('bpmnFactory');
    const getValue = () => {
      return getLoopProperty(element, 'loopCondition');
    };
    const setValue = value => {
      const loopCondition = bpmnFactory.create('bpmn:FormalExpression', {
        body: value
      });
      setLoopProperty(element, 'loopCondition', loopCondition, commandStack);
    };
    return propertiesPanel.TextFieldEntry({
      element,
      id: 'loopCondition',
      label: translate('Loop Condition'),
      getValue,
      setValue,
      debounce
    });
  }

  /* eslint-disable prettier/prettier */
  /* eslint-disable import/no-extraneous-dependencies */
  /* eslint-disable import/order */

  function InputItem(props) {
    const {
      element
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const translate = bpmnJsPropertiesPanel.useService('translate');
    const commandStack = bpmnJsPropertiesPanel.useService('commandStack');
    const bpmnFactory = bpmnJsPropertiesPanel.useService('bpmnFactory');
    const getValue = () => {
      return getLoopProperty(element, 'inputDataItem');
    };
    const setValue = value => {
      const item = typeof value !== 'undefined' && value !== '' ? bpmnFactory.create('bpmn:DataInput', {
        id: value,
        name: value
      }) : undefined;
      setLoopProperty(element, 'inputDataItem', item, commandStack);
      try {
        const {
          businessObject
        } = element;
        if (businessObject.get('spiffworkflow:isOutputSynced')) {
          setLoopProperty(element, 'outputDataItem', item, commandStack);
        }
      } catch (error) {
        console.log('Error caught while set value Input item', error);
      }
    };
    return propertiesPanel.TextFieldEntry({
      element,
      id: 'inputDataItem',
      label: translate('Input Element'),
      getValue,
      setValue,
      debounce,
      description: 'Each item in the collection will be copied to this variable'
    });
  }

  /* eslint-disable prettier/prettier */
  /* eslint-disable import/no-extraneous-dependencies */
  /* eslint-disable import/order */

  function LoopCardinality(props) {
    const {
      element
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const translate = bpmnJsPropertiesPanel.useService('translate');
    const commandStack = bpmnJsPropertiesPanel.useService('commandStack');
    const bpmnFactory = bpmnJsPropertiesPanel.useService('bpmnFactory');
    const getValue = () => {
      return getLoopProperty(element, 'loopCardinality');
    };
    const setValue = value => {
      if (!value || value === '') {
        // If value is empty or undefined, remove loopCardinality from XML
        removeLoopProperty(element, 'loopCardinality', commandStack);
        return;
      }
      const loopCardinality = bpmnFactory.create('bpmn:FormalExpression', {
        body: value
      });
      setLoopProperty(element, 'loopCardinality', loopCardinality, commandStack);
    };
    return propertiesPanel.TextFieldEntry({
      element,
      id: 'loopCardinality',
      label: translate('Loop Cardinality'),
      getValue,
      setValue,
      debounce,
      description: 'Explicitly set the number of instances'
    });
  }

  /* eslint-disable prettier/prettier */
  /* eslint-disable import/no-extraneous-dependencies */
  /* eslint-disable import/order */

  function InputCollection(props) {
    const {
      element
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const translate = bpmnJsPropertiesPanel.useService('translate');
    const commandStack = bpmnJsPropertiesPanel.useService('commandStack');
    const bpmnFactory = bpmnJsPropertiesPanel.useService('bpmnFactory');
    const getValue = () => {
      return getLoopProperty(element, 'loopDataInputRef');
    };
    const setValue = value => {
      if (!value || value === '') {
        // If value is empty or undefined, remove loopDataInputRef from XML
        removeLoopProperty(element, 'loopDataInputRef', commandStack);
        return;
      }
      const collection = bpmnFactory.create('bpmn:ItemAwareElement', {
        id: value
      });
      setLoopProperty(element, 'loopDataInputRef', collection, commandStack);
    };
    const getOptions = () => {
      const businessObject = element.businessObject;
      const parent = businessObject.$parent;
      const dataObjects = findDataObjects(parent);
      const options = [{
        label: '',
        value: ''
      } // Empty option to allow clearing
      ];

      dataObjects.forEach(dataObj => {
        options.push({
          label: dataObj.name || dataObj.id,
          value: dataObj.id
        });
      });
      return options;
    };
    return propertiesPanel.SelectEntry({
      element,
      id: 'loopDataInputRef',
      label: translate('Input Collection'),
      getValue,
      setValue,
      getOptions,
      debounce,
      description: 'Create an instance for each item in this collection'
    });
  }

  /* eslint-disable prettier/prettier */
  /* eslint-disable import/no-extraneous-dependencies */
  /* eslint-disable import/order */
  function OutputItem(props) {
    const {
      element
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const translate = bpmnJsPropertiesPanel.useService('translate');
    const commandStack = bpmnJsPropertiesPanel.useService('commandStack');
    const bpmnFactory = bpmnJsPropertiesPanel.useService('bpmnFactory');
    const getValue = () => {
      return getLoopProperty(element, 'outputDataItem');
    };
    const setValue = value => {
      try {
        const inVal = getLoopProperty(element, 'inputDataItem');
        if (inVal === value) {
          alert('You have entered the same value for both Input and Output elements without enabling synchronization. Please confirm if this is intended.');
          return;
        }
      } catch (error) {
        console.log('Error caught while Set Value OutputItem', error);
      }
      const item = typeof value !== 'undefined' && value !== '' ? bpmnFactory.create('bpmn:DataOutput', {
        id: value,
        name: value
      }) : undefined;
      setLoopProperty(element, 'outputDataItem', item, commandStack);
    };
    return propertiesPanel.TextFieldEntry({
      element,
      id: 'outputDataItem',
      label: translate('Output Element'),
      getValue,
      setValue,
      debounce,
      description: 'The value of this variable will be added to the output collection'
    });
  }

  /* eslint-disable prettier/prettier */
  /* eslint-disable import/no-extraneous-dependencies */
  /* eslint-disable import/order */

  function OutputCollection(props) {
    const {
      element
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const translate = bpmnJsPropertiesPanel.useService('translate');
    const commandStack = bpmnJsPropertiesPanel.useService('commandStack');
    const bpmnFactory = bpmnJsPropertiesPanel.useService('bpmnFactory');
    const getValue = () => {
      return getLoopProperty(element, 'loopDataOutputRef');
    };
    const setValue = value => {
      if (!value || value === '') {
        // If value is empty or undefined, remove loopDataOutputRef from XML
        removeLoopProperty(element, 'loopDataOutputRef', commandStack);
        return;
      }
      const collection = bpmnFactory.create('bpmn:ItemAwareElement', {
        id: value
      });
      setLoopProperty(element, 'loopDataOutputRef', collection, commandStack);
    };
    const getOptions = () => {
      const businessObject = element.businessObject;
      const parent = businessObject.$parent;
      const dataObjects = findDataObjects(parent);
      const options = [{
        label: '',
        value: ''
      } // Empty option to allow clearing
      ];

      dataObjects.forEach(dataObj => {
        options.push({
          label: dataObj.name || dataObj.id,
          value: dataObj.id
        });
      });
      return options;
    };
    return propertiesPanel.SelectEntry({
      element,
      id: 'loopDataOutputRef',
      label: translate('Output Collection'),
      getValue,
      setValue,
      getOptions,
      debounce,
      description: 'Create or update this collection with the instance results'
    });
  }

  /* eslint-disable prettier/prettier */
  /* eslint-disable import/no-extraneous-dependencies */
  /* eslint-disable import/order */

  function CompletionCondition(props) {
    const {
      element
    } = props;
    const debounce = bpmnJsPropertiesPanel.useService('debounceInput');
    const translate = bpmnJsPropertiesPanel.useService('translate');
    const commandStack = bpmnJsPropertiesPanel.useService('commandStack');
    const bpmnFactory = bpmnJsPropertiesPanel.useService('bpmnFactory');
    const getValue = () => {
      return getLoopProperty(element, 'completionCondition');
    };
    const setValue = value => {
      if (!value || value === '') {
        // If value is empty, remove completionCondition from XML
        removeLoopProperty(element, 'completionCondition', commandStack);
        return;
      }
      const completionCondition = bpmnFactory.create('bpmn:FormalExpression', {
        body: value
      });
      setLoopProperty(element, 'completionCondition', completionCondition, commandStack);
    };
    return propertiesPanel.TextFieldEntry({
      element,
      id: 'completionCondition',
      label: translate('Completion Condition'),
      getValue,
      setValue,
      debounce,
      description: 'Stop executing this task when this condition is met'
    });
  }

  /* eslint-disable prettier/prettier */
  /* eslint-disable import/no-extraneous-dependencies */
  /* eslint-disable import/order */

  function IsOutputElSync(props) {
    const {
      element
    } = props;
    const translate = bpmnJsPropertiesPanel.useService('translate');
    const commandStack = bpmnJsPropertiesPanel.useService('commandStack');
    const bpmnFactory = bpmnJsPropertiesPanel.useService('bpmnFactory');
    const getValue = () => {
      const {
        businessObject
      } = element;
      return businessObject.get('spiffworkflow:isOutputSynced') ? businessObject.get('spiffworkflow:isOutputSynced') : false;
    };
    const setValue = value => {
      if (value) {
        const valIn = getLoopProperty(element, 'inputDataItem');
        const item = typeof valIn !== 'undefined' && valIn !== '' ? bpmnFactory.create('bpmn:DataOutput', {
          id: valIn,
          name: valIn
        }) : undefined;
        if (item) {
          // If DataInput Item is found and set, add new DataOut with same value
          setLoopProperty(element, 'outputDataItem', item, commandStack);
        }
      } else {
        // Remove DataOutput value when isIoSync is disabled
        removeLoopProperty(element, 'outputDataItem', commandStack);
      }
      setIsIOValue(element, value, commandStack);
    };
    return propertiesPanel.CheckboxEntry({
      element,
      id: 'testBefore',
      label: translate('Output Element is Synchronized with Input Element'),
      getValue,
      setValue
    });
  }

  /* eslint-disable prettier/prettier */
  /* eslint-disable no-param-reassign */
  /* eslint-disable import/no-extraneous-dependencies */
  const LOW_PRIORITY$1 = 500;
  function MultiInstancePropertiesProvider(propertiesPanel) {
    this.getGroups = function getGroupsCallback(element) {
      return function pushGroup(groups) {
        if (ModelUtil.is(element, 'bpmn:Task') || ModelUtil.is(element, 'bpmn:CallActivity') || ModelUtil.is(element, 'bpmn:SubProcess')) {
          const group = groups.filter(g => g.id === 'multiInstance');
          if (group.length === 1) updateMultiInstanceGroup(element, group[0]);
        }
        return groups;
      };
    };
    propertiesPanel.registerProvider(LOW_PRIORITY$1, this);
  }
  MultiInstancePropertiesProvider.$inject = ['propertiesPanel'];
  function updateMultiInstanceGroup(element, group) {
    group.entries = MultiInstanceProps({
      element
    });
    group.shouldOpen = true;
  }
  function MultiInstanceProps(props) {
    const {
      element
    } = props;
    const {
      businessObject
    } = element;
    return [{
      id: 'loopCardinality',
      component: LoopCardinality,
      isEdited: propertiesPanel.isTextFieldEntryEdited
    }, {
      id: 'loopDataInputRef',
      component: InputCollection,
      isEdited: propertiesPanel.isTextFieldEntryEdited
    }, {
      id: 'dataInputItem',
      component: InputItem,
      isEdited: propertiesPanel.isTextFieldEntryEdited
    }, {
      id: 'isOutputElSynchronized',
      component: IsOutputElSync,
      isEdited: propertiesPanel.isCheckboxEntryEdited
    }, {
      id: 'loopDataOutputRef',
      component: OutputCollection,
      isEdited: propertiesPanel.isTextFieldEntryEdited
    }, !businessObject.get('spiffworkflow:isOutputSynced') ? {
      id: 'dataOutputItem',
      component: OutputItem,
      isEdited: propertiesPanel.isTextFieldEntryEdited
    } : {}, {
      id: 'completionCondition',
      component: CompletionCondition,
      isEdited: propertiesPanel.isTextFieldEntryEdited
    }];
  }

  function CallActivityInterceptor(eventBus, bpmnUpdater, overlays) {
    let OVERLAY_ID;
    eventBus.on('selection.changed', function (event) {
      var newSelection = event.newSelection;
      const element = newSelection.length > 0 ? newSelection[0] : null;
      OVERLAY_ID ? overlays.remove(OVERLAY_ID) : null;
      if (element && ModelUtil.is(element.businessObject, 'bpmn:CallActivity') && newSelection.length === 1) {
        var ARROW_DOWN_SVG = '<svg width="20" height="20" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"> <g id="SVGRepo_bgCarrier" stroke-width="0"> <rect x="0" y="0" width="24.00" height="24.00" rx="0" fill="#2196f3" strokewidth="0"/> </g> <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.048"/> <g id="SVGRepo_iconCarrier"> <path d="M7 17L17 7M17 7H8M17 7V16" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/> </g> </svg>';
        var button = domify('<button class="bjs-drilldown">' + ARROW_DOWN_SVG + '</button>');
        button.addEventListener('click', function () {
          const processId = getCalledElementValue(element);
          if (!processId || processId === '') {
            alert('Please select a process model first');
            return;
          }
          eventBus.fire('spiff.callactivity.edit', {
            element,
            processId
          });
        });
        OVERLAY_ID = overlays.add(element.id, 'drilldown', {
          position: {
            bottom: -10,
            right: -8
          },
          html: button
        });
      }
    });
  }
  function domify(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
  }
  function getCalledElementValue(element) {
    const {
      calledElement
    } = element.businessObject;
    if (calledElement) {
      return calledElement;
    }
    return '';
  }
  CallActivityInterceptor.$inject = ['eventBus', 'bpmnUpdater', 'overlays'];

  const HIGH_PRIORITY = 90500;
  class MessageInterceptor extends CommandInterceptor {
    constructor(eventBus, bpmnFactory, commandStack, bpmnUpdater, moddle) {
      super(eventBus);
      this.postExecuted(['shape.delete'], HIGH_PRIORITY, function (event) {
        const {
          context
        } = event;
        const {
          shape,
          rootElement
        } = context;
        const {
          businessObject
        } = shape;
        if (isMessageElement(shape)) {
          let oldMessageRef = businessObject.eventDefinitions ? businessObject.eventDefinitions[0].messageRef : businessObject.messageRef;
          let definitions = getRoot(rootElement, moddle);
          if (!definitions.get('rootElements')) {
            definitions.set('rootElements', []);
          }
          if (oldMessageRef) {
            // Remove previous message in case it's not used anymore
            const isOldMessageUsed = isMessageRefUsed(definitions, oldMessageRef.id);
            if (!isOldMessageUsed) {
              const rootElements = definitions.get('rootElements');
              const oldMessageIndex = rootElements.findIndex(element => element.$type === 'bpmn:Message' && element.id === oldMessageRef.id);
              if (oldMessageIndex !== -1) {
                rootElements.splice(oldMessageIndex, 1);
                definitions.rootElements = rootElements;
              }
            }

            // Automatic deletion of previous message correlation properties
            syncCorrelationProperties(shape, definitions, moddle);
          }

          // Update Correlation key if Process has collaboration
          try {
            setParentCorrelationKeys(definitions, bpmnFactory, shape, moddle);
          } catch (error) {
            console.error('Error Caught while synchronizing Correlation key', error);
          }
        }
      });
    }
  }
  MessageInterceptor.$inject = ['eventBus', 'bpmnFactory', 'commandStack', 'bpmnUpdater', 'moddle'];

  const LOW_PRIORITY = 500;
  function CustomContextPadProvider(contextPad, eventBus, commandStack, moddle) {
    contextPad.registerProvider(LOW_PRIORITY, this);
    this.getContextPadEntries = function (element) {
      return function (entries) {
        if (ModelUtil.is(element, 'bpmn:ScriptTask')) {
          entries['trigger-script'] = {
            group: 'connect',
            className: 'bpmn-icon-script',
            title: 'Open Script Editor',
            action: {
              click: function (event, element) {
                triggerScript(element, 'bpmn:script', eventBus, commandStack, moddle);
              }
            }
          };
        } else if (hasPreAndPostScript(element)) {
          const PreScript = getScriptString(element, 'spiffworkflow:PreScript');
          if (PreScript && PreScript !== '') {
            entries['trigger-preScript'] = {
              group: 'connect',
              className: 'bpmn-icon-pre-script-trigger',
              title: 'Open PreScript Editor',
              action: {
                click: function (event, element) {
                  triggerScript(element, 'spiffworkflow:PreScript', eventBus, commandStack, moddle);
                }
              }
            };
          }
          const PostScript = getScriptString(element, 'spiffworkflow:PostScript');
          if (PostScript && PostScript !== '') {
            entries['trigger-postScript'] = {
              group: 'connect',
              className: 'bpmn-icon-post-script-trigger',
              title: 'Open PostScript Editor',
              action: {
                click: function (event, element) {
                  triggerScript(element, 'spiffworkflow:PostScript', eventBus, commandStack, moddle);
                }
              }
            };
          }
        }
        return entries;
      };
    };
  }
  CustomContextPadProvider.$inject = ['contextPad', 'eventBus', 'commandStack', 'moddle'];
  function hasPreAndPostScript(element) {
    return ModelUtil.is(element, 'bpmn:Task') || ModelUtil.is(element, 'bpmn:UserTask') || ModelUtil.is(element, 'bpmn:ServiceTask') || ModelUtil.is(element, 'bpmn:SendTask') || ModelUtil.is(element, 'bpmn:ReceiveTask') || ModelUtil.is(element, 'bpmn:ManualTask') || ModelUtil.is(element, 'bpmn:CallActivity') || ModelUtil.is(element, 'bpmn:BusinessRuleTask') || ModelUtil.is(element, 'bpmn:SubProcess');
  }
  function triggerScript(element, type, eventBus, commandStack, moddle) {
    const script = getScriptString(element, type);
    eventBus.fire('spiff.script.edit', {
      element,
      scriptType: type,
      script,
      eventBus
    });
    eventBus.once('spiff.script.update', event => {
      updateScript(commandStack, moddle, element, event.scriptType, event.script);
    });
  }

  var index = {
    __depends__: [RulesModule],
    __init__: ['dataObjectInterceptor', 'dataObjectRules', 'dataObjectPropertiesProvider', 'dataObjectLabelEditingProvider', 'dataStoreInterceptor', 'dataStorePropertiesProvider', 'conditionsPropertiesProvider', 'extensionsPropertiesProvider', 'customContextPadProvider', 'messagesPropertiesProvider', 'messageInterceptor', 'signalPropertiesProvider', 'errorPropertiesProvider', 'escalationPropertiesProvider', 'callActivityPropertiesProvider', 'ioPalette', 'ioRules', 'ioInterceptor', 'dataObjectRenderer', 'multiInstancePropertiesProvider', 'standardLoopPropertiesProvider', 'IoPropertiesProvider', 'callActivityInterceptor'],
    dataObjectInterceptor: ['type', DataObjectInterceptor],
    dataObjectRules: ['type', DataObjectRules],
    dataObjectRenderer: ['type', DataObjectRenderer],
    dataObjectPropertiesProvider: ['type', DataObjectPropertiesProvider],
    dataObjectLabelEditingProvider: ['type', DataObjectLabelEditingProvider],
    dataStoreInterceptor: ['type', DataStoreInterceptor],
    dataStorePropertiesProvider: ['type', DataStorePropertiesProvider],
    conditionsPropertiesProvider: ['type', ConditionsPropertiesProvider],
    extensionsPropertiesProvider: ['type', ExtensionsPropertiesProvider],
    customContextPadProvider: ['type', CustomContextPadProvider],
    signalPropertiesProvider: ['type', SignalPropertiesProvider],
    errorPropertiesProvider: ['type', ErrorPropertiesProvider],
    escalationPropertiesProvider: ['type', EscalationPropertiesProvider],
    messagesPropertiesProvider: ['type', MessagesPropertiesProvider],
    messageInterceptor: ['type', MessageInterceptor],
    callActivityPropertiesProvider: ['type', CallActivityPropertiesProvider],
    ioPalette: ['type', IoPalette],
    ioRules: ['type', IoRules],
    ioInterceptor: ['type', IoInterceptor],
    multiInstancePropertiesProvider: ['type', MultiInstancePropertiesProvider],
    standardLoopPropertiesProvider: ['type', StandardLoopPropertiesProvider],
    IoPropertiesProvider: ['type', IoPropertiesProvider],
    callActivityInterceptor: ['type', CallActivityInterceptor]
  };

  var name = "SpiffWorkflow";
  var uri = "http://spiffworkflow.org/bpmn/schema/1.0/core";
  var prefix = "spiffworkflow";
  var associations = [
  ];
  var xml = {
  	tagAlias: "lowerCase"
  };
  var types = [
  	{
  		name: "PreScript",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "value",
  				isBody: true,
  				type: "String"
  			}
  		]
  	},
  	{
  		name: "PostScript",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "value",
  				isBody: true,
  				type: "String"
  			}
  		]
  	},
  	{
  		name: "MessagePayload",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "value",
  				isBody: true,
  				type: "String"
  			}
  		]
  	},
  	{
  		name: "MessageVariable",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "value",
  				isBody: true,
  				type: "String"
  			}
  		]
  	},
  	{
  		name: "ProcessVariableCorrelation",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "propertyId",
  				type: "String",
  				xml: {
  					serialize: "property"
  				}
  			},
  			{
  				name: "expression",
  				type: "String",
  				xml: {
  					serialize: "property"
  				}
  			}
  		]
  	},
  	{
  		name: "CalledDecisionId",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "value",
  				isBody: true,
  				type: "String"
  			}
  		]
  	},
  	{
  		name: "InstructionsForEndUser",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "value",
  				isBody: true,
  				type: "String"
  			}
  		]
  	},
  	{
  		name: "AllowGuest",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "value",
  				isBody: true,
  				type: "Boolean"
  			}
  		]
  	},
  	{
  		name: "GuestConfirmation",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "value",
  				isBody: true,
  				type: "String"
  			}
  		]
  	},
  	{
  		name: "Category",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "value",
  				isBody: true,
  				type: "String"
  			}
  		]
  	},
  	{
  		name: "SignalButtonLabel",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "value",
  				isBody: true,
  				type: "String"
  			}
  		]
  	},
  	{
  		name: "Properties",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "properties",
  				type: "Property",
  				isMany: true
  			}
  		]
  	},
  	{
  		name: "Property",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "name",
  				isAttr: true,
  				type: "String"
  			},
  			{
  				name: "value",
  				isAttr: true,
  				type: "String"
  			}
  		]
  	},
  	{
  		name: "ServiceTaskOperator",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "id",
  				isAttr: true,
  				type: "String"
  			},
  			{
  				name: "resultVariable",
  				isAttr: true,
  				type: "String"
  			},
  			{
  				name: "parameterList",
  				type: "Parameters"
  			}
  		]
  	},
  	{
  		name: "Parameters",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "parameters",
  				type: "Parameter",
  				isMany: true
  			}
  		]
  	},
  	{
  		name: "Parameter",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "id",
  				isAttr: true,
  				type: "String"
  			},
  			{
  				name: "type",
  				isAttr: true,
  				type: "String"
  			},
  			{
  				name: "value",
  				isAttr: true,
  				type: "String"
  			}
  		]
  	},
  	{
  		name: "UnitTests",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "unitTests",
  				type: "UnitTest",
  				isMany: true
  			}
  		]
  	},
  	{
  		name: "UnitTest",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "id",
  				isAttr: true,
  				type: "String"
  			},
  			{
  				name: "inputJson",
  				type: "InputJson"
  			},
  			{
  				name: "expectedOutputJson",
  				type: "ExpectedOutputJson"
  			}
  		]
  	},
  	{
  		name: "InputJson",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "value",
  				isBody: true,
  				type: "string"
  			}
  		]
  	},
  	{
  		name: "ExpectedOutputJson",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "value",
  				isBody: true,
  				type: "string"
  			}
  		]
  	},
  	{
  		name: "PayloadExpression",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "value",
  				isBody: true,
  				type: "String"
  			}
  		]
  	},
  	{
  		name: "VariableName",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "value",
  				isBody: true,
  				type: "String"
  			}
  		]
  	},
  	{
  		name: "ScriptsOnInstances",
  		"extends": [
  			"bpmn:MultiInstanceLoopCharacteristics",
  			"bpmn:StandardLoopCharacteristics"
  		],
  		properties: [
  			{
  				name: "scriptsOnInstances",
  				isAttr: true,
  				type: "Boolean"
  			}
  		]
  	},
  	{
  		name: "TaskMetadataValues",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "values",
  				type: "TaskMetadataValue",
  				isMany: true
  			}
  		]
  	},
  	{
  		name: "TaskMetadataValue",
  		superClass: [
  			"Element"
  		],
  		properties: [
  			{
  				name: "name",
  				isAttr: true,
  				type: "String"
  			},
  			{
  				name: "value",
  				isAttr: true,
  				type: "String"
  			}
  		]
  	}
  ];
  var spiffworkflow = {
  	name: name,
  	uri: uri,
  	prefix: prefix,
  	associations: associations,
  	xml: xml,
  	types: types
  };

  exports.CallActivityPropertiesProvider = CallActivityPropertiesProvider;
  exports.ConditionsPropertiesProvider = ConditionsPropertiesProvider;
  exports.DataObjectPropertiesProvider = DataObjectPropertiesProvider;
  exports.DataStorePropertiesProvider = DataStorePropertiesProvider;
  exports.ErrorPropertiesProvider = ErrorPropertiesProvider;
  exports.EscalationPropertiesProvider = EscalationPropertiesProvider;
  exports.ExtensionsPropertiesProvider = ExtensionsPropertiesProvider;
  exports.IoPropertiesProvider = IoPropertiesProvider;
  exports.MessagesPropertiesProvider = MessagesPropertiesProvider;
  exports.MultiInstancePropertiesProvider = MultiInstancePropertiesProvider;
  exports.SignalPropertiesProvider = SignalPropertiesProvider;
  exports.StandardLoopPropertiesProvider = StandardLoopPropertiesProvider;
  exports.default = index;
  exports.spiffModdleExtension = spiffworkflow;
  exports.spiffworkflow = index;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=bpmn-js-spiffworkflow.umd.js.map
