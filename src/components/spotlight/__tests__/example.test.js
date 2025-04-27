import { describe, it, expect } from 'vitest';
import { getEntry, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import About from '../../../pages/about.astro';
import Articles from '../../../pages/articles.astro';
import PostPage from '../../../pages/posts/[...path].astro';
import { Post } from '../../../Posts.js';

async function normalizedRender(component, opts) {
    const container = await AstroContainer.create();
    const result = await container.renderToString(component, opts);
    return result
      .replaceAll(/>\s*</g, '>\n<')
      .replaceAll(/ data-astro-[^=]*="[^"]*"/g, '')
}

describe('example.astro', () => {

  it('renders about page', async () => {
    const result = await normalizedRender(About, {});
    expect(result).toMatchSnapshot();
  });

  it('renders articles page', async () => {
    const result = await normalizedRender(Articles, {});
    expect(result).toMatchSnapshot();
  });

  it('renders layout + markdown content', async () => {
    const entry = await getEntry('posts', 'nodejs-custom-inspect-uint-arrays');
    const post = new Post(entry);
    const html = await normalizedRender(PostPage, { props: { post } });
    expect(html).toMatchSnapshot();
  });

});

