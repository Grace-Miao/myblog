import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/client";
import type { Post } from "@/types";

const PAGE_SIZE = 5;

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    apiClient
      .get<Post[]>("/posts/", { params: { skip: page * PAGE_SIZE, limit: PAGE_SIZE + 1, q: search || undefined } })
      .then((res) => {
        const data = res.data;
        setHasMore(data.length > PAGE_SIZE);
        setPosts(data.slice(0, PAGE_SIZE));
      })
      .finally(() => setLoading(false));
  }, [page, search]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(0);
    setSearch(query);
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文章…"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <Button type="submit" variant="outline" size="sm">搜索</Button>
        {search && (
          <Button type="button" variant="ghost" size="sm" onClick={() => { setQuery(""); setSearch(""); setPage(0); }}>
            清除
          </Button>
        )}
      </form>

      {search && (
        <p className="text-sm text-gray-400 mb-4">「{search}」的搜索结果</p>
      )}

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-gray-400 text-center py-24">{search ? "没有找到相关文章" : "还没有文章，写第一篇吧。"}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link to={`/posts/${post.id}`} key={post.id} className="block group">
              <Card className="hover:shadow-md transition-all duration-200 group-hover:border-gray-300">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg font-semibold leading-snug group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 shrink-0">
                      {post.likes_count > 0 && (
                        <span className="text-xs text-gray-400">♥ {post.likes_count}</span>
                      )}
                      <Badge variant="secondary" className="text-xs font-normal">
                        {new Date(post.created_at).toLocaleDateString("zh-CN")}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                {post.excerpt && (
                  <CardContent className="pt-0">
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}

      {(page > 0 || hasMore) && (
        <div className="flex justify-center gap-3 mt-8">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>← 上一页</Button>
          <Button variant="outline" size="sm" disabled={!hasMore} onClick={() => setPage((p) => p + 1)}>下一页 →</Button>
        </div>
      )}
    </div>
  );
}
