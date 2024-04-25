import datetime
from django.db.models import Count
from django.db import models
import uuid

from foodjio_account.models import Account

# Create your models here.
class CuisineType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Meet(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        editable=False)

    def get_default_meetdatetime():
        return datetime.datetime.now() + datetime.timedelta(days=7)
    author = models.ForeignKey(Account, on_delete=models.DO_NOTHING, null=False)
    cuisinetype = models.ForeignKey(CuisineType, on_delete=models.DO_NOTHING, null=False)
    foodimg = models.TextField(null=True, blank=True)
    title = models.CharField(max_length=100)
    address = models.CharField(max_length=500)
    website = models.TextField(blank= True, null=True)
    meetdatetime = models.DateTimeField(default=get_default_meetdatetime, blank=True)
     # if no input, put date to be 7 days from creation.
    abuseflag = models.BooleanField(default=False, blank=True, null=True)
    is_full = models.BooleanField(default=False, blank=True)
    active = models.BooleanField(default=True, blank=True, null=True)
    currentnum = models.SmallIntegerField(null=False, blank=False, default=1)
    maxnum = models.SmallIntegerField(null=False, blank=False)

    def __str__(self):
        return self
    @property
    def current_num(self):
        return self.subscribers.count()
class MeetParticipants(models.Model):

    meet = models.ForeignKey(Meet, on_delete=models.DO_NOTHING)
    account = models.ForeignKey(Account, on_delete=models.DO_NOTHING)

    class Meta:
        unique_together = ('meet', 'account')
