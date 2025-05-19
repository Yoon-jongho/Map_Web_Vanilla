"use strict";

$(document).ready(() => {
  const map = MapService.init();

  $("#addMarkers").click(() => {
    MapService.showMarkers();
  });

  $("#toggleCongestion").click(() => {
    MapService.toggleCongestion();
  });

  $("#starNavigation").click(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          alert("마커를 클릭하여 길안내 대상을 선택해주세요.");
          Logger.log("위치 권한 허용됨. 마커 선택 안내");
        },
        (error) => {
          alert("위치 권한이 필요합니다. 위치 권한을 허용해주세요.");
          Logger.log("위치 권한 거부됨", "warning");
        }
      );
    } else {
      alert("이 브라우저에서는 위치 기능을 지원하지 않습니다.");
      Logger.log("위치 기능 미지원 브라우저", "error");
    }
  });

  $("#reseMap").click(() => {
    MapService.resetMap();
  });

  $(".controls").append('<button id="requestLocation">내 위치 찾기</button>');

  $("#requestLocation").click(() => {
    MapService.moveToUserLocation();
  });

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          Logger.log("위치 권한 확인됨", "success");
        },
        (error) => {
          Logger.log("위치 권한 필요: " + error.message, "warning");

          switch (error.code) {
            case error.PERMISSION_DENIED:
              Logger.log("사용자가 위치 접근 권한을 거부했습니다.", "warning");
              break;
            case error.POSITION_UNAVAILABLE:
              Logger.log("위치 정보를 사용할 수 없습니다.", "error");
              break;
            case error.TIMEOUT:
              Logger.log("위치 정보 요청 시간이 초과되었습니다.", "error");
              break;
            case error.UNKNOWN_ERROR:
              Logger.log("알 수 없는 오류가 발생했습니다.", "error");
              break;
          }
        }
      );
    } else {
      Logger.log("이 브라우저에서는 위치 기능을 지원하지 않음.", "error");
    }
  };

  setTimeout(requestLocationPermission, 2000);

  Logger.log("네이버 지도 API 프로토타입이 시작되었습니다.");
  Logger.log(
    "지도가 초기화되었습니다. '마커 추가하기' 버튼을 클릭하여 시작하세요."
  );
});
