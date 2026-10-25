from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine, SessionLocal
from models import Base, Task
from schemas import TaskCreate, TaskUpdate

app = FastAPI()

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# React Frontend connect panna CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "http://127.0.0.1:3000",
                  ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home API
@app.get("/")
def home():
    return {"message": "Todo API is running!"}

# Get Tasks API
# @app.get("/tasks")
# def get_tasks():
#     return [
#         {"id": 1, "title": "Learn React", "completed": False},
#         {"id": 2, "title": "Build Todo App", "completed": True},
#         {"id": 3, "title": "Learn FastAPI", "completed": False}
    # ]

@app.get("/tasks")
def get_tasks():
    return db.query(Task).all()

@app.post("/tasks")
def create_task(task: TaskCreate):
    new_task = Task(
        title=task.title,
        completed=False
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    task = db.query(Task).filter(Task.id == task_id).first()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}

# @app.put("/tasks/{task_id}")
# def update_task(task_id: int):
#     task = db.query(Task).filter(Task.id == task_id).first()

#     if task is None:
#         raise HTTPException(status_code=404, detail="Task not found")

#     task.completed = True

#     db.commit()
#     db.refresh(task)

#     return task

@app.put("/tasks/{task_id}")
def update_task(task_id: int, updated_task: TaskUpdate):

    task = db.query(Task).filter(Task.id == task_id).first()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    task.title = updated_task.title
    task.completed = updated_task.completed

    db.commit()
    db.refresh(task)

    return task

@app.put("/tasks/edit/{task_id}")
def edit_task(task_id: int, task: TaskCreate):
    todo = db.query(Task).filter(Task.id == task_id).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Task not found")

    todo.title = task.title
    todo.completed = False
    db.commit()
    db.refresh(todo)

    return todo