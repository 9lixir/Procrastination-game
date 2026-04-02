from django.urls import path
from . import views

urlpatterns =[
    path('player/create/', views.create_player),
    path('session/save/', views.save_session),
    path('leaderboard/', views.leaderboard),
    path('distraction/', views.get_distraction),
]