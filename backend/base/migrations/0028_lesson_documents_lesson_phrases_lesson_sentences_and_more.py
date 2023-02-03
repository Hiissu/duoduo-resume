# Generated by Django 4.0.3 on 2022-07-24 01:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0027_remove_document_creator_remove_document_language_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='lesson',
            name='documents',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
        migrations.AddField(
            model_name='lesson',
            name='phrases',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
        migrations.AddField(
            model_name='lesson',
            name='sentences',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
        migrations.AddField(
            model_name='lesson',
            name='topics',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
        migrations.AddField(
            model_name='lesson',
            name='words',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
    ]