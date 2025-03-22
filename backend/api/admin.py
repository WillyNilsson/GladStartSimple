# backend/api/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Region, Source, Topic, Article, UserPost

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name', 'positivity', 'articles_count')
    search_fields = ('name',)

@admin.register(Source)
class SourceAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'source', 'region', 'published_date', 'positivity_score', 'display_image')
    list_filter = ('source', 'region', 'topics', 'published_date')
    search_fields = ('title', 'summary')
    filter_horizontal = ('topics',)
    readonly_fields = ('created_at', 'display_large_image')
    date_hierarchy = 'published_date'
    
    def display_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.image.url)
        elif obj.image_url:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.image_url)
        return "No image"
    display_image.short_description = 'Image'
    
    def display_large_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="300" style="max-height: 300px; object-fit: contain;" />', obj.image.url)
        elif obj.image_url:
            return format_html('<img src="{}" width="300" style="max-height: 300px; object-fit: contain;" />', obj.image_url)
        return "No image"
    display_large_image.short_description = 'Article Image'
    
    fieldsets = (
        (None, {
            'fields': ('title', 'summary', 'source', 'published_date', 'positivity_score')
        }),
        ('Media', {
            'fields': ('image', 'display_large_image', 'image_url', 'url')
        }),
        ('Categorization', {
            'fields': ('region', 'topics')
        }),
        ('Metadata', {
            'fields': ('created_at',)
        }),
    )

@admin.register(UserPost)
class UserPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'username', 'date', 'likes', 'comments', 'shares')
    list_filter = ('date',)
    search_fields = ('title', 'content', 'username')
    date_hierarchy = 'date'