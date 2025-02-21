import { GetBorderColorClassPipe } from './get-border-color-class.pipe';

describe(GetBorderColorClassPipe.name, () => {
  it('create an instance', () => {
    const pipe = new GetBorderColorClassPipe();
    expect(pipe).toBeTruthy();
  });
});
