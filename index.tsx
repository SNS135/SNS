import React, { useState, useEffect, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';

// --- Types ---
type Tab = 'prototype' | 'architecture' | 'database' | 'infra' | 'admin';

type User = {
  id: string;
  username: string;
  handle: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
};

type Post = {
  id: string;
  userId: string;
  username: string;
  handle: string;
  content: string;
  timestamp: string;
  likes: number;
  isHidden: boolean;
};

type AuthContextType = {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

// --- Test Admin Account ---
const TEST_ADMIN: User = {
  id: 'admin-001',
  username: 'Admin User',
  handle: '@admin',
  email: 'admin@sns.test',
  role: 'admin',
  isActive: true,
  createdAt: '2026-01-01',
};

const TEST_CREDENTIALS = {
  email: 'admin@sns.test',
  password: 'admin123',
};

// --- Mock Data ---
const MOCK_USERS: User[] = [
  TEST_ADMIN,
  {
    id: 'user-001',
    username: 'Alice Engineer',
    handle: '@alice_dev',
    email: 'alice@example.com',
    role: 'user',
    isActive: true,
    createdAt: '2025-12-15',
  },
  {
    id: 'user-002',
    username: 'Bob Builder',
    handle: '@bob_k8s',
    email: 'bob@example.com',
    role: 'user',
    isActive: true,
    createdAt: '2025-12-20',
  },
  {
    id: 'user-003',
    username: 'Charlie Design',
    handle: '@ux_charlie',
    email: 'charlie@example.com',
    role: 'user',
    isActive: false,
    createdAt: '2025-12-25',
  },
];

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    userId: 'user-001',
    username: 'Alice Engineer',
    handle: '@alice_dev',
    content: 'Just set up the Go backend with Clean Architecture! #golang #architecture',
    timestamp: '2m ago',
    likes: 5,
    isHidden: false,
  },
  {
    id: '2',
    userId: 'user-002',
    username: 'Bob Builder',
    handle: '@bob_k8s',
    content: 'Deploying the MVP to Kubernetes. The ingress configuration was tricky but works now.',
    timestamp: '15m ago',
    likes: 12,
    isHidden: false,
  },
  {
    id: '3',
    userId: 'user-003',
    username: 'Charlie Design',
    handle: '@ux_charlie',
    content: 'Dark mode is non-negotiable for developer tools. Loving the new contrast ratios.',
    timestamp: '1h ago',
    likes: 8,
    isHidden: false,
  },
];

// --- Auth Context ---
const AuthContext = createContext<AuthContextType | null>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sns_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, password: string): boolean => {
    if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
      setCurrentUser(TEST_ADMIN);
      localStorage.setItem('sns_user', JSON.stringify(TEST_ADMIN));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sns_user');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --- Components ---
const Layout = ({ children }: { children?: React.ReactNode }) => (
  <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
    {children}
  </div>
);

const LoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@sns.test');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      onClose();
    } else {
      setError('Invalid credentials');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md border border-slate-700 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="bg-slate-700/50 rounded-lg p-3 text-sm">
            <p className="text-slate-400">Test Admin Account:</p>
            <p className="text-indigo-400 font-mono">Email: admin@sns.test</p>
            <p className="text-indigo-400 font-mono">Password: admin123</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Navbar = ({
  activeTab,
  onTabChange,
  onLoginClick,
}: {
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
  onLoginClick: () => void;
}) => {
  const { isAuthenticated, isAdmin, currentUser, logout } = useAuth();

  const tabs = [
    { id: 'prototype', label: 'MVP Prototype' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'database', label: 'Database' },
    { id: 'infra', label: 'Infra' },
    ...(isAdmin ? [{ id: 'admin', label: '🔐 Admin' }] : []),
  ];

  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            S
          </div>
          <span className="font-bold text-lg tracking-tight text-white">SNS Scalable</span>
        </div>
        <div className="flex gap-1">
          {tabs.map((tab) => (
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
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {currentUser?.username[0]}
                </div>
                <div className="text-sm">
                  <div className="text-white font-medium">{currentUser?.username}</div>
                  <div className="text-xs text-indigo-400">{currentUser?.role.toUpperCase()}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-white text-sm px-3 py-1 rounded border border-slate-700 hover:border-slate-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Admin Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const PrototypeView = ({
  posts,
  onAddPost,
  onDeletePost,
  onToggleHide,
}: {
  posts: Post[];
  onAddPost: (content: string) => void;
  onDeletePost: (id: string) => void;
  onToggleHide: (id: string) => void;
}) => {
  const { isAuthenticated, isAdmin, currentUser } = useAuth();
  const [content, setContent] = useState('');

  const handlePost = () => {
    if (!content.trim()) return;
    onAddPost(content);
    setContent('');
  };

  const visiblePosts = isAdmin ? posts : posts.filter((p) => !p.isHidden);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Post Composer */}
      <div className="bg-slate-800 rounded-xl p-4 shadow-xl border border-slate-700 mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center text-white font-bold">
            {isAuthenticated ? currentUser?.username[0] : 'G'}
          </div>
          <div className="flex-1">
            <textarea
              className="w-full bg-transparent text-slate-200 placeholder-slate-500 resize-none outline-none text-lg min-h-[80px]"
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-between items-center mt-4 border-t border-slate-700 pt-3">
              <div className="flex gap-2 text-indigo-400">
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
        {visiblePosts.map((post) => (
          <div
            key={post.id}
            className={`bg-slate-800/50 hover:bg-slate-800 transition-colors p-4 rounded-xl border ${post.isHidden ? 'border-red-500/50 opacity-60' : 'border-slate-700/50'
              }`}
          >
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
                  {post.isHidden && (
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">HIDDEN</span>
                  )}
                </div>
                <p className="mt-2 text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                <div className="flex gap-4 mt-3 text-slate-500 text-sm items-center">
                  <button className="hover:text-pink-500 transition-colors flex items-center gap-1">
                    ❤️ {post.likes}
                  </button>
                  <button className="hover:text-indigo-400 transition-colors">💬 Reply</button>
                  <button className="hover:text-green-400 transition-colors">🔄 Repost</button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onToggleHide(post.id)}
                        className="hover:text-yellow-400 transition-colors ml-auto"
                      >
                        {post.isHidden ? '👁️ Show' : '🙈 Hide'}
                      </button>
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="hover:text-red-400 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminPanel = ({
  users,
  posts,
  onToggleUserActive,
  onDeleteUser,
  onDeletePost,
}: {
  users: User[];
  posts: Post[];
  onToggleUserActive: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onDeletePost: (id: string) => void;
}) => {
  const [activeSection, setActiveSection] = useState<'users' | 'posts' | 'stats'>('stats');

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-tr from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🔐</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400">Full control over users and content</p>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'stats', label: '📊 Statistics', icon: '📊' },
          { id: 'users', label: '👥 User Management', icon: '👥' },
          { id: 'posts', label: '📝 Content Moderation', icon: '📝' },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as typeof activeSection)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeSection === section.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Statistics */}
      {activeSection === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-4xl font-bold text-indigo-400">{users.length}</div>
            <div className="text-slate-400 mt-1">Total Users</div>
            <div className="text-sm text-green-400 mt-2">
              {users.filter((u) => u.isActive).length} active
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-4xl font-bold text-purple-400">{posts.length}</div>
            <div className="text-slate-400 mt-1">Total Posts</div>
            <div className="text-sm text-yellow-400 mt-2">
              {posts.filter((p) => p.isHidden).length} hidden
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-4xl font-bold text-green-400">
              {posts.reduce((acc, p) => acc + p.likes, 0)}
            </div>
            <div className="text-slate-400 mt-1">Total Likes</div>
          </div>
        </div>
      )}

      {/* User Management */}
      {activeSection === 'users' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="text-left p-4 text-slate-400 font-medium">User</th>
                <th className="text-left p-4 text-slate-400 font-medium">Email</th>
                <th className="text-left p-4 text-slate-400 font-medium">Role</th>
                <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-slate-700">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.username[0]}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.username}</div>
                        <div className="text-slate-500 text-sm">{user.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-blue-500/20 text-blue-400'
                        }`}
                    >
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${user.isActive
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-slate-500/20 text-slate-400'
                        }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.role !== 'admin' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onToggleUserActive(user.id)}
                          className="text-sm px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => onDeleteUser(user.id)}
                          className="text-sm px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Content Moderation */}
      {activeSection === 'posts' && (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`bg-slate-800 rounded-xl p-4 border ${post.isHidden ? 'border-red-500/50' : 'border-slate-700'
                }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-white">{post.username}</span>
                    <span className="text-slate-500">{post.handle}</span>
                    {post.isHidden && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                        HIDDEN
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300">{post.content}</p>
                </div>
                <button
                  onClick={() => onDeletePost(post.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
              <p className="text-sm text-slate-400">Dependency Injection &amp; Entry Point. No logic here.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-mono mt-1">DOMAIN</span>
            <div>
              <strong className="text-slate-200">internal/domain</strong>
              <p className="text-sm text-slate-400">Pure Go Structs (User, Post) &amp; Interface definitions. No Frameworks.</p>
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
              <p className="text-sm text-slate-400">Implementations: Echo Handlers (HTTP) &amp; GORM (DB).</p>
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
            <span className="text-indigo-400">UUID (FK → users.id)</span>
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
          <li><strong className="text-white">CI/CD:</strong> GitHub Actions building Docker images → Push to Registry → Helm Upgrade.</li>
        </ul>
      </div>
    </div>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>('prototype');
  const [showLogin, setShowLogin] = useState(false);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  const handleAddPost = (content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId: 'guest',
      username: 'Guest User',
      handle: '@guest',
      content,
      timestamp: 'Just now',
      likes: 0,
      isHidden: false,
    };
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const handleToggleHide = (id: string) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, isHidden: !p.isHidden } : p)));
  };

  const handleToggleUserActive = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    setPosts(posts.filter((p) => p.userId !== id));
  };

  return (
    <AuthProvider>
      <Layout>
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} onLoginClick={() => setShowLogin(true)} />
        <main>
          {activeTab === 'prototype' && (
            <PrototypeView
              posts={posts}
              onAddPost={handleAddPost}
              onDeletePost={handleDeletePost}
              onToggleHide={handleToggleHide}
            />
          )}
          {activeTab === 'architecture' && <ArchitectureView />}
          {activeTab === 'database' && <DatabaseView />}
          {activeTab === 'infra' && <InfraView />}
          {activeTab === 'admin' && (
            <AdminPanel
              users={users}
              posts={posts}
              onToggleUserActive={handleToggleUserActive}
              onDeleteUser={handleDeleteUser}
              onDeletePost={handleDeletePost}
            />
          )}
        </main>
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      </Layout>
    </AuthProvider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);