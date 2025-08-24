import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import  axios from 'axios';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const CourseStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
   let BASE_URL = "http://localhost:4000";
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get(BASE_URL+'/courses/stats');
                setStats(data.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load course statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-center py-8">Loading statistics...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    // Prepare data for charts
    const monthlyCourseData = {
        labels: stats.coursesPerMonth.map(item =>
            `${new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' })} ${item._id.year}`
        ),
        datasets: [
            {
                label: 'Courses Created',
                data: stats.coursesPerMonth.map(item => item.count),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const categoryData = {
        labels: stats.coursesByCategory.map(item => item._id),
        datasets: [
            {
                label: 'Courses by Category',
                data: stats.coursesByCategory.map(item => item.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mx-auto py-8 px-4" style={{background:'grey'}}>
            <h1 className="text-3xl font-bold mb-8" style={{backgroundColor:'grey'}}>Course Statistics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Total Courses</h2>
                    <div className="text-4xl font-bold text-purple-600">
                        {stats.totalCourses}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Monthly Course Creation</h2>
                    <div className="h-80">
                        <Line
                            data={monthlyCourseData}
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

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Courses by Category</h2>
                    <div className="h-80">
                        <Pie
                            data={categoryData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Top Rated Courses</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {stats.topRatedCourses.map((course, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{course.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-gray-900">{course.instructor.name}</div>
                                    <div className="text-gray-500">{course.instructor.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className={`text-lg ${i < Math.round(course.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                            >
                          ★
                        </span>
                                        ))}
                                        <span className="ml-2 text-gray-600">
                        {course.rating?.toFixed(1) || '0.0'}
                      </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {course.category}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CourseStats;