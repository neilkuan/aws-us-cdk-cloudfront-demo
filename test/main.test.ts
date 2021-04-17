import '@aws-cdk/assert/jest';
import { App, Stack } from '@aws-cdk/core';
import { CustomErrorPage, DefaultDirIndex } from '../src/lambda-constructs';

test('Snapshot', () => {
  const app = new App();
  const stack = new Stack(app, 'test');
  new DefaultDirIndex(stack, 'testDefaultDirIndex');
  new CustomErrorPage(stack, 'testCustomErrorPage');
  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
});