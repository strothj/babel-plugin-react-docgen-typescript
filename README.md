# babel-plugin-react-docgen-typescript

babel-plugin-react-docgen-typescript is a Babel Plugin to generate docgen data from React components written in TypeScript.

## Installation

### Requirements

* @babel/core

`$ npm install --save-dev babel-plugin-react-docgen-typescript`

## Usage

**Via `.bablerc`**

```json
{
  "plugins": [
    [
      "babel-plugin-react-docgen-typescript",
      {
        "docgenCollectionName": "STORYBOOK_REACT_CLASSES",
        "include": "components.*\\.tsx$",
        "exclude": "stories\\.tsx$"
      }
    ]
  ]
}
```

### Performance

This plugin calls out to a parser from [react-docgen-typescript](https://github.com/styleguidist/react-docgen-typescript) for all files ending in `.tsx$`. This is very inefficient. This plugin is a bit of a hack.

To speed things up a bit, it is recommended to include the plugin settings `include` and `exclude` to restrict parsing to your component directories.

### Settings

| **Setting**          | **Required** | **Type**           | **Description**                                                                                                                                                                                       | **Example**                               |
| -------------------- | ------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| skipPropsWithName    | false        | string[] or string | This option is passed along to `react-docgen-typescript`'s parser. It globally ignores props with the specified name(s).                                                                              | `"classname"` or `["classname", "color"]` |
| skipPropsWithoutDoc  | false        | boolean            | This option is passed along to `react-docgen-typescript`'s parser. It globally ignores props without documentation.                                                                                   | `true`                                    |
| shouldExtractLiteralValuesFromEnum  | false        | boolean            | This option is passed along to `react-docgen-typescript`'s parser. It convert string enums and unions to docgen enum format. Possible values are still accessible.                                                                                   | `true`                                    |
| shouldExtractValuesFromUnion  | false        | boolean            | This option is passed along to `react-docgen-typescript`'s parser. It convert multiple types to docgen enum format. Possible values are still accessible.                                                                                   | `true`                                    |
| docgenCollectionName | false        | string             | Enables collecting docgen data into a global object. This is used to integrate with tools like Storybook.                                                                                             | `"STORYBOOK_REACT_CLASSES"`               |
| include              | false        | string             | A regular expression of files to pass along to `react-docgen-typescript`'s parser. Defaults to `\.tsx$`.                                                                                              | `"components.*\\.tsx$"`                   |
| exclude              | false        | string             | A regular expression to filter the results from include. For instance, you can add a regular expression to prevent files ending in `.stories.tsx` from being processed in your component directories. | `"stories\\.tsx$"`                        |

## License

[MIT](https://choosealicense.com/licenses/mit/)
