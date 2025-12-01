export type DashboardTableDataType = {
  reception: {
    orderPlaced: number;
    orderRecieved: number;
  };
  houseKeeping: {
    orderPlaced: number;
    orderRecieved: number;
  };
  inRoomDining: {
    orderPlaced: number;
    orderRecieved: number;
  };
  gym: {
    orderPlaced: number;
    orderRecieved: number;
  };
  swimmingPool: {
    orderPlaced: number;
    orderRecieved: number;
  };
  spa: {
    orderPlaced: number;
    orderRecieved: number;
  };
  conciergeService: {
    orderPlaced: number;
    orderRecieved: number;
  };
  inRoomControl: {
    orderPlaced: number;
    orderRecieved: number;
  };
  orderManagement: {
    orderPlaced: number;
    orderRecieved: number;
  };
  sosManagement: {
    orderPlaced: number;
    orderRecieved: number;
  };
  chatWithStaff: {
    orderPlaced: number;
    orderRecieved: number;
  };
};

export const dashboardTableData: DashboardTableDataType = {
  reception: {
    orderPlaced: 120,
    orderRecieved: 115
  },
  houseKeeping: {
    orderPlaced: 98,
    orderRecieved: 92
  },
  inRoomDining: {
    orderPlaced: 150,
    orderRecieved: 145
  },
  gym: {
    orderPlaced: 80,
    orderRecieved: 78
  },
  swimmingPool: {
    orderPlaced: 65,
    orderRecieved: 60
  },
  spa: {
    orderPlaced: 50,
    orderRecieved: 48
  },
  conciergeService: {
    orderPlaced: 75,
    orderRecieved: 72
  },
  inRoomControl: {
    orderPlaced: 110,
    orderRecieved: 105
  },
  orderManagement: {
    orderPlaced: 130,
    orderRecieved: 125
  },
  sosManagement: {
    orderPlaced: 40,
    orderRecieved: 39
  },
  chatWithStaff: {
    orderPlaced: 90,
    orderRecieved: 88
  }
};
