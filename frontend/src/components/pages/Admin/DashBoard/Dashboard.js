import React, { useEffect, useState } from 'react';
import { Radar, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement, BarElement, RadarController, BarController, Title, Tooltip, Legend } from 'chart.js';
import { Container, Card, Button, Input, Spacer, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import axios from 'axios';
import { axiosAdmin } from '../../../../service/AxiosAdmin';
import { DownOutlined } from '@ant-design/icons';
import { Select } from 'antd';

// Register the necessary components with Chart.js
ChartJS.register(
  CategoryScale,
  RadialLinearScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadarController,
  BarController,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [selectedRadar, setSelectedRadar] = useState([]);
  const [radarChartData, setRadarChartData] = useState({
    labels: [],
    datasets: []
  });

  const [originalRadarData, setOriginalRadarData] = useState([]);
  const [allLabels, setAllLabels] = useState([]);
  const [descriptions, setDescriptions] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    year: [],
    semester: [],
    class: [],
    subject: [],
    course: []
  });

  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);

  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: []
  });
  const [barChartInfo, setBarChartInfo] = useState([]);
  const [ploRadarChartData, setPloRadarChartData] = useState({
    labels: [],
    datasets: []
  });
  const [originalPloRadarData, setOriginalPloRadarData] = useState([]);
  const [selectedPloRadar, setSelectedPloRadar] = useState([]);

  const MAX_COUNT = 3;

  const fetchRadarChartData = async () => {
    try {
      const response = await axiosAdmin.get('/achieved-rate/clo/percentage');
      const data = response.data;

      const labelsSet = new Set();
      const datasetsMap = {};
      const descriptionsMap = {};

      data.forEach(subject => {
        subject.clos.forEach(clo => {
          labelsSet.add(clo.cloName);
          descriptionsMap[clo.cloName] = clo.description;
          if (!datasetsMap[subject.subjectName]) {
            datasetsMap[subject.subjectName] = {
              label: subject.subjectName,
              data: {},
              fill: true,
              backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
              borderColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
              pointBackgroundColor: '#6FDCE3',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#5C2FC2',
              pointHoverBorderColor: '#fff',
            };
          }
        });
      });

      const labelsArray = Array.from(labelsSet);

      data.forEach(subject => {
        subject.clos.forEach(clo => {
          if (!datasetsMap[subject.subjectName].data[clo.cloName]) {
            datasetsMap[subject.subjectName].data[clo.cloName] = (clo.percentage_score * 100).toFixed(2);
          }
        });
      });

      const datasets = Object.values(datasetsMap).map(dataset => ({
        ...dataset,
        data: labelsArray.map(label => dataset.data[label] || null)
      }));

      setOriginalRadarData(datasets);
      setAllLabels(labelsArray);
      setDescriptions(descriptionsMap);

      setRadarChartData({
        labels: labelsArray,
        datasets
      });

      // Set default selected radar datasets
      setSelectedRadar(datasets.map(dataset => dataset.label));

    } catch (error) {
      console.error('Error fetching radar chart data:', error);
    }
  };

  const fetchPloRadarChartData = async () => {
    try {
      const response = await axiosAdmin.get('/achieved-rate/plo/percentage');
      const data = response.data;

      console.log("data plo", data)
      const labelsSet = new Set();
      const datasetsMap = {};

      data.forEach(subject => {
        subject.plos.forEach(plo => {
          labelsSet.add(plo.ploName);
          if (!datasetsMap[subject.subjectName]) {
            datasetsMap[subject.subjectName] = {
              label: subject.subjectName,
              data: {},
              fill: true,
              backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
              borderColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
              pointBackgroundColor: '#6FDCE3',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#5C2FC2',
              pointHoverBorderColor: '#fff',
            };
          }
        });
      });

      const labelsArray = Array.from(labelsSet);

      data.forEach(subject => {
        subject.plos.forEach(plo => {
          if (!datasetsMap[subject.subjectName].data[plo.ploName]) {
            datasetsMap[subject.subjectName].data[plo.ploName] = (plo.percentage_score * 100).toFixed(2);
          }
        });
      });

      const datasets = Object.values(datasetsMap).map(dataset => ({
        ...dataset,
        data: labelsArray.map(label => dataset.data[label] || null)
      }));

      setOriginalPloRadarData(datasets);

      setPloRadarChartData({
        labels: labelsArray,
        datasets
      });

      // Set default selected PLO radar datasets
      setSelectedPloRadar(datasets.map(dataset => dataset.label));

    } catch (error) {
      console.error('Error fetching PLO radar chart data:', error);
    }
  };

  const fetchFiltersData = async () => {
    try {
      const [semestersRes, academicYearsRes, classesRes, subjectsRes, coursesRes] = await Promise.all([
        axiosAdmin.get('/semester'),
        axiosAdmin.get('/academic-year'),
        axiosAdmin.get('/class'),
        axiosAdmin.get('/subjects'),
        axiosAdmin.get('/course-all'),
      ]);

      setSemesters(semestersRes.data);
      setAcademicYears(academicYearsRes.data);
      setClasses(classesRes.data);
      setSubjects(subjectsRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error('Error fetching filters data:', error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const processedFilters = {
        academic_year_id_list: filters.year.map(value => parseInt(value.split(' ')[0])),
        semester_id_list: filters.semester.map(value => parseInt(value.split(' ')[0])),
        class_id_list: filters.class.map(value => parseInt(value.split(' ')[0])),
        subject_id_list: filters.subject.map(value => parseInt(value.split(' ')[0])),
        course_id_list: filters.course.map(value => parseInt(value.split(' ')[0])),
      };
      console.log("filter", filters)
      console.log("data", processedFilters)
      const response = await axiosAdmin.post('/course/arg-score', {
        processedFilters
      });
      const data = response.data;

      const labels = data.map(course => course.courseName);
      const scores = data.map(course => course.averageScore);

      setBarChartData({
        labels,
        datasets: [{
          label: 'Average Scores',
          data: scores,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      });

      setBarChartInfo(data);

    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  useEffect(() => {
    fetchRadarChartData();
    fetchPloRadarChartData();
    fetchFiltersData();

    const fetchUser = async () => {
      try {
        const response = await axiosAdmin.get(`${process.env.REACT_APP_API_DOMAIN_CLIENT}/user`);
        const user = response.data;

        setUser(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    fetchBarChartData();
  }, [filters]);

  useEffect(() => {
    const selectedDatasets = originalRadarData.filter(dataset => selectedRadar.includes(dataset.label));
    const selectedLabelsSet = new Set();

    selectedDatasets.forEach(dataset => {
      dataset.data.forEach((score, index) => {
        if (score > 0) {
          selectedLabelsSet.add(allLabels[index]);
        }
      });
    });

    const newLabels = Array.from(selectedLabelsSet);

    setRadarChartData({
      labels: newLabels,
      datasets: selectedDatasets.map(dataset => ({
        ...dataset,
        data: newLabels.map(label => {
          const index = allLabels.indexOf(label);
          return dataset.data[index];
        })
      }))
    });
  }, [selectedRadar]);

  useEffect(() => {
    const selectedDatasets = originalPloRadarData.filter(dataset => selectedPloRadar.includes(dataset.label));
    const selectedLabelsSet = new Set();

    selectedDatasets.forEach(dataset => {
      dataset.data.forEach((score, index) => {
        if (score > 0) {
          selectedLabelsSet.add(ploRadarChartData.labels[index]);
        }
      });
    });

    const newLabels = Array.from(selectedLabelsSet);

    setPloRadarChartData({
      labels: newLabels,
      datasets: selectedDatasets.map(dataset => ({
        ...dataset,
        data: newLabels.map(label => {
          const index = ploRadarChartData.labels.indexOf(label);
          return dataset.data[index];
        })
      }))
    });
  }, [selectedPloRadar]);

  const handleRadarSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedRadar(prev =>
      checked ? [...prev, value] : prev.filter(radar => radar !== value)
    );
  };

  const handlePloRadarSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedPloRadar(prev =>
      checked ? [...prev, value] : prev.filter(radar => radar !== value)
    );
  };

  const handleFilterChange = (name, values) => {
    setFilters(prev => ({
      ...prev,
      [name]: values
    }));
  };

  const radarChartFilteredData = {
    labels: radarChartData.labels,
    datasets: radarChartData.datasets.filter(dataset => selectedRadar.includes(dataset.label))
  };

  const ploRadarChartFilteredData = {
    labels: ploRadarChartData.labels,
    datasets: ploRadarChartData.datasets.filter(dataset => selectedPloRadar.includes(dataset.label))
  };

  const radarChartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 100
      }
    },
    elements: {
      point: {
        radius: 6, // Increase point size
        hoverRadius: 8
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const cloName = context.label;
            const description = descriptions[cloName] || '';
            return `Tỉ lệ đạt được là ${value} %\n\n${description}`;
          }
        }
      }
    }
  };

  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 10
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const courseInfo = barChartInfo[index];
            const value = context.raw;
            return `
            Average Score: ${value}
            Teacher: ${courseInfo.teacherName}
            Semester: ${courseInfo.semester}
            Academic Year: ${courseInfo.academic_year}
            Class: ${courseInfo.className}
            `.trim().split('\n').map(line => line.trim()).join('\n');
          },
          title: function (context) {
            return context[0].label;
          }
        }
      }
    }
  };

  const optionsAcademicYear = academicYears.map((item) => ({
    value: `${item.academic_year_id} - ${item.startDate}`,
    label: item.description,
  }));

  const optionsSemester = semesters.map((item) => ({
    value: `${item.semester_id} - ${item.descriptionLong} - ${item.descriptionShort}`,
    label: item.descriptionLong,
  }));

  const optionsClass = classes.map((item) => ({
    value: `${item.class_id} - ${item.classNameShort} - ${item.classCode} - ${item.className}`,
    label: item.className,
  }));

  const optionsCourse = courses.map((item) => ({
    value: `${item.course_id} - ${item.courseCode} - ${item.courseName}`,
    label: item.courseName,
  }));

  const optionsSubject = subjects.map((item) => ({
    value: `${item.subject_id} - ${item.subjectCode} - ${item.subjectName}`,
    label: item.subjectName,
  }));

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Chào bạn {user.name}. 👋</h1>
          <p className='text-left'>Dưới đây là các biểu đồ</p>
        </div>
      </header>

      <div className='mx-3'>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Radar to Display</h2>
          <div className='flex'>
            {originalRadarData.map((dataset, index) => (
              <div key={index} className="mb-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value={dataset.label}
                    checked={selectedRadar.includes(dataset.label)}
                    onChange={handleRadarSelection}
                    className="mr-2"
                  />
                  {dataset.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Sales Data (Radar Chart)</h2>
          <Radar data={radarChartFilteredData} options={radarChartOptions} />
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Select PLO Radar to Display</h2>
          <div className='flex'>
            {originalPloRadarData.map((dataset, index) => (
              <div key={index} className="mb-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    value={dataset.label}
                    checked={selectedPloRadar.includes(dataset.label)}
                    onChange={handlePloRadarSelection}
                    className="mr-2"
                  />
                  {dataset.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">PLO Data (Radar Chart)</h2>
          <Radar data={ploRadarChartFilteredData} options={radarChartOptions} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex items-center">
            <Button onClick={() => setShowFilters(!showFilters)}>Filter</Button>
          </div>
          {showFilters && (
            <div className="mb-6 p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2">Năm học</label>
                  <Select
                    mode="multiple"
                    value={filters.year}
                    style={{
                      width: '100%',
                    }}
                    onChange={(value) => handleFilterChange('year', value)}
                    placeholder="Chọn năm học"
                    options={optionsAcademicYear}
                  />
                </div>
                <div>
                  <label className="block mb-2">Học kì</label>
                  <Select
                    mode="multiple"
                    value={filters.semester}
                    style={{
                      width: '100%',
                    }}
                    onChange={(value) => handleFilterChange('semester', value)}
                    placeholder="Chọn học kì"
                    options={optionsSemester}
                  />
                </div>
                <div>
                  <label className="block mb-2">Lớp học</label>
                  <Select
                    mode="multiple"
                    value={filters.class}
                    style={{
                      width: '100%',
                    }}
                    onChange={(value) => handleFilterChange('class', value)}
                    placeholder="Chọn lớp"
                    options={optionsClass}
                  />
                </div>
                <div>
                  <label className="block mb-2">Subject</label>
                  <Select
                    mode="multiple"
                    value={filters.subject}
                    style={{
                      width: '100%',
                    }}
                    onChange={(value) => handleFilterChange('subject', value)}
                    placeholder="Chọn môn học"
                    options={optionsSubject}
                  />
                </div>
                <div>
                  <label className="block mb-2">Course</label>
                  <Select
                    mode="multiple"
                    value={filters.course}
                    style={{
                      width: '100%',
                    }}
                    onChange={(value) => handleFilterChange('course', value)}
                    placeholder="Chọn học phần"
                    options={optionsCourse}
                  />
                </div>
              </div>
            </div>
          )}
          <h2 className="text-xl font-semibold mb-4">Điểm trung bình của khóa học</h2>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
}
