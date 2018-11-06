// Generated from Reo.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4');
const utils = require('./Utils');
var parseNumberArray = utils.parseNumberArray, generateShapeDefinition = utils.generateShapeDefinition;
module.exports.ReoListener = ReoListener;


// This class defines a complete listener for a parse tree produced by ReoParser.
function ReoListener(sourceLoader) {
  antlr4.tree.ParseTreeListener.call(this);
  this.sourceLoader = sourceLoader;
  this.componentDefinitions = {};
  this.imports = new Set();
  this.sections = {};
  this.componentNames = {};
  this.components = {};
  this.ports = {};
  this.code = "";
  return this
}

ReoListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
ReoListener.prototype.constructor = ReoListener;

ReoListener.prototype.includeSource = async function (filename) {
  this.extractMetadata(await this.sourceLoader(filename))
};

ReoListener.prototype.extractMetadata = function(str) {
  let m2 = /^\s*\/\*!(.*?)!\*\//g.exec(str.replace(/[\n\r]/g, ''));
  if (m2) {
    let mstr = m2[1].trim();
    // convert back to json
    // convert block type to json valid string, replace : with ` because regex isn't powerful enough for this
    mstr = mstr.replace(/{(({(({(({.*?}|.)*?)}|.)*?)}|.)*?)}/g, (m, a, s) => JSON.stringify(a.replace(/:/g, '`')));
    // stringify keys, replace ` back for :
    let fixedstr = "{" + mstr.replace(/([a-z][^\s,()]*|[a-z]+\(.*?\)):/g, '"$1":').replace(/`/g, ':') + "}";

    let mdata = JSON.parse(fixedstr);
    for (let metakey in mdata) {
      let m3 = /^(\w+)(\((.*?)\))?$/g.exec(metakey);
      if (!m3) throw 'failed to parse meta key';
      this.processMetadata({key: m3[1], keyarg: m3[3], value: mdata[metakey]})
    }
  }
};

ReoListener.prototype.processMetadata = function(s, env) {
  switch (s.key) {
    case 'pos':
      // let wpname = this.genNodeName(s.keyarg, env);
      let wpname = s.keyarg;
      let coord = parseNumberArray(s.value, env);
      this.ports[wpname] = coord;
      // this.waypoints[wpname] = coord;
      break;
    // case 'bound':
    //   this.bound = [parseNumberArray(s.value[0], env), parseNumberArray(s.value[1], env)];
    //   break;
    // case 'spacing':
    //   this.drawNodeSpacing = s.value;
    //   break;
    // case 'label':
    //   this.labels[this.genNodeName(s.keyarg, env)] = s.value;
    //   break;
    // default:
    //   await this.network.processMeta(s, env);
    case 'shape':
      let m = /^([a-zA-Z]\w+)\((.*?)\)/g.exec(s.keyarg);
      let cname = m[1];
      let args = m[2].replace(';', ',').split(',').map(x => x.trim()).filter(x => x.length > 0);
      this.componentDefinitions[cname] = generateShapeDefinition(cname, args, s.value.trim());
      break;
    case 'include':
      this.includeSource(s.value);
      break;
    default:
      throw "unknown metakey " + s.key
  }
};

ReoListener.prototype.draw = function (component) {
  let output = '';
  let definition = this.componentDefinitions[component.name];
  if (definition.type === 'atom') {
    if (!definition.isDefined) {
      output += definition.define();
      definition.isDefined = true
    }
    output += definition.draw(component.ports, this.ports)
  } else {
    output += `createComponent(${this.ports[component.name].join(',')},"${component.name}");\n`;
    for (let c of definition.components)
      output += this.draw(c)
  }
  return output
};

ReoListener.prototype.generateCode = function () {
  this.ports.main = ['25,25,container.clientWidth-25,container.clientHeight-25'];
  if (this.code === '')
    this.code = `main = ${this.draw(this.componentDefinitions.main)}`;
  return this.code
};

// Enter a parse tree produced by ReoParser#file. TODO
ReoListener.prototype.enterFile = function (ctx) {
  // console.log('enterFile')
};

// Exit a parse tree produced by ReoParser#file. TODO
ReoListener.prototype.exitFile = function (ctx) {
  // console.log('exitFile')
};


// Enter a parse tree produced by ReoParser#secn. TODO
ReoListener.prototype.enterSecn = function (ctx) {
  // console.log('enterSecn')
};

// Exit a parse tree produced by ReoParser#secn.
ReoListener.prototype.exitSecn = function (ctx) {
  // console.log('exitSecn')
  // this.sections[ctx] = ctx.name().getText()
};


// Enter a parse tree produced by ReoParser#imps. TODO
ReoListener.prototype.enterImps = function (ctx) {
  console.log('enterImps')
};

// Exit a parse tree produced by ReoParser#imps.
ReoListener.prototype.exitImps = function (ctx) {
  console.log('exitImps')
};


// Enter a parse tree produced by ReoParser#defn.
ReoListener.prototype.enterDefn = function (ctx) {
  console.log('enterDefn');
  let name = ctx.ID().getText();
  this.componentNames[ctx.component()] = name;
  this.componentDefinitions[ctx.ID().getText()] = {name: name}
};

// Exit a parse tree produced by ReoParser#defn. TODO
ReoListener.prototype.exitDefn = function (ctx) {
  console.log('exitDefn')
};


// Enter a parse tree produced by ReoParser#component_variable. TODO
ReoListener.prototype.enterComponent_variable = function (ctx) {
  console.log('enterComponent_variable');
};

// Exit a parse tree produced by ReoParser#component_variable. TODO
ReoListener.prototype.exitComponent_variable = function (ctx) {
  console.log('exitComponent_variable')
};


// Enter a parse tree produced by ReoParser#component_atomic. TODO
ReoListener.prototype.enterComponent_atomic = function (ctx) {
  console.log('enterComponent_atomic')
};

// Exit a parse tree produced by ReoParser#component_atomic. TODO
ReoListener.prototype.exitComponent_atomic = function (ctx) {
  console.log('exitComponent_atomic')
};


// Enter a parse tree produced by ReoParser#component_composite.
ReoListener.prototype.enterComponent_composite = function (ctx) {
  console.log('enterComponent_composite');
  console.log('sign:', ctx.sign().getText());  // TODO
  console.log('multiset:', ctx.multiset().getText());
  // this.components[ctx] = ctx.sign();
  this.componentNames[ctx.multiset()] = this.componentNames[ctx];
};

// Exit a parse tree produced by ReoParser#component_composite.
ReoListener.prototype.exitComponent_composite = function (ctx) {
  console.log('exitComponent_composite')
};


// Enter a parse tree produced by ReoParser#atom.
ReoListener.prototype.enterAtom = function (ctx) {
  console.log('enterAtom')
};

// Exit a parse tree produced by ReoParser#atom.
ReoListener.prototype.exitAtom = function (ctx) {
  console.log('exitAtom')
};


// Enter a parse tree produced by ReoParser#ref_java.
ReoListener.prototype.enterRef_java = function (ctx) {
};

// Exit a parse tree produced by ReoParser#ref_java.
ReoListener.prototype.exitRef_java = function (ctx) {
};


// Enter a parse tree produced by ReoParser#ref_promela.
ReoListener.prototype.enterRef_promela = function (ctx) {
};

// Exit a parse tree produced by ReoParser#ref_promela.
ReoListener.prototype.exitRef_promela = function (ctx) {
};


// Enter a parse tree produced by ReoParser#ref_maude.
ReoListener.prototype.enterRef_maude = function (ctx) {
};

// Exit a parse tree produced by ReoParser#ref_maude.
ReoListener.prototype.exitRef_maude = function (ctx) {
};


// Enter a parse tree produced by ReoParser#ref_c.
ReoListener.prototype.enterRef_c = function (ctx) {
};

// Exit a parse tree produced by ReoParser#ref_c.
ReoListener.prototype.exitRef_c = function (ctx) {
};


// Enter a parse tree produced by ReoParser#multiset_constraint.
ReoListener.prototype.enterMultiset_constraint = function (ctx) {
  console.log('enterMultiset_constraint');
  // console.log('instance:', ctx.instance().getText());
  console.log(ctx.getText());
  this.componentNames[ctx.instance()] = this.componentNames[ctx];
};

// Exit a parse tree produced by ReoParser#multiset_constraint.
ReoListener.prototype.exitMultiset_constraint = function (ctx) {
  let metadata_token = ctx.META_COMM();
  if (metadata_token)
    this.extractMetadata(metadata_token.getText());
  console.log('exitMultiset_constraint')
};


// Enter a parse tree produced by ReoParser#multiset_setbuilder.
ReoListener.prototype.enterMultiset_setbuilder = function (ctx) {
  console.log('enterMultiset_setbuilder');
  console.log(ctx.getText());
  for (let multiset of ctx.multiset())
    this.componentNames[multiset] = this.componentNames[ctx];
  this.componentDefinitions[this.componentNames[ctx]].components = []
  // console.log('name:', this.componentNames[ctx]);
  // console.log('multiset:', ctx.multiset()[0].getText());
  // console.log('multiset:', ctx.multiset()[1].getText());
};

// Exit a parse tree produced by ReoParser#multiset_setbuilder.
ReoListener.prototype.exitMultiset_setbuilder = function (ctx) {
  console.log('exitMultiset_setbuilder')
};


// Enter a parse tree produced by ReoParser#multiset_iteration. TODO
ReoListener.prototype.enterMultiset_iteration = function (ctx) {
  console.log('enterMultiset_iteration')
};

// Exit a parse tree produced by ReoParser#multiset_iteration. TODO
ReoListener.prototype.exitMultiset_iteration = function (ctx) {
};


// Enter a parse tree produced by ReoParser#multiset_condition.
ReoListener.prototype.enterMultiset_condition = function (ctx) {
};

// Exit a parse tree produced by ReoParser#multiset_condition.
ReoListener.prototype.exitMultiset_condition = function (ctx) {
};


// Enter a parse tree produced by ReoParser#instance_product.
ReoListener.prototype.enterInstance_product = function (ctx) {
};

// Exit a parse tree produced by ReoParser#instance_product.
ReoListener.prototype.exitInstance_product = function (ctx) {
};


// Enter a parse tree produced by ReoParser#instance_atomic.
ReoListener.prototype.enterInstance_atomic = function (ctx) {
  console.log('enterInstance_atomic');
  this.componentNames[ctx.ports()] = this.componentNames[ctx];
  this.componentDefinitions[this.componentNames[ctx]].components.push({name: ctx.component().getText()})
};

// Exit a parse tree produced by ReoParser#instance_atomic.
ReoListener.prototype.exitInstance_atomic = function (ctx) {
};


// Enter a parse tree produced by ReoParser#instance_sum.
ReoListener.prototype.enterInstance_sum = function (ctx) {
};

// Exit a parse tree produced by ReoParser#instance_sum.
ReoListener.prototype.exitInstance_sum = function (ctx) {
};


// Enter a parse tree produced by ReoParser#instance_semicolon.
ReoListener.prototype.enterInstance_semicolon = function (ctx) {
};

// Exit a parse tree produced by ReoParser#instance_semicolon.
ReoListener.prototype.exitInstance_semicolon = function (ctx) {
};


// Enter a parse tree produced by ReoParser#formula_negation.
ReoListener.prototype.enterFormula_negation = function (ctx) {
};

// Exit a parse tree produced by ReoParser#formula_negation.
ReoListener.prototype.exitFormula_negation = function (ctx) {
};


// Enter a parse tree produced by ReoParser#formula_false.
ReoListener.prototype.enterFormula_false = function (ctx) {
};

// Exit a parse tree produced by ReoParser#formula_false.
ReoListener.prototype.exitFormula_false = function (ctx) {
};


// Enter a parse tree produced by ReoParser#formula_true.
ReoListener.prototype.enterFormula_true = function (ctx) {
};

// Exit a parse tree produced by ReoParser#formula_true.
ReoListener.prototype.exitFormula_true = function (ctx) {
};


// Enter a parse tree produced by ReoParser#formula_structdefn.
ReoListener.prototype.enterFormula_structdefn = function (ctx) {
};

// Exit a parse tree produced by ReoParser#formula_structdefn.
ReoListener.prototype.exitFormula_structdefn = function (ctx) {
};


// Enter a parse tree produced by ReoParser#formula_variable.
ReoListener.prototype.enterFormula_variable = function (ctx) {
};

// Exit a parse tree produced by ReoParser#formula_variable.
ReoListener.prototype.exitFormula_variable = function (ctx) {
};


// Enter a parse tree produced by ReoParser#formula_conjunction.
ReoListener.prototype.enterFormula_conjunction = function (ctx) {
};

// Exit a parse tree produced by ReoParser#formula_conjunction.
ReoListener.prototype.exitFormula_conjunction = function (ctx) {
};


// Enter a parse tree produced by ReoParser#formula_binaryrelation.
ReoListener.prototype.enterFormula_binaryrelation = function (ctx) {
};

// Exit a parse tree produced by ReoParser#formula_binaryrelation.
ReoListener.prototype.exitFormula_binaryrelation = function (ctx) {
};


// Enter a parse tree produced by ReoParser#formula_universal.
ReoListener.prototype.enterFormula_universal = function (ctx) {
};

// Exit a parse tree produced by ReoParser#formula_universal.
ReoListener.prototype.exitFormula_universal = function (ctx) {
};


// Enter a parse tree produced by ReoParser#formula_componentdefn.
ReoListener.prototype.enterFormula_componentdefn = function (ctx) {
};

// Exit a parse tree produced by ReoParser#formula_componentdefn.
ReoListener.prototype.exitFormula_componentdefn = function (ctx) {
};


// Enter a parse tree produced by ReoParser#formula_membership.
ReoListener.prototype.enterFormula_membership = function (ctx) {
};

// Exit a parse tree produced by ReoParser#formula_membership.
ReoListener.prototype.exitFormula_membership = function (ctx) {
};


// Enter a parse tree produced by ReoParser#formula_existential.
ReoListener.prototype.enterFormula_existential = function (ctx) {
};

// Exit a parse tree produced by ReoParser#formula_existential.
ReoListener.prototype.exitFormula_existential = function (ctx) {
};


// Enter a parse tree produced by ReoParser#formula_brackets.
ReoListener.prototype.enterFormula_brackets = function (ctx) {
};

// Exit a parse tree produced by ReoParser#formula_brackets.
ReoListener.prototype.exitFormula_brackets = function (ctx) {
};


// Enter a parse tree produced by ReoParser#formula_implication.
ReoListener.prototype.enterFormula_implication = function (ctx) {
};

// Exit a parse tree produced by ReoParser#formula_implication.
ReoListener.prototype.exitFormula_implication = function (ctx) {
};


// Enter a parse tree produced by ReoParser#formula_disjunction.
ReoListener.prototype.enterFormula_disjunction = function (ctx) {
};

// Exit a parse tree produced by ReoParser#formula_disjunction.
ReoListener.prototype.exitFormula_disjunction = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_brackets.
ReoListener.prototype.enterTerm_brackets = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_brackets.
ReoListener.prototype.exitTerm_brackets = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_instance.
ReoListener.prototype.enterTerm_instance = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_instance.
ReoListener.prototype.exitTerm_instance = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_unarymin.
ReoListener.prototype.enterTerm_unarymin = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_unarymin.
ReoListener.prototype.exitTerm_unarymin = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_boolean.
ReoListener.prototype.enterTerm_boolean = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_boolean.
ReoListener.prototype.exitTerm_boolean = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_exponent.
ReoListener.prototype.enterTerm_exponent = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_exponent.
ReoListener.prototype.exitTerm_exponent = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_function.
ReoListener.prototype.enterTerm_function = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_function.
ReoListener.prototype.exitTerm_function = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_range.
ReoListener.prototype.enterTerm_range = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_range.
ReoListener.prototype.exitTerm_range = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_decimal.
ReoListener.prototype.enterTerm_decimal = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_decimal.
ReoListener.prototype.exitTerm_decimal = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_variable.
ReoListener.prototype.enterTerm_variable = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_variable.
ReoListener.prototype.exitTerm_variable = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_componentdefn.
ReoListener.prototype.enterTerm_componentdefn = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_componentdefn.
ReoListener.prototype.exitTerm_componentdefn = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_application.
ReoListener.prototype.enterTerm_application = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_application.
ReoListener.prototype.exitTerm_application = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_natural.
ReoListener.prototype.enterTerm_natural = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_natural.
ReoListener.prototype.exitTerm_natural = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_list.
ReoListener.prototype.enterTerm_list = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_list.
ReoListener.prototype.exitTerm_list = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_operation.
ReoListener.prototype.enterTerm_operation = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_operation.
ReoListener.prototype.exitTerm_operation = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_string.
ReoListener.prototype.enterTerm_string = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_string.
ReoListener.prototype.exitTerm_string = function (ctx) {
};


// Enter a parse tree produced by ReoParser#term_tuple.
ReoListener.prototype.enterTerm_tuple = function (ctx) {
};

// Exit a parse tree produced by ReoParser#term_tuple.
ReoListener.prototype.exitTerm_tuple = function (ctx) {
};


// Enter a parse tree produced by ReoParser#func.
ReoListener.prototype.enterFunc = function (ctx) {
};

// Exit a parse tree produced by ReoParser#func.
ReoListener.prototype.exitFunc = function (ctx) {
};


// Enter a parse tree produced by ReoParser#tuple.
ReoListener.prototype.enterTuple = function (ctx) {
};

// Exit a parse tree produced by ReoParser#tuple.
ReoListener.prototype.exitTuple = function (ctx) {
};


// Enter a parse tree produced by ReoParser#list.
ReoListener.prototype.enterList = function (ctx) {
};

// Exit a parse tree produced by ReoParser#list.
ReoListener.prototype.exitList = function (ctx) {
};


// Enter a parse tree produced by ReoParser#sign.
ReoListener.prototype.enterSign = function (ctx) {
};

// Exit a parse tree produced by ReoParser#sign.
ReoListener.prototype.exitSign = function (ctx) {
};


// Enter a parse tree produced by ReoParser#params.
ReoListener.prototype.enterParams = function (ctx) {
};

// Exit a parse tree produced by ReoParser#params.
ReoListener.prototype.exitParams = function (ctx) {
};


// Enter a parse tree produced by ReoParser#param.
ReoListener.prototype.enterParam = function (ctx) {
};

// Exit a parse tree produced by ReoParser#param.
ReoListener.prototype.exitParam = function (ctx) {
};


// Enter a parse tree produced by ReoParser#nodes.
ReoListener.prototype.enterNodes = function (ctx) {
};

// Exit a parse tree produced by ReoParser#nodes.
ReoListener.prototype.exitNodes = function (ctx) {
};


// Enter a parse tree produced by ReoParser#node.
ReoListener.prototype.enterNode = function (ctx) {
};

// Exit a parse tree produced by ReoParser#node.
ReoListener.prototype.exitNode = function (ctx) {
};


// Enter a parse tree produced by ReoParser#type.
ReoListener.prototype.enterType = function (ctx) {
};

// Exit a parse tree produced by ReoParser#type.
ReoListener.prototype.exitType = function (ctx) {
};


// Enter a parse tree produced by ReoParser#ports.
ReoListener.prototype.enterPorts = function (ctx) {
  console.log('enterPorts');
  let ports = [];
  for (let port of ctx.port()) {
    this.ports[port.getText()] = [];
    ports.push(port.getText());
  }

  let component = this.componentDefinitions[this.componentNames[ctx]].components;
  component[component.length - 1].ports = ports
};

// Exit a parse tree produced by ReoParser#ports.
ReoListener.prototype.exitPorts = function (ctx) {
};


// Enter a parse tree produced by ReoParser#port.
ReoListener.prototype.enterPort = function (ctx) {
  console.log('enterPort');
};

// Exit a parse tree produced by ReoParser#port.
ReoListener.prototype.exitPort = function (ctx) {
};


// Enter a parse tree produced by ReoParser#r_var.
ReoListener.prototype.enterR_var = function (ctx) {
  console.log('enterR_var');
  console.log(ctx.name().getText());
  console.log(ctx.term());
};

// Exit a parse tree produced by ReoParser#r_var.
ReoListener.prototype.exitR_var = function (ctx) {
  console.log('exitR_var');
};


// Enter a parse tree produced by ReoParser#name.
ReoListener.prototype.enterName = function (ctx) {
};

// Exit a parse tree produced by ReoParser#name.
ReoListener.prototype.exitName = function (ctx) {
};


// Enter a parse tree produced by ReoParser#wa.
ReoListener.prototype.enterWa = function (ctx) {
};

// Exit a parse tree produced by ReoParser#wa.
ReoListener.prototype.exitWa = function (ctx) {
};


// Enter a parse tree produced by ReoParser#wa_invariant.
ReoListener.prototype.enterWa_invariant = function (ctx) {
};

// Exit a parse tree produced by ReoParser#wa_invariant.
ReoListener.prototype.exitWa_invariant = function (ctx) {
};


// Enter a parse tree produced by ReoParser#wa_transition.
ReoListener.prototype.enterWa_transition = function (ctx) {
};

// Exit a parse tree produced by ReoParser#wa_transition.
ReoListener.prototype.exitWa_transition = function (ctx) {
};


// Enter a parse tree produced by ReoParser#wa_set.
ReoListener.prototype.enterWa_set = function (ctx) {
};

// Exit a parse tree produced by ReoParser#wa_set.
ReoListener.prototype.exitWa_set = function (ctx) {
};


// Enter a parse tree produced by ReoParser#wa_jc_brackets.
ReoListener.prototype.enterWa_jc_brackets = function (ctx) {
};

// Exit a parse tree produced by ReoParser#wa_jc_brackets.
ReoListener.prototype.exitWa_jc_brackets = function (ctx) {
};


// Enter a parse tree produced by ReoParser#wa_jc_geq.
ReoListener.prototype.enterWa_jc_geq = function (ctx) {
};

// Exit a parse tree produced by ReoParser#wa_jc_geq.
ReoListener.prototype.exitWa_jc_geq = function (ctx) {
};


// Enter a parse tree produced by ReoParser#wa_jc_leq.
ReoListener.prototype.enterWa_jc_leq = function (ctx) {
};

// Exit a parse tree produced by ReoParser#wa_jc_leq.
ReoListener.prototype.exitWa_jc_leq = function (ctx) {
};


// Enter a parse tree produced by ReoParser#wa_jc_eq.
ReoListener.prototype.enterWa_jc_eq = function (ctx) {
};

// Exit a parse tree produced by ReoParser#wa_jc_eq.
ReoListener.prototype.exitWa_jc_eq = function (ctx) {
};


// Enter a parse tree produced by ReoParser#wa_jc_and.
ReoListener.prototype.enterWa_jc_and = function (ctx) {
};

// Exit a parse tree produced by ReoParser#wa_jc_and.
ReoListener.prototype.exitWa_jc_and = function (ctx) {
};


// Enter a parse tree produced by ReoParser#wa_jc_false.
ReoListener.prototype.enterWa_jc_false = function (ctx) {
};

// Exit a parse tree produced by ReoParser#wa_jc_false.
ReoListener.prototype.exitWa_jc_false = function (ctx) {
};


// Enter a parse tree produced by ReoParser#wa_jc_true.
ReoListener.prototype.enterWa_jc_true = function (ctx) {
};

// Exit a parse tree produced by ReoParser#wa_jc_true.
ReoListener.prototype.exitWa_jc_true = function (ctx) {
};


// Enter a parse tree produced by ReoParser#wa_jc_or.
ReoListener.prototype.enterWa_jc_or = function (ctx) {
};

// Exit a parse tree produced by ReoParser#wa_jc_or.
ReoListener.prototype.exitWa_jc_or = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam.
ReoListener.prototype.enterCam = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam.
ReoListener.prototype.exitCam = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_tr.
ReoListener.prototype.enterCam_tr = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_tr.
ReoListener.prototype.exitCam_tr = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_sc.
ReoListener.prototype.enterCam_sc = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_sc.
ReoListener.prototype.exitCam_sc = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dc_universal.
ReoListener.prototype.enterCam_dc_universal = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dc_universal.
ReoListener.prototype.exitCam_dc_universal = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dc_ineq.
ReoListener.prototype.enterCam_dc_ineq = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dc_ineq.
ReoListener.prototype.exitCam_dc_ineq = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dc_neq.
ReoListener.prototype.enterCam_dc_neq = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dc_neq.
ReoListener.prototype.exitCam_dc_neq = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dc_exponent.
ReoListener.prototype.enterCam_dc_exponent = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dc_exponent.
ReoListener.prototype.exitCam_dc_exponent = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dc_multdivrem.
ReoListener.prototype.enterCam_dc_multdivrem = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dc_multdivrem.
ReoListener.prototype.exitCam_dc_multdivrem = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dc_term.
ReoListener.prototype.enterCam_dc_term = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dc_term.
ReoListener.prototype.exitCam_dc_term = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dc_existential.
ReoListener.prototype.enterCam_dc_existential = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dc_existential.
ReoListener.prototype.exitCam_dc_existential = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dc_addsub.
ReoListener.prototype.enterCam_dc_addsub = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dc_addsub.
ReoListener.prototype.exitCam_dc_addsub = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dc_and.
ReoListener.prototype.enterCam_dc_and = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dc_and.
ReoListener.prototype.exitCam_dc_and = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dc_or.
ReoListener.prototype.enterCam_dc_or = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dc_or.
ReoListener.prototype.exitCam_dc_or = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dt_brackets.
ReoListener.prototype.enterCam_dt_brackets = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dt_brackets.
ReoListener.prototype.exitCam_dt_brackets = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dt_function.
ReoListener.prototype.enterCam_dt_function = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dt_function.
ReoListener.prototype.exitCam_dt_function = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dt_next.
ReoListener.prototype.enterCam_dt_next = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dt_next.
ReoListener.prototype.exitCam_dt_next = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dt_unaryMin.
ReoListener.prototype.enterCam_dt_unaryMin = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dt_unaryMin.
ReoListener.prototype.exitCam_dt_unaryMin = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dt_not.
ReoListener.prototype.enterCam_dt_not = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dt_not.
ReoListener.prototype.exitCam_dt_not = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dt_data.
ReoListener.prototype.enterCam_dt_data = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dt_data.
ReoListener.prototype.exitCam_dt_data = function (ctx) {
};


// Enter a parse tree produced by ReoParser#cam_dt_variable.
ReoListener.prototype.enterCam_dt_variable = function (ctx) {
};

// Exit a parse tree produced by ReoParser#cam_dt_variable.
ReoListener.prototype.exitCam_dt_variable = function (ctx) {
};


// Enter a parse tree produced by ReoParser#sa.
ReoListener.prototype.enterSa = function (ctx) {
};

// Exit a parse tree produced by ReoParser#sa.
ReoListener.prototype.exitSa = function (ctx) {
};


// Enter a parse tree produced by ReoParser#sa_transition.
ReoListener.prototype.enterSa_transition = function (ctx) {
};

// Exit a parse tree produced by ReoParser#sa_transition.
ReoListener.prototype.exitSa_transition = function (ctx) {
};


// Enter a parse tree produced by ReoParser#sa_seepagefunction.
ReoListener.prototype.enterSa_seepagefunction = function (ctx) {
};

// Exit a parse tree produced by ReoParser#sa_seepagefunction.
ReoListener.prototype.exitSa_seepagefunction = function (ctx) {
};


// Enter a parse tree produced by ReoParser#sa_sc.
ReoListener.prototype.enterSa_sc = function (ctx) {
};

// Exit a parse tree produced by ReoParser#sa_sc.
ReoListener.prototype.exitSa_sc = function (ctx) {
};


// Enter a parse tree produced by ReoParser#sa_pbe_or.
ReoListener.prototype.enterSa_pbe_or = function (ctx) {
};

// Exit a parse tree produced by ReoParser#sa_pbe_or.
ReoListener.prototype.exitSa_pbe_or = function (ctx) {
};


// Enter a parse tree produced by ReoParser#sa_pbe_and.
ReoListener.prototype.enterSa_pbe_and = function (ctx) {
};

// Exit a parse tree produced by ReoParser#sa_pbe_and.
ReoListener.prototype.exitSa_pbe_and = function (ctx) {
};


// Enter a parse tree produced by ReoParser#sa_pbe_variable.
ReoListener.prototype.enterSa_pbe_variable = function (ctx) {
};

// Exit a parse tree produced by ReoParser#sa_pbe_variable.
ReoListener.prototype.exitSa_pbe_variable = function (ctx) {
};


// Enter a parse tree produced by ReoParser#sa_pbe_bool.
ReoListener.prototype.enterSa_pbe_bool = function (ctx) {
};

// Exit a parse tree produced by ReoParser#sa_pbe_bool.
ReoListener.prototype.exitSa_pbe_bool = function (ctx) {
};


// Enter a parse tree produced by ReoParser#sa_pbe_brackets.
ReoListener.prototype.enterSa_pbe_brackets = function (ctx) {
};

// Exit a parse tree produced by ReoParser#sa_pbe_brackets.
ReoListener.prototype.exitSa_pbe_brackets = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p.
ReoListener.prototype.enterP = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p.
ReoListener.prototype.exitP = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_brackets.
ReoListener.prototype.enterP_brackets = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_brackets.
ReoListener.prototype.exitP_brackets = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_relation.
ReoListener.prototype.enterP_relation = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_relation.
ReoListener.prototype.exitP_relation = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_exists.
ReoListener.prototype.enterP_exists = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_exists.
ReoListener.prototype.exitP_exists = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_true.
ReoListener.prototype.enterP_true = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_true.
ReoListener.prototype.exitP_true = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_not.
ReoListener.prototype.enterP_not = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_not.
ReoListener.prototype.exitP_not = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_forall.
ReoListener.prototype.enterP_forall = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_forall.
ReoListener.prototype.exitP_forall = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_false.
ReoListener.prototype.enterP_false = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_false.
ReoListener.prototype.exitP_false = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_or.
ReoListener.prototype.enterP_or = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_or.
ReoListener.prototype.exitP_or = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_neq.
ReoListener.prototype.enterP_neq = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_neq.
ReoListener.prototype.exitP_neq = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_and.
ReoListener.prototype.enterP_and = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_and.
ReoListener.prototype.exitP_and = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_eqs.
ReoListener.prototype.enterP_eqs = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_eqs.
ReoListener.prototype.exitP_eqs = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_args.
ReoListener.prototype.enterP_args = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_args.
ReoListener.prototype.exitP_args = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_variable.
ReoListener.prototype.enterP_variable = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_variable.
ReoListener.prototype.exitP_variable = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_null.
ReoListener.prototype.enterP_null = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_null.
ReoListener.prototype.exitP_null = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_natural.
ReoListener.prototype.enterP_natural = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_natural.
ReoListener.prototype.exitP_natural = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_boolean.
ReoListener.prototype.enterP_boolean = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_boolean.
ReoListener.prototype.exitP_boolean = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_string.
ReoListener.prototype.enterP_string = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_string.
ReoListener.prototype.exitP_string = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_decimal.
ReoListener.prototype.enterP_decimal = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_decimal.
ReoListener.prototype.exitP_decimal = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_function.
ReoListener.prototype.enterP_function = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_function.
ReoListener.prototype.exitP_function = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_var_port.
ReoListener.prototype.enterP_var_port = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_var_port.
ReoListener.prototype.exitP_var_port = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_var_curr.
ReoListener.prototype.enterP_var_curr = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_var_curr.
ReoListener.prototype.exitP_var_curr = function (ctx) {
};


// Enter a parse tree produced by ReoParser#p_var_next.
ReoListener.prototype.enterP_var_next = function (ctx) {
};

// Exit a parse tree produced by ReoParser#p_var_next.
ReoListener.prototype.exitP_var_next = function (ctx) {
};


// Enter a parse tree produced by ReoParser#pr.
ReoListener.prototype.enterPr = function (ctx) {
};

// Exit a parse tree produced by ReoParser#pr.
ReoListener.prototype.exitPr = function (ctx) {
};


// Enter a parse tree produced by ReoParser#pr_string.
ReoListener.prototype.enterPr_string = function (ctx) {
};

// Exit a parse tree produced by ReoParser#pr_string.
ReoListener.prototype.exitPr_string = function (ctx) {
};


// Enter a parse tree produced by ReoParser#pr_port.
ReoListener.prototype.enterPr_port = function (ctx) {
};

// Exit a parse tree produced by ReoParser#pr_port.
ReoListener.prototype.exitPr_port = function (ctx) {
};


// Enter a parse tree produced by ReoParser#pr_param.
ReoListener.prototype.enterPr_param = function (ctx) {
};

// Exit a parse tree produced by ReoParser#pr_param.
ReoListener.prototype.exitPr_param = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba.
ReoListener.prototype.enterRba = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba.
ReoListener.prototype.exitRba = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_initial.
ReoListener.prototype.enterRba_initial = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_initial.
ReoListener.prototype.exitRba_initial = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_rule.
ReoListener.prototype.enterRba_rule = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_rule.
ReoListener.prototype.exitRba_rule = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_syncFire.
ReoListener.prototype.enterRba_syncFire = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_syncFire.
ReoListener.prototype.exitRba_syncFire = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_syncBlock.
ReoListener.prototype.enterRba_syncBlock = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_syncBlock.
ReoListener.prototype.exitRba_syncBlock = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_equality.
ReoListener.prototype.enterRba_equality = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_equality.
ReoListener.prototype.exitRba_equality = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_true.
ReoListener.prototype.enterRba_true = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_true.
ReoListener.prototype.exitRba_true = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_def.
ReoListener.prototype.enterRba_def = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_def.
ReoListener.prototype.exitRba_def = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_false.
ReoListener.prototype.enterRba_false = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_false.
ReoListener.prototype.exitRba_false = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_inequality.
ReoListener.prototype.enterRba_inequality = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_inequality.
ReoListener.prototype.exitRba_inequality = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_negation.
ReoListener.prototype.enterRba_negation = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_negation.
ReoListener.prototype.exitRba_negation = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_conjunction.
ReoListener.prototype.enterRba_conjunction = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_conjunction.
ReoListener.prototype.exitRba_conjunction = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_relation.
ReoListener.prototype.enterRba_relation = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_relation.
ReoListener.prototype.exitRba_relation = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_string.
ReoListener.prototype.enterRba_string = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_string.
ReoListener.prototype.exitRba_string = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_memorycellIn.
ReoListener.prototype.enterRba_memorycellIn = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_memorycellIn.
ReoListener.prototype.exitRba_memorycellIn = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_operation.
ReoListener.prototype.enterRba_operation = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_operation.
ReoListener.prototype.exitRba_operation = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_null.
ReoListener.prototype.enterRba_null = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_null.
ReoListener.prototype.exitRba_null = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_unarymin.
ReoListener.prototype.enterRba_unarymin = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_unarymin.
ReoListener.prototype.exitRba_unarymin = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_memorycellOut.
ReoListener.prototype.enterRba_memorycellOut = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_memorycellOut.
ReoListener.prototype.exitRba_memorycellOut = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_bool.
ReoListener.prototype.enterRba_bool = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_bool.
ReoListener.prototype.exitRba_bool = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_nat.
ReoListener.prototype.enterRba_nat = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_nat.
ReoListener.prototype.exitRba_nat = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_function.
ReoListener.prototype.enterRba_function = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_function.
ReoListener.prototype.exitRba_function = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_distribution.
ReoListener.prototype.enterRba_distribution = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_distribution.
ReoListener.prototype.exitRba_distribution = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_parameter.
ReoListener.prototype.enterRba_parameter = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_parameter.
ReoListener.prototype.exitRba_parameter = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_decimal.
ReoListener.prototype.enterRba_decimal = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_decimal.
ReoListener.prototype.exitRba_decimal = function (ctx) {
};


// Enter a parse tree produced by ReoParser#rba_null_ctxt.
ReoListener.prototype.enterRba_null_ctxt = function (ctx) {
};

// Exit a parse tree produced by ReoParser#rba_null_ctxt.
ReoListener.prototype.exitRba_null_ctxt = function (ctx) {
};
