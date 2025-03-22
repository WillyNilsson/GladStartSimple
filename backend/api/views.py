# backend/api/views.py
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Region, Source, Topic, Article, UserPost
from .serializers import (
    RegionSerializer, SourceSerializer, TopicSerializer, 
    ArticleSerializer, UserPostSerializer
)

class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

class SourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Source.objects.all()
    serializer_class = SourceSerializer

class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.all().order_by('-published_date')
    serializer_class = ArticleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['region__name', 'topics__name', 'source__name']
    search_fields = ['title', 'summary']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        min_score = self.request.query_params.get('min_score', None)
        
        if min_score is not None:
            try:
                min_score = float(min_score)
                queryset = queryset.filter(positivity_score__gte=min_score)
            except ValueError:
                pass
                
        return queryset
    
    def get_serializer_context(self):
        """Add request to serializer context for building absolute URLs."""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class UserPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserPost.objects.all().order_by('-date')
    serializer_class = UserPostSerializer