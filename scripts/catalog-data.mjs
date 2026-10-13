import ts from "typescript";

// Read literal catalog data without executing the application's code.
export function readCatalog(source) {
  const file = ts.createSourceFile("items.ts", source, ts.ScriptTarget.Latest, true);
  let initializer;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) &&
        ["rawItems", "items"].includes(node.name.text) && node.initializer &&
        ts.isArrayLiteralExpression(node.initializer)) initializer = node.initializer;
    ts.forEachChild(node, visit);
  }
  visit(file);
  if (!initializer) throw new Error("Could not find the literal catalog array");
  function literal(node) {
    if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return ts.isNumericLiteral(node) ? Number(node.text) : node.text;
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
    if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map((prop) => {
      if (!ts.isPropertyAssignment(prop)) throw new Error("Catalog records must contain literal properties");
      return [prop.name.text, literal(prop.initializer)];
    }));
    throw new Error("Catalog values must be literals");
  }
  return literal(initializer);
}

export function catalogKey(item) {
  return `${item.category}:${item.title.toLowerCase().trim()}`;
}
