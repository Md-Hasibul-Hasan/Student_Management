from django.shortcuts import render
from .models import Class, Section
from .serializers import ClassSerializer, SectionSerializer
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .paginations import MyPageNumberPagination, MyLimitOffsetPagination, MyCursorPagination
from drf_spectacular.utils import extend_schema

# Create your views here.

@extend_schema(tags=['Student Management'])
class ClassViewSet(ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

    filter_backends = [DjangoFilterBackend,SearchFilter,OrderingFilter,]
    filterset_fields = ['name',]
    search_fields = ['name', ]
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
    pagination_class = MyPageNumberPagination


@extend_schema(tags=['Student Management'])
class SectionViewSet(ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

    filter_backends = [DjangoFilterBackend,SearchFilter,OrderingFilter,]
    filterset_fields = ['name', ]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
    pagination_class = MyPageNumberPagination


