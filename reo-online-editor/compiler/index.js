const antlr4 = require('antlr4'),
  ReoLexer = require('./ReoLexer').ReoLexer,
  ReoParser = require('./ReoParser').ReoParser;

module.exports.ReoListenerImpl = require('./ReoListenerImpl').ReoListenerImpl;

module.exports.parse = function (input, listener) {
  var chars = new antlr4.InputStream(input);
  var lexer = new ReoLexer(chars);
  var tokens = new antlr4.CommonTokenStream(lexer);
  var parser = new ReoParser(tokens);
  var tree = parser.file();
  antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree);
};
