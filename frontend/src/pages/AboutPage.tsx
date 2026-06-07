import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const skills = ["React", "TypeScript", "FastAPI", "Python", "Docker", "PostgreSQL"];
const interests = ["编程", "开源", "阅读", "音乐"];

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="flex items-center gap-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src="" />
          <AvatarFallback className="text-2xl bg-gray-200">M</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">miaop</h1>
          <p className="text-gray-500 mt-1">开发者 · 写作者</p>
        </div>
      </div>

      <Separator />

      <section className="space-y-3">
        <h2 className="font-semibold text-lg">关于我</h2>
        <p className="text-gray-600 leading-relaxed">
          你好，我是 miaop。这是我的个人博客，主要记录技术学习、项目实践和一些随想。
          欢迎留言交流。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-lg">技术栈</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <Badge key={s} variant="secondary">{s}</Badge>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-lg">兴趣</h2>
        <div className="flex flex-wrap gap-2">
          {interests.map((i) => (
            <Badge key={i} variant="outline">{i}</Badge>
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-2">
        <h2 className="font-semibold text-lg">联系</h2>
        <p className="text-gray-600 text-sm">
          GitHub：<a href="https://github.com/Grace-Miao" className="text-blue-600 hover:underline">Grace-Miao</a>
        </p>
      </section>
    </div>
  );
}
