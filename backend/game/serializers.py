from rest_framework import serializers
from .models import Player, Distractions, GameSession

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id','name','created_at']

class GameSessionSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source = 'player.name', read_only = True)
    class Meta:
        model = GameSession
        fields = ['id','player', 'player_name', 'time_survived',
                   'distractions_clicked' , 'gave_up', 'played_at']

class DistractionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Distractions
        fields ='__all__'