"use strict";

const mockData = {
  buildings: [
    {
      id: "building_a",
      name: "강남 A 빌딩",
      position: { lat: 37.5037, lng: 127.0249 },
      areas: [
        {
          id: "building_a_lobby",
          name: "A 빌딩 로비",
          position: { lat: 37.5037, lng: 127.0249 },
          congestion: "low",
          count: 12,
          capacity: 50,
          floorInfo: "1층",
          description: "A 빌딩 로비 - 방문자 안내데스크 및 보안 게이트가 위치",
        },
        {
          id: "building_a_cafeteria",
          name: "A 빌딩 구내식당",
          position: { lat: 37.5038, lng: 127.025 },
          congestion: "medium",
          count: 45,
          capacity: 80,
          floorInfo: "2층",
          description: "A 빌딩 구내식당 - 다양한 메뉴의 구내식당이 위치",
        },
        {
          id: "building_a_office",
          name: "A 빌딩 사무실",
          position: { lat: 37.5036, lng: 127.0248 },
          congestion: "high",
          count: 120,
          capacity: 150,
          floorInfo: "3-10층",
          description: "A 빌딩 사무실 구역 - 주요 기업 사무실 위치",
        },
      ],
    },
    {
      id: "building_b",
      name: "강남 B 빌딩",
      position: { lat: 37.504, lng: 127.0255 },
      areas: [
        {
          id: "building_b_lobby",
          name: "B 빌딩 로비",
          position: { lat: 37.504, lng: 127.0255 },
          congestion: "low",
          count: 8,
          capacity: 40,
          floorInfo: "1층",
          description: "B 빌딩 로비 - 방문자 안내데스크 및 카페가 위치",
        },
        {
          id: "building_b_conference",
          name: "B 빌딩 회의실 구역",
          position: { lat: 37.5041, lng: 127.0256 },
          congestion: "medium",
          count: 25,
          capacity: 60,
          floorInfo: "3층",
          description: "B 빌딩 회의실 구역 - 다양한 크기의 회의실 위치",
        },
      ],
    },
    // {
    //   id: "building_c",
    //   name: "강남 C 빌딩",
    //   position: { lat: 37.5032, lng: 127.0245 },
    //   areas: [
    //     {
    //       id: "building_c_lobby",
    //       name: "C 빌딩 로비",
    //       position: { lat: 37.5032, lng: 127.0245 },
    //       congestion: "medium",
    //       count: 15,
    //       capacity: 30,
    //       floorInfo: "1층",
    //       description: "C 빌딩 로비 - 출입구 및 안내데스크 위치",
    //     },
    //     {
    //       id: "building_c_cafeteria",
    //       name: "C 빌딩 카페테리아",
    //       position: { lat: 37.5033, lng: 127.0246 },
    //       congestion: "high",
    //       count: 38,
    //       capacity: 40,
    //       floorInfo: "1층",
    //       description: "C 빌딩 카페테리아 - 카페 및 간단한 식사 공간",
    //     },
    //     {
    //       id: "building_c_office",
    //       name: "C 빌딩 사무실",
    //       position: { lat: 37.5031, lng: 127.0244 },
    //       congestion: "low",
    //       count: 50,
    //       capacity: 120,
    //       floorInfo: "2-8층",
    //       description: "C 빌딩 사무실 구역 - IT 기업 및 스타트업 위치",
    //     },
    //   ],
    // },
  ],

  companyLocation: {
    name: "우리 회사",
    position: { lat: 37.49105, lng: 127.0314672 },
    description: "강남대로 310 위치한 회사 본사",
  },

  lastUpdated: new Date().toISOString(),

  congestionLevels: {
    low: {
      name: "여유",
      color: "#4CAF50",
      description: "여유로움 (수용 인원의 40% 미만)",
    },
    medium: {
      name: "보통",
      color: "#FFC107",
      description: "보통 (수용 인원의 40% 이상 70% 미만)",
    },
    high: {
      name: "혼잡",
      color: "#F44336",
      description: "혼잡함 (수용 인원의 70% 이상)",
    },
  },
};

window.mockData = mockData;
