import { GetBgColorClassPipe } from './get-bg-color-class.pipe';

describe(GetBgColorClassPipe.name, () => {
  it('create an instance', () => {
    const pipe = new GetBgColorClassPipe();
    expect(pipe).toBeTruthy();
  });
});
