import { test } from 'fixtures/ui-services.fixture';
import { TAGS } from 'data/testTags.data';

test.describe('[UI] [Sales Portal]', () => {
  test(
    'Should login to Sales Portal and get token',
    { tag: [TAGS.SMOKE] },
    async ({ page, homeUIService }) => {
      await homeUIService.openAsLoggedInUser();
      const token = (await page.context().cookies()).find(
        (c) => c.name === 'Authorization',
      )!.value;
      console.log(token);
    },
  );
});
