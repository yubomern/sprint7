import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

import { Chart, registerables } from 'chart.js';
import axios from "axios";
Chart.register(...registerables);

const StudentStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    let BASE_URL = "http://localhost:4000";
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get( BASE_URL+'/students/stats');
                setStats(data.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load student statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-center py-8">Loading statistics...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    // Prepare data for charts
    const monthlyStudentData = {
        labels: stats.studentsPerMonth.map(item =>
            `${new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' })} ${item._id.year}`
        ),
        datasets: [
            {
                label: 'Students Registered',
                data: stats.studentsPerMonth.map(item => item.count),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const activeStudentData = {
        labels: stats.activeStudents.map(student => student.name),
        datasets: [
            {
                label: 'Courses Enrolled',
                data: stats.activeStudents.map(student => student.courseCount),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mx-auto py-8 px-4" style={{backgroundColor:'grey'}}>
            <h1 className="text-3xl font-bold mb-8" style={{backgroundColor:'grey'}}>Student Statistics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Total Students</h2>
                    <div className="text-4xl font-bold text-blue-600">
                        {stats.totalStudents}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Monthly Student Registration</h2>
                    <div className="h-80">
                        <Line
                            data={monthlyStudentData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Most Active Students</h2>
                    <div className="h-80">
                        <Bar
                            data={activeStudentData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                    <div className="mt-4">
                        <h3 className="font-medium mb-2">Top Students by Course Enrollment</h3>
                        <ul className="divide-y divide-gray-200">
                            {stats.activeStudents.map((student, index) => (
                                <li key={index} className="py-2 flex justify-between">
                                    <span>{student.name} ({student.email})</span>
                                    <span className="font-medium">{student.courseCount} courses</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentStats;