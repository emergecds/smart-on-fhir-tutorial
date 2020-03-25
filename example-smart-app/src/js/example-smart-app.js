(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart)  {
      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
        var obv = smart.patient.api.fetchAll({
                    type: 'Observation',
                    query: {
                      code: {
                        $or: ['http://loinc.org|8302-2', 'http://loinc.org|8462-4',
                              'http://loinc.org|8480-6', 'http://loinc.org|2085-9',
                              'http://loinc.org|2089-1', 'http://loinc.org|55284-4']
                      }
                    }
                  });

        $.when(pt, obv).fail(onError);

        $.when(pt, obv).done(function(patient, obv) {
          // var byCodes = smart.byCodes(obv, 'code');
          // var gender = patient.gender;
          //
          // var fname = '';
          // var lname = '';
          //
          // if (typeof patient.name[0] !== 'undefined') {
          //   fname = patient.name[0].given.join(' ');
          //   lname = patient.name[0].family.join(' ');
          // }
          //
          // var height = byCodes('8302-2');
          // var systolicbp = getBloodPressureValue(byCodes('55284-4'),'8480-6');
          // var diastolicbp = getBloodPressureValue(byCodes('55284-4'),'8462-4');
          // var hdl = byCodes('2085-9');
          // var ldl = byCodes('2089-1');
          //
          // var p = defaultPatient();
          // p.id = patient.id;
          // p.birthdate = patient.birthDate;
          // p.gender = gender;
          // p.fname = fname;
          // p.lname = lname;
          // p.height = getQuantityValueAndUnit(height[0]);
          //
          // if (typeof systolicbp != 'undefined')  {
          //   p.systolicbp = systolicbp;
          // }
          //
          // if (typeof diastolicbp != 'undefined') {
          //   p.diastolicbp = diastolicbp;
          // }
          //
          // p.hdl = getQuantityValueAndUnit(hdl[0]);
          // p.ldl = getQuantityValueAndUnit(ldl[0]);
          var p = JSON.stringify($.extend(patient, obv));
          ret.resolve(p);
        });
      } else {
        onError();
      }
    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();

  };

  function defaultPatient(){
    return {
      id: {value: ''},
      fname: {value: ''},
      lname: {value: ''},
      gender: {value: ''},
      birthdate: {value: ''},
      height: {value: ''},
      systolicbp: {value: ''},
      diastolicbp: {value: ''},
      ldl: {value: ''},
      hdl: {value: ''},
    };
  }

  function getBloodPressureValue(BPObservations, typeOfPressure) {
    var formattedBPObservations = [];
    BPObservations.forEach(function(observation){
      var BP = observation.component.find(function(component){
        return component.code.coding.find(function(coding) {
          return coding.code == typeOfPressure;
        });
      });
      if (BP) {
        observation.valueQuantity = BP.valueQuantity;
        formattedBPObservations.push(observation);
      }
    });

    return getQuantityValueAndUnit(formattedBPObservations[0]);
  }

  function getQuantityValueAndUnit(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.valueQuantity != 'undefined' &&
        typeof ob.valueQuantity.value != 'undefined' &&
        typeof ob.valueQuantity.unit != 'undefined') {
          return ob.valueQuantity.value + ' ' + ob.valueQuantity.unit;
    } else {
      return undefined;
    }
  }

  window.drawVisualization = function(p) {
    var xhr = new XMLHttpRequest();
    var url = "https://ci.emergecds.com/api/v1/search/login/cerner/isProd/false";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          // $('#holder').show();
          // $('#loading').hide();
          $('#id').html(p.demographics.id);
          // $('#fname').html(p.fname);
          // $('#lname').html(p.lname);
          // $('#gender').html(p.gender);
          // $('#birthdate').html(p.birthdate);
          // $('#height').html(p.height);
          // $('#systolicbp').html(p.systolicbp);
          // $('#diastolicbp').html(p.diastolicbp);
          // $('#ldl').html(p.ldl);
          // $('#hdl').html(p.hdl);

        }
    };
    var data = JSON.stringify({"patient": p});
    xhr.send(data);
  };

})(window);
