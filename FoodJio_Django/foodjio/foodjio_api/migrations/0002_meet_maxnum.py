# Generated by Django 5.0.4 on 2024-04-23 08:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foodjio_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='meet',
            name='maxnum',
            field=models.SmallIntegerField(default=2),
            preserve_default=False,
        ),
    ]
