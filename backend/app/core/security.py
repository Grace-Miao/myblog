from datetime import datetime, timedelta, timezone
import bcrypt
from jose import JWTError, jwt
from .config import settings


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def create_access_token(username: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": username, "exp": expire}, settings.SECRET_KEY, algorithm="HS256")


def decode_token(token: str) -> str:
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    return payload["sub"]
