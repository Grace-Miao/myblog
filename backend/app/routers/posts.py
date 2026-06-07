from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models.post import Post
from ..models.user import User
from ..models.like import Like
from ..schemas.post import PostCreate, PostOut, PostUpdate
from .auth import get_current_user, get_current_user_optional

router = APIRouter(prefix="/posts", tags=["posts"])


def _build_post_out(post: Post, likes_count: int, liked: bool) -> PostOut:
    return PostOut(
        id=post.id, title=post.title, content=post.content,
        excerpt=post.excerpt, cover_image_url=post.cover_image_url,
        is_published=post.is_published, author_id=post.author_id,
        created_at=post.created_at, updated_at=post.updated_at,
        likes_count=likes_count, liked=liked,
    )


@router.get("/", response_model=list[PostOut])
def list_posts(
    skip: int = 0, limit: int = 20, q: str | None = None,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    query = db.query(Post).filter(Post.is_published == True)
    if q:
        query = query.filter(Post.title.ilike(f"%{q}%") | Post.content.ilike(f"%{q}%"))
    posts = query.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

    post_ids = [p.id for p in posts]
    counts = dict(
        db.query(Like.post_id, func.count(Like.user_id))
        .filter(Like.post_id.in_(post_ids))
        .group_by(Like.post_id)
        .all()
    ) if post_ids else {}

    liked_ids: set[int] = set()
    if current_user and post_ids:
        liked_ids = {
            row.post_id for row in
            db.query(Like.post_id).filter(Like.post_id.in_(post_ids), Like.user_id == current_user.id).all()
        }

    return [_build_post_out(p, counts.get(p.id, 0), p.id in liked_ids) for p in posts]


@router.get("/{post_id}", response_model=PostOut)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    count = db.query(Like).filter(Like.post_id == post_id).count()
    liked = bool(current_user and db.query(Like).filter(Like.post_id == post_id, Like.user_id == current_user.id).first())
    return _build_post_out(post, count, liked)


@router.post("/", response_model=PostOut, status_code=201)
def create_post(post_in: PostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = Post(**post_in.model_dump(), author_id=current_user.id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return _build_post_out(post, 0, False)


@router.put("/{post_id}", response_model=PostOut)
def update_post(post_id: int, post_in: PostUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    for field, value in post_in.model_dump(exclude_unset=True).items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    count = db.query(Like).filter(Like.post_id == post_id).count()
    liked = bool(db.query(Like).filter(Like.post_id == post_id, Like.user_id == current_user.id).first())
    return _build_post_out(post, count, liked)


@router.delete("/{post_id}", status_code=204)
def delete_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()


@router.post("/{post_id}/like", response_model=dict)
def toggle_like(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not db.query(Post).filter(Post.id == post_id).first():
        raise HTTPException(status_code=404, detail="Post not found")
    existing = db.query(Like).filter(Like.post_id == post_id, Like.user_id == current_user.id).first()
    if existing:
        db.delete(existing)
        liked = False
    else:
        db.add(Like(post_id=post_id, user_id=current_user.id))
        liked = True
    db.commit()
    count = db.query(Like).filter(Like.post_id == post_id).count()
    return {"likes_count": count, "liked": liked}
