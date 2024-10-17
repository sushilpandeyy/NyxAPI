from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import get_db
from app.crud.project_crud import get_projects
from app.crud.endpoints_crud import get_endpoints
from typing import List


websocketroutes = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, projectid: int):
        await websocket.accept()
        if projectid not in self.active_connections:
            self.active_connections[projectid] = []
        self.active_connections[projectid].append(websocket)
        print(f"New connection: {websocket} for project: {projectid}")

    def disconnect(self, websocket: WebSocket, projectid: int):
        if projectid in self.active_connections:
            if websocket in self.active_connections[projectid]:
                self.active_connections[projectid].remove(websocket)
                if len(self.active_connections[projectid]) == 0:
                    del self.active_connections[projectid]
            print(f"Disconnected: {websocket} from project: {projectid}")

    async def broadcast(self, message: str, projectid: int):
        if projectid in self.active_connections:
            print(f"Broadcasting message to project: {projectid}")
            for connection in self.active_connections[projectid]:
                try:
                    # Send the message to each connected WebSocket in the project
                    await connection.send_text(message)
                    print(f"Message sent to {connection}: {message}")
                except Exception as e:
                    print(f"Error sending message to {connection}: {e}")
                    # Optionally, handle disconnects if the send fails
                    self.disconnect(connection, projectid)

manager = ConnectionManager()

@websocketroutes.websocket("/{project_id}")
async def websocket_endpoint(websocket: WebSocket, project_id: int):
    try:
        await manager.connect(websocket, project_id)
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data, project_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, project_id)
    except HTTPException as e:
        await websocket.close(code=e.status_code)
