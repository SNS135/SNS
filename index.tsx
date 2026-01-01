import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- Types ---
type Tab = 'prototype' | 'architecture' | 'database' | 'infra';

type Post = {
  id: string;
  username: string;
  handle: string;
  content: string;
  timestamp: string;
  likes: number;
};

// --- Mock Data ---
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    username: 'Alice Engineer',
    handle: '@alice_dev',
    content: 'Just set up the Go backend with Clean Architecture! #golang #architecture',
    timestamp: '2m ago',
    likes: 5,
  },
  {
    id: '2',
    username: 'Bob Builder',
    handle: '@bob_k8s',
    content: 'Deploying the MVP to Kubernetes. The ingress configuration was tricky but works now.',
    timestamp: '15m ago',
    likes: 12,
  },
  {
    id: '3',
    username: 'Charlie Design',
    handle: '@ux_charlie',
    content: 'Dark mode is non-negotiable for developer tools. Loving the new contrast ratios.',
    timestamp: '1h ago',
    likes: 8,
  },
];

// --- Components ---

const Layout = ({ children }: { children?: React.ReactNode }) => (
  <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
    {children}
  </div>
);

const Navbar = ({ activeTab, onTabChange }: { activeTab: Tab; onTabChange: (t: Tab) => void }) => (
  <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
    <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
          S
        </div>
        <span className="font-bold text-lg tracking-tight text-white">SNS Scalable</span>
      </div>
      <div className="flex gap-1">
        {[
          { id: 'prototype', label: 'MVP Prototype' },
          { id: 'architecture', label: 'Architecture' },
          { id: 'database', label: 'Database' },
          { id: 'infra', label: 'Infra' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as Tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  </nav>
);

const PrototypeView = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [content, setContent] = useState('');

  const handlePost = () => {
    if (!content.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      username: 'Guest User',
      handle: '@guest',
      content: content,
      timestamp: 'Just now',
      likes: 0,
    };
    setPosts([newPost, ...posts]);
    setContent('');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Post Composer */}
      <div className="bg-slate-800 rounded-xl p-4 shadow-xl border border-slate-700 mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex-shrink-0" />
          <div className="flex-1">
            <textarea
              className="w-full bg-transparent text-slate-200 placeholder-slate-500 resize-none outline-none text-lg min-h-[80px]"
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-between items-center mt-4 border-t border-slate-700 pt-3">
              <div className="flex gap-2 text-indigo-400">
                {/* Mock Icons */}
                <button className="hover:bg-slate-700 p-2 rounded-full transition-colors">📷</button>
                <button className="hover:bg-slate-700 p-2 rounded-full transition-colors">📍</button>
              </div>
              <button
                onClick={handlePost}
                disabled={!content.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-full font-bold transition-all"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-slate-800/50 hover:bg-slate-800 transition-colors p-4 rounded-xl border border-slate-700/50">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-600 flex-shrink-0 flex items-center justify-center font-bold text-slate-300">
                {post.username[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{post.username}</span>
                  <span className="text-slate-500 text-sm">{post.handle}</span>
                  <span className="text-slate-600 text-sm">·</span>
                  <span className="text-slate-500 text-sm">{post.timestamp}</span>
                </div>
                <p className="mt-2 text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                <div className="flex gap-8 mt-3 text-slate-500 text-sm">
                  <button className="hover:text-pink-500 transition-colors flex items-center gap-1">
                    ❤️ {post.likes}
                  </button>
                  <button className="hover:text-indigo-400 transition-colors">💬 Reply</button>
                  <button className="hover:text-green-400 transition-colors">🔄 Repost</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ArchitectureView = () => (
  <div className="max-w-4xl mx-auto py-10 px-4">
    <h2 className="text-3xl font-bold mb-8 text-white">Backend Architecture (Go)</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold text-indigo-400 mb-4">Clean Architecture Layers</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-xs font-mono mt-1">CMD</span>
            <div>
              <strong className="text-slate-200">cmd/server/main.go</strong>
              <p className="text-sm text-slate-400">Dependency Injection & Entry Point. No logic here.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-mono mt-1">DOMAIN</span>
            <div>
              <strong className="text-slate-200">internal/domain</strong>
              <p className="text-sm text-slate-400">Pure Go Structs (User, Post) & Interface definitions. No Frameworks.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 text-xs font-mono mt-1">USECASE</span>
            <div>
              <strong className="text-slate-200">internal/service</strong>
              <p className="text-sm text-slate-400">Business Logic (e.g., CreatePost, FollowUser).</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-xs font-mono mt-1">ADAPTER</span>
            <div>
              <strong className="text-slate-200">internal/adapter</strong>
              <p className="text-sm text-slate-400">Implementations: Echo Handlers (HTTP) & GORM (DB).</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold text-indigo-400 mb-4">Tech Stack Choice</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-200 font-medium">Framework: Echo v4</span>
              <span className="text-xs text-green-400 border border-green-400/30 px-2 rounded">Selected</span>
            </div>
            <p className="text-sm text-slate-400">High performance, minimalist, great middleware support.</p>
          </div>
          <div className="border-t border-slate-700 pt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-200 font-medium">ORM: GORM</span>
              <span className="text-xs text-green-400 border border-green-400/30 px-2 rounded">Selected</span>
            </div>
            <p className="text-sm text-slate-400">Rapid development for MVP. Will be wrapped in Repository interface to allow swap to sqlc later.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DatabaseView = () => (
  <div className="max-w-4xl mx-auto py-10 px-4">
    <h2 className="text-3xl font-bold mb-8 text-white">Database Schema (PostgreSQL)</h2>

    <div className="grid gap-8">
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="bg-slate-900/50 p-3 border-b border-slate-700 flex justify-between items-center">
          <span className="font-mono text-yellow-400 font-bold">users</span>
          <span className="text-xs text-slate-500">Approx. 1KB/row</span>
        </div>
        <div className="p-4 space-y-2 font-mono text-sm">
          <div className="flex justify-between text-slate-300 border-b border-slate-700/50 pb-2">
            <span>id</span>
            <span className="text-indigo-400">UUID (PK)</span>
          </div>
          <div className="flex justify-between text-slate-300 border-b border-slate-700/50 pb-2">
            <span>username</span>
            <span className="text-indigo-400">VARCHAR(32) UNIQUE</span>
          </div>
          <div className="flex justify-between text-slate-300 border-b border-slate-700/50 pb-2">
            <span>email</span>
            <span className="text-indigo-400">VARCHAR(255) UNIQUE</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>created_at</span>
            <span className="text-indigo-400">TIMESTAMP</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="h-8 w-0.5 bg-slate-600"></div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="bg-slate-900/50 p-3 border-b border-slate-700 flex justify-between items-center">
          <span className="font-mono text-yellow-400 font-bold">posts</span>
          <span className="text-xs text-slate-500">1:N Relation with users</span>
        </div>
        <div className="p-4 space-y-2 font-mono text-sm">
          <div className="flex justify-between text-slate-300 border-b border-slate-700/50 pb-2">
            <span>id</span>
            <span className="text-indigo-400">UUID (PK)</span>
          </div>
          <div className="flex justify-between text-slate-300 border-b border-slate-700/50 pb-2">
            <span>user_id</span>
            <span className="text-indigo-400">UUID (FK -> users.id)</span>
          </div>
          <div className="flex justify-between text-slate-300 border-b border-slate-700/50 pb-2">
            <span>content</span>
            <span className="text-indigo-400">TEXT</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>created_at</span>
            <span className="text-indigo-400">TIMESTAMP (Indexed)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InfraView = () => (
  <div className="max-w-4xl mx-auto py-10 px-4">
    <h2 className="text-3xl font-bold mb-8 text-white">Infrastructure Strategy</h2>
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold text-blue-400 mb-4">Local Development (Docker Compose)</h3>
        <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-xs font-mono text-slate-300">
          {`version: '3.8'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_DB: sns_db
    ports:
      - "5432:5432"

  api:
    build: 
      context: .
      dockerfile: build/package/Dockerfile.dev
    volumes:
      - .:/app
    ports:
      - "8080:8080"
    depends_on:
      - db

  web:
    build: 
      context: ./web
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8080`}
        </pre>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold text-blue-400 mb-4">Production (Kubernetes)</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-300">
          <li><strong className="text-white">Ingress Controller:</strong> Nginx - Routes /api/* to Go Backend and /* to Next.js Frontend.</li>
          <li><strong className="text-white">Scaling:</strong> Horizontal Pod Autoscaler (HPA) based on CPU/Memory.</li>
          <li><strong className="text-white">Secrets:</strong> K8s Secrets for Database credentials.</li>
          <li><strong className="text-white">CI/CD:</strong> GitHub Actions building Docker images &gt; Push to Registry &gt; Helm Upgrade.</li>
        </ul>
      </div>
    </div>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>('prototype');

  return (
    <Layout>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {activeTab === 'prototype' && <PrototypeView />}
        {activeTab === 'architecture' && <ArchitectureView />}
        {activeTab === 'database' && <DatabaseView />}
        {activeTab === 'infra' && <InfraView />}
      </main>
    </Layout>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);