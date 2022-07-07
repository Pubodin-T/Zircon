// Your access token can be found at: https://cesium.com/ion/tokens.
      // This is the default access token from your ion account


      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZjhmYzkzOS1jNzI3LTQyZTQtYWJhYS00NGM0MDkxZjRkNmEiLCJpZCI6OTU5MTksImlhdCI6MTY1NDA1MjA1N30.zYK1AbmYJRYuMrU9-YayuYw8j96IEKkvpOmMjGsvr_8";

      // STEP 4 CODE (replaces steps 2 and 3)
      // Keep your `Cesium.Ion.defaultAccessToken = 'your_token_here'` line from before here.

      // Render Cesium Map
      $('#cesiumContainer2').hide(0);
      const viewer = new Cesium.Viewer("cesiumContainer", {
        terrainProvider: Cesium.createWorldTerrain(),
        geocoder: false,
        fullscreenButton: false,
        navigationHelpButton: false,
      });


      const viewer2 = new Cesium.Viewer("cesiumContainer2", {
        terrainProvider: Cesium.createWorldTerrain(),
        geocoder: false,
        fullscreenButton: false,
        navigationHelpButton: false,
        homeButton: false,
        infoBox: false,
        timeline: false,

      });

      //viewer.scene.globe.depthTestAgainstTerrain = true;
      viewer.scene.debugShowFramesPerSecond = true;
      // Pan Camera to Thailand by new Cesium.Rectangle(west, south, east, north)
      Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(63.076400,-31.700130,139.064604,52.234528);
      document.getElementById("animation_pathClock").style.display= "none";
      document.querySelector("#animation_pathWingButton.cesium-animation-buttonMain").style.display= "none";
      //Disable Columbus View
      document.querySelector("#cesiumContainer > div > div.cesium-viewer-toolbar > span.cesium-sceneModePicker-wrapper.cesium-toolbar-button > button:nth-child(4)").style.display = 'none';

      $(".cesium-baseLayerPicker-item").eq(3).css("display","none");
      $(".cesium-baseLayerPicker-item").eq(4).css("display","none");
      {% comment %} var credit = new Cesium.Credit(
        '<a href="https://www.facebook.com/" target="_blank"><img src="https://sv1.picz.in.th/images/2022/06/09/VWcK1R.png" style=" width:70px; height=40px; margin=200px; " title="Zircon"/> </a>'
      );


      //document.querySelector("#cesium-viewer-bottom").style.display= "none";
      viewer.scene.frameState.creditDisplay.addDefaultCredit(credit); {% endcomment %}
      {% comment %} $(document).ready(function() {
        $("#cesium-credit-textContainer").css({"display":"none"});
      }); {% endcomment %}

      // Edit Logo Here !!!

      $(".cesium-widget-credits").html('<div style="display: inline;"><a href="https://demo.gistda.or.th/news_view.php?n_id=2325&lang=EN" target="_blank"><img title="Zircon" src="{% static '/asset/zircon.png' %}" style=" width: 120px; height:80px " ></a></div>');

      // Animate of data ex.1s per lat long
      const dateset = "{{date}}"
      console.log({{totaldata}})
      var negative_uncertaintyZone  = 0;
      var entityPosition = [];
      const windowtime = 60 * 60; 
      const rocket = viewer.entities.add(new Cesium.Entity());
      const satellite = viewer2.entities.add(new Cesium.Entity());
      const uncertaintyZone = viewer.entities.add(new Cesium.Entity());
      const uncertaintyZone2 = viewer2.entities.add(new Cesium.Entity());
      let int = null;
      var flyDuration = 5 ;
      var clockMultipler = 1 ;
      var atStop = 0;
      var isLoaded1 = false;
      var isLoaded2 = false;
      var dataLoaded = false;
      var longitude = {{longitude}}
      var latitude = {{latitude}}
      const uncertaintyRange = 0.26
      let tr_lat = 0;
      let tr_long = 0;
      let bl_lat = 0;
      let bl_long = 0;
      var top_polygon = [];
      var buttom_polygon = [];


      // Regex Date and Format to ISO Format ex.2019-01-01T00:00:00.000Z
      let reTime = /\d{4}\-\d\d\-\d\dT\d\d:\d\d:\d\d\.\d*Z/gm;
      let resultTime = dateset.match(reTime);
      var jd = Array.from(resultTime, x => Cesium.JulianDate.fromIso8601(x))




  
      const timeStepInSeconds = 1;
      const totalSeconds = timeStepInSeconds * {{totaldata}};
      const start = jd[0];
      const stop = Cesium.JulianDate.addSeconds(
        start,
        totalSeconds,
        new Cesium.JulianDate()
      );

      const stopbar = Cesium.JulianDate.addSeconds(start, totalSeconds + 1800,new Cesium.JulianDate())
      // Cesium clock configuration
      viewer.clock.startTime = start.clone();
      viewer.clock.stopTime = stop.clone();
      viewer.clock.currentTime = start.clone();
      viewer.timeline.zoomTo(start, stopbar);
      viewer.clock.multiplier = clockMultipler;
      viewer.clock.shouldAnimate = true;

      // Cesium clock configuration 
      viewer2.clock.startTime = start.clone();
      viewer2.clock.stopTime = stop.clone();
      viewer2.clock.currentTime = start.clone();
      viewer2.clock.multiplier = clockMultipler;
      viewer2.clock.shouldAnimate = true;

      // The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
      const positionProperty = new Cesium.SampledPositionProperty();

      for (let i = 0; i < {{totaldata}}; i++) {
        console.log(i)
        entityPosition.push({
          lat : {{latitude}}[i],
          long : {{longitude}}[i],
          alt : {{height}}[i].toFixed(2),
          ti : jd[i],
          velocity : {{velocity}}[i]
        });
        
        tr_lat =  {{latitude}}[i]+uncertaintyRange
        tr_long =  {{longitude}}[i]+uncertaintyRange

        tl_lat =  {{latitude}}[i]+uncertaintyRange
        tl_long =  {{longitude}}[i]-uncertaintyRange

        bl_lat =  {{latitude}}[i]-uncertaintyRange
        bl_long =  {{longitude}}[i]-uncertaintyRange

        br_lat =  {{latitude}}[i]-uncertaintyRange
        br_long =  {{longitude}}[i]+uncertaintyRange
        
        if(tr_long > 180){
          tr_long = tr_long - 360
        }
        if(bl_long < -180){
          bl_long = bl_long + 360
        }
        if(tr_lat > 90){
          tr_lat = 180 - tr_lat
        }
        if(bl_lat < -90){
          bl_lat = (180*-1) - bl_lat
        }

        if(tl_long > 180){
          tl_long = tl_long - 360
        }
        if(br_long < -180){
          bl_long = bl_long + 360
        }
        if(tl_lat > 90){
          tl_lat = 180 - tl_lat
        }
        if(br_lat < -90){
          br_lat = (180*-1) - br_lat
        }

        if(i != {{totaldata}} - 1 && Cesium.JulianDate.secondsDifference(jd.at(-1),jd[i]) <= windowtime  && i%10 == 0 ){
          if(latitude[i+1] - latitude[i] > 0){
            top_polygon.push(tl_long,tl_lat)
            buttom_polygon.push(br_lat,br_long)
            //Draw corner point of Uncertainty zone
            {% comment %} viewer.entities.add({
              name : tl_long + "  " + String(tl_lat),
              position: Cesium.Cartesian3.fromDegrees(tl_long,tl_lat),
              point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
              },
            });
            viewer.entities.add({
              name : br_long + "  " + String(br_lat),
              position: Cesium.Cartesian3.fromDegrees(br_long,br_lat),
              point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
              },
            }); {% endcomment %}
          }
          else if(latitude[i+1] - latitude[i] < 0){
            top_polygon.push(tr_long,tr_lat)
            buttom_polygon.push(bl_lat,bl_long)

            //Draw corner point of Uncertainty zone
            {% comment %} viewer.entities.add({
              name : tr_long + "  " + String(tr_lat),
              position: Cesium.Cartesian3.fromDegrees(tr_long,tr_lat),
              point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                
              },
            });
            viewer.entities.add({
              name : bl_long + "  " + String(bl_lat),
              position: Cesium.Cartesian3.fromDegrees(bl_long,bl_lat),
              point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
              },
            }); {% endcomment %}
          }

        }

        

        // Declare the time for this individual sample and store it in a new JulianDate instance.
        const time = Cesium.JulianDate.addSeconds(
          start,
          i * timeStepInSeconds,
          new Cesium.JulianDate()
        );

        let position = Cesium.Cartesian3.fromDegrees(
          {{longitude}}[i],
          {{latitude}}[i],
          {{height}}[i]*1000
          );

        positionProperty.addSample(time, position);

      }
      console.log("Success")
      dataLoaded = true
      
      negative_uncertaintyZone = top_polygon.length/2

      // Positive_uncertaintyZone

      for (let i = 0; i < {{uct_lat}}.length; i++) {

        
        tr_lat =  {{uct_lat}}[i]+uncertaintyRange
        tr_long =  {{uct_lon}}[i]+uncertaintyRange

        tl_lat =  {{uct_lat}}[i]+uncertaintyRange
        tl_long =  {{uct_lon}}[i]-uncertaintyRange

        bl_lat =  {{uct_lat}}[i]-uncertaintyRange
        bl_long =  {{uct_lon}}[i]-uncertaintyRange

        br_lat =  {{uct_lat}}[i]-uncertaintyRange
        br_long =  {{uct_lon}}[i]+uncertaintyRange
        
        if(tr_long > 180){
          tr_long = tr_long - 360
        }
        if(bl_long < -180){
          bl_long = bl_long + 360
        }
        if(tr_lat > 90){
          tr_lat = 180 - tr_lat
        }
        if(bl_lat < -90){
          bl_lat = (180*-1) - bl_lat
        }

        if(tl_long > 180){
          tl_long = tl_long - 360
        }
        if(br_long < -180){
          bl_long = bl_long + 360
        }
        if(tl_lat > 90){
          tl_lat = 180 - tl_lat
        }
        if(br_lat < -90){
          br_lat = (180*-1) - br_lat
        }

        if(i != {{uct_lat}}.length - 1  && i%10 == 0 ){
          if({{uct_lat}}[i+1] - {{uct_lat}}[i] > 0){
            top_polygon.push(tl_long,tl_lat)
            buttom_polygon.push(br_lat,br_long)
            //Draw corner point of Uncertainty zone
            {% comment %} viewer.entities.add({
              name : tl_long + "  " + String(tl_lat),
              position: Cesium.Cartesian3.fromDegrees(tl_long,tl_lat),
              point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
              },
            });
            viewer.entities.add({
              name : br_long + "  " + String(br_lat),
              position: Cesium.Cartesian3.fromDegrees(br_long,br_lat),
              point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
              },
            }); {% endcomment %}
          }
          else if({{uct_lat}}[i+1] - {{uct_lat}}[i] < 0){
            top_polygon.push(tr_long,tr_lat)
            buttom_polygon.push(bl_lat,bl_long)

            //Draw corner point of Uncertainty zone
            {% comment %} viewer.entities.add({
              name : tr_long + "  " + String(tr_lat),
              position: Cesium.Cartesian3.fromDegrees(tr_long,tr_lat),
              point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                
              },
            });
            viewer.entities.add({
              name : bl_long + "  " + String(bl_lat),
              position: Cesium.Cartesian3.fromDegrees(bl_long,bl_lat),
              point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
              },
            }); {% endcomment %}
          }

        }


       
      }

      let r = buttom_polygon.reverse()
      var poly = top_polygon.concat(r)

      // Draw UncertaintyZone per 4 latlong
     for(let k = 0 ; k < top_polygon.length ; k+=2){
        let color = Cesium.Color.RED.withAlpha(0.4)
        if ((k/2)+1 >= negative_uncertaintyZone){
          color = Cesium.Color.YELLOW.withAlpha(0.4)
        }
        viewer.entities.add({
          parent : uncertaintyZone,
          name : "Zone : " + String((k/2)+1),
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([poly.at(k),poly.at(k+1),poly.at(k+2),poly.at(k+3),poly.at((-k)-4),poly.at((-k)-3),poly.at((-k)-2),poly.at((-k)-1)]),
            material: color,
            clampToGround : true,
          },
        });

        viewer2.entities.add({
          parent : uncertaintyZone2,
          name : "Zone : " + String((k/2)+1),
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([poly.at(k),poly.at(k+1),poly.at(k+2),poly.at(k+3),poly.at((-k)-4),poly.at((-k)-3),poly.at((-k)-2),poly.at((-k)-1)]),
            material: color,
            clampToGround : true,
          },
        });
      }
      


      async function loadModel() {
        // Load the glTF model from Cesium ion.
        const objectUri = await Cesium.IonResource.fromAssetId(1124763);
        const orientation = new Cesium.VelocityOrientationProperty(positionProperty)
        viewer.entities.add({
          parent : rocket ,
          id : "Rocket",
          availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({ start: start, stop: stop }),
          ]),
          position: positionProperty,
          // Attach the 3D model instead of the green point.
          model: { uri: objectUri , minimumPixelSize: 64,},
          // Automatically compute the orientation from the position.
          orientation: orientation,
          path: new Cesium.PathGraphics({
            width: 3  ,
            material: Cesium.Color.WHITE,
          }),
          name: "{{data.sat_name}} " + "   ( {{data.typeobj}} )",
          description:
            `<table class="cesium-infoBox-defaultTable"><tbody><tr><th>NORAD ID : </th> <th> {{data}}</th></tr>` +
            `<tr><th>Intldes : </th><th>{{data.intldes}}</th></tr>` +
            `<tr><th>Country : </th><th>{{data.country}}</th></tr>` +
            `<tr><th>Msg Epoch : </th><th>{{data.msg_epoch}}</th></tr>` +
            `<tr><th>Decay Epoch : </th><th>{{data.decay_epoch}}</th></tr>` +
            `<tr><th>Rcs : </th><th>{{data.rcs}}</th></tr>` +
            `<tr><th>Source : </th><th>{{data.source}}</th></tr>` +
            `</tbody></table>`,
          label: {
              text: "{{data.sat_name}}",
              font: '16pt monospace',
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 1,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -50)
          }
        });

        let preobjPosition = entityPosition.find((e) => parseInt(e.ti.secondsOfDay) === parseInt(viewer.clock.currentTime.secondsOfDay+flyDuration));
        viewer.camera.flyTo({
          duration : flyDuration,
          destination : Cesium.Cartesian3.fromDegrees(
            preobjPosition.long,
            preobjPosition.lat,
            (parseInt(preobjPosition.alt)*1000)+100000,
          ),
          complete : function(){viewer.trackedEntity = rocket._children[0]; viewer.selectedEntity = rocket._children[0] ; setTimeout(function() {viewer.camera.zoomOut(10)}, 400); }
        })
        isLoaded1 = true ;
        console.log("Load Model 1")
      }

      async function loadModel2() {
        // Load the glTF model from Cesium ion.
        const orientation2 = new Cesium.VelocityOrientationProperty(positionProperty)
        const objectUri2 = await Cesium.IonResource.fromAssetId(1111699);
        viewer2.entities.add({
          availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({ start: start, stop: stop }),
          ]),
          parent : satellite,
          model: { uri: objectUri2 , minimumPixelSize: 64,},
          position: positionProperty,
          // Attach the 3D model instead of the green point.
          // Automatically compute the orientation from the position.
          orientation: orientation2,
          path: new Cesium.PathGraphics({
            width: 3  ,
            material: Cesium.Color.ORANGE,
          }),
          name: "{{data.sat_name}} " + "  ( {{data.typeobj}} )",
          label: {
              text: "{{data.sat_name}}",
              font: '16pt monospace',
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 1,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -50)
          }
        });
        isLoaded2 = true
        console.log("Load Model 2")
      }

      loadModel();
      loadModel2().then(function(){ int = setInterval(display, 50); display();});
      

      function map(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
      }



      let t = 0;
      function myFunction() {
        console.log("Test" + t)
        
        console.log(resultTime[0])


        
      }





        

      function showFPS() {
        viewer.scene.debugShowFramesPerSecond = !viewer.scene.debugShowFramesPerSecond;
      }

      var isTracked = true;
      let searchObj = null;
      let green = 0;
      let red = 0;

      function display() {
        //console.log((e) => parseInt(e.ti.secondsOfDay) === parseInt(viewer.clock.currentTime.secondsOfDay))
        searchObj = entityPosition.find((e) => parseInt(e.ti.secondsOfDay) === parseInt(viewer.clock.currentTime.secondsOfDay) && e.ti.dayNumber === viewer.clock.currentTime.dayNumber);
        if(Cesium.JulianDate.greaterThan(viewer.clock.currentTime, entityPosition.at(-1).ti)){
          $(".display-status").text("( Object Dropped )")
          $(".display-height").text("0 km.")
          $(".display-lat").text(entityPosition.at(-1).lat)
          $(".display-long").text(entityPosition.at(-1).long)
          $(".display-velocity").text("0 km/s")
        }
        else if (searchObj !== undefined){
          $(".display-status").text("")
          $(".display-height").text( searchObj.alt + " km.")
          $(".display-lat").text( searchObj.lat.toFixed(6))
          $(".display-long").text( searchObj.long.toFixed(6))
          $(".display-velocity").text( searchObj.velocity.toFixed(2) + " km/s")
          let altitude = parseInt(searchObj.alt);
          if(altitude > 200){
            // Green Zone !!!
            green = 255;
            red = 0;
          }
          else if(altitude <= 200 && altitude>= 160){
            // Yellow Zone !!!
            red = map(altitude,160,200,255,0);
            green = 255 ;

          }
          else if(altitude <= 159 && altitude>= 120){
            // Orange Zone !!!
            green = map(altitude,120,159,0,255);
            red = 255;
          }
          else{
            // RED Zone !!!
            green = 0;
            red = 255;
          }
        }
        //console.log(searchObj)


        const date = new Date(viewer.clock.currentTime)
        //const dateformat = date.toLocaleString('en-US',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' ,timezone: 'UTC',  })
        const dateformat = date.toLocaleString('en-GB',{ hour12: false ,timeZone: 'UTC',  })
        $(".display-time").text(dateformat)
        if(isLoaded1 == true && isLoaded2 == true && dataLoaded == true){
          rocket._children[0].path.material.color._value = Cesium.Color.fromBytes(red,green,0)
          satellite._children[0].path.material.color._value = Cesium.Color.fromBytes(red,green,0)
          //$(".content").css("display", "block")
          //$("#universe").css("display", "none")
        }
        
        viewer2.clock.currentTime = viewer.clock.currentTime

      };  

      function trackedEntity() {
        clockMultipler = viewer.clock.multiplier
        let preobjPosition = entityPosition.find((e) => parseInt(e.ti.secondsOfDay) === parseInt(viewer.clock.currentTime.secondsOfDay+(flyDuration*clockMultipler)));
        if (isTracked === true) {
          viewer.trackedEntity = undefined
          viewer.selectedEntity = undefined
          viewer.camera.flyHome(2)
          isTracked = false
        }
        else if (isTracked === false && preobjPosition != undefined && atStop.secondsOfDay != viewer.clock.currentTime.secondsOfDay){
          viewer.camera.flyTo({
            duration : flyDuration,
            destination : Cesium.Cartesian3.fromDegrees(
              preobjPosition.long,
              preobjPosition.lat,
              (parseInt(preobjPosition.alt)*1000)+100000,
            ),
            complete : function(){viewer.trackedEntity = rocket._children[0]; viewer.selectedEntity = rocket._children[0] ; setTimeout(function() {viewer.camera.zoomOut(10)}, 400); }
          })
          isTracked = true
        }
        else if (atStop.secondsOfDay == viewer.clock.currentTime.secondsOfDay){
          preobjPosition = entityPosition.find((e) => parseInt(e.ti.secondsOfDay) === parseInt(viewer.clock.currentTime.secondsOfDay));
          viewer.camera.flyTo({
            duration : flyDuration,
            destination : Cesium.Cartesian3.fromDegrees(
              preobjPosition.long,
              preobjPosition.lat,
              (parseInt(preobjPosition.alt)*1000)+100000,
            ),
            complete : function(){viewer.trackedEntity = rocket._children[0]; viewer.selectedEntity = rocket._children[0] ; setTimeout(function() {viewer.camera.zoomOut(10)}, 400); }
          })
          isTracked = true
        }
        else{
          viewer.camera.flyTo({
            duration : flyDuration,
            destination : Cesium.Cartesian3.fromDegrees(
              entityPosition.at(-1).long,
              entityPosition.at(-1).lat,
              (parseInt(entityPosition.at(-1).alt)*1000)+100000,
            ),
            complete : function(){viewer.trackedEntity = rocket._children[0]; viewer.selectedEntity = rocket._children[0] ; setTimeout(function() {viewer.camera.zoomOut(50)}, 400); }
          })
          isTracked = true
        }
      }

      // Jquery Zone 

      $('#show-earth2').click(function() {
        $('#cesiumContainer2').animate({width: 'toggle', opacity: '0.6'},"slow");
        $('#cesiumContainer2').animate({opacity: '1'});
      })

      $('#show-uncertaintyZone').click(function() {
        uncertaintyZone.show = !uncertaintyZone.show;
        uncertaintyZone2.show = !uncertaintyZone2.show;
      })

      $('g.cesium-animation-rectButton').click(function() {
        console.log("Pause");
        atStop = viewer.clock.currentTime
        console.log(atStop);
      })

      $("button.cesium-button.cesium-toolbar-button.cesium-home-button").click(function() {
        if($('#track-entity').is(':checked') == true){
          $("#track-entity").prop('checked', !$('#track-entity').is(':checked'))
          viewer.trackedEntity = undefined
          viewer.selectedEntity = undefined
          isTracked = false
        }
        
      });
      let isToggle = false
      $('#menu__toggle').click(function() {
        if(isToggle == false){
          $('#back-buttom').animate({left: '240px'},"fast");
        }
        else{
          $('#back-buttom').animate({left: '60px'},"fast");
        }
        isToggle = !isToggle
      });

      //$('#cesiumContainer2.cesium-viewer-animationContainer').css({"display" : "none"})
      document.querySelector("#cesiumContainer2 > div > div.cesium-viewer-animationContainer").style.display = 'none';
      document.querySelector("#cesiumContainer2 > div > div.cesium-viewer-bottom").style.display = 'none';




      let worldPosition;
      let distance;

      function syncView() {
        // The center of the view is the point that the 3D camera is focusing on
        const viewCenter = new Cesium.Cartesian2(
          Math.floor(viewer.canvas.clientWidth / 2),
          Math.floor(viewer.canvas.clientHeight / 2)
        );
        //console.log(viewCenter)
        // Given the pixel in the center, get the world position
        const newWorldPosition = viewer.scene.camera.pickEllipsoid(
          viewCenter
        );
        //console.log(newWorldPosition)
        if (Cesium.defined(newWorldPosition)) {
          // Guard against the case where the center of the screen
          // does not fall on a position on the globe
          worldPosition = newWorldPosition;
        }
        // Get the distance between the world position of the point the camera is focusing on, and the camera's world position
        distance = Cesium.Cartesian3.distance(
          worldPosition,
          viewer.scene.camera.positionWC
        );

        //console.log(distance)
        // Tell the 2D camera to look at the point of focus. The distance controls how zoomed in the 2D view is
        // (try replacing `distance` in the line below with `1e7`. The view will still sync, but will have a constant zoom)
        viewer2.scene.camera.lookAt(
          worldPosition,
          new Cesium.Cartesian3(0.0, 0.0, distance+13000000)
        );
      }

      // Apply our sync function every time the 3D camera view changes
      viewer.camera.changed.addEventListener(syncView);
      // By default, the `camera.changed` event will trigger when the camera has changed by 50%
      // To make it more sensitive, we can bring down this sensitivity
      viewer.camera.percentageChanged = 0.0001;

      // Since the 2D view follows the 3D view, we disable any
      // camera movement on the 2D view
      viewer2.scene.screenSpaceCameraController.enableRotate = false;
      viewer2.scene.screenSpaceCameraController.enableTranslate = false;
      viewer2.scene.screenSpaceCameraController.enableZoom = false;
      viewer2.scene.screenSpaceCameraController.enableTilt = false;
      viewer2.scene.screenSpaceCameraController.enableLook = false;
      // Add Image
      {% comment %} const layers = viewer.scene.imageryLayers.addImageryProvider(
        new Cesium.SingleTileImageryProvider({
          url: "../static/asset/drop.png",
          rectangle: Cesium.Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75),
        }));  {% endcomment %}
      

      var entity = viewer.entities.add({
        label: {
          showBackground: true,
          font: "14px monospace",
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(15, 0),
        },
      });
      entity.show = false

      function showLatLong() {
        let scene = viewer.scene;
        if (!scene.pickPositionSupported) {
          window.alert("This browser does not support pickPosition.");
        }
 
        // Mouse over the globe to see the cartographic position
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (movement) {
          let cartesian = viewer.camera.pickEllipsoid(
            movement.endPosition,
            viewer.scene.globe.ellipsoid
          );
          if (cartesian) {
            let cartographic = Cesium.Cartographic.fromCartesian(
              cartesian
            );
            let longitudeString = Cesium.Math.toDegrees(
              cartographic.longitude
            ).toFixed(4);
            let latitudeString = Cesium.Math.toDegrees(
              cartographic.latitude
            ).toFixed(4);
            entity.label.show = true;
            entity.position = cartesian;
            entity.label.text =
              `Long: ${longitudeString}\u00B0` +
              `\nLat : ${latitudeString}\u00B0`;
          } else {
            entity.label.show = false;
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        entity.show = !entity.show;
      }

      let markpoint = [];

      function findDistance() {
        console.log("Distance Measure")
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);//This method gets the latitude and longitude of the mouse click position
        handler.setInputAction(function (e) {
        let position = viewer.scene.pickPosition(e.position);
        //Convert Cartesian coordinates to latitude and longitude coordinates
        let cartographic = Cesium.Cartographic.fromCartesian(position);
        let get_longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let get_latitude = Cesium.Math.toDegrees(cartographic.latitude);
        let get_height = cartographic.height;
        console.log("Longitude : " + get_longitude + "  Latitude : " + get_latitude)
        if(markpoint.length != 2){
          markpoint.push(get_longitude,get_latitude)
        }
        else{
          markpoint.push(get_longitude,get_latitude)
          // Distance Formula
          let R = 6371e3; // metres
          let φ1 = markpoint[1] * Math.PI/180; // φ, λ in radians << Degree to radians
          let φ2 = markpoint[3] * Math.PI/180;
          let Δφ = (markpoint[3]-markpoint[1]) * Math.PI/180;
          let Δλ = (markpoint[2]-markpoint[0]) * Math.PI/180;
          let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
          let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          let d = R * c; // in metres
          console.log("Distance : "+ (d/1000).toFixed(3) + " km")
          markpoint = []
        }

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        
        

      }