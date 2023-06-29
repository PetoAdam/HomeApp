import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const LineChart = ({ label, data }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (data.length && canvasRef.current && !chartRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const labels = data.map(item => String(new Date(item.x).getHours()).padStart(2, '0') + ':' + String(new Date(item.x).getMinutes()).padStart(2, '0'));
      const values = data.map(item => ({x: String(new Date(item.x).getHours()).padStart(2, '0') + ':' + String(new Date(item.x).getMinutes()).padStart(2, '0'), y: item.y}));
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: label,
              data: values,
              backgroundColor: '#43a047', // green background
              borderColor: '#009900', // dark green border
              borderWidth: 1
            }
          ]
        },
        options: {
          plugins: {
            title: {
              text: `${label.charAt(0).toUpperCase() + label.slice(1)} Chart`,
              display: true
            }
          },
          scales: {
            y: {
              gridLines: {
                color: '#009900' // dark green grid lines
              },
              ticks: {
                min: 0,
                max: 100,
                color: '#43a047' // green ticks
              }
            }
          }
        }
      });
    }
  }, [data, canvasRef, label]);

  return (
    <div className="lineChart">
      <div className="chart-container">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default LineChart;
