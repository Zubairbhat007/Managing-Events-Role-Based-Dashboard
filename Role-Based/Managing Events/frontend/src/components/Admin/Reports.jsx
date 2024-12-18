import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Reports = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        // Fetch the statistics from the backend API
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard/stats', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <p>Loading...</p>;

    // Prepare data for the line chart
    const lineChartData = {
        labels: ['Total Users', 'Total Events', 'Total Registrations', 'Total Open Events'],
        datasets: [
            {
                label: 'Statistics',
                data: [stats.total_users, stats.total_events, stats.total_registrations, stats.total_open_events],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    // Prepare data for the pie chart
    const pieChartData = {
        labels: ['Total Users', 'Total Events', 'Total Registrations', 'Total Open Events'],
        datasets: [
            {
                label: 'Statistics',
                data: [stats.total_users, stats.total_events, stats.total_registrations, stats.total_open_events],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                borderColor: '#fff',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
            <h2>Dashboard Statistics</h2>
            <div style={{ width: '400px', height: '400px' }}>
                <h3>Line Chart</h3>
                <Line data={lineChartData} />
            </div>
            <div style={{ width: '400px', height: '400px' }}>
                <h3>Pie Chart</h3>
                <Pie data={pieChartData} />
            </div>
        </div>
    );
};

export default Reports;
