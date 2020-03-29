import * as p from "path";
import { types, PluginObj } from "babel-core";
import { parse, PropItemType } from "react-docgen-typescript/lib/parser";

/**
 * Babel plugin options.
 */
export interface PluginOptions {
  /**
   * Do not include props with the supplied name or names.
   *
   * This option is passed to the "react-docgen-typescript" parser.
   */
  skipPropsWithName?: string[] | string;

  /**
   * Do not document props with no documentation.
   *
   * This option is passed to the "react-docgen-typescript" parser.
   */
  skipPropsWithoutDoc?: boolean;

  /**
   * Enable adding docgen information to a global collection.
   */
  docgenCollectionName?: string;

  /** File paths must match regex. Defaults to /\.tsx$/ . */
  include?: string;

  /** File paths must not match regex. */
  exclude?: string;

  /**
   * If set to true, string enums and unions will be converted to docgen enum format.
   *
   * This option is passed to the "react-docgen-typescript" parser.
   */
  shouldExtractLiteralValuesFromEnum?: boolean;
}

interface State {
  fileProcessed: boolean;
}

export default function(babel: { types: typeof types }): PluginObj<State> {
  const t = babel.types;

  return {
    pre() {
      this.fileProcessed = false;
    },
    visitor: {
      Identifier(path, state) {
        if (this.fileProcessed) return;
        this.fileProcessed = true;

        const filePath: string = state.file.opts.filename;

        const includeRegex =
          typeof state.opts.include === "string"
            ? new RegExp(state.opts.include)
            : new RegExp("\\.tsx$");

        const excludeRegex =
          typeof state.opts.exclude === "string"
            ? new RegExp(state.opts.exclude)
            : null;

        if (
          !includeRegex.test(filePath) ||
          (excludeRegex !== null && excludeRegex.test(filePath))
        ) {
          return;
        }

        const docgenCollectionKeyBase = p
          .relative("./", p.resolve("./", path.hub.file.opts.filename))
          .replace(/\\/g, "/");

        const componentDocs = parse(filePath, {
          shouldExtractLiteralValuesFromEnum:
            state.opts.shouldExtractLiteralValuesFromEnum,
          propFilter: state.opts.propFilter || state.opts,
          componentNameResolver: state.opts.componentNameResolver,
        });

        componentDocs.forEach(doc => {
          const program = path.scope.getProgramParent().path;

          const tryBlockContents: types.Statement[] = [
            // Set component display name.
            t.expressionStatement(
              t.assignmentExpression(
                "=",
                t.memberExpression(
                  t.identifier(doc.displayName),
                  t.identifier("displayName"),
                ),
                t.stringLiteral(doc.displayName),
              ),
            ),

            // Set __docgenInfo field.
            t.expressionStatement(
              t.assignmentExpression(
                "=",
                t.memberExpression(
                  t.identifier(doc.displayName),
                  t.identifier("__docgenInfo"),
                ),
                t.objectExpression([
                  t.objectProperty(
                    t.identifier("description"),
                    t.stringLiteral(doc.description),
                  ),
                  t.objectProperty(
                    t.identifier("displayName"),
                    t.stringLiteral(doc.displayName),
                  ),
                  t.objectProperty(
                    t.identifier("props"),
                    t.objectExpression(
                      Object.keys(doc.props).map(propName =>
                        t.objectProperty(
                          t.identifier(`"${propName}"`),
                          t.objectExpression([
                            t.objectProperty(
                              t.stringLiteral("defaultValue"),
                              doc.props[propName].defaultValue === null
                                ? t.nullLiteral()
                                : t.objectExpression([
                                    t.objectProperty(
                                      t.stringLiteral("value"),
                                      t.stringLiteral(
                                        doc.props[propName].defaultValue.value,
                                      ),
                                    ),
                                  ]),
                            ),
                            t.objectProperty(
                              t.stringLiteral("description"),
                              t.stringLiteral(doc.props[propName].description),
                            ),
                            t.objectProperty(
                              t.stringLiteral("name"),
                              t.stringLiteral(doc.props[propName].name),
                            ),
                            t.objectProperty(
                              t.stringLiteral("required"),
                              t.booleanLiteral(doc.props[propName].required),
                            ),
                            t.objectProperty(
                              t.stringLiteral("type"),
                              t.objectExpression([
                                t.objectProperty(
                                  t.stringLiteral("name"),
                                  t.stringLiteral(
                                    doc.props[propName].type.name,
                                  ),
                                ),
                                t.objectProperty(
                                  t.stringLiteral("raw"),
                                  doc.props[propName].type.raw !== undefined
                                    ? t.stringLiteral(
                                        doc.props[propName].type.raw,
                                      )
                                    : t.nullLiteral(),
                                ),
                                t.objectProperty(
                                  t.stringLiteral("value"),
                                  doc.props[propName].type.value !== undefined
                                    ? t.arrayExpression(
                                        doc.props[
                                          propName
                                        ].type.value.map((type: PropItemType) =>
                                          state.opts
                                            .shouldExtractLiteralValuesFromEnum
                                            ? t.objectExpression([
                                                t.objectProperty(
                                                  t.stringLiteral("value"),
                                                  t.stringLiteral(type.value),
                                                ),
                                              ])
                                            : t.stringLiteral(type.value),
                                        ),
                                      )
                                    : t.nullLiteral(),
                                ),
                              ]),
                            ),
                          ]),
                        ),
                      ),
                    ),
                  ),
                ]),
              ),
            ),
          ];

          if (typeof state.opts.docgenCollectionName === "string") {
            tryBlockContents.push(
              // Add to docgen collection.
              t.ifStatement(
                t.binaryExpression(
                  "!==",
                  t.unaryExpression(
                    "typeof",
                    t.identifier(state.opts.docgenCollectionName),
                  ),
                  t.stringLiteral("undefined"),
                ),
                t.blockStatement([
                  t.expressionStatement(
                    t.assignmentExpression(
                      "=",
                      t.memberExpression(
                        t.identifier(state.opts.docgenCollectionName),
                        t.stringLiteral(
                          `${docgenCollectionKeyBase}#${doc.displayName}`,
                        ),
                        true,
                      ),
                      t.objectExpression([
                        t.objectProperty(
                          t.identifier("name"),
                          t.stringLiteral(doc.displayName),
                        ),
                        t.objectProperty(
                          t.identifier("docgenInfo"),
                          t.memberExpression(
                            t.identifier(doc.displayName),
                            t.identifier("__docgenInfo"),
                          ),
                        ),
                        t.objectProperty(
                          t.identifier("path"),
                          t.stringLiteral(
                            `${docgenCollectionKeyBase}#${doc.displayName}`,
                          ),
                        ),
                      ]),
                    ),
                  ),
                ]),
              ),
            );
          }

          const outerTryStatement = t.tryStatement(
            t.blockStatement(tryBlockContents),
            t.catchClause(t.identifier("e"), t.blockStatement([])),
          );

          // @ts-ignore
          program.pushContainer("body", outerTryStatement);
        });
      },
    },
  };
}
