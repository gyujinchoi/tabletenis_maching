function saveCompetition()
  {
    var xhttp = new XMLHttpRequest();
    var url = "http://52.79.188.98:3000/competition/add";
    url += "?title=" + competitonFrm.Title.value;
    url += "&start_date=" + competitonFrm.StartDate.value;
    url += "&end_date=" + competitonFrm.EndDate.value;
    url += "&phone=" + competitonFrm.Place.value;
    url += "&location=" + competitonFrm.Phone.value;
    url += "&account=" + competitonFrm.Account.value; 
    url += "&bank=" + competitonFrm.Bank.value;
    xhttp.open("get", url, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    
    if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          var jsonResponse = JSON.parse(xhttp.responseText); 
          // alert(xhttp.responseText);
          window.open("makeGameType.html?leagueTitle="+jsonResponse[0].title+"&leagueID="+jsonResponse[0].competition_id);
          //정상 여부 확인 필요 할듯
        } else {
          alert(xhttp.responseText);
        }
      }
  
  }

function getRestAPI(params)
{
  var xhttp = new XMLHttpRequest();
  var url = "http://52.79.188.98:3000/
  var responseData = none;
  url += params;
  xhttp.open("get", url, false);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

  if (xhttp.readyState === 4) {
    if (xhttp.status === 200) {
      responseData = JSON.parse(xhttp.responseText); 
      // alert(xhttp.responseText);
      // return jsonResponse;
      // window.open("makeGameType.html?leagueTitle="+jsonResponse[0].title+"&leagueID="+jsonResponse[0].competition_id);
      //정상 여부 확인 필요 할듯
    } else {
      alert(xhttp.responseText);
    }
  }
  return responseData;
}
 
function saveGame()
{
    if(urlParams.leagueID == none) {
      requestleagueID();
    }
    var xhttp = new XMLHttpRequest();
    var url = "http://52.79.188.98:3000/competition/event/add";
    xhttp.open("get", url, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    
    if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          alert(xhttp.responseText);
          //정상 여부 확인 필요 할듯
        } else {
          alert("대회 정보를 읽어 오는데 실패 하였습니다.");
        }
      }
  //alert(response);
  
}