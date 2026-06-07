"""一次性种子脚本：创建博主账号 + 几篇示例文章"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from passlib.context import CryptContext
from app.database import SessionLocal, engine, Base
from app.models import user, post  # noqa: F401 — registers models
from app.models.user import User
from app.models.post import Post

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

Base.metadata.create_all(bind=engine)

db = SessionLocal()

if db.query(User).first():
    print("已有数据，跳过 seed。")
    db.close()
    sys.exit(0)

author = User(
    username="admin",
    email="admin@myblog.com",
    hashed_password=pwd_context.hash("changeme"),
    bio="这里是我的个人博客。",
)
db.add(author)
db.flush()  # 让 author.id 生效

sample_posts = [
    Post(
        title="你好，世界！",
        content="# 你好，世界！\n\n欢迎来到我的博客。这是第一篇文章，后续会持续更新。",
        excerpt="欢迎来到我的博客。",
        is_published=True,
        author_id=author.id,
    ),
    Post(
        title="为什么我选择 FastAPI",
        content="# 为什么我选择 FastAPI\n\nFastAPI 有自动文档、类型检查、异步支持……",
        excerpt="FastAPI 的几个让我印象深刻的优点。",
        is_published=True,
        author_id=author.id,
    ),
    Post(
        title="草稿：下一步计划",
        content="这篇还没写完，先存着。",
        is_published=False,  # 未发布，不会出现在列表
        author_id=author.id,
    ),
]
db.add_all(sample_posts)
db.commit()
db.close()

print("Seed 完成！用户名: admin  密码: changeme")
