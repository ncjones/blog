import { getCollection, render } from 'astro:content';

class Post {

  constructor(content) {
    this._content = content;
  }

  async render() {
    return await render(this._content);
  }

  get fullPath() {
    return `/posts/${this.relativePath}`;
  }

  get relativePath() {
    // Normalize the path relative to the content collection. The content id
    // defaults to the relative file path within the content collection
    // (excluding file suffix). But when set explicitly by the "slug"
    // frontmatter attribute then the content id could be absolute (including a
    // "/posts" prefix).
    return this._content.id.replace(/^\/posts\//, '');
  }

  get title() {
    return this._content.data.title;
  }

  get date() {
    return this._content.data.date;
  }

  get timestamp() {
    return +this.date;
  }

  get author() {
    return this._content.data.author;
  }

  get desc() {
    return this._content.data.desc;
  }

  get img() {
    return this._content.data.img;
  }

  get draft() {
    return /\/drafts\//.test(this._content.filePath);
  }

}

export default class Posts {

  static async all() {
    return (await getCollection('posts'))
      .map(p => new Post(p))
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  static async published() {
    return (await Posts.all()).filter(p => !p.draft);
  }

  static async drafts() {
    return (await Posts.all()).filter(p => p.draft);
  }
}
