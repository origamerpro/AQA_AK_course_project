import { test } from 'fixtures/ui-services.fixture';
import { TAGS } from 'data/testTags.data';

test.describe('[UI] [Sales Portal]', () => {
  test(
    'Should login to Sales Portal by openAsLoggedInUser and get token',
    { tag: [TAGS.SMOKE] },
    async ({ page, homeUIService }) => {
      await homeUIService.openAsLoggedInUser();
      const token = (await page.context().cookies()).find(
        (c) => c.name === 'Authorization',
      )!.value;
      console.log(`First token: ${token}`);
    },
  );
  test(
    'Should login to Sales Portal by loginAsLocalUser and get token',
    { tag: [TAGS.SMOKE] },
    async ({ signInApiService }) => {
      const token = await signInApiService.loginAsLocalUser();
      console.log(`Second token: ${token}`);
    },
  );
  test(
    'Should open Order module',
    { tag: [TAGS.SMOKE] },
    async ({ homeUIService }) => {
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule('Orders');
    },
  );
});
