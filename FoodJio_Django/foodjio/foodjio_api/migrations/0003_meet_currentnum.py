# Generated by Django 5.0.4 on 2024-04-25 01:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foodjio_api', '0002_alter_meet_is_full'),
    ]

    operations = [
        migrations.AddField(
            model_name='meet',
            name='currentnum',
            field=models.SmallIntegerField(default=1),
        ),
    ]
