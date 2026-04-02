from django.db import models

# Create your models here.

class Player(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class GameSession(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name ='sessions')
    time_survived = models.IntegerField(default=0)
    distractions_clicked = models.IntegerField(default=0)
    gave_up = models.BooleanField(default=False)
    played_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player.name} - {self.time_survived}s"
    
class Distractions(models.Model):
    TYPES =[
        ('meme','Meme'),
        ('notifications', 'Fake Notifications'),
        ('minigame', 'Mini Game'),
    ]

    type = models.CharField(max_length=20, choices= TYPES)
    content = models.TextField() # text for notifs, prompts for minigames
    roast_message = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.type}:{self.content[:30]}"