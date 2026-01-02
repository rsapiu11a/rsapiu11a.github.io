import { getPosts, getParam, formatDate } from './utils.js';

async function renderPost() {
  const contentEl = document.getElementById('content');
  if (!contentEl) return;

  const slug = getParam('slug');
  if (!slug) return;

  const posts = await getPosts();
  const idx = posts.findIndex(p => p.slug === slug);
  if (idx === -1) return;

  const post = posts[idx];

  document.getElementById('title').textContent = post.title;
  document.getElementById('date').textContent = formatDate(post.date);

  const res = await fetch(`posts/${post.file}?v=${Date.now()}`);
  let md = await res.text();

  // safety: auto-close broken code fences
  if ((md.match(/```/g) || []).length % 2 !== 0) {
    md += '\n```';
  }

  const html = marked.parse(md, { headerIds: true });
  contentEl.innerHTML = html;

  // TOC
  const toc = document.getElementById('toc');
  toc.innerHTML = '';
  document.querySelectorAll('#content h2').forEach(h => {
    toc.innerHTML += `<a href="#${h.id}">${h.textContent}</a>`;
  });

  Prism.highlightAll();

  // Prev / Next
  const prev = posts[idx + 1];
  const next = posts[idx - 1];
  document.getElementById('post-nav').innerHTML = `
    <div>${prev ? `<a href="post.html?slug=${prev.slug}">← ${prev.title}</a>` : ''}</div>
    <div>${next ? `<a href="post.html?slug=${next.slug}">${next.title} →</a>` : ''}</div>
  `;
}

renderPost();