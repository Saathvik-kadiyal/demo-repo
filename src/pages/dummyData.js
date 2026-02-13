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


export const rawDataSet2 = {
  selected_periods: [
    {
      year: 2025,
      months: [12]
    }
  ],
  messages: [
    "No data for current month. Showing latest available month: 12-2025"
  ],
  data: [
    {
      client: "ILC Dover",
      headcount: 6,
      total_allowance: 76700,
      shifts: {
        PST_MST: 67200,
        ANZ: 9500
      },
      departments: [
        {
          department: "Infra - IT Operations",
          headcount: 2,
          total_allowance: 18600,
          shifts: {
            PST_MST: 16100,
            ANZ: 2500
          }
        },
        {
          department: "Advanced Analytics",
          headcount: 4,
          total_allowance: 58100,
          shifts: {
            PST_MST: 51100,
            ANZ: 7000
          }
        }
      ]
    },
    {
      client: "Vertisystem Inc",
      headcount: 3,
      total_allowance: 25400,
      shifts: {
        PST_MST: 24500,
        US_INDIA: 900
      },
      departments: [
        {
          department: "Infra - IT Operations",
          headcount: 2,
          total_allowance: 24500,
          shifts: {
            PST_MST: 24500
          }
        },
        {
          department: "IQE",
          headcount: 1,
          total_allowance: 900,
          shifts: {
            US_INDIA: 900
          }
        }
      ]
    },
    {
      client: "American Tire Distributors Inc",
      headcount: 2,
      total_allowance: 23800,
      shifts: {
        PST_MST: 23800
      },
      departments: [
        {
          department: "IQE",
          headcount: 1,
          total_allowance: 10500,
          shifts: {
            PST_MST: 10500
          }
        },
        {
          department: "Digital Engineering",
          headcount: 1,
          total_allowance: 13300,
          shifts: {
            PST_MST: 13300
          }
        }
      ]
    },
    {
      client: "MOURI Tech LLC",
      headcount: 2,
      total_allowance: 17200,
      shifts: {
        US_INDIA: 3900,
        PST_MST: 13300
      },
      departments: [
        {
          department: "Accounts & Finance",
          headcount: 1,
          total_allowance: 3900,
          shifts: {
            US_INDIA: 3900
          }
        },
        {
          department: "Digital Engineering",
          headcount: 1,
          total_allowance: 13300,
          shifts: {
            PST_MST: 13300
          }
        }
      ]
    },
    {
      client: "LeaseLock Inc",
      headcount: 2,
      total_allowance: 16700,
      shifts: {
        US_INDIA: 5700,
        PST_MST: 10500,
        ANZ: 500
      },
      departments: [
        {
          department: "Advanced Analytics",
          headcount: 1,
          total_allowance: 5700,
          shifts: {
            US_INDIA: 5700
          }
        },
        {
          department: "BPS",
          headcount: 1,
          total_allowance: 11000,
          shifts: {
            PST_MST: 10500,
            ANZ: 500
          }
        }
      ]
    },
    {
      client: "CHEP USA Inc",
      headcount: 2,
      total_allowance: 12400,
      shifts: {
        PST_MST: 7000,
        US_INDIA: 5400
      },
      departments: [
        {
          department: "BPS",
          headcount: 2,
          total_allowance: 12400,
          shifts: {
            PST_MST: 7000,
            US_INDIA: 5400
          }
        }
      ]
    },
    {
      client: "DZS Inc",
      headcount: 1,
      total_allowance: 11300,
      shifts: {
        PST_MST: 9800,
        ANZ: 1500
      },
      departments: [
        {
          department: "Infra - IT Operations",
          headcount: 1,
          total_allowance: 11300,
          shifts: {
            PST_MST: 9800,
            ANZ: 1500
          }
        }
      ]
    },
    {
      client: "Clair Source Group",
      headcount: 1,
      total_allowance: 7500,
      shifts: {
        ANZ: 7500
      },
      departments: [
        {
          department: "Infra - IT Operations",
          headcount: 1,
          total_allowance: 7500,
          shifts: {
            ANZ: 7500
          }
        }
      ]
    },
    {
      client: "MOURI Tech Limited",
      headcount: 1,
      total_allowance: 3000,
      shifts: {
        US_INDIA: 3000
      },
      departments: [
        {
          department: "Accounts & Finance",
          headcount: 1,
          total_allowance: 3000,
          shifts: {
            US_INDIA: 3000
          }
        }
      ]
    }
  ]
};
