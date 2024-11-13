// plopfile.js
module.exports = function (plop) {
    plop.setGenerator('component', {
      description: 'Create a new component with its test file',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'Component name?',
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.js',
          templateFile: 'plop-templates/Component.js.hbs',
        },
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.test.js',
          templateFile: 'plop-templates/Component.test.js.hbs',
        },
      ],
    });
  };
  