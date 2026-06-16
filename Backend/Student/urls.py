from django.urls import include, path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'classes', views.ClassViewSet, basename='class')
router.register(r'sections', views.SectionViewSet, basename='section')
router.register(r'subjects', views.SubjectViewSet, basename='subject')
router.register(r'student-info', views.StudentInfoViewSet, basename='student-info')
router.register(r'students-combined', views.StudentWithAdmissionViewSet, basename='student-combined')
router.register(r'admissions', views.AdmissionViewSet, basename='admission')
router.register(r'student-subjects', views.StudentSubjectViewSet, basename='student-subject')
router.register(r'result-grades', views.ResultGradeViewSet, basename='result-grade')
router.register(r'exam-names', views.ExamNameViewSet, basename='exam-name')
router.register(r'result-main', views.ResultMainViewSet, basename='result-main')
router.register(r'result-details', views.ResultDetailsViewSet, basename='result-detail')

urlpatterns = [
    path('', include(router.urls)),
]