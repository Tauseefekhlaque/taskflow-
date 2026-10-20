from django.urls import path
from .views import RegisterView, TaskListCreate, TaskDetail, ActivityLogView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('tasks/', TaskListCreate.as_view()),
    path('tasks/<str:pk>/', TaskDetail.as_view()),
    path('logs/', ActivityLogView.as_view()),
]