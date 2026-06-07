from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models.comment import Comment
from ..models.post import Post
from ..models.user import User
from ..schemas.comment import CommentCreate, CommentOut
from .auth import get_current_user

router = APIRouter(tags=["comments"])


@router.get("/posts/{post_id}/comments", response_model=list[CommentOut])
def list_comments(post_id: int, db: Session = Depends(get_db)):
    comments = (
        db.query(Comment)
        .options(joinedload(Comment.author))
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at)
        .all()
    )
    return [
        CommentOut(id=c.id, content=c.content, author_username=c.author.username, created_at=c.created_at)
        for c in comments
    ]


@router.post("/posts/{post_id}/comments", response_model=CommentOut, status_code=201)
def create_comment(
    post_id: int,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not db.query(Post).filter(Post.id == post_id).first():
        raise HTTPException(status_code=404, detail="Post not found")
    comment = Comment(content=comment_in.content, post_id=post_id, author_id=current_user.id)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return CommentOut(
        id=comment.id,
        content=comment.content,
        author_username=current_user.username,
        created_at=comment.created_at,
    )
