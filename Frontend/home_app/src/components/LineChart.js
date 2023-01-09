import React from 'react';
import { Chart } from 'chart.js/auto';
import './LineChartStyle.css';

class LineChart extends React.Component {
  componentDidUpdate() {
    // Destroy the old chart first
    if (this.chart) {
      this.chart.destroy();
    }

    const { data } = this.props;

    // Extract the labels (timestamps) and data (values) from the data object
    const labels = data.map(item => new Date(item.timestamp).getHours() + ':' + new Date(item.timestamp).getMinutes());
    const values = data.map(item => ({x: new Date(item.timestamp).getHours() + ':' + new Date(item.timestamp).getMinutes(), y: item.value}));

    // Create the chart
    const ctx = document.getElementById('line-chart').getContext('2d');
    this.chart = new Chart(ctx, {
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

  render() {
    return (
      <div className='lineChart'>
        <canvas id="line-chart"></canvas>
      </div>
    );
  }
}

export default LineChart;
