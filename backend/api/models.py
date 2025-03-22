from django.db import models
from django.contrib.auth.models import User

class Region(models.Model):
    name = models.CharField(max_length=100)
    positivity = models.FloatField(help_text="Positivity score 0.0-1.0")
    articles_count = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name

class Source(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class Topic(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class Article(models.Model):
    title = models.CharField(max_length=200)
    summary = models.TextField()
    source = models.ForeignKey(Source, on_delete=models.CASCADE)
    published_date = models.DateTimeField()
    positivity_score = models.FloatField(help_text="Positivity score 0.0-1.0")
    topics = models.ManyToManyField(Topic)
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='article_pictures/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class UserPost(models.Model):
    username = models.CharField(max_length=100)
    avatar = models.URLField(blank=True, null=True)
    date = models.DateTimeField()
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.URLField(blank=True, null=True)
    video = models.URLField(blank=True, null=True)
    likes = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    shares = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
