from django.core.management.base import BaseCommand
from game.models import Distractions, Player, GameSession
from random import randint


class Command(BaseCommand):
    help = 'Seeds the database with initial distraction data'

    def handle(self,*args, **kwargs):
        #clear existing
        Distractions.objects.all().delete()

        distractions =[
            #notifs
            # Notifications
            {'type': 'notification', 'content': 'Mom is calling ', 'roast_message': 'You answered. Of course you did.'},
            {'type': 'notification', 'content': 'Steam Sale ends in 2 hours ', 'roast_message': 'The games will still be there after exams. Probably.'},
            {'type': 'notification', 'content': 'You have 1,847 unread emails ', 'roast_message': 'Inbox zero is a myth anyway.'},
            {'type': 'notification', 'content': 'Your food is 2 minutes away ', 'roast_message': 'Okay this one was valid.'},

            # Minigames
            {'type': 'minigame', 'content': "Don't think about food for 10 seconds. Go.", 'roast_message': 'You thought about food immediately. Respect.'},
            {'type': 'minigame', 'content': "Type 'I will study' without making a typo.", 'roast_message': 'Autocorrect said no.'},
            {'type': 'minigame', 'content': 'Click the button exactly 5 times. Not 4. Not 6.', 'roast_message': 'You clicked 7 times. Unacceptable.'},
            {'type': 'minigame', 'content': 'Name 5 countries that start with A in 10 seconds.', 'roast_message': 'Afghanistan, Albania... and then silence.'},
        ]

        for d in distractions:
            Distractions.objects.create(**d)
        
        players_data = ['John', 'Mary', 'Emily', 'Robert', 'Harry']
        times = [847,634,234,226,667]

        for i, name in enumerate(players_data):
            player, _ = Player.objects.get_or_create(name = name)
            GameSession.objects.create(
                player = player,
                time_survived = times[i],
                distractions_clicked = randint(3,12),
                gave_up = False
            )

            self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))