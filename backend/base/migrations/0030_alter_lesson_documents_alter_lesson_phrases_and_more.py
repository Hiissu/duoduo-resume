# Generated by Django 4.0.3 on 2022-07-24 02:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0029_alter_course_course_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lesson',
            name='documents',
            field=models.JSONField(blank=True, default={'documents': [], 'version': '0.0.1'}, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='phrases',
            field=models.JSONField(blank=True, default={'phrases': [], 'version': '0.0.1'}, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='sentences',
            field=models.JSONField(blank=True, default={'sentences': [], 'version': '0.0.1'}, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='topics',
            field=models.JSONField(blank=True, default={'topics': [{'id': '', 'topic': ''}], 'version': '0.0.1'}, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='unknown_phrases',
            field=models.JSONField(blank=True, default={'unknown_phrases': [], 'version': '0.0.1'}, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='unknown_sentences',
            field=models.JSONField(blank=True, default={'unknown_sentences': [], 'version': '0.0.1'}, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='unknown_words',
            field=models.JSONField(blank=True, default={'unknown_words': [], 'version': '0.0.1'}, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='words',
            field=models.JSONField(blank=True, default={'version': '0.0.1', 'words': []}, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='courses_learning',
            field=models.JSONField(blank=True, default={'course_ids': [], 'version': '0.0.1'}, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='learned',
            field=models.JSONField(blank=True, default={'learned': [{'language': '', 'phrase': [], 'sentence': [], 'words': []}], 'version': '0.0.1'}, null=True),
        ),
    ]