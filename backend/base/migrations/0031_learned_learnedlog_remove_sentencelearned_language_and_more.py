# Generated by Django 4.0.6 on 2022-08-06 15:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('base', '0030_alter_lesson_documents_alter_lesson_phrases_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='LearnedLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('words', models.JSONField(blank=True, default=list, null=True)),
                ('phrases', models.JSONField(blank=True, default=list, null=True)),
                ('sentences', models.JSONField(blank=True, default=list, null=True)),
                ('time_ms', models.IntegerField(
                    blank=True, default=0, null=True)),
                ('date_learned', models.DateTimeField(auto_now_add=True)),
                ('language', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.language')),
                ('learner', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'duoduo_learned_log',
            },
        )
    ]
