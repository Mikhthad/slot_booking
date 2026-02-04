from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone



class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.user.username

class Topic(models.Model):
    name = models.CharField(max_length=100)
    
class Batch(models.Model):
    month = models.IntegerField()
    year = models.IntegerField()
    batch_number = models.IntegerField()
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField()

    def __str__(self):
        return f"Batch {self.batch_number} - {self.month}/{self.year}"


    def __str__(self):
        return f"Batch {self.batch_number} - {self.month}/{self.year}"
    
class ClassSlot(models.Model):
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    day_number = models.IntegerField()
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    class_date = models.DateField()
    is_selectable = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.class_date} - {self.topic.name}'
    
class SelectedSlot(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    slot = models.ForeignKey(ClassSlot, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'slot')

    def __str__(self):
        return f'{self.user.username} - {self.slot}'
    