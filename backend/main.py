from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# React Frontend connect panna CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home API
@app.get("/")
def home():
    return {"message": "Todo API is running!"}

# Get Tasks API
@app.get("/tasks")
def get_tasks():
    return [
        {"id": 1, "title": "Learn React", "completed": False},
        {"id": 2, "title": "Build Todo App", "completed": True},
        {"id": 3, "title": "Learn FastAPI", "completed": False}
    ]