from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegionViewSet, SourceViewSet, TopicViewSet, 
    ArticleViewSet, UserPostViewSet
)

router = DefaultRouter()
router.register(r'regions', RegionViewSet)
router.register(r'sources', SourceViewSet)
router.register(r'topics', TopicViewSet)
router.register(r'articles', ArticleViewSet)
router.register(r'posts', UserPostViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
