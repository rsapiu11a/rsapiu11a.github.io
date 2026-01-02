import { getPosts, formatDate } from './utils.js';

async function renderBlogList() {
  const el = document.getElementById('posts');
  if (!el) return;

  const posts = await getPosts();
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  el.innerHTML = '';
  posts.forEach(p => {
    el.innerHTML += `
      <div class="post">
        <div class="date">${formatDate(p.date)}</div>
        <a href="post.html?slug=${p.slug}">${p.title}</a>
      </div>
    `;
  });
}

renderBlogList();
