# Generated by Django 3.2 on 2022-02-15 08:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_auto_20220215_0007'),
    ]

    operations = [
        migrations.AddField(
            model_name='lesson',
            name='unknown',
            field=models.TextField(blank=True, null=True),
        ),
    ]
