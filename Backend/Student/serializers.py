from rest_framework import serializers
from .models import (
    Class, Section, Subject, StudentInfo, Admission, StudentSubject,
    ResultGrade, ExamName, ResultMain, ResultDetails
)


# ──────────────── Setup Serializers ────────────────

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'


# ──────────────── Student Info Serializers ────────────────

class StudentInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentInfo
        fields = '__all__'


class AdmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admission
        fields = '__all__'


class StudentSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentSubject
        fields = '__all__'


# ──────────────── Combined: Student + Admission + Subjects ────────────────

class StudentWithAdmissionSerializer(serializers.ModelSerializer):
    """Return student info alongside admission details & subjects."""
    admission_id = serializers.SerializerMethodField()
    school_class = serializers.SerializerMethodField()
    class_name = serializers.SerializerMethodField()
    section = serializers.SerializerMethodField()
    section_name = serializers.SerializerMethodField()
    admission_date = serializers.SerializerMethodField()
    subjects = serializers.SerializerMethodField()

    class Meta:
        model = StudentInfo
        fields = '__all__'

    def get_admission_id(self, obj):
        admission = obj.admissions.first()
        return admission.id if admission else None

    def get_school_class(self, obj):
        admission = obj.admissions.first()
        return admission.school_class_id if admission else None

    def get_class_name(self, obj):
        admission = obj.admissions.first()
        return admission.school_class.name if admission and admission.school_class else ''

    def get_section(self, obj):
        admission = obj.admissions.first()
        return admission.section_id if admission else None

    def get_section_name(self, obj):
        admission = obj.admissions.first()
        return admission.section.name if admission and admission.section else ''

    def get_admission_date(self, obj):
        admission = obj.admissions.first()
        return str(admission.admission_date) if admission else None

    def get_subjects(self, obj):
        admission = obj.admissions.first()
        if not admission:
            return []
        student_subjects = StudentSubject.objects.filter(
            student=obj,
            school_class=admission.school_class
        ).select_related('subject')
        return [
            {
                'id': ss.id,
                'subject_id': ss.subject_id,
                'subject_name': ss.subject.name,
            }
            for ss in student_subjects
        ]


# ──────────────── Result Serializers ────────────────

class ResultGradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultGrade
        fields = '__all__'


class ExamNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamName
        fields = '__all__'


class ResultMainSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultMain
        fields = '__all__'


class ResultDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultDetails
        fields = '__all__'