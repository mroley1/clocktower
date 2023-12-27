from fastapi import FastAPI, Request
from pymongo import MongoClient

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hell World"}

@app.get("/log")
def get_log(request: Request):
    logs = list(request.app.database["startup_log"].find(limit=100))
    return logs

@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient("mongodb://localhost:27017")
    app.database = app.mongodb_client["local"]
    print("Connected to the MongoDB database!")

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()