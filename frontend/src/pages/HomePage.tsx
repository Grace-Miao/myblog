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

  useEffect(() => {
    setLoading(true);
    apiClient
      .get<Post[]>("/posts/", { params: { skip: page * PAGE_SIZE, limit: PAGE_SIZE + 1 } })
      .then((res) => {
        const data = res.data;
        setHasMore(data.length > PAGE_SIZE);
        setPosts(data.slice(0, PAGE_SIZE));
      })
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div>
      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-24">还没有文章，写第一篇吧。</p>
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
                    <Badge variant="secondary" className="shrink-0 text-xs font-normal">
                      {new Date(post.created_at).toLocaleDateString("zh-CN")}
                    </Badge>
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
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            ← 上一页
          </Button>
          <Button variant="outline" size="sm" disabled={!hasMore} onClick={() => setPage((p) => p + 1)}>
            下一页 →
          </Button>
        </div>
      )}
    </div>
  );
}
