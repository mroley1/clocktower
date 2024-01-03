from fastapi import FastAPI
from dotenv import dotenv_values
from pymongo import MongoClient
from role_routes import router as role_routes
from script_routes import router as script_routes
from fastapi.middleware.cors import CORSMiddleware

config = dotenv_values(".env")

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "API for clocktower data"}

@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient(config["ATLAS_URI"])
    app.database = app.mongodb_client[config["DB_NAME"]]
    print("Connected to the MongoDB database!")

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()
    

app.include_router(role_routes, tags=["roles"], prefix="/role")
app.include_router(script_routes, tags=["scripts"], prefix="/script")