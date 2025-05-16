"use strict";

const Logger = (function () {
  function log(message, type) {
    type = type || "info";

    const logTime = getCurrentTime();
    let logClass = "";

    switch (type) {
      case "error":
        logClass = "log-error";
        console.error(logTime + " - " + message);
        break;
      case "warning":
        logClass = "log-warning";
        console.warn(logTime + " - " + message);
        break;
      case "success":
        logClass = "log-success";
        console.log(logTime + " - " + message);
        break;
      default:
        logClass = "log-info";
        console.log(logTime + " - " + message);
    }

    $("#log-content").append(
      '<p class="' + logClass + '">' + logTime + " - " + message + "</p>"
    );

    const logContent = document.getElementById("log-content");
    if (logContent) {
      logContent.scrollTop = logContent.scrollHeight;
    }
  }

  /**
   * 현재 시간 포맷팅
   */
  function getCurrentTime() {
    const now = new Date();
    return (
      padZero(now.getHours()) +
      ":" +
      padZero(now.getMinutes()) +
      ":" +
      padZero(now.getSeconds())
    );
  }

  /**
   * 숫자 앞에 0 붙이기
   */
  function padZero(num) {
    return (num < 10 ? "0" : "") + num;
  }

  return {
    log: log,
  };
})();

const MapService = () => {
  let map = null;
  let markers = [];
  let infoWindows = [];
  let areas = [];
  let companyMarker = null;
  let companyInfoWindow = null;

  const initMap = () => {
    const mapOptions = {
      center: new naver.maps.Lating(37.5035, 127.0252),
      zoom: 17,
      mapTypeID: naver.maps.MapTypeId.NORMAL,
      mapDataControl: false,
      scaleControl: true,
      logoControl: true,
      mapTypeControl: true,
      zoomControl: true,
    };

    map = new naver.maps.Map("map", mapOptions);

    return map;
  };

  const createMarker = (areaData) => {
    const marker = new naver.maps.Marker({
      position: new naver.maps.Lating(
        areaData.position.lat,
        areaData.position.lng
      ),
      map: null,
      title: areaData.name,
      icon: {
        content: getMarkerIcon(areaData.congestion),
        size: new naver.maps.Size(24, 37),
        anchor: new naver.maps.Point(12, 37),
      },
    });

    const infoWindow = new naver.maps.InfoWindow({
      content: getInfoWindowContent(areaData),
      maxWidth: 300,
      backgroundColor: "#fff",
      borderColor: "#888",
      borderWidth: 1,
      borderRadius: 5,
      disableAnchor: true,
    });

    naver.maps.Event.addListener(marker, "click", () => {
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindows.forEach((iw) => {
          iw.close();
        });

        infoWindow.open(map, marker);
        Logger().log(areaData.name + "마커가 클릭됨");
      }
    });
    markers.push(marker);
    infoWindows.push(infoWindow);
    return marker;
  };

  const getMarkerIcon = (congestion) => {
    const congestionInfo = DataService.getCongestionInfo(congestion);
    const color = congestionInfo ? congestionInfo.color : "#4CAF50";

    return (
      '<div style="background-color: ' +
      color +
      '; width: 24px; height: 37px; border-radius: 8px 8px 0 8px;"></div>'
    );
  };

  const getInfoWindowContent = (areaData) => {
    const congestionInfo = DataService.getCongestionInfo(areaData.congestion);

    return (
      '<div class="info-window">' +
      "<h3>" +
      areaData.name +
      "</h3>" +
      '<p><span class="status ' +
      areaData.congestion +
      '"></span>혼잡도: ' +
      congestionInfo.name +
      "</p>" +
      "<p>현재 인원: " +
      areaData.count +
      "명 / " +
      areaData.capacity +
      "명</p>" +
      "<p>위치: " +
      areaData.floorInfo +
      "</p>" +
      "<p>" +
      areaData.description +
      "</p>" +
      "<button onclick=\"MapService.startNavigation('" +
      areaData.id +
      "')\">길안내</button>" +
      "</div>"
    );
  };

  const updateMarkers = () => {
    if (!areas.length) return;

    areas.forEach((areaData, index) => {
      const updatedArea = DataService.getAreaData(areaData.id);
      if (!updatedArea) return;

      markers[index].setIcon({
        content: getMarkerIcon(updatedArea.congestion),
        size: new naver.maps.Size(24, 37),
        anchor: new naver.maps.Point(12, 37),
      });

      infoWindows[index].setContent(getInfoWindowContent(updatedArea));

      areas[index] = updatedArea;
    });

    Logger.log("마커 업데이트 완료");
  };

  const getCurrentPosition = (successCallback, errorCallback) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocattion = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          if (successCallback) successCallback(userLocation);
        },
        (error) => {
          console.error("위치 정보 가져오기 실패", error);
          if (errorCallback) errorCallback(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      if (errorCallback) errorCallback(new Error("Geolocation not supported"));
    }
  };

  return {
    init: () => {
      map = initMap();

      const data = DataService.initData();
      if (!data) {
        Logger.log("데이터 초기화 실패", "error");
        return;
      }

      constcompanyLocation = DataService.getCompanyLocation();
      if (companyLocation) {
        map.setCenter(
          new naver.maps.LatLng(
            companyLocation.position.lat,
            companyLocation.position.lng
          )
        );
        companyMarker = new naver.maps.Marker({
          position: new naver.maps.LatLng(
            companyLocation.position.lat,
            companyLocation.position.lng
          ),
          map,
          title: companyLocation.name,
          icon: {
            content:
              '<div style="background-color: #3B5998; width: 24px; height: 37px; border-radius: 8px 8px 0 8px; border: 2px solid #fff;"></div>',
            size: new naver.maps.Size(24, 37),
            anchor: new naver.maps.Point(12, 37),
          },
        });

        companyInfoWindow = new naver.maps.InfoWindow({
          content:
            '<div class="info-window">' +
            "<h3>" +
            companyLocation.name +
            "</h3>" +
            "<p>" +
            companyLocation.description +
            "</p>" +
            "</div>",
          maxWidth: 300,
          backgroundColor: "#fff",
          borderColor: "#888",
          borderWidth: 1,
          disableAnchor: true,
        });

        naver.maps.Event.addListener(companyMarker, "click", () => {
          if (companyInfoWindow.getMap()) companyInfoWindow.close();
          else {
            infoWindows.forEach((iw) => {
              iw.close();
            });

            companyInfoWindow.open(map, companyMarker);
            Logger.log(companyLocation.name + "마커가 클릭됨");
          }
        });
      }

      const allAreas = DataService.getAllAreas();
      allAreas.forEach((area) => {
        areas.push(area);
        createMarker(area);
      });
      Logger.log(
        "지도가 초기화되었습니다. '마커 추가하기' 버튼을 클릭하여 마커를 추가하세요."
      );
      return map;
    },

    showMarkers: () => {
      markers.forEach((marker) => {
        marker.setMap(map);
      });
      Logger.log("마커가 제거되었습니다.");
    },

    toggleCongestion: () => {
      const updateData = DataService.updateCongestionData();
      if (updateData) {
        updateMarkers();
        Logger.log("혼잡도 데이터가 업데이트되었습니다.");
      }
    },

    resetMap: () => {
      markers.forEach((marker) => {
        marker.setMap(null);
      });

      infoWindows.forEach((infoWindow) => {
        infoWindow.close();
      });

      if (companyInfoWindow) companyInfoWindow.close();

      const companyLocation = DataService.getCompanyLocation();
      if (companyLocation) {
        map.setCenter(
          new naver.maps.LatLng(
            companyLocation.position.lat,
            companyLocation.position.lng
          )
        );
        map.setZoom(17);
      }

      DataService.initData();
      updateMarkers();
      Logger.log("지도 초기화 완료");
    },

    startNavigation: (areaId) => {
      const area = DataService.getAreaData(areaId);
      if (!area) {
        alert("길안내 대상 정보를 찾을 수 없음");
        return;
      }

      getCurrentPosition(
        (userLocation) => {
          alert(
            "현재 위치에서 '" +
              area.name +
              "'까지의 길안내를 시작합니다.\n" +
              "현재 위치: " +
              userLocation.lat.toFixed(6) +
              ", " +
              userLocation.lng.toFixed(6) +
              "\n" +
              "목적지: " +
              area.position.lat.toFixed(6) +
              ", " +
              area.position.lng.toFixed(6)
          );
          Logger.log("'" + area.name + "'으로 길안내 시작");
        },

        (error) => {
          const companyLocation = DataService.getCompanyLocation();

          if (companyLocation) {
            alert(
              "위치 권한이 없어 " +
                companyLocation.name +
                "에서 '" +
                area.name +
                "'까지의 길안내를 시작합니다."
            );
            Logger.log(
              companyLocation.name + "에서 '" + area.name + "'까지 길안내 시작"
            );
          } else {
            alert(
              "위치 권한이 없어 길안내를 시작할 수 없습니다. 위치 권한을 허용해주세요."
            );
            Logger.log("위치 권한 오류로 길안내 실패", "error");
          }
        }
      );
    },

    moveToUserLocation: () => {
      getCurrentPosition(
        (userLocation) => {
          map.setCenter(
            new naver.map.LatLng(userLocation.lat, userLocation.lng)
          );
          Logger.log("사용자 위치로 이동했습니다.", "success");

          const userMarker = new naver.maps.Maker({
            position: new naver.maps.LatLng(userLocation.lat, userLocation.lng),
            map,
            title: "현재 위치",
            icon: {
              content:
                '<div style="background-color: #4285F4; width: 18px; height: 18px; border-radius: 50%; border: 2px solid #fff;"></div>',
              size: new naver.maps.Size(18, 18),
              anchor: new naver.maps.Point(9, 9),
            },
          });

          setTimeout(() => {
            userMarker.setMap(null);
          }, 10000);
        },
        (error) => {
          alert(
            "위치 정보를 가져오는데 실패했습니다. 위치 권한을 허용해주세요."
          );
          Logger.log("위치 권한 오류: " + error.message, "error");
        }
      );
    },

    moveToCompany: () => {
      const companyLocation = DataService.getCompanyLocation();

      if (companyLocation) {
        map.setCenter(
          new naver.maps.LatLng(
            companyLocation.position.lat,
            companyLocation.position.lng
          )
        );
        map.setZoom(17);
        Logger.log(companyLocation.name + " 위치로 이동했습니다.");
      }
    },
  };
};
