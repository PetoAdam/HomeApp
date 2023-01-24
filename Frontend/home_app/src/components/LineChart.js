import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import './LineChartStyle.css';

const LineChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null)
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://petonet.ddns.net:5001/api/temperatures/day');
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    };
    fetchData();
  }, []);

  
  useEffect(() => {
    if (data.length && canvasRef.current && !chartRef.current) {
        // Extract the labels (timestamps) and data (values) from the data object
        const labels = data.map(item => String(new Date(item.timestamp).getHours()).padStart(2, '0') + ':' + String(new Date(item.timestamp).getMinutes()).padStart(2, '0'));
        const values = data.map(item => ({x: String(new Date(item.timestamp).getHours()).padStart(2, '0') + ':' + String(new Date(item.timestamp).getMinutes()).padStart(2, '0'), y: item.value}));

        const ctx = canvasRef.current.getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                  label: 'Temperature',
                  data: values,
                  backgroundColor: '#43a047',  // green background
                  borderColor: '#009900',      // dark green border
                  borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    title: {
                    text: 'Temperatures diagram',
                    display: true
                    }
                },
                scales: {
                    y: {
                      gridLines: {
                        color: '#009900',  // dark green grid lines
                      },
                      ticks: {
                        min: 0,
                        max: 100,
                        color: '#43a047',  // green ticks
                      }
                    }
                }
            }
          });
    }
  }, [data, canvasRef]);

  if (error != null){
    return(
      <div>An error occured...</div>
    )
  }
  return (
    <div className='lineChart'>
      <canvas id="line-chart" ref={canvasRef} />
    </div>
  );
  
}

export default LineChart;
