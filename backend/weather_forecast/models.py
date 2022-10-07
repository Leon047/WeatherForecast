from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now
from django.db import models

DEFAULT_ID = 1
EMPTY_STRING = ''
EMPTY_DICT = dict


class UserModel(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'password']
    username = models.CharField(max_length=20, unique=True, default=EMPTY_STRING)
    password = models.CharField(max_length=255)
    email = models.EmailField(unique=True, default=EMPTY_STRING)

    def __str__(self):
        return self.email

class HistoryModel(models.Model):
    user = models.ForeignKey(
        UserModel, related_name='user_details', on_delete=models.CASCADE
    )
    date = models.DateTimeField(default=now, editable=False)
    location = models.CharField(max_length=50, default=EMPTY_STRING)
    forecast = models.JSONField(blank=True, default=EMPTY_DICT)

    def __str__(self):
        return "%s %s" % (self.user.email, self.location)
