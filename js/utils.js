export function getParam(name) {
    return new URLSearchParams(location.search).get(name);
  }
  
  export async function getPosts() {
    const res = await fetch(`data/posts.json?v=${Date.now()}`);
    return res.json();
  }
  
  export function formatDate(d) {
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  