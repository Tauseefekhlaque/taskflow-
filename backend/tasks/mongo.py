import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

_client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
_db = _client[os.getenv("MONGO_DB", "taskflow_db")]

tasks_collection = _db["tasks"]
logs_collection = _db["activity_logs"]


def log_activity(user_id, action, details=""):
    from datetime import datetime
    logs_collection.insert_one({
        "user_id": user_id,
        "action": action,
        "details": details,
        "timestamp": datetime.utcnow(),
    })