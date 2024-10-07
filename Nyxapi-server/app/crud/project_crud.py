from sqlalchemy.orm import Session
from app.models.user import Project
from app.schema.project_schema import ProjectCreate, ProjectUpdate

# Create a new project
def create_project(db: Session, project: ProjectCreate):
    db_project = ProjectCreate(
        Title=project.Title,
        UserID=project.UserID
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    print(f"Created Project ID: {db_project.Projectid}, Created Timestamp: {db_project.created}")
    return db_project

# Read a single project by ID
def get_project_by_id(db: Session, project_id: int):
    return db.query(Project).filter(Project.Projectid == project_id).first()

# Read all projects with optional pagination (skip and limit)
def get_projects(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Project).offset(skip).limit(limit).all()

# Update a project by ID
def update_project(db: Session, project_id: int, project_update: ProjectUpdate):
    db_project = db.query(Project).filter(Project.Projectid == project_id).first()
    if db_project:
        if project_update.Title:
            db_project.Title = project_update.Title  # Update title if provided
        db_project.updated = func.now()  # Automatically update the timestamp
        db.commit()
        db.refresh(db_project)
    return db_project

# Delete a project by ID
def delete_project(db: Session, project_id: int):
    db_project = db.query(Project).filter(Project.Projectid == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
    return db_project
