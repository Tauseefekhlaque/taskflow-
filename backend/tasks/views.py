from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

from .serializers import RegisterSerializer
from .mongo import tasks_collection, logs_collection, log_activity


def serialize_task(doc):
    return {
        "id": str(doc["_id"]),
        "title": doc.get("title", ""),
        "description": doc.get("description", ""),
        "status": doc.get("status", "pending"),
        "created_at": doc["created_at"].isoformat() if doc.get("created_at") else "",
    }


def valid_id(value):
    try:
        ObjectId(value)
        return True
    except (InvalidId, TypeError):
        return False


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        s = RegisterSerializer(data=request.data)
        if s.is_valid():
            s.save()
            log_activity(request.data.get("username"), "REGISTER", "New user")
            return Response({"msg": "User created"}, status=201)
        return Response(s.errors, status=400)


class TaskListCreate(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        status_filter = request.query_params.get("status")
        query = {"user_id": request.user.id}
        if status_filter in ("pending", "completed"):
            query["status"] = status_filter
        docs = tasks_collection.find(query).sort("created_at", -1)
        return Response([serialize_task(d) for d in docs])

    def post(self, request):
        title = request.data.get("title", "").strip()
        if not title:
            return Response({"error": "Title is required"}, status=400)
        doc = {
            "user_id": request.user.id,
            "title": title,
            "description": request.data.get("description", ""),
            "status": "pending",
            "created_at": datetime.utcnow(),
        }
        result = tasks_collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        log_activity(request.user.id, "CREATE_TASK", title)
        return Response(serialize_task(doc), status=201)


class TaskDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        if not valid_id(pk):
            return Response({"error": "Invalid ID"}, status=400)
        update = {}
        if "title" in request.data:
            update["title"] = request.data["title"]
        if "description" in request.data:
            update["description"] = request.data["description"]
        if "status" in request.data and request.data["status"] in ("pending", "completed"):
            update["status"] = request.data["status"]
        result = tasks_collection.update_one(
            {"_id": ObjectId(pk), "user_id": request.user.id},
            {"$set": update}
        )
        if result.matched_count == 0:
            return Response({"error": "Not found"}, status=404)
        doc = tasks_collection.find_one({"_id": ObjectId(pk)})
        log_activity(request.user.id, "UPDATE_TASK", doc.get("title", ""))
        return Response(serialize_task(doc))

    def delete(self, request, pk):
        if not valid_id(pk):
            return Response({"error": "Invalid ID"}, status=400)
        result = tasks_collection.delete_one(
            {"_id": ObjectId(pk), "user_id": request.user.id}
        )
        if result.deleted_count == 0:
            return Response({"error": "Not found"}, status=404)
        log_activity(request.user.id, "DELETE_TASK", f"id={pk}")
        return Response({"msg": "Deleted"}, status=204)


class ActivityLogView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        docs = logs_collection.find(
            {"user_id": request.user.id}
        ).sort("timestamp", -1).limit(20)
        return Response([{
            "action": d.get("action"),
            "details": d.get("details"),
            "timestamp": d["timestamp"].isoformat() if d.get("timestamp") else "",
        } for d in docs])