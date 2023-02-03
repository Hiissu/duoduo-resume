# Generated by Django 4.0.3 on 2022-04-15 16:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('base', '0013_rename_tips_lesson_documents'),
    ]

    operations = [
        migrations.CreateModel(
            name='CourseLearning',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('words_learned', models.IntegerField(default=0)),
                ('phrases_learned', models.IntegerField(default=0)),
                ('sentences_learned', models.IntegerField(default=0)),
                ('story_read', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'duoduo_course_learning',
            },
        ),
        migrations.CreateModel(
            name='LessonsLearning',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('learner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'duoduo_lessons_learning',
            },
        ),
        migrations.CreateModel(
            name='NewWord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('word', models.CharField(max_length=220, unique=True)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'duoduo_new_word',
            },
        ),
        migrations.CreateModel(
            name='PhraseLearned',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_practiced', models.DateTimeField(auto_now=True)),
                ('listening', models.IntegerField(default=0)),
                ('speaking', models.IntegerField(default=0)),
                ('reading', models.IntegerField(default=0)),
                ('writing', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'duoduo_phrase_learned',
            },
        ),
        migrations.CreateModel(
            name='PhraseTranUsing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'db_table': 'duoduo_phrase_translation_using',
            },
        ),
        migrations.CreateModel(
            name='SentenceLearned',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_practiced', models.DateTimeField(auto_now=True)),
                ('listening', models.IntegerField(default=0)),
                ('speaking', models.IntegerField(default=0)),
                ('reading', models.IntegerField(default=0)),
                ('writing', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'duoduo_sentence_learned',
            },
        ),
        migrations.CreateModel(
            name='SentenceTranUsing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'db_table': 'duoduo_sentence_translation_using',
            },
        ),
        migrations.CreateModel(
            name='WordLearned',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_practiced', models.DateTimeField(auto_now=True)),
                ('listening', models.IntegerField(default=0)),
                ('speaking', models.IntegerField(default=0)),
                ('reading', models.IntegerField(default=0)),
                ('writing', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'duoduo_word_learned',
            },
        ),
        migrations.CreateModel(
            name='WordTranUsing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'db_table': 'duoduo_word_translation_using',
            },
        ),
        migrations.AlterUniqueTogether(
            name='learnerstatus',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='learnerstatus',
            name='course',
        ),
        migrations.RemoveField(
            model_name='learnerstatus',
            name='learner',
        ),
        migrations.RemoveField(
            model_name='phrasescore',
            name='language',
        ),
        migrations.RemoveField(
            model_name='phrasescore',
            name='phrase',
        ),
        migrations.RemoveField(
            model_name='phrasescore',
            name='user',
        ),
        migrations.RemoveField(
            model_name='phrasetransusing',
            name='course',
        ),
        migrations.RemoveField(
            model_name='phrasetransusing',
            name='translation',
        ),
        migrations.RemoveField(
            model_name='phrasetransusing',
            name='user',
        ),
        migrations.RemoveField(
            model_name='question',
            name='creator',
        ),
        migrations.RemoveField(
            model_name='question',
            name='language',
        ),
        migrations.RemoveField(
            model_name='question',
            name='topics',
        ),
        migrations.RemoveField(
            model_name='sentencescore',
            name='language',
        ),
        migrations.RemoveField(
            model_name='sentencescore',
            name='sentence',
        ),
        migrations.RemoveField(
            model_name='sentencescore',
            name='user',
        ),
        migrations.RemoveField(
            model_name='sentencetransusing',
            name='course',
        ),
        migrations.RemoveField(
            model_name='sentencetransusing',
            name='translation',
        ),
        migrations.RemoveField(
            model_name='sentencetransusing',
            name='user',
        ),
        migrations.RemoveField(
            model_name='wordscore',
            name='language',
        ),
        migrations.RemoveField(
            model_name='wordscore',
            name='user',
        ),
        migrations.RemoveField(
            model_name='wordscore',
            name='word',
        ),
        migrations.RemoveField(
            model_name='wordtransusing',
            name='course',
        ),
        migrations.RemoveField(
            model_name='wordtransusing',
            name='translation',
        ),
        migrations.RemoveField(
            model_name='wordtransusing',
            name='user',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='courses_learning',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='lessons_learning',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='phrase_trans_using',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='sentence_trans_using',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='word_trans_using',
        ),
        migrations.AddField(
            model_name='phrasetranslation',
            name='is_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='sentencetranslation',
            name='is_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='wordtranslation',
            name='is_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='description',
            field=models.CharField(blank=True, max_length=220, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='name',
            field=models.CharField(blank=True, max_length=220, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='course_learning',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.course'),
        ),
        migrations.AlterModelTable(
            name='category',
            table='duoduo_category',
        ),
        migrations.AlterModelTable(
            name='course',
            table='duoduo_course',
        ),
        migrations.AlterModelTable(
            name='language',
            table='duoduo_language',
        ),
        migrations.AlterModelTable(
            name='lesson',
            table='duoduo_lesson',
        ),
        migrations.AlterModelTable(
            name='phrase',
            table='duoduo_phrase',
        ),
        migrations.AlterModelTable(
            name='phrasetranslation',
            table='duoduo_phrase_translation',
        ),
        migrations.AlterModelTable(
            name='profile',
            table='duoduo_profile',
        ),
        migrations.AlterModelTable(
            name='sentence',
            table='duoduo_sentence',
        ),
        migrations.AlterModelTable(
            name='sentencetranslation',
            table='duoduo_sentence_translation',
        ),
        migrations.AlterModelTable(
            name='topic',
            table='duoduo_topic',
        ),
        migrations.AlterModelTable(
            name='word',
            table='duoduo_word',
        ),
        migrations.AlterModelTable(
            name='wordtranslation',
            table='duoduo_word_translation',
        ),
        migrations.DeleteModel(
            name='ExpRecorder',
        ),
        migrations.DeleteModel(
            name='LearnerStatus',
        ),
        migrations.DeleteModel(
            name='PhraseScore',
        ),
        migrations.DeleteModel(
            name='PhraseTransUsing',
        ),
        migrations.DeleteModel(
            name='Question',
        ),
        migrations.DeleteModel(
            name='SentenceScore',
        ),
        migrations.DeleteModel(
            name='SentenceTransUsing',
        ),
        migrations.DeleteModel(
            name='WordScore',
        ),
        migrations.DeleteModel(
            name='WordTransUsing',
        ),
        migrations.AddField(
            model_name='wordtranusing',
            name='course',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.course'),
        ),
        migrations.AddField(
            model_name='wordtranusing',
            name='translation',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.wordtranslation'),
        ),
        migrations.AddField(
            model_name='wordtranusing',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='wordtranusing',
            name='word',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.word'),
        ),
        migrations.AddField(
            model_name='wordlearned',
            name='language',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.language'),
        ),
        migrations.AddField(
            model_name='wordlearned',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='wordlearned',
            name='word',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.word'),
        ),
        migrations.AddField(
            model_name='sentencetranusing',
            name='course',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.course'),
        ),
        migrations.AddField(
            model_name='sentencetranusing',
            name='sentence',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.sentence'),
        ),
        migrations.AddField(
            model_name='sentencetranusing',
            name='translation',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.sentencetranslation'),
        ),
        migrations.AddField(
            model_name='sentencetranusing',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='sentencelearned',
            name='language',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.language'),
        ),
        migrations.AddField(
            model_name='sentencelearned',
            name='sentence',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.sentence'),
        ),
        migrations.AddField(
            model_name='sentencelearned',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='phrasetranusing',
            name='course',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.course'),
        ),
        migrations.AddField(
            model_name='phrasetranusing',
            name='phrase',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.phrase'),
        ),
        migrations.AddField(
            model_name='phrasetranusing',
            name='translation',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.phrasetranslation'),
        ),
        migrations.AddField(
            model_name='phrasetranusing',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='phraselearned',
            name='language',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.language'),
        ),
        migrations.AddField(
            model_name='phraselearned',
            name='phrase',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.phrase'),
        ),
        migrations.AddField(
            model_name='phraselearned',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='newword',
            name='language',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.language'),
        ),
        migrations.AddField(
            model_name='newword',
            name='topics',
            field=models.ManyToManyField(blank=True, null=True, to='base.topic'),
        ),
        migrations.AddField(
            model_name='lessonslearning',
            name='lesson',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.lesson'),
        ),
        migrations.AddField(
            model_name='courselearning',
            name='course',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.course'),
        ),
        migrations.AddField(
            model_name='courselearning',
            name='learner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='lessonslearning',
            unique_together={('learner', 'lesson')},
        ),
        migrations.AlterUniqueTogether(
            name='courselearning',
            unique_together={('learner', 'course')},
        ),
    ]