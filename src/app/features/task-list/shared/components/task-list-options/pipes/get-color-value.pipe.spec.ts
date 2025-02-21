import { GetColorValuePipe } from './get-color-value.pipe';

describe(GetColorValuePipe.name, () => {
  it('create an instance', () => {
    const pipe = new GetColorValuePipe();
    expect(pipe).toBeTruthy();
  });
});
