from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Player, GameSession, Distractions
from .serializers import PlayerSerializer, GameSessionSerializer, DistractionsSerializer
import requests
import random


@api_view(['POST'])
def create_player(request):
    name = request.data.get('name')
    player, created = Player.objects.get_or_create(name=name)
    serializer = PlayerSerializer(player)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def save_session(request):
    serializer = GameSessionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def leaderboard(request):
    sessions = GameSession.objects.order_by('-time_survived')[:10]
    serializer = GameSessionSerializer(sessions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_distraction(request):
    distraction_type = random.choice(['meme', 'notification', 'minigame'])
    
    if distraction_type == 'meme':
        # fetch from free meme API
        meme_response = requests.get('https://meme-api.com/gimme')
        meme_data = meme_response.json()
        return Response({
            'type': 'meme',
            'content': meme_data['url'],
            'title': meme_data['title'],
            'roast_message': "You clicked a meme. Productivity: 0%"
        })
    
    elif distraction_type == 'notification':
        notifications = [
            "Mom is calling",
            "Sale on Steam!! ",
            "You have 1,847 unread emails ",
            "Your food delivery is 2 minutes away ",
        ]
        return Response({
            'type': 'notification',
            'content': random.choice(notifications),
            'roast_message': "Distracted by a notification. Classic."
        })
    
    else:
        minigames = [
            "Don't think about food for 10 seconds. Go.",
            "Type 'I will study' without making a typo.",
            "Click the button exactly 5 times. Not 4. Not 6.",
        ]
        return Response({
            'type': 'minigame',
            'content': random.choice(minigames),
            'roast_message': "You played a game instead of studying. Respect."
        })
