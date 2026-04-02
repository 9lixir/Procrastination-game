from django.contrib import admin
from .models import Player, GameSession, Distractions

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'created_at']

@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    list_display = ['id', 'player', 'time_survived', 'distractions_clicked', 'gave_up', 'played_at']

@admin.register(Distractions)
class DistractionsAdmin(admin.ModelAdmin):
    list_display = ['id', 'type', 'content', 'roast_message']