from django.shortcuts import render
from .models import (
    Class, Section, Subject, StudentInfo, Admission, StudentSubject,
    ResultGrade, ExamName, ResultMain, ResultDetails
)
from .serializers import (
    ClassSerializer, SectionSerializer, SubjectSerializer,
    StudentInfoSerializer, StudentWithAdmissionSerializer,
    AdmissionSerializer, StudentSubjectSerializer,
    ResultGradeSerializer, ExamNameSerializer, ResultMainSerializer,
    ResultDetailsSerializer
)
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .paginations import MyPageNumberPagination
from drf_spectacular.utils import extend_schema

# Create your views here.

@extend_schema(tags=['Student Management'])
class ClassViewSet(ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['name']
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
    pagination_class = MyPageNumberPagination


@extend_schema(tags=['Student Management'])
class SectionViewSet(ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['name']
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
    pagination_class = MyPageNumberPagination


@extend_schema(tags=['Student Management'])
class SubjectViewSet(ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['name']
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
    pagination_class = MyPageNumberPagination


@extend_schema(tags=['Student Management'])
class StudentInfoViewSet(ModelViewSet):
    queryset = StudentInfo.objects.all()
    serializer_class = StudentInfoSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['name', 'gender', 'status']
    search_fields = ['name', 'mobile', 'email', 'father', 'mother']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
    pagination_class = MyPageNumberPagination

@extend_schema(tags=['Student Management'])
class StudentWithAdmissionViewSet(ModelViewSet):
    queryset = StudentInfo.objects.prefetch_related(
        'admissions__school_class', 'admissions__section', 'student_subjects__subject'
    ).all()
    serializer_class = StudentWithAdmissionSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['name', 'gender', 'status']
    search_fields = ['name', 'mobile', 'email', 'father', 'mother']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
    pagination_class = MyPageNumberPagination


@extend_schema(tags=['Student Management'])
class AdmissionViewSet(ModelViewSet):
    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'school_class', 'section']
    search_fields = ['student__name']
    ordering_fields = ['admission_date', 'added_on']
    ordering = ['-added_on']
    pagination_class = MyPageNumberPagination


@extend_schema(tags=['Student Management'])
class StudentSubjectViewSet(ModelViewSet):
    queryset = StudentSubject.objects.all()
    serializer_class = StudentSubjectSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'school_class', 'subject', 'student']
    search_fields = ['student__name', 'subject__name']
    ordering_fields = ['student', 'subject']
    pagination_class = MyPageNumberPagination


@extend_schema(tags=['Student Management'])
class ResultGradeViewSet(ModelViewSet):
    queryset = ResultGrade.objects.all()
    serializer_class = ResultGradeSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['grade_name']
    ordering_fields = ['grade_num', 'grade_name']
    ordering = ['grade_num']
    pagination_class = MyPageNumberPagination


@extend_schema(tags=['Student Management'])
class ExamNameViewSet(ModelViewSet):
    queryset = ExamName.objects.all()
    serializer_class = ExamNameSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['name']
    ordering_fields = ['name']
    pagination_class = MyPageNumberPagination


@extend_schema(tags=['Student Management'])
class ResultMainViewSet(ModelViewSet):
    queryset = ResultMain.objects.all()
    serializer_class = ResultMainSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'school_class', 'section', 'exam']
    search_fields = ['student__name']
    ordering_fields = ['exam_date', 'total_number']
    ordering = ['-exam_date']
    pagination_class = MyPageNumberPagination


@extend_schema(tags=['Student Management'])
class ResultDetailsViewSet(ModelViewSet):
    queryset = ResultDetails.objects.all()
    serializer_class = ResultDetailsSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'school_class', 'section', 'exam', 'subject']
    search_fields = ['student__name', 'subject__name']
    ordering_fields = ['subject_number']
    pagination_class = MyPageNumberPagination