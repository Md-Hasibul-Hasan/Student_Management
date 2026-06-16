from django.contrib import admin
from .models import (
    Class, Section, Subject, StudentInfo, Admission, StudentSubject,
    ResultGrade, ExamName, ResultMain, ResultDetails
)

# ──────────────── Setup Models ────────────────

@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at', 'updated_at')
    search_fields = ('name',)
    ordering = ('-created_at',)

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at', 'updated_at')
    search_fields = ('name',)
    ordering = ('-created_at',)

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at', 'updated_at')
    search_fields = ('name',)
    ordering = ('-created_at',)

# ──────────────── Student Info ────────────────

@admin.register(StudentInfo)
class StudentInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'gender', 'mobile', 'email', 'status', 'created_at')
    search_fields = ('name', 'mobile', 'email', 'father', 'mother')
    list_filter = ('gender', 'status')
    ordering = ('-created_at',)

@admin.register(Admission)
class AdmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'school_class', 'section', 'admission_date', 'status', 'added_on')
    search_fields = ('student__name',)
    list_filter = ('status',)
    ordering = ('-added_on',)

@admin.register(StudentSubject)
class StudentSubjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'school_class', 'subject', 'status')
    search_fields = ('student__name', 'subject__name')
    list_filter = ('status',)

# ──────────────── Result ────────────────

@admin.register(ResultGrade)
class ResultGradeAdmin(admin.ModelAdmin):
    list_display = ('id', 'grade_name', 'grade_num', 'percentage_from', 'percentage_to', 'status')
    list_filter = ('status',)
    ordering = ('grade_num',)

@admin.register(ExamName)
class ExamNameAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'status')
    search_fields = ('name',)
    list_filter = ('status',)

@admin.register(ResultMain)
class ResultMainAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'school_class', 'section', 'exam', 'total_number', 'grade', 'exam_date', 'status')
    search_fields = ('student__name',)
    list_filter = ('status',)
    ordering = ('-exam_date',)

@admin.register(ResultDetails)
class ResultDetailsAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'school_class', 'section', 'exam', 'subject', 'subject_number', 'grade', 'status')
    search_fields = ('student__name', 'subject__name')
    list_filter = ('status',)