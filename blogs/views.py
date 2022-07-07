from django.shortcuts import render
from .models import Drop_sim
import re
import math
# Create your views here.




def drop_sim(request):
    #data = Drop_sim.objects.all()
    norad_id = 51689
    data = Drop_sim.objects.get(norad_id=norad_id)
    
    # formatDate = data.msg_epoch.strftime("%Y-%m-%d %H:%M:%S")
    # print(formatDate)
    return render(request, "drop.html",{'data':data})

def index(request):
    return render(request, "index.html")

def match(request, objid=None):
    # then do whatever you want with your params
    norad_id = objid
    data = Drop_sim.objects.get(norad_id=norad_id)
    print("Request ObjectID : " + str(objid))
    # regex = "[\-| ][0-9]+\.[0-9]+"
    # reTime = "\d{4}\/\d\d\/\d\d\s\d\d:\d\d:\d\d\.\d*"
    # r = re.findall(regex, data.dataset)
    # rt = re.findall(reTime, data.dataset)
    line_split = data.dataset.split('\r\n')
    index = 0
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

    print("Success Request")
    return render(request, "drop.html",{'totaldata':len(date),'data':data ,'date':date , 'velocity':velocity ,'height':height , 'latitude':latitude , 'longitude':longitude , 'uct_lon':uct_lon, 'uct_lat':uct_lat, 'uct_alt':uct_alt })