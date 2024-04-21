import datetime

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
    id = models.AutoField(
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        editable=False)

    author = models.ForeignKey(Account, on_delete=models.DO_NOTHING, null=False)
    CuisineType = models.ForeignKey(CuisineType, on_delete=models.DO_NOTHING, null=False)
    foodimg = models.TextField()
    title = models.CharField(max_length=100)
    address = models.CharField(max_length=500)
    website = models.TextField()
    meetdatetime = models.DateTimeField(
        default=datetime.datetime.now()+datetime.timedelta(days=7)
    ) # if no input, put date to be 7 days from creation.
    abuseflag = models.BooleanField(default=False)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self

class MeetParticipants(models.Model):

    meet = models.ForeignKey(Meet, on_delete=models.DO_NOTHING)
    account = models.ForeignKey(Account, on_delete=models.DO_NOTHING)

    class Meta:
        unique_together = ('meet', 'account')
