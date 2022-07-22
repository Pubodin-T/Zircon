from django.shortcuts import render
from .models import Drop_sim
from datetime import datetime
import re
import math
# Create your views here.


def index(request):
    # Order by Decay Epoch Date
    reentry_dates = []
    datas = Drop_sim.objects.all().order_by('-decay_epoch')
    for data in datas:
        line_split = data.dataset.split('\r\n')
        reentry_date = line_split[-1].split(" ")[0]
        reentry_time = line_split[-1].split(" ")[1]
        x = datetime(int(reentry_date.split("/")[0]), int(reentry_date.split("/")[1]), int(reentry_date.split("/")[2]),int(reentry_time.split(":")[0]),int(reentry_time.split(":")[1]),int(reentry_time.split(":")[2][:2]))
        reentry_dates.append(x.strftime("%d %b %Y , %H:%M:%S UTC"))
    context = {
        'zip_datas': zip(datas, reentry_dates),
    }
    return render(request, "index.html",context)

def match(request, objid=None):
    # then do whatever you want with your params
    reentry_dates = []
    datas = Drop_sim.objects.all().order_by('-decay_epoch')
    for data in datas:
        line_split = data.dataset.split('\r\n')
        reentry_date = line_split[-1].split(" ")[0]
        reentry_time = line_split[-1].split(" ")[1]
        x = datetime(int(reentry_date.split("/")[0]), int(reentry_date.split("/")[1]), int(reentry_date.split("/")[2]),int(reentry_time.split(":")[0]),int(reentry_time.split(":")[1]),int(reentry_time.split(":")[2][:2]))
        reentry_dates.append(x.strftime("%d %b %Y , %H:%M:%S UTC"))





    norad_id = objid
    data = Drop_sim.objects.get(norad_id=norad_id)
    print("Request ObjectID : " + str(objid))
    line_split = data.dataset.split('\r\n')
    date = []
    velocity = []
    latitude = []
    longitude = []
    height = []
    uncertainty = data.uncertainty.split('\r\n')
    uct_lat = []
    uct_lon = []
    uct_alt = []


    for i in line_split:
        #print(i.split(','))
        splited = i.split(',')
        if len(splited) >= 9 :
            if float(splited[7]) >= 0 :
                date.append(splited[0].replace('/', '-').replace(' ', 'T') + "Z")
                velocity.append(math.sqrt(pow(float(splited[4]), 2)+ pow(float(splited[5]), 2)+ pow(float(splited[6]), 2)))
                height.append(float(splited[7]))
                latitude.append(float(splited[8]))
                longitude.append(float(splited[9]))

    for k in uncertainty:
        splited = k.split(',')
        if len(splited) >= 9 :
            #date.append(splited[0].replace(' ', 'T') + "Z")
            uct_alt.append(0)
            uct_lat.append(float(splited[8]))
            uct_lon.append(float(splited[9]))
    
    context = {
        'zip_datas': zip(datas, reentry_dates),
        'totaldata':len(date),
        'data':data ,
        'date':date , 
        'velocity':velocity ,
        'height':height , 
        'latitude':latitude , 
        'longitude':longitude , 
        'uct_lon':uct_lon, 
        'uct_lat':uct_lat, 
        'uct_alt':uct_alt 
    }
    print("Success Request")
    return render(request, "drop.html",context)