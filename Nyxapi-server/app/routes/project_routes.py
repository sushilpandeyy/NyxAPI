from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.crud.project_crud import create_project, get_project_by_id, get_projects, update_project, delete_project
from app.schema.project_schema import ProjectCreate, ProjectUpdate, Project
from app.config import get_db

projectrouter = APIRouter()

@projectrouter.post("/", response_model=Project)
def create_new_project(project: ProjectCreate, db: Session = Depends(get_db)):
    print(project)
    return create_project(db=db, project=project)

@projectrouter.get("/{project_id}", response_model=Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = get_project_by_id(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@projectrouter.put("/{project_id}", response_model=Project)
def update_existing_project(project_id: int, project: ProjectUpdate, db: Session = Depends(get_db)):
    db_project = update_project(db, project_id=project_id, project_update=project)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@projectrouter.delete("/{project_id}")
def delete_existing_project(project_id: int, db: Session = Depends(get_db)):
    db_project = delete_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}
