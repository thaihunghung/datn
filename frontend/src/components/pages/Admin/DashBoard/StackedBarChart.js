// StackedBarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'chart.js/auto';
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = [
  {
    "plo_id": 1,
    "ploName": "IT_PLO1",
    "totalPercentage": "77.89",
    "subjects": [
      {
        "subjectName": "Thống kê và phân tích dữ liệu",
        "contributionPercentage": 77.32
      },
      {
        "subjectName": "Phát triển ứng dụng Web với mã nguồn mở",
        "contributionPercentage": 0.13
      },
      {
        "subjectName": "Phân tích thiết kế hệ thống thông tin",
        "contributionPercentage": 0.13
      },
      {
        "subjectName": "Quản trị dự án công nghệ thông tin",
        "contributionPercentage": 0.09
      },
      {
        "subjectName": "An toàn và Bảo mật thông tin",
        "contributionPercentage": 0.09
      },
      {
        "subjectName": "Lập trình ứng dụng trên Windows",
        "contributionPercentage": 0.13
      }
    ]
  },
  {
    "plo_id": 2,
    "ploName": "IT_PLO2",
    "totalPercentage": "73.27",
    "subjects": [
      {
        "subjectName": "Khai phá dữ liệu",
        "contributionPercentage": 17.83
      },
      {
        "subjectName": "Công nghệ phần mềm",
        "contributionPercentage": 54.49
      },
      {
        "subjectName": "Phát triển ứng dụng Web với mã nguồn mở",
        "contributionPercentage": 0.2
      },
      {
        "subjectName": "Hệ quản trị cơ sở dữ liệu",
        "contributionPercentage": 0.25
      },
      {
        "subjectName": "Phân tích thiết kế hệ thống thông tin",
        "contributionPercentage": 0.1
      },
      {
        "subjectName": "Quản trị dự án công nghệ thông tin",
        "contributionPercentage": 0.05
      },
      {
        "subjectName": "An toàn và Bảo mật thông tin",
        "contributionPercentage": 0.2
      },
      {
        "subjectName": "Lập trình ứng dụng trên Windows",
        "contributionPercentage": 0.15
      }
    ]
  },
  {
    "plo_id": 3,
    "ploName": "IT_PLO3",
    "totalPercentage": "78.14",
    "subjects": [
      {
        "subjectName": "Khai phá dữ liệu",
        "contributionPercentage": 29.48
      },
      {
        "subjectName": "Thống kê và phân tích dữ liệu",
        "contributionPercentage": 46.99
      },
      {
        "subjectName": "Phát triển ứng dụng Web với mã nguồn mở",
        "contributionPercentage": 0.63
      },
      {
        "subjectName": "Hệ quản trị cơ sở dữ liệu",
        "contributionPercentage": 0.32
      },
      {
        "subjectName": "Quản trị dự án công nghệ thông tin",
        "contributionPercentage": 0.08
      },
      {
        "subjectName": "An toàn và Bảo mật thông tin",
        "contributionPercentage": 0.32
      },
      {
        "subjectName": "Lập trình ứng dụng trên Windows",
        "contributionPercentage": 0.32
      }
    ]
  },
  {
    "plo_id": 4,
    "ploName": "IT_PLO4",
    "totalPercentage": "76.04",
    "subjects": [
      {
        "subjectName": "Khai phá dữ liệu",
        "contributionPercentage": 36.29
      },
      {
        "subjectName": "Thống kê và phân tích dữ liệu",
        "contributionPercentage": 38.9
      },
      {
        "subjectName": "Phát triển ứng dụng Web với mã nguồn mở",
        "contributionPercentage": 0.4
      },
      {
        "subjectName": "Hệ quản trị cơ sở dữ liệu",
        "contributionPercentage": 0.1
      },
      {
        "subjectName": "Phân tích thiết kế hệ thống thông tin",
        "contributionPercentage": 0
      },
      {
        "subjectName": "An toàn và Bảo mật thông tin",
        "contributionPercentage": 0.15
      },
      {
        "subjectName": "Lập trình ứng dụng trên Windows",
        "contributionPercentage": 0.2
      }
    ]
  },
  {
    "plo_id": 5,
    "ploName": "IT_PLO5",
    "totalPercentage": "78.00",
    "subjects": [
      {
        "subjectName": "Khai phá dữ liệu",
        "contributionPercentage": 74.4
      },
      {
        "subjectName": "Phát triển ứng dụng Web với mã nguồn mở",
        "contributionPercentage": 0
      },
      {
        "subjectName": "Hệ quản trị cơ sở dữ liệu",
        "contributionPercentage": 0.8
      },
      {
        "subjectName": "Phân tích thiết kế hệ thống thông tin",
        "contributionPercentage": 0.4
      },
      {
        "subjectName": "An toàn và Bảo mật thông tin",
        "contributionPercentage": 0.8
      },
      {
        "subjectName": "Lập trình ứng dụng trên Windows",
        "contributionPercentage": 1.6
      }
    ]
  },
  {
    "plo_id": 6,
    "ploName": "IT_PLO6",
    "totalPercentage": "72.89",
    "subjects": [
      {
        "subjectName": "Công nghệ phần mềm",
        "contributionPercentage": 68.7
      },
      {
        "subjectName": "Phát triển ứng dụng Web với mã nguồn mở",
        "contributionPercentage": 0.76
      },
      {
        "subjectName": "Hệ quản trị cơ sở dữ liệu",
        "contributionPercentage": 0.38
      },
      {
        "subjectName": "Phân tích thiết kế hệ thống thông tin",
        "contributionPercentage": 0.38
      },
      {
        "subjectName": "Quản trị dự án công nghệ thông tin",
        "contributionPercentage": 1.15
      },
      {
        "subjectName": "An toàn và Bảo mật thông tin",
        "contributionPercentage": 0.76
      },
      {
        "subjectName": "Lập trình ứng dụng trên Windows",
        "contributionPercentage": 0.76
      }
    ]
  },
  {
    "plo_id": 7,
    "ploName": "IT_PLO7",
    "totalPercentage": "73.39",
    "subjects": [
      {
        "subjectName": "Khai phá dữ liệu",
        "contributionPercentage": 24.4
      },
      {
        "subjectName": "Công nghệ phần mềm",
        "contributionPercentage": 47.85
      },
      {
        "subjectName": "Hệ quản trị cơ sở dữ liệu",
        "contributionPercentage": 0.27
      },
      {
        "subjectName": "Phân tích thiết kế hệ thống thông tin",
        "contributionPercentage": 0.13
      },
      {
        "subjectName": "Quản trị dự án công nghệ thông tin",
        "contributionPercentage": 0.27
      },
      {
        "subjectName": "An toàn và Bảo mật thông tin",
        "contributionPercentage": 0.2
      },
      {
        "subjectName": "Lập trình ứng dụng trên Windows",
        "contributionPercentage": 0.27
      }
    ]
  },
  {
    "plo_id": 8,
    "ploName": "IT_PLO8",
    "totalPercentage": "72.61",
    "subjects": [
      {
        "subjectName": "Công nghệ phần mềm",
        "contributionPercentage": 71.61
      },
      {
        "subjectName": "Hệ quản trị cơ sở dữ liệu",
        "contributionPercentage": 0.1
      },
      {
        "subjectName": "Phân tích thiết kế hệ thống thông tin",
        "contributionPercentage": 0.1
      },
      {
        "subjectName": "Quản trị dự án công nghệ thông tin",
        "contributionPercentage": 0.1
      },
      {
        "subjectName": "An toàn và Bảo mật thông tin",
        "contributionPercentage": 0.3
      },
      {
        "subjectName": "Lập trình ứng dụng trên Windows",
        "contributionPercentage": 0.4
      }
    ]
  },
  {
    "plo_id": 9,
    "ploName": "IT_PLO9",
    "totalPercentage": "71.62",
    "subjects": [
      {
        "subjectName": "Khai phá dữ liệu",
        "contributionPercentage": 23.45
      },
      {
        "subjectName": "Công nghệ phần mềm",
        "contributionPercentage": 47.36
      },
      {
        "subjectName": "Phát triển ứng dụng Web với mã nguồn mở",
        "contributionPercentage": 0.2
      },
      {
        "subjectName": "Phân tích thiết kế hệ thống thông tin",
        "contributionPercentage": 0.07
      },
      {
        "subjectName": "Quản trị dự án công nghệ thông tin",
        "contributionPercentage": 0.27
      },
      {
        "subjectName": "An toàn và Bảo mật thông tin",
        "contributionPercentage": 0.27
      }
    ]
  },
  {
    "plo_id": 10,
    "ploName": "IT_PLO10",
    "totalPercentage": "76.87",
    "subjects": [
      {
        "subjectName": "Khai phá dữ liệu",
        "contributionPercentage": 43.58
      },
      {
        "subjectName": "Thống kê và phân tích dữ liệu",
        "contributionPercentage": 32.97
      },
      {
        "subjectName": "Phát triển ứng dụng Web với mã nguồn mở",
        "contributionPercentage": 0.04
      },
      {
        "subjectName": "Hệ quản trị cơ sở dữ liệu",
        "contributionPercentage": 0.08
      },
      {
        "subjectName": "Quản trị dự án công nghệ thông tin",
        "contributionPercentage": 0.04
      },
      {
        "subjectName": "Lập trình ứng dụng trên Windows",
        "contributionPercentage": 0.16
      }
    ]
  }
];

const processData = (data) => {
  const labels = data.map(item => item.ploName);
  const subjectNames = [...new Set(data.flatMap(item => item.subjects.map(sub => sub.subjectName)))];

  const datasets = subjectNames.map(subject => ({
    label: subject,
    data: data.map(item => {
      const found = item.subjects.find(sub => sub.subjectName === subject);
      return found ? found.contributionPercentage : 0;
    }),
    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
  }));

  return {
    labels,
    datasets
  };
};

const options = {
  plugins: {
    title: {
      display: false,
      text: 'Stacked Bar Chart'
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (tooltipItem) {
          const datasetLabel = tooltipItem.dataset.label || '';
          const value = tooltipItem.raw;
          return value > 0 ? `${datasetLabel}: ${value} %` : '';
        }
      }
    },
    legend: {
      position: 'top',
      labels: {
        font: {
          size: 14 // Increase this value to change the font size
        }
      }
    }
  },
  responsive: true,
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  }
};

const StackedBarChart = () => {
  const chartData = processData(data);

  return (
    <div
      className='bg-white shadow-md rounded-lg p-6 mb-6 h-[700px]'
    >
      <h2 className="text-xl font-semibold mb-4">Tỉ lệ chuẩn đầu ra của chương trình đào tạo</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default StackedBarChart;
