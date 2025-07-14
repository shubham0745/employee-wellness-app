import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

const SeverityPieChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchSeverityData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://employee-wellness-app.onrender.com/api/admin/stats/severity', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChartData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSeverityData();
  }, []);

  const options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
    },
    title: {
      text: 'GAD-7 / PHQ-9 Severity Distribution',
      style: {
        color: '#003366',
        fontWeight: 'bold',
      },
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      enabled: false
    },
    colors: ['#4CAF50', '#FFC107', '#FF7043', '#D32F2F'], // Mild → Severe
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
      },
    },
    series: [
      {
        name: 'Severity',
        colorByPoint: true,
        data: chartData,
      },
    ],
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default SeverityPieChart;
