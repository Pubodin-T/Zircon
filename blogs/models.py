import jsonfield
from django.db import models

# Create your models here.

# Must (pip install django-jsonfield) to add JSON field
class Drop_sim(models.Model):
    norad_id = models.IntegerField(primary_key=True)
    sat_name = models.TextField()
    intldes = models.TextField()
    country = models.TextField()
    msg_epoch = models.DateTimeField()
    decay_epoch = models.DateTimeField()
    rcs = models.TextField()
    source = models.TextField()
    typeobj = models.TextField() 
    dataset = models.TextField() 
    
    def __str__(self):
        return str(self.norad_id)
    