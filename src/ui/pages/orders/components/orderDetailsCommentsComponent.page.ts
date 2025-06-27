import { BasePage } from 'ui/pages/base.page';
import { logStep } from 'utils/reporter.utils';

export class OrderCommentsTab extends BasePage {
  readonly commentsTab = this.page.locator('#comments');
  readonly commentInput = this.page.locator('#textareaComments');
  readonly createCommentButton = this.page.locator('#create-comment-btn');
  readonly commentItems = this.page.locator(
    '.shadow-sm.rounded.mx-3.my-3.p-3.border',
  );

  @logStep('Add new comment')
  async addComment(text: string) {
    await this.commentInput.fill(text);
    await this.createCommentButton.click();
  }

  @logStep('Get comment by index')
  async getComment(index: number) {
    const comment = this.commentItems.nth(index);
    return {
      text: await comment.locator('p.m-0').innerText(),
      author: await comment.locator('.text-primary').innerText(),
      timestamp: await comment.locator('span:not(.text-primary)').innerText(),
      deleteButton: comment.locator('button[name="delete-comment"]'),
    };
  }

  @logStep('Delete comment by index')
  async deleteComment(index: number) {
    const comment = await this.getComment(index);
    await comment.deleteButton.click();
  }

  @logStep('Get all comments')
  async getAllComments() {
    const count = await this.commentItems.count();
    const comments = [];
    for (let i = 0; i < count; i++) {
      comments.push(await this.getComment(i));
    }
    return comments;
  }

  @logStep('Check comment exists')
  async isCommentExists(text: string) {
    const comments = await this.getAllComments();
    return comments.some((comment) => comment.text.includes(text));
  }
}
