import { getCollection, render } from 'astro:content';

const mediumDateFormatter = new Intl.DateTimeFormat('en', {dateStyle: 'medium'});

export class Post {

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

  get formattedDate() {
    return mediumDateFormatter.format(this.date);
  }

  get hyphenatedDate() {
    const yyyy = this.date.getFullYear();
    const mm = String(this.date.getMonth() + 1).padStart(2, '0');
    const dd = String(this.date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  get timestamp() {
    return +this.date;
  }

  get author() {
    return this._content.data.author;
  }

  get description() {
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
