module.exports = {
  parseNumberArray: parseNumberArray,
  generateShapeDefinition: generateShapeDefinition
};

function solveExpression(expr, env) {
  let execstr = "";
  for (let sym in env)
    execstr += "let @@=@@;".format(sym, env[sym]);
  return eval(execstr + expr)
}

function parseNumber(expr, env) {
  return typeof expr === 'number' ? expr : solveExpression(expr, env)
}

function parseNumberArray(arr, env) {
  for (let i = 0; i < arr.length; ++i)
    arr[i] = parseNumber(arr[i], env)
  return arr
}

function generateShapeDefinition(name, args, shape) {
  function define() {
    let argList = '', argmap = {};
    for (let i = 0; i < args.length; ++i) {
      argList += 'pos' + (i + 1) + ',';
      argmap['pos' + args[i]] = i + 1;
    }
    let jsSrc = shape;
    for (let k in argmap)
      jsSrc = jsSrc.split('#' + k).join('pos' + argmap[k])
    return `function draw${name}(${argList}) {\n  ${jsSrc}\n}\n`
  }
  function draw(ports, nodes) {
    let argList = ports.map(port => '{x:' + nodes[port][0] + ',y:' + nodes[port][1] + ',name:"' + port + '"}').join(',');
    return `draw${name}(${argList});\n`
  }
  return {name: name, define: define, draw: draw, defined: false, type: 'atom'};
}

// function genComponentComposition() {
//   function ReoComponentComposition() {}
//   ReoComponentComposition.prototype = Object.create(ReoComponent.prototype);
//   ReoComponentComposition.prototype.name = name;
//   ReoComponentComposition.prototype.define = function (definestate) {
//     let output = '';
//     output += component.define(definestate);
//     let argList = '';
//     for (let i = 0; i < argsIn.length + argsOut.length; ++i) {
//       argList += 'arg' + (i + 3) + ', ';
//     }
//     output += 'function reodraw@@(@@) {\n'.format(this.typeName, argList);
//     output += `${this.typeName} = createComponent(25,25,container.clientWidth-25,container.clientHeight-25,"${this.typeName}");\n`;
//     output += `${this.typeName}.set({id: '${this.typeName}', evented: false});\n`;
//     output += "id = '0';\n";
//     output += 'reoimpldraw@@();\n'.format(this.typeName); // can draw a text alternatively
//     // for (let i = 0; i < argsIn.length; i++) {
//     //   output += '    \\path[draw,decoration={markings, mark=at position 0.0 with \\arrowstylerev},postaction=decorate] (@@) to #@@;\n'.format(component.genNodeName(argsIn[i], env), i + 3);
//     // }
//     // for (let i = 0; i < argsOut.length; i++) {
//     //   output += '    \\path[draw,decoration={markings, mark=at position 1.0 with \\arrowstyle},postaction=decorate] (@@) to #@@;\n'.format(component.genNodeName(argsOut[i], env), i + argsIn.length + 3);
//     // }
//     output += '}\n';
//     return output
//   };
//   ReoComponentComposition.prototype.draw = function () {
//     let argList = '', output = '';
//     for (let i = 0; i < argsIn.length + argsOut.length; i++) {
//       argList += this.genPath(this.waypointsToPortIndex[i]) + ', ';
//     }
//     output += `  draw${this.typeName}(${argList});\n`;
//     return output
//   };
// }
