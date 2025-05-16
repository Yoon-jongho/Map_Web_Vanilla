"use strict";

const DataService = () => {
  let data = null;

  const updateCongestionRandomly = () => {
    if (!data) return;

    const congestionLevels = ["low", "medium", "high"];

    data.buildings.forEach((building) => {
      building.areas.forEach((area) => {
        const randomLevel =
          congestionLevels[Math.floor(Math.random() * congestionLevels.length)];
        area.congestion = randomLevel;

        switch (randomLevel) {
          case "low":
            area.count = Math.floor(area.capacity * (Math.random() * 0.4));
            break;
          case "medium":
            area.count = Math.floor(
              area.capacity * (0.4 + Math.random() * 0.3)
            );
            break;
          case "high":
            area.count = Math.floor(
              area.capacity * (0.7 + Math.random() * 0.3)
            );
            break;
        }
      });
    });

    data.lastUpdated = new Date().toISOString();

    return data;
  };

  return {
    initData: () => {
      _data = window.mockData || null;

      if (!_data) {
        console.error("모킹 데이터 로드 실패함");
        return null;
      }

      return _data;
    },

    getAllData: () => {
      return _data;
    },

    getCompanyLocation: () => {
      if (!_data) return null;

      return _data.companyLocation;
    },

    getBuildingData: (buildingId) => {
      if (!_data) return null;

      return (
        _data.buildings.find((building) => building.id === buildingId) || null
      );
    },

    getAllBuildings: () => {
      if (!_data) return null;

      return _data.buildings;
    },

    getAreaData: (areaId) => {
      if (!_data) return null;

      for (let i = 0; i < _data.buildings.length; i++) {
        const building = _data.buildings[i];

        for (let j = 0; j < building.areas.length; j++) {
          if (building.areas[j].id === areaId) {
            return building.areas[j];
          }
        }
      }
      return null;
    },

    getAllAreas: () => {
      if (!_data) return null;

      const allAreas = [];
      _data.buildings.forEach((building) => {
        building.areas.forEach((area) => {
          allAreas.push({
            area,
          });
        });
      });
      return allAreas;
    },

    getCongestionInfo: (level) => {
      if (!_data) return null;

      return _data.congestionLevels[level] || null;
    },

    // 혼잡도 데이터 업데이트 (시뮬레이션용)
    updateCongestionData: () => {
      return updateCongestionRandomly();
    },

    // 랜덤 시간마다 혼잡도 자동 업데이트 start

    startAutomaticUpdates: (updateCallback) => {
      const updateAndSchedule = () => {
        const updatedData = updateCongestionRandomly();
        if (updateCallback && typeof updateCallback === "function") {
          updateCallback(updatedData);
        }

        const nextUpdateTime = 10000 + Math.random() * 20000; // 10초에서 30초 사이의 랜덤 시간
        setTimeout(updateAndSchedule, nextUpdateTime);
      };

      updateAndSchedule();

      if (Logger) {
        Logger.log("자동 업데이트 시작됨");
      }
    },
  };
};
