import { AfappPage } from './app.po';

describe('afapp App', function() {
  let page: AfappPage;

  beforeEach(() => {
    page = new AfappPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
