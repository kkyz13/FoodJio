# Generated by Django 5.0.4 on 2024-04-24 07:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foodjio_api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='meet',
            name='is_full',
            field=models.BooleanField(blank=True, default=False),
        ),
    ]
