from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Class(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Classes"

    def __str__(self):
        return self.name


class Section(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Subject(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class StudentInfo(models.Model):
    GENDER_CHOICES = (
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    )

    name = models.CharField(max_length=255)
    dob = models.DateField()

    father = models.CharField(max_length=255)
    mother = models.CharField(max_length=255)

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES
    )

    mobile = models.CharField(max_length=20)

    email = models.EmailField(
        blank=True,
        null=True
    )

    remarks = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=2,
        default="A"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Admission(models.Model):
    student = models.ForeignKey(
        StudentInfo,
        on_delete=models.CASCADE,
        related_name="admissions"
    )

    admission_date = models.DateField()

    school_class = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name="admissions"
    )

    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="admissions"
    )

    added_on = models.DateTimeField(auto_now_add=True)

    added_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="student_admissions"
    )

    status = models.CharField(
        max_length=2,
        default="A"
    )

    def __str__(self):
        return f"{self.student.name} - {self.school_class.name}"


class StudentSubject(models.Model):
    student = models.ForeignKey(
        StudentInfo,
        on_delete=models.CASCADE,
        related_name="student_subjects"
    )

    school_class = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name="student_subjects"
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="student_subjects"
    )

    status = models.CharField(
        max_length=2,
        default="A"
    )

    class Meta:
        unique_together = ("student", "subject")

    def __str__(self):
        return f"{self.student.name} - {self.subject.name}"


class ResultGrade(models.Model):
    grade_name = models.CharField(max_length=100)

    grade_num = models.PositiveSmallIntegerField()

    percentage_from = models.PositiveSmallIntegerField()

    percentage_to = models.PositiveSmallIntegerField()

    status = models.CharField(
        max_length=2,
        default="A"
    )

    def __str__(self):
        return self.grade_name


class ExamName(models.Model):
    name = models.CharField(max_length=100)

    status = models.CharField(
        max_length=2,
        default="A"
    )

    def __str__(self):
        return self.name


class ResultMain(models.Model):
    student = models.ForeignKey(
        StudentInfo,
        on_delete=models.CASCADE,
        related_name="results"
    )

    school_class = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name="results"
    )

    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="results"
    )

    exam = models.ForeignKey(
        ExamName,
        on_delete=models.CASCADE,
        related_name="results"
    )

    total_number = models.PositiveSmallIntegerField()

    grade = models.ForeignKey(
        ResultGrade,
        on_delete=models.CASCADE,
        related_name="results"
    )

    remarks = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    exam_date = models.DateField()

    status = models.CharField(
        max_length=2,
        default="A"
    )

    def __str__(self):
        return f"{self.student.name} - {self.exam.name}"


class ResultDetails(models.Model):
    student = models.ForeignKey(
        StudentInfo,
        on_delete=models.CASCADE,
        related_name="result_details"
    )

    school_class = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        related_name="result_details"
    )

    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="result_details"
    )

    exam = models.ForeignKey(
        ExamName,
        on_delete=models.CASCADE,
        related_name="result_details"
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="result_details"
    )

    subject_number = models.PositiveSmallIntegerField()

    grade = models.ForeignKey(
        ResultGrade,
        on_delete=models.CASCADE,
        related_name="result_details"
    )

    status = models.CharField(
        max_length=2,
        default="A"
    )

    def __str__(self):
        return (
            f"{self.student.name} - "
            f"{self.subject.name} - "
            f"{self.subject_number}"
        )