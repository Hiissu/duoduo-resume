from django.contrib import admin

from .models import *


class ProfileAdmin(admin.ModelAdmin):
    list_display = ["id", "user"]
    search_fields = ["user__username"]

    class Meta:
        model = Profile


admin.site.register(Profile, ProfileAdmin)


class LanguageAdmin(admin.ModelAdmin):
    list_display = ["id", "language"]
    search_fields = ["language"]

    class Meta:
        model = Language


admin.site.register(Language, LanguageAdmin)


class CourseAdmin(admin.ModelAdmin):
    list_display = ["id", "language_learning", "language_speaking"]
    search_fields = ["language_learning", "language_speaking"]

    class Meta:
        model = Course


admin.site.register(Course, CourseAdmin)


class CollectionAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "language", "creator"]
    readonly_fields = ("date_created", "date_updated")

    class Meta:
        model = Collection


admin.site.register(Collection, CollectionAdmin)
admin.site.register(CollectionLearning)


class TopicAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]
    search_fields = ["name"]

    class Meta:
        model = Topic


admin.site.register(Topic, TopicAdmin)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]
    search_fields = ["name"]

    class Meta:
        model = Category


admin.site.register(Category, CategoryAdmin)


# ---- Word Section ----


class WordAdmin(admin.ModelAdmin):
    list_display = ["id", "word", "language", "topics", "creator"]
    search_fields = ["word"]
    readonly_fields = ("date_created",)

    class Meta:
        model = Word


admin.site.register(Word)
admin.site.register(WordTranslation)


# ---- Phrase Section ----


class PhraseAdmin(admin.ModelAdmin):
    list_display = ["id", "phrase", "language", "topic", "creator"]
    search_fields = ["phrase"]
    readonly_fields = ("date_created",)

    class Meta:
        model = Phrase


admin.site.register(Phrase)
admin.site.register(PhraseTranslation)


# ---- Sentence Section ----


class SentenceAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "sentence",
        "ipa",
        "meaning",
        "definition",
        "node",
        "course",
        "topic",
        "creator",
    ]
    search_fields = ["sentence"]

    class Meta:
        model = Sentence


admin.site.register(Sentence)
admin.site.register(SentenceTranslation)

admin.site.register(Verification)
admin.site.register(Learned)
