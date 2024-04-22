from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import uuid


# Create your models here.

class AccountManager(BaseUserManager):
    def create_user(self, email, name, hpnum, password=None):
        if not email:
            raise ValueError('User needs an email')

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            hpnum=hpnum,

        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password, hpnum='None'):
        user = self.create_user(
            email=email,
            name=name,
            hpnum=hpnum,
            password=password
        )

        user.is_staff = True
        user.is_superuser = True
        user.is_admin = True
        user.save(using=self._db)
        return user


class Account(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    name = models.CharField(max_length=30)
    hpnum = models.CharField(blank=True)
    img = models.TextField(default='')
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)  #auto_now_add adds it once
    last_login = models.DateTimeField(verbose_name='last login', auto_now=True)  #auto_now adds and modifies everytime
    is_active = models.BooleanField(default=True)  # required for AbstractBaseUser
    is_staff = models.BooleanField(default=False)  # required for AbstractBaseUser
    is_admin = models.BooleanField(default=False)  # required for AbstractBaseUser
    is_superuser = models.BooleanField(default=False)  # required for AbstractBaseUser

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f"{self.id} - {self.name} ({self.email}) ({self.hpnum})"

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True


