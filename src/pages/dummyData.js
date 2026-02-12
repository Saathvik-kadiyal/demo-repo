export const rawDataSet1 = {
  dashboard: {
    clients: {
      "DZS Inc": {
        total_allowance: 50000,
        head_count: 5,
        ANZ: { total: 15000, head_count: 2 },
        PST_MST: { total: 35000, head_count: 3 },

        departments: {
          "Engineering": {
            total: 30000,
            head_count: 3,
            ANZ: { total: 10000, head_count: 1 },
            PST_MST: { total: 20000, head_count: 2 },

            employees: [
              {
                name: "John",
                total: 12000,
                head_count: 1,
                ANZ: { total: 5000, head_count: 1 },
                PST_MST: { total: 7000, head_count: 1 },
              },
              {
                name: "Sara",
                total: 18000,
                head_count: 1,
                ANZ: { total: 5000, head_count: 1 },
                PST_MST: { total: 13000, head_count: 1 },
              }
            ]
          },

          "HR": {
            total: 20000,
            head_count: 2,
            ANZ: { total: 5000, head_count: 1 },
            PST_MST: { total: 15000, head_count: 1 },
          }
        }
      }
    }
  }
};
