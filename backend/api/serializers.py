from rest_framework import serializers
from .models import Region, Source, Topic, Article, UserPost

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'name', 'positivity', 'articles_count']

class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ['id', 'name']

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name']

# backend/api/serializers.py
from rest_framework import serializers
from .models import Region, Source, Topic, Article, UserPost

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'name', 'positivity', 'articles_count']

class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ['id', 'name']

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name']

class ArticleSerializer(serializers.ModelSerializer):
    source = SourceSerializer(read_only=True)
    topics = TopicSerializer(many=True, read_only=True)
    region = RegionSerializer(read_only=True)
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'summary', 'source', 'published_date', 
            'positivity_score', 'topics', 'region', 'image', 'image_url', 
            'url', 'created_at'
        ]
    
    def get_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class UserPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPost
        fields = [
            'id', 'username', 'avatar', 'date', 'title',
            'content', 'image', 'video', 'likes', 'comments', 
            'shares', 'created_at'
        ]
