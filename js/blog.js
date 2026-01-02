function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

async function getPosts() {
  return fetch(`data/posts.json?v=${Date.now()}`).then(r => r.json());
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

async function renderBlogList() {
  const el = document.getElementById('posts');
  if (!el) return;

  const posts = await getPosts();
  posts.sort((a,b)=>new Date(b.date)-new Date(a.date));

  posts.forEach(p => {
    el.innerHTML += `
      <div class="post">
        <div class="date">${formatDate(p.date)}</div>
        <a href="post.html?slug=${p.slug}">${p.title}</a>
      </div>`;
  });
}

async function renderPost() {
  const slug = getParam('slug');
  if (!slug) return;

  const posts = await getPosts();
  const idx = posts.findIndex(p => p.slug === slug);
  const post = posts[idx];

  document.getElementById('title').textContent = post.title;
  document.getElementById('date').textContent = formatDate(post.date);

  const md = await fetch(`posts/${slug}.md`).then(r=>r.text());
  const html = marked.parse(md, { headerIds: true });

  const content = document.getElementById('content');
  content.innerHTML = html;

  document.querySelectorAll('#content h2').forEach(h => {
    document.getElementById('toc').innerHTML +=
      `<a href="#${h.id}">${h.textContent}</a>`;
  });

  Prism.highlightAll();

  const prev = posts[idx+1];
  const next = posts[idx-1];
  document.getElementById('post-nav').innerHTML = `
    <div>${prev ? `<a href="post.html?slug=${prev.slug}">← ${prev.title}</a>` : ''}</div>
    <div>${next ? `<a href="post.html?slug=${next.slug}">${next.title} →</a>` : ''}</div>`;
}

renderBlogList();
renderPost();