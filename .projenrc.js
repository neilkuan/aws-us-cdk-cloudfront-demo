const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.95.2',
  defaultReleaseBranch: 'main',
  jsiiFqn: "projen.AwsCdkTypeScriptApp",
  name: 'awsus-cf',
});

project.synth();
