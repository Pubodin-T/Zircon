from django.shortcuts import render
from .models import Drop_sim
# Create your views here.
def drop_sim(request):
    #data = Drop_sim.objects.all()
    norad_id = 753915
    data = Drop_sim.objects.get(norad_id=norad_id)
    
    # formatDate = data.msg_epoch.strftime("%Y-%m-%d %H:%M:%S")
    # print(formatDate)
    return render(request, "drop.html",{'data':data})
