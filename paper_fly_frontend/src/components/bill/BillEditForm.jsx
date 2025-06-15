import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBillById, calculateBillTotalsAndUpdate } from "../../services/billService";
import { getAllDailyReceivesByBillId } from "../../services/dailyReceiveService";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function BillEditForm() {
    const { id } = useParams();
    const [bill, setBill] = useState(null);
    const [dailyReceives, setDailyReceives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBillData = async () => {
            try {
                setLoading(true);
                const bill_data = await getBillById(id);
                setBill(bill_data);
                const dailyReceivesData = await getAllDailyReceivesByBillId(id);
                setDailyReceives(dailyReceivesData);
            } catch (error) {
                console.error("Failed to fetch bill data", error);
                setError("Failed to fetch bill data");
            } finally {
                setLoading(false);
            }
        };
        fetchBillData();
    }, [id]);

    // Loading Spinner Component
    const LoadingSpinner = () => (
        <div className="flex items-center justify-center min-h-screen">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading bill details...</p>
            </div>
        </div>
    );

    // Error Component
    const ErrorDisplay = ({ message }) => (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
                <p className="text-red-600">{message}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    const calculateTotalCost = (newspapers) => {
        return newspapers.reduce((total, copy) => {
            return total + (copy.soldCopies * copy.newspaper_price);
        }, 0);
    }

    // PDF Download Function using jsPDF
    const handleDownloadPDF = async () => {
        try {
            setLoading(true);
            
            const doc = new jsPDF();
            const totalRevenue = dailyReceives.reduce((total, receive) => 
                total + calculateTotalCost(receive.newspapers), 0
            );

            // Header
            doc.setFontSize(20);
            doc.setFont(undefined, 'bold');
            doc.text('Paper Fly(Ajith Hotel) - Bill Report', 105, 20, { align: 'center' });
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text(`Bill #${bill.id} | Generated on ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
            
            // Draw line
            doc.line(20, 35, 190, 35);

            let yPosition = 50;

            // Bill Information Section
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Bill Information', 20, yPosition);
            
            yPosition += 10;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            
            const billInfo = [
                ['Bill Number:', bill.id.toString()],
                ['Date:', new Date(bill.startDate).toLocaleDateString()],
                ['Initial Cost:', `Rs.${bill.initialCost.toFixed(2)}`],
                ['To be Paid:', `Rs.${bill.payment.toFixed(2)}`],
                ['Profit:', `Rs.${bill.profit.toFixed(2)}`],
                ['Unsold Cost:', `Rs.${bill.unsoldCost.toFixed(2)}`],
                ['Status:', bill.status],
                ['Total Revenue:', `Rs.${totalRevenue.toFixed(2)}`]
            ];

            autoTable(doc, {
                startY: yPosition,
                head: [['Field', 'Value']],
                body: billInfo,
                theme: 'grid',
                headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
                columnStyles: {
                    0: { cellWidth: 40, fontStyle: 'bold' },
                    1: { cellWidth: 50 }
                },
                margin: { left: 20, right: 20 }
            });

            yPosition = doc.lastAutoTable.finalY + 20;

            // Daily Receives Section
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Daily Receives Details', 20, yPosition);
            
            yPosition += 10;

            dailyReceives.forEach((receive, index) => {
                // Check if we need a new page
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }

                // Daily receive header
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                const dateStr = new Date(receive.date).toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                });
                doc.text(dateStr, 20, yPosition);
                
                yPosition += 5;

                // Prepare table data
                const tableData = receive.newspapers.map(copy => [
                    copy.newspaper_name,
                    `Rs.${copy.newspaper_price}`,
                    copy.initialCopies.toString(),
                    copy.soldCopies.toString(),
                    (copy.initialCopies - copy.soldCopies).toString(),
                    `Rs.${(copy.soldCopies * copy.newspaper_price).toFixed(2)}`
                ]);

                // Add daily total row
                const dailyTotal = calculateTotalCost(receive.newspapers);
                tableData.push(['', '', '', '', 'Daily Total:', `Rs.${dailyTotal.toFixed(2)}`]);

                autoTable(doc, {
                    startY: yPosition,
                    head: [['Newspaper', 'Price Each', 'Initial', 'Sold', 'Remaining', 'Revenue']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: { fillColor: [66, 139, 202], textColor: [255, 255, 255] },
                    bodyStyles: { fontSize: 9 },
                    columnStyles: {
                        0: { cellWidth: 35 },
                        1: { cellWidth: 25 },
                        2: { cellWidth: 20 },
                        3: { cellWidth: 20 },
                        4: { cellWidth: 25 },
                        5: { cellWidth: 25 }
                    },
                    margin: { left: 20, right: 20 },
                    didParseCell: function (data) {
                        // Style the total row
                        if (data.row.index === tableData.length - 1) {
                            data.cell.styles.fontStyle = 'bold';
                            data.cell.styles.fillColor = [240, 248, 255];
                        }
                    }
                });

                yPosition = doc.lastAutoTable.finalY + 15;
            });

            // Remaining Newspapers Summary
            if (yPosition > 200) {
                doc.addPage();
                yPosition = 20;
            }

            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Remaining Newspapers Summary', 20, yPosition);
            
            yPosition += 10;

            const priceSummary = {};
            dailyReceives.forEach(receive => {
                receive.newspapers.forEach(copy => {
                    const price = copy.newspaper_price;
                    const remain = copy.initialCopies - copy.soldCopies;
                    if (!priceSummary[price]) {
                        priceSummary[price] = 0;
                    }
                    priceSummary[price] += remain;
                });
            });

            if (Object.keys(priceSummary).length > 0) {
                const summaryData = Object.entries(priceSummary).map(([price, count]) => [
                    `Rs.${price} newspapers`,
                    `${count} copies`
                ]);

                autoTable(doc, {
                    startY: yPosition,
                    head: [['Newspaper Type', 'Remaining Copies']],
                    body: summaryData,
                    theme: 'grid',
                    headStyles: { fillColor: [76, 175, 80], textColor: [255, 255, 255] },
                    margin: { left: 20, right: 20 }
                });

                yPosition = doc.lastAutoTable.finalY + 15;
            } else {
                doc.setFontSize(12);
                doc.setFont(undefined, 'normal');
                doc.text('✓ All newspapers sold!', 20, yPosition);
                yPosition += 15;
            }

            // Final Summary
            if (yPosition > 220) {
                doc.addPage();
                yPosition = 20;
            }

            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Final Summary', 20, yPosition);
            
            yPosition += 10;

            const finalSummary = [
                ['Total Daily Receives:', dailyReceives.length.toString()],
                ['Total Revenue Generated:', `Rs.${totalRevenue.toFixed(2)}`],
                ['Final Profit:', `Rs.${bill.profit.toFixed(2)}`],
                ['Bill Status:', bill.status]
            ];

            autoTable(doc, {
                startY: yPosition,
                body: finalSummary,
                theme: 'plain',
                columnStyles: {
                    0: { cellWidth: 60, fontStyle: 'bold' },
                    1: { cellWidth: 50 }
                },
                margin: { left: 20, right: 20 }
            });

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setFont(undefined, 'normal');
                doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
                doc.text('Generated by Paper Fly Management System(Ajith Hotel)', 105, 285, { align: 'center' });
            }

            // Save the PDF
            doc.save(`Bill_${bill.id}_${new Date(bill.startDate).toISOString().split('T')[0]}.pdf`);
            
        } catch (error) {
            console.error("Failed to generate PDF", error);
            setError("Failed to generate PDF: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateBill = async () => {
        try {
            setLoading(true);
            setError(null);
            if (confirm("Are you sure you want to generate the bill calculation? This will update the bill totals.")) {
                await calculateBillTotalsAndUpdate(id);
                navigate(`/bills/${id}`);
            } else {
                alert("Bill calculation generation cancelled.");
            }
        } catch (error) {
            console.error("Failed to generate bill calculation", error);
            setError("Failed to generate bill calculation");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <ErrorDisplay message={error} />
            ) : (
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">Bill Calculation</h1>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">Bill #{bill.id}</span>
                                {bill.status === 'bill_calculated' && (
                                    <button
                                        onClick={handleDownloadPDF}
                                        disabled={loading}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download PDF
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-gray-600">Review daily receives and generate final bill calculation</p>
                    </div>

                    {/* Bill Summary Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Bill Information
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Initial Cost</span>
                                    <span className="font-semibold text-gray-900">Rs.{bill.initialCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">To be Paid</span>
                                    <span className="font-semibold text-green-600">Rs.{bill.payment.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Date</span>
                                    <span className="font-medium text-gray-900">{new Date(bill.startDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                Financial Summary
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Profit</span>
                                    <span className="font-semibold text-green-600">Rs.{bill.profit.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Unsold Cost</span>
                                    <span className="font-semibold text-red-600">Rs.{bill.unsoldCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center
                                        ${bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                                          bill.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'}`}>
                                        <div className={`w-2 h-2 rounded-full mr-2
                                            ${bill.status === 'paid' ? 'bg-green-500' :
                                              bill.status === 'pending' ? 'bg-yellow-500' :
                                              'bg-red-500'}`}></div>
                                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Daily Receives Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Daily Receives ({dailyReceives.length})
                            </h2>
                        </div>

                        <div className="p-6">
                            {dailyReceives.length > 0 ? (
                                <div className="space-y-6">
                                    {dailyReceives.map((receive) => (
                                        <div key={receive.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                                                <div className="mb-2 sm:mb-0">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {new Date(receive.date).toLocaleDateString('en-US', { 
                                                            weekday: 'long', 
                                                            year: 'numeric', 
                                                            month: 'long', 
                                                            day: 'numeric' 
                                                        })}
                                                    </h3>
                                                </div>
                                                <Link to={`/receive/edit/${receive.id}`}>
                                                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                </Link>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Newspaper</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copies Status</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {receive.newspapers.map((copy, index) => (
                                                            <tr key={index} className="hover:bg-gray-50">
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="font-medium text-gray-900">{copy.newspaper_name}</div>
                                                                    <div className="text-sm text-gray-500">Rs.{copy.newspaper_price} each</div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900">
                                                                        <span className="font-semibold text-red-600">{copy.initialCopies - copy.soldCopies}</span> remaining
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">out of {copy.initialCopies} copies</div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm font-semibold text-green-600">
                                                                        Rs.{(copy.soldCopies * copy.newspaper_price).toFixed(2)}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-blue-900">Daily Total:</span>
                                                    <span className="text-lg font-bold text-blue-900">Rs.{calculateTotalCost(receive.newspapers).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Summary Section */}
                                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Remaining Newspapers Summary
                                        </h3>
                                        {(() => {
                                            const priceSummary = {};
                                            dailyReceives.forEach(receive => {
                                                receive.newspapers.forEach(copy => {
                                                    const price = copy.newspaper_price;
                                                    const remain = copy.initialCopies - copy.soldCopies;
                                                    if (!priceSummary[price]) {
                                                        priceSummary[price] = 0;
                                                    }
                                                    priceSummary[price] += remain;
                                                });
                                            });

                                            return Object.keys(priceSummary).length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {Object.entries(priceSummary).map(([price, count]) => (
                                                        <div key={price} className="bg-white rounded-lg p-3 border border-gray-200">
                                                            <div className="text-sm text-gray-600">Rs.{price} newspapers</div>
                                                            <div className="text-lg font-semibold text-gray-900">{count} copies</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <svg className="w-12 h-12 mx-auto text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="text-green-700 font-medium">All newspapers sold!</p>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Daily Receives</h3>
                                    <p className="text-gray-500">No daily receives found for this bill.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Generate Bill Button */}
                    <div className="mt-8 text-center">
                        {bill.status === 'bill_calculated' ? (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-green-800 mb-2">Bill Calculation Complete</h3>
                                <p className="text-green-600 mb-4">This bill has been calculated and finalized.</p>
                                <button
                                    onClick={handleDownloadPDF}
                                    disabled={loading}
                                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-base font-semibold rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    {loading ? 'Generating...' : 'Download Complete Bill Report'}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleGenerateBill}
                                disabled={loading}
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {loading ? 'Processing...' : 'Generate Final Bill Calculation'}
                            </button>
                        )}
                        <p className="mt-3 text-sm text-gray-500 max-w-md mx-auto">
                            {bill.status === 'bill_calculated' 
                                ? 'Download a comprehensive PDF report of this bill with all details.'
                                : 'This will calculate the final bill totals based on all daily receives and update the bill status.'
                            }
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}