import { mediumProfile, posts } from '../blog';
import Icon from './Icon';

const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Writing on Medium: one card per post, newest first. Until the first post is out, it says coming soon.
export default function Blog() {
  return <section id="blog" className="blog-section" aria-labelledby="blog-title" data-chapter="Blog">
    <div className="section-bar">
      <div><h2 id="blog-title" className="code-title">Blog</h2></div>
      {mediumProfile && <a href={mediumProfile} target="_blank" rel="noreferrer" className="text-link"><Icon name="medium"/>Read on Medium</a>}
    </div>
    {posts.length
      ? <ul className="blog-posts">{posts.map(post => <li key={post.href}>
          <a className="blog-card" href={post.href} target="_blank" rel="noreferrer">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <h3>{post.title}</h3>
            <p>{post.summary}</p>
            {post.tags?.length ? <ul className="blog-tags" aria-label="Topics">{post.tags.map(tag => <li key={tag}>{tag}</li>)}</ul> : null}
            <span className="blog-read">Read on Medium →</span>
          </a>
        </li>)}</ul>
      : <p className="blog-empty-lead">Coming soon</p>}
  </section>;
}
