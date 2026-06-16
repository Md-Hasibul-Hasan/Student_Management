import django_filters
from .models import (
    Class, Section, Subject, StudentInfo, Admission, StudentSubject,
    ResultGrade, ExamName, ResultMain, ResultDetails
)


class ClassFilter(django_filters.FilterSet):
    class Meta:
        model = Class
        fields = {
            'name': ['exact', 'icontains'],
        }


class SectionFilter(django_filters.FilterSet):
    school_class = django_filters.ModelChoiceFilter(
        queryset=Class.objects.all(),
        label='Class',
    )

    class Meta:
        model = Section
        fields = {
            'name': ['exact', 'icontains'],
            'school_class': ['exact'],
        }


class SubjectFilter(django_filters.FilterSet):
    school_class = django_filters.ModelChoiceFilter(
        queryset=Class.objects.all(),
        label='Class',
    )

    class Meta:
        model = Subject
        fields = {
            'name': ['exact', 'icontains'],
            'school_class': ['exact'],
        }


GENDER_CHOICES_FILTER = [
    ('Male', 'Male'),
    ('Female', 'Female'),
    ('Other', 'Other'),
]

STATUS_CHOICES_FILTER = [
    ('A', 'Active'),
    ('I', 'Inactive'),
]


class StudentInfoFilter(django_filters.FilterSet):
    gender = django_filters.ChoiceFilter(choices=GENDER_CHOICES_FILTER)
    status = django_filters.ChoiceFilter(choices=STATUS_CHOICES_FILTER)

    class Meta:
        model = StudentInfo
        fields = {
            'name': ['exact', 'icontains'],
            'gender': ['exact'],
            'status': ['exact'],
        }


class StudentWithAdmissionFilter(django_filters.FilterSet):
    school_class = django_filters.ModelChoiceFilter(
        field_name="admissions__school_class",
        queryset=Class.objects.all(),
        label="Class",
    )
    gender = django_filters.ChoiceFilter(choices=GENDER_CHOICES_FILTER)
    status = django_filters.ChoiceFilter(choices=STATUS_CHOICES_FILTER)

    class Meta:
        model = StudentInfo
        fields = {
            'name': ['exact', 'icontains'],
            'gender': ['exact'],
            'status': ['exact'],
        }


class AdmissionFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=STATUS_CHOICES_FILTER)
    school_class = django_filters.ModelChoiceFilter(
        queryset=Class.objects.all(),
        label='Class',
    )
    section = django_filters.ModelChoiceFilter(
        queryset=Section.objects.all(),
        label='Section',
    )

    class Meta:
        model = Admission
        fields = {
            'status': ['exact'],
            'school_class': ['exact'],
            'section': ['exact'],
        }


class StudentSubjectFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=STATUS_CHOICES_FILTER)
    school_class = django_filters.ModelChoiceFilter(
        queryset=Class.objects.all(),
        label='Class',
    )
    subject = django_filters.ModelChoiceFilter(
        queryset=Subject.objects.all(),
        label='Subject',
    )
    student = django_filters.ModelChoiceFilter(
        queryset=StudentInfo.objects.all(),
        label='Student',
    )

    class Meta:
        model = StudentSubject
        fields = {
            'status': ['exact'],
            'school_class': ['exact'],
            'subject': ['exact'],
            'student': ['exact'],
        }


class ResultGradeFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=STATUS_CHOICES_FILTER)

    class Meta:
        model = ResultGrade
        fields = {
            'status': ['exact'],
            'grade_name': ['exact', 'icontains'],
        }


class ExamNameFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=STATUS_CHOICES_FILTER)

    class Meta:
        model = ExamName
        fields = {
            'status': ['exact'],
            'name': ['exact', 'icontains'],
        }


class ResultMainFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=STATUS_CHOICES_FILTER)
    school_class = django_filters.ModelChoiceFilter(
        queryset=Class.objects.all(),
        label='Class',
    )
    section = django_filters.ModelChoiceFilter(
        queryset=Section.objects.all(),
        label='Section',
    )
    exam = django_filters.ModelChoiceFilter(
        queryset=ExamName.objects.all(),
        label='Exam',
    )

    class Meta:
        model = ResultMain
        fields = {
            'status': ['exact'],
            'school_class': ['exact'],
            'section': ['exact'],
            'exam': ['exact'],
        }


class ResultDetailsFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=STATUS_CHOICES_FILTER)
    school_class = django_filters.ModelChoiceFilter(
        queryset=Class.objects.all(),
        label='Class',
    )
    section = django_filters.ModelChoiceFilter(
        queryset=Section.objects.all(),
        label='Section',
    )
    exam = django_filters.ModelChoiceFilter(
        queryset=ExamName.objects.all(),
        label='Exam',
    )
    subject = django_filters.ModelChoiceFilter(
        queryset=Subject.objects.all(),
        label='Subject',
    )

    class Meta:
        model = ResultDetails
        fields = {
            'status': ['exact'],
            'school_class': ['exact'],
            'section': ['exact'],
            'exam': ['exact'],
            'subject': ['exact'],
        }