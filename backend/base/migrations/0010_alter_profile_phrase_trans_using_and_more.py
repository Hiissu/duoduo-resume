# Generated by Django 4.0.3 on 2022-03-05 12:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_auto_20220215_2114'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='phrase_trans_using',
            field=models.ManyToManyField(blank=True, null=True, through='base.PhraseTransUsing', to='base.phrasetranslation'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='sentence_trans_using',
            field=models.ManyToManyField(blank=True, null=True, through='base.SentenceTransUsing', to='base.sentencetranslation'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='word_trans_using',
            field=models.ManyToManyField(blank=True, null=True, through='base.WordTransUsing', to='base.wordtranslation'),
        ),
    ]
