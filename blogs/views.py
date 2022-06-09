from django.shortcuts import render
from .models import Drop_sim
# Create your views here.
def drop_sim(request):
    data = Drop_sim.objects.all()
    print("Here")
    return render(request, "drop.html",{'data':data})
