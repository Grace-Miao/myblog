from datetime import datetime
from pydantic import BaseModel


class PostBase(BaseModel):
    title: str
    content: str
    excerpt: str | None = None
    cover_image_url: str | None = None
    is_published: bool = False


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    excerpt: str | None = None
    cover_image_url: str | None = None
    is_published: bool | None = None


class PostOut(PostBase):
    id: int
    author_id: int
    created_at: datetime
    updated_at: datetime
    likes_count: int = 0
    liked: bool = False

    model_config = {"from_attributes": True}
