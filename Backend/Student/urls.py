from django.urls import include, path
from . import views
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'classes', views.ClassViewSet, basename='class')
router.register(r'sections', views.SectionViewSet, basename='section')

urlpatterns = [
    path('', include(router.urls)),
]